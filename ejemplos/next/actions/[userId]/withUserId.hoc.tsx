'use client'

import { ComponentType } from "react";
import useUserId from "./useUserId.hook";
import { FormProps } from "@components/forms/form.component";

// HOC: función que recibe un componente y retorna uno nuevo con props inyectadas
// Patrón: withX(Component) → Component que solo necesita userId
export default function withUserId(WrappedComponent: ComponentType<FormProps>) {
    return function WithUserId({ userId }: { userId: string }) {
        const { formRef, state, action } = useUserId({ userId });
        return <WrappedComponent userId={userId} formRef={formRef} state={state} action={action} />;
    }
}



