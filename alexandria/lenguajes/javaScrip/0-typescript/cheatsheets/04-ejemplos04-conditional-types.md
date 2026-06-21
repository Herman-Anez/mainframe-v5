# `ejemplos/04-conditional-types/`

## `basic-conditional.ts`

```ts
type EsString<T> = T extends string ? true : false;
type A = EsString<"hola">; // true
type B = EsString<42>;     // false

// Distribución sobre unión
type QuitarNull<T> = T extends null | undefined ? never : T;
type SinNull = QuitarNull<string | null | undefined>; // solo string
```

## `infer.ts`

```ts
// Extraer tipo de retorno
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never;
type Fn = () => { id: number; name: string };
type TipoRetorno = ReturnType<Fn>; // { id: number; name: string }

// Extraer elemento de array
type ElementType<T> = T extends (infer U)[] ? U : never;
type El = ElementType<number[]>; // number

// Inferir en promesas (similar a Awaited)
type Awaited<T> = T extends Promise<infer R> ? R : T;
type Valor = Awaited<Promise<string>>; // string
```

## `distributive.ts`

```ts
type Distribuye<T> = T extends any ? T[] : never;
type Result = Distribuye<string | number>; // string[] | number[] (distribuye)

// Evitar distribución
type NoDistribuye<T> = [T] extends [any] ? T[] : never;
type Result2 = NoDistribuye<string | number>; // (string | number)[]
```

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ `ejemplos/03-mapped-types/`](03-ejemplos03-mapped-types.md) | [🏠 Inicio](../index.md) | [`ejemplos/05-template-literals/` ▶](05-ejemplos05-template-literals.md) |
