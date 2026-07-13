export type ExampleComponentProps = {
    flag1: boolean;
    text: string;
    styles?: { texto?: string };//clases para el componente
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
        }
    `}
    </style>
);
export default function Component({ flag1, text,styles }: ExampleComponentProps) {
    return (
        <>
            {fallbackStyle}
            {<p className={styles?.texto ?? "texto"}>{flag1 ? text:"nope"}</p> }
        </>
    );
}
