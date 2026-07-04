# `ejemplos/02-genericos/`

Ejemplos de funciones, interfaces, restricciones y clases genéricas.

## `generic-functions.ts`

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

## `generic-interfaces.ts`

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

## `generic-constraints.ts`

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

## `utility-types.ts`

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

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ `ejemplos/01-tipos-basicos/`](01-ejemplos01-tipos-basicos.md) | [🏠 Inicio](../index.md) | [`ejemplos/03-mapped-types/` ▶](03-ejemplos03-mapped-types.md) |
