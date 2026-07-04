# Iteracion for of in

## `for...in`
Itera sobre todas las **propiedades enumerables** de un objeto cuyas claves son cadenas (incluye propiedades heredadas del prototipo). El orden de iteración en la práctica es: primero claves numéricas en orden ascendente, luego claves de cadena en orden de inserción, y finalmente símbolos (aunque `for...in` **no** itera símbolos).

```javascript
const obj = { a: 1, b: 2 };
for (const key in obj) {
  console.log(key); // 'a', 'b'
}
```

### Peligros y filtrado
- Itera sobre propiedades heredadas. Para evitarlo, usar `Object.hasOwn` (ES2022) o `hasOwnProperty`:
  ```javascript
  for (const key in obj) {
    if (Object.hasOwn(obj, key)) {
      // propiedad propia
    }
  }
  ```
- No debe usarse para iterar arrays, porque itera índices como strings y puede incluir propiedades añadidas manualmente al array u objetos heredados.
- El orden de iteración en arrays con `for...in` no garantiza el orden numérico estricto si hay propiedades no numéricas.

### Nota sobre arrays y `length`
Si se usa `for...in` sobre un array, las claves son los índices, pero al ser strings, operaciones como `key + 1` concatenan en lugar de sumar. Además, propiedades no numéricas (ej. `arr.foo = 'bar'`) también aparecerían.

## `for...of`
Introducido en ES6. Itera sobre los **valores** de un objeto **iterable**. Un iterable es aquel que implementa el protocolo iterable: debe tener un método en `Symbol.iterator` que devuelve un iterador.
El bucle llama a `next()` del iterador y asigna la propiedad `value` a la variable hasta que `done` es `true`.

```javascript
const arr = [10, 20, 30];
for (const valor of arr) {
  console.log(valor); // 10, 20, 30
}
```

### Tipos iterables nativos
- `Array`, `String`, `Map`, `Set`, `TypedArray`, `NodeList`, `arguments` (en funciones tradicionales), etc.
- Los objetos planos (`{}`) **no** son iterables por defecto.
- Los generadores producen objetos iterables.

### `for...of` con desestructuración
Cuando se itera sobre `Map` o arrays de pares:
```javascript
const map = new Map([['a', 1], ['b', 2]]);
for (const [key, value] of map) {
  console.log(key, value);
}
```

### `for...of` con `await` (iteradores asíncronos)
Si el iterable es asíncrono (tiene `Symbol.asyncIterator`), se puede combinar con `for await...of`:
```javascript
for await (const chunk of readableStream) {
  // procesar chunk
}
```

### Comparación `for...in` vs `for...of`
| Característica        | `for...in`                               | `for...of`                               |
|-----------------------|------------------------------------------|------------------------------------------|
| Propósito             | Claves enumerables (strings)             | Valores de iterables                     |
| Prototipo             | Itera sobre cadena de prototipos          | No, solo sobre el iterador del objeto    |
| Adecuado para arrays  | No                                       | Sí                                       |
| Incluye propiedades heredadas | Sí (requiere filtro)            | No (solo las que provee el iterador)     |
| Uso típico            | Objetos genéricos (para serializar, etc.)| Arrays, Map, Set, cadenas                |
| Orden                 | Similar a Object.keys pero no estandarizado completamente | El definido por el iterador |

### Detalles de implementación de iteración
- `for...of` funciona con `break`, `continue` y etiquetas.
- Si se modifica el iterable mientras se itera, el comportamiento depende del tipo; en arrays, agregar elementos no los incluye en la iteración actual, pero modificar los existentes puede reflejarse.

### Ejemplo de creación de iterador personalizado
```javascript
const rango = {
  min: 1,
  max: 5,
  [Symbol.iterator]() {
    let actual = this.min;
    return {
      next: () => ({
        value: actual,
        done: actual++ > this.max
      })
    };
  }
};
for (const n of rango) {
  console.log(n); // 1,2,3,4,5
}
```

---

Cada uno de estos temas se beneficia de la práctica con ejercicios que resalten las diferencias sutiles (por ejemplo, el efecto de `finally` en `return` o la interacción de `for...in` con prototipos extendidos). La profundidad aquí presentada asegura un dominio completo de las estructuras de control de flujo en JavaScript.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Excepciones trycatch](03-excepciones-trycatch.md) | [🏠 Inicio](../index.md) | [Declaracion vs expresion ▶](../03-funciones/01-declaracion-vs-expresion.md) |
