/// <reference types="vitest/config" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Config local a esta carpeta: no depende del proyecto "storybook" de la
// raiz (ese solo corre archivos *.stories.* dentro de src/). Aqui usamos
// tests normales (*.test.tsx) para poder documentar cada HOC por separado.
//
// Usamos jsdom (DOM simulado) en vez de un navegador real via Playwright:
// no necesita instalar ningun binario aparte (alcanza con `pnpm install`)
// y para lo que probamos aca (texto en pantalla, clases css) es igual de
// fiel. Ver testing.md seccion 2 para el detalle de la comparacion.
export default defineConfig({
    plugins: [react()],
    test: {
        include: ["**/*.test.{ts,tsx}"],
        setupFiles: ["./vitest.setup.ts"],
        environment: "jsdom",
    },
});
