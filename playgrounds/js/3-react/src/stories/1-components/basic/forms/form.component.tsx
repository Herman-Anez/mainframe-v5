'use client'

import { RefObject } from "react";
import withFormStatus from "../basic/buttons/submit/withFormStatus.hoc";
import SubmitButton from "../basic/buttons/submit/submitButton.component";

export type FormState = {
    userId: string;
    name: string;
    message: string;
}

export type FormProps = {
    userId: string;
    formRef: RefObject<HTMLFormElement | null>;
    state: FormState;
    action: (payload: FormData) => void;
}


const HocSubmitButton = withFormStatus(SubmitButton);


export default function Form({ formRef, state, action }: FormProps) {
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
            <HocSubmitButton />
        </form>
    )
}
