"use client"

import { useZupass } from "@/zupass"
import React from "react"

export default function ZuAuthButton({ onAuth }: { onAuth: () => void }) {
    const { login } = useZupass({ onAuth })

    return (
        <button
            className="rounded border-1 border-solid ring-1 ring-slate-500 border-slate-200 bg-slate-700 text-slate-100 hover:bg-slate-800 py-1 px-4"
            onClick={login}
        >
            Login
        </button>
    )
}
