## 01-declaracion-vs-expresion.md

### Declaración de función (Function Declaration)

La sintaxis consiste en la palabra clave `function` seguida de un **identificador obligatorio**, paréntesis para los parámetros y un cuerpo entre llaves.

```javascript
function saludar(nombre) {
  return `Hola ${nombre}`;
}
```

#### Hoisting completo

Las declaraciones de función son izadas (hoisted) en su totalidad: tanto el identificador como su definición están disponibles en todo el ámbito contenedor, incluso antes de la línea donde se declaran.

```javascript
console.log(saludar("Ana")); // "Hola Ana"
function saludar(nombre) {
  return `Hola ${nombre}`;
}
```

Esto ocurre porque en la fase de creación del contexto de ejecución, las declaraciones de función se procesan antes de ejecutar el código.

#### Ámbito de bloque y modo estricto

En modo estricto (y en todos los módulos), las declaraciones de función dentro de bloques `{ }` tienen ámbito de bloque. Fuera del bloque, la función no es visible.

```javascript
"use strict";
{
  function interna() { return 1; }
}
console.log(typeof interna); // "undefined"
```

En modo no estricto, el comportamiento puede variar entre motores; algunos las elevan al ámbito de la función contenedora. Por seguridad, siempre debe usarse modo estricto o evitarlas en bloques.

### Expresión de función (Function Expression)

Una función puede aparecer en el lado derecho de una asignación, dentro de paréntesis, o pasarse como argumento. Puede ser **anónima** o tener un nombre interno.

```javascript
const fn = function() { /* anónima */ };
const fn2 = function interna() { /* nombre interno */ };
```

#### Hoisting: la variable, no la función

La variable que almacena la expresión de función se iza según su declaración (`var`, `let`, `const`), pero la asignación de la función ocurre en tiempo de ejecución. Con `let`/`const`, la variable está en la Zona Muerta Temporal (TDZ) hasta la línea de asignación, por lo que no puede usarse antes.

```javascript
console.log(fn); // undefined (si var) o ReferenceError (si let/const)
var fn = function() { return 1; };
```

#### Expresiones de función con nombre (Named Function Expression – NFE)

Al dar un nombre a la expresión de función, este nombre **solo es visible dentro del cuerpo de la función**, facilitando la depuración (aparece en la pila de llamadas) y permitiendo la autorreferencia en recursión.

```javascript
const factorial = function fact(n) {
  return n <= 1 ? 1 : n * fact(n - 1);
};
console.log(factorial.name); // "fact"
console.log(fact);           // ReferenceError (no existe fuera)
```

En versiones antiguas de IE, las NFE creaban dos identificadores (bug). Hoy el comportamiento está normalizado: el nombre interno es inmutable y su ámbito está restringido al cuerpo de la función.

#### ¿Declaración o expresión? Regla nemotécnica

Si la primera palabra de la sentencia es `function`, se interpreta como declaración. Si no, es una expresión (excepto en casos de ambigüedad, como `export default function(){}`). Por eso las IIFE suelen envolverse entre paréntesis: `(function() { ... })()` para forzar la interpretación como expresión.

### Comparación de uso

| Aspecto               | Declaración                       | Expresión                         |
|-----------------------|-----------------------------------|-----------------------------------|
| Hoisting              | Completo (cuerpo disponible)      | Solo la variable (si var) o TDZ   |
| Ámbito                | Función/global, bloque en strict  | Depende de la variable            |
| Recursión segura      | Sí (nombre disponible)            | Sí (usando variable o nombre NFE)|
| Uso en callbacks      | Poco práctico                     | Muy común (anónima)               |
| IIFE                  | No puede directamente             | Se utiliza con paréntesis          |

---

## 02-arrow-functions.md

### Sintaxis de las funciones flecha

Las funciones flecha introducen una sintaxis concisa. Las variantes principales son:

1. **Sin parámetros**: `() => expresión`
2. **Un parámetro** (paréntesis opcionales): `x => x * 2`
3. **Varios parámetros**: `(a, b) => a + b`
4. **Cuerpo de bloque**: `(a, b) => { return a + b; }`
5. **Devolución de objeto literal**: debe envolverse en paréntesis para evitar ambigüedad con el cuerpo de bloque:
   ```javascript
   const crear = (nombre, edad) => ({ nombre, edad });
   ```

### Características fundamentales

Las arrow functions **no tienen su propio enlace de `this`, `arguments`, `super` ni `new.target`**. Todos ellos se toman del ámbito léxico que las contiene.

#### `this` léxico

En una función tradicional, `this` depende de cómo se invoca (objeto, global, `call`, `new`). En una flecha, `this` conserva el valor que tiene en el contexto en el que fue definida, sin importar cómo se llame después.

```javascript
const objeto = {
  nombre: "Mundo",
  tradicional: function() { console.log(this.nombre); },
  flecha: () => { console.log(this.nombre); }
};
objeto.tradicional(); // "Mundo"
objeto.flecha();      // undefined (this es el global o undefined en módulo)
```

Esto las hace ideales para:
- Callbacks que necesitan acceder al `this` de la función externa (por ejemplo, en métodos de clase).
- Funciones anidadas dentro de métodos que requieren el `this` del objeto.

Pero **no** deben usarse como métodos de objeto cuando se necesita el propio objeto como contexto; tampoco como constructores (no tienen `[[Construct]]` ni propiedad `prototype`), y no pueden ser generadores (no aceptan `yield`).

#### Sin objeto `arguments`

Dentro de una flecha, `arguments` referencia al objeto `arguments` de la función no flecha que la contiene. Si se accede en el ámbito global, lanza `ReferenceError`. Para recoger argumentos variables en una flecha se usan **parámetros rest** (`...args`).

```javascript
const flecha = (...args) => console.log(args);
flecha(1,2,3); // [1,2,3]
```

#### Imposibilidad de ser constructores

Llamar `new flecha()` produce `TypeError`. No poseen la propiedad `prototype`.

#### `super` y `new.target`

También se heredan del ámbito léxico padre. Esto permite usarlas dentro de clases para acceder a `super` de forma más limpia, pero con la misma restricción: deben estar definidas en un contexto donde `super` tenga sentido.

#### Cuándo no usar arrow functions

- **Como métodos de un objeto** que requieren `this` del objeto.
- **Como manejadores de eventos del DOM** donde se espera `this === elemento`.
- **Cuando se necesita `arguments`** sin usar rest.
- **Cuando la función debe ser un constructor.**

### Casos de uso típicos

- Transformaciones con `map`, `filter`, `reduce`:
  ```javascript
  const duplicados = numeros.map(n => n * 2);
  ```
- Enclosures que capturan `this` de una clase:
  ```javascript
  class Temporizador {
    iniciar() {
      this.segundos = 0;
      setInterval(() => { this.segundos++; }, 1000);
    }
  }
  ```

---

## 03-parametros-y-rest-spread.md

### Parámetros por defecto

Se asigna un valor por defecto a un parámetro mediante `=` en la firma de la función. La asignación se evalúa **en el momento de la llamada**, y solo si el argumento correspondiente es `undefined`. `null` y otros valores no activan el defecto.

```javascript
function multiplicar(a, b = 1) {
  return a * b;
}
multiplicar(5);     // 5
multiplicar(5, 2);  // 10
multiplicar(5, undefined); // 5
multiplicar(5, null); // 0 (null se convierte a 0)
```

Los valores por defecto pueden ser expresiones, incluso usar parámetros anteriores:

```javascript
function suma(a, b = a * 2) {
  return a + b;
}
```

#### Zona Muerta Temporal (TDZ) en parámetros

Los parámetros se evalúan de izquierda a derecha. Si un parámetro intenta usar uno posterior, este último está en TDZ y lanza `ReferenceError`.

```javascript
function err(a = b, b = 1) {} // ReferenceError
```

#### Parámetros y el objeto `arguments`

En modo no estricto, el objeto `arguments` mantiene un enlace vivo con los parámetros nombrados: modificar un parámetro también modifica `arguments[i]` y viceversa. En modo estricto (y en funciones flecha, donde no hay `arguments` propio), no existe tal enlace.

### Parámetros rest (`...`)

El último parámetro de una función puede ser precedido por `...` para capturar todos los argumentos restantes en un **array verdadero**.

```javascript
function log(tag, ...mensajes) {
  console.log(`[${tag}]`, ...mensajes);
}
log("INFO", "arranque", "conexión OK"); // [INFO] arranque conexión OK
```

- El parámetro rest **debe ser el último**.
- Siempre es un array (aunque no se pasen argumentos, será un array vacío).
- Reemplaza ventajosamente al objeto `arguments` en funciones modernas.

### Operador spread en la llamada

El mismo operador `...` delante de un iterable (array, cadena, Set, etc.) expande sus elementos como argumentos individuales.

```javascript
const nums = [4, 7, 1];
console.log(Math.max(...nums)); // 7
```

También puede combinarse con argumentos posicionales:

```javascript
function suma(a, b, c) { return a + b + c; }
const valores = [1,2];
suma(...valores, 3); // 6
```

#### Spread vs. rest

- **Rest** agrupa elementos en una estructura (definición de función, desestructuración).
- **Spread** expande elementos de una estructura (llamada a función, arrays/objetos literales).

### Desestructuración de parámetros

Se puede desestructurar un objeto o array directamente en los parámetros de la función, opcionalmente con valores por defecto.

```javascript
function mostrar({ nombre, edad = 0 } = {}) {
  console.log(nombre, edad);
}
mostrar({ nombre: "Luis" }); // "Luis", 0
mostrar();                    // undefined, 0 (si no se provee el objeto completo, el defecto evita error)
```

Esto simula parámetros con nombre, una práctica común para funciones con muchas opciones.

### El objeto `arguments` (tradicional)

En funciones no flecha, `arguments` es un objeto array‑like que contiene todos los argumentos pasados a la función. Soporta `length` y acceso por índice, pero carece de métodos de array.

```javascript
function concatenar() {
  return Array.from(arguments).join(', ');
}
```

En modo estricto, `arguments` no está vinculado dinámicamente a los parámetros nombrados y `arguments.callee` / `arguments.caller` lanzan error. En arrow functions no existe.

---

## 04-scope-y-closures.md

### Ámbito léxico (Lexical Scope)

JavaScript utiliza ámbito léxico (o estático): la visibilidad de las variables viene determinada por la estructura del código fuente en tiempo de compilación, no por la dinámica de ejecución. Cada función y cada bloque (`{ }`) puede introducir un nuevo ámbito anidado.

- `var`: ámbito de función o global; ignora bloques (excepto en módulos donde `var` no se vuelve propiedad global).
- `let` y `const`: ámbito de bloque; cualquier par de llaves (bloque, `if`, `for`, etc.) crea un nuevo ámbito.
- Las funciones hijas anidadas tienen acceso al ámbito de sus padres, pero no al revés.

### Entorno léxico en la especificación

Internamente, cada contexto de ejecución tiene un **LexicalEnvironment** que asocia identificadores con valores. Cuando se resuelve una variable, se recorre la cadena de entornos léxicos hacia afuera hasta encontrarla. Un closure es, en esencia, una función que mantiene una referencia a su entorno léxico exterior, incluso después de que la función exterior haya retornado.

### Closures

Un closure es la combinación de una función y el ámbito léxico en el que fue declarada. Esta referencia al entorno exterior persiste mientras exista al menos una función que la capture.

```javascript
function crearContador() {
  let cuenta = 0;
  return function() {
    cuenta++;
    return cuenta;
  };
}
const contador = crearContador();
console.log(contador()); // 1
console.log(contador()); // 2
```

`cuenta` no es accesible desde fuera, pero la función interna la mantiene viva. Cada llamada a `crearContador` produce un nuevo ámbito con su propio `cuenta`.

#### Closures en bucles

Un error clásico es crear funciones dentro de un bucle con `var`, porque comparten la misma variable de ámbito de función.

```javascript
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0);
}
// Imprime 3, 3, 3
```

Soluciones:
- Usar `let`, que crea una nueva variable por iteración (ámbito de bloque).
- Crear un closure adicional mediante una IIFE que capture el valor actual:
  ```javascript
  for (var i = 0; i < 3; i++) {
    (function(j) {
      setTimeout(() => console.log(j), 0);
    })(i);
  }
  ```

#### Múltiples closures sobre el mismo ámbito

Si varias funciones internas comparten el mismo ámbito externo, modificar una variable compartida afecta a todas:

```javascript
function fabrica() {
  let valor = 1;
  return {
    inc: () => ++valor,
    dec: () => --valor,
    ver: () => valor
  };
}
const obj = fabrica();
obj.inc(); obj.inc();
console.log(obj.ver()); // 3
```

#### Aplicaciones prácticas

- **Módulos reveladores**: funciones que devuelven métodos públicos con acceso a variables privadas.
- **Funciones parciales y currificación**: generan funciones especializadas capturando argumentos iniciales.
- **Memoización**: almacenar resultados en variables cerradas para evitar cálculos repetidos.
- **Encapsulación de estado**: patrones como hook `useState` en React (conceptualmente closures).

#### Memoria y recolección de basura

Mientras exista una referencia a una función que cierre sobre un ámbito, las variables de ese ámbito no pueden ser recolectadas. Si el closure captura más variables de las necesarias, puede provocar retención innecesaria de memoria. Es buena práctica que los closures capturen solo lo indispensable.

---

## 05-funciones-orden-superior.md

### Funciones como ciudadanos de primera clase

En JavaScript, las funciones son objetos. Pueden:
- Asignarse a variables o propiedades.
- Pasarse como argumentos a otras funciones.
- Devolverse como resultado de otras funciones.
- Tener propiedades y métodos propios (como `call`, `bind`).

### Funciones de orden superior (Higher-Order Functions, HOF)

Una función se considera de orden superior si cumple **al menos una** de estas condiciones:
- Recibe una o más funciones como argumentos.
- Retorna una función.

#### Recepción de funciones (callbacks)

El patrón más inmediato: pasar una función para que se ejecute en un momento determinado.

```javascript
function ejecutarSi(v, fn) {
  if (v) fn();
}
ejecutarSi(true, () => console.log("Se ejecutó"));
```

Los métodos funcionales de los arrays (`map`, `filter`, `reduce`, `forEach`, etc.) son HOFs que reciben callbacks.

```javascript
const pares = [1,2,3,4].filter(n => n % 2 === 0);
```

Otras APIs: `setTimeout`, `addEventListener`, promesas con `.then()`, etc.

#### Retorno de funciones (factory functions)

Una función puede generar otras funciones dinámicamente, a menudo aprovechando closures para configurar su comportamiento.

```javascript
function crearSaludo(saludo) {
  return function(nombre) {
    return `${saludo}, ${nombre}`;
  };
}
const hola = crearSaludo("Hola");
hola("Carlos"); // "Hola, Carlos"
```

Este patrón es la base de la **currificación** y de la **aplicación parcial**.

#### Composición de funciones

La composición permite combinar funciones pequeñas para formar otras más complejas. Dos funciones `f` y `g` se pueden componer como `f ∘ g` (f(g(x))).

```javascript
const compose = (f, g) => x => f(g(x));
const aMayusculas = str => str.toUpperCase();
const exclamar = str => str + "!";
const gritar = compose(exclamar, aMayusculas);
gritar("hola"); // "HOLA!"
```

Las utilidades `pipe` (inversa de `compose`) son comunes en programación funcional.

#### Abstracción de patrones comunes

Las HOF permiten encapsular patrones repetitivos:

**`once`**: asegura que una función se ejecute solo una vez.
```javascript
function once(fn) {
  let ejecutada = false, resultado;
  return function(...args) {
    if (!ejecutada) {
      ejecutada = true;
      resultado = fn(...args);
    }
    return resultado;
  };
}
```

**`memoize`**: cachea resultados según los argumentos.
```javascript
function memoize(fn) {
  const cache = new Map();
  return function(arg) {
    if (cache.has(arg)) return cache.get(arg);
    const result = fn(arg);
    cache.set(arg, result);
    return result;
  };
}
```

**`throttle` y `debounce`** limitan la frecuencia de ejecución para manejar eventos rápidos.

#### Inversión de control

Al pasar callbacks, se cede parte del flujo de ejecución a otra función o biblioteca. Esto es poderoso, pero puede llevar al "callback hell" si se abusa de anidaciones. Las promesas y `async/await` mitigan este problema.

#### Relación con programación funcional

Las HOF son piedra angular de un estilo declarativo. Junto con **inmutabilidad**, **transparencia referencial** y **evitación de efectos secundarios**, fomentan un código más predecible y testeable.

#### Currificación y aplicación parcial como HOF

- **Currificación**: transformar una función de múltiples argumentos en una secuencia de funciones unarias.
  ```javascript
  const curry = fn => a => b => fn(a, b);
  const sumaCurry = curry((a, b) => a + b);
  sumaCurry(2)(3); // 5
  ```
- **Aplicación parcial**: fijar algunos argumentos de una función, devolviendo otra que espera los restantes.
  ```javascript
  function parcial(fn, ...args) {
    return (...rest) => fn(...args, ...rest);
  }
  ```
Ambos patrones se implementan con HOF y closures.

---
## 06-iife-y-recursividad.md

### Funciones autoejecutables (IIFE)

**IIFE** (Immediately Invoked Function Expression) es una expresión de función que se define y se ejecuta inmediatamente. La sintaxis fuerza al intérprete a tratar la función como una expresión para luego invocarla.

#### Sintaxis y variantes

El envoltorio con paréntesis es la forma más común, aunque cualquier operador unario que convierta la declaración en expresión funciona.

```javascript
// Forma clásica (paréntesis envolventes)
(function() {
  console.log("IIFE ejecutada");
})();

// Paréntesis fuera (estilo Douglas Crockford)
(function() {
  console.log("Alternativa");
}());

// Con operador unario (menos legible pero válido)
!function() {
  console.log("Con negación");
}();
~function() { /* ... */ }();
+function() { /* ... */ }();
void function() { /* ... */ }();
```

La IIFE puede llevar parámetros, que se pasan en la invocación:

```javascript
const modulo = (function(doc) {
  const privado = 42;
  return {
    getPrivado() { return privado; },
    crearElemento(tag) { return doc.createElement(tag); }
  };
})(document);
```

#### IIFE asíncronas

Con `async/await` se puede escribir una IIFE que retorne una promesa, permitiendo top‑level `await` antes de su soporte nativo en módulos:

```javascript
(async function() {
  const datos = await fetch("https://api.example.com");
  // procesar
})();
```

Otra forma compacta con función flecha:

```javascript
(async () => {
  const modulo = await import('./dinamico.js');
})();
```

#### Motivaciones y uso histórico

- **Ámbito privado**: antes de `let`/`const` y módulos, las IIFE proporcionaban encapsulación para evitar contaminar el ámbito global.
- **Módulos reveladores (revealing module pattern)**: exponer únicamente los métodos públicos.
- **Aislamiento en bucles**: crear un closure por iteración para capturar el valor actual de una variable `var`.

```javascript
for (var i = 0; i < 3; i++) {
  (function(j) {
    setTimeout(() => console.log(j), 0);
  })(i);
}
// Imprime 0, 1, 2
```

#### IIFE con funciones flecha

Las arrow functions también pueden formar IIFE, con la limitación de no tener su propio `this` ni `arguments`, pero más compactas:

```javascript
(() => {
  console.log("IIFE flecha");
})();
```

#### El punto y coma antes de IIFE

Cuando se concatena código, la ausencia de `;` en la línea anterior puede hacer que el intérprete interprete la IIFE como la llamada a una función cuyo nombre es lo que precede. Por eso a veces se ve un `;` defensivo:

```javascript
;(function() {
  // ...
})()
```

### Recursividad

Una función recursiva es aquella que se llama a sí misma (directa o indirectamente). Para evitar bucles infinitos, debe existir un **caso base** que detenga la recursión.

#### Recursión directa clásica

```javascript
function factorial(n) {
  if (n <= 1) return 1;
  return n * factorial(n - 1);
}
```

Cada llamada consume un marco de pila; si la profundidad es excesiva, se produce un `RangeError` por desbordamiento de pila (stack overflow). El límite depende del motor, pero suele estar entre 10 000 y 50 000 llamadas.

#### Recursión de cola (Tail Call)

Una llamada está en **posición de cola** si es lo último que ejecuta la función antes de retornar, sin necesidad de realizar operaciones adicionales con su resultado. En **modo estricto**, la especificación ECMAScript 6 define la **optimización de llamadas de cola (TCO)**: si una llamada de cola cumple ciertos requisitos, el motor puede reutilizar el marco de pila actual en lugar de crear uno nuevo.

```javascript
"use strict";
function factorialCola(n, acumulado = 1) {
  if (n <= 1) return acumulado;
  return factorialCola(n - 1, n * acumulado); // llamada en posición de cola
}
```

En la práctica, pocos motores implementan TCO (Safari/JavaScriptCore sí lo hizo). Por tanto, no se debe confiar ciegamente en ella para evitar desbordamiento de pila en todos los entornos.

#### Trampolines (trampoline)

Cuando no hay TCO, se puede simular mediante un **trampolín**: la función no se llama a sí misma directamente, sino que retorna una función que representa el siguiente paso. Un bucle externo se encarga de invocar sucesivamente esas funciones.

```javascript
function factorialTrampoline(n, acum = 1) {
  if (n <= 1) return acum;
  return () => factorialTrampoline(n - 1, n * acum);
}

function trampoline(fn) {
  let result = fn;
  while (typeof result === 'function') {
    result = result();
  }
  return result;
}

trampoline(() => factorialTrampoline(20000)); // sin desbordar pila
```

#### Recursión mutua

Dos o más funciones se llaman entre sí. Poco común pero útil en autómatas o parsers.

```javascript
function esPar(n) {
  if (n === 0) return true;
  return esImpar(n - 1);
}
function esImpar(n) {
  if (n === 0) return false;
  return esPar(n - 1);
}
```

Requiere la misma preocupación por el límite de pila.

#### Memoización de funciones recursivas

Para evitar cálculos repetidos, se puede envolver la función recursiva en un mecanismo de caché (generalmente usando un closure o un Map).

```javascript
const fib = memoize(function(n) {
  if (n <= 1) return n;
  return fib(n - 1) + fib(n - 2);
});
```

Donde `memoize` es una HOF que guarda resultados previos. La recursión ahora computa cada valor una sola vez, reduciendo la complejidad exponencial a lineal (aunque sigue consumiendo pila por la recursión).

#### Recursión sobre estructuras de datos

- **Árboles**: recorrer nodos anidados (JSON, DOM).
- **Estructuras inmutables**: procesar listas encadenadas.
- **Backtracking**: resolver problemas como las N reinas, Sudoku, generación de permutaciones.

#### Limitaciones y alternativas

- El desbordamiento de pila es el principal riesgo. Para iteraciones profundas, se prefiere un bucle iterativo o la técnica de trampolín.
- Las funciones recursivas suelen ser más declarativas y concisas, pero no siempre más eficientes.
- En asincronía, la recursión se puede aplicar con `async/await` sobre estructuras recursivas (ej. recorrer un árbol con promesas), pero sin riesgo de pila porque cada `await` cede el control.

---

## 07-funciones-generadoras.md

### Definición y sintaxis

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

#### El protocolo Generator

Un objeto generador implementa tres métodos principales:

- **`next(value?)`**: reanuda la ejecución hasta el siguiente `yield` (o `return`/final). El argumento opcional `value` se convierte en el valor retornado por la expresión `yield` que pausó. Retorna `{ value, done }`.
- **`return(value?)`**: finaliza prematuramente el generador, como si un `return` se hubiera ejecutado. La siguiente llamada a `next()` devolverá `{ value: undefined, done: true }`. El valor pasado a `return` se asigna al resultado de la expresión `yield` en curso y el estado del generador pasa a `"closed"`.
- **`throw(error)`**: lanza una excepción dentro del generador justo en el punto donde está pausado. El generador puede capturarla con `try/catch`. Si no la captura, el generador se cierra y la excepción se propaga.

#### Expresión `yield`

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

#### `yield*` – delegación a otro iterable

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

#### Generadores como iterables

Los objetos generadores son iterables (tienen `[Symbol.iterator]()` que se retorna a sí mismo). Por tanto, se pueden usar con `for...of`, spread, etc.

```javascript
for (const n of contador()) {
  console.log(n); // 1,2,3
}
```

#### Aplicaciones prácticas

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

#### Generadores asíncronos (`async function*`)

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

#### Estados internos y cierre

Un generador puede estar en estado `"suspended"`, `"executing"` o `"closed"`. La propiedad interna `[[GeneratorState]]` refleja su estado. Llamar `return()` o `throw()` que no sea capturado cierra el generador definitivamente.

#### Precauciones

- Los generadores no pueden ser usados como constructores (no tienen `[[Construct]]`).
- Al delegar con `yield*`, si el iterable delegado no tiene un cierre limpio y se lanza una excepción, esta se propaga al generador delegante.
- La iteración con `for...of` llama implícitamente a `return()` cuando se rompe el bucle o se lanza un error, lo que permite la limpieza.

---

## 08-parametros-por-defecto.md

Los parámetros por defecto permiten inicializar parámetros formales con un valor predeterminado si el argumento correspondiente es `undefined`. Se evalúan en el momento de la llamada, y su ámbito es el mismo que el de la función.

### Sintaxis y evaluación

```javascript
function f(a, b = 10) { return a + b; }
f(5);      // 15
f(5, 2);   // 7
f(5, undefined); // 15 (undefined activa el defecto)
f(5, null); // 5, porque null no dispara el defecto, null se convierte a 0
```

El valor por defecto puede ser cualquier expresión, incluyendo llamadas a funciones, operadores o referencias a otros parámetros:

```javascript
function g(x, y = x * 2) {
  return [x, y];
}
g(3); // [3, 6]
g(3, 4); // [3, 4]
```

La expresión se evalúa **cada vez** que se invoca la función sin ese argumento, por lo que efectos secundarios como llamadas a `Date.now()` se ejecutan en cada llamada:

```javascript
function conMarca(texto, marca = Date.now()) {
  console.log(texto, marca);
}
conMarca('Hola'); // Hola 1680000000000
setTimeout(() => conMarca('Tarde'), 1000); // Tarde 1680000001000 (valor distinto)
```

### Ámbito y Temporal Dead Zone (TDZ)

Los parámetros formales están en un ámbito propio (el **ámbito de parámetros**), separado del cuerpo de la función. Los parámetros se evalúan de izquierda a derecha, por lo que uno por defecto puede referenciar a parámetros ya definidos, pero **no** a parámetros posteriores, pues estos estarían en la TDZ.

```javascript
function err(a = b, b = 1) { } // ReferenceError: b no está definida en el momento de evaluar a
function ok(b = 1, a = b) { } // correcto, b ya está definida
```

La TDZ también aplica a variables `let`/`const` dentro del ámbito de parámetros si se usan antes de la inicialización.

### Interacción con `arguments`

En modo no estricto, el objeto `arguments` está vinculado dinámicamente a los parámetros: modificar un parámetro modifica `arguments[i]` y viceversa. Con parámetros por defecto, este vínculo se **rompe parcialmente** según la especificación. En modo estricto (y en funciones flecha), no hay vínculo en absoluto.

```javascript
function test(a, b = 2) {
  a = 100;
  console.log(arguments[0]); // En no estricto sigue siendo 1 (el valor original) porque el mapeo se rompe al tener parámetros por defecto?
}
test(1); // En realidad, en modo no estricto, si hay parámetros por defecto o rest, el motor deja de vincular. arguments[0] sigue siendo 1.
```

La regla: si la firma de la función contiene **cualquier** parámetro por defecto, rest o desestructuración, el objeto `arguments` ya **no** se mapea dinámicamente con los parámetros, incluso en modo no estricto. Esto evita confusiones.

### Parámetros por defecto con desestructuración

Se puede aplicar directamente en la firma, tanto con objetos como con arrays:

```javascript
function crear({ nombre = "Invitado", edad = 0 } = {}) {
  return { nombre, edad };
}
crear({ nombre: "Ana" }); // { nombre: "Ana", edad: 0 }
crear();                  // { nombre: "Invitado", edad: 0 }
```

Sin el objeto vacío por defecto `= {}`, llamar `crear()` causaría un `TypeError` al intentar desestructurar `undefined`. El patrón `= {}` es una salvaguarda.

Para arrays:

```javascript
function sumar([a = 0, b = 0] = []) {
  return a + b;
}
sumar(); // 0
sumar([3]); // 3
```

### Uso de funciones como valores por defecto

Pueden ser invocaciones o referencias a funciones, útiles para inicializaciones costosas que se evalúan de forma diferida.

```javascript
function getConfig() {
  console.log('Cargando configuración...');
  return { modo: 'estricto' };
}
function iniciar(config = getConfig()) {
  console.log(config);
}
iniciar(); // ejecuta getConfig
iniciar({ modo: 'relajado' }); // no ejecuta getConfig
```

### Aplicaciones prácticas

- **Evitar comprobaciones manuales**: remplazar `b = b || 10` por `b = 10`, aunque con la diferencia de `||` frente a `??` (valores falsy). El parámetro por defecto solo cubre `undefined`, lo que es más seguro.
- **Funciones con opciones obligatorias**: usar un valor por defecto que lance un error si se omite un argumento importante.

```javascript
function requerido(nombre) {
  throw new Error(`Falta el parámetro ${nombre}`);
}
function crearUsuario(id = requerido('id'), nombre = 'Anónimo') {
  // ...
}
```

- **Combinación con rest**: el parámetro rest captura el excedente después de aplicar los valores por defecto.

### Rendimiento

Cada vez que se llama a la función y un argumento es `undefined`, se evalúa la expresión por defecto. Para valores constantes, no hay impacto. Para expresiones complejas (llamadas a APIs, creación de objetos), podría ser relevante. En esos casos, se puede inicializar dentro del cuerpo tras verificar `undefined`, pero se pierde la elegancia de la firma.

---

