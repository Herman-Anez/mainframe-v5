//Hoc Tipo 1.1.3
import type { ComponentType } from "react";
import defaultStyles from "./ejemplo.module.css";

/*1*/
type OverLoadProps = {
    styles: CSSModuleClasses;
};
/*1*/

/*2*/
type HocProps = Partial<OverLoadProps>;
/*2*/

export default function withModuleStyl({ styles }: HocProps) {
    styles = styles ?? defaultStyles;
    // El componente resultante recibe todas las props de P excepto 'styles'
    return function withModuleStyle/*3*/ <P extends OverLoadProps> /*3*/(
        WrappedComponent: ComponentType<P>,
    ) {
        // El componente resultante recibe todas las props de P excepto 'styles'
        return function WithModuleStyle(
            props: /*4*/ Omit<P, keyof OverLoadProps> /*4*/,
        ) {
            // Inyectamos styles y pasamos el resto de props
            return <WrappedComponent {...(props as P)} styles={styles} />;
        };
    };
}

// import  {Component1, Component}  from "../../ejemplo.component";
// withModuleStyl({})(Component); //true
// withModuleStyl({})(Component1)(); //false


/*1*/
//* Tipado de las propiedades
//? Props que el HOC inyecta (obligatorias para el componente envuelto)
/*
type OverLoadProps = {
    styles: CSSModuleClasses;
};
*/

/*2*/
//type HocProps = Partial<OverLoadProps>;
//* Objeto de entrada del HOC, una implementacion parcial del las propiedades inyectadas
//$ necesarios para componentes de tipo 1.3 permite que el objeto sea opcional

/*3*/
/*
/<P extends OverLoadProps>
*/
//* Se obliga a usar un componente que tenga los atributos

/*4*/
//* Se omiten los atributos secuestrados
/*
props: Omit<P, keyof OverLoadProps>
*/
