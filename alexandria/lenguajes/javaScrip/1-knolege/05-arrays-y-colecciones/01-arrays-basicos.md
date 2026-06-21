# Arrays basicos

## Naturaleza de los arrays en JavaScript

Un array en JavaScript es un objeto especializado con un manejo particular de la propiedad `length` y un prototipo `Array.prototype`. Internamente, los índices son propiedades de cadena (por ejemplo, `"0"`, `"1"`) que el motor optimiza para que se comporten como claves numéricas. A diferencia de otros lenguajes, los arrays de JS pueden contener elementos de cualquier tipo (heterogéneos) y su tamaño es dinámico.

## Creación de arrays

### Literal de array

La forma más común y concisa:
```javascript
const frutas = ["manzana", "plátano", "naranja"];
const vacio = [];
const mezclado = [1, "dos", { tres: 3 }, [4, 5]];
```

El literal desencadena la creación directa de un objeto con `Array.prototype` como prototipo.

### Constructor `Array`

Tiene tres comportamientos según los argumentos:

- **Sin argumentos**: `new Array()` crea un array vacío (`[]`).
- **Un argumento numérico**: `new Array(5)` crea un array con `length = 5` pero **sin elementos** (huecos, no `undefined` asignados). Es un array disperso.
- **Varios argumentos**: `new Array("a", "b", "c")` crea un array con esos elementos (`["a", "b", "c"]`).

```javascript
const a = new Array(3);
console.log(a.length); // 3
console.log(0 in a);   // false (no existe la propiedad "0")
```

El constructor suele evitarse porque si se pasa un único número se comporta como tamaño, no como elemento. Para crear arrays a partir de valores, se prefiere el literal o `Array.of`.

### `Array.of()` (ES6)

Crea un array con los argumentos pasados como elementos, independientemente de su número y tipo. Soluciona la ambigüedad de `new Array(7)`.

```javascript
Array.of(7);       // [7]
Array.of(1, 2, 3); // [1, 2, 3]
```

### `Array.from()` (ES6)

Crea un nuevo array a partir de un iterable o de un objeto array-like (que tenga `length` y acceso por índices). Acepta un segundo argumento opcional: una función de mapeo.

```javascript
Array.from("hola");        // ["h", "o", "l", "a"]
Array.from([1, 2, 3], x => x * 2); // [2, 4, 6]
Array.from({ length: 3 }); // [undefined, undefined, undefined]
```

Es la manera moderna de convertir colecciones como `NodeList`, `arguments`, `Set`, `Map` a arrays.

## Índices y propiedad `length`

Los índices válidos son enteros no negativos en forma de cadena (por ejemplo `"0"`, `"1"`). La propiedad `length` es siempre un número entero no negativo, y su valor es **mayor que el índice máximo del array más uno**. Es decir, `length` se actualiza automáticamente al añadir/eliminar elementos.

```javascript
const arr = ["a"];
arr[3] = "d";
console.log(arr.length); // 4
```

Modificar `length` explícitamente puede truncar el array o crear espacios vacíos:
```javascript
const arr = [1, 2, 3, 4];
arr.length = 2; // arr = [1, 2]
arr.length = 5; // arr = [1, 2, empty × 3]
```

## Arrays dispersos (sparse arrays)

Un array puede tener "agujeros" cuando no están definidas ciertas posiciones de índice. Esto ocurre al asignar a un índice mayor que `length`, al usar `new Array(n)`, o al eliminar con `delete`.

```javascript
const disperso = [1, , 3]; // literal con coma vacía
console.log(disperso.length); // 3
console.log(1 in disperso);   // false
```

Los métodos funcionales (`map`, `filter`, `forEach`, etc.) **ignoran** los huecos, tratándolos como si no existieran. En cambio, métodos como `indexOf` o `includes` devuelven `undefined` si se consulta un hueco.

```javascript
const arr = [1, , 3];
arr.map(x => x * 2); // [2, empty, 6]
```

## Verificación de array

Dado que `typeof []` retorna `"object"`, se necesita un mecanismo fiable.

- **`Array.isArray(value)`** (ES5): método estático fiable, funciona incluso con arrays provenientes de otros contextos de ejecución (iframes).
  ```javascript
  Array.isArray([]); // true
  Array.isArray({ length: 0 }); // false
  ```
- `instanceof Array`: funciona si el array y la comprobación comparten el mismo `Array` global. Falla entre diferentes reinos (iframes, ventanas).

## Iteración sobre arrays

- `for` clásico con índice: ofrece control total.
- `for...of`: itera sobre los valores (no sobre huecos, los devuelve como `undefined`).
- `forEach(callback)`: ejecuta una función por cada elemento existente (ignora huecos). No se puede romper con `break`.
- `for...in`: **desaconsejado** porque itera sobre todas las propiedades enumerables, incluida la cadena de prototipos, y los índices son strings; además no garantiza orden en todas las circunstancias y puede incluir propiedades no numéricas añadidas al array.

## Comparación de arrays

No existe un método nativo para comparar arrays por contenido. `==` o `===` comparan referencias. Para comparar valores se usan combinaciones de `every`, `JSON.stringify` (con precaución) o funciones propias recursivas.

## Desempeño y optimización

Los motores JavaScript optimizan los arrays cuando son densos y almacenan elementos del mismo tipo (hidden classes). Si un array se vuelve disperso o contiene tipos mixtos impredecibles, el motor degrada a un almacenamiento tipo diccionario, perdiendo velocidad. Aunque rara vez es problema, es bueno evitarlo en código de alto rendimiento.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Json](../04-objetos-y-clases/11-json.md) | [🏠 Inicio](../index.md) | [Metodos mutables ▶](02-metodos-mutables.md) |
