import type { ComponentType } from "react";

// HOC genérico: agrega una prop nueva { [name]: value } al componente envuelto.
// A diferencia del resto de hoc/* de este ejemplo, no depende de SubmitButtonProps —
// sirve para cualquier componente. `name`/`value` se fijan en un closure al llamar
// withNewProp(...), por eso el WrappedComponent ya no necesita recibir esa prop desde afuera.
export default function withNewProp<K extends string, V>(name: K, value: V) {
    return function <P extends object>(WrappedComponent: ComponentType<P & Record<K, V>>) {
        return function WithNewProp(props: Omit<P & Record<K, V>, K>) {
            return <WrappedComponent {...(props as P & Record<K, V>)} {...({ [name]: value } as Record<K, V>)} />;
        };
    };
}
