# Uniones e intersecciones

Las uniones (`A | B`) y las intersecciones (`A & B`) forman la base del modelado de datos en TypeScript. En esta sección vamos más allá de lo básico: cubrimos distribución en tipos condicionales, conversión entre uniones e intersecciones, uniones discriminadas con exhaustividad estricta y técnicas de _branding_.

## Discriminación y exhaustividad al extremo

Cuando trabajamos con uniones discriminadas, el compilador realiza _narrowing_ automático al comprobar la propiedad discriminante. Para garantizar que hemos cubierto todas las ramas en tiempo de compilación, usamos una comprobación de exhaustividad con `never`.

```ts
type Figura =
  | { tipo: "circulo"; radio: number }
  | { tipo: "rectangulo"; ancho: number; alto: number }
  | { tipo: "triangulo"; base: number; altura: number };

function area(figura: Figura): number {
  switch (figura.tipo) {
    case "circulo":
      return Math.PI * figura.radio ** 2;
    case "rectangulo":
      return figura.ancho * figura.alto;
    case "triangulo":
      return (figura.base * figura.altura) / 2;
    default:
      // El tipo de 'figura' aquí debería ser 'never'
      const _exhaustivo: never = figura;
      throw new Error(`Figura no contemplada: ${_exhaustivo}`);
  }
}
```

Si añadiéramos un nuevo miembro a la unión y olvidáramos su caso en el `switch`, la línea `const _exhaustivo: never = figura` daría un error de compilación porque `figura` no sería `never`. Esta técnica se puede usar con `if/else` encadenados y con funciones auxiliares que usan `assertNever`.

## Distribución de unión en genéricos condicionales

Cuando un tipo condicional recibe un **tipo genérico desnudo** a la izquierda de `extends`, TypeScript distribuye la condición sobre cada miembro de la unión:

```ts
type QuitarUndefined<T> = T extends undefined ? never : T;

// Distribuye
type Resultado = QuitarUndefined<string | undefined | number>; // string | number
```

Internamente, `string | undefined | number` se evalúa como `(string extends undefined ? never : string) | (undefined extends undefined ? never : undefined) | (number extends undefined ? never : number)`, colapsando a `string | never | number` → `string | number`. Para evitar la distribución, envolvemos el tipo genérico en una tupla:

```ts
type NoDistributivo<T> = [T] extends [undefined] ? never : T;
type Resultado2 = NoDistributivo<string | undefined | number>; // string | undefined | number (no distribuye)
```

## De unión a intersección

Un patrón avanzado muy usado en librerías es convertir una unión de tipos en una intersección. Se logra con un tipo condicional distributivo y la posición contravariante de un parámetro de función:

```ts
type UnionToIntersection<U> =
  (U extends any ? (k: U) => void : never) extends (k: infer I) => void
    ? I
    : never;
```

Funcionamiento: `U extends any ? (k: U) => void : never` distribuye `U`, creando una unión de funciones `((k: A) => void) | ((k: B) => void)`. Luego, al pedir `infer I` en posición contravariante, el compilador infiere la intersección `A & B`. Esto se utiliza en tipos como `Merge` de múltiples objetos o en el tipado de `Object.assign`.

## Intersecciones con propiedades conflictivas

Cuando intersectamos dos tipos con propiedades del mismo nombre pero tipos incompatibles, el tipo resultante para esa propiedad es `never`. Esto puede aprovecharse para detectar conflictos.

```ts
type A = { x: string };
type B = { x: number };
type AB = A & B;
let obj: AB = { x: ??? }; // x debe ser string & number, es decir, never → no hay valor posible.
```

Así, la intersección actúa como restricción estricta. Para combinar objetos con propiedades comunes, es mejor usar tipos mapeados con uniones de las claves y sobreescribir.

## Branded types (tipos nominales simulados)

TypeScript es estructural, pero mediante intersecciones con una propiedad única (marca) podemos crear tipos nominales opacos:

```ts
type UserID = string & { __brand: "UserID" };
type ProductID = string & { __brand: "ProductID" };

function getUser(id: UserID) { /* ... */ }

const userId = "abc123" as UserID;
getUser(userId); // ok
// getUser("abc123"); // error si no hay aserción
```

La marca no existe en runtime; es solo para el compilador. Esto evita mezclar identificadores incompatibles aunque compartan el mismo primitivo.

## Uniones de tipos de función

Una unión de funciones es llamable, pero con una firma que es la intersección de los parámetros y la unión de los retornos. Esto puede resultar confuso:

```ts
declare function f1(a: string): number;
declare function f2(a: number): string;
let fn: typeof f1 | typeof f2;
// Parámetros: string & number -> never, por lo que no se puede llamar sin una sobrecarga apropiada.
```

Para manejar esto se recurre a sobrecargas o a genéricos condicionales.

## Uso con tipos mapeados: uniones discriminadas como fuente

Al iterar sobre una unión de objetos con `keyof` o con tipos mapeados podemos crear tipos poderosos. Por ejemplo, dada una unión discriminada, obtener un tipo con todas las combinaciones válidas de propiedades.

## Conclusión

Las uniones y las intersecciones son mucho más que operadores lógicos: con distribución, conversión e intersecciones de funciones forman un lenguaje de tipos expresivo que permite modelar casi cualquier restricción en tiempo de compilación.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Enums](../01-fundamentos/08-enums.md) | [🏠 Inicio](../index.md) | [Tipos condicionales ▶](02-tipos-condicionales.md) |
