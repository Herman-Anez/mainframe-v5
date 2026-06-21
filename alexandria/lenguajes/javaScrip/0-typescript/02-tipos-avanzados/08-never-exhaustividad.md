# Never exhaustividad

`never` es el tipo del que ningún valor puede ser miembro. Representa el conjunto vacío. Su principal uso es garantizar que ciertos caminos del código son inalcanzables y forzar la exhaustividad.

## Qué produce `never`

- Funciones que nunca retornan: `function error(): never { throw new Error(); }`
- Un bucle infinito: `function loop(): never { while(true) {} }`
- Ramas inalcanzables en tipos condicionales distributivos donde todos los miembros se filtran: `Exclude<string, string>` produce `never`.
- La intersección de tipos incompatibles, como `string & number` → `never`.
- El tipo resultante de un `switch` exhaustivo en la rama `default` cuando ya se han cubierto todas las variantes.

## Propiedades del tipo `never`

- **`never` es asignable a cualquier tipo**: `let x: string = ((): never => { throw ... })();` es válido.
- **Nada es asignable a `never`** (excepto `never` mismo). Por eso asignar un valor a una variable de tipo `never` es un error, a menos que ese valor también sea `never` (es decir, provenga de un camino que nunca se alcanza).

Estas propiedades fundamentan la comprobación de exhaustividad.

## Exhaustividad con `switch`

En uniones discriminadas, si cubrimos todas las variantes, TypeScript estrecha el tipo a `never` en la rama `default`. Podemos verificarlo explícitamente:

```ts
type Accion =
  | { tipo: "abrir" }
  | { tipo: "cerrar" }
  | { tipo: "minimizar" };

function ejecutar(acc: Accion) {
  switch (acc.tipo) {
    case "abrir":
      break;
    case "cerrar":
      break;
    case "minimizar":
      break;
    default:
      const comprobacion: never = acc;
      // Si llegamos aquí, hay una acción no manejada
  }
}
```

Si más tarde añadimos `{ tipo: "maximizar" }` a `Accion`, la línea `const comprobacion: never = acc` fallará porque `acc` ya no es `never`; obtendremos un error de compilación. Esto nos fuerza a actualizar el código.

## Función `assertNever`

Es una función auxiliar que centraliza la comprobación:

```ts
function assertNever(x: never): never {
  throw new Error("Valor inesperado: " + x);
}
function ejecutar(acc: Accion) {
  switch (acc.tipo) {
    case "abrir":
      break;
    case "cerrar":
      break;
    default:
      assertNever(acc); // Error si acc no es never
  }
}
```

Ventaja: el código es más limpio y el error en runtime da información del valor inesperado.

## Exhaustividad con `if`/`else if`

También podemos encadenar condiciones y usar `assertNever` en el último `else`. Para uniones que no están discriminadas, puede ser más tedioso.

## `never` en tipos condicionales

Cuando filtramos uniones, `never` elimina los miembros. Por ejemplo, para obtener solo los métodos de un tipo:

```ts
type Metodos<T> = {
  [K in keyof T]: T[K] extends (...args: any[]) => any ? K : never;
}[keyof T];
```

Primero mapeamos cada clave a ella misma o a `never`. Luego indexamos con `[keyof T]` para obtener la unión de los valores, y `never` desaparece de la unión resultante.

## `never` en intersecciones

`T & never` siempre es `never`. Esto se usa para prohibir combinaciones: si un parámetro genérico debe ser incompatible con algo, se fuerza una intersección con `never` en caso contrario.

## Diferencias con `void`

- `void` es el tipo de retorno de funciones que no devuelven nada. Una variable de tipo `void` puede contener `undefined` (y `null` con strictNullChecks false).
- `never` no tiene habitantes. Una función que retorna `never` no puede completar; no hay punto de continuación.

## Exhaustividad en reducers

En un reducer de Redux/React, la exhaustividad garantiza que todas las acciones sean manejadas:

```ts
function reducer(estado: Estado, accion: Accion): Estado {
  switch (accion.tipo) {
    case "INCREMENTO": return { valor: estado.valor + 1 };
    case "DECREMENTO": return { valor: estado.valor - 1 };
    default:
      return assertNever(accion);
  }
}
```

Si añadimos `"RESET"` y olvidamos manejarlo, el compilador nos avisará.

## Limitaciones y sutilezas

- TypeScript no realiza exhaustividad en uniones que contienen `any` o cuando las ramas no discriminan correctamente.
- Si la unión incluye tipos con propiedades opcionales que solapan, el análisis puede no reducir a `never`; a veces necesitamos ayudar con un discriminante.
- En versiones antiguas, las propiedades con el mismo nombre pero tipos distintos a veces confunden al compilador. Usar discriminantes claros y únicos soluciona esto.
- El chequeo de exhaustividad no funcionará si la variable es de un tipo demasiado amplio (por ejemplo, `string` en lugar de una unión de literales).

## Usar `never` para prohibir valores

Combinando tipos condicionales, podemos impedir que se pasen ciertos argumentos:

```ts
type Prohibir<T> = T extends string ? never : T;
function soloNumeros<T>(x: Prohibir<T>) { }
soloNumeros(123); // ok
// soloNumeros("abc"); // error
```

Aquí `Prohibir<string>` se evalúa como `never`, y como ningún valor es asignable a `never`, la llamada falla.

---

Cada uno de estos temas profundiza en herramientas que, bien combinadas, permiten modelar invariantes muy potentes en el sistema de tipos. La práctica con ejemplos del mundo real es la mejor forma de interiorizarlos.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Aserciones y narrowing](07-aserciones-y-narrowing.md) | [🏠 Inicio](../index.md) | [Tsconfig basico ▶](../03-configuracion/01-tsconfig-basico.md) |
