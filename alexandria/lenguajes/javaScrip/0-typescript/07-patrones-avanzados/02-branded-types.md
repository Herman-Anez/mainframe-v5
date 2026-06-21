# Branded types

TypeScript emplea un sistema de tipos **estructural**: dos tipos son compatibles si tienen la misma forma, no si comparten el mismo nombre. Para cuando necesitamos distinguir tipos que son estructuralmente idénticos pero semánticamente distintos (ej. un `UserId` de un `ProductId`, ambos `string`), se utilizan los **branded types** (tipos de marca o *opacos*).

## El problema

```ts
type UserId = string;
type ProductId = string;

function getUser(id: UserId) { /* ... */ }

const productId: ProductId = "abc";
getUser(productId); // No hay error, pero semánticamente es incorrecto.
```

Ambos son `string` y por tanto intercambiables. Queremos evitar que un ID de producto se pase donde se espera un ID de usuario.

## Creación de una marca

Se crea un tipo mediante una intersección con un objeto que contiene una propiedad única (la marca). Esta propiedad no existe realmente en tiempo de ejecución, solo en el sistema de tipos.

### Marca con `__brand`

```ts
type UserId = string & { __brand: "UserID" };
type ProductId = string & { __brand: "ProductID" };
```

Para crear un valor de ese tipo se necesita una **aserción de tipo** (casting) porque el objeto literal no incluye la marca:

```ts
const userId = "usr-123" as UserId;
const productId = "prd-456" as ProductId;

getUser(userId); // OK
// getUser(productId); // Error: ProductId no es asignable a UserId
```

La marca es puramente en tiempo de compilación; en runtime es un string normal.

### Marca con un `unique symbol`

```ts
declare const brand: unique symbol;
type UserId = string & { [brand]: "UserID" };
```

Esto impide colisiones accidentales porque el símbolo es único. Es la variante más segura.

### Marca mediante interfaz con un símbolo privado

Otra técnica es usar una interfaz con un campo privado (no emitido) y luego intersectar:

```ts
interface UserBrand {
  __userBrand: never;
}
type UserId = string & UserBrand;
```

`never` impide que se pueda asignar algún valor a esa propiedad.

## Validación y creación segura

Para evitar el uso indiscriminado de `as`, se puede crear una función constructora que valide en runtime y retorne el tipo marcado:

```ts
function createUserId(id: string): UserId | null {
  if (/^usr-\d+$/.test(id)) {
    return id as UserId;
  }
  return null;
}
```

O usando un type predicate:

```ts
function isUserId(id: string): id is UserId {
  return id.startsWith("usr-");
}
```

## Uso con genéricos

Los branded types pueden combinarse con genéricos para crear familias de tipos opacos:

```ts
type Brand<T, B> = T & { __brand: B };
type Id<T> = Brand<string, T>;

type UserId = Id<"User">;
type ProductId = Id<"Product">;
```

## Casos de uso típicos

- **Identificadores** (UserId, OrderId).
- **Unidades de medida** (Meters, Miles, Celsius, Fahrenheit) para evitar mezclar magnitudes.
- **Valores validados** (Email, URL, NonEmptyString) que garantizan que el dato pasó una validación.
- **Tokens y claves** para no confundir tokens de acceso con tokens de refresco.

## Limitaciones

- No hay protección en tiempo de ejecución; si un valor cruza de JS sin validar, el compilador no lo sabrá.
- Las operaciones con primitivos se pierden a menos que se sobrecarguen (no puedes sumar dos `Meters` a menos que definas funciones específicas).
- Los tipos de marca pueden ser molestos cuando necesitas interoperar con librerías que esperan `string`. Se debe hacer conversión explícita.

## Alternativas

- **Flavoring**: similar a branding pero usando una intersección con un tipo con una propiedad opcional, lo que hace la conversión más laxa.
- **Nuevos tipos en ES?** No hay aún; los branded types son el estándar de facto en TypeScript.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Discriminated union](01-discriminated-union.md) | [🏠 Inicio](../index.md) | [Mixins ▶](03-mixins.md) |
