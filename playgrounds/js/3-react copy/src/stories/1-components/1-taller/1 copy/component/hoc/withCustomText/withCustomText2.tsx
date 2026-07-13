'use client'

import type { ComponentType } from "react";
import Component from "../../ejemplo.component";

export default function withCustomText<P>(
    WrappedComponent: ComponentType<P>
) {
    //Se devuelve un componente que no utiliza esas variables
    return function WithCustomText(props: Omit<P, 'flag1' | 'text'>) {
        return <WrappedComponent {...(props as P)} flag1 text={"trigger"} />;
    }
}

withCustomText(Component)({styles:{texto:"asd"}})