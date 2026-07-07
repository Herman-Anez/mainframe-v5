'use client'

import { updateNameAction } from "./actios";
import { useActionState, useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";

export default function Form({ userId }: { userId: string }) {
    const formRef = useRef<HTMLFormElement>(null)
    const [state, action] = useActionState(updateNameAction, {
        userId: userId,
        name: "",
        message: "",
    });

    useEffect(() => {
        if (state.message === "success") {
            formRef.current?.reset()
        }
    }, [state.message])

    return (
        <form ref={formRef} action={action} className="flex flex-col gap-3 w-full max-w-sm">
            <input
                type="text"
                name="name"
                placeholder="Nuevo nombre..."
                className="border border-zinc-300 dark:border-zinc-700 rounded-lg px-4 py-2 text-sm bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {state.message && (
                <p className={`text-sm ${state.message === "success" ? "text-green-600" : "text-red-500"}`}>
                    {state.message}
                </p>
            )}
            <SubmitButton />
        </form>
    )
}

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <button
            disabled={pending}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
            {pending ? "guardando..." : "guardar"}
        </button>
    )
}
