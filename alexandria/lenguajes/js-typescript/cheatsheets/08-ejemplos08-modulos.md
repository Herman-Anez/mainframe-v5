# `ejemplos/08-modulos/`

## `export-import.ts`

```ts
// archivo math.ts
export const PI = 3.14;
export function sumar(a: number, b: number): number { return a + b; }
export default function restar(a: number, b: number): number { return a - b; }

// archivo main.ts
import restar, { PI, sumar } from './math';
```

## `import-type.ts`

```ts
import type { Usuario } from './models';
let usuario: Usuario; // solo tipo, no genera require/import en JS
```

## `dynamic-import.ts`

```ts
async function cargarModulo() {
  const modulo = await import('./heavyModule');
  modulo.doSomething();
}
```

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ `ejemplos/07-decorators/` (TS 5.0+)](07-ejemplos07-decorators-ts-50.md) | [🏠 Inicio](../index.md) | [`ejemplos/09-enums/` ▶](09-ejemplos09-enums.md) |
