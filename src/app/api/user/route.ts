import { withSessionRoute } from "@/utils/withSession"
import { NextApiRequest } from "next"

export const GET = withSessionRoute(function (req: NextApiRequest) {
    return Response.json({ data: req.session.ticket || false })
})
