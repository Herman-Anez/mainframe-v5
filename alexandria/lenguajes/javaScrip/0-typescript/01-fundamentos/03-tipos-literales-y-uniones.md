# Tipos literales y uniones

## Tipos literales

Los tipos literales son valores concretos tratados como un tipo. Combinados con uniones, permiten modelar valores discretos.

```ts
let color: "rojo" | "verde" | "azul";
color = "rojo"; // ok
color = "amarillo"; // error
```

Se pueden crear tipos literales a partir de cadenas, números y booleanos.

```ts
type Direccion = "arriba" | "abajo" | "izquierda" | "derecha";
type Dado = 1 | 2 | 3 | 4 | 5 | 6;
type Respuesta = true | false; // equivalente a boolean, pero más restrictivo
```

## Uniones (union types)

Una unión `A | B` permite que un valor sea de tipo A o de tipo B. TypeScript solo permite acceder a propiedades que existen en **todos** los miembros de la unión sin antes estrechar.

```ts
interface Pajaro {
  volar(): void;
  ponerHuevos(): void;
}
interface Pez {
  nadar(): void;
  ponerHuevos(): void;
}
function accion(animal: Pajaro | Pez) {
  animal.ponerHuevos(); // ok, común a ambos
  // animal.volar(); // error
}
```

## Uniones discriminadas (tagged unions)

Patrón fundamental: añadir una propiedad literal común (discriminante) que permita al compilador deducir el tipo en cada rama de un `switch` o `if`.

```ts
type Forma =
  | { tipo: "circulo"; radio: number }
  | { tipo: "rectangulo"; ancho: number; alto: number };

function area(f: Forma): number {
  switch (f.tipo) {
    case "circulo":
      return Math.PI * f.radio ** 2;
    case "rectangulo":
      return f.ancho * f.alto;
    default:
      const _exhaustivo: never = f; // error si falta alguna variante
      return _exhaustivo;
  }
}
```

Aquí, tras comprobar `f.tipo`, TypeScript estrecha automáticamente el tipo en cada `case`. El `default` con `never` asegura exhaustividad.

## Narrowing (estrechamiento)

TypeScript analiza el flujo de control para refinar tipos:

- **typeof**: para primitivas (`"string"`, `"number"`, `"boolean"`, `"symbol"`, etc.).
- **instanceof**: para clases.
- **in**: para comprobar existencia de una propiedad.
- **Comparación con literales**: `if (x === "valor")`.
- **Funciones de aserción personalizadas**: `function esPez(x: any): x is Pez` (type predicate).
- **Asignación**: después de asignar, el tipo se acota.

Ejemplo con `typeof`:

```ts
function padLeft(valor: string | number, padding: string | number) {
  if (typeof padding === "number") {
    return " ".repeat(padding) + valor;
  }
  return padding + valor;
}
```

## Intersecciones (intersection types)

Combinan múltiples tipos en uno solo. Un valor debe satisfacer todas las restricciones.

```ts
interface ErrorHandling {
  success: boolean;
  error?: string;
}
interface Datos {
  contenido: string;
}
type RespuestaApi = Datos & ErrorHandling;
// { contenido: string; success: boolean; error?: string }
```

Las intersecciones son comunes para mixins y para extender tipos.

## Template literal types con uniones

Desde TS 4.1, los template literal types pueden distribuir sobre uniones:

```ts
type Vertical = "top" | "bottom";
type Horizontal = "left" | "right";
type Posicion = `${Vertical}-${Horizontal}`;
// "top-left" | "top-right" | "bottom-left" | "bottom-right"
```

Combinado con `Capitalize` y tipos mapeados, genera potentes transformaciones.

## `const` assertions

`as const` convierte un objeto/array en tipos de solo lectura con los tipos literales más específicos.

```ts
const persona = {
  nombre: "Ana",
  edad: 30
} as const;
// persona.nombre es de tipo "Ana", no string
// persona.edad es de tipo 30, no number
```

Esto es útil para crear uniones de literales a partir de objetos existentes.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Tipos básicos](02-tipos-basicos.md) | [🏠 Inicio](../index.md) | [Interfaces vs Types ▶](04-interfaces-vs-types.md) |
