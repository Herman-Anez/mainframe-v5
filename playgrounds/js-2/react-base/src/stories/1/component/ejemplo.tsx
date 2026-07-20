import type { FC, ComponentType } from "react";
import defaultStyles from "./ejemplo1.module.css";
import defaultStyles2 from "./ejemplo2.module.css";
type ExampleComponentProps = {
    flag1: boolean;
    text: string;
    styles: CSSModuleClasses; //clases para el componente
};
type ExampleComponentProps2 = {
    extraText: string;
};

const componente = {
    fallbackStyle: (
        <style
            contentEditable /// permite editar el interior de html
            style={{
                //////////////////
                display: "block", ///// permite ver el elemento
                whiteSpace: "pre", //// formatea el texto
            }} ////////////////////////
            id="ejemplo-fallback-style"
        >
            {`
        .texto {
            background-color: #0055FF;
        }Component1
    `}
        </style>
    ),
    Component({ flag1, text, styles }: ExampleComponentProps) {
        return (
            <>
                {this.fallbackStyle}
                {<p className={styles?.texto}>{flag1 ? text : "nope"}</p>}
            </>
        );
    },

    Component1({ extraText = "extraText" }: ExampleComponentProps2) {
        return (
            <>
                {this.fallbackStyle}
                {<p>{extraText}</p>}
            </>
        );
    },
};

// withModuleStyle
type withModuleStyle_OverLoadProps = {
    styles: CSSModuleClasses;
};
type withModuleStyle_HocProps = Partial<withModuleStyle_OverLoadProps>;

// withCustomText
type withCustomText_InjectedProps = {
    text: string;
    flag1: boolean;
};
type withCustomText_HocProps = Partial<withCustomText_InjectedProps>;
// withCustomText
// withOptionalExtraText
type withOptionalExtraText_NewProps = {
    extraText?: string; // opcional
};
type withOptionalExtraText_WithoutKeys<U> = {
    [K in keyof U]?: never;
};
type ValidWrappedComponentProps = object &
    withOptionalExtraText_WithoutKeys<withOptionalExtraText_NewProps>;

type CombinedProps<P> = P & withOptionalExtraText_NewProps;
// withOptionalExtraText
const hocs = {
    withModuleStyle({ styles }: withModuleStyle_HocProps) {
        styles = styles ?? defaultStyles;
        return function withModuleStyle<
            P extends withModuleStyle_OverLoadProps,
        >(WrappedComponent: FC<P>) {
            return function WithModuleStyle(
                props: Omit<P, keyof withModuleStyle_OverLoadProps>,
            ) {
                return <WrappedComponent {...(props as P)} styles={styles} />;
            };
        };
    },
    withCustomText({
        text = "default text",
        flag1 = true,
    }: withCustomText_HocProps) {
        return function withCustomText<P>(
            WrappedComponent: ComponentType<P & withCustomText_InjectedProps>,
        ) {
            return function withCustomText(
                props: Omit<P, keyof withCustomText_InjectedProps>,
            ) {
                return (
                    <>
                        <WrappedComponent
                            {...(props as P)}
                            flag1={flag1} //! Se inyectan los valores
                            text={text} //! Se inyectan los valores
                        />
                    </>
                );
            };
        };
    },
    withOptionalExtraText<P extends object & ValidWrappedComponentProps>(
        WrappedComponent: /*3*/ FC<P> /*3*/,
    ): /*4*/ FC<P & withOptionalExtraText_NewProps> /*4*/ {
        /*4*/ return function withExtraText(
            props: CombinedProps<P>,
        ) /*4*/ {
            const { extraText, ...rest } = props;
            return (
                <>
                    {extraText && <p>{extraText}</p>}
                    <WrappedComponent {...(rest as P)} />
                </>
            );
        };
    },
};

const withDefaulStyle = hocs.withModuleStyle({})(componente.Component)({
    flag1: true,
    text: "asd",
});
const withStyle = hocs.withModuleStyle(defaultStyles2)(componente.Component)({
    flag1: true,
    text: "asd",
});

export { withDefaulStyle, withStyle };
