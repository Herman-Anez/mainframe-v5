# Functional patterns

TypeScript permite aplicar con precisión patrones de programación funcional manteniendo la seguridad de tipos. Composiciones, currificación, mónadas y ópticas son posibles gracias a los tipos genéricos, condicionales y la inferencia.

## Funciones de orden superior tipadas

### `compose` y `pipe`

La composición de funciones requiere tipar el flujo de datos a través de varias firmas. Con genéricos y sobrecargas o condicionales, se puede lograr un tipado exacto:

```ts
function pipe<A>(a: A): A;
function pipe<A, B>(a: A, ab: (a: A) => B): B;
function pipe<A, B, C>(a: A, ab: (a: A) => B, bc: (b: B) => C): C;
function pipe(value: any, ...fns: Function[]) {
  return fns.reduce((acc, fn) => fn(acc), value);
}
```

Para un número variable de argumentos se suelen usar **sobrecargas** o tipos recursivos (menos común). Librerías como `fp-ts` usan `pipe` con tipado variable gracias a una técnica de intersección de tipos de funciones.

### Currificación

```ts
function curry<T1, T2, R>(fn: (a: T1, b: T2) => R): (a: T1) => (b: T2) => R {
  return (a: T1) => (b: T2) => fn(a, b);
}
```

## Tipos algebraicos: `Option` y `Result`

Implementaciones funcionales comunes que evitan `null` y manejan errores sin lanzar excepciones.

### `Option<T>`

```ts
type Option<T> = { kind: "some"; value: T } | { kind: "none" };

const some = <T>(value: T): Option<T> => ({ kind: "some", value });
const none: Option<never> = { kind: "none" };

function map<T, U>(opt: Option<T>, f: (x: T) => U): Option<U> {
  return opt.kind === "some" ? some(f(opt.value)) : none;
}
```

### `Result<E, T>`

```ts
type Result<E, T> =
  | { kind: "ok"; value: T }
  | { kind: "err"; error: E };

function flatMap<E, T, U>(res: Result<E, T>, f: (x: T) => Result<E, U>): Result<E, U> {
  if (res.kind === "ok") return f(res.value);
  return res;
}
```

TypeScript estrecha perfectamente en estas uniones discriminadas, haciendo el código seguro.

## Patrones con tipos mapeados y `readonly`

En programación funcional se trabaja con datos inmutables. TypeScript ofrece `Readonly`, `ReadonlyArray` y `as const`. Se pueden crear actualizadores funcionales que devuelven un nuevo objeto:

```ts
function setProp<T, K extends keyof T>(obj: T, key: K, val: T[K]): T {
  return { ...obj, [key]: val };
}
```

## Lenses (lentes) y Prisms

Una lente es un par de funciones `get` y `set` para acceder y modificar una propiedad dentro de una estructura anidada de forma inmutable. Con tipos se puede tipar:

```ts
interface Lens<S, A> {
  get: (s: S) => A;
  set: (a: A) => (s: S) => S;
}
```

Combinando lentes con genéricos se pueden recorrer objetos profundos con total seguridad.

## Programación tácita (point-free) segura

Gracias a la inferencia, se pueden escribir funciones sin mencionar los argumentos; el compilador infiere los tipos siempre que las funciones intermedias estén bien tipadas.

## Buenas prácticas

- Prefiere datos inmutables y funciones puras; TypeScript ayuda con `readonly`.
- Usa `Option`/`Result` para manejar ausencia y errores en lugar de `null` y excepciones.
- Las librerías como `fp-ts` y `io-ts` llevan estos patrones al extremo; conocerlas es valioso.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ This polimorfico](04-this-polimorfico.md) | [🏠 Inicio](../index.md) | [Conditional overloads ▶](06-conditional-overloads.md) |
