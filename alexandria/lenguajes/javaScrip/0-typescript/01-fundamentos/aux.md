## 1. Introducción a TypeScript

TypeScript es un **lenguaje de programación fuertemente tipado** que se construye sobre JavaScript añadiendo una capa de tipos estáticos opcionales. Todo código JavaScript válido es también código TypeScript, lo que permite una adopción incremental. Su compilador (`tsc`) **transpila** TypeScript a JavaScript limpio, eliminando toda la información de tipos en tiempo de compilación (type erasure). El resultado es código que puede ejecutarse en cualquier motor de JS.

### ¿Por qué TypeScript?

- **Detección temprana de errores**: el análisis estático atrapa fallos de tipo, null/undefined, accesos incorrectos a propiedades, etc., antes de ejecutar.
- **Herramientas de desarrollo**: autocompletado, navegación, refactorización segura y documentación implícita en el editor.
- **Escalado**: facilita el mantenimiento de grandes bases de código y el trabajo en equipos.
- **Adopción del ecosistema**: soporte nativo o mediante `@types` para prácticamente toda librería popular.

### ¿Qué no es TypeScript?

No es un lenguaje nuevo compilado a bytecode; es un superset de JS. No añade overhead en runtime: todo el sistema de tipos es eliminado. No reemplaza la necesidad de tests, pero sí reduce clases enteras de errores.

### El proceso de compilación

1. El compilador parsea los archivos `.ts` (y `.tsx` para JSX).
2. Resuelve módulos y referencias.
3. Realiza el **chequeo de tipos** (type checking).
4. Emite JavaScript según el `target` y `module` configurados, aplicando transformaciones (ej. `async/await` a promesas).
5. Puede generar archivos de declaración (`.d.ts`), sourcemaps y más.

El chequeo de tipos puede ejecutarse de forma aislada (`tsc --noEmit`) para integrarse con otros transpiladores (Babel, swc, esbuild), que solo transforman la sintaxis sin verificar tipos.

### Filosofía de diseño

- **Opcional y gradual**: puedes añadir tipos donde necesites y mantener código sin tipar (con `any` o `strict: false`).
- **Inferencia inteligente**: el compilador deduce tipos automáticamente, reduciendo la verbosidad.
- **Sistema de tipos estructural**: la compatibilidad se basa en la forma de los tipos (duck typing), no en su identidad nominal (excepto con técnicas de marcas).

### Versiones y evolución

TypeScript sigue un ciclo de lanzamiento trimestral. Cada versión introduce mejoras en el sistema de tipos, nuevas características de JavaScript (alineadas con TC39) y optimizaciones. Es importante conocer la versión con la que se trabaja porque algunas funcionalidades avanzadas requieren versiones recientes (ej. `satisfies` en TS 4.9, decoradores estándar en TS 5.0).

### Configuración inicial

Todo proyecto TypeScript se define mediante un archivo `tsconfig.json`. Un ejemplo mínimo:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "strict": true,
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src"]
}
```

La bandera `strict: true` activa todas las comprobaciones estrictas, que son la base para un desarrollo seguro.

---

## 2. Tipos básicos

TypeScript proporciona un conjunto de tipos primitivos que reflejan los de JavaScript, además de construcciones propias para modelar mejor los datos.

### Tipos primitivos

- **boolean**: `true` o `false`.
- **number**: enteros, decimales, hexadecimales, binarios, octales. Todos son `number` (internamente IEEE 754).
- **string**: cadenas de texto, con soporte para template literals.
- **symbol**: valor único e inmutable, usado como identificador. Creado con `Symbol()`.
- **bigint**: enteros de precisión arbitraria. Literal con `n` al final: `123n`. Requiere target `ES2020+`.

```ts
let activo: boolean = true;
let total: number = 42;
let nombre: string = "TypeScript";
let sym: symbol = Symbol("id");
let granEntero: bigint = 9007199254740991n;
```

### `null` y `undefined`

Por defecto, con `strictNullChecks: true` (incluido en `strict`), `null` y `undefined` son tipos separados y no se pueden asignar a otros tipos sin una unión explícita. Con `strictNullChecks: false`, son subtipos de todos los demás (comportamiento clásico de JS). Es una de las comprobaciones más importantes.

```ts
let x: number = null; // Error si strictNullChecks: true
let y: number | null = null; // Correcto
```

### `void`

Representa la ausencia de un valor de retorno. Se usa principalmente en funciones que no devuelven nada. Una variable de tipo `void` solo puede tener valor `undefined` (o `null` si strictNullChecks está desactivado).

```ts
function saludar(): void {
  console.log("Hola");
}
```

### `never`

Indica valores que nunca deberían ocurrir. Es el tipo de retorno de funciones que lanzan excepción o que entran en un bucle infinito. También aparece en el narrowing exhaustivo: cuando has cubierto todas las ramas de una unión, la rama restante es `never`.

```ts
function error(mensaje: string): never {
  throw new Error(mensaje);
}
```

### `any` y `unknown`

- **any**: desactiva completamente la comprobación de tipos para esa variable. Es una escotilla de escape útil en migraciones, pero elimina las ventajas de TS. Evítalo siempre que sea posible.
- **unknown**: es el tipo seguro equivalente a `any`. Representa cualquier valor, pero no se puede operar con él sin antes hacer una comprobación de tipo (estrechamiento).

```ts
let valor: unknown;
valor = "texto";
// valor.toUpperCase(); // Error: 'valor' es desconocido
if (typeof valor === "string") {
  valor.toUpperCase(); // Correcto, aquí valor es string
}
```

### Array

Dos sintaxis equivalentes: `tipo[]` y `Array<tipo>`.

```ts
let numeros: number[] = [1, 2, 3];
let cadenas: Array<string> = ["a", "b"];
```

Para arrays de múltiples tipos se usan uniones: `(string | number)[]`.

### Tuplas

Las tuplas son arrays con una longitud fija y tipos conocidos en cada posición. Se definen con notación de corchetes.

```ts
let par: [string, number] = ["edad", 30];
```

- Elementos opcionales: `[string, number?]`.
- Elementos rest: `[string, ...number[]]`.
- Desde TS 4.0, se pueden etiquetar los elementos: `type Coordenada = [x: number, y: number]`. Las etiquetas solo existen para documentación y autocompletado.

### `object`

Representa cualquier valor no primitivo. Rara vez se usa directamente; es más común usar interfaces o tipos para describir formas de objetos.

```ts
let obj: object = {};
obj = { clave: 1 };
obj = [1, 2, 3];
// obj = 42; // Error
```

### Inferencia de tipos

Si no se anota el tipo, TS lo infiere de la inicialización:

```ts
let mensaje = "hola"; // infiere string
```

En parámetros de función también puede inferir en contextos de retorno, pero es recomendable anotar parámetros.

---

## 3. Tipos literales y uniones

### Tipos literales

Los tipos literales son valores concretos tratados como un tipo. Combinados con uniones, permiten modelar valores discretos.

```ts
let color: "rojo" | "verde" | "azul";
color = "rojo"; // ok
color = "amarillo"; // error
```

Se pueden crear tipos literales a partir de cadenas, números y booleanos.

```ts
type Direccion = "arriba" | "abajo" | "izquierda" | "derecha";
type Dado = 1 | 2 | 3 | 4 | 5 | 6;
type Respuesta = true | false; // equivalente a boolean, pero más restrictivo
```

### Uniones (union types)

Una unión `A | B` permite que un valor sea de tipo A o de tipo B. TypeScript solo permite acceder a propiedades que existen en **todos** los miembros de la unión sin antes estrechar.

```ts
interface Pajaro {
  volar(): void;
  ponerHuevos(): void;
}
interface Pez {
  nadar(): void;
  ponerHuevos(): void;
}
function accion(animal: Pajaro | Pez) {
  animal.ponerHuevos(); // ok, común a ambos
  // animal.volar(); // error
}
```

### Uniones discriminadas (tagged unions)

Patrón fundamental: añadir una propiedad literal común (discriminante) que permita al compilador deducir el tipo en cada rama de un `switch` o `if`.

```ts
type Forma =
  | { tipo: "circulo"; radio: number }
  | { tipo: "rectangulo"; ancho: number; alto: number };

function area(f: Forma): number {
  switch (f.tipo) {
    case "circulo":
      return Math.PI * f.radio ** 2;
    case "rectangulo":
      return f.ancho * f.alto;
    default:
      const _exhaustivo: never = f; // error si falta alguna variante
      return _exhaustivo;
  }
}
```

Aquí, tras comprobar `f.tipo`, TypeScript estrecha automáticamente el tipo en cada `case`. El `default` con `never` asegura exhaustividad.

### Narrowing (estrechamiento)

TypeScript analiza el flujo de control para refinar tipos:

- **typeof**: para primitivas (`"string"`, `"number"`, `"boolean"`, `"symbol"`, etc.).
- **instanceof**: para clases.
- **in**: para comprobar existencia de una propiedad.
- **Comparación con literales**: `if (x === "valor")`.
- **Funciones de aserción personalizadas**: `function esPez(x: any): x is Pez` (type predicate).
- **Asignación**: después de asignar, el tipo se acota.

Ejemplo con `typeof`:

```ts
function padLeft(valor: string | number, padding: string | number) {
  if (typeof padding === "number") {
    return " ".repeat(padding) + valor;
  }
  return padding + valor;
}
```

### Intersecciones (intersection types)

Combinan múltiples tipos en uno solo. Un valor debe satisfacer todas las restricciones.

```ts
interface ErrorHandling {
  success: boolean;
  error?: string;
}
interface Datos {
  contenido: string;
}
type RespuestaApi = Datos & ErrorHandling;
// { contenido: string; success: boolean; error?: string }
```

Las intersecciones son comunes para mixins y para extender tipos.

### Template literal types con uniones

Desde TS 4.1, los template literal types pueden distribuir sobre uniones:

```ts
type Vertical = "top" | "bottom";
type Horizontal = "left" | "right";
type Posicion = `${Vertical}-${Horizontal}`;
// "top-left" | "top-right" | "bottom-left" | "bottom-right"
```

Combinado con `Capitalize` y tipos mapeados, genera potentes transformaciones.

### `const` assertions

`as const` convierte un objeto/array en tipos de solo lectura con los tipos literales más específicos.

```ts
const persona = {
  nombre: "Ana",
  edad: 30
} as const;
// persona.nombre es de tipo "Ana", no string
// persona.edad es de tipo 30, no number
```

Esto es útil para crear uniones de literales a partir de objetos existentes.

---

## 4. Interfaces vs Types

Ambos definen la forma de un objeto, pero tienen capacidades y filosofías diferentes.

### Interfaces

```ts
interface Usuario {
  nombre: string;
  edad: number;
  saludar(): void;
}
```

- **Extensión**: mediante `extends`, pueden heredar de otras interfaces.
- **Merging**: múltiples declaraciones con el mismo nombre en el mismo ámbito se fusionan automáticamente.
- **Performance**: ligeramente más rápidas en el compilador para objetos, porque fueron diseñadas para ello.

```ts
interface Animal {
  nombre: string;
}
interface Perro extends Animal {
  ladrar(): void;
}
// Declaración merging: útil para extender tipos globales
interface Window {
  miFuncion: () => void;
}
```

### Type aliases

```ts
type Usuario = {
  nombre: string;
  edad: number;
  saludar(): void;
};
```

- No pueden fusionarse; si se redeclaran, causa error.
- Pueden representar **cualquier** tipo: primitivas, uniones, intersecciones, tuplas.
- Permiten tipos condicionales y mapeados de forma natural.

```ts
type ID = string | number;
type Punto = [number, number];
type Respuesta<T> = { datos: T; error?: string };
```

### Cuándo usar cada uno

- Prefiere **interfaces** para describir la forma de objetos que puedan ser extendidos por terceros o que forman parte de APIs públicas. El merging es una ventaja para aumentación.
- Prefiere **type** para uniones, intersecciones complejas, tipos mapeados, tipos condicionales o cuando necesitas nombrar un tipo compuesto no exclusivamente de objeto.

En la práctica, la mayoría del código puede ser escrito con ambos, y muchos proyectos eligen `type` por consistencia, salvo cuando necesitan merging.

### Diferencias profundas

- **Recursividad**: los tipos permiten referencias recursivas más naturalmente (ej. `type Arbol<T> = { valor: T; hijos: Arbol<T>[] }`). Las interfaces también pueden, pero a veces necesitan un `interface` auxiliar.
- **Mapped types**: solo se pueden crear con `type`. Una interfaz no puede generarse dinámicamente a partir de un `keyof`.
- **Uniones de interfaces** no se pueden declarar directamente, pero puedes usar `type Union = InterfaceA | InterfaceB`.
- **Errores**: cuando usas interfaces, los mensajes de error suelen mostrar el nombre de la interfaz; con tipos, a veces se expande la forma completa, lo que puede ser más o menos legible.

### Index signatures y ambas

Tanto interfaces como types soportan firmas de índice:

```ts
interface Diccionario {
  [clave: string]: number;
}
type DiccionarioType = { [clave: string]: number };
```

Para combinarlas con propiedades conocidas, se requiere que el tipo de la propiedad coincida con el de la firma.

### Implementación en clases

Una clase puede `implement` tanto una interfaz como un tipo con forma de objeto (si está compuesto por propiedades/métodos). Las uniones no pueden implementarse directamente.

```ts
interface Imprimible { print(): void }
class Documento implements Imprimible {
  print() { }
}
```

### Recomendaciones finales

- Si estás construyendo una librería, usa interfaces para puntos de extensión.
- Si necesitas definir un tipo que es una unión, o un tipo mapeado, no tienes más opción que `type`.
- Para objetos sin previsión de extensión, ambos funcionan. Consistencia > preferencia.

---

## 5. Funciones

TypeScript permite tipar completamente las funciones: parámetros, retorno, contexto `this` y sobrecargas.

### Tipado básico

```ts
function sumar(a: number, b: number): number {
  return a + b;
}
// Expresión de función
const restar: (a: number, b: number) => number = (x, y) => x - y;
```

La inferencia contextual puede deducir los tipos de parámetros si el tipo de la variable está definido.

### Parámetros opcionales y con valor por defecto

```ts
function construir(nombre: string, edad?: number): string {
  return `${nombre} (${edad ?? "desconocida"})`;
}
function incrementar(base: number, delta = 1): number {
  return base + delta;
}
```

El parámetro opcional `edad?` recibe el tipo `number | undefined`. Los valores por defecto no necesitan `?`, ya que la inferencia sabe que es opcional para el llamador.

### Parámetros rest

```ts
function concatenar(separador: string, ...partes: string[]): string {
  return partes.join(separador);
}
```

### Sobrecargas de funciones

Se escriben múltiples firmas de declaración seguidas de una implementación. Las firmas externas son las visibles; la implementación debe ser compatible con todas.

```ts
function procesar(valor: string): string;
function procesar(valor: number): number;
function procesar(valor: string | number): string | number {
  if (typeof valor === "string") return valor.toUpperCase();
  return valor * 2;
}
```

Solo la implementación tiene cuerpo. Las sobrecargas son útiles cuando el tipo de retorno depende del tipo de entrada de manera precisa.

### El tipo `Function`

Es un tipo global que representa cualquier función. Mejor evitarlo; prefiere `(...args: any[]) => any` o definir la firma exacta.

### Tipado de `this`

El contexto de `this` puede ser tipado declarando un falso primer parámetro llamado `this`:

```ts
interface Carta {
  palo: string;
  valor: number;
}
function jugar(this: Carta, apuesta: number) { ... }
```

Si una función se llama sin el contexto adecuado, el compilador lo detecta. No se emite en JS.

### Funciones como tipos (call signatures)

En interfaces o tipos, puedes definir una función de la siguiente manera:

```ts
interface Comparador {
  (a: number, b: number): number;
  descripcion: string;
}
const miComparador: Comparador = (x, y) => x - y;
miComparador.descripcion = "Orden numérico";
```

Esto permite objetos llamables.

### Construct signatures

Para tipar constructores (clases) se usa `new`:

```ts
type ConstructorDeFecha = new (fecha: string) => Date;
const Ctor: ConstructorDeFecha = Date;
```

### Generic functions

Las funciones pueden tener parámetros de tipo para capturar relaciones:

```ts
function identidad<T>(arg: T): T {
  return arg;
}
function primerElemento<T>(arr: T[]): T | undefined {
  return arr[0];
}
```

TypeScript infiere `T` automáticamente al llamar. Se puede especificar manualmente: `identidad<number>(42)`.

### Extender funciones con genéricos

Puedes añadir restricciones: `<T extends { length: number }>` para asegurar que `T` tenga una propiedad `length`.

### Funciones de tipo guard (type predicates)

Una función que devuelve `valor is Tipo` indica al compilador que, si retorna `true`, el parámetro es de ese tipo en el bloque siguiente.

```ts
function esString(valor: unknown): valor is string {
  return typeof valor === "string";
}
```

---

## 6. Clases

TypeScript añade a las clases de ES6 características de tipado estático y acceso controlado.

### Campos y modificadores de acceso

- **public**: accesible desde cualquier lugar (por defecto).
- **protected**: accesible dentro de la clase y subclases.
- **private**: accesible solo dentro de la clase.

Estos modificadores son solo en tiempo de compilación. En runtime, todo es accesible (a menos que uses `#`).

```ts
class Animal {
  public nombre: string;
  private edad: number;
  protected especie: string;

  constructor(nombre: string, edad: number, especie: string) {
    this.nombre = nombre;
    this.edad = edad;
    this.especie = especie;
  }
}
```

### Parámetros de constructor con modificadores

Atajo para declarar e inicializar campos:

```ts
class Vehiculo {
  constructor(public marca: string, private velocidad: number) {}
}
// Equivale a declarar las propiedades y asignarlas en el constructor.
```

### `readonly`

Propiedades que solo pueden asignarse durante la inicialización (en la declaración o en el constructor).

```ts
class Circulo {
  readonly PI = 3.1416;
  readonly radio: number;
  constructor(r: number) {
    this.radio = r;
  }
}
```

### Herencia e interfaces

- `extends` para herencia de clase.
- `implements` para implementar interfaces (o tipos con forma de objeto).

```ts
interface Volador {
  volar(): void;
}
class Pajaro extends Animal implements Volador {
  volar() { /*...*/ }
}
```

### Miembros estáticos

Propiedades y métodos de la clase, no de la instancia.

```ts
class Util {
  static version = "1.0";
  static hacerAlgo() {}
}
```

### Clases abstractas

No se pueden instanciar directamente. Pueden contener métodos abstractos que las subclases deben implementar.

```ts
abstract class Figura {
  abstract area(): number;
  descripcion(): string {
    return `Área: ${this.area()}`;
  }
}
class Cuadrado extends Figura {
  constructor(private lado: number) { super(); }
  area() { return this.lado ** 2; }
}
```

### Getters y setters

Permiten lógica en acceso a propiedades.

```ts
class Persona {
  private _nombre: string;
  get nombre(): string { return this._nombre; }
  set nombre(valor: string) {
    if (!valor) throw new Error("Nombre no válido");
    this._nombre = valor;
  }
}
```

### Campos privados nativos (`#`)

Desde ECMAScript 2022, TypeScript soporta `#` para privacidad en runtime, que es verdaderamente privada.

```ts
class Banco {
  #saldo = 0;
  depositar(monto: number) { this.#saldo += monto; }
}
```

Es compatible con el modificador `private`, pero con diferencias: `private` es solo en tiempo de compilación y permite acceso desde otras instancias de la misma clase; `#` es privado a nivel de instancia incluso en runtime.

### `this` polimórfico

Puedes usar `this` como tipo de retorno en métodos para permitir encadenamiento fluido en subclases.

```ts
class ConstructorHTML {
  agregarClase(className: string): this {
    // ...
    return this;
  }
}
class ConstructorExtendido extends ConstructorHTML {
  otroMetodo(): this { return this; }
}
new ConstructorExtendido().agregarClase("activo").otroMetodo(); // ok
```

### Clases como tipos

Una clase define tanto un valor (el constructor) como un tipo (la forma de sus instancias). Se puede usar el nombre de la clase directamente como tipo.

```ts
let gato: Animal = new Animal("Michi", 3, "felino");
```

Además, `typeof MiClase` captura el tipo del constructor (función constructora).

---

## 7. Genéricos – Introducción

Los genéricos permiten escribir código reutilizable que mantiene la información de tipos.

### Funciones genéricas básicas

```ts
function identidad<T>(arg: T): T {
  return arg;
}
// Llamada inferida
let salida = identidad("cadena");  // T inferido como string
// Llamada explícita
let numero = identidad<number>(42);
```

### Genéricos en interfaces y tipos

```ts
interface Par<T, U> {
  primero: T;
  segundo: U;
}
let par: Par<string, number> = { primero: "hola", segundo: 10 };
```

### Restricciones (constraints)

Limitan el tipo que puede usarse con `extends`:

```ts
function longitud<T extends { length: number }>(arg: T): number {
  return arg.length;
}
longitud("texto"); // ok
longitud([1, 2, 3]); // ok
// longitud(100); // error, number no tiene length
```

### Usar parámetros de tipo en la restricción

```ts
function obtenerPropiedad<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}
```

### Parámetros de tipo por defecto

```ts
interface Respuesta<T = string> {
  datos: T;
}
let resp: Respuesta = { datos: "ok" }; // T = string
let respNum: Respuesta<number> = { datos: 200 };
```

### Clases genéricas

```ts
class Pila<T> {
  private items: T[] = [];
  push(item: T) { this.items.push(item); }
  pop(): T | undefined { return this.items.pop(); }
}
```

### Inferencia de tipos en genéricos

TypeScript infiere los tipos siempre que puede. En funciones factory, inferencia contextual, etc. En algunos casos, puede ser necesario ayudar al compilador con una anotación.

### Genéricos en tipos mapeados y condicionales (breve mención)

Los genéricos son la base para tipos avanzados como `Partial<T>`, `Readonly<T>`, `Pick<T, K>`, `Record<K, T>`. Estos se construyen usando tipos mapeados y genéricos.

```ts
type Readonly<T> = { readonly [P in keyof T]: T[P] };
```

### Varianza

Desde TS 4.7, los genéricos pueden anotarse con `in` (entrada, contravariante) y `out` (salida, covariante) para mejorar la inferencia y chequeo en estructuras más complejas. No es necesario para el uso diario básico.

### Patrones comunes

- **Función identidad tipada**.
- **Restringir con `extends`**.
- **Devolver tipos mapeados condicionales**.
- **Extraer tipos de promesas** (`Awaited` usa genéricos condicionales).

---

## 8. Enums

Los enums (enumeraciones) agrupan un conjunto de constantes con nombre.

### Enums numéricos

```ts
enum Direccion {
  Arriba,    // 0
  Abajo,     // 1
  Izquierda, // 2
  Derecha    // 3
}
let dir: Direccion = Direccion.Arriba;
```

Se puede inicializar con un valor específico; los siguientes se autoincrementan.

```ts
enum Estado {
  Activo = 1,
  Inactivo,    // 2
  Pendiente = 5,
  Cancelado    // 6
}
```

**Reverse mapping**: en enums numéricas, también se puede acceder al nombre desde el valor.

```ts
let nombreEstado: string = Estado[2]; // "Inactivo"
```

### Enums de cadena

Cada miembro debe inicializarse con una cadena literal. No tienen reverse mapping.

```ts
enum Colores {
  Rojo = "ROJO",
  Verde = "VERDE",
  Azul = "AZUL"
}
```

Son más legibles en depuración.

### Enums heterogéneas

Mezcla de string y número; no recomendado.

### Const enums

Se definen con `const enum`. El compilador inlinea los valores en lugar de generar un objeto de enum en tiempo de ejecución.

```ts
const enum Tamaño {
  Pequeño = 1,
  Mediano,
  Grande
}
let t = Tamaño.Grande; // compila a let t = 3
```

**Precaución**: si el código es consumido por otros módulos que no usan TypeScript, o si la opción `isolatedModules` está activa, los `const enum` pueden causar errores porque no existe el objeto en runtime. Muchos proyectos los evitan.

### Enums como tipos

Una enum define tanto un valor (objeto) como un tipo. El tipo representa la unión de todos los miembros.

```ts
type Color = Colores; // "ROJO" | "VERDE" | "AZUL"
let c: Color = Colores.Rojo;
```

Desde TS 5.0, todas las enums se tratan como uniones de sus miembros, mejorando la compatibilidad.

### Enums ambientales

Se usan para describir enums que existen en runtime pero que TypeScript no puede ver (por ejemplo, en código JS antiguo). Con `declare enum` no se emite código.

```ts
declare enum EnumExterno {
  A = 1,
  B,
  C = 2
}
```

### Enums vs uniones de literales

Para la mayoría de los casos, las uniones de literales (`type Color = "rojo" | "verde" | "azul"`) son más ligeras, no generan código adicional y no presentan los problemas de los `const enum`. Las enums son útiles si necesitas reverse mapping, iterar sobre los miembros, o si el valor numérico es relevante en el runtime.

### Computed members

En enums numéricas, los miembros pueden tener valores calculados (expresiones constantes). Las de cadena solo pueden ser literales.

```ts
enum Archivo {
  None = 0,
  Read = 1 << 1,
  Write = 1 << 2,
  ReadWrite = Read | Write
}
```

Esto permite bit flags. Para este caso, las enums son muy apropiadas.

---

Con estos ocho bloques fundamentales bien asentados, se dispone de la base para aprovechar todo el sistema de tipos de TypeScript y abordar construcciones más avanzadas. Cada uno de estos temas puede expandirse aún más con ejercicios y exploración de las opciones del compilador, pero la profundidad aquí presentada cubre desde lo sintáctico hasta los porqués, las trampas y las mejores prácticas.

---

