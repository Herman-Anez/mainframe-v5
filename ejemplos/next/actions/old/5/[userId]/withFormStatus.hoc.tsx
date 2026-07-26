'use client'

import { useFormStatus } from "react-dom";
import { ComponentType } from "react";
import { SubmitButtonProps } from "./submitButton.component";

// useFormStatus DEBE llamarse dentro de un componente que renderiza dentro de <form>
export default function withFormStatus(WrappedComponent: ComponentType<SubmitButtonProps>) {
    return function WithFormStatus() {
        const { pending } = useFormStatus();
        return <WrappedComponent pending={pending} />
    }
}






