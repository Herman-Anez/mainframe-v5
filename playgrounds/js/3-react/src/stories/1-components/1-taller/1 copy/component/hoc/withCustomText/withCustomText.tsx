'use client'

import type { ComponentType } from "react";
import type { ExampleComponentProps } from "../../ejemplo.component";

export default function withCustomText<P extends ExampleComponentProps>(
    WrappedComponent: ComponentType<P>
) {
    //Se devuelve un componente que no utiliza esas variables
    return function WithCustomText(props: Omit<P, 'flag1' | 'text'>) {
        return <WrappedComponent {...(props as P)} flag1 text={"trigger"} />;
    }
}
