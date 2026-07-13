import type { ComponentType } from "react";
import type { ExampleComponentProps } from "./component/ejemplo.component";
import { withModuleStyle, withCustomText2 } from "./component/hoc";

type FibMethods = "withModuleStyle"|"withCustomText2";

class ComponentFib<
    P extends ExampleComponentProps,
    C,
    Used extends FibMethods = never,
> {
    readonly Component: ComponentType<C>;

    private readonly applied: ReadonlySet<FibMethods>;

    private constructor(
        component: ComponentType<C>,
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
    ): Omit<ComponentFib<P, NC, Used | M>, Used | M> {
        if (this.applied.has(method)) {
            throw new Error(
                `ComponentFactory: '${method}' ya fue aplicado, no se puede llamar dos veces`,
            );
        }

        return new ComponentFib<P, NC, Used | M>(
            component,
            new Set([...this.applied, method]),
        );
    }

/* 
    withModuleStyle(styles?: Parameters<typeof withModuleStyle>[1]) {
    const WrappedComponent = withModuleStyle(
        this.Component as ComponentType<C & ExampleComponentProps>,
        styles,
    );
    return this.next("withModuleStyle", WrappedComponent);
    }
*/
    withModuleStyle(styles?/*1*/: Parameters/*2*/<typeof withModuleStyle>[1]/*3*/) {
        const WrappedComponent = withModuleStyle(
            this.Component as ComponentType<C & ExampleComponentProps>,
            styles,
        );
        return this.next("withModuleStyle", WrappedComponent);
    }
        withCustomText2() {
        const WrappedComponent = withCustomText2(
            this.Component,
        );
        return this.next("withCustomText2", WrappedComponent);
    }
}

export default ComponentFib;
