import axios from "axios"
import Head from "next/head"
import Image from "next/image"
import { useCallback, useEffect, useState } from "react"
import { useZuAuth } from "zuauth"
import { EdDSATicketFieldsToReveal } from "@pcd/zk-eddsa-event-ticket-pcd"
import TicketFieldsToRevealGrid from "@/components/TicketFieldsToReveal"
import Toggle from "@/components/Toggle"
import RevealedFieldsInfo from "@/components/TicketRevealedFieldsInfo"

export default function Home() {
    const { authenticate, pcd } = useZuAuth()
    const [user, setUser] = useState<any>()
    const [developerMode, setDeveloperMode] = useState(false);
    const [ticketFieldsToReveal, setTicketFieldsToReveal] = useState<EdDSATicketFieldsToReveal>({
        revealTicketId: false,
        revealEventId: true,
        revealProductId: true,
        revealTimestampConsumed: false,
        revealTimestampSigned: false,
        revealAttendeeSemaphoreId: false,
        revealIsConsumed: false,
        revealIsRevoked: false,
        revealTicketCategory: false,
        revealAttendeeEmail: true,
        revealAttendeeName: false
    });

    const handleToggleField = (fieldName: keyof EdDSATicketFieldsToReveal) => {
        setTicketFieldsToReveal((prevState: EdDSATicketFieldsToReveal) => {
            const revealedFields = {
                ...prevState,
                [fieldName]: !prevState[fieldName]
            };

            localStorage.setItem("ticketFieldsToReveal", JSON.stringify(revealedFields));

            return revealedFields;
        });
    };

    const handleSetDeveloperMode = () => {
        setDeveloperMode((value: boolean) => {
            localStorage.setItem("developerMode", JSON.stringify(!value))

            if (!value === true) {
                localStorage.setItem("ticketFieldsToReveal", JSON.stringify(ticketFieldsToReveal));
            } else {
                setTicketFieldsToReveal({
                    revealTicketId: false,
                    revealEventId: true,
                    revealProductId: true,
                    revealTimestampConsumed: false,
                    revealTimestampSigned: false,
                    revealAttendeeSemaphoreId: false,
                    revealIsConsumed: false,
                    revealIsRevoked: false,
                    revealTicketCategory: false,
                    revealAttendeeEmail: true,
                    revealAttendeeName: false
                })
        
                localStorage.removeItem("ticketFieldsToReveal")
            }
            return !value
        })
    }

    // Every time the page loads, an API call is made to check if the
    // user is logged in and, if they are, to retrieve the current session's user data.
    useEffect(() => {
        ; (async function () {
            const { data } = await axios.get("/api/user")
            setUser(data.user)

            const savedFields = localStorage.getItem("ticketFieldsToReveal");
            if (savedFields) {
                setTicketFieldsToReveal(JSON.parse(savedFields));
            }

            const developerMode = localStorage.getItem("developerMode")
            if (developerMode) {
                setDeveloperMode(JSON.parse(developerMode))
            }
        })()
    }, [])

    // Before logging in, the PCD is generated with the nonce from the
    // session created on the server.
    // Note that the nonce is used as a watermark for the PCD. Therefore,
    // it will be necessary on the server side to verify that the PCD's
    // watermark matches the session nonce.
    const login = async () => {
        const { data } = await axios.post("/api/nonce")

        authenticate(
            developerMode ? { ...ticketFieldsToReveal } : {
                revealAttendeeEmail: true,
                revealEventId: true,
                revealProductId: true
            },
            data.nonce
        )
    }

    // When the popup is closed and the user successfully
    // generates the PCD, they can login.
    useEffect(() => {
        ; (async function () {
            if (pcd) {
                const { data } = await axios.post("/api/login", { pcd })

                setUser(data.user)
            }
        })()
    }, [pcd])

    // Logging out simply clears the active session.
    const logout = async () => {

        await axios.post("/api/logout")

        localStorage.removeItem("ticketFieldsToReveal")
        localStorage.removeItem("developerMode")

        setTicketFieldsToReveal({
            revealTicketId: false,
            revealEventId: true,
            revealProductId: true,
            revealTimestampConsumed: false,
            revealTimestampSigned: false,
            revealAttendeeSemaphoreId: false,
            revealIsConsumed: false,
            revealIsRevoked: false,
            revealTicketCategory: false,
            revealAttendeeEmail: true,
            revealAttendeeName: false
        })
        setDeveloperMode(false)

        setUser(false)
    }

    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-12 pb-32">
            <Head>
                <title>ZuAuth Example</title>
                <link rel="icon" type="image/x-icon" href="/favicon.ico" />
            </Head>
            <div className="max-w-4xl w-full mx-auto">
                <div className="flex justify-center">
                    <Image width="150" height="150" alt="ZuAuth Icon" src="/light-icon.png" />
                </div>

                <h1 className="my-4 text-2xl font-semibold text-center">
                    ZuAuth Example
                </h1>

                <div className="text-center">

                </div>

                <p className="my-8 text-justify">
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
                        href="https://github.com/cedoor/zuauth#readme"
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

                {!user &&
                    <>
                        <div className="my-8 text-center flex flex-col items-center">
                            <p className="mt-2 text-center">Developer Mode</p>
                            <Toggle
                                checked={developerMode}
                                onToggle={handleSetDeveloperMode}
                            />
                        </div>

                        <div style={{ height: "300px" }}>
                            {developerMode && (
                                <TicketFieldsToRevealGrid
                                    ticketFieldsToReveal={ticketFieldsToReveal}
                                    onToggleField={handleToggleField}
                                    disabled={!!user}
                                />
                            )}
                        </div>
                    </>
                }

                {user && <div className="my-8 text-center">
                    <RevealedFieldsInfo user={user} revealedFields={ticketFieldsToReveal} /> </div>}
            </div>
        </main >
    )
}
