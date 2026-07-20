// Tests del COMPONENTE BASE (sin ningun HOC encima).
//
// Objetivo de este archivo: dejar constancia de como se comporta
// `Component` y `Component1` "en crudo", para que cuando los envuelvas con
// un HOC sepas que comportamiento es del componente y cual lo agrega el HOC.
import { describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach } from "vitest";
import { Component, Component1 } from "./ejemplo.component";
import styles from "./ejemplo1.module.css";

afterEach(() => {
    cleanup();
});

describe("Component (requiere flag1, text y styles)", () => {
    it("muestra `text` cuando flag1 es true", () => {
        render(<Component flag1={true} text="hola" styles={styles} />);

        expect(screen.getByText("hola")).toBeInTheDocument();
    });

    it("muestra 'nope' cuando flag1 es false (ignora `text`)", () => {
        render(<Component flag1={false} text="hola" styles={styles} />);

        expect(screen.getByText("nope")).toBeInTheDocument();
        expect(screen.queryByText("hola")).not.toBeInTheDocument();
    });

    it("aplica la clase `texto` del modulo css recibido por props", () => {
        render(<Component flag1={true} text="hola" styles={styles} />);

        expect(screen.getByText("hola")).toHaveClass(styles.texto);
    });

    it("no explota si no le pasan `styles` (className queda undefined)", () => {
        // @ts-expect-error -- probamos el caso "props incompletas" a proposito
        render(<Component flag1={true} text="hola" styles={undefined} />);

        expect(screen.getByText("hola").className).toBe("");
    });
});

describe("Component1 (extraText es opcional)", () => {
    it("usa 'extraText' por defecto si no le pasan la prop", () => {
        render(<Component1 extraText={undefined as unknown as string} />);

        expect(screen.getByText("extraText")).toBeInTheDocument();
    });

    it("muestra el texto que le pasen", () => {
        render(<Component1 extraText="texto custom" />);

        expect(screen.getByText("texto custom")).toBeInTheDocument();
    });
});
