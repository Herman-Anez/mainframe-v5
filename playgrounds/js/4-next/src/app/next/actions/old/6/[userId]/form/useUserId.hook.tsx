'use client'

import { updateNameAction } from "../actions";
import { useActionState, useEffect, useRef } from "react";

// Custom hook: encapsula estado y lógica del form, NO retorna JSX
export default function useUserId({ userId }: { userId: string }) {
    const formRef = useRef<HTMLFormElement>(null)
    const [state, action] = useActionState(updateNameAction, {
        userId,
        name: "",
        message: "",
    });

    useEffect(() => {
        if (state.message === "success") {
            formRef.current?.reset()
        }
    }, [state.message])

    return { formRef, state, action }
}

