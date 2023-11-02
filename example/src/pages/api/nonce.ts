import { withSessionRoute } from "@/utils/withSession"
import { getRandomValues, hexToBigInt, toHexString } from "@pcd/util"
import { NextApiRequest, NextApiResponse } from "next"

/**
 * The nonce is a value used in the authentication mechanism and as a
 * watermark in the EdDSA ticket. Its value is generated randomly and saved
 * in the current session.
 */
export default withSessionRoute(async function (req: NextApiRequest, res: NextApiResponse) {
    try {
        req.session.nonce = hexToBigInt(toHexString(getRandomValues(30))).toString()

        await req.session.save()

        res.status(200).send({
            nonce: req.session.nonce
        })
    } catch (error: any) {
        console.error(`[ERROR] ${error}`)

        res.status(500).send(`Unknown error: ${error.message}`)
    }
})
