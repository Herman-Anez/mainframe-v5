# Metodos mutables

Los métodos mutables son aquellos que modifican el array original. Suelen ser más rápidos en términos de reutilización de memoria, pero al cambiar el estado pueden causar efectos secundarios si otras referencias comparten el array.

## `push(...items)` y `pop()`

- **`push`**: añade uno o más elementos al **final** del array. Devuelve el nuevo `length`.
- **`pop`**: elimina el **último** elemento y lo devuelve. Si el array está vacío, devuelve `undefined`.

```javascript
const arr = [1, 2];
arr.push(3, 4); // devuelve 4, arr = [1,2,3,4]
arr.pop();      // devuelve 4, arr = [1,2,3]
```

Ambos operan sobre el extremo, por lo que son altamente eficientes (O(1)).

## `unshift(...items)` y `shift()`

- **`unshift`**: añade elementos al **inicio**, desplazando los índices existentes. Devuelve el nuevo `length`.
- **`shift`**: elimina el **primer** elemento y lo devuelve, desplazando índices. Si está vacío, devuelve `undefined`.

```javascript
const arr = [2, 3];
arr.unshift(0, 1); // devuelve 4, arr = [0,1,2,3]
arr.shift();       // devuelve 0, arr = [1,2,3]
```

Son más costosos (O(n)) porque requieren reindexar todos los elementos restantes.

## `splice(start, deleteCount?, ...items?)`

Método versátil para eliminar, reemplazar o insertar elementos en cualquier posición. Modifica el array original y retorna un array con los elementos eliminados.

- `start`: índice donde comenzar.
- `deleteCount`: número de elementos a eliminar (si se omite, borra hasta el final).
- `items`: elementos a insertar en la posición `start`.

```javascript
const arr = [1, 2, 3, 4, 5];
arr.splice(2, 2);          // elimina desde índice 2, 2 elementos → [3,4], arr = [1,2,5]
arr.splice(1, 0, 'a', 'b'); // inserta en índice 1, sin borrar → [], arr = [1,'a','b',2,5]
arr.splice(0, 2, 'x');     // reemplaza los dos primeros por 'x' → [1,'a'], arr = ['x','b',2,5]
```

## `reverse()`

Invierte el orden de los elementos del array **in place**, es decir, muta el original. Devuelve la referencia al array invertido.

```javascript
const arr = [1, 2, 3];
arr.reverse(); // arr = [3,2,1]
```

## `sort([compareFunction])`

Ordena los elementos del array **in place**, convirtiendo cada elemento a cadena y comparando sus valores UTF-16 por defecto. Para ordenar correctamente números o según otro criterio, se pasa una función comparadora `(a, b) => valor`.

- Si la función retorna un número negativo, `a` se sitúa antes que `b`.
- Si retorna 0, se consideran iguales (orden estable desde ES2019).
- Si retorna positivo, `a` después de `b`.

```javascript
const nums = [20, 1, 100, 3];
nums.sort();               // [1, 100, 20, 3] (orden lexicográfico)
nums.sort((a, b) => a - b); // [1, 3, 20, 100] (numérico ascendente)
```

La estabilidad (mantener el orden relativo de elementos iguales) fue añadida en ES2019.

## `fill(value, start?, end?)`

Rellena todos los elementos desde `start` hasta `end` (excluido) con `value`. Modifica el array.

```javascript
const arr = [1, 2, 3, 4];
arr.fill(0, 1, 3); // arr = [1, 0, 0, 4]
```

Útil para inicializar arrays densos: `new Array(5).fill(0)`.

## `copyWithin(target, start, end?)`

Copia una porción del propio array a otra posición, sobrescribiendo elementos existentes, sin modificar el tamaño. Modifica el array.

```javascript
const arr = [1, 2, 3, 4, 5];
arr.copyWithin(0, 3); // [4,5,3,4,5] (copia desde índice 3 al principio)
```

Los índices negativos cuentan desde el final.

## Eliminación con `delete`

El operador `delete arr[indice]` elimina la propiedad, pero no actualiza `length` y deja un hueco. No es recomendable; se debe usar `splice` o `pop`/`shift`.

## Impacto en el rendimiento

Los métodos mutables suelen tener menor costo de memoria porque no crean un nuevo array, pero pueden generar efectos secundarios difíciles de depurar en flujos funcionales. En programación declarativa se prefieren los métodos no mutables (inmutables), como los que devuelven un nuevo array.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Arrays basicos](01-arrays-basicos.md) | [🏠 Inicio](../index.md) | [Metodos funcionales ▶](03-metodos-funcionales.md) |
