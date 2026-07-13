import type { ComponentType } from "react";
import type { ExampleComponentProps } from "../../ejemplo.component";

// HOC: inyecta `styles.button` leyendo el css module, WrappedComponent no conoce el origen
export default function withExtraText<P extends ExampleComponentProps>(
    WrappedComponent: ComponentType<P>
) {
    return function WithLoading(props: P) {
        const { flag1 } = props;
        return (
            <>
                {flag1 && <p>flag1</p>}
                <WrappedComponent {...props} />
            </>
        );
    }
}