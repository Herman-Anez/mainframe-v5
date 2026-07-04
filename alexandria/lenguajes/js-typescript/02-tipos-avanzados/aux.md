## 01-uniones-e-intersecciones.md

Las uniones (`A | B`) y las intersecciones (`A & B`) forman la base del modelado de datos en TypeScript. En esta sección vamos más allá de lo básico: cubrimos distribución en tipos condicionales, conversión entre uniones e intersecciones, uniones discriminadas con exhaustividad estricta y técnicas de _branding_.

### Discriminación y exhaustividad al extremo

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

### Distribución de unión en genéricos condicionales

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

### De unión a intersección

Un patrón avanzado muy usado en librerías es convertir una unión de tipos en una intersección. Se logra con un tipo condicional distributivo y la posición contravariante de un parámetro de función:

```ts
type UnionToIntersection<U> =
  (U extends any ? (k: U) => void : never) extends (k: infer I) => void
    ? I
    : never;
```

Funcionamiento: `U extends any ? (k: U) => void : never` distribuye `U`, creando una unión de funciones `((k: A) => void) | ((k: B) => void)`. Luego, al pedir `infer I` en posición contravariante, el compilador infiere la intersección `A & B`. Esto se utiliza en tipos como `Merge` de múltiples objetos o en el tipado de `Object.assign`.

### Intersecciones con propiedades conflictivas

Cuando intersectamos dos tipos con propiedades del mismo nombre pero tipos incompatibles, el tipo resultante para esa propiedad es `never`. Esto puede aprovecharse para detectar conflictos.

```ts
type A = { x: string };
type B = { x: number };
type AB = A & B;
let obj: AB = { x: ??? }; // x debe ser string & number, es decir, never → no hay valor posible.
```

Así, la intersección actúa como restricción estricta. Para combinar objetos con propiedades comunes, es mejor usar tipos mapeados con uniones de las claves y sobreescribir.

### Branded types (tipos nominales simulados)

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

### Uniones de tipos de función

Una unión de funciones es llamable, pero con una firma que es la intersección de los parámetros y la unión de los retornos. Esto puede resultar confuso:

```ts
declare function f1(a: string): number;
declare function f2(a: number): string;
let fn: typeof f1 | typeof f2;
// Parámetros: string & number -> never, por lo que no se puede llamar sin una sobrecarga apropiada.
```

Para manejar esto se recurre a sobrecargas o a genéricos condicionales.

### Uso con tipos mapeados: uniones discriminadas como fuente

Al iterar sobre una unión de objetos con `keyof` o con tipos mapeados podemos crear tipos poderosos. Por ejemplo, dada una unión discriminada, obtener un tipo con todas las combinaciones válidas de propiedades.

### Conclusión

Las uniones y las intersecciones son mucho más que operadores lógicos: con distribución, conversión e intersecciones de funciones forman un lenguaje de tipos expresivo que permite modelar casi cualquier restricción en tiempo de compilación.

---

## 02-tipos-condicionales.md

Los tipos condicionales son la herramienta definitiva para crear lógica de tipos en TypeScript. Permiten elegir entre dos ramas basándose en una comprobación de asignabilidad.

### Sintaxis y distribución

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

### Uso de `infer`

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

### Varios candidatos producen unión

Cuando un tipo condicional con `infer` se aplica a una unión, y hay múltiples sitios donde se podría inferir, TypeScript produce una unión de los resultados:

```ts
type Foo<T> = T extends { a: infer U; b: infer U } ? U : never;
type T = Foo<{ a: string; b: number }>; // string | number
```

### Recursión en tipos condicionales

Desde TypeScript 4.1, los tipos condicionales pueden referenciarse a sí mismos, permitiendo recorrer estructuras anidadas:

```ts
type DeepReadonly<T> = T extends object
  ? { readonly [K in keyof T]: DeepReadonly<T[K]> }
  : T;
```

Hay que tener cuidado con la profundidad; el compilador limita la recursión (normalmente a 50 niveles) para evitar bucles infinitos.

### Aplicaciones comunes

- **`NonNullable<T>`**: `T extends null | undefined ? never : T`
- **`Flatten<T>`**: `T extends Array<infer U> ? U : T`
- **`Merge<A, B>`**: combina dos objetos sin perder propiedades.
- **Filtrar claves por tipo de valor**:

```ts
type PickByValue<T, V> = {
  [K in keyof T as T[K] extends V ? K : never]: T[K]
};
```

### Tipos condicionales y sobrecargas de funciones

Permiten emular el comportamiento de múltiples firmas sin sobrecargas explícitas. Por ejemplo, un tipo que devuelve el tipo del elemento si es array, y el mismo tipo si no:

```ts
type Unpack<T> = T extends (infer U)[] ? U : T;
declare function unpack<T>(val: T): Unpack<T>;
```

El tipo de retorno cambia según la entrada, y TypeScript lo sigue perfectamente.

### Evaluación lazy

Los tipos condicionales evalúan la rama `X` o `Y` solo cuando se conoce la condición. Si la rama descartada contiene referencias inválidas (por ejemplo, `T["length"]` cuando T no tiene length), no causará error a menos que se alcance.

### Combinación con template literal types

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

### Buenas prácticas

- Evita la distribución accidental envolviendo el tipo en una tupla cuando sea necesario.
- Usa `never` para descartar ramas en uniones.
- Prefiere tipos condicionales con `infer` frente a overloading manual cuando la lógica es compleja.
- Documenta los condicionales complejos; su lectura puede ser densa.

---

## 03-tipos-mapeados.md

Los tipos mapeados transforman cada propiedad de un tipo existente en un nuevo tipo. Son la base de utilidades como `Partial`, `Readonly`, `Pick` y `Record`, y permiten crear variantes complejas.

### Sintaxis completa

```ts
type Mapeado<T> = {
  [K in keyof T]: NuevoTipo;
};
```

- `keyof T` produce una unión de claves.
- Podemos aplicar modificadores `readonly` y `?` (opcional). Para **añadir** o **quitar** estos modificadores usamos los prefijos `+`/`-` (por defecto `+`).

```ts
type Total<T> = {
  [K in keyof T]-?: T[K];       // elimina opcionalidad
};
type Inmutable<T> = {
  +readonly [K in keyof T]: T[K]; // añade readonly (el + es opcional)
};
```

### Mapeado homomórfico vs no homomórfico

Un tipo mapeado es **homomórfico** cuando itera sobre `keyof T` directamente. Esto preserva los modificadores originales de las propiedades (excepto si los sobrescribes explícitamente). Los tipos `Partial`, `Required` y `Readonly` son homomórficos.

Si construimos un mapeado sobre un conjunto de claves genérico (por ejemplo `[K in SomeUnion]`), no hay homomorfismo y no se copian modificadores; el nuevo tipo se comporta como un `Record`.

```ts
type Keys = "a" | "b";
type NoHomomorfico = { [K in Keys]: string }; // { a: string; b: string; }
```

### Key remapping (remapeo de claves) con `as`

Desde TS 4.1 podemos transformar las claves usando la cláusula `as`:

```ts
type Getters<T> = {
  [K in keyof T as `get${Capitalize<K & string>}`]: () => T[K]
};
```

Si la expresión después de `as` resulta `never`, la clave se **excluye** del mapeado. Esto permite filtrar propiedades:

```ts
type SoloFunciones<T> = {
  [K in keyof T as T[K] extends (...args: any) => any ? K : never]: T[K]
};
```

### Mapeado con tipos condicionales en valores

El tipo del valor puede ser cualquier cosa, incluyendo tipos condicionales que dependan de `T[K]`:

```ts
type Nullable<T> = {
  [K in keyof T]: T[K] | null;
};
type Parseado<T> = {
  [K in keyof T]: T[K] extends string ? number : T[K];
};
```

### Mapeado sobre tuplas y arrays

Las tuplas y arrays también pueden ser mapeados (son objetos con claves numéricas y `length`). Podemos usar `keyof` para iterar sobre `number` y los métodos. Para mapear solo los elementos, usamos `[K in keyof T & number]`. TypeScript 4.0+ permite mapear sobre tuplas preservando su estructura:

```ts
type MapTuple<T extends readonly any[], F> = {
  [K in keyof T]: F<T[K]>;
};
type Mapped = MapTuple<[string, number], <X>(x: X) => X[]>; // [[string], [number]]
```

### Mapped types y `symbol`/`number`

Las claves `symbol` y `number` se incluyen en `keyof T`. A menudo queremos operar solo sobre claves `string`. Podemos filtrar con `K & string` en el remapeo.

### Built-ins que debes dominar

- `Partial<T>`: todas las propiedades opcionales.
- `Required<T>`: todas requeridas.
- `Readonly<T>`: todas readonly.
- `Pick<T, K>`: selecciona un subconjunto de propiedades.
- `Omit<T, K>`: excluye propiedades. Implementado con `Pick<T, Exclude<keyof T, K>>`.
- `Record<K, T>`: construye un tipo con claves `K` y valores `T`. No es homomórfico.

### Mapeados profundos

Para hacer un `DeepPartial` o `DeepReadonly` necesitamos recursión condicional, combinando tipos condicionales y mapeados:

```ts
type DeepPartial<T> = T extends object
  ? { [K in keyof T]?: DeepPartial<T[K]> }
  : T;
```

### Consideraciones de rendimiento

Los mapeados sobre tipos con muchas propiedades (cientos) o muy profundos pueden ralentizar el compilador. Es recomendable evitar recursiones excesivas y usar `interface` cuando sea posible (aunque las interfaces no soportan mapeado dinámico, a veces una combinación reduce complejidad).

### Mapeados y union types

Cuando iteras sobre `keyof (A | B)`, obtienes solo las claves comunes. Para mapear una unión de objetos y conservar la discriminación se usan tipos condicionales distributivos que devuelven objetos mapeados por separado.

---

## 04-template-literal-types.md

Los template literal types (TLT) llevan la manipulación de cadenas al sistema de tipos. Combinados con uniones y `infer`, permiten parsear y generar identificadores en tiempo de compilación.

### Sintaxis y distribución

Un TLT se escribe como una plantilla de cadena dentro de un tipo:

```ts
type Saludo = `Hola, ${string}`;
type Eventos = "click" | "focus";
type Controladores = `on${Capitalize<Eventos>}`; // "onClick" | "onFocus"
```

Cuando interpolamos una **unión**, el TLT distribuye automáticamente, produciendo una unión de todas las combinaciones. Si interpolamos múltiples uniones, obtenemos el producto cartesiano:

```ts
type Vertical = "top" | "bottom";
type Horizontal = "left" | "right";
type Posicion = `${Vertical}-${Horizontal}`;
// "top-left" | "top-right" | "bottom-left" | "bottom-right"
```

### Manipulación de mayúsculas/minúsculas

Cuatro tipos intrínsecos (no tienen implementación, son directivas del compilador):

- `Uppercase<S>`
- `Lowercase<S>`
- `Capitalize<S>`
- `Uncapitalize<S>`

Son esenciales para normalizar cadenas en remapeo de claves o en validaciones.

### Pattern matching con `infer`

Dentro de un tipo condicional, podemos usar `infer` en un TLT para descomponer cadenas:

```ts
type ExtraerId<Ruta extends string> =
  Ruta extends `${string}/usuario/${infer Id}/${string}` ? Id : never;

type Id = ExtraerId<"/api/usuario/42/perfil">; // "42"
```

Podemos capturar múltiples partes:

```ts
type Partes<Ruta extends string> =
  Ruta extends `${infer Primero}/${infer Resto}` ? [Primero, ...Partes<Resto>] : [Ruta];
```

Esto recursivamente descompone una ruta en un tuple de segmentos.

### Recursión con TLT

Los TLT recursivos permiten implementar parsers completos: formateo de rutas, validación de cadenas con formato específico (ej. UUID), e incluso motores de SQL tipado. Ejemplo: convertir separadores:

```ts
type KebabToCamel<S extends string> =
  S extends `${infer Parte}-${infer Resto}`
    ? `${Parte}${Capitalize<KebabToCamel<Resto>>}`
    : S;
type Camel = KebabToCamel<"mi-componente-react">; // "miComponenteReact"
```

### Key remapping avanzado con TLT

Combinado con tipos mapeados, podemos generar APIs completas. Por ejemplo, añadir getters y setters:

```ts
type Store<T> = {
  [K in keyof T as `get${Capitalize<K & string>}`]: () => T[K];
} & {
  [K in keyof T as `set${Capitalize<K & string>}`]: (val: T[K]) => void;
};
```

O validar que ciertas propiedades sigan un patrón de prefijo.

### Limitaciones

- Los TLT solo operan con tipos string literales; no pueden evaluar expresiones aritméticas.
- La recursión profunda puede causar errores de "excesivamente profundo" en el compilador. Para iterar sobre uniones grandes, a veces es preferible usar tipos mapeados condicionales en lugar de recursión.
- Las uniones con muchos miembros (decenas) pueden generar un número combinatorio enorme; hay que controlar las explosiones combinatorias.

### Aplicaciones reales

- **Routers tipados**: parsear rutas y extraer parámetros.
- **Sistemas de eventos**: garantizar que los nombres de eventos y sus payloads estén sincronizados.
- **Bibliotecas CSS-in-JS**: generar nombres de clases con prefijos y sufijos basados en estados.
- **Formateo de strings** para mensajes internacionalizados con parámetros obligatorios.
- **Generadores de código** que usan TypeScript como motor de transformación de tipos.

Dominar los template literal types eleva la capacidad de expresar restricciones de cadena directamente en el sistema de tipos, eliminando categorías enteras de errores en tiempo de ejecución.

---

Cada uno de estos temas tiene capas adicionales de complejidad cuando se combinan entre sí. Te animo a experimentar en el playground de TypeScript, porque la verdadera maestría surge al ver cómo el compilador evalúa las expresiones de tipos y al encontrar esos patrones que resuelven problemas del mundo real.

---



## 05-infer-y-extract.md

La palabra clave `infer` y las utilidades `Extract` / `Exclude` son el corazón de la lógica de tipos avanzada en TypeScript. Permiten *extraer* información de otros tipos y tomar decisiones condicionales.

### `infer` en tipos condicionales

`infer` solo puede aparecer dentro de la cláusula `extends` de un tipo condicional. Sirve para declarar una variable de tipo que será inferida por el compilador a partir de una posición estructural.

```ts
type ElementoDeArray<T> = T extends (infer U)[] ? U : never;
type R = ElementoDeArray<string[]>; // string
```

El compilador empareja el patrón `(infer U)[]` contra `string[]`, deduce que `U` debe ser `string` y lo usa en la rama verdadera.

#### Posiciones múltiples de `infer`

Se pueden colocar varios `infer` en un mismo patrón. Si aparecen en posiciones *covariantes* (como los tipos de retorno), TypeScript infiere una **unión** de los candidatos. Si aparecen en posiciones *contravariantes* (parámetros de función), infiere una **intersección**.

```ts
type Covarianza<T> = T extends { a: infer U; b: infer U } ? U : never;
type R1 = Covarianza<{ a: string; b: number }>; // string | number

type Contravarianza<T> = T extends { a: (x: infer U) => void; b: (x: infer U) => void } ? U : never;
type R2 = Contravarianza<{ a: (x: string) => void; b: (x: number) => void }>; // string & number (es decir, never)
```

Esta diferencia es fundamental para herramientas como `UnionToIntersection`.

#### Inferencia en funciones

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

#### Inferencia en template literal types

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

#### Inferencia y sobrecargas de funciones

Cuando se aplica `ReturnType` o `Parameters` a una función con múltiples firmas de sobrecarga, TypeScript infiere a partir de la **última** firma de la sobrecarga (la implementación más genérica). Esto puede dar resultados inesperados. Para obtener la firma más específica, se necesitan técnicas más complejas (intersectar las firmas o usar tipos condicionales distributivos sobre las firmas).

#### `Extract` y `Exclude`

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

#### `NonNullable<T>`

Es `Exclude<T, null | undefined>`. Elimina `null` y `undefined` de la unión.

```ts
type T = NonNullable<string | null | undefined>; // string
```

#### Combinaciones avanzadas con `infer`

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

#### Evitar la distribución accidental

Si no queremos que `Exclude` distribuya, envolvemos `T` en una tupla:

```ts
type ExcludeNoDist<T, U> = [T] extends [U] ? never : T;
```

#### Buenas prácticas

- Usa `infer` para capturar partes de un tipo y generar nuevos tipos.
- Prefiere las utilidades predefinidas (`ReturnType`, `Parameters`, etc.) antes que escribir la inferencia manual.
- Documenta los condicionales complejos; la sintaxis de `infer` puede oscurecer la intención.
- Ten cuidado con la recursión ilimitada; marca límites cuando sea necesario.

---

## 06-tipos-indexados.md

Los tipos indexados (`Indexed Access Types`) permiten obtener el tipo de una propiedad de otro tipo, usando la sintaxis `T[K]`, similar a la notación de corchetes de JavaScript pero en el nivel de tipos.

### Sintaxis básica

```ts
type Persona = { nombre: string; edad: number };
type Nombre = Persona["nombre"]; // string
type Edad = Persona["edad"];     // number
```

`K` debe ser una clave válida de `T`, es decir, debe cumplir `K extends keyof T`. En el ejemplo, `"nombre"` y `"edad"` son literales que pertenecen a `keyof Persona`.

### Uso con uniones de claves

Si `K` es una unión de literales, el tipo resultante es la unión de los tipos de esas propiedades:

```ts
type Ambas = Persona["nombre" | "edad"]; // string | number
```

Esto es increíblemente útil para extraer el tipo de varias propiedades de una vez.

### Uso con `keyof`

Podemos usar `keyof T` directamente para obtener una unión de todos los tipos de las propiedades:

```ts
type ValoresDePersona = Persona[keyof Persona]; // string | number
```

Este patrón es la base de `ValueOf<T>`.

### Indexado con tipos numéricos: arrays y tuplas

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

### Acceso profundo

Se puede encadenar el indexado: `T[K][L]`.

```ts
type Empresa = { empleado: { nombre: string; puesto: string } };
type Puesto = Empresa["empleado"]["puesto"]; // string
```

### Indexado con tipos genéricos

El verdadero poder aparece con genéricos:

```ts
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}
const persona = { nombre: "Ana", edad: 30 };
const nombre: string = getProperty(persona, "nombre"); // string
```

TypeScript infiere `K` como el literal `"nombre"` y el tipo de retorno como `string`. Esto garantiza que la clave existe y que el tipo retornado coincide.

### Indexado en tipos mapeados

Los tipos mapeados usan `keyof` implícitamente, y a menudo combinamos indexado dentro de los mapeos:

```ts
type Readonly<T> = { readonly [K in keyof T]: T[K] };
```

### Extraer tipos de un objeto constantemente tipado

Con `typeof` y `as const` podemos obtener el tipo de una variable y luego indexarlo:

```ts
const routes = {
  home: "/home",
  profile: "/profile/:id",
} as const;

type RoutePaths = (typeof routes)[keyof typeof routes]; // "/home" | "/profile/:id"
```

### Limitaciones

- No se puede indexar un tipo con una clave que no sea conocida en tiempo de compilación.
- Si `T` es una unión, `T[K]` distribuye sobre la unión, lo que puede producir resultados extensos; a veces es necesario acotar.
- `T[K]` solo puede leer; para escribir tipos necesitamos mapeos o tipos condicionales.

### Casos de uso avanzados

- **Lookup types en librerías**: define tipos de configuración centralizados y accede a fragmentos con tipos indexados.
- **`Pick` y `Omit`** se implementan con tipos indexados y `keyof`.
- **Renombrar propiedades** combinando tipos mapeados con indexados.
- **Crear tipos de eventos**: dado un mapeo `{ click: MouseEvent; keydown: KeyboardEvent }`, `EventMap["click"]` da el tipo correcto para el handler.

Dominar los tipos indexados permite escribir APIs genéricas que respetan la forma exacta de los datos sin perder información.

---

## 07-aserciones-y-narrowing.md

El narrowing (estrechamiento) es el proceso por el cual TypeScript reduce el tipo de una variable dentro de un bloque de código basándose en el flujo de control. Las aserciones son indicaciones explícitas al compilador sobre el tipo.

### Narrowing por `typeof`

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

### Narrowing por `instanceof`

```ts
if (x instanceof Date) {
  x.getFullYear(); // x es Date
}
```

### Narrowing por `in`

Comprueba la existencia de una propiedad:

```ts
if ("radio" in figura) {
  figura.radio; // figura se ha estrechado a la rama con radio
}
```

### Narrowing por comparación

Comparaciones con `===`, `!==`, `switch` y literales:

```ts
function ejemplo(x: string | undefined) {
  if (x !== undefined) {
    x.toUpperCase();
  }
}
```

Para uniones discriminadas, la comprobación del discriminante estrecha todo el objeto.

### Narrowing por verdad/falsedad

Valores como `null`, `undefined`, `""`, `0`, `NaN` son falsy y pueden estrechar en condicionales:

```ts
if (valor) {
  // valor no es falsy
}
```

### User-defined type guards (`x is Tipo`)

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

### Funciones de aserción (`asserts`)

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

### Afirmaciones de tipo (`as`)

El operador `as` le dice al compilador que confíe en un tipo concreto, sin verificación:

```ts
const canvas = document.getElementById("lienzo") as HTMLCanvasElement;
```

Es una operación insegura; si el valor no coincide en runtime, se producen errores silenciosos. Usar solo cuando tengamos certeza o tras comprobaciones manuales.

### Afirmación no nula (`!`)

El sufijo `!` elimina `null` y `undefined` de una expresión:

```ts
let nombre: string | null = getName();
console.log(nombre!.length); // confiamos en que nombre no es null
```

Peligroso si se abusa; puede enmascarar errores. Alternativa preferida: estrechamiento con `if`.

### `as const`

Convierte un valor en su tipo literal más restrictivo y añade `readonly` profundamente:

```ts
const config = { modo: "activo" as const }; // tipo { readonly modo: "activo" }
```

Útil para crear tipos inmutables.

### Doble aserción (`as unknown as Tipo`)

Cuando necesitamos forzar una conversión entre tipos no relacionados, podemos pasar por `unknown`:

```ts
let x = "hola";
let y = x as unknown as number; // muy peligroso, evítalo
```

Solo en migraciones o interop con JS no tipado.

### Limitaciones del narrowing

- No se propaga a través de funciones: si pasas una variable a una función, el estrechamiento no se mantiene dentro.
- No estrecha propiedades de objetos mutables si pueden cambiar entre comprobaciones. TypeScript supone que las propiedades pueden ser modificadas. Para objetos inmutables (`as const` o `readonly`) puede ser más agresivo.
- En callbacks, el estrechamiento pierde el contexto; a veces hay que reasignar a una constante.

### Combinaciones y buenas prácticas

- Prefiere el narrowing automático a las aserciones manuales.
- Usa type guards personalizados para lógica de dominio compleja y reutilizable.
- Las funciones de aserción son ideales para parseo y validación en tiempo de ejecución, integrándose con el análisis estático.
- Documenta las aserciones de tipo para justificar por qué son seguras.

---

## 08-never-exhaustividad.md

`never` es el tipo del que ningún valor puede ser miembro. Representa el conjunto vacío. Su principal uso es garantizar que ciertos caminos del código son inalcanzables y forzar la exhaustividad.

### Qué produce `never`

- Funciones que nunca retornan: `function error(): never { throw new Error(); }`
- Un bucle infinito: `function loop(): never { while(true) {} }`
- Ramas inalcanzables en tipos condicionales distributivos donde todos los miembros se filtran: `Exclude<string, string>` produce `never`.
- La intersección de tipos incompatibles, como `string & number` → `never`.
- El tipo resultante de un `switch` exhaustivo en la rama `default` cuando ya se han cubierto todas las variantes.

### Propiedades del tipo `never`

- **`never` es asignable a cualquier tipo**: `let x: string = ((): never => { throw ... })();` es válido.
- **Nada es asignable a `never`** (excepto `never` mismo). Por eso asignar un valor a una variable de tipo `never` es un error, a menos que ese valor también sea `never` (es decir, provenga de un camino que nunca se alcanza).

Estas propiedades fundamentan la comprobación de exhaustividad.

### Exhaustividad con `switch`

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

### Función `assertNever`

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

### Exhaustividad con `if`/`else if`

También podemos encadenar condiciones y usar `assertNever` en el último `else`. Para uniones que no están discriminadas, puede ser más tedioso.

### `never` en tipos condicionales

Cuando filtramos uniones, `never` elimina los miembros. Por ejemplo, para obtener solo los métodos de un tipo:

```ts
type Metodos<T> = {
  [K in keyof T]: T[K] extends (...args: any[]) => any ? K : never;
}[keyof T];
```

Primero mapeamos cada clave a ella misma o a `never`. Luego indexamos con `[keyof T]` para obtener la unión de los valores, y `never` desaparece de la unión resultante.

### `never` en intersecciones

`T & never` siempre es `never`. Esto se usa para prohibir combinaciones: si un parámetro genérico debe ser incompatible con algo, se fuerza una intersección con `never` en caso contrario.

### Diferencias con `void`

- `void` es el tipo de retorno de funciones que no devuelven nada. Una variable de tipo `void` puede contener `undefined` (y `null` con strictNullChecks false).
- `never` no tiene habitantes. Una función que retorna `never` no puede completar; no hay punto de continuación.

### Exhaustividad en reducers

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

### Limitaciones y sutilezas

- TypeScript no realiza exhaustividad en uniones que contienen `any` o cuando las ramas no discriminan correctamente.
- Si la unión incluye tipos con propiedades opcionales que solapan, el análisis puede no reducir a `never`; a veces necesitamos ayudar con un discriminante.
- En versiones antiguas, las propiedades con el mismo nombre pero tipos distintos a veces confunden al compilador. Usar discriminantes claros y únicos soluciona esto.
- El chequeo de exhaustividad no funcionará si la variable es de un tipo demasiado amplio (por ejemplo, `string` en lugar de una unión de literales).

### Usar `never` para prohibir valores

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

---

