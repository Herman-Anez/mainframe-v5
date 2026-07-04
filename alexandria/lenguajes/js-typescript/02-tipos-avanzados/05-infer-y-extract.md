# Infer y extract

La palabra clave `infer` y las utilidades `Extract` / `Exclude` son el corazón de la lógica de tipos avanzada en TypeScript. Permiten *extraer* información de otros tipos y tomar decisiones condicionales.

## `infer` en tipos condicionales

`infer` solo puede aparecer dentro de la cláusula `extends` de un tipo condicional. Sirve para declarar una variable de tipo que será inferida por el compilador a partir de una posición estructural.

```ts
type ElementoDeArray<T> = T extends (infer U)[] ? U : never;
type R = ElementoDeArray<string[]>; // string
```

El compilador empareja el patrón `(infer U)[]` contra `string[]`, deduce que `U` debe ser `string` y lo usa en la rama verdadera.

### Posiciones múltiples de `infer`

Se pueden colocar varios `infer` en un mismo patrón. Si aparecen en posiciones *covariantes* (como los tipos de retorno), TypeScript infiere una **unión** de los candidatos. Si aparecen en posiciones *contravariantes* (parámetros de función), infiere una **intersección**.

```ts
type Covarianza<T> = T extends { a: infer U; b: infer U } ? U : never;
type R1 = Covarianza<{ a: string; b: number }>; // string | number

type Contravarianza<T> = T extends { a: (x: infer U) => void; b: (x: infer U) => void } ? U : never;
type R2 = Contravarianza<{ a: (x: string) => void; b: (x: number) => void }>; // string & number (es decir, never)
```

Esta diferencia es fundamental para herramientas como `UnionToIntersection`.

### Inferencia en funciones

Los tipos utilitarios del sistema se basan en `infer`:

- `ReturnType<T>`: `T extends (...args: any[]) => infer R ? R : never`
- `Parameters<T>`: `T extends (...args: infer P) => any ? P : never`
- `ConstructorParameters<T>`: `T extends new (...args: infer P) => any ? P : never`
- `InstanceType<T>`: `T extends new (...args: any[]) => infer R ? R : never`
- `ThisParameterType<T>`: `T extends (this: infer U, ...args: any[]) => any ? U : unknown`
- `OmitThisParameter<T>`: elimina el parámetro `this` de la firma.

```ts
type Fn = (a: number, b: string) => boolean;
type P = Parameters<Fn>; // [a: number, b: string]
type R = ReturnType<Fn>; // boolean
```

### Inferencia en template literal types

`infer` combinado con TLT permite parsear cadenas en tiempo de compilación:

```ts
type RutaParam<Path extends string> =
  Path extends `${string}:${infer Param}/${infer Rest}`
    ? Param | RutaParam<Rest>
    : Path extends `${string}:${infer Param}`
      ? Param
      : never;
```

Puede extraer múltiples segmentos con recursión.

### Inferencia y sobrecargas de funciones

Cuando se aplica `ReturnType` o `Parameters` a una función con múltiples firmas de sobrecarga, TypeScript infiere a partir de la **última** firma de la sobrecarga (la implementación más genérica). Esto puede dar resultados inesperados. Para obtener la firma más específica, se necesitan técnicas más complejas (intersectar las firmas o usar tipos condicionales distributivos sobre las firmas).

### `Extract` y `Exclude`

Son dos tipos utilitarios construidos sobre tipos condicionales distributivos.

- `Exclude<T, U>`: quita de `T` los miembros que son asignables a `U`.
  ```ts
  type Exclude<T, U> = T extends U ? never : T;
  type SinNull = Exclude<string | number | null, null>; // string | number
  ```
- `Extract<T, U>`: extrae de `T` los miembros que son asignables a `U`.
  ```ts
  type Extract<T, U> = T extends U ? T : never;
  type SoloNumeros = Extract<string | number | boolean, number>; // number
  ```

Ambos distribuyen sobre `T`. Se usan para filtrar uniones.

### `NonNullable<T>`

Es `Exclude<T, null | undefined>`. Elimina `null` y `undefined` de la unión.

```ts
type T = NonNullable<string | null | undefined>; // string
```

### Combinaciones avanzadas con `infer`

- **`Awaited<T>`** (TS 4.5): desenvuelve promesas recursivamente, usando `infer` anidado.
  ```ts
  type Awaited<T> = T extends null | undefined
    ? T
    : T extends object & { then(onfulfilled: infer F): any }
      ? F extends (value: infer V, ...args: any) => any
        ? Awaited<V>
        : never
      : T;
  ```
- **`DeepReturnType`**: extrae el retorno incluso dentro de funciones anidadas.
- **Extraer el tipo de un `Map`**: `type ValueOfMap<M> = M extends Map<any, infer V> ? V : never;`
- **Extraer el tipo de una promesa rechazada**: con `Promise<infer T>`.

### Evitar la distribución accidental

Si no queremos que `Exclude` distribuya, envolvemos `T` en una tupla:

```ts
type ExcludeNoDist<T, U> = [T] extends [U] ? never : T;
```

### Buenas prácticas

- Usa `infer` para capturar partes de un tipo y generar nuevos tipos.
- Prefiere las utilidades predefinidas (`ReturnType`, `Parameters`, etc.) antes que escribir la inferencia manual.
- Documenta los condicionales complejos; la sintaxis de `infer` puede oscurecer la intención.
- Ten cuidado con la recursión ilimitada; marca límites cuando sea necesario.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Template literal types](04-template-literal-types.md) | [🏠 Inicio](../index.md) | [Tipos indexados ▶](06-tipos-indexados.md) |
