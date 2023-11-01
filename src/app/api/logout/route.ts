import { withSessionRoute } from "@/utils/withSession"
import { NextApiRequest } from "next"

export const POST = withSessionRoute(function (req: NextApiRequest) {
    try {
        req.session.destroy()

        return Response.json({ ok: true })
    } catch (error: any) {
        console.error(`[ERROR] ${error}`)

        return new Response(`Unknown error: ${error.message}`, { status: 500 })
    }
})
