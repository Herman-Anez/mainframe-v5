# Genéricos – Introducción

Los genéricos permiten escribir código reutilizable que mantiene la información de tipos.

## Funciones genéricas básicas

```ts
function identidad<T>(arg: T): T {
  return arg;
}
// Llamada inferida
let salida = identidad("cadena");  // T inferido como string
// Llamada explícita
let numero = identidad<number>(42);
```

## Genéricos en interfaces y tipos

```ts
interface Par<T, U> {
  primero: T;
  segundo: U;
}
let par: Par<string, number> = { primero: "hola", segundo: 10 };
```

## Restricciones (constraints)

Limitan el tipo que puede usarse con `extends`:

```ts
function longitud<T extends { length: number }>(arg: T): number {
  return arg.length;
}
longitud("texto"); // ok
longitud([1, 2, 3]); // ok
// longitud(100); // error, number no tiene length
```

## Usar parámetros de tipo en la restricción

```ts
function obtenerPropiedad<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}
```

## Parámetros de tipo por defecto

```ts
interface Respuesta<T = string> {
  datos: T;
}
let resp: Respuesta = { datos: "ok" }; // T = string
let respNum: Respuesta<number> = { datos: 200 };
```

## Clases genéricas

```ts
class Pila<T> {
  private items: T[] = [];
  push(item: T) { this.items.push(item); }
  pop(): T | undefined { return this.items.pop(); }
}
```

## Inferencia de tipos en genéricos

TypeScript infiere los tipos siempre que puede. En funciones factory, inferencia contextual, etc. En algunos casos, puede ser necesario ayudar al compilador con una anotación.

## Genéricos en tipos mapeados y condicionales (breve mención)

Los genéricos son la base para tipos avanzados como `Partial<T>`, `Readonly<T>`, `Pick<T, K>`, `Record<K, T>`. Estos se construyen usando tipos mapeados y genéricos.

```ts
type Readonly<T> = { readonly [P in keyof T]: T[P] };
```

## Varianza

Desde TS 4.7, los genéricos pueden anotarse con `in` (entrada, contravariante) y `out` (salida, covariante) para mejorar la inferencia y chequeo en estructuras más complejas. No es necesario para el uso diario básico.

## Patrones comunes

- **Función identidad tipada**.
- **Restringir con `extends`**.
- **Devolver tipos mapeados condicionales**.
- **Extraer tipos de promesas** (`Awaited` usa genéricos condicionales).

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Clases](06-clases.md) | [🏠 Inicio](../index.md) | [Enums ▶](08-enums.md) |
