# Funciones generadoras

## Definición y sintaxis

Las funciones generadoras se declaran con `function*` y permiten pausar y reanudar su ejecución mediante la palabra clave `yield`. Al invocarlas, no ejecutan su cuerpo; en su lugar, devuelven un objeto **Generator**, que es a la vez iterador e iterable.

```javascript
function* contador() {
  yield 1;
  yield 2;
  yield 3;
}

const gen = contador(); // Generator
console.log(gen.next()); // { value: 1, done: false }
console.log(gen.next()); // { value: 2, done: false }
console.log(gen.next()); // { value: 3, done: false }
console.log(gen.next()); // { value: undefined, done: true }
```

### El protocolo Generator

Un objeto generador implementa tres métodos principales:

- **`next(value?)`**: reanuda la ejecución hasta el siguiente `yield` (o `return`/final). El argumento opcional `value` se convierte en el valor retornado por la expresión `yield` que pausó. Retorna `{ value, done }`.
- **`return(value?)`**: finaliza prematuramente el generador, como si un `return` se hubiera ejecutado. La siguiente llamada a `next()` devolverá `{ value: undefined, done: true }`. El valor pasado a `return` se asigna al resultado de la expresión `yield` en curso y el estado del generador pasa a `"closed"`.
- **`throw(error)`**: lanza una excepción dentro del generador justo en el punto donde está pausado. El generador puede capturarla con `try/catch`. Si no la captura, el generador se cierra y la excepción se propaga.

### Expresión `yield`

`yield` pausa la ejecución y devuelve el valor al `next()`. La expresión `yield` puede recibir datos cuando el generador se reanuda con `next(valor)`. Así se establece una comunicación bidireccional.

```javascript
function* eco() {
  const recibido = yield "Enviame algo";
  console.log("Recibí:", recibido);
}
const g = eco();
console.log(g.next().value);        // "Enviame algo"
g.next("Hola desde fuera");        // Imprime: Recibí: Hola desde fuera
```

### `yield*` – delegación a otro iterable

`yield*` delega la iteración a otro generador, iterable o incluso a una cadena. Cada valor producido por la fuente delegada es retornado por el generador padre.

```javascript
function* aplanar(arr) {
  for (const item of arr) {
    if (Array.isArray(item)) {
      yield* aplanar(item);
    } else {
      yield item;
    }
  }
}

const array = [1, [2, [3, 4]], 5];
[...aplanar(array)]; // [1,2,3,4,5]
```

`yield*` también puede capturar el valor retornado por el generador delegado (si este ejecuta un `return`), aunque es poco común:

```javascript
function* sub() {
  yield 1;
  return "finalizado";
}
function* principal() {
  const resultado = yield* sub();
  console.log(resultado); // "finalizado"
}
```

### Generadores como iterables

Los objetos generadores son iterables (tienen `[Symbol.iterator]()` que se retorna a sí mismo). Por tanto, se pueden usar con `for...of`, spread, etc.

```javascript
for (const n of contador()) {
  console.log(n); // 1,2,3
}
```

### Aplicaciones prácticas

- **Secuencias infinitas**: modelar una serie que se evalúa bajo demanda (ej. números de Fibonacci).
  ```javascript
  function* fibonacci() {
    let a = 0, b = 1;
    while (true) {
      yield a;
      [a, b] = [b, a + b];
    }
  }
  ```
- **Iteración personalizada**: implementar `[Symbol.iterator]` de forma concisa.
- **Corrutinas simples**: comunicación bidireccional para flujos de trabajo (antes de async/await era un patrón para manejar asincronía con librerías como `co`).
- **Manejo de recursos con `try...finally`**: si un generador se cierra prematuramente (con `return()` o `throw()`), se ejecuta el bloque `finally`, permitiendo liberar recursos.

### Generadores asíncronos (`async function*`)

Producen un **AsyncGenerator** que implementa `Symbol.asyncIterator` y se consume con `for await...of`. Permiten pausar la generación hasta que una promesa se resuelva.

```javascript
async function* paginas(url) {
  let pagina = 1;
  while (true) {
    const respuesta = await fetch(`${url}?page=${pagina}`);
    const datos = await respuesta.json();
    if (datos.length === 0) break;
    yield datos;
    pagina++;
  }
}

// Consumo
for await (const items of paginas('https://api.example.com/datos')) {
  console.log(items);
}
```

### Estados internos y cierre

Un generador puede estar en estado `"suspended"`, `"executing"` o `"closed"`. La propiedad interna `[[GeneratorState]]` refleja su estado. Llamar `return()` o `throw()` que no sea capturado cierra el generador definitivamente.

### Precauciones

- Los generadores no pueden ser usados como constructores (no tienen `[[Construct]]`).
- Al delegar con `yield*`, si el iterable delegado no tiene un cierre limpio y se lanza una excepción, esta se propaga al generador delegante.
- La iteración con `for...of` llama implícitamente a `return()` cuando se rompe el bucle o se lanza un error, lo que permite la limpieza.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Iife y recursividad](06-iife-y-recursividad.md) | [🏠 Inicio](../index.md) | [Parametros por defecto ▶](08-parametros-por-defecto.md) |
