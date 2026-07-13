export type SubmitButtonProps = {
    pending: boolean;
    onClick?: () => void;
    styles?: { button?: string };
    //    styles?: typeof style;
};



const fallbackStyle = (
    <style
        contentEditable /// permite editar el interior de html
        style={{//////////////////
            display: "block",///// permite ver el elemento
            whiteSpace: "pre",//// formatea el texto
        }}////////////////////////
        id="submit-button-fallback-style"
    >
        {`
        .button {
            border-radius: 8px;
            background-color: #6A6B6D;
            padding: 8px 16px;
            font-size: 14px;
            font-weight: 500;
            color: #fff;
            border: none;
            cursor: pointer;
            transition: background-color 0.2s, opacity 0.2s;
        }

        .button:hover:not(:disabled) {
            background-color: #1d4ed8;
        }

        .button:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }
    `}
    </style>
);

export default function SubmitButton({
    pending,
    onClick,
    styles,
}: SubmitButtonProps) {
    return (
        <>
            {!styles && fallbackStyle}
            <button
                onClick={onClick}
                disabled={pending}
                className={styles?.button ?? "button"}
            >
                {pending ? "guardando..." : "guardar"}
            </button>
        </>
    );
}
