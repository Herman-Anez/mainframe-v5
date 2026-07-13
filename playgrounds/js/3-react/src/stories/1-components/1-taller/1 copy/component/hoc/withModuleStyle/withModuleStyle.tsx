import type { ComponentType } from "react";
import cssModule from "./ejemplo.module.css";
import type { ExampleComponentProps } from "../../ejemplo.component";

// HOC: inyecta `styles`, ya sea el objeto recibido o (por defecto) el css module importado

export default function withModuleStyle<P extends ExampleComponentProps>(
    WrappedComponent: ComponentType<P>,
    styles: typeof cssModule = cssModule,
) {
    return function WithModuleStyle(props: Omit<P, 'styles'>) {
        return <WrappedComponent {...(props as P)} styles={styles} />;
    }
}
