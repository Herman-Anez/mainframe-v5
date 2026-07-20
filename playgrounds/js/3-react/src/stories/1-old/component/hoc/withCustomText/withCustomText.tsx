import type { ComponentType } from "react";

// Hoc de tipo 1.1.3 que secuestra los parametros text y flag
//Durante la creacion puedes pasarle un objeto con valores nuevos o usara unos por defecto
// El componente resultante ya no tiene control sobre text y flag1

/*1*/
type InjectedProps = {
    text: string;
    flag1: boolean;
};
/*1*/

/*2*/
type HocProps = Partial<InjectedProps>;
/*2*/
export default function withCustomText({
    text = "default text", //!Por defecto si no se dan valores
    flag1 = true, //!
}: HocProps) {
    return function withCustomText<P>(
        WrappedComponent: /*3*/ ComponentType<P & InjectedProps> /*3*/,
    ) {
        return function withCustomText(
            /*4*/ props: Omit<P, keyof InjectedProps> /*4*/,
        ) {
            return (
                <>
                    <WrappedComponent
                        {...(props as P)}
                        flag1={flag1} //! Se inyectan los valores
                        text={text} //! Se inyectan los valores
                    />
                </>
            );
        };
    };
}
/*1*/
//* Tipado de las propiedades
//? Props que el HOC inyecta (obligatorias para el componente envuelto)
/*
type InjectedProps = {
    styles: CSSModuleClasses;
};
*/
/*1*/
//* Tipado de las propiedades
//? Props que el HOC inyecta (obligatorias para el componente envuelto)
/*
type InjectedProps = {
    styles: CSSModuleClasses;
};
*/

/*2*/
//* Objeto de entrada del HOC, una implementacion parcial del las propiedades inyectadas
/*
type HocProps = Partial<InjectedProps>;
*/

/*3*/
//* Se obliga a usar un componente que tenga los atributos
/*
ComponentType<P & InjectedProps>,
*/

/*4*/
//* Se omiten los atributos secuestrados
/*
props: Omit<P, keyof InjectedProps>
*/
