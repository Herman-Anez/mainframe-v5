# Tipos básicos

TypeScript proporciona un conjunto de tipos primitivos que reflejan los de JavaScript, además de construcciones propias para modelar mejor los datos.

## Tipos primitivos

- **boolean**: `true` o `false`.
- **number**: enteros, decimales, hexadecimales, binarios, octales. Todos son `number` (internamente IEEE 754).
- **string**: cadenas de texto, con soporte para template literals.
- **symbol**: valor único e inmutable, usado como identificador. Creado con `Symbol()`.
- **bigint**: enteros de precisión arbitraria. Literal con `n` al final: `123n`. Requiere target `ES2020+`.

```ts
let activo: boolean = true;
let total: number = 42;
let nombre: string = "TypeScript";
let sym: symbol = Symbol("id");
let granEntero: bigint = 9007199254740991n;
```

## `null` y `undefined`

Por defecto, con `strictNullChecks: true` (incluido en `strict`), `null` y `undefined` son tipos separados y no se pueden asignar a otros tipos sin una unión explícita. Con `strictNullChecks: false`, son subtipos de todos los demás (comportamiento clásico de JS). Es una de las comprobaciones más importantes.

```ts
let x: number = null; // Error si strictNullChecks: true
let y: number | null = null; // Correcto
```

## `void`

Representa la ausencia de un valor de retorno. Se usa principalmente en funciones que no devuelven nada. Una variable de tipo `void` solo puede tener valor `undefined` (o `null` si strictNullChecks está desactivado).

```ts
function saludar(): void {
  console.log("Hola");
}
```

## `never`

Indica valores que nunca deberían ocurrir. Es el tipo de retorno de funciones que lanzan excepción o que entran en un bucle infinito. También aparece en el narrowing exhaustivo: cuando has cubierto todas las ramas de una unión, la rama restante es `never`.

```ts
function error(mensaje: string): never {
  throw new Error(mensaje);
}
```

## `any` y `unknown`

- **any**: desactiva completamente la comprobación de tipos para esa variable. Es una escotilla de escape útil en migraciones, pero elimina las ventajas de TS. Evítalo siempre que sea posible.
- **unknown**: es el tipo seguro equivalente a `any`. Representa cualquier valor, pero no se puede operar con él sin antes hacer una comprobación de tipo (estrechamiento).

```ts
let valor: unknown;
valor = "texto";
// valor.toUpperCase(); // Error: 'valor' es desconocido
if (typeof valor === "string") {
  valor.toUpperCase(); // Correcto, aquí valor es string
}
```

## Array

Dos sintaxis equivalentes: `tipo[]` y `Array<tipo>`.

```ts
let numeros: number[] = [1, 2, 3];
let cadenas: Array<string> = ["a", "b"];
```

Para arrays de múltiples tipos se usan uniones: `(string | number)[]`.

## Tuplas

Las tuplas son arrays con una longitud fija y tipos conocidos en cada posición. Se definen con notación de corchetes.

```ts
let par: [string, number] = ["edad", 30];
```

- Elementos opcionales: `[string, number?]`.
- Elementos rest: `[string, ...number[]]`.
- Desde TS 4.0, se pueden etiquetar los elementos: `type Coordenada = [x: number, y: number]`. Las etiquetas solo existen para documentación y autocompletado.

## `object`

Representa cualquier valor no primitivo. Rara vez se usa directamente; es más común usar interfaces o tipos para describir formas de objetos.

```ts
let obj: object = {};
obj = { clave: 1 };
obj = [1, 2, 3];
// obj = 42; // Error
```

## Inferencia de tipos

Si no se anota el tipo, TS lo infiere de la inicialización:

```ts
let mensaje = "hola"; // infiere string
```

En parámetros de función también puede inferir en contextos de retorno, pero es recomendable anotar parámetros.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Introducción a TypeScript](01-introduccion-a-typescript.md) | [🏠 Inicio](../index.md) | [Tipos literales y uniones ▶](03-tipos-literales-y-uniones.md) |
