import { withSessionRoute } from "@/utils/withSession"
import { getRandomValues, hexToBigInt, toHexString } from "@pcd/util"
import { NextApiRequest } from "next"

/**
 * The nonce is a value used in the EdDSA ticket and as a watermark
 * in the ZK ticket authentication mechanism. This API allows you to
 * generate a random value and save it in the current session.
 * The same nonce will be used by the user for generating the PCD ticket
 * on the client side and must correspond to the one stored in
 * the session in the subsequent API call for the login process.
 */
export const POST = withSessionRoute(async function (req: NextApiRequest) {
    try {
        req.session.nonce = hexToBigInt(toHexString(getRandomValues(30))).toString()

        await req.session.save()

        return Response.json({ data: req.session.nonce })
    } catch (error: any) {
        console.error(`[ERROR] ${error}`)

        return new Response(`Unknown error: ${error.message}`, { status: 500 })
    }
})
