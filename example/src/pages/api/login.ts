import { withSessionRoute } from "@/utils/withSession"
import { supportedEvents, zupassPublicKey } from "zuauth"
import { ZKEdDSAEventTicketPCDPackage } from "@pcd/zk-eddsa-event-ticket-pcd"
import { NextApiRequest, NextApiResponse } from "next"

const nullifiers = new Set<string>()

/**
 * The login checks the validity of the PCD, ensures that the ticket
 * is indeed supported by Zupass, and that it has been signed with the correct
 * EdDSA key. The watermark used to create the PCD and as a nonce in the
 * authentication mechanism must be the same as the one in the current session.
 * Once all checks are passed, a user session is created in which the watermark
 * and nullifier are saved.
 */
export default withSessionRoute(async function (req: NextApiRequest, res: NextApiResponse) {
    try {
        if (!req.body.pcd) {
            console.error(`[ERROR] No PCD specified`)

            res.status(400).send("No PCD specified")
            return
        }

        const pcd = await ZKEdDSAEventTicketPCDPackage.deserialize(req.body.pcd)

        if (!(await ZKEdDSAEventTicketPCDPackage.verify(pcd))) {
            console.error(`[ERROR] ZK ticket PCD is not valid`)

            res.status(401).send("ZK ticket PCD is not valid")
            return
        }

        if (zupassPublicKey[0] !== pcd.claim.signer[0] || zupassPublicKey[1] !== pcd.claim.signer[1]) {
            console.error(`[ERROR] PCD is not signed by Zupass`)

            res.status(401).send("PCD is not signed by Zupass")
            return
        }

        if (pcd.claim.watermark.toString() !== req.session.nonce) {
            console.error(`[ERROR] PCD watermark doesn't match`)

            res.status(401).send("PCD watermark doesn't match")
            return
        }

        if (!pcd.claim.nullifierHash) {
            console.error(`[ERROR] PCD ticket nullifier has not been defined`)

            res.status(401).send("PCD ticket nullifer has not been defined")
            return
        }

        if (nullifiers.has(pcd.claim.nullifierHash)) {
            console.error(`[ERROR] PCD ticket has already been used`)

            res.status(401).send("PCD ticket has already been used")
            return
        }

        const eventId = pcd.claim.partialTicket.eventId

        if (eventId) {
            if (!supportedEvents.includes(eventId)) {
                console.error(`[ERROR] PCD ticket has an unsupported event ID: ${eventId}`)

                res.status(400).send("PCD ticket is not for a supported event")
                return
            }
        } else {
            for (const eventId of pcd.claim.validEventIds ?? []) {
                if (!supportedEvents.includes(eventId)) {
                    console.error(`[ERROR] PCD ticket might have an unsupported event ID: ${eventId}`)

                    res.status(400).send("PCD ticket is not restricted to supported events")
                    return
                }
            }
        }

        // The PCD's nullifier is saved so that it prevents the
        // same PCD from being reused for another login.
        nullifiers.add(pcd.claim.nullifierHash)

        // Save the data related to the fields revealed during the generation
        // of the zero-knowledge proof.
        req.session.user = pcd.claim.partialTicket

        await req.session.save()

        res.status(200).send({ ticket: req.session.user })
    } catch (error: any) {
        console.error(`[ERROR] ${error}`)

        res.status(500).send(`Unknown error: ${error.message}`)
    }
})
