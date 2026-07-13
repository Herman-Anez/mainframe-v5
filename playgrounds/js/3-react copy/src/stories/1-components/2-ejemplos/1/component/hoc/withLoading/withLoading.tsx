import type { ComponentType } from "react";
import type { SubmitButtonProps } from "../../submitButton.component";

// HOC: intercepta `pending` recibido por props y renderiza <p>pending</p> arriba del WrappedComponent
// No lee el estado, solo lo intercepta y reenvía → componer con algo que inyecte `pending` (ej. withFormStatus)
export default function withLoading<P extends SubmitButtonProps>(
    WrappedComponent: ComponentType<P>
) {
    return function WithLoading(props: P) {
        const { pending } = props;
        return (
            <>
                {pending && <p>pending</p>}
                <WrappedComponent {...props} />
            </>
        );
    }
}



