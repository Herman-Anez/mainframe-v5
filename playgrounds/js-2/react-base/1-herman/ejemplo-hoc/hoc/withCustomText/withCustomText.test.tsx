// withCustomText: HOC tipo "1.1.3 mixto" (ver ../../hoc.md).
// Secuestra `text` y `flag1`: el componente resultante ya NO puede
// controlar esas dos props, las decide quien crea el HOC.
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import withCustomText from "./withCustomText";
import { Component } from "../../component/ejemplo.component";
import styles from "../../component/ejemplo1.module.css";

afterEach(() => {
    cleanup();
});

describe("withCustomText", () => {
    it("sin config: usa los valores por defecto ('default text', flag1=true)", () => {
        const Wrapped = withCustomText({})(Component);

        render(<Wrapped styles={styles} />);

        expect(screen.getByText("default text")).toBeInTheDocument();
    });

    it("con config: los valores pasados reemplazan a `text` y `flag1`", () => {
        const Wrapped = withCustomText({ text: "hola custom", flag1: true })(
            Component,
        );

        render(<Wrapped styles={styles} />);

        expect(screen.getByText("hola custom")).toBeInTheDocument();
    });

    it("flag1=false hace que se ignore `text` (comportamiento del componente base)", () => {
        const Wrapped = withCustomText({ text: "no se deberia ver", flag1: false })(
            Component,
        );

        render(<Wrapped styles={styles} />);

        expect(screen.getByText("nope")).toBeInTheDocument();
        expect(screen.queryByText("no se deberia ver")).not.toBeInTheDocument();
    });

    it("las props que NO son text/flag1 se siguen pasando al componente envuelto", () => {
        // `styles` no la maneja withCustomText, por eso hay que seguir pasandola.
        const Wrapped = withCustomText({})(Component);

        render(<Wrapped styles={styles} />);

        expect(screen.getByText("default text")).toHaveClass(styles.texto);
    });
});
