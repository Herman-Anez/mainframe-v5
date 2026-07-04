# Iterables generadores

## Protocolo iterable e iterador

JavaScript define un protocolo estándar para que los objetos definan su comportamiento de iteración.

- **Iterable:** un objeto que tiene un método `Symbol.iterator` que devuelve un **iterador**.
- **Iterador:** un objeto con un método `next()` que retorna `{ value, done }`. Cuando `done` es `true`, la iteración ha terminado. Opcionalmente puede tener `return()` y `throw()`.

### Uso en `for...of`

El bucle `for...of` consume iterables:
```javascript
for (const item of iterable) { /* ... */ }
```
El bucle llama a `[Symbol.iterator]()` una vez, y luego llama a `next()` repetidamente hasta que `done` sea `true`.

### Iterables nativos

- Arrays, strings, Map, Set, TypedArrays, NodeList, `arguments` (en funciones no flecha).
- Los objetos generadores (devueltos por funciones generadoras) son iterables e iteradores a la vez.

## Creación de iteradores personalizados

Mediante `Symbol.iterator`:

```javascript
const rango = {
  inicio: 1,
  fin: 5,
  [Symbol.iterator]() {
    let actual = this.inicio;
    const fin = this.fin;
    return {
      next() {
        if (actual > fin) return { done: true };
        return { value: actual++, done: false };
      }
    };
  }
};
for (const n of rango) { console.log(n); } // 1 2 3 4 5
```

Un iterador puede también implementar `return(value)` para limpieza anticipada (cuando se rompe un bucle) y `throw(error)` para propagar errores.

## Generadores (`function*`)

Son una forma concisa de crear iteradores. Una función generadora devuelve un **objeto Generator**, que es iterador e iterable.

### `yield` y pausa

```javascript
function* generador() {
  yield 1;
  yield 2;
  yield 3;
}
const gen = generador();
console.log(gen.next()); // { value: 1, done: false }
console.log(gen.next()); // { value: 2, done: false }
console.log(gen.next()); // { value: 3, done: false }
console.log(gen.next()); // { value: undefined, done: true }
```

### Comunicación bidireccional: `next(value)`

El valor pasado a `next()` se convierte en el resultado de la expresión `yield` que pausó:

```javascript
function* eco() {
  const recibido = yield "dime algo";
  yield `Recibí: ${recibido}`;
}
const g = eco();
console.log(g.next().value); // "dime algo"
console.log(g.next("Hola").value); // "Recibí: Hola"
```

### `yield*` para delegación

Delega la iteración a otro iterable:

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
[...aplanar([1, [2, 3]])]; // [1, 2, 3]
```

### Finalización anticipada: `return()` y `throw()`

- **`gen.return(valor)`**: termina el generador, como un `return` interno. Cualquier bloque `finally` se ejecuta.
- **`gen.throw(error)`**: lanza una excepción en el punto de pausa. Puede capturarse dentro del generador.

### Generadores asíncronos (`async function*`)

Producen un **AsyncGenerator** que implementa `Symbol.asyncIterator`. Se consumen con `for await...of`. Cada `yield` puede esperar una promesa.

```javascript
async function* leerLineas(stream) {
  // ... lógica asíncrona
}
for await (const linea of leerLineas(process.stdin)) {
  console.log(linea);
}
```

## Aplicaciones prácticas

- **Secuencias infinitas**: generar IDs, números de Fibonacci, etc.
- **Lazy evaluation**: procesar datos bajo demanda sin cargarlos todos en memoria.
- **Operaciones asíncronas encadenadas**: con generadores asíncronos.
- **Implementar iteradores personalizados** con código más legible que el manual.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Weakmap weakset](07-weakmap-weakset.md) | [🏠 Inicio](../index.md) | [Arrays tipados ▶](09-arrays-tipados.md) |
