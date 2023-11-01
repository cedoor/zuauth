import { supportedEvents } from "@/config/zupass"
import { withSessionRoute } from "@/utils/withSession"
import { ZKEdDSAEventTicketPCDPackage } from "@pcd/zk-eddsa-event-ticket-pcd"
import { NextApiRequest } from "next"

const nullifiers = new Set<string>()

/**
 * The login checks the validity of the PCD, ensures that the ticket
 * is indeed supported by Zupass, and that it has been signed with the correct
 * EdDSA key. The watermark used to create the PCD and as a nonce in the
 * authentication mechanism must be the same as the one in the current session.
 * Once all checks are passed, a user session is created in which the watermark
 * and nullifier are saved.
 */
export const POST = withSessionRoute(async function (req: NextApiRequest) {
    try {
        if (!req.body.pcd) {
            console.error(`[ERROR] No PCD specified`)

            return new Response("No PCD specified", { status: 400 })
        }

        const pcd = await ZKEdDSAEventTicketPCDPackage.deserialize(req.body.pcd)

        if (!(await ZKEdDSAEventTicketPCDPackage.verify(pcd))) {
            console.error(`[ERROR] ZK ticket PCD is not valid`)

            return new Response("ZK ticket PCD is not valid", { status: 401 })
        }

        if (pcd.claim.watermark.toString() !== req.session.nonce) {
            console.error(`[ERROR] PCD watermark doesn't match`)

            return new Response("PCD watermark doesn't match", { status: 401 })
        }

        if (!pcd.claim.nullifierHash) {
            console.error(`[ERROR] PCD ticket nullifier has not been defined`)

            return new Response("PCD ticket nullifier has not been defined", { status: 401 })
        }

        if (nullifiers.has(pcd.claim.nullifierHash)) {
            console.error(`[ERROR] PCD ticket has already been used`)

            return new Response("PCD ticket has already been used", { status: 401 })
        }

        const eventId = pcd.claim.partialTicket.eventId

        if (eventId) {
            if (!supportedEvents.includes(eventId)) {
                console.error(`[ERROR] PCD ticket has an unsupported event ID: ${eventId}`)

                return new Response(`PCD ticket has an unsupported event ID: ${eventId}`, { status: 400 })
            }
        } else {
            for (const eventId of pcd.claim.validEventIds ?? []) {
                if (!supportedEvents.includes(eventId)) {
                    console.error(`[ERROR] PCD ticket might have an unsupported event ID: ${eventId}`)

                    return new Response("PCD ticket is not restricted to supported events", { status: 400 })
                }
            }
        }

        // The PCD's nullifier is saved so that it prevents the
        // same PCD from being reused for another login.
        nullifiers.add(pcd.claim.nullifierHash)

        // Save the data related to the fields revealed during the generation
        // of the zero-knowledge proof.
        req.session.ticket = pcd.claim.partialTicket

        await req.session.save()

        return Response.json({ data: req.session.ticket })
    } catch (error: any) {
        console.error(`[ERROR] ${error}`)

        return new Response(`Unknown error: ${error.message}`, { status: 500 })
    }
})
