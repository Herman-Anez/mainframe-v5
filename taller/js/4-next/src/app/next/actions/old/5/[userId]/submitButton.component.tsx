export type SubmitButtonProps = { pending: boolean };

export default function SubmitButton({ pending }:SubmitButtonProps) {
    return (
        <button
            disabled={pending}
            className="rounded-lg 
            bg-blue-600 
            px-4 
            py-2 
            text-sm 
            font-medium 
            text-white 
            hover:bg-blue-700 
            disabled:opacity-50
            disabled:cursor-not-allowed
            transition-colors"
        >
            {pending ? "guardando..." : "guardar"}
        </button>
    )
}



