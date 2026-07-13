import type { ComponentType } from "react";
import cssModule from "./submitButton.module.css";
import type { SubmitButtonProps } from "../../submitButton.component";

// HOC: inyecta `styles.button` leyendo el css module, WrappedComponent no conoce el origen
export default function withModuleStyle<P extends SubmitButtonProps>(
    WrappedComponent: ComponentType<P>
) {
    return function WithModuleStyle(props: Omit<P, 'styles'>) {
        return <WrappedComponent {...(props as P)} styles={cssModule} />;
    }
}
