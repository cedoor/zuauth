import { withSessionRoute } from "@/utils/withSession"
import { getRandomValues, hexToBigInt, toHexString } from "@pcd/util"
import { NextApiRequest, NextApiResponse } from "next"

/**
 * The nonce is a value used in the authentication mechanism and as a
 * watermark in the EdDSA ticket. This API allows you to
 * generate a random value and save it in the current session.
 * The same nonce will be used by the user for generating the PCD ticket
 * on the client side and must correspond to the one stored in
 * the session in the subsequent API call for the login process.
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
