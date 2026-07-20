import type { ComponentType } from "react";
import type { ExampleComponentProps } from "../component/ejemplo.component";
import { withModuleStyle, withCustomText } from "../hoc";

type FibMethods = "withStyle" |"withModuleStyle" | "withCustomText2";
//Fluent Immutable Builder
class ComponentFib<
    ComponentProps,
    EnhanceComponentProps,
    Used extends FibMethods = never,
> {
    readonly Component: ComponentType<EnhanceComponentProps>;

    private readonly applied: ReadonlySet<FibMethods>;

    private constructor(
        component: ComponentType<EnhanceComponentProps>,
        applied: ReadonlySet<FibMethods>,
    ) {
        this.Component = component;
        this.applied = applied;
    }

    static from<P extends ExampleComponentProps>(component: ComponentType<P>) {
        return new ComponentFib<P, P>(component, new Set());
    }

    private next<M extends FibMethods, NC>(
        method: M,
        component: ComponentType<NC>,
    ): Omit<ComponentFib<ComponentProps, NC, Used | M>, Used | M> {
        if (this.applied.has(method)) {
            throw new Error(
                `ComponentFactory: '${method}' ya fue aplicado, no se puede llamar dos veces`,
            );
        }

        return new ComponentFib<ComponentProps, NC, Used | M>(
            component,
            new Set([...this.applied, method]),
        );
    }


    withModuleStyle(
        this: ComponentFib<
            ComponentProps,
            EnhanceComponentProps & { styles: CSSModuleClasses },
            Used
        >,
        styles?: CSSModuleClasses,
    ) {
        const WrappedComponent = withModuleStyle({ styles })(this.Component);
        return this.next("withModuleStyle", WrappedComponent);
    }
    withStyle(
        this: ComponentFib<
            ComponentProps,
            EnhanceComponentProps & { styles: CSSModuleClasses },
            Used
        >,
    ) {
        const WrappedComponent = withModuleStyle({})(this.Component);
        return this.next("withStyle", WrappedComponent);
    }
    withCustomText(
        this: ComponentFib<
            ComponentProps,
            EnhanceComponentProps & { text: string; flag1: boolean },
            Used
        >,
    ) {
        const WrappedComponent = withCustomText({})(this.Component);
        return this.next("withCustomText2", WrappedComponent);
    }
}

export default ComponentFib;
