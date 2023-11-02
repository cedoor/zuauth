import { useZupassPopupMessages } from "../passport-interface/PassportPopup"
import { openZKEdDSAEventTicketPopup, parseSerializedPCD } from "../utils"

export default function useZuAuth(): {
    authenticate: typeof openZKEdDSAEventTicketPopup
    pcd?: string
} {
    const [serializedPCD] = useZupassPopupMessages()

    return { authenticate: openZKEdDSAEventTicketPopup, pcd: parseSerializedPCD(serializedPCD) }
}
