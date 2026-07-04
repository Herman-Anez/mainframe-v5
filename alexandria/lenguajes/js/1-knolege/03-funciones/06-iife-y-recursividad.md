# Iife y recursividad

## Funciones autoejecutables (IIFE)

**IIFE** (Immediately Invoked Function Expression) es una expresión de función que se define y se ejecuta inmediatamente. La sintaxis fuerza al intérprete a tratar la función como una expresión para luego invocarla.

### Sintaxis y variantes

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

### IIFE asíncronas

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

### Motivaciones y uso histórico

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

### IIFE con funciones flecha

Las arrow functions también pueden formar IIFE, con la limitación de no tener su propio `this` ni `arguments`, pero más compactas:

```javascript
(() => {
  console.log("IIFE flecha");
})();
```

### El punto y coma antes de IIFE

Cuando se concatena código, la ausencia de `;` en la línea anterior puede hacer que el intérprete interprete la IIFE como la llamada a una función cuyo nombre es lo que precede. Por eso a veces se ve un `;` defensivo:

```javascript
;(function() {
  // ...
})()
```

## Recursividad

Una función recursiva es aquella que se llama a sí misma (directa o indirectamente). Para evitar bucles infinitos, debe existir un **caso base** que detenga la recursión.

### Recursión directa clásica

```javascript
function factorial(n) {
  if (n <= 1) return 1;
  return n * factorial(n - 1);
}
```

Cada llamada consume un marco de pila; si la profundidad es excesiva, se produce un `RangeError` por desbordamiento de pila (stack overflow). El límite depende del motor, pero suele estar entre 10 000 y 50 000 llamadas.

### Recursión de cola (Tail Call)

Una llamada está en **posición de cola** si es lo último que ejecuta la función antes de retornar, sin necesidad de realizar operaciones adicionales con su resultado. En **modo estricto**, la especificación ECMAScript 6 define la **optimización de llamadas de cola (TCO)**: si una llamada de cola cumple ciertos requisitos, el motor puede reutilizar el marco de pila actual en lugar de crear uno nuevo.

```javascript
"use strict";
function factorialCola(n, acumulado = 1) {
  if (n <= 1) return acumulado;
  return factorialCola(n - 1, n * acumulado); // llamada en posición de cola
}
```

En la práctica, pocos motores implementan TCO (Safari/JavaScriptCore sí lo hizo). Por tanto, no se debe confiar ciegamente en ella para evitar desbordamiento de pila en todos los entornos.

### Trampolines (trampoline)

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

### Recursión mutua

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

### Memoización de funciones recursivas

Para evitar cálculos repetidos, se puede envolver la función recursiva en un mecanismo de caché (generalmente usando un closure o un Map).

```javascript
const fib = memoize(function(n) {
  if (n <= 1) return n;
  return fib(n - 1) + fib(n - 2);
});
```

Donde `memoize` es una HOF que guarda resultados previos. La recursión ahora computa cada valor una sola vez, reduciendo la complejidad exponencial a lineal (aunque sigue consumiendo pila por la recursión).

### Recursión sobre estructuras de datos

- **Árboles**: recorrer nodos anidados (JSON, DOM).
- **Estructuras inmutables**: procesar listas encadenadas.
- **Backtracking**: resolver problemas como las N reinas, Sudoku, generación de permutaciones.

### Limitaciones y alternativas

- El desbordamiento de pila es el principal riesgo. Para iteraciones profundas, se prefiere un bucle iterativo o la técnica de trampolín.
- Las funciones recursivas suelen ser más declarativas y concisas, pero no siempre más eficientes.
- En asincronía, la recursión se puede aplicar con `async/await` sobre estructuras recursivas (ej. recorrer un árbol con promesas), pero sin riesgo de pila porque cada `await` cede el control.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Funciones orden superior](05-funciones-orden-superior.md) | [🏠 Inicio](../index.md) | [Funciones generadoras ▶](07-funciones-generadoras.md) |
