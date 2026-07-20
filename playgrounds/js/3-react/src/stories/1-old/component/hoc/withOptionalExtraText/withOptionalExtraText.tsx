//HOC de tipo 2 que inyecta una variable nueva a un componente

//* inyecta variable nueva extraText y añade un <p>
import type { FC } from "react";
/*1*/
type NewProps = {
    extraText?: string; // opcional
};
/*1*/

// Tipo que prohíbe que P tenga alguna de las claves de U
type WithoutKeys<U> = {
    [K in keyof U]?: never;
};

export default function withOptionalExtraText/*2*/ <
    P extends object & WithoutKeys<NewProps>,
> /*2*/(
    WrappedComponent: /*3*/ FC<P> /*3*/,
): /*4*/ FC<P & NewProps> /*4*/ {
    /*4*/ return function withExtraText(
        props: P & NewProps,
    ) /*4*/ {
        const { extraText, ...rest } = props;
        return (
            <>
                {extraText && <p>{extraText}</p>}
                <WrappedComponent {...(rest as P)} />
            </>
        );
    };
}

// import { Component, Component1 } from "../../ejemplo.component";
// withOptionalExtraText(Component)({}); //true
// withOptionalExtraText(Component1); //true

/*1*/ // *  Definimos la variable que vamos a meter
/*
    type withOptionalExtraText = {
       extraText?: string; // opcional
    };
*/

/*2*/ // *  Especificamos que el componente no tiene esa variable
/*
WrappedComponent: ComponentType<Omit<P, keyof WithOptionalExtraTextNewProps>>,
*/

/*3*/ //* Definimos que retornamos un componente que ahora necesita esa variable
//$ FC (no ComponentType) porque el valor real siempre es funcion, no clase
/*
FC<P & WithOptionalExtraTextNewProps>
*/

/*4*/ //* Definimos que el nuevo componente de entrada necesita este parametro nuevo
/*
return function withExtraText(props: P & WithOptionalExtraTextNewProps)
*/
