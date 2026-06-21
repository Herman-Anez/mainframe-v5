# `ejemplos/01-tipos-basicos/`

Contiene archivos que demuestran los tipos primitivos, arrays, tuplas, uniones literales, narrowing y funciones.

## `primitives.ts`

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

## `arrays-tuples.ts`

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

## `literal-unions.ts`

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

## `narrowing.ts`

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

## `functions.ts`

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

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Roadmap – TypeScript presente y futuro (2026)](../08-novedades/03-roadmap-typescript-presente-y-futuro-2026.md) | [🏠 Inicio](../index.md) | [`ejemplos/02-genericos/` ▶](02-ejemplos02-genericos.md) |
