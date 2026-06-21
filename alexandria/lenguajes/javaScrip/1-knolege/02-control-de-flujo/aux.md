## 01-condicionales.md

### Estructuras condicionales básicas

#### `if` / `else if` / `else`
La condición se evalúa mediante la operación abstracta `ToBoolean`, por lo que cualquier valor se clasifica como **truthy** o **falsy**.
```javascript
if (condicion) {
  // ejecuta si condicion es truthy
} else if (otraCondicion) {
  // ejecuta si condicion es falsy y otraCondicion es truthy
} else {
  // si todas las condiciones anteriores son falsy
}
```
No hay límite de encadenamiento `else if`. Se evalúan en orden; la primera condición truthy ejecuta su bloque y se sale de la cadena.

**Importante**: el bloque crea ámbito para `let`/`const` dentro de él, pero `var` declarado dentro sigue estando en el ámbito de la función contenedora.

#### Operador condicional ternario
Es una expresión, no una sentencia. Útil para asignaciones o retornos.
```javascript
const acceso = edad >= 18 ? 'permitido' : 'denegado';
```
Asociatividad por la derecha: `a ? b : c ? d : e` equivale a `a ? b : (c ? d : e)`, lo que permite concatenación similar a `else if`.

Puede volverse poco legible si se anida profundamente; usar con moderación.

#### `switch`
La expresión del `switch` se evalúa una sola vez y se compara con el valor de cada `case` mediante **comparación estricta** (`===`). Si coincide, la ejecución comienza en ese `case` y continúa **en cascada** (fall-through) hasta encontrar un `break` o el final del `switch`.
```javascript
switch (valor) {
  case 1:
    // código
    break;
  case 2:
    // código
    // sin break → continúa al siguiente case
  default:
    // se ejecuta si ningún case coincidió (opcional)
}
```
- **`default`**: opcional, puede ir en cualquier posición, aunque lo habitual es al final. Se ejecuta cuando no hay coincidencias.
- **Fall-through intencionado**: varios `case` juntos que comparten código.
  ```javascript
  case 'a':
  case 'b':
    hacerAlgo();
    break;
  ```
- **Comparación estricta**: `switch` usa `===`, por lo que `'1'` no coincide con `1`.
- Los casos pueden ser expresiones, no solo literales. Pero evite efectos secundarios complejos.

##### `switch` con ámbito de bloque
Si se necesita ámbito de bloque por cada `case`, enciérrelo entre llaves:
```javascript
case 'x': {
  const temp = 10;
  // ...
  break;
}
```
Así se evitan errores de redeclaración de variables `let`/`const` entre diferentes `case` sin `break`.

#### Condicionales con `&&` y `||`
El cortocircuito permite ejecutar código condicionalmente:
```javascript
isActive && ejecutar();  // ejecuta solo si isActive es truthy
resultado = valor || 'porDefecto';  // asigna valor si truthy, sino el string
```
No reemplazan a `if` cuando hay múltiples líneas, pero son útiles para expresiones simples. Recuerde que `||` considera todos los falsy values (`0`, `""`, `false`); para valores nulos use `??`.

#### Cuándo usar cada uno
- `if/else`: legibilidad para lógica compleja o con múltiples sentencias.
- Ternario: asignaciones o retornos de valores basados en una condición simple.
- `switch`: múltiples comparaciones de igualdad estricta sobre la misma variable, sobre todo con valores discretos.

---

## 02-bucles.md

### Bucle `for` clásico
Estructura: `for (inicialización; condición; actualización) { cuerpo }`
- **inicialización**: se ejecuta una vez al inicio. Generalmente declara una variable (`let i = 0`).
- **condición**: evaluada antes de cada iteración. Si es falsy, el bucle termina.
- **actualización**: ejecutada al final de cada iteración.
- Los tres componentes son opcionales: `for (;;)` es un bucle infinito.

```javascript
for (let i = 0; i < array.length; i++) {
  // usar array[i]
}
```
**Hoisting y ámbito**: con `var` la variable `i` queda en el ámbito de la función (o global), lo que puede causar problemas con cierres (closures). Se recomienda `let` para que `i` tenga ámbito de bloque y se cree una nueva variable por iteración.

### Bucle `while`
Evalúa la condición **antes** de cada iteración:
```javascript
while (cond) {
  // cuerpo
}
```
Si la condición es inicialmente falsy, el cuerpo nunca se ejecuta.

### Bucle `do...while`
Ejecuta el cuerpo **al menos una vez** y luego comprueba la condición para repetir.
```javascript
do {
  // cuerpo
} while (cond);
```
Útil cuando se necesita que el código se ejecute antes de verificar la condición (por ejemplo, leer entrada del usuario).

### Control de flujo en bucles: `break` y `continue`
- **`break`**: sale inmediatamente del bucle más interno que lo contiene.
- **`continue`**: salta a la siguiente iteración del bucle, evaluando la condición de nuevo.
- Ambos pueden combinarse con **etiquetas (labels)** para actuar sobre bucles externos.

#### Etiquetas y saltos estructurados
Una etiqueta es un identificador seguido de `:` delante de una sentencia (generalmente un bucle).
```javascript
exterior:
for (let i = 0; i < 3; i++) {
  for (let j = 0; j < 3; j++) {
    if (i === 1 && j === 1) break exterior;  // sale del bucle externo
  }
}
```
`continue` también puede usar etiqueta para saltar a la siguiente iteración del bucle etiquetado. Las etiquetas no son ámbitos; solo sirven para `break`/`continue`.

**Cuidado**: el uso excesivo de etiquetas puede complicar el flujo; a veces es mejor refactorizar en funciones.

### Bucles infinitos y prevención
- `while(true)`, `for(;;)`, `do{}while(true)`.
- Asegúrese de tener una condición de salida con `break` o una variable modificada dentro del bucle.
- En navegadores, los bucles infinitos bloquean el hilo principal y congelan la interfaz.

### Ámbito en bucles: diferencias entre `var` y `let`
```javascript
for (var i = 0; i < 3; i++) { setTimeout(() => console.log(i), 0); }
// Imprime 3, 3, 3 porque var tiene ámbito de función y los callbacks comparten la misma i.

for (let i = 0; i < 3; i++) { setTimeout(() => console.log(i), 0); }
// Imprime 0, 1, 2 porque let crea una nueva i en cada iteración.
```
Este comportamiento se debe a que `let` crea un nuevo ámbito léxico por iteración, capturando el valor actual.

#### Consideraciones de rendimiento
- En bucles grandes, evitar acceder repetidamente a propiedades como `array.length` si no cambia; cachearla.
- Usar `for...of` para arrays cuando solo se necesita el valor, y no el índice.

---

## 03-excepciones-trycatch.md

### Lanzamiento de errores: `throw`
`throw` lanza cualquier valor, aunque se recomienda lanzar instancias de `Error` o sus subclases para conservar la pila de llamadas.
```javascript
throw new Error('Algo salió mal');
throw { mensaje: 'error personalizado' }; // posible pero no recomendado
```
- Después de `throw`, la ejecución se detiene en el bloque actual y el error se propaga hacia arriba en la pila de llamadas hasta que es capturado o se convierte en un error no controlado.

### Captura de errores: `try...catch...finally`
```javascript
try {
  // código que puede lanzar un error
} catch (error) {
  // manejo del error
} finally {
  // se ejecuta siempre, haya o no error
}
```
- **`catch`** puede omitir la variable de error si no se necesita (ES10+): `catch { ... }`.
- **`finally`** se ejecuta incluso si dentro de `try` o `catch` hay un `return`, `throw` o `break`. Si el `finally` también lanza una excepción, esta reemplaza a cualquier excepción previa. Si `finally` tiene un `return`, anula cualquier `return` anterior en el `try`/`catch`.

**Ejemplo de interacción con `return`:**
```javascript
function test() {
  try {
    return 1;
  } finally {
    return 2; // este return prevalece, resultado = 2
  }
}
```

#### Jerarquía de errores
`Error` es el constructor base. Subclases nativas:
- `TypeError`: operación sobre un tipo inadecuado.
- `ReferenceError`: acceso a variable no declarada.
- `SyntaxError`: código mal formado (suele ocurrir en tiempo de parseo).
- `RangeError`: valor fuera del rango permitido.
- `URIError`: funciones de codificación/decodificación de URI con parámetros inválidos.
- `EvalError`: errores relacionados con `eval` (obsoleto en la práctica).

#### Errores personalizados
Se puede extender `Error` para añadir propiedades o un nombre distinto:
```javascript
class ValidationError extends Error {
  constructor(message, field) {
    super(message);
    this.name = 'ValidationError';
    this.field = field;
  }
}
throw new ValidationError('Campo requerido', 'email');
```

#### `cause` (ES2022)
Al lanzar un error se puede especificar una propiedad `cause` para encapsular el error original que provocó este.
```javascript
try {
  // ...
} catch (err) {
  throw new Error('Fallo al procesar', { cause: err });
}
```
Al capturar, se puede acceder a `error.cause`.

### Propagación y manejo asíncrono
- En funciones `async`, un `throw` dentro de la función rechaza la promesa.
- Los errores no capturados en promesas se convierten en eventos `unhandledrejection` (Node.js) o en el navegador.
- `try/catch` puede usarse con `await` para capturar rechazos de promesas.
- No se puede capturar un error lanzado en un callback asíncrono con un `try/catch` exterior, porque el callback se ejecuta en otro contexto.

### Buenas prácticas
- Lanzar siempre objetos `Error` o derivados.
- No suprimir errores sin manejarlos; al menos registrarlos.
- En aplicaciones, crear barreras de captura de errores globales (ej. `window.onerror`, `unhandledrejection`).

---

## 04-iteracion-for-of-in.md

### `for...in`
Itera sobre todas las **propiedades enumerables** de un objeto cuyas claves son cadenas (incluye propiedades heredadas del prototipo). El orden de iteración en la práctica es: primero claves numéricas en orden ascendente, luego claves de cadena en orden de inserción, y finalmente símbolos (aunque `for...in` **no** itera símbolos).

```javascript
const obj = { a: 1, b: 2 };
for (const key in obj) {
  console.log(key); // 'a', 'b'
}
```

#### Peligros y filtrado
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

#### Nota sobre arrays y `length`
Si se usa `for...in` sobre un array, las claves son los índices, pero al ser strings, operaciones como `key + 1` concatenan en lugar de sumar. Además, propiedades no numéricas (ej. `arr.foo = 'bar'`) también aparecerían.

### `for...of`
Introducido en ES6. Itera sobre los **valores** de un objeto **iterable**. Un iterable es aquel que implementa el protocolo iterable: debe tener un método en `Symbol.iterator` que devuelve un iterador.
El bucle llama a `next()` del iterador y asigna la propiedad `value` a la variable hasta que `done` es `true`.

```javascript
const arr = [10, 20, 30];
for (const valor of arr) {
  console.log(valor); // 10, 20, 30
}
```

#### Tipos iterables nativos
- `Array`, `String`, `Map`, `Set`, `TypedArray`, `NodeList`, `arguments` (en funciones tradicionales), etc.
- Los objetos planos (`{}`) **no** son iterables por defecto.
- Los generadores producen objetos iterables.

#### `for...of` con desestructuración
Cuando se itera sobre `Map` o arrays de pares:
```javascript
const map = new Map([['a', 1], ['b', 2]]);
for (const [key, value] of map) {
  console.log(key, value);
}
```

#### `for...of` con `await` (iteradores asíncronos)
Si el iterable es asíncrono (tiene `Symbol.asyncIterator`), se puede combinar con `for await...of`:
```javascript
for await (const chunk of readableStream) {
  // procesar chunk
}
```

#### Comparación `for...in` vs `for...of`
| Característica        | `for...in`                               | `for...of`                               |
|-----------------------|------------------------------------------|------------------------------------------|
| Propósito             | Claves enumerables (strings)             | Valores de iterables                     |
| Prototipo             | Itera sobre cadena de prototipos          | No, solo sobre el iterador del objeto    |
| Adecuado para arrays  | No                                       | Sí                                       |
| Incluye propiedades heredadas | Sí (requiere filtro)            | No (solo las que provee el iterador)     |
| Uso típico            | Objetos genéricos (para serializar, etc.)| Arrays, Map, Set, cadenas                |
| Orden                 | Similar a Object.keys pero no estandarizado completamente | El definido por el iterador |

#### Detalles de implementación de iteración
- `for...of` funciona con `break`, `continue` y etiquetas.
- Si se modifica el iterable mientras se itera, el comportamiento depende del tipo; en arrays, agregar elementos no los incluye en la iteración actual, pero modificar los existentes puede reflejarse.

#### Ejemplo de creación de iterador personalizado
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

---
