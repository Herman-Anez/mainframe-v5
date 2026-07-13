import type { ComponentType } from "react";
import type { SubmitButtonProps } from "../../submitButton.component";

// Variante ESPECIALIZADA de withNewProp.tsx: mismo objetivo (agregar una prop nueva
// parametrizada), pero atada a SubmitButtonProps como el resto de hoc/* de este ejemplo
// (withLoading, withFormStatus, withModuleStyle...), en vez de ser 100% genérica.
//
// Comparar con withNewProp.tsx:
//  - withNewProp.tsx (genérico): P extends object -> funciona con CUALQUIER componente,
//    reusable fuera de este proyecto, pero no se puede sumar a submitButton.factory.tsx
//    (esa clase está tipada contra SubmitButtonProps en toda la cadena).
//  - esta versión: P extends SubmitButtonProps -> solo funciona con componentes que ya
//    cumplen ese contrato, pero se puede agregar directo como método a ComponentFactory,
//    igual que withStyles/withModuleStyle/withLoading.
export default function withNewPropForSubmitButton<K extends string, V>(name: K, value: V) {
    return function <P extends SubmitButtonProps>(WrappedComponent: ComponentType<P & Record<K, V>>) {
        return function WithNewProp(props: Omit<P & Record<K, V>, K>) {
            return <WrappedComponent {...(props as P & Record<K, V>)} {...({ [name]: value } as Record<K, V>)} />;
        };
    };
}
