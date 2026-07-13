'use client'

import type { ComponentType } from "react";
import { useFormStatus } from "react-dom";
import type { SubmitButtonProps } from "../../submitButton.component";

// useFormStatus DEBE llamarse dentro de un componente que renderiza dentro de <form>
// HOC: inyecta `pending` leyendo useFormStatus (requiere estar dentro de <form>)
// Patrón: withX(Component) → Component sin necesidad de pasarle `pending`
export default function withFormStatus(
    WrappedComponent: ComponentType<SubmitButtonProps>
) {
    return function WithFormStatus() {
        const { pending } = useFormStatus();
        return <WrappedComponent pending={pending} />;
    }
}
