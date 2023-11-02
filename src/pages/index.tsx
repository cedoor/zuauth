import useZuAuth from "@/zu-auth/hooks/useZuAuth"
import axios from "axios"
import Head from "next/head"
import { useCallback, useEffect, useState } from "react"

export default function Home() {
    const { authenticate, pcd } = useZuAuth()
    const [user, setUser] = useState<any>()

    useEffect(() => {
        ;(async function () {
            const { data } = await axios.get("/api/user")

            setUser(data.ticket)
        })()
    }, [])

    useEffect(() => {
        ;(async function () {
            if (pcd) {
                const { data } = await axios.post("/api/login", { pcd })

                setUser(data.ticket)
            }
        })()
    }, [pcd])

    const logout = useCallback(async () => {
        await axios.post("/api/logout")

        setUser(false)
    }, [])

    const login = useCallback(async () => {
        const { data } = await axios.post("/api/nonce")

        authenticate(
            {
                revealAttendeeEmail: true,
                revealEventId: true,
                revealProductId: true
            },
            data.nonce
        )
    }, [authenticate])

    // TODO
    // - ulteriore refactoring pacchetto
    // - isolamento pacchetto npm
    // - deploy app
    // - readme file

    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-12 pb-32">
            <Head>
                <title>ZuAuth Example</title>
            </Head>
            <div className="max-w-xl w-full">
                <h1 className="my-8 text-2xl font-semibold text-center">Login</h1>

                <p className="text-justify">
                    This demo illustrates how the{" "}
                    <a
                        className="text-blue-600 visited:text-purple-600"
                        href="http://npmjs.com/package/zuauth"
                        target="_blank"
                    >
                        <b>zuauth</b>
                    </a>{" "}
                    NPM package can be used in a simple authentication system with{" "}
                    <a className="text-blue-600 visited:text-purple-600" href="https://nextjs.org/" target="_blank">
                        NextJS
                    </a>{" "}
                    and{" "}
                    <a
                        className="text-blue-600 visited:text-purple-600"
                        href="https://github.com/vvo/iron-session"
                        target="_blank"
                    >
                        IronSession
                    </a>
                    . Check the{" "}
                    <a
                        className="text-blue-600 visited:text-purple-600"
                        href="https://github.com/cedoor/zu-auth#readme"
                        target="_blank"
                    >
                        README file
                    </a>{" "}
                    in the repository to learn more about the code.
                </p>

                <div className="my-8 text-center">
                    <button
                        className="bg-blue-800 hover:bg-blue-900 text-white font-bold py-2 px-4 rounded"
                        onClick={!user ? login : logout}
                    >
                        {!user ? "Login" : "Log out"}
                    </button>
                </div>

                {user && <div className="text-center">User: {user.attendeeEmail}</div>}

                <div className="mt-10 text-center">
                    <a href="https://github.com/cedoor/zu-auth" className="underline" target="_blank">
                        Github
                    </a>
                </div>
            </div>
        </main>
    )
}
