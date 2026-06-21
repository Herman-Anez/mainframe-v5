## 01-arrays-basicos.md

### Naturaleza de los arrays en JavaScript

Un array en JavaScript es un objeto especializado con un manejo particular de la propiedad `length` y un prototipo `Array.prototype`. Internamente, los índices son propiedades de cadena (por ejemplo, `"0"`, `"1"`) que el motor optimiza para que se comporten como claves numéricas. A diferencia de otros lenguajes, los arrays de JS pueden contener elementos de cualquier tipo (heterogéneos) y su tamaño es dinámico.

### Creación de arrays

#### Literal de array

La forma más común y concisa:
```javascript
const frutas = ["manzana", "plátano", "naranja"];
const vacio = [];
const mezclado = [1, "dos", { tres: 3 }, [4, 5]];
```

El literal desencadena la creación directa de un objeto con `Array.prototype` como prototipo.

#### Constructor `Array`

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

#### `Array.of()` (ES6)

Crea un array con los argumentos pasados como elementos, independientemente de su número y tipo. Soluciona la ambigüedad de `new Array(7)`.

```javascript
Array.of(7);       // [7]
Array.of(1, 2, 3); // [1, 2, 3]
```

#### `Array.from()` (ES6)

Crea un nuevo array a partir de un iterable o de un objeto array-like (que tenga `length` y acceso por índices). Acepta un segundo argumento opcional: una función de mapeo.

```javascript
Array.from("hola");        // ["h", "o", "l", "a"]
Array.from([1, 2, 3], x => x * 2); // [2, 4, 6]
Array.from({ length: 3 }); // [undefined, undefined, undefined]
```

Es la manera moderna de convertir colecciones como `NodeList`, `arguments`, `Set`, `Map` a arrays.

### Índices y propiedad `length`

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

### Arrays dispersos (sparse arrays)

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

### Verificación de array

Dado que `typeof []` retorna `"object"`, se necesita un mecanismo fiable.

- **`Array.isArray(value)`** (ES5): método estático fiable, funciona incluso con arrays provenientes de otros contextos de ejecución (iframes).
  ```javascript
  Array.isArray([]); // true
  Array.isArray({ length: 0 }); // false
  ```
- `instanceof Array`: funciona si el array y la comprobación comparten el mismo `Array` global. Falla entre diferentes reinos (iframes, ventanas).

### Iteración sobre arrays

- `for` clásico con índice: ofrece control total.
- `for...of`: itera sobre los valores (no sobre huecos, los devuelve como `undefined`).
- `forEach(callback)`: ejecuta una función por cada elemento existente (ignora huecos). No se puede romper con `break`.
- `for...in`: **desaconsejado** porque itera sobre todas las propiedades enumerables, incluida la cadena de prototipos, y los índices son strings; además no garantiza orden en todas las circunstancias y puede incluir propiedades no numéricas añadidas al array.

### Comparación de arrays

No existe un método nativo para comparar arrays por contenido. `==` o `===` comparan referencias. Para comparar valores se usan combinaciones de `every`, `JSON.stringify` (con precaución) o funciones propias recursivas.

### Desempeño y optimización

Los motores JavaScript optimizan los arrays cuando son densos y almacenan elementos del mismo tipo (hidden classes). Si un array se vuelve disperso o contiene tipos mixtos impredecibles, el motor degrada a un almacenamiento tipo diccionario, perdiendo velocidad. Aunque rara vez es problema, es bueno evitarlo en código de alto rendimiento.

---

## 02-metodos-mutables.md

Los métodos mutables son aquellos que modifican el array original. Suelen ser más rápidos en términos de reutilización de memoria, pero al cambiar el estado pueden causar efectos secundarios si otras referencias comparten el array.

### `push(...items)` y `pop()`

- **`push`**: añade uno o más elementos al **final** del array. Devuelve el nuevo `length`.
- **`pop`**: elimina el **último** elemento y lo devuelve. Si el array está vacío, devuelve `undefined`.

```javascript
const arr = [1, 2];
arr.push(3, 4); // devuelve 4, arr = [1,2,3,4]
arr.pop();      // devuelve 4, arr = [1,2,3]
```

Ambos operan sobre el extremo, por lo que son altamente eficientes (O(1)).

### `unshift(...items)` y `shift()`

- **`unshift`**: añade elementos al **inicio**, desplazando los índices existentes. Devuelve el nuevo `length`.
- **`shift`**: elimina el **primer** elemento y lo devuelve, desplazando índices. Si está vacío, devuelve `undefined`.

```javascript
const arr = [2, 3];
arr.unshift(0, 1); // devuelve 4, arr = [0,1,2,3]
arr.shift();       // devuelve 0, arr = [1,2,3]
```

Son más costosos (O(n)) porque requieren reindexar todos los elementos restantes.

### `splice(start, deleteCount?, ...items?)`

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

### `reverse()`

Invierte el orden de los elementos del array **in place**, es decir, muta el original. Devuelve la referencia al array invertido.

```javascript
const arr = [1, 2, 3];
arr.reverse(); // arr = [3,2,1]
```

### `sort([compareFunction])`

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

### `fill(value, start?, end?)`

Rellena todos los elementos desde `start` hasta `end` (excluido) con `value`. Modifica el array.

```javascript
const arr = [1, 2, 3, 4];
arr.fill(0, 1, 3); // arr = [1, 0, 0, 4]
```

Útil para inicializar arrays densos: `new Array(5).fill(0)`.

### `copyWithin(target, start, end?)`

Copia una porción del propio array a otra posición, sobrescribiendo elementos existentes, sin modificar el tamaño. Modifica el array.

```javascript
const arr = [1, 2, 3, 4, 5];
arr.copyWithin(0, 3); // [4,5,3,4,5] (copia desde índice 3 al principio)
```

Los índices negativos cuentan desde el final.

### Eliminación con `delete`

El operador `delete arr[indice]` elimina la propiedad, pero no actualiza `length` y deja un hueco. No es recomendable; se debe usar `splice` o `pop`/`shift`.

### Impacto en el rendimiento

Los métodos mutables suelen tener menor costo de memoria porque no crean un nuevo array, pero pueden generar efectos secundarios difíciles de depurar en flujos funcionales. En programación declarativa se prefieren los métodos no mutables (inmutables), como los que devuelven un nuevo array.

---

## 03-metodos-funcionales.md

Los métodos funcionales de `Array.prototype` no mutan el array original, sino que devuelven un nuevo array o un valor, basándose en una función de callback. Son la base de la programación funcional en JavaScript.

### `forEach(callback, thisArg?)`

Ejecuta la función `callback` **para cada elemento** del array, en orden. No retorna nada (`undefined`). No puede interrumpirse con `break` o `continue` (aunque se puede simular con `return` para saltar a la siguiente iteración dentro del callback, o lanzando una excepción controlada).

```javascript
[1, 2, 3].forEach((item, index, array) => {
  console.log(item * 2);
});
```

Si se añaden o eliminan elementos durante la iteración, el rango se determina al inicio. Los elementos añadidos no se visitan; los eliminados se saltan si aún no fueron visitados.

### `map(callback, thisArg?)`

Crea un **nuevo array** con los resultados de llamar al callback sobre cada elemento. El array resultante tiene la misma longitud que el original, incluso si el callback devuelve `undefined` en algunas posiciones.

```javascript
const duplicado = [1, 2, 3].map(n => n * 2); // [2, 4, 6]
```

Es crucial recordar que `map` no modifica el array original; asigna un nuevo array. Si no se necesita el array resultante y solo se busca un efecto secundario, se debería usar `forEach` en su lugar.

### `filter(callback, thisArg?)`

Retorna un **nuevo array** con todos los elementos para los cuales el callback devuelve un valor truthy. No modifica el original.

```javascript
const pares = [1, 2, 3, 4].filter(n => n % 2 === 0); // [2, 4]
```

Ignora los huecos (elementos vacíos). Es muy útil para extraer subconjuntos.

### `reduce(callback, initialValue?)` y `reduceRight()`

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

### `some(callback)` y `every(callback)`

- **`some`**: retorna `true` si **al menos un** elemento cumple la condición (devuelve truthy). Se detiene en cuanto encuentra uno.
- **`every`**: retorna `true` si **todos** los elementos cumplen la condición. Se detiene en el primer falsy.

```javascript
[1, 3, 5].some(n => n % 2 === 0); // false
[2, 4, 6].every(n => n % 2 === 0); // true
```

Ambos respetan la semántica de cortocircuito, así que son eficientes. Sobre arrays vacíos, `some` devuelve `false` y `every` devuelve `true` (por lógica matemática).

### `flat(depth = 1)` y `flatMap(callback)`

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

### `find(callback)` y `findIndex(callback)`

- **`find`**: devuelve el **primer elemento** que cumple la condición, o `undefined` si no hay.
- **`findIndex`**: devuelve el índice de ese elemento, o `-1`.
  ```javascript
  const usuarios = [{id:1}, {id:2}];
  usuarios.find(u => u.id === 2); // {id:2}
  usuarios.findIndex(u => u.id === 3); // -1
  ```

Estos métodos fueron añadidos en ES6 y se detienen al primer éxito.

### Inmutabilidad y buenas prácticas

Los métodos funcionales son la columna vertebral de un estilo declarativo y predecible. Al no mutar el array original, se evitan efectos secundarios y se facilita la depuración y el testeo. Se pueden encadenar (chaining) para crear pipelines de transformación:

```javascript
const resultado = [1, 2, 3, 4]
  .filter(n => n % 2 === 0)
  .map(n => n * 10)
  .reduce((a, b) => a + b, 0);
```

Cuidado: cada método crea un nuevo array, lo que puede tener impacto en memoria si se encadenan muchos pasos sobre arrays grandes. En esos casos se puede usar `reduce` para hacer todo en una pasada, aunque sacrificando legibilidad.

---

## 04-metodos-de-busqueda.md

### `indexOf(searchElement, fromIndex?)`

Busca la primera aparición de `searchElement` utilizando **comparación estricta** (`===`). Devuelve el índice encontrado o `-1`. Acepta un segundo parámetro para iniciar la búsqueda desde ese índice (por defecto 0). Los índices negativos cuentan desde el final.

```javascript
["a", "b", "a", "c"].indexOf("a");     // 0
["a", "b", "a", "c"].indexOf("a", 2);  // 2
["a", "b", "a", "c"].indexOf("x");     // -1
```

Casos especiales: no puede encontrar `NaN` porque `NaN === NaN` es `false`. Para eso se usa `includes` o `findIndex`.

### `lastIndexOf(searchElement, fromIndex?)`

Similar a `indexOf` pero busca desde el final hacia atrás. El parámetro `fromIndex` indica el índice donde comienza la búsqueda hacia atrás (por defecto `length - 1`). Los negativos se interpretan como desplazamiento desde el final.

```javascript
["a", "b", "a", "c"].lastIndexOf("a");     // 2
["a", "b", "a", "c"].lastIndexOf("a", 1);  // 0
```

### `includes(searchElement, fromIndex?)` (ES7/ES2016)

Determina si el array contiene un valor usando el algoritmo **SameValueZero**, que es como `===` pero trata `NaN` como igual a `NaN`. Retorna `true` o `false`.

```javascript
[1, 2, NaN].includes(NaN); // true
[1, 2, 3].includes(2);     // true
[1, 2, 3].includes(4);     // false
```

Es la forma más legible de comprobar pertenencia. Para objetos, compara referencias, no estructuras.

### `find(callback)` y `findIndex(callback)` (ES6)

Ya mencionados en los métodos funcionales, pero son esencialmente métodos de búsqueda con callback personalizado. Permiten encontrar un elemento o su índice basado en una condición arbitraria.

```javascript
const personas = [{ nombre: "Ana" }, { nombre: "Luis" }];
personas.find(p => p.nombre === "Luis"); // { nombre: "Luis" }
personas.findIndex(p => p.nombre === "Pedro"); // -1
```

### Métodos basados en valor vs referencia

- `indexOf`, `lastIndexOf`, `includes`: comparan valores primitivos por igualdad estricta (o SameValueZero en `includes`).
- Para objetos, se basan en la **referencia**. Dos objetos distintos con las mismas propiedades no se consideran iguales.

```javascript
const a = { id: 1 };
const b = { id: 1 };
[a].includes(a); // true
[a].includes(b); // false
```

Para buscar por contenido, se usa `find` o `findIndex` con una función que compare las propiedades relevantes.

### Búsqueda en arrays ordenados

No existe un método nativo de búsqueda binaria. Si el array está ordenado, se puede implementar manualmente o usar librerías. La búsqueda lineal con `find` sigue siendo la opción estándar.

### Rendimiento

- `indexOf`/`includes` en arrays pequeños es muy rápido. En arrays grandes, si se realizan muchas búsquedas, puede ser más eficiente convertir el array a un `Set` y usar `has` (sublinear en promedio) o a un `Map` indexado por el campo de búsqueda.

### Nota sobre huecos

`indexOf` e `includes` no distinguen entre un elemento con valor `undefined` y un hueco; ambos devolverán `true` o el índice correspondiente si se busca `undefined`. Los métodos funcionales como `find` y `findIndex` ignoran los huecos (no pasan el callback sobre ellos), por lo que `undefined` explícito sí sería encontrado, pero un hueco no se evaluaría.

```javascript
const arr = [0, , 2]; // disperso
arr.includes(undefined); // true (encuentra el hueco como undefined)
arr.find(x => x === undefined); // undefined (porque no itera sobre el hueco)
```

---

## 05-spread-y-rest.md

### Dos caras del mismo operador `...`

El operador `...` tiene dos funciones opuestas según el contexto:

- **Spread (propagación):** expande los elementos de un iterable (o las propiedades de un objeto) en lugares donde se esperan múltiples elementos (argumentos de función, literales de array, literales de objeto).
- **Rest (agrupación):** recolecta los elementos restantes de una estructura (desestructuración de arrays/objetos, parámetros de función) en una nueva variable.

### Operador Spread

#### En arrays

Expande un iterable en los lugares donde se esperan elementos de un array:

```javascript
const numeros = [1, 2, 3];
console.log(...numeros); // 1 2 3 (equivale a console.log(1,2,3))
```

**Clonación superficial de arrays:**
```javascript
const original = [1, 2, 3];
const copia = [...original];
copia[0] = 99; // original sigue [1,2,3]
```

**Combinación (concatenación) de arrays:**
```javascript
const a = [1, 2], b = [3, 4];
const fusion = [...a, ...b]; // [1,2,3,4]
```

**Insertar elementos en cualquier posición:**
```javascript
const inicio = [1, 2];
const completo = [0, ...inicio, 3, 4]; // [0,1,2,3,4]
```

**Spread sobre strings (iterables):**
```javascript
const caracteres = [..."Hola"]; // ["H", "o", "l", "a"]
```

#### En objetos (ES2018)

Las propiedades enumerables propias de un objeto fuente se copian en un nuevo objeto literal. Se comporta como `Object.assign({}, obj)`, pero con una sintaxis más limpia.

```javascript
const base = { a: 1, b: 2 };
const copia = { ...base };          // { a:1, b:2 }
const fusion = { ...base, c: 3 };   // { a:1, b:2, c:3 }
```

**Sobrescritura:** las propiedades posteriores pisan a las anteriores.
```javascript
const obj = { ...base, b: 99 }; // { a:1, b:99 }
```

**Combinación con otras propiedades:**
```javascript
const config = { timeout: 2000, cache: true };
const final = { ...config, url: "/api" };
```

**Precaución:** la copia es superficial. Los objetos anidados se comparten por referencia. Para clonación profunda se necesitan técnicas adicionales (structuredClone, recursividad, JSON.parse/stringify con precaución).

#### Spread en llamadas a función

Permite pasar un array como argumentos individuales:

```javascript
const valores = [10, 20, 30];
Math.max(...valores); // 30
```

También se puede combinar con argumentos posicionales:
```javascript
function suma(a, b, c) { return a + b + c; }
suma(...[1, 2], 3); // 6
```

### Operador Rest (parámetros rest y desestructuración)

#### Parámetros rest en funciones

Agrupa un número variable de argumentos en un verdadero array:

```javascript
function log(mensaje, ...tags) {
  console.log(mensaje, tags);
}
log("Error", "red", "critical"); // "Error" ["red", "critical"]
```

- Solo puede haber un parámetro rest y debe ser el último.
- Siempre es un array (nunca el objeto `arguments`).
- No está ligado a `arguments` (en modo estricto y en flechas).

#### Rest en desestructuración de arrays

Recoge los elementos restantes después de extraer algunos:

```javascript
const [primero, segundo, ...resto] = [1, 2, 3, 4, 5];
console.log(primero); // 1
console.log(resto);   // [3, 4, 5]
```

El rest debe ser el último elemento. Si no hay más elementos, `resto` será un array vacío.

#### Rest en desestructuración de objetos (ES2018)

Agrupa las propiedades no extraídas en un nuevo objeto:

```javascript
const { a, b, ...resto } = { a: 1, b: 2, c: 3, d: 4 };
console.log(a);     // 1
console.log(resto); // { c: 3, d: 4 }
```

Al igual que en arrays, debe ser la última captura y recoge solo las propiedades enumerables propias.

### Casos de uso y patrones

- **Inmutabilidad**: al crear nuevas copias en lugar de mutar.
- **Reducción de mutaciones**: `this.setState({ ...state, nuevo: valor })` en React.
- **Conversión de iterables**: `[...nodeList]` para obtener un verdadero array.
- **Eliminación selectiva de propiedades**: `const { password, ...safe } = user;`.
- **Defaults combinados con rest**: `function f(a, ...rest) { }`.

### Limitaciones

- Spread en objetos requiere ES2018+ (ampliamente soportado actualmente).
- No es posible copiar getters/setters; solo se copia el valor de la propiedad (el descriptor se pierde). Para clonar con descriptores exactos, usar `Object.getOwnPropertyDescriptors`.
- El spread no funciona sobre objetos no iterables (objetos planos no son iterables) excepto en literales de objeto, donde spread está permitido para propiedades propias.

---

## 06-set-y-map.md

### `Set`

Colección de **valores únicos**, donde cada valor puede aparecer una sola vez. La comparación se realiza con el algoritmo **SameValueZero** (similar a `===`, pero trata `NaN` igual a `NaN`). Admite cualquier tipo de valor: primitivos y objetos.

#### Creación e inicialización

```javascript
const set1 = new Set();
const set2 = new Set([1, 2, 3, 3, 4]); // {1, 2, 3, 4}
const set3 = new Set("hola");          // {"h", "o", "l", "a"}
```

#### Métodos principales

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

#### Iteración

`Set` es iterable. Sus métodos `keys()`, `values()` y `entries()` devuelven iteradores (keys y values son equivalentes porque Set no tiene claves separadas). También funciona con `for...of` y `forEach`:

```javascript
for (const valor of s) {
  console.log(valor);
}
s.forEach(v => console.log(v));
```

#### Operaciones de conjunto

No hay métodos nativos para unión, intersección o diferencia, pero se pueden implementar con facilidad:

```javascript
const a = new Set([1, 2, 3]);
const b = new Set([2, 3, 4]);

const union = new Set([...a, ...b]);                    // {1,2,3,4}
const interseccion = new Set([...a].filter(x => b.has(x))); // {2,3}
const diferencia = new Set([...a].filter(x => !b.has(x)));  // {1}
```

#### Casos de uso típicos

- Eliminar duplicados de un array: `const unicos = [...new Set(arr)];`
- Rastreo de elementos únicos (IDs visitados, tags).
- Operaciones con conjuntos matemáticos.

### `Map`

Colección de pares **clave-valor** donde las claves pueden ser de cualquier tipo (objetos, funciones, números, símbolos, etc.). A diferencia de los objetos, mantiene el orden de inserción y no tiene claves heredadas por defecto.

#### Creación

```javascript
const map = new Map();
const inicializado = new Map([
  ["nombre", "Ana"],
  [42, "edad"],
  [{ id: 1 }, "objeto"]  // clave objeto
]);
```

#### Métodos principales

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

#### Iteración

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

#### Comparación con objetos planos

| Característica        | Objeto plano            | Map                           |
|-----------------------|-------------------------|-------------------------------|
| Claves                | Solo strings o símbolos | Cualquier tipo                |
| Orden de inserción    | No garantizado (salvo en ES2015+ con ciertas reglas) | Sí, garantizado               |
| Propiedades heredadas | Sí (prototipo)          | No (está vacío inicialmente)   |
| Rendimiento en pares  | Menos optimizado para inserciones/eliminaciones frecuentes | Optimizado para ser usado como diccionario |
| Obtención de tamaño   | `Object.keys(obj).length` | `size` (propiedad directa)    |

#### Casos de uso

- Diccionarios con claves no string.
- Caché de resultados por objeto (memoización).
- Metadata asociada a objetos sin modificar el objeto (usando WeakMap para no evitar GC).
- Representación de estructuras de datos como grafos.

---

## 07-weakmap-weakset.md

### Motivación: referencias débiles

`Map` y `Set` mantienen fuertes referencias a sus claves y valores. Si un objeto se usa como clave en un `Map`, ese objeto no puede ser recolectado por el garbage collector mientras el `Map` exista. Las colecciones débiles resuelven esto manteniendo referencias **débiles**, lo que permite que el GC libere el objeto cuando ya no tenga otras referencias fuertes.

### `WeakMap`

#### Características

- Las **claves deben ser objetos** (no primitivos). Si se intenta usar un primitivo como clave, se lanza `TypeError`.
- Los valores pueden ser de cualquier tipo.
- Las claves son mantenidas como referencias débiles: si no hay otra referencia a la clave fuera del WeakMap, el par puede ser eliminado por el GC.
- No es iterable: no tiene métodos `keys()`, `values()`, `entries()`, ni `size`. No se puede recorrer. Esto es intencional: el estado del GC no debe exponerse.
- Métodos: `set(key, value)`, `get(key)`, `has(key)`, `delete(key)`.

#### Ejemplo

```javascript
const wm = new WeakMap();
let obj = { id: 1 };
wm.set(obj, "datos secretos");
console.log(wm.get(obj)); // "datos secretos"
obj = null; // el objeto se vuelve inalcanzable y será recolectado junto con su entrada en el WeakMap
```

#### Uso principal: datos privados asociados a objetos

Como las entradas desaparecen cuando el objeto clave es recolectado, es ideal para almacenar metadatos ligados al ciclo de vida del objeto.

```javascript
const cacheDeUsuario = new WeakMap();
function procesar(usuario) {
  if (!cacheDeUsuario.has(usuario)) {
    cacheDeUsuario.set(usuario, calcularResultadoCostoso(usuario));
  }
  return cacheDeUsuario.get(usuario);
}
```

Si `usuario` deja de usarse en el resto del programa, la entrada en el WeakMap será eliminada automáticamente, evitando fugas de memoria.

#### Emulación de propiedades privadas (antes de `#`)

```javascript
const _privado = new WeakMap();
class MiClase {
  constructor() {
    _privado.set(this, { secreto: 42 });
  }
  getSecreto() {
    return _privado.get(this).secreto;
  }
}
```

Ahora los datos privados están realmente encapsulados y se limpian cuando la instancia se recolecta.

### `WeakSet`

#### Características

- Solo almacena **objetos** (no primitivos).
- Referencias débiles a los objetos.
- No iterable, sin `size`.
- Métodos: `add(value)`, `has(value)`, `delete(value)`.

#### Ejemplo

```javascript
const ws = new WeakSet();
let elemento = { nombre: "div" };
ws.add(elemento);
console.log(ws.has(elemento)); // true
elemento = null; // el objeto es elegible para recolección
```

#### Casos de uso típicos

- **Marcado de objetos**: saber si un objeto ha sido procesado, visitado, o tiene cierto "sello" sin contaminar el objeto.
- **Evitar ciclos de referencias fuertes** en sistemas de eventos o gráficos.

### Comparación colecciones fuertes vs débiles

| Propiedad         | Map / Set            | WeakMap / WeakSet               |
|-------------------|----------------------|----------------------------------|
| Tipo de clave     | Cualquier tipo       | Solo objetos (WeakMap) / objetos (WeakSet) |
| Referencia        | Fuerte               | Débil                            |
| Iterable          | Sí                   | No                               |
| Tamaño (`size`)   | Sí                   | No                               |
| Casos de uso      | Almacenamiento general, caches | Metadatos, datos privados, rastreo de objetos vivos |

### Consideraciones del GC

No hay garantía de cuándo ocurre la recolección. La entrada puede permanecer en la colección débil incluso después de que el objeto se haya vuelto inalcanzable, hasta la siguiente pasada del GC. Por tanto, no se debe escribir código que asuma la eliminación inmediata. La única garantía es que no impedirá la recolección.

---

## 08-iterables-generadores.md

### Protocolo iterable e iterador

JavaScript define un protocolo estándar para que los objetos definan su comportamiento de iteración.

- **Iterable:** un objeto que tiene un método `Symbol.iterator` que devuelve un **iterador**.
- **Iterador:** un objeto con un método `next()` que retorna `{ value, done }`. Cuando `done` es `true`, la iteración ha terminado. Opcionalmente puede tener `return()` y `throw()`.

#### Uso en `for...of`

El bucle `for...of` consume iterables:
```javascript
for (const item of iterable) { /* ... */ }
```
El bucle llama a `[Symbol.iterator]()` una vez, y luego llama a `next()` repetidamente hasta que `done` sea `true`.

#### Iterables nativos

- Arrays, strings, Map, Set, TypedArrays, NodeList, `arguments` (en funciones no flecha).
- Los objetos generadores (devueltos por funciones generadoras) son iterables e iteradores a la vez.

### Creación de iteradores personalizados

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

### Generadores (`function*`)

Son una forma concisa de crear iteradores. Una función generadora devuelve un **objeto Generator**, que es iterador e iterable.

#### `yield` y pausa

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

#### Comunicación bidireccional: `next(value)`

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

#### `yield*` para delegación

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

#### Finalización anticipada: `return()` y `throw()`

- **`gen.return(valor)`**: termina el generador, como un `return` interno. Cualquier bloque `finally` se ejecuta.
- **`gen.throw(error)`**: lanza una excepción en el punto de pausa. Puede capturarse dentro del generador.

#### Generadores asíncronos (`async function*`)

Producen un **AsyncGenerator** que implementa `Symbol.asyncIterator`. Se consumen con `for await...of`. Cada `yield` puede esperar una promesa.

```javascript
async function* leerLineas(stream) {
  // ... lógica asíncrona
}
for await (const linea of leerLineas(process.stdin)) {
  console.log(linea);
}
```

### Aplicaciones prácticas

- **Secuencias infinitas**: generar IDs, números de Fibonacci, etc.
- **Lazy evaluation**: procesar datos bajo demanda sin cargarlos todos en memoria.
- **Operaciones asíncronas encadenadas**: con generadores asíncronos.
- **Implementar iteradores personalizados** con código más legible que el manual.

---

## 09-arrays-tipados.md

### Binary Data y ArrayBuffer

JavaScript tradicional no maneja bien datos binarios crudos. Para trabajar con flujos de bytes (WebGL, archivos, redes) se introdujeron los **ArrayBuffer** y los **Typed Arrays**.

#### `ArrayBuffer`

Es un bloque de memoria binario de tamaño fijo (en bytes). No se puede manipular directamente; se accede a través de vistas.

```javascript
const buffer = new ArrayBuffer(16); // 16 bytes, todos a 0
console.log(buffer.byteLength); // 16
```

No se puede cambiar su tamaño. Para transferirlo entre hilos se puede usar `transfer` (en ciertos contextos) o se copia.

### Vistas: Typed Arrays

Son arrays que proporcionan una vista estructurada sobre un ArrayBuffer. Definen un tipo de dato numérico concreto (entero, float, etc.) y un tamaño fijo. Todos heredan de `TypedArray` (prototipo interno).

#### Tipos disponibles

- **Enteros con signo:** `Int8Array`, `Int16Array`, `Int32Array`, `BigInt64Array`
- **Enteros sin signo:** `Uint8Array`, `Uint16Array`, `Uint32Array`, `BigUint64Array`
- **Punto flotante:** `Float32Array`, `Float64Array`
- **Entero sin signo clampado a 0-255:** `Uint8ClampedArray` (útil para colores)

Cada uno representa elementos del tamaño respectivo (8 bits a 64 bits).

#### Creación

- **Con longitud:** `const arr = new Uint8Array(8);` crea un buffer de 8 bytes y lo asigna.
- **A partir de un array:** `new Uint8Array([1,2,3]);`
- **A partir de otro TypedArray:** copia los valores.
- **Con un ArrayBuffer:** `new Uint8Array(buffer, byteOffset?, length?)` para crear una vista sobre una porción del buffer.

```javascript
const buffer = new ArrayBuffer(8);
const vista32 = new Int32Array(buffer); // 2 elementos (8 bytes / 4 bytes por elemento)
vista32[0] = 42;
console.log(new Uint8Array(buffer)[0]); // puedes ver el byte bajo
```

#### Propiedades y métodos

- `buffer`: el ArrayBuffer subyacente.
- `byteLength`: tamaño en bytes.
- `byteOffset`: desplazamiento del inicio del buffer (si la vista no empieza al inicio).
- `length`: número de elementos (no bytes).
- Métodos heredados de `TypedArray`: muchos similares a `Array`, pero sin mutar (no pueden cambiar tamaño; no tienen `push`, `pop`, `splice`, etc.). Sí tienen `map`, `filter`, `slice`, `subarray`, `set`, `reverse`, `sort`, etc.
- `set(array, offset)`: copia valores desde un array o TypedArray en la posición dada.

#### `DataView`

Permite leer y escribir múltiples tipos numéricos en diferentes offsets dentro de un mismo ArrayBuffer, con control sobre el **endianness** (orden de bytes).

```javascript
const buffer = new ArrayBuffer(4);
const view = new DataView(buffer);
view.setInt16(0, 256, true); // little-endian
console.log(view.getUint8(0)); // 0
console.log(view.getUint8(1)); // 1
```

Métodos: `getInt8`, `getUint16`, `setFloat32`, etc., con parámetro opcional `littleEndian`.

### Casos de uso

- **WebGL**: pasar vértices y datos de texturas.
- **Canvas**: manipulación de pixeles con `ImageData` (que contiene un `Uint8ClampedArray`).
- **Archivos binarios**: `FileReader.readAsArrayBuffer`.
- **Sockets y WebRTC**: transmisión de datos binarios.
- **WebAssembly**: comunicación con memoria compartida.
- **Compresión/descompresión**: trabajar con flujos de bytes.
- **Criptografía**: `crypto.getRandomValues(typedArray)`.

### Relación con arrays normales

Los Typed Arrays son objetos array-like pero no arrays reales. `Array.isArray` devuelve `false`. Sin embargo, muchos métodos de `Array.prototype` se pueden aplicar mediante `call` o convirtiéndolos a arrays.

### Consideraciones de rendimiento

Son más eficientes para datos numéricos homogéneos porque eliminan la indirección del motor JS y trabajan directamente con memoria contigua. No hay boxing de cada elemento. Son cruciales para aplicaciones de alto rendimiento y bajo nivel.

---

Estos archivos cierran el estudio profundo de las colecciones en JavaScript, desde las estructuras más comunes hasta los mecanismos avanzados de manejo de memoria y datos binarios.

---

