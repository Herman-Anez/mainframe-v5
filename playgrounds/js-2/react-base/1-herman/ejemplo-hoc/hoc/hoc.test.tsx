// Prueba de INTEGRACION: combinar varios HOCs, uno sobre otro.
// Esto es lo interesante de los HOCs: cada uno secuestra una prop
// distinta, y si los encadenas todos, el componente final puede
// terminar sin necesitar NINGUNA prop obligatoria.
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { withModuleStyle, withCustomText } from "./index";
import { Component } from "../component/ejemplo.component";
import defaultStyles from "./withModuleStyle/ejemplo.module.css";

afterEach(() => {
    cleanup();
});

describe("composicion de HOCs (withCustomText + withModuleStyle)", () => {
    it("el componente final no necesita props: los dos HOCs las inyectan", () => {
        // 1) withModuleStyle({})(Component) -> ya no necesita `styles`
        // 2) withCustomText({})( ese resultado ) -> ya no necesita `text` ni `flag1`
        const FullyWrapped = withCustomText({})(withModuleStyle({})(Component));

        // @ts-expect-error -- justamente lo que probamos: cero props obligatorias
        render(<FullyWrapped />);

        expect(screen.getByText("default text")).toBeInTheDocument();
        expect(screen.getByText("default text")).toHaveClass(defaultStyles.texto);
    });

    it("se puede seguir configurando cada HOC al momento de crearlo", () => {
        const FullyWrapped = withCustomText({ text: "compuesto" })(
            withModuleStyle({})(Component),
        );

        // @ts-expect-error -- cero props obligatorias, igual que arriba
        render(<FullyWrapped />);

        expect(screen.getByText("compuesto")).toBeInTheDocument();
    });
});
