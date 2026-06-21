## `ejemplos/01-tipos-basicos/`

Contiene archivos que demuestran los tipos primitivos, arrays, tuplas, uniones literales, narrowing y funciones.

### `primitives.ts`

```ts
// Tipos primitivos con anotación explícita
const activo: boolean = true;
const cantidad: number = 42;
const mensaje: string = "TypeScript";
const simbolo: symbol = Symbol("id");
const granEntero: bigint = 9007199254740991n;

// null y undefined con strictNullChecks (actívalo en tsconfig)
let nulo: null = null;
let indefinido: undefined = undefined;

// any vs unknown
let cualquiera: any = "puede ser cualquier cosa";
cualquiera.toFixed(); // ningún error en compilación, falla en runtime

let desconocido: unknown = "valor seguro";
// desconocido.toUpperCase(); // Error: 'unknown' no es asignable
if (typeof desconocido === "string") {
  console.log(desconocido.toUpperCase()); // OK, estrechado a string
}

// void y never
function saludar(): void {
  console.log("Hola");
}
function lanzarError(mensaje: string): never {
  throw new Error(mensaje);
}
```

### `arrays-tuples.ts`

```ts
// Arrays
const numeros: number[] = [1, 2, 3];
const cadenas: Array<string> = ["a", "b"];

// Tuplas
let par: [string, number] = ["edad", 30];
// par[0].toUpperCase(); // inferido como string
// par[1].toFixed();      // inferido como number

// Tupla con elementos opcionales y rest
type Config = [modo: string, nivel?: number, ...tags: string[]];
const config1: Config = ["debug"];
const config2: Config = ["prod", 3, "server", "cache"];

// Acceso con etiquetas (solo para documentación, no afecta runtime)
// config2[0] es string, aunque la etiqueta 'modo' no es accesible en JS
```

### `literal-unions.ts`

```ts
// Tipos literales y uniones
type ColorPrimario = "rojo" | "verde" | "azul";
function pintar(color: ColorPrimario) {
  console.log(`Pintando en ${color}`);
}
pintar("rojo");
// pintar("amarillo"); // Error

// Unión de literales numéricos
type Dado = 1 | 2 | 3 | 4 | 5 | 6;
let tirada: Dado = 3;

// Unión discriminada simple
type Forma =
  | { tipo: "circulo"; radio: number }
  | { tipo: "rectangulo"; ancho: number; alto: number };

function area(f: Forma): number {
  switch (f.tipo) {
    case "circulo":
      return Math.PI * f.radio ** 2;
    case "rectangulo":
      return f.ancho * f.alto;
  }
}

// Uso de as const para crear unión literal
const colores = ["rojo", "verde", "azul"] as const;
type Color = (typeof colores)[number]; // "rojo" | "verde" | "azul"
```

### `narrowing.ts`

```ts
// Narrowing con typeof
function procesar(valor: string | number) {
  if (typeof valor === "string") {
    console.log(valor.toUpperCase());
  } else {
    console.log(valor.toFixed(2));
  }
}

// Narrowing con instanceof
class Perro { ladrar() {} }
class Gato { maullar() {} }
function hacerSonido(animal: Perro | Gato) {
  if (animal instanceof Perro) {
    animal.ladrar();
  } else {
    animal.maullar();
  }
}

// Narrowing con 'in'
interface Pez { nadar(): void }
interface Pajaro { volar(): void }
function mover(animal: Pez | Pajaro) {
  if ("nadar" in animal) {
    animal.nadar();
  } else {
    animal.volar();
  }
}

// Type predicate personalizado
function esString(valor: unknown): valor is string {
  return typeof valor === "string";
}
const input: unknown = "texto";
if (esString(input)) {
  input.toUpperCase(); // tipo string
}

// Función de aserción (asserts)
function assertEsNumero(val: unknown): asserts val is number {
  if (typeof val !== "number") throw new Error("No es número");
}
let dato: unknown = 42;
assertEsNumero(dato);
dato.toFixed(0); // ahora es number
```

### `functions.ts`

```ts
// Función con sobrecarga
function combinar(a: string, b: string): string;
function combinar(a: number, b: number): number;
function combinar(a: string | number, b: string | number): string | number {
  if (typeof a === "string" && typeof b === "string") return a + b;
  return (a as number) + (b as number);
}
console.log(combinar("Hola, ", "mundo"));
console.log(combinar(5, 10));

// Función con parámetros opcionales y por defecto
function saludar(nombre: string, saludo: string = "Hola", edad?: number): string {
  const base = `${saludo}, ${nombre}`;
  return edad ? `${base} (${edad} años)` : base;
}

// Tipado de this
interface Carta {
  palo: string;
  valor: number;
}
function jugar(this: Carta, apuesta: number) {
  console.log(`Jugando ${this.valor} de ${this.palo} con apuesta ${apuesta}`);
}
const carta: Carta = { palo: "oros", valor: 7 };
jugar.call(carta, 10); // forzamos contexto
```

---

## `ejemplos/02-genericos/`

Ejemplos de funciones, interfaces, restricciones y clases genéricas.

### `generic-functions.ts`

```ts
// Función identidad genérica
function identidad<T>(arg: T): T {
  return arg;
}
const num = identidad(42);       // T es number
const str = identidad("texto");  // T es string

// Genéricos con restricciones
function obtenerLongitud<T extends { length: number }>(item: T): number {
  return item.length;
}
obtenerLongitud("hola"); // 4
obtenerLongitud([1, 2]); // 2
// obtenerLongitud(123); // Error: number no tiene length

// Genéricos con keyof
function obtenerPropiedad<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}
const persona = { nombre: "Ana", edad: 30 };
const nombre = obtenerPropiedad(persona, "nombre"); // string
```

### `generic-interfaces.ts`

```ts
// Interfaz genérica
interface Par<T, U> {
  primero: T;
  segundo: U;
}
const par1: Par<string, number> = { primero: "hola", segundo: 10 };

// Diccionario genérico
interface Diccionario<T> {
  [clave: string]: T;
}
const edades: Diccionario<number> = {
  "Juan": 25,
  "Ana": 30
};

// Firma de función genérica en interfaz
interface Comparador<T> {
  (a: T, b: T): number;
}
const compararStrings: Comparador<string> = (a, b) => a.localeCompare(b);
```

### `generic-constraints.ts`

```ts
// Restricción con varios parámetros
function asignar<T, U extends T>(destino: T, fuente: U): T {
  return { ...destino, ...fuente };
}
const obj = asignar({ a: 1 }, { a: 2, b: 3 }); // U debe extender T

// Uso de prototype con restricción
class Animal { nombre: string = ""; }
function crearInstancia<T extends Animal>(Ctor: new () => T): T {
  return new Ctor();
}
```

### `utility-types.ts`

```ts
// Uso de los utility types predefinidos
interface Tarea {
  titulo: string;
  descripcion: string;
  completada: boolean;
  id: number;
}

// Partial: todas las propiedades opcionales
type TareaParcial = Partial<Tarea>;

// Required: todas requeridas (aunque originalmente opcionales)
type TareaCompleta = Required<TareaParcial>;

// Pick: subconjunto de propiedades
type TarjetaTarea = Pick<Tarea, "titulo" | "completada">;

// Omit: excluye propiedades
type TareaSinId = Omit<Tarea, "id">;

// Record: objeto con claves de una unión
type Estados = "pendiente" | "activo" | "finalizado";
type ConteoEstados = Record<Estados, number>;

// ReturnType y Parameters
function crearTarea(titulo: string): Tarea {
  return { titulo, descripcion: "", completada: false, id: Math.random() };
}
type TipoTarea = ReturnType<typeof crearTarea>;   // Tarea
type ParametrosCrear = Parameters<typeof crearTarea>; // [string]
```

---

## `ejemplos/03-mapped-types/`

Demuestra tipos mapeados básicos, remapeo de claves, mapeos condicionales y transformaciones profundas.

### `basic-mapped.ts`

```ts
// Readonly manual
type Readonly<T> = { readonly [K in keyof T]: T[K] };
interface Usuario { nombre: string; edad: number; }
type UsuarioReadonly = Readonly<Usuario>;

// Partial y Required
type Parcial<T> = { [K in keyof T]?: T[K] };
type Requerido<T> = { [K in keyof T]-?: T[K] }; // elimina opcionalidad

// Añadir opcionalidad o readonly con + y -
type Mutable<T> = { -readonly [K in keyof T]: T[K] }; // quita readonly
```

### `key-remapping.ts`

```ts
// Remapeo de claves con 'as'
type Getters<T> = {
  [K in keyof T as `get${Capitalize<K & string>}`]: () => T[K];
};
interface Persona { nombre: string; edad: number; }
type PersonaGetters = Getters<Persona>;
// { getNombre: () => string; getEdad: () => number }

// Filtrado de claves: solo propiedades de tipo función
type SoloMetodos<T> = {
  [K in keyof T as T[K] extends (...args: any) => any ? K : never]: T[K];
};
interface Mix {
  saludar: () => void;
  nombre: string;
  edad: number;
}
type MetodosMix = SoloMetodos<Mix>; // { saludar: () => void }
```

### `conditional-mapped.ts`

```ts
// Mapeado condicional en valores
type Nullable<T> = { [K in keyof T]: T[K] | null };
type Parseado<T> = {
  [K in keyof T]: T[K] extends string ? number : T[K];
};

interface ApiData {
  id: string;
  nombre: string;
  activo: boolean;
}
type ApiParsed = Parseado<ApiData>; // id y nombre se convierten a number
```

### `deep-partial.ts`

```ts
// Recursivo profundo
type DeepPartial<T> = T extends object
  ? { [K in keyof T]?: DeepPartial<T[K]> }
  : T;

interface Config {
  server: {
    host: string;
    port: number;
  };
  database: {
    url: string;
  };
}

type PartialConfig = DeepPartial<Config>;
// Todas las propiedades son opcionales en cualquier nivel
const conf: PartialConfig = { server: { host: "localhost" } };
```

---

## `ejemplos/04-conditional-types/`

### `basic-conditional.ts`

```ts
type EsString<T> = T extends string ? true : false;
type A = EsString<"hola">; // true
type B = EsString<42>;     // false

// Distribución sobre unión
type QuitarNull<T> = T extends null | undefined ? never : T;
type SinNull = QuitarNull<string | null | undefined>; // solo string
```

### `infer.ts`

```ts
// Extraer tipo de retorno
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never;
type Fn = () => { id: number; name: string };
type TipoRetorno = ReturnType<Fn>; // { id: number; name: string }

// Extraer elemento de array
type ElementType<T> = T extends (infer U)[] ? U : never;
type El = ElementType<number[]>; // number

// Inferir en promesas (similar a Awaited)
type Awaited<T> = T extends Promise<infer R> ? R : T;
type Valor = Awaited<Promise<string>>; // string
```

### `distributive.ts`

```ts
type Distribuye<T> = T extends any ? T[] : never;
type Result = Distribuye<string | number>; // string[] | number[] (distribuye)

// Evitar distribución
type NoDistribuye<T> = [T] extends [any] ? T[] : never;
type Result2 = NoDistribuye<string | number>; // (string | number)[]
```

---

## `ejemplos/05-template-literals/`

### `string-manipulation.ts`

```ts
type Saludo = `Hola, ${string}`;
let saludo: Saludo = "Hola, TypeScript";

type Vertical = "top" | "bottom";
type Horizontal = "left" | "right";
type Posicion = `${Vertical}-${Horizontal}`;
// "top-left" | "top-right" | "bottom-left" | "bottom-right"

// Capitalizar
type Capitalizar<T extends string> = `${Capitalize<T>}`;
type Mayus = Capitalizar<"hola">; // "Hola"
```

### `route-params.ts`

```ts
type ExtraerParam<Path extends string> =
  Path extends `${string}:${infer Param}/${infer Rest}`
    ? Param | ExtraerParam<Rest>
    : Path extends `${string}:${infer Param}`
      ? Param
      : never;

type Params = ExtraerParam<"/usuario/:id/post/:postId">; // "id" | "postId"
```

### `key-remap-with-template.ts`

```ts
// Crear eventos onEvent a partir de nombres
type Eventos = "click" | "focus" | "blur";
type Handlers = {
  [K in Eventos as `on${Capitalize<K>}`]: () => void;
};
// { onClick: () => void; onFocus: () => void; onBlur: () => void }
```

---

## `ejemplos/06-clases/`

### `access-modifiers.ts`

```ts
class Empleado {
  public nombre: string;
  protected sueldo: number;
  private id: string;

  constructor(nombre: string, sueldo: number, id: string) {
    this.nombre = nombre;
    this.sueldo = sueldo;
    this.id = id;
  }

  protected getInfo(): string {
    return `${this.nombre} (${this.id})`;
  }
}

class Gerente extends Empleado {
  constructor(nombre: string) {
    super(nombre, 50000, "G-" + nombre);
  }

  public reporte() {
    // Puede acceder a sueldo y getInfo por ser protected
    console.log(this.getInfo(), this.sueldo);
  }
}
```

### `abstract.ts`

```ts
abstract class Figura {
  abstract area(): number;
  descripcion(): string {
    return `Área: ${this.area()}`;
  }
}

class Cuadrado extends Figura {
  constructor(private lado: number) { super(); }
  area(): number { return this.lado ** 2; }
}
```

### `this-polymorphic.ts`

```ts
class ConstructorHTML {
  private classes: string[] = [];
  agregarClase(clase: string): this {
    this.classes.push(clase);
    return this;
  }
  construir(): string {
    return `<div class="${this.classes.join(" ")}"></div>`;
  }
}

class ConstructorExtendido extends ConstructorHTML {
  setStyle(style: string): this {
    // ...
    return this;
  }
}

new ConstructorExtendido()
  .agregarClase("container")
  .setStyle("color:red")
  .construir();
```

### `mixins.ts`

```ts
type Constructor<T = {}> = new (...args: any[]) => T;

function ConLog<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    log(msg: string) { console.log(msg); }
  };
}

function ConTimestamp<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    timestamp = Date.now();
  };
}

class Base {}
class Mezclada extends ConTimestamp(ConLog(Base)) {}
const mezcla = new Mezclada();
mezcla.log("Hola");
console.log(mezcla.timestamp);
```

---

## `ejemplos/07-decorators/` (TS 5.0+)

### `class-decorator.ts`

```ts
function sellada(target: Function, context: ClassDecoratorContext) {
  console.log(`Decorando clase ${context.name}`);
}

@sellada
class Vehiculo {
  constructor(public tipo: string) {}
}
```

### `method-decorator.ts`

```ts
function logMethod(target: Function, context: ClassMethodDecoratorContext) {
  const original = target;
  return function (this: any, ...args: any[]) {
    console.log(`Llamando ${String(context.name)}`);
    return original.call(this, ...args);
  };
}

class Calculadora {
  @logMethod
  sumar(a: number, b: number): number {
    return a + b;
  }
}
```

### `field-decorator.ts`

```ts
function mayuscula(initial: string, context: ClassFieldDecoratorContext) {
  return initial.toUpperCase();
}

class Persona {
  @mayuscula
  nombre = "ana"; // se inicializa "ANA"
}
```

### `auto-accessor.ts`

```ts
function observar<T>(accessor: { get: () => T; set: (val: T) => void }, context: ClassAccessorDecoratorContext) {
  return {
    get() { return accessor.get.call(this); },
    set(val: T) {
      console.log(`Cambiando a ${val}`);
      accessor.set.call(this, val);
    }
  };
}

class Contador {
  @observar
  accessor valor = 0;
}
```

---

## `ejemplos/08-modulos/`

### `export-import.ts`

```ts
// archivo math.ts
export const PI = 3.14;
export function sumar(a: number, b: number): number { return a + b; }
export default function restar(a: number, b: number): number { return a - b; }

// archivo main.ts
import restar, { PI, sumar } from './math';
```

### `import-type.ts`

```ts
import type { Usuario } from './models';
let usuario: Usuario; // solo tipo, no genera require/import en JS
```

### `dynamic-import.ts`

```ts
async function cargarModulo() {
  const modulo = await import('./heavyModule');
  modulo.doSomething();
}
```

---

## `ejemplos/09-enums/`

### `string-enum.ts`

```ts
enum Colores {
  Rojo = "ROJO",
  Verde = "VERDE",
  Azul = "AZUL"
}
const color: Colores = Colores.Rojo;
```

### `numeric-enum.ts`

```ts
enum Direccion {
  Arriba,    // 0
  Abajo,     // 1
  Izquierda, // 2
  Derecha    // 3
}
console.log(Direccion[0]); // "Arriba" (reverse mapping)
```

### `const-enum.ts`

```ts
const enum Tamaño {
  Pequeño = 1,
  Mediano,
  Grande
}
let t = Tamaño.Mediano; // compila a let t = 2
```

---

## `ejemplos/10-declaration-files/`

### `global.d.ts`

```ts
// Declaración de variable global (debe estar en archivo sin import/export)
declare var VERSION: string;
declare function $(selector: string): any;
```

### `module-decl.d.ts`

```ts
// Declaración de módulo que no tiene tipos
declare module "libreria-sin-tipos" {
  export function hacerAlgo(): void;
  export const CONFIG: Record<string, unknown>;
}
```

---

## `ejemplos/11-patterns/`

### `discriminated-union.ts`

```ts
type RespuestaApi =
  | { estado: "exito"; datos: unknown }
  | { estado: "error"; mensaje: string }
  | { estado: "cargando" };

function manejar(res: RespuestaApi) {
  switch (res.estado) {
    case "exito":
      console.log(res.datos);
      break;
    case "error":
      console.error(res.mensaje);
      break;
    case "cargando":
      console.log("Cargando...");
      break;
  }
}
```

### `branded-types.ts`

```ts
type UserId = string & { __brand: "UserId" };
type ProductId = string & { __brand: "ProductId" };

function getUser(id: UserId) {}
const userId = "u123" as UserId;
getUser(userId);
// getUser("u123"); // error si no hay aserción
```

### `fluent-api.ts`

```ts
class Query {
  private tabla: string = "";
  private condiciones: string[] = [];

  from(tabla: string): this {
    this.tabla = tabla;
    return this;
  }

  where(cond: string): this {
    this.condiciones.push(cond);
    return this;
  }

  toString() {
    return `SELECT * FROM ${this.tabla} WHERE ${this.condiciones.join(" AND ")}`;
  }
}

const q = new Query().from("users").where("id=1").toString();
```

### `option-result.ts`

```ts
// Option (Maybe)
type Option<T> = { tipo: "some"; valor: T } | { tipo: "none" };
const some = <T>(v: T): Option<T> => ({ tipo: "some", valor: v });
const none: Option<never> = { tipo: "none" };

function map<T, U>(opt: Option<T>, fn: (x: T) => U): Option<U> {
  return opt.tipo === "some" ? some(fn(opt.valor)) : none;
}

// Result
type Result<E, T> = { tipo: "ok"; valor: T } | { tipo: "err"; error: E };
// uso similar
```

---

## `ejemplos/12-tsconfig/`

Aquí se incluyen varios archivos de configuración comentados, como:

- `tsconfig.recomendado.json`: configuración base estricta con módulos ESNext y bundler.
- `tsconfig.node.json`: para Node.js con `module: NodeNext` y `type: module`.
- `tsconfig.declaracion.json`: para librerías, con `declaration: true` y `outDir`.
- `tsconfig.monorepo.json`: ejemplo de uso de `references`.

Cada uno contiene comentarios explicando cada opción.

---

Estos ejemplos forman un laboratorio completo para experimentar con cada faceta de TypeScript. Puedes ejecutarlos individualmente con `ts-node` o compilar con `tsc` y ejecutar con Node.js. La práctica directa es la mejor manera de internalizar los conceptos avanzados.

---
