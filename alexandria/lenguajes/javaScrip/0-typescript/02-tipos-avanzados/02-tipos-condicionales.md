# Tipos condicionales

Los tipos condicionales son la herramienta definitiva para crear lógica de tipos en TypeScript. Permiten elegir entre dos ramas basándose en una comprobación de asignabilidad.

## Sintaxis y distribución

La forma básica es `T extends U ? X : Y`. Si `T` es un parámetro de tipo **desnudo** (sin envolver en tuplas, arrays u otros), TypeScript distribuye automáticamente sobre una unión, evaluando la condición para cada miembro. Ya vimos su uso para `Exclude<T, U>`.

Ejemplo de implementación de `Exclude`:

```ts
type Exclude<T, U> = T extends U ? never : T;
type SinNull = Exclude<string | number | null, null>; // string | number
```

Si necesitamos la condición evaluada sobre toda la unión sin distribuir, envolvemos `T` y `U` en tuplas:

```ts
type NonDistributiveExtract<T, U> = [T] extends [U] ? T : never;
```

## Uso de `infer`

La palabra clave `infer` permite capturar una parte del tipo que se está comprobando. Solo puede usarse dentro de la cláusula `extends` de un tipo condicional.

```ts
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never;
type Func = () => string;
type R = ReturnType<Func>; // string
```

Podemos tener múltiples `infer` en la misma cláusula y TypeScript los empareja secuencialmente. Por ejemplo, para extraer el tipo de un array:

```ts
type ElementType<T> = T extends (infer U)[] ? U : never;
```

Para promesas profundas, `Awaited<T>` (TS 4.5) usa inferencia recursiva.

## Varios candidatos producen unión

Cuando un tipo condicional con `infer` se aplica a una unión, y hay múltiples sitios donde se podría inferir, TypeScript produce una unión de los resultados:

```ts
type Foo<T> = T extends { a: infer U; b: infer U } ? U : never;
type T = Foo<{ a: string; b: number }>; // string | number
```

## Recursión en tipos condicionales

Desde TypeScript 4.1, los tipos condicionales pueden referenciarse a sí mismos, permitiendo recorrer estructuras anidadas:

```ts
type DeepReadonly<T> = T extends object
  ? { readonly [K in keyof T]: DeepReadonly<T[K]> }
  : T;
```

Hay que tener cuidado con la profundidad; el compilador limita la recursión (normalmente a 50 niveles) para evitar bucles infinitos.

## Aplicaciones comunes

- **`NonNullable<T>`**: `T extends null | undefined ? never : T`
- **`Flatten<T>`**: `T extends Array<infer U> ? U : T`
- **`Merge<A, B>`**: combina dos objetos sin perder propiedades.
- **Filtrar claves por tipo de valor**:

```ts
type PickByValue<T, V> = {
  [K in keyof T as T[K] extends V ? K : never]: T[K]
};
```

## Tipos condicionales y sobrecargas de funciones

Permiten emular el comportamiento de múltiples firmas sin sobrecargas explícitas. Por ejemplo, un tipo que devuelve el tipo del elemento si es array, y el mismo tipo si no:

```ts
type Unpack<T> = T extends (infer U)[] ? U : T;
declare function unpack<T>(val: T): Unpack<T>;
```

El tipo de retorno cambia según la entrada, y TypeScript lo sigue perfectamente.

## Evaluación lazy

Los tipos condicionales evalúan la rama `X` o `Y` solo cuando se conoce la condición. Si la rama descartada contiene referencias inválidas (por ejemplo, `T["length"]` cuando T no tiene length), no causará error a menos que se alcance.

## Combinación con template literal types

Podemos usar `infer` dentro de un template literal para analizar cadenas en tiempo de compilación:

```ts
type RouteParam<Path extends string> =
  Path extends `${string}:${infer Param}/${infer Rest}`
    ? Param | RouteParam<Rest>
    : Path extends `${string}:${infer Param}`
      ? Param
      : never;
type Params = RouteParam<"/user/:id/post/:postId">; // "id" | "postId"
```

Esto abre la puerta a routers tipados y parsing de strings.

## Buenas prácticas

- Evita la distribución accidental envolviendo el tipo en una tupla cuando sea necesario.
- Usa `never` para descartar ramas en uniones.
- Prefiere tipos condicionales con `infer` frente a overloading manual cuando la lógica es compleja.
- Documenta los condicionales complejos; su lectura puede ser densa.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Uniones e intersecciones](01-uniones-e-intersecciones.md) | [🏠 Inicio](../index.md) | [Tipos mapeados ▶](03-tipos-mapeados.md) |
