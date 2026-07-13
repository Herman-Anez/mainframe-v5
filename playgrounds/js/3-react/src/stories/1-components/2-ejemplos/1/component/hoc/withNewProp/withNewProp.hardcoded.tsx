import type { ComponentType } from "react";

// Variante HARDCODEADA de withNewProp.tsx: mismo objetivo (agregar una prop nueva
// al componente envuelto), pero nombre y valor quedan fijos acá adentro ("extra" = "hola"),
// sin parámetros ni generics K/V.
//
// Comparar con withNewProp.tsx:
//  - withNewProp("nombre", valor)(Component)  -> un solo HOC, reusable para cualquier prop
//  - withExtraProp(Component)                 -> un HOC por cada prop que quieras agregar,
//    pero la firma es más simple de leer (menos generics)
export default function withExtraProp<P extends object>(
    WrappedComponent: ComponentType<P & { extra: string }>
) {
    return function WithExtraProp(props: P) {
        return <WrappedComponent {...props} extra="hola" />;
    };
}
