import "iron-session"

declare module "iron-session" {
    interface IronSessionData {
        nonce?: string
        user?: Record<string, any>
    }
}
