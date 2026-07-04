# Tipos utilitarios

TypeScript incluye un conjunto de **tipos utilitarios predefinidos** que realizan transformaciones comunes sobre tipos existentes. Conocerlos y saber combinarlos es esencial para escribir tipos mantenibles. Además, veremos patrones de utilidades personalizadas que extienden estas capacidades.

## Modificadores de propiedades

### `Partial<T>`

Convierte todas las propiedades de `T` en opcionales.

```ts
interface Usuario {
  nombre: string;
  edad: number;
  email: string;
}

type UsuarioParcial = Partial<Usuario>;
// { nombre?: string; edad?: number; email?: string }
```

**Implementación manual**:
```ts
type Partial<T> = { [P in keyof T]?: T[P] };
```

### `Required<T>`

Lo opuesto a `Partial`: hace que todas las propiedades sean obligatorias.

```ts
type UsuarioCompleto = Required<UsuarioParcial>;
// { nombre: string; edad: number; email: string }
```

**Implementación**:
```ts
type Required<T> = { [P in keyof T]-?: T[P] };
```

El `-?` elimina la opcionalidad.

### `Readonly<T>`

Convierte todas las propiedades en solo lectura.

```ts
type UsuarioReadonly = Readonly<Usuario>;
// { readonly nombre: string; readonly edad: number; readonly email: string }
```

**Implementación**:
```ts
type Readonly<T> = { readonly [P in keyof T]: T[P] };
```

### `Mutable<T>` (custom)

Elimina el modificador `readonly` de un tipo.

```ts
type Mutable<T> = { -readonly [P in keyof T]: T[P] };
```

## Selección de propiedades

### `Pick<T, K>`

Extrae un subconjunto de propiedades `K` de `T`.

```ts
type TarjetaUsuario = Pick<Usuario, "nombre" | "email">;
// { nombre: string; email: string }
```

**Implementación**:
```ts
type Pick<T, K extends keyof T> = { [P in K]: T[P] };
```

### `Omit<T, K>`

Excluye las propiedades `K` de `T`.

```ts
type UsuarioSinEmail = Omit<Usuario, "email">;
// { nombre: string; edad: number }
```

**Implementación** (usando `Pick` y `Exclude`):
```ts
type Omit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>;
```

## Construcción de objetos

### `Record<K, T>`

Crea un tipo con claves `K` y valores `T`.

```ts
type Paginas = "home" | "about" | "contact";
type Navegacion = Record<Paginas, { url: string; titulo: string }>;
// { home: {...}; about: {...}; contact: {...} }
```

**Implementación**:
```ts
type Record<K extends keyof any, T> = { [P in K]: T };
```

## Filtrado de uniones

### `Exclude<T, U>`

Elimina de `T` los miembros que son asignables a `U`.

```ts
type T = Exclude<"a" | "b" | "c", "a" | "b">; // "c"
type SinNull = Exclude<string | null | undefined, null | undefined>; // string
```

**Implementación**:
```ts
type Exclude<T, U> = T extends U ? never : T;
```

### `Extract<T, U>`

Extrae los miembros de `T` que son asignables a `U`.

```ts
type SoloStrings = Extract<string | number | boolean, string>; // string
```

**Implementación**:
```ts
type Extract<T, U> = T extends U ? T : never;
```

### `NonNullable<T>`

Elimina `null` y `undefined` de `T`.

```ts
type T = NonNullable<string | null | undefined>; // string
```

**Implementación**:
```ts
type NonNullable<T> = T & {};  // forma corta moderna
// o usando Exclude
type NonNullable<T> = Exclude<T, null | undefined>;
```

## Obtención de tipos de funciones

### `ReturnType<T>`

Obtiene el tipo de retorno de una función.

```ts
function createUser() {
  return { name: "Ana", age: 30 };
}
type User = ReturnType<typeof createUser>; // { name: string; age: number }
```

### `Parameters<T>`

Obtiene el tipo de los parámetros de una función como tupla.

```ts
function saveUser(name: string, age: number): void {}
type SaveParams = Parameters<typeof saveUser>; // [name: string, age: number]
```

### `ConstructorParameters<T>`

Parámetros del constructor de una clase.

```ts
class Usuario {
  constructor(public nombre: string, public edad: number) {}
}
type ParamsCtor = ConstructorParameters<typeof Usuario>; // [string, number]
```

### `InstanceType<T>`

Tipo de la instancia de una clase constructora.

```ts
type InstanciaUsuario = InstanceType<typeof Usuario>; // Usuario
```

### `ThisParameterType<T>` y `OmitThisParameter<T>`

Extraen o eliminan el parámetro `this` de una función.

```ts
function fn(this: { nombre: string }, x: number) {}
type ThisCtx = ThisParameterType<typeof fn>; // { nombre: string }
type FnSinThis = OmitThisParameter<typeof fn>; // (x: number) => void
```

## Tipos para promesas y encadenamiento

### `Awaited<T>`

Desenvuelve promesas recursivamente (TS 4.5+).

```ts
type A = Awaited<Promise<string>>; // string
type B = Awaited<Promise<Promise<number>>>; // number
```

## Manipulación de strings mediante tipos intrínsecos

Estos tipos están integrados en el compilador y no tienen una implementación visible.

```ts
type Saludo = "hola";
type Gritando = Uppercase<Saludo>;        // "HOLA"
type Susurrando = Lowercase<"TYPESCRIPT">; // "typescript"
type Capitalizado = Capitalize<Saludo>;    // "Hola"
type Decapitalizado = Uncapitalize<"Hola">; // "hola"
```

## Utilidades para contexto de prueba (TS 5.4+)

### `NoInfer<T>`

Bloquea la inferencia del parámetro genérico en ese sitio.

```ts
function crearElemento<T>(etiqueta: string, contenido: T, extra: NoInfer<T>): void {}
crearElemento("div", 42, 100); // OK, extra no influye en inferencia
crearElemento("div", 42, "texto"); // Error: string no asignable a number
```

## Colección de utilidades personalizadas

### `DeepPartial<T>`

Hace todas las propiedades de todos los niveles opcionales.

```ts
type DeepPartial<T> = T extends object
  ? { [P in keyof T]?: DeepPartial<T[P]> }
  : T;
```

### `DeepRequired<T>`

Lo opuesto.

```ts
type DeepRequired<T> = T extends object
  ? { [P in keyof T]-?: DeepRequired<T[P]> }
  : T;
```

### `DeepReadonly<T>`

```ts
type DeepReadonly<T> = T extends object
  ? { readonly [P in keyof T]: DeepReadonly<T[P]> }
  : T;
```

### `NonNullableKeys<T>`

Obtiene solo las claves que no aceptan `null | undefined`.

```ts
type NonNullableKeys<T> = {
  [K in keyof T]: T[K] extends null | undefined ? never : K;
}[keyof T];
```

### `Merge<T, U>`

Combina dos objetos dando prioridad a `U` en caso de conflicto.

```ts
type Merge<T, U> = Omit<T, keyof U> & U;
```

### `ValueOf<T>`

Obtiene la unión de todos los tipos de valor de un objeto.

```ts
type ValueOf<T> = T[keyof T];
```

### `Override<T, U>`

Sobrescribe las propiedades de `T` con las de `U` pero manteniendo las que no existen en `U`.

```ts
type Override<T, U> = Omit<T, keyof U> & U;
```

> [!NOTE]
> **Nota**: Hay infinitas variaciones; estas son las más utilizadas. Los tipos mapeados, condicionales e `infer` permiten construir cualquier transformación que necesites.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ `ejemplos/12-tsconfig/`](../cheatsheets/12-ejemplos12-tsconfig.md) | [🏠 Inicio](../index.md) | [Configuracion rapida ▶](02-configuracion-rapida.md) |
