'use client'

import { updateNameAction } from "./actios";
import { useActionState, useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";
import Form from "./form.component";

// type FormState = {
//     userId: string,
//     name: string,
//     message: string,
// }


export default function HogForm({ userId }: { userId: string }) {
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

    const { pending } = useFormStatus();

    const formProps = {
        userId,
        formRef,
        state,
        action,
        pending
    }
    return (
        <Form {...formProps} ></Form>
    )
}

