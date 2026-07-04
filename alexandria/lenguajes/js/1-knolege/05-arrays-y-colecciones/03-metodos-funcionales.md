# Metodos funcionales

Los métodos funcionales de `Array.prototype` no mutan el array original, sino que devuelven un nuevo array o un valor, basándose en una función de callback. Son la base de la programación funcional en JavaScript.

## `forEach(callback, thisArg?)`

Ejecuta la función `callback` **para cada elemento** del array, en orden. No retorna nada (`undefined`). No puede interrumpirse con `break` o `continue` (aunque se puede simular con `return` para saltar a la siguiente iteración dentro del callback, o lanzando una excepción controlada).

```javascript
[1, 2, 3].forEach((item, index, array) => {
  console.log(item * 2);
});
```

Si se añaden o eliminan elementos durante la iteración, el rango se determina al inicio. Los elementos añadidos no se visitan; los eliminados se saltan si aún no fueron visitados.

## `map(callback, thisArg?)`

Crea un **nuevo array** con los resultados de llamar al callback sobre cada elemento. El array resultante tiene la misma longitud que el original, incluso si el callback devuelve `undefined` en algunas posiciones.

```javascript
const duplicado = [1, 2, 3].map(n => n * 2); // [2, 4, 6]
```

Es crucial recordar que `map` no modifica el array original; asigna un nuevo array. Si no se necesita el array resultante y solo se busca un efecto secundario, se debería usar `forEach` en su lugar.

## `filter(callback, thisArg?)`

Retorna un **nuevo array** con todos los elementos para los cuales el callback devuelve un valor truthy. No modifica el original.

```javascript
const pares = [1, 2, 3, 4].filter(n => n % 2 === 0); // [2, 4]
```

Ignora los huecos (elementos vacíos). Es muy útil para extraer subconjuntos.

## `reduce(callback, initialValue?)` y `reduceRight()`

Reduce el array a un único valor, aplicando el callback sobre un acumulador y cada elemento.

- **callback(acumulador, valorActual, índice, array)**.
- Si se proporciona `initialValue`, el acumulador empieza con ese valor y la iteración recorre desde el índice 0.
- Si **no** se proporciona, el acumulador toma el primer elemento del array (o lanza `TypeError` si el array está vacío) y la iteración comienza desde el índice 1.

```javascript
const suma = [1, 2, 3].reduce((acc, n) => acc + n, 0); // 6
const palabras = ["Hola", "mundo"].reduce((acc, pal) => acc + " " + pal); // "Hola mundo"
```

**`reduceRight`** hace lo mismo pero de derecha a izquierda.

`reduce` es extremadamente poderoso: puede emular `map`, `filter`, `some`, `every`, aplanamiento y muchas otras operaciones, aunque muchas veces es más legible usar el método específico.

## `some(callback)` y `every(callback)`

- **`some`**: retorna `true` si **al menos un** elemento cumple la condición (devuelve truthy). Se detiene en cuanto encuentra uno.
- **`every`**: retorna `true` si **todos** los elementos cumplen la condición. Se detiene en el primer falsy.

```javascript
[1, 3, 5].some(n => n % 2 === 0); // false
[2, 4, 6].every(n => n % 2 === 0); // true
```

Ambos respetan la semántica de cortocircuito, así que son eficientes. Sobre arrays vacíos, `some` devuelve `false` y `every` devuelve `true` (por lógica matemática).

## `flat(depth = 1)` y `flatMap(callback)`

- **`flat(depth)`**: crea un nuevo array con los elementos de subarrays concatenados recursivamente hasta la profundidad indicada. `depth` puede ser `Infinity` para aplanar completamente.
  ```javascript
  [1, [2, [3, [4]]]].flat(2); // [1, 2, 3, [4]]
  ```

- **`flatMap(callback)`**: es equivalente a `map(callback)` seguido de `flat(1)`. Muy útil para mapear y aplanar en una sola pasada.
  ```javascript
  ["Hola mundo", "Adiós"].flatMap(frase => frase.split(" "));
  // ["Hola", "mundo", "Adiós"]
  ```

Ambos métodos excluyen huecos.

## `find(callback)` y `findIndex(callback)`

- **`find`**: devuelve el **primer elemento** que cumple la condición, o `undefined` si no hay.
- **`findIndex`**: devuelve el índice de ese elemento, o `-1`.
  ```javascript
  const usuarios = [{id:1}, {id:2}];
  usuarios.find(u => u.id === 2); // {id:2}
  usuarios.findIndex(u => u.id === 3); // -1
  ```

Estos métodos fueron añadidos en ES6 y se detienen al primer éxito.

## Inmutabilidad y buenas prácticas

Los métodos funcionales son la columna vertebral de un estilo declarativo y predecible. Al no mutar el array original, se evitan efectos secundarios y se facilita la depuración y el testeo. Se pueden encadenar (chaining) para crear pipelines de transformación:

```javascript
const resultado = [1, 2, 3, 4]
  .filter(n => n % 2 === 0)
  .map(n => n * 10)
  .reduce((a, b) => a + b, 0);
```

Cuidado: cada método crea un nuevo array, lo que puede tener impacto en memoria si se encadenan muchos pasos sobre arrays grandes. En esos casos se puede usar `reduce` para hacer todo en una pasada, aunque sacrificando legibilidad.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Metodos mutables](02-metodos-mutables.md) | [🏠 Inicio](../index.md) | [Metodos de busqueda ▶](04-metodos-de-busqueda.md) |
