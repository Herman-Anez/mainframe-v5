# Funciones

TypeScript permite tipar completamente las funciones: parámetros, retorno, contexto `this` y sobrecargas.

## Tipado básico

```ts
function sumar(a: number, b: number): number {
  return a + b;
}
// Expresión de función
const restar: (a: number, b: number) => number = (x, y) => x - y;
```

La inferencia contextual puede deducir los tipos de parámetros si el tipo de la variable está definido.

## Parámetros opcionales y con valor por defecto

```ts
function construir(nombre: string, edad?: number): string {
  return `${nombre} (${edad ?? "desconocida"})`;
}
function incrementar(base: number, delta = 1): number {
  return base + delta;
}
```

El parámetro opcional `edad?` recibe el tipo `number | undefined`. Los valores por defecto no necesitan `?`, ya que la inferencia sabe que es opcional para el llamador.

## Parámetros rest

```ts
function concatenar(separador: string, ...partes: string[]): string {
  return partes.join(separador);
}
```

## Sobrecargas de funciones

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

## El tipo `Function`

Es un tipo global que representa cualquier función. Mejor evitarlo; prefiere `(...args: any[]) => any` o definir la firma exacta.

## Tipado de `this`

El contexto de `this` puede ser tipado declarando un falso primer parámetro llamado `this`:

```ts
interface Carta {
  palo: string;
  valor: number;
}
function jugar(this: Carta, apuesta: number) { ... }
```

Si una función se llama sin el contexto adecuado, el compilador lo detecta. No se emite en JS.

## Funciones como tipos (call signatures)

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

## Construct signatures

Para tipar constructores (clases) se usa `new`:

```ts
type ConstructorDeFecha = new (fecha: string) => Date;
const Ctor: ConstructorDeFecha = Date;
```

## Generic functions

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

## Extender funciones con genéricos

Puedes añadir restricciones: `<T extends { length: number }>` para asegurar que `T` tenga una propiedad `length`.

## Funciones de tipo guard (type predicates)

Una función que devuelve `valor is Tipo` indica al compilador que, si retorna `true`, el parámetro es de ese tipo en el bloque siguiente.

```ts
function esString(valor: unknown): valor is string {
  return typeof valor === "string";
}
```

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Interfaces vs Types](04-interfaces-vs-types.md) | [🏠 Inicio](../index.md) | [Clases ▶](06-clases.md) |
