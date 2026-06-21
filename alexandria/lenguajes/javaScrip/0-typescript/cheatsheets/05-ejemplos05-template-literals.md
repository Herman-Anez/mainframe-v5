# `ejemplos/05-template-literals/`

## `string-manipulation.ts`

```ts
type Saludo = `Hola, ${string}`;
let saludo: Saludo = "Hola, TypeScript";

type Vertical = "top" | "bottom";
type Horizontal = "left" | "right";
type Posicion = `${Vertical}-${Horizontal}`;
// "top-left" | "top-right" | "bottom-left" | "bottom-right"

// Capitalizar
type Capitalizar<T extends string> = `${Capitalize<T>}`;
type Mayus = Capitalizar<"hola">; // "Hola"
```

## `route-params.ts`

```ts
type ExtraerParam<Path extends string> =
  Path extends `${string}:${infer Param}/${infer Rest}`
    ? Param | ExtraerParam<Rest>
    : Path extends `${string}:${infer Param}`
      ? Param
      : never;

type Params = ExtraerParam<"/usuario/:id/post/:postId">; // "id" | "postId"
```

## `key-remap-with-template.ts`

```ts
// Crear eventos onEvent a partir de nombres
type Eventos = "click" | "focus" | "blur";
type Handlers = {
  [K in Eventos as `on${Capitalize<K>}`]: () => void;
};
// { onClick: () => void; onFocus: () => void; onBlur: () => void }
```

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ `ejemplos/04-conditional-types/`](04-ejemplos04-conditional-types.md) | [🏠 Inicio](../index.md) | [`ejemplos/06-clases/` ▶](06-ejemplos06-clases.md) |
