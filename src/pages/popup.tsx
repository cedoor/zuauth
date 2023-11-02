import { useZupassPopupSetup } from "@/zu-auth/passport-interface/PassportPopup"

/**
 * This popup sends requests and receives PCDs from the passport.
 */
export default function PassportPopupRedirect() {
    const error = useZupassPopupSetup()

    return <div>{error}</div>
}
