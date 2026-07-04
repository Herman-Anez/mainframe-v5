# Tipos indexados

Los tipos indexados (`Indexed Access Types`) permiten obtener el tipo de una propiedad de otro tipo, usando la sintaxis `T[K]`, similar a la notación de corchetes de JavaScript pero en el nivel de tipos.

## Sintaxis básica

```ts
type Persona = { nombre: string; edad: number };
type Nombre = Persona["nombre"]; // string
type Edad = Persona["edad"];     // number
```

`K` debe ser una clave válida de `T`, es decir, debe cumplir `K extends keyof T`. En el ejemplo, `"nombre"` y `"edad"` son literales que pertenecen a `keyof Persona`.

## Uso con uniones de claves

Si `K` es una unión de literales, el tipo resultante es la unión de los tipos de esas propiedades:

```ts
type Ambas = Persona["nombre" | "edad"]; // string | number
```

Esto es increíblemente útil para extraer el tipo de varias propiedades de una vez.

## Uso con `keyof`

Podemos usar `keyof T` directamente para obtener una unión de todos los tipos de las propiedades:

```ts
type ValoresDePersona = Persona[keyof Persona]; // string | number
```

Este patrón es la base de `ValueOf<T>`.

## Indexado con tipos numéricos: arrays y tuplas

Para arrays, la clave `number` permite acceder al tipo de los elementos:

```ts
type Arr = string[];
type Elemento = Arr[number]; // string
```

En tuplas, además de `number`, podemos usar literales numéricos para acceder a una posición concreta:

```ts
type Tupla = [string, number, boolean];
type Segundo = Tupla[1]; // number
type Longitud = Tupla["length"]; // 3 (tipo literal)
```

El acceso a `length` devuelve un tipo literal numérico, lo que permite cálculos con tipos numéricos literales.

## Acceso profundo

Se puede encadenar el indexado: `T[K][L]`.

```ts
type Empresa = { empleado: { nombre: string; puesto: string } };
type Puesto = Empresa["empleado"]["puesto"]; // string
```

## Indexado con tipos genéricos

El verdadero poder aparece con genéricos:

```ts
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}
const persona = { nombre: "Ana", edad: 30 };
const nombre: string = getProperty(persona, "nombre"); // string
```

TypeScript infiere `K` como el literal `"nombre"` y el tipo de retorno como `string`. Esto garantiza que la clave existe y que el tipo retornado coincide.

## Indexado en tipos mapeados

Los tipos mapeados usan `keyof` implícitamente, y a menudo combinamos indexado dentro de los mapeos:

```ts
type Readonly<T> = { readonly [K in keyof T]: T[K] };
```

## Extraer tipos de un objeto constantemente tipado

Con `typeof` y `as const` podemos obtener el tipo de una variable y luego indexarlo:

```ts
const routes = {
  home: "/home",
  profile: "/profile/:id",
} as const;

type RoutePaths = (typeof routes)[keyof typeof routes]; // "/home" | "/profile/:id"
```

## Limitaciones

- No se puede indexar un tipo con una clave que no sea conocida en tiempo de compilación.
- Si `T` es una unión, `T[K]` distribuye sobre la unión, lo que puede producir resultados extensos; a veces es necesario acotar.
- `T[K]` solo puede leer; para escribir tipos necesitamos mapeos o tipos condicionales.

## Casos de uso avanzados

- **Lookup types en librerías**: define tipos de configuración centralizados y accede a fragmentos con tipos indexados.
- **`Pick` y `Omit`** se implementan con tipos indexados y `keyof`.
- **Renombrar propiedades** combinando tipos mapeados con indexados.
- **Crear tipos de eventos**: dado un mapeo `{ click: MouseEvent; keydown: KeyboardEvent }`, `EventMap["click"]` da el tipo correcto para el handler.

Dominar los tipos indexados permite escribir APIs genéricas que respetan la forma exacta de los datos sin perder información.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Infer y extract](05-infer-y-extract.md) | [🏠 Inicio](../index.md) | [Aserciones y narrowing ▶](07-aserciones-y-narrowing.md) |
