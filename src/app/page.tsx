"use client"

import ZuAuthButton from "@/components/ZuAuthButton"
import Head from "next/head"
import { useRouter } from "next/navigation"
import { useCallback, useEffect, useState } from "react"

export default function Home() {
    const router = useRouter()
    const [ticket, setTicket] = useState<any>()

    useEffect(() => {
        ;(async function () {
            const response = await fetch("/api/user", { credentials: "include" })
            const { data } = await response.json()

            setTicket(data)
        })()
    }, [])

    const logout = useCallback(async () => {
        await fetch("/api/logout")
        router.refresh()
    }, [router])

    const onAuth = useCallback(() => {
        router.refresh()
    }, [router])

    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <Head>
                <title>Zupass Auth Example</title>
            </Head>
            <div className="max-w-xl w-full">
                <h1 className="my-8 text-xl font-semibold">Login Example</h1>
                <div className="my-8">
                    {!ticket && <ZuAuthButton onAuth={onAuth} />}

                    {ticket && (
                        <button
                            className="rounded border-1 border-solid ring-1 ring-slate-500 border-slate-200 bg-slate-700 text-slate-100 hover:bg-slate-800 py-1 px-4"
                            onClick={logout}
                        >
                            Log out
                        </button>
                    )}
                </div>
                <div>User: {JSON.stringify(ticket)}</div>
                <div className="mt-20">
                    <a href="https://github.com/robknight/zuauth-next" className="underline">
                        Source
                    </a>
                </div>
            </div>
        </main>
    )
}
