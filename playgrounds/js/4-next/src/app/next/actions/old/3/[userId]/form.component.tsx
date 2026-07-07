'use client'

import { RefObject} from "react";
import SubmitButton from "./submitButton.component";

type FormState = {
    userId: string,
    name: string,
    message: string,
}

type FormProps = {
    userId: string;
    formRef: RefObject<HTMLFormElement | null>;
    state: FormState;
    action: (payload: FormData) => void
    pending:boolean
}



export default function Form({ formRef, state,action,pending }: FormProps) {


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
            <SubmitButton pending={pending} />
        </form>
    )
}
