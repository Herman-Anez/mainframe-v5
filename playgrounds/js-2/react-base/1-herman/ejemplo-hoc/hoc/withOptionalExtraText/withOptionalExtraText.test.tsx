// withOptionalExtraText: HOC tipo "2 Inyecta atributos" (ver ../../hoc.md).
// El componente envuelto NO tenia `extraText`, el HOC se lo agrega como
// prop opcional nueva. Si viene, pinta un <p> extra antes del componente.
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import type { FC } from "react";
import withOptionalExtraText from "./withOptionalExtraText";

afterEach(() => {
    cleanup();
});

// Componente "de juguete" a proposito: no sabe nada de `extraText`,
// asi se ve claro que esa prop la agrega el HOC, no el componente.
const Dummy: FC<{ label: string }> = ({ label }) => <span>{label}</span>;

describe("withOptionalExtraText", () => {
    it("sin extraText: no pinta el <p> extra, solo el componente envuelto", () => {
        const Wrapped = withOptionalExtraText(Dummy);

        render(<Wrapped label="soy el dummy" />);

        expect(screen.getByText("soy el dummy")).toBeInTheDocument();
        expect(screen.queryByRole("paragraph")).not.toBeInTheDocument();
    });

    it("con extraText: pinta el <p> extra ademas del componente envuelto", () => {
        const Wrapped = withOptionalExtraText(Dummy);

        render(<Wrapped label="soy el dummy" extraText="texto extra" />);

        expect(screen.getByText("texto extra")).toBeInTheDocument();
        expect(screen.getByText("soy el dummy")).toBeInTheDocument();
    });

    it("`extraText` no se le filtra al componente envuelto (se queda solo con `rest`)", () => {
        const Spy: FC<{ label: string }> = ({ label, ...rest }) => (
            <span data-extra-keys={Object.keys(rest).join(",")}>{label}</span>
        );
        const Wrapped = withOptionalExtraText(Spy);

        render(<Wrapped label="hola" extraText="no deberia llegar" />);

        expect(screen.getByText("hola")).toHaveAttribute("data-extra-keys", "");
    });
});
