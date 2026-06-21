# `ejemplos/10-declaration-files/`

## `global.d.ts`

```ts
// Declaración de variable global (debe estar en archivo sin import/export)
declare var VERSION: string;
declare function $(selector: string): any;
```

## `module-decl.d.ts`

```ts
// Declaración de módulo que no tiene tipos
declare module "libreria-sin-tipos" {
  export function hacerAlgo(): void;
  export const CONFIG: Record<string, unknown>;
}
```

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ `ejemplos/09-enums/`](09-ejemplos09-enums.md) | [🏠 Inicio](../index.md) | [`ejemplos/11-patterns/` ▶](11-ejemplos11-patterns.md) |
