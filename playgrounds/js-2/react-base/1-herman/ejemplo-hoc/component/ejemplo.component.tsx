
export type ExampleComponentProps = {
    flag1: boolean;
    text: string;
    styles: CSSModuleClasses; //clases para el componente
};
export type ExampleComponentProps2 = {
    extraText: string;
};
const fallbackStyle = (
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
);
export function Component({ flag1, text, styles }: ExampleComponentProps) {
    return (
        <>
            {fallbackStyle}
            {<p className={styles?.texto}>{flag1 ? text : "nope"}</p>}
        </>
    );
}

export function Component1({  extraText="extraText" }: ExampleComponentProps2) {
    return (
        <>
            {fallbackStyle}
            {<p>{extraText}</p>}
        </>
    );
}

export default { Component1, Component };
