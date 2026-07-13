//HOC de tipo 2 que inyecta una variable nueva a un componente

//* inyecta variable nueva extraText y añade un <p>
import type { FC } from "react";
/*1*/
type WithOptionalExtraTextNewProps = {
    extraText?: string; // opcional
};
/*1*/
export default function withOptionalExtraText<P extends object>(
    WrappedComponent: /*2*/ FC<P> /*2*/,
): /*3*/ FC<P & WithOptionalExtraTextNewProps> /*3*/ {
    /*4*/ return function withExtraText(
        props: P & WithOptionalExtraTextNewProps,
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

// import { Component } from "../../ejemplo.component";
// withOptionalExtraText(Component)({}); //true

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
