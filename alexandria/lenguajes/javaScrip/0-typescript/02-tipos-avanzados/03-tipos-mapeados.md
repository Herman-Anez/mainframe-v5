# Tipos mapeados

Los tipos mapeados transforman cada propiedad de un tipo existente en un nuevo tipo. Son la base de utilidades como `Partial`, `Readonly`, `Pick` y `Record`, y permiten crear variantes complejas.

## Sintaxis completa

```ts
type Mapeado<T> = {
  [K in keyof T]: NuevoTipo;
};
```

- `keyof T` produce una unión de claves.
- Podemos aplicar modificadores `readonly` y `?` (opcional). Para **añadir** o **quitar** estos modificadores usamos los prefijos `+`/`-` (por defecto `+`).

```ts
type Total<T> = {
  [K in keyof T]-?: T[K];       // elimina opcionalidad
};
type Inmutable<T> = {
  +readonly [K in keyof T]: T[K]; // añade readonly (el + es opcional)
};
```

## Mapeado homomórfico vs no homomórfico

Un tipo mapeado es **homomórfico** cuando itera sobre `keyof T` directamente. Esto preserva los modificadores originales de las propiedades (excepto si los sobrescribes explícitamente). Los tipos `Partial`, `Required` y `Readonly` son homomórficos.

Si construimos un mapeado sobre un conjunto de claves genérico (por ejemplo `[K in SomeUnion]`), no hay homomorfismo y no se copian modificadores; el nuevo tipo se comporta como un `Record`.

```ts
type Keys = "a" | "b";
type NoHomomorfico = { [K in Keys]: string }; // { a: string; b: string; }
```

## Key remapping (remapeo de claves) con `as`

Desde TS 4.1 podemos transformar las claves usando la cláusula `as`:

```ts
type Getters<T> = {
  [K in keyof T as `get${Capitalize<K & string>}`]: () => T[K]
};
```

Si la expresión después de `as` resulta `never`, la clave se **excluye** del mapeado. Esto permite filtrar propiedades:

```ts
type SoloFunciones<T> = {
  [K in keyof T as T[K] extends (...args: any) => any ? K : never]: T[K]
};
```

## Mapeado con tipos condicionales en valores

El tipo del valor puede ser cualquier cosa, incluyendo tipos condicionales que dependan de `T[K]`:

```ts
type Nullable<T> = {
  [K in keyof T]: T[K] | null;
};
type Parseado<T> = {
  [K in keyof T]: T[K] extends string ? number : T[K];
};
```

## Mapeado sobre tuplas y arrays

Las tuplas y arrays también pueden ser mapeados (son objetos con claves numéricas y `length`). Podemos usar `keyof` para iterar sobre `number` y los métodos. Para mapear solo los elementos, usamos `[K in keyof T & number]`. TypeScript 4.0+ permite mapear sobre tuplas preservando su estructura:

```ts
type MapTuple<T extends readonly any[], F> = {
  [K in keyof T]: F<T[K]>;
};
type Mapped = MapTuple<[string, number], <X>(x: X) => X[]>; // [[string], [number]]
```

## Mapped types y `symbol`/`number`

Las claves `symbol` y `number` se incluyen en `keyof T`. A menudo queremos operar solo sobre claves `string`. Podemos filtrar con `K & string` en el remapeo.

## Built-ins que debes dominar

- `Partial<T>`: todas las propiedades opcionales.
- `Required<T>`: todas requeridas.
- `Readonly<T>`: todas readonly.
- `Pick<T, K>`: selecciona un subconjunto de propiedades.
- `Omit<T, K>`: excluye propiedades. Implementado con `Pick<T, Exclude<keyof T, K>>`.
- `Record<K, T>`: construye un tipo con claves `K` y valores `T`. No es homomórfico.

## Mapeados profundos

Para hacer un `DeepPartial` o `DeepReadonly` necesitamos recursión condicional, combinando tipos condicionales y mapeados:

```ts
type DeepPartial<T> = T extends object
  ? { [K in keyof T]?: DeepPartial<T[K]> }
  : T;
```

## Consideraciones de rendimiento

Los mapeados sobre tipos con muchas propiedades (cientos) o muy profundos pueden ralentizar el compilador. Es recomendable evitar recursiones excesivas y usar `interface` cuando sea posible (aunque las interfaces no soportan mapeado dinámico, a veces una combinación reduce complejidad).

## Mapeados y union types

Cuando iteras sobre `keyof (A | B)`, obtienes solo las claves comunes. Para mapear una unión de objetos y conservar la discriminación se usan tipos condicionales distributivos que devuelven objetos mapeados por separado.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Tipos condicionales](02-tipos-condicionales.md) | [🏠 Inicio](../index.md) | [Template literal types ▶](04-template-literal-types.md) |
