# Set y map

## `Set`

Colección de **valores únicos**, donde cada valor puede aparecer una sola vez. La comparación se realiza con el algoritmo **SameValueZero** (similar a `===`, pero trata `NaN` igual a `NaN`). Admite cualquier tipo de valor: primitivos y objetos.

### Creación e inicialización

```javascript
const set1 = new Set();
const set2 = new Set([1, 2, 3, 3, 4]); // {1, 2, 3, 4}
const set3 = new Set("hola");          // {"h", "o", "l", "a"}
```

### Métodos principales

- **`add(value)`**: añade un valor. Devuelve el propio `Set` (encadenable). Si el valor ya existe, no hace nada.
- **`delete(value)`**: elimina el valor. Retorna `true` si existía, `false` en caso contrario.
- **`has(value)`**: devuelve `true` si el valor está presente.
- **`clear()`**: elimina todos los elementos.
- **`size`**: propiedad que devuelve el número de valores.

```javascript
const s = new Set();
s.add(1).add(2).add(1);
console.log(s.size); // 2
console.log(s.has(1)); // true
s.delete(2);
```

### Iteración

`Set` es iterable. Sus métodos `keys()`, `values()` y `entries()` devuelven iteradores (keys y values son equivalentes porque Set no tiene claves separadas). También funciona con `for...of` y `forEach`:

```javascript
for (const valor of s) {
  console.log(valor);
}
s.forEach(v => console.log(v));
```

### Operaciones de conjunto

No hay métodos nativos para unión, intersección o diferencia, pero se pueden implementar con facilidad:

```javascript
const a = new Set([1, 2, 3]);
const b = new Set([2, 3, 4]);

const union = new Set([...a, ...b]);                    // {1,2,3,4}
const interseccion = new Set([...a].filter(x => b.has(x))); // {2,3}
const diferencia = new Set([...a].filter(x => !b.has(x)));  // {1}
```

### Casos de uso típicos

- Eliminar duplicados de un array: `const unicos = [...new Set(arr)];`
- Rastreo de elementos únicos (IDs visitados, tags).
- Operaciones con conjuntos matemáticos.

## `Map`

Colección de pares **clave-valor** donde las claves pueden ser de cualquier tipo (objetos, funciones, números, símbolos, etc.). A diferencia de los objetos, mantiene el orden de inserción y no tiene claves heredadas por defecto.

### Creación

```javascript
const map = new Map();
const inicializado = new Map([
  ["nombre", "Ana"],
  [42, "edad"],
  [{ id: 1 }, "objeto"]  // clave objeto
]);
```

### Métodos principales

- **`set(key, value)`**: establece el valor para una clave. Devuelve el propio `Map` (encadenable).
- **`get(key)`**: devuelve el valor asociado o `undefined`.
- **`has(key)`**: comprueba existencia.
- **`delete(key)`**: elimina el par. Devuelve `true`/`false`.
- **`clear()`**: vacía el mapa.
- **`size`**: número de pares.

```javascript
const m = new Map();
m.set("x", 10).set("y", 20);
console.log(m.get("x")); // 10
m.has("z");             // false
```

### Iteración

`Map` es iterable y mantiene el orden de inserción. Los iteradores se obtienen con:

- `keys()`: solo claves.
- `values()`: solo valores.
- `entries()`: pares `[clave, valor]` (el iterador por defecto).
- `forEach((valor, clave, map) => { ... })`.

```javascript
for (const [key, value] of m) {
  console.log(key, value);
}
```

### Comparación con objetos planos

| Característica        | Objeto plano            | Map                           |
|-----------------------|-------------------------|-------------------------------|
| Claves                | Solo strings o símbolos | Cualquier tipo                |
| Orden de inserción    | No garantizado (salvo en ES2015+ con ciertas reglas) | Sí, garantizado               |
| Propiedades heredadas | Sí (prototipo)          | No (está vacío inicialmente)   |
| Rendimiento en pares  | Menos optimizado para inserciones/eliminaciones frecuentes | Optimizado para ser usado como diccionario |
| Obtención de tamaño   | `Object.keys(obj).length` | `size` (propiedad directa)    |

### Casos de uso

- Diccionarios con claves no string.
- Caché de resultados por objeto (memoización).
- Metadata asociada a objetos sin modificar el objeto (usando WeakMap para no evitar GC).
- Representación de estructuras de datos como grafos.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Spread y rest](05-spread-y-rest.md) | [🏠 Inicio](../index.md) | [Weakmap weakset ▶](07-weakmap-weakset.md) |
