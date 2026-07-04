# Testing

Probar aplicaciones TypeScript implica tanto pruebas unitarias/de integración como pruebas específicas de tipos para asegurar que las definiciones de tipo funcionan como se espera.

## Frameworks de testing y TypeScript

Los frameworks más populares tienen soporte nativo o mediante plugins.

### Jest

**Opción A: `ts-jest`**
```bash
npm install --save-dev jest typescript ts-jest @types/jest
npx ts-jest config:init
```

`jest.config.js` resultante:
```js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
};
```

`ts-jest` compila TypeScript usando `tsc` (o `ts-jest` internamente) y puede leer `tsconfig.json`. Soporta chequeo de tipos opcional (`diagnostics: true`), lo que puede ralentizar. Es la opción más compatible.

**Opción B: `@swc/jest`**
```bash
npm install --save-dev @swc/core @swc/jest
```
Configuración:
```js
module.exports = {
  transform: {
    '^.+\\.tsx?$': ['@swc/jest', { /* swc config */ }],
  },
};
```
Muchísimo más rápido que `ts-jest` porque solo transpila sin chequear tipos. El chequeo de tipos se ejecuta por separado con `tsc --noEmit`.

**Opción C: `esbuild-jest`** (similar, pero usa esbuild).

### Vitest

Vitest es el framework de testing moderno basado en Vite. Soporta TypeScript de forma nativa gracias a esbuild. No necesita configuración adicional para TS; basta con instalar `vitest` y ejecutar.

```bash
npm install --save-dev vitest
```

Ejemplo de test:
```ts
import { describe, it, expect } from 'vitest';
import { sumar } from './math';

describe('sumar', () => {
  it('suma dos números', () => {
    expect(sumar(1, 2)).toBe(3);
  });
});
```

Vitest también ofrece modos de watch ultrarrápidos. Para pruebas con DOM, se puede configurar `environment: 'jsdom'`. Es la opción más rápida y moderna.

## Pruebas de tipos (type testing)

No basta con probar la lógica; hay que verificar que los tipos inferidos y las restricciones funcionan. Herramientas:

### `tsd`

```bash
npm install --save-dev tsd
```

Crea un archivo `*.test-d.ts` y usa las funciones de aserción:
```ts
import { expectType, expectError } from 'tsd';
import { miFuncion } from './mi-modulo';

expectType<number>(miFuncion(2));
expectError(miFuncion('string')); // debe dar error
```

`tsd` ejecuta un subconjunto del compilador y verifica que los comentarios de expectativa se cumplan. Es el estándar para DefinitelyTyped y librerías.

### `vitest` con `expect-type`

`vitest` tiene integración con `expect-type`:
```ts
import { expectTypeOf } from 'vitest';

expectTypeOf(miFuncion).returns.toBeNumber();
expectTypeOf(miFuncion).parameter(0).toMatchTypeOf<number>();
```

Muy legible y mantenible.

### `@typescript-eslint` en pruebas

También se pueden escribir pruebas que usen `ts.createProgram` para verificar fragmentos de código dinámicamente, pero suele ser demasiado complejo para pruebas comunes.

## Testing de archivos de declaración

Si publicas `.d.ts`, debes probarlos. El método más sencillo es incluir un proyecto de prueba que importe la librería y ejercite los tipos (usando `tsc --noEmit`). Si el proyecto compila sin errores, los tipos son correctos en ese uso. Para validaciones más finas, `tsd` es ideal.

## Cobertura de código y sourcemaps

Tanto Jest como Vitest pueden generar cobertura. Si usas TypeScript, necesitan los source maps para mapear el JS transpilado al fuente original. Asegúrate de que tu configuración de build genere sourcemaps (o que el framework use el transpilador que las genera). Vitest maneja esto transparentemente.

## Buenas prácticas

- Ejecuta las pruebas con el mismo transpilador que usas en desarrollo para evitar discrepancias.
- Separa el chequeo de tipos (`tsc --noEmit`) de la ejecución de pruebas unitarias. Esto acelera el ciclo.
- En monorepos, cada paquete puede tener su propia configuración de Jest/Vitest o heredar de una base.
- Para pruebas end-to-end que usan TypeScript, herramientas como Playwright o Cypress con soporte TS configurado directamente (Playwright acepta `.ts` nativamente).

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Eslint prettier](04-eslint-prettier.md) | [🏠 Inicio](../index.md) | [Bundlers ▶](06-bundlers.md) |
