# Conditional overloads

La sobrecarga de funciones es una forma de declarar múltiples firmas para una misma función. Sin embargo, a veces los mapeos entre tipos de entrada y salida son más expresables con **tipos condicionales genéricos** que con sobrecargas tradicionales.

## Sobrecarga clásica vs tipo condicional genérico

### Enfoque con sobrecargas

```ts
function procesar(entrada: string): number;
function procesar(entrada: number): string;
function procesar(entrada: string | number): string | number {
  if (typeof entrada === "string") return entrada.length;
  return entrada.toString();
}
```

La implementación debe ser compatible con todas las firmas (usualmente se tipa con la unión). Esto funciona, pero si añadimos más tipos, el número de sobrecargas crece linealmente.

### Enfoque con tipo condicional

```ts
function procesar<T extends string | number>(
  entrada: T
): T extends string ? number : string {
  if (typeof entrada === "string") return entrada.length as any;
  return entrada.toString() as any;
}
```

El tipo de retorno se define condicionalmente sobre `T`. TypeScript no puede validar la implementación contra el tipo condicional directamente, así que normalmente se necesita una aserción (`as any`). Pero la **firma externa** es precisa y el autocompletado funciona mejor.

## Ventajas de los condicionales sobre las sobrecargas

- **Distribución automática sobre uniones**: Si llamamos a `procesar` con `string | number`, el tipo de retorno será `number | string`, mientras que con sobrecargas puede que se tome la unión de las firmas de una forma menos específica.
- **Mapeos declarativos**: Se puede escribir una sola función que cubra un dominio grande (ej. mapeo de eventos a payloads).
- **Mejor integración con genéricos**: Los tipos condicionales pueden combinarse con `infer`, `extends` y otros patrones.

## Ejemplo: manejador de eventos tipado

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

## Cuándo sí usar sobrecargas

- Cuando la lógica de implementación varía drásticamente según los tipos de entrada y no se puede unificar con un genérico.
- Cuando se necesita restringir el uso con `never` para prohibir combinaciones no válidas (se puede combinar con condicionales también).
- Para mejorar la experiencia de autocompletado cuando el tipo condicional se vuelve demasiado complejo.

## Combinación: firma externa con tipo condicional + implementación con aserción

Es común separar la firma pública (con tipo condicional) de la implementación interna:

```ts
function obtenerPropiedad<T, K extends keyof T>(obj: T, key: K): T[K];
function obtenerPropiedad(obj: any, key: string): any {
  return obj[key];
}
```

La firma de sobrecarga externa usa `T[K]` (que es indexado, un caso particular de tipo condicional). La implementación es más laxa y no afecta a los consumidores.

## Buenas prácticas

- Para mapeos de tipo entrada → salida que dependen de un literal, prefiere tipos condicionales o acceso indexado.
- Documenta los condicionales complejos; la legibilidad puede sufrir.
- Si necesitas validar la implementación con un tipo muy estricto, considera si la sobrecarga tradicional es suficiente.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Functional patterns](05-functional-patterns.md) | [🏠 Inicio](../index.md) | [Recursive types ▶](07-recursive-types.md) |
