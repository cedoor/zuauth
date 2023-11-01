import "iron-session"

declare module "iron-session" {
    interface IronSessionData {
        nonce?: string
        ticket?: Record<string, any>
    }
}
