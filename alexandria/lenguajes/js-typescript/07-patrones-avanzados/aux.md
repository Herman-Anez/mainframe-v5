## 01-discriminated-union.md

Las uniones discriminadas (también llamadas uniones etiquetadas, *tagged unions* o *algebraic data types*) son el patrón más poderoso para modelar estados excluyentes en TypeScript. Se basan en un campo común (el discriminante) que permite al compilador reducir el tipo de forma automática y segura.

### Anatomía de una unión discriminada

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

### Estrechamiento automático

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

### Exhaustividad con `never`

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

### Múltiples niveles de discriminación

Se pueden anidar uniones discriminadas. Por ejemplo, una vista de una UI con estados y subestados:

```ts
type Vista =
  | { pantalla: "lista"; datos: Datos[] }
  | { pantalla: "detalle"; id: string; modo: "vista" | "edicion" }
  | { pantalla: "error"; codigo: number };
```

Dentro del caso `detalle`, el campo `modo` actúa como discriminante secundario. Se puede anidar el `switch` o combinar comprobaciones.

### Unión discriminada genérica

Podemos crear una función que opere sobre cualquier unión discriminada usando un tipo genérico para el discriminante:

```ts
type UnionPorClave<T, K extends string> = T extends { [P in K]: infer V } ? V : never;

function porEstado<T extends { estado: string }>(items: T[], estado: T["estado"]): T[] {
  return items.filter(item => item.estado === estado);
}
```

### Ejemplos reales

- **Máquinas de estado**: modelado de procesos, loaders, wizard steps.
- **Respuestas de API**: éxito con datos, error con mensaje, redirección.
- **Acciones de Redux/React Context**: cada acción tiene un `type` y un `payload` opcional.
- **Árboles sintácticos (AST)**: nodos de diferentes tipos (`Literal`, `BinaryExpression`, etc.).

### Discriminante con tipos no literales

El discriminante debe ser un tipo literal (string, number o boolean). Si usas una variable, el estrechamiento no funcionará porque el compilador no conoce el valor en tiempo de compilación. Para esos casos, usa *type predicates*.

### Buenas prácticas

- Nombra el discriminante de forma consistente (`type`, `kind`, `tag`).
- Prefiere `switch` con `default` y `assertNever` para exhaustividad.
- Usa interfaces o `type` para cada variante; evita uniones de primitivos si la lógica es compleja.
- Combina con tipos mapeados para generar acciones a partir de un mapa de tipos.

---

## 02-branded-types.md

TypeScript emplea un sistema de tipos **estructural**: dos tipos son compatibles si tienen la misma forma, no si comparten el mismo nombre. Para cuando necesitamos distinguir tipos que son estructuralmente idénticos pero semánticamente distintos (ej. un `UserId` de un `ProductId`, ambos `string`), se utilizan los **branded types** (tipos de marca o *opacos*).

### El problema

```ts
type UserId = string;
type ProductId = string;

function getUser(id: UserId) { /* ... */ }

const productId: ProductId = "abc";
getUser(productId); // No hay error, pero semánticamente es incorrecto.
```

Ambos son `string` y por tanto intercambiables. Queremos evitar que un ID de producto se pase donde se espera un ID de usuario.

### Creación de una marca

Se crea un tipo mediante una intersección con un objeto que contiene una propiedad única (la marca). Esta propiedad no existe realmente en tiempo de ejecución, solo en el sistema de tipos.

#### Marca con `__brand`

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

#### Marca con un `unique symbol`

```ts
declare const brand: unique symbol;
type UserId = string & { [brand]: "UserID" };
```

Esto impide colisiones accidentales porque el símbolo es único. Es la variante más segura.

#### Marca mediante interfaz con un símbolo privado

Otra técnica es usar una interfaz con un campo privado (no emitido) y luego intersectar:

```ts
interface UserBrand {
  __userBrand: never;
}
type UserId = string & UserBrand;
```

`never` impide que se pueda asignar algún valor a esa propiedad.

### Validación y creación segura

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

### Uso con genéricos

Los branded types pueden combinarse con genéricos para crear familias de tipos opacos:

```ts
type Brand<T, B> = T & { __brand: B };
type Id<T> = Brand<string, T>;

type UserId = Id<"User">;
type ProductId = Id<"Product">;
```

### Casos de uso típicos

- **Identificadores** (UserId, OrderId).
- **Unidades de medida** (Meters, Miles, Celsius, Fahrenheit) para evitar mezclar magnitudes.
- **Valores validados** (Email, URL, NonEmptyString) que garantizan que el dato pasó una validación.
- **Tokens y claves** para no confundir tokens de acceso con tokens de refresco.

### Limitaciones

- No hay protección en tiempo de ejecución; si un valor cruza de JS sin validar, el compilador no lo sabrá.
- Las operaciones con primitivos se pierden a menos que se sobrecarguen (no puedes sumar dos `Meters` a menos que definas funciones específicas).
- Los tipos de marca pueden ser molestos cuando necesitas interoperar con librerías que esperan `string`. Se debe hacer conversión explícita.

### Alternativas

- **Flavoring**: similar a branding pero usando una intersección con un tipo con una propiedad opcional, lo que hace la conversión más laxa.
- **Nuevos tipos en ES?** No hay aún; los branded types son el estándar de facto en TypeScript.

---

## 03-mixins.md

Los mixins permiten combinar múltiples clases en una sola, evitando las limitaciones de la herencia única. TypeScript soporta mixins de forma completa mediante funciones que reciben una clase base y retornan una clase extendida.

### El patrón de mixin (función que retorna clase)

Un mixin es una función que toma una clase constructora y devuelve una nueva clase que extiende de ella, añadiendo miembros:

```ts
type Constructor<T = {}> = new (...args: any[]) => T;

function ConSalto<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    saltar() { console.log("Saltando..."); }
  };
}

function ConCarrera<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    correr() { console.log("Corriendo..."); }
  };
}

class Animal {
  comer() { console.log("Comiendo..."); }
}

class Canguro extends ConSalto(ConCarrera(Animal)) {}

const canguro = new Canguro();
canguro.comer();  // de Animal
canguro.saltar(); // de ConSalto
canguro.correr(); // de ConCarrera
```

Aquí `ConSalto` y `ConCarrera` son mixins. Se aplican en orden: primero `ConCarrera` sobre `Animal`, luego `ConSalto` sobre el resultado.

### Tipado de las propiedades de instancia

Para que el mixin acceda a propiedades de la clase base, se debe restringir `TBase` con una interfaz que describa lo que necesita:

```ts
interface TieneNombre {
  nombre: string;
}
function ConPresentacion<TBase extends Constructor<TieneNombre>>(Base: TBase) {
  return class extends Base {
    presentar() {
      console.log(`Hola, soy ${this.nombre}`);
    }
  };
}
```

La restricción `Constructor<TieneNombre>` asegura que la clase base tenga la propiedad `nombre`.

### Mixins con genéricos que devuelven el tipo correcto

La función mixin puede devolver un tipo anónimo que preserva la forma combinada. El tipo resultante se infiere correctamente:

```ts
const PerroSaltarin = ConSalto(Animal);
type PerroSaltarin = InstanceType<typeof PerroSaltarin>; // Animal & { saltar(): void }
```

El tipo `InstanceType<typeof ClaseGenerada>` nos da la intersección de todos los mixins aplicados.

### Mixins con métodos y propiedades de inicialización

Si el mixin necesita inicializar algo en el constructor, puede invocar al constructor base:

```ts
function ConIdentificador<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    id: string;
    constructor(...args: any[]) {
      super(...args);
      this.id = Math.random().toString(36);
    }
  };
}
```

Es importante pasar todos los argumentos con `...args: any[]` y llamar a `super(...args)` para que la cadena de constructores funcione.

### Mixins con restricción de instancia vs static

Se puede restringir también el lado estático de la clase base, pero normalmente no es necesario.

### Alternativas modernas

- **Composición mediante funciones de fábrica**: en lugar de mixins de clases, se crean funciones que toman un objeto y devuelven uno nuevo con capacidades adicionales. Esto funciona mejor con el modelo funcional y evita los problemas de herencia.
- **Decoradores** (propuesta TC39): pueden añadir funcionalidad, pero actualmente los decoradores de clase no extienden la clase.

### Consideraciones

- Los mixins pueden complicar la jerarquía; usa con moderación.
- TypeScript no emite mixins por sí mismo; la sintaxis de `class extends mixin(Base)` es azúcar sobre funciones.
- La intersección de tipos que simula la herencia múltiple puede generar conflictos de nombres; TypeScript avisa si hay tipos incompatibles, pero la implementación en tiempo de ejecución puede sobrescribir métodos accidentalmente.
- En proyectos grandes, a veces se prefiere la composición explícita.

---

## 04-this-polimorfico.md

El tipo polimórfico `this` permite que un método devuelva el tipo de la instancia actual, en lugar del tipo de la clase donde se define. Es esencial para **interfaces fluidas** (method chaining) que funcionan correctamente en subclases.

### Retornar `this`

```ts
class QueryBuilder {
  select(campos: string): this {
    // ...
    return this;
  }
  where(condicion: string): this {
    // ...
    return this;
  }
}
```

Si una subclase hereda de `QueryBuilder`, los métodos `select` y `where` devolverán la instancia de la subclase, no `QueryBuilder`. Esto permite encadenar sin perder el tipo:

```ts
class AdvancedQuery extends QueryBuilder {
  join(tabla: string): this {
    // ...
    return this;
  }
}

new AdvancedQuery()
  .select("a")
  .where("b")
  .join("c"); // `join` está disponible porque `select` devuelve `AdvancedQuery`
```

Si los métodos retornaran `QueryBuilder`, el tipo después de `where` sería `QueryBuilder` y no se podría llamar a `join`.

### Diferencia entre `this` y el nombre de la clase

- `this` es el tipo de la instancia actual, que puede ser más específica.
- `NombreClase` es exactamente esa clase y no tiene en cuenta herencia.
- El compilador resuelve `this` como el tipo de la instancia de la clase que finalmente se instancia.

### Uso en interfaces

Se puede usar `this` como tipo de retorno en interfaces para forzar a las implementaciones a devolver la propia instancia:

```ts
interface Clonable {
  clone(): this;
}
```

Cualquier clase que implemente `Clonable` debe devolver `this`, lo que garantiza que `new MiClase().clone()` sea de tipo `MiClase`.

### Restricciones de `this`

- No se puede usar `this` en contextos estáticos.
- No se puede usar `this` como tipo de un parámetro (eso es otra cosa: el falso primer parámetro para tipar el contexto).
- `this` puede aparecer solo como tipo de retorno o dentro de la clase como tipo de una propiedad que referencia a la instancia (poco común).

### Fluent interfaces con jerarquías profundas

El patrón es extremadamente útil en builders, constructores de objetos, consultas SQL, configuraciones de tests, etc. Permite un encadenamiento natural que el autocompletado sigue perfectamente.

### `this` en funciones con tipado de contexto

No confundir con el uso de `this` como primer parámetro falso para indicar el tipo del contexto de ejecución:

```ts
function onClick(this: HTMLElement, e: Event) { }
```

Ese `this` no afecta al tipo de retorno ni al encadenamiento; es puramente para el chequeo de `this` dentro de la función.

### Buenas prácticas

- Prefiere `this` como tipo de retorno en métodos de clases que retornan la instancia.
- Si necesitas un método que devuelva la clase base en lugar de la instancia actual (raro), usa el nombre de la clase explícitamente.

---

## 05-functional-patterns.md

TypeScript permite aplicar con precisión patrones de programación funcional manteniendo la seguridad de tipos. Composiciones, currificación, mónadas y ópticas son posibles gracias a los tipos genéricos, condicionales y la inferencia.

### Funciones de orden superior tipadas

#### `compose` y `pipe`

La composición de funciones requiere tipar el flujo de datos a través de varias firmas. Con genéricos y sobrecargas o condicionales, se puede lograr un tipado exacto:

```ts
function pipe<A>(a: A): A;
function pipe<A, B>(a: A, ab: (a: A) => B): B;
function pipe<A, B, C>(a: A, ab: (a: A) => B, bc: (b: B) => C): C;
function pipe(value: any, ...fns: Function[]) {
  return fns.reduce((acc, fn) => fn(acc), value);
}
```

Para un número variable de argumentos se suelen usar **sobrecargas** o tipos recursivos (menos común). Librerías como `fp-ts` usan `pipe` con tipado variable gracias a una técnica de intersección de tipos de funciones.

#### Currificación

```ts
function curry<T1, T2, R>(fn: (a: T1, b: T2) => R): (a: T1) => (b: T2) => R {
  return (a: T1) => (b: T2) => fn(a, b);
}
```

### Tipos algebraicos: `Option` y `Result`

Implementaciones funcionales comunes que evitan `null` y manejan errores sin lanzar excepciones.

#### `Option<T>`

```ts
type Option<T> = { kind: "some"; value: T } | { kind: "none" };

const some = <T>(value: T): Option<T> => ({ kind: "some", value });
const none: Option<never> = { kind: "none" };

function map<T, U>(opt: Option<T>, f: (x: T) => U): Option<U> {
  return opt.kind === "some" ? some(f(opt.value)) : none;
}
```

#### `Result<E, T>`

```ts
type Result<E, T> =
  | { kind: "ok"; value: T }
  | { kind: "err"; error: E };

function flatMap<E, T, U>(res: Result<E, T>, f: (x: T) => Result<E, U>): Result<E, U> {
  if (res.kind === "ok") return f(res.value);
  return res;
}
```

TypeScript estrecha perfectamente en estas uniones discriminadas, haciendo el código seguro.

### Patrones con tipos mapeados y `readonly`

En programación funcional se trabaja con datos inmutables. TypeScript ofrece `Readonly`, `ReadonlyArray` y `as const`. Se pueden crear actualizadores funcionales que devuelven un nuevo objeto:

```ts
function setProp<T, K extends keyof T>(obj: T, key: K, val: T[K]): T {
  return { ...obj, [key]: val };
}
```

### Lenses (lentes) y Prisms

Una lente es un par de funciones `get` y `set` para acceder y modificar una propiedad dentro de una estructura anidada de forma inmutable. Con tipos se puede tipar:

```ts
interface Lens<S, A> {
  get: (s: S) => A;
  set: (a: A) => (s: S) => S;
}
```

Combinando lentes con genéricos se pueden recorrer objetos profundos con total seguridad.

### Programación tácita (point-free) segura

Gracias a la inferencia, se pueden escribir funciones sin mencionar los argumentos; el compilador infiere los tipos siempre que las funciones intermedias estén bien tipadas.

### Buenas prácticas

- Prefiere datos inmutables y funciones puras; TypeScript ayuda con `readonly`.
- Usa `Option`/`Result` para manejar ausencia y errores en lugar de `null` y excepciones.
- Las librerías como `fp-ts` y `io-ts` llevan estos patrones al extremo; conocerlas es valioso.

---

## 06-conditional-overloads.md

La sobrecarga de funciones es una forma de declarar múltiples firmas para una misma función. Sin embargo, a veces los mapeos entre tipos de entrada y salida son más expresables con **tipos condicionales genéricos** que con sobrecargas tradicionales.

### Sobrecarga clásica vs tipo condicional genérico

#### Enfoque con sobrecargas

```ts
function procesar(entrada: string): number;
function procesar(entrada: number): string;
function procesar(entrada: string | number): string | number {
  if (typeof entrada === "string") return entrada.length;
  return entrada.toString();
}
```

La implementación debe ser compatible con todas las firmas (usualmente se tipa con la unión). Esto funciona, pero si añadimos más tipos, el número de sobrecargas crece linealmente.

#### Enfoque con tipo condicional

```ts
function procesar<T extends string | number>(
  entrada: T
): T extends string ? number : string {
  if (typeof entrada === "string") return entrada.length as any;
  return entrada.toString() as any;
}
```

El tipo de retorno se define condicionalmente sobre `T`. TypeScript no puede validar la implementación contra el tipo condicional directamente, así que normalmente se necesita una aserción (`as any`). Pero la **firma externa** es precisa y el autocompletado funciona mejor.

### Ventajas de los condicionales sobre las sobrecargas

- **Distribución automática sobre uniones**: Si llamamos a `procesar` con `string | number`, el tipo de retorno será `number | string`, mientras que con sobrecargas puede que se tome la unión de las firmas de una forma menos específica.
- **Mapeos declarativos**: Se puede escribir una sola función que cubra un dominio grande (ej. mapeo de eventos a payloads).
- **Mejor integración con genéricos**: Los tipos condicionales pueden combinarse con `infer`, `extends` y otros patrones.

### Ejemplo: manejador de eventos tipado

```ts
type Eventos = {
  click: { x: number; y: number };
  focus: undefined;
  blur: undefined;
};

function on<T extends keyof Eventos>(
  evento: T,
  callback: (data: Eventos[T]) => void
) { /* ... */ }

on("click", (data) => console.log(data.x)); // data es { x: number; y: number }
on("focus", (data) => /* data es undefined */);
```

Esto se logra con un genérico que indexa un mapa de tipos, no con sobrecargas. Aunque también se pueden escribir sobrecargas manualmente para cada evento, el genérico indexado es más mantenible.

### Cuándo sí usar sobrecargas

- Cuando la lógica de implementación varía drásticamente según los tipos de entrada y no se puede unificar con un genérico.
- Cuando se necesita restringir el uso con `never` para prohibir combinaciones no válidas (se puede combinar con condicionales también).
- Para mejorar la experiencia de autocompletado cuando el tipo condicional se vuelve demasiado complejo.

### Combinación: firma externa con tipo condicional + implementación con aserción

Es común separar la firma pública (con tipo condicional) de la implementación interna:

```ts
function obtenerPropiedad<T, K extends keyof T>(obj: T, key: K): T[K];
function obtenerPropiedad(obj: any, key: string): any {
  return obj[key];
}
```

La firma de sobrecarga externa usa `T[K]` (que es indexado, un caso particular de tipo condicional). La implementación es más laxa y no afecta a los consumidores.

### Buenas prácticas

- Para mapeos de tipo entrada → salida que dependen de un literal, prefiere tipos condicionales o acceso indexado.
- Documenta los condicionales complejos; la legibilidad puede sufrir.
- Si necesitas validar la implementación con un tipo muy estricto, considera si la sobrecarga tradicional es suficiente.

---

## 07-recursive-types.md

Los tipos recursivos permiten describir estructuras anidadas de profundidad arbitraria: árboles, JSON, listas enlazadas, etc. TypeScript soporta recursión en **interfaces** desde siempre y en **type aliases** desde la versión 3.7.

### Tipos recursivos básicos

#### Lista enlazada

```ts
type Lista<T> = {
  valor: T;
  siguiente: Lista<T> | null;
};
```

#### Árbol binario

```ts
type Arbol<T> = {
  valor: T;
  izquierda?: Arbol<T>;
  derecha?: Arbol<T>;
};
```

Estos tipos se pueden anidar infinitamente y TypeScript los maneja sin problemas mientras no se alcance el límite de profundidad (normalmente 50 niveles).

### Interfaces recursivas

Las interfaces siempre han sido recursivas; la sintaxis es la misma.

```ts
interface Nodo {
  id: string;
  hijos?: Nodo[];
}
```

### Tipos recursivos con tipos mapeados

La potencia real está en crear transformaciones profundas con tipos mapeados recursivos.

#### `DeepReadonly`

```ts
type DeepReadonly<T> = T extends object
  ? { readonly [K in keyof T]: DeepReadonly<T[K]> }
  : T;
```

Así, `DeepReadonly<{ a: { b: number } }>` da `{ readonly a: { readonly b: number } }`.

#### `DeepPartial`

```ts
type DeepPartial<T> = T extends object
  ? { [K in keyof T]?: DeepPartial<T[K]> }
  : T;
```

### Recursión con tipos condicionales e `infer`

Se pueden parsear tipos de cadenas recursivamente:

```ts
type Split<S extends string, Sep extends string> =
  S extends `${infer Parte}${Sep}${infer Resto}`
    ? [Parte, ...Split<Resto, Sep>]
    : [S];
type Partes = Split<"a,b,c", ",">; // ["a", "b", "c"]
```

Aquí la recursión descompone la cadena trozo a trozo.

### Restricciones y límites

- El compilador impone un límite de **profundidad de recursión** (50 por defecto, modificable hasta cierto punto). Si se supera, se produce el error `"Type instantiation is excessively deep and possibly infinite"`.
- Las recursiones estructurales (sin reducción) que no avanzan causan errores.
- Los tipos recursivos deben ser **productivos**: cada paso debe descomponer el tipo en algo más simple. Por ejemplo, en `Split` siempre quitamos un separador; en `DeepReadonly` descendemos a los miembros de un objeto.
- Para grandes volúmenes de datos, la recursión de tipos puede ralentizar la compilación; usa con moderación.

### Trucos para evitar límites

- Usa **tipos envolventes** para cortar la recursión cuando ya no sea necesaria.
- En algunos casos, se puede usar un tipo mapeado normal combinado con un tipo condicional que solo profundice un nivel y luego se repita manualmente si la profundidad es conocida.
- Para colecciones inmensas, es preferible usar enfoques genéricos no recursivos (ej. `ReadonlyArray<T>`).

### Aplicaciones reales

- **Validación de tipos de respuesta de API**: `DeepPartial` para updates, `DeepRequired` para formularios.
- **Tipado de operadores de inmutabilidad** (Immer, Redux Toolkit).
- **Parsers y serializadores**: conversión de tipos entre capas.
- **Manipulación de paths de objetos**: dado un objeto, extraer todas las rutas separadas por puntos con recursión de template literal types.

### Conclusión

Los tipos recursivos completan el arsenal de TypeScript para modelar el mundo real. Junto con las uniones discriminadas y los tipos condicionales, permiten expresar reglas de negocio complejas directamente en el sistema de tipos, eliminando categorías enteras de errores en tiempo de ejecución.

---

#
