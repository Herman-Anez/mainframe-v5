# Discriminated union

Las uniones discriminadas (también llamadas uniones etiquetadas, *tagged unions* o *algebraic data types*) son el patrón más poderoso para modelar estados excluyentes en TypeScript. Se basan en un campo común (el discriminante) que permite al compilador reducir el tipo de forma automática y segura.

## Anatomía de una unión discriminada

Se compone de:

1. **Un tipo unión** (`A | B | C`) donde cada miembro tiene al menos una propiedad en común.
2. **Una propiedad discriminante** con un **tipo literal** distinto en cada miembro (usualmente `type`, `kind`, `status`).

```ts
type Exito = {
  estado: "exito";
  datos: string[];
};
type Error = {
  estado: "error";
  mensaje: string;
};
type Cargando = {
  estado: "cargando";
};
type Resultado = Exito | Error | Cargando;
```

El discriminante (`estado`) permite que TypeScript distinga cada caso.

## Estrechamiento automático

Dentro de un `if` o `switch` que comprueba el discriminante, el compilador reduce el tipo:

```ts
function manejar(res: Resultado) {
  switch (res.estado) {
    case "exito":
      // res es Exito
      console.log(res.datos.length);
      break;
    case "error":
      // res es Error
      console.error(res.mensaje.toUpperCase());
      break;
    case "cargando":
      // res es Cargando
      break;
  }
}
```

Funciona también con `if (res.estado === "exito")`. No es necesario un `switch`; se puede encadenar con `else if`.

## Exhaustividad con `never`

Para garantizar que todos los casos están cubiertos (incluso al añadir nuevos miembros en el futuro), se emplea una comprobación en la rama `default` usando el tipo `never`:

```ts
function assertNever(x: never): never {
  throw new Error("Valor inesperado: " + x);
}

function manejarExhaustivo(res: Resultado) {
  switch (res.estado) {
    case "exito":
      // ...
      break;
    case "error":
      // ...
      break;
    case "cargando":
      break;
    default:
      assertNever(res); // Error de compilación si falta algún caso
  }
}
```

Si más tarde agregamos `{ estado: "pendiente" }` a `Resultado`, el `default` recibirá ese tipo y la llamada a `assertNever` marcará error porque `res` ya no es `never`. Esto fuerza a actualizar todos los lugares donde se maneja.

## Múltiples niveles de discriminación

Se pueden anidar uniones discriminadas. Por ejemplo, una vista de una UI con estados y subestados:

```ts
type Vista =
  | { pantalla: "lista"; datos: Datos[] }
  | { pantalla: "detalle"; id: string; modo: "vista" | "edicion" }
  | { pantalla: "error"; codigo: number };
```

Dentro del caso `detalle`, el campo `modo` actúa como discriminante secundario. Se puede anidar el `switch` o combinar comprobaciones.

## Unión discriminada genérica

Podemos crear una función que opere sobre cualquier unión discriminada usando un tipo genérico para el discriminante:

```ts
type UnionPorClave<T, K extends string> = T extends { [P in K]: infer V } ? V : never;

function porEstado<T extends { estado: string }>(items: T[], estado: T["estado"]): T[] {
  return items.filter(item => item.estado === estado);
}
```

## Ejemplos reales

- **Máquinas de estado**: modelado de procesos, loaders, wizard steps.
- **Respuestas de API**: éxito con datos, error con mensaje, redirección.
- **Acciones de Redux/React Context**: cada acción tiene un `type` y un `payload` opcional.
- **Árboles sintácticos (AST)**: nodos de diferentes tipos (`Literal`, `BinaryExpression`, etc.).

## Discriminante con tipos no literales

El discriminante debe ser un tipo literal (string, number o boolean). Si usas una variable, el estrechamiento no funcionará porque el compilador no conoce el valor en tiempo de compilación. Para esos casos, usa *type predicates*.

## Buenas prácticas

- Nombra el discriminante de forma consistente (`type`, `kind`, `tag`).
- Prefiere `switch` con `default` y `assertNever` para exhaustividad.
- Usa interfaces o `type` para cada variante; evita uniones de primitivos si la lógica es compleja.
- Combina con tipos mapeados para generar acciones a partir de un mapa de tipos.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Bundlers](../06-herramientas/06-bundlers.md) | [🏠 Inicio](../index.md) | [Branded types ▶](02-branded-types.md) |
