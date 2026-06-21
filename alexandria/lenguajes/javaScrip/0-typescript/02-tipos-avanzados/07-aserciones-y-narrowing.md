# Aserciones y narrowing

El narrowing (estrechamiento) es el proceso por el cual TypeScript reduce el tipo de una variable dentro de un bloque de código basándose en el flujo de control. Las aserciones son indicaciones explícitas al compilador sobre el tipo.

## Narrowing por `typeof`

El operador `typeof` en JavaScript devuelve una cadena; TypeScript usa esa cadena para refinar:

```ts
function padLeft(valor: string | number) {
  if (typeof valor === "number") {
    return " ".repeat(valor) + "texto"; // valor es number aquí
  }
  return valor; // valor es string aquí
}
```

Funciona con `"string"`, `"number"`, `"bigint"`, `"boolean"`, `"symbol"`, `"undefined"`, `"object"`, `"function"`.

## Narrowing por `instanceof`

```ts
if (x instanceof Date) {
  x.getFullYear(); // x es Date
}
```

## Narrowing por `in`

Comprueba la existencia de una propiedad:

```ts
if ("radio" in figura) {
  figura.radio; // figura se ha estrechado a la rama con radio
}
```

## Narrowing por comparación

Comparaciones con `===`, `!==`, `switch` y literales:

```ts
function ejemplo(x: string | undefined) {
  if (x !== undefined) {
    x.toUpperCase();
  }
}
```

Para uniones discriminadas, la comprobación del discriminante estrecha todo el objeto.

## Narrowing por verdad/falsedad

Valores como `null`, `undefined`, `""`, `0`, `NaN` son falsy y pueden estrechar en condicionales:

```ts
if (valor) {
  // valor no es falsy
}
```

## User-defined type guards (`x is Tipo`)

Una función que devuelve un *type predicate* permite al compilador refinar el tipo en el ámbito del `if`:

```ts
function esPez(animal: Pajaro | Pez): animal is Pez {
  return (animal as Pez).nadar !== undefined;
}
if (esPez(animal)) {
  animal.nadar(); // animal es Pez
}
```

La lógica interna no es verificada por el compilador; es responsabilidad del desarrollador implementarla correctamente.

## Funciones de aserción (`asserts`)

Similar al type predicate, pero en lugar de devolver un booleano, lanza una excepción si no se cumple. El tipo se estrecha para el resto del bloque:

```ts
function assertEsString(val: any): asserts val is string {
  if (typeof val !== "string") throw new Error("No es string");
}
let x: unknown = "hola";
assertEsString(x);
x.toUpperCase(); // x es string a partir de aquí
```

También existe `asserts val` (sin `is Tipo`) para afirmar que la variable no es falsy (condición).

## Afirmaciones de tipo (`as`)

El operador `as` le dice al compilador que confíe en un tipo concreto, sin verificación:

```ts
const canvas = document.getElementById("lienzo") as HTMLCanvasElement;
```

Es una operación insegura; si el valor no coincide en runtime, se producen errores silenciosos. Usar solo cuando tengamos certeza o tras comprobaciones manuales.

## Afirmación no nula (`!`)

El sufijo `!` elimina `null` y `undefined` de una expresión:

```ts
let nombre: string | null = getName();
console.log(nombre!.length); // confiamos en que nombre no es null
```

Peligroso si se abusa; puede enmascarar errores. Alternativa preferida: estrechamiento con `if`.

## `as const`

Convierte un valor en su tipo literal más restrictivo y añade `readonly` profundamente:

```ts
const config = { modo: "activo" as const }; // tipo { readonly modo: "activo" }
```

Útil para crear tipos inmutables.

## Doble aserción (`as unknown as Tipo`)

Cuando necesitamos forzar una conversión entre tipos no relacionados, podemos pasar por `unknown`:

```ts
let x = "hola";
let y = x as unknown as number; // muy peligroso, evítalo
```

Solo en migraciones o interop con JS no tipado.

## Limitaciones del narrowing

- No se propaga a través de funciones: si pasas una variable a una función, el estrechamiento no se mantiene dentro.
- No estrecha propiedades de objetos mutables si pueden cambiar entre comprobaciones. TypeScript supone que las propiedades pueden ser modificadas. Para objetos inmutables (`as const` o `readonly`) puede ser más agresivo.
- En callbacks, el estrechamiento pierde el contexto; a veces hay que reasignar a una constante.

## Combinaciones y buenas prácticas

- Prefiere el narrowing automático a las aserciones manuales.
- Usa type guards personalizados para lógica de dominio compleja y reutilizable.
- Las funciones de aserción son ideales para parseo y validación en tiempo de ejecución, integrándose con el análisis estático.
- Documenta las aserciones de tipo para justificar por qué son seguras.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Tipos indexados](06-tipos-indexados.md) | [🏠 Inicio](../index.md) | [Never exhaustividad ▶](08-never-exhaustividad.md) |
