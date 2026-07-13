'use client'

import type { ComponentType } from "react";
import { useFakePending } from "./useFakePending.hook";
import type { SubmitButtonProps } from "../../submitButton.component";

// HOC: inyecta `pending` simulado (3s) + `onClick` que lo dispara
// No requiere <form> ni useFormStatus, sirve para probar UI de pending fuera de un form
export default function withFakeStatus<P extends SubmitButtonProps>(
    WrappedComponent: ComponentType<P>
) {
    return function WithFakeStatus(props: Omit<P, 'pending' | 'onClick'>) {
        const { pending, trigger } = useFakePending(1000);
        return <WrappedComponent {...(props as P)} pending={pending} onClick={trigger} />;
    }
}
