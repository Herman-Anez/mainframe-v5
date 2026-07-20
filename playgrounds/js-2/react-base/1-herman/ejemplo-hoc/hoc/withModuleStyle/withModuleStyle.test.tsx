// withModuleStyle: HOC tipo "1.1.3 mixto" (ver ../../hoc.md).
// Secuestra `styles`: si no le das un modulo css usa uno por defecto
// (./ejemplo.module.css), si le das uno lo usa a el.
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import withModuleStyle from "./withModuleStyle";
import { Component } from "../../component/ejemplo.component";
import defaultStyles from "./ejemplo.module.css";
import otherStyles from "../../component/ejemplo2.module.css";

afterEach(() => {
    cleanup();
});

describe("withModuleStyle", () => {
    it("sin config: aplica el modulo css por defecto del HOC", () => {
        const Wrapped = withModuleStyle({})(Component);

        render(<Wrapped flag1={true} text="hola" />);

        expect(screen.getByText("hola")).toHaveClass(defaultStyles.texto);
    });

    it("con config: aplica el modulo css que le pasen en vez del default", () => {
        const Wrapped = withModuleStyle({ styles: otherStyles })(Component);

        render(<Wrapped flag1={true} text="hola" />);

        // Ojo: en este repo ejemplo2.module.css y ejemplo.module.css tienen el
        // MISMO contenido, asi que el hash de la clase les queda igual. Por
        // eso aca solo probamos que se use el objeto `styles` que le pasamos
        // (no que sea "distinto" al default, que aca ni se puede notar).
        expect(screen.getByText("hola")).toHaveClass(otherStyles.texto);
    });

    it("las props que NO son `styles` se siguen pasando al componente envuelto", () => {
        const Wrapped = withModuleStyle({})(Component);

        render(<Wrapped flag1={false} text="hola" />);

        // flag1/text no los toca este HOC, siguen llegando al componente base
        expect(screen.getByText("nope")).toBeInTheDocument();
    });
});
