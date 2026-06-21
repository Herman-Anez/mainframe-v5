# Declaracion vs expresion

## Declaración de función (Function Declaration)

La sintaxis consiste en la palabra clave `function` seguida de un **identificador obligatorio**, paréntesis para los parámetros y un cuerpo entre llaves.

```javascript
function saludar(nombre) {
  return `Hola ${nombre}`;
}
```

### Hoisting completo

Las declaraciones de función son izadas (hoisted) en su totalidad: tanto el identificador como su definición están disponibles en todo el ámbito contenedor, incluso antes de la línea donde se declaran.

```javascript
console.log(saludar("Ana")); // "Hola Ana"
function saludar(nombre) {
  return `Hola ${nombre}`;
}
```

Esto ocurre porque en la fase de creación del contexto de ejecución, las declaraciones de función se procesan antes de ejecutar el código.

### Ámbito de bloque y modo estricto

En modo estricto (y en todos los módulos), las declaraciones de función dentro de bloques `{ }` tienen ámbito de bloque. Fuera del bloque, la función no es visible.

```javascript
"use strict";
{
  function interna() { return 1; }
}
console.log(typeof interna); // "undefined"
```

En modo no estricto, el comportamiento puede variar entre motores; algunos las elevan al ámbito de la función contenedora. Por seguridad, siempre debe usarse modo estricto o evitarlas en bloques.

## Expresión de función (Function Expression)

Una función puede aparecer en el lado derecho de una asignación, dentro de paréntesis, o pasarse como argumento. Puede ser **anónima** o tener un nombre interno.

```javascript
const fn = function() { /* anónima */ };
const fn2 = function interna() { /* nombre interno */ };
```

### Hoisting: la variable, no la función

La variable que almacena la expresión de función se iza según su declaración (`var`, `let`, `const`), pero la asignación de la función ocurre en tiempo de ejecución. Con `let`/`const`, la variable está en la Zona Muerta Temporal (TDZ) hasta la línea de asignación, por lo que no puede usarse antes.

```javascript
console.log(fn); // undefined (si var) o ReferenceError (si let/const)
var fn = function() { return 1; };
```

### Expresiones de función con nombre (Named Function Expression – NFE)

Al dar un nombre a la expresión de función, este nombre **solo es visible dentro del cuerpo de la función**, facilitando la depuración (aparece en la pila de llamadas) y permitiendo la autorreferencia en recursión.

```javascript
const factorial = function fact(n) {
  return n <= 1 ? 1 : n * fact(n - 1);
};
console.log(factorial.name); // "fact"
console.log(fact);           // ReferenceError (no existe fuera)
```

En versiones antiguas de IE, las NFE creaban dos identificadores (bug). Hoy el comportamiento está normalizado: el nombre interno es inmutable y su ámbito está restringido al cuerpo de la función.

### ¿Declaración o expresión? Regla nemotécnica

Si la primera palabra de la sentencia es `function`, se interpreta como declaración. Si no, es una expresión (excepto en casos de ambigüedad, como `export default function(){}`). Por eso las IIFE suelen envolverse entre paréntesis: `(function() { ... })()` para forzar la interpretación como expresión.

## Comparación de uso

| Aspecto               | Declaración                       | Expresión                         |
|-----------------------|-----------------------------------|-----------------------------------|
| Hoisting              | Completo (cuerpo disponible)      | Solo la variable (si var) o TDZ   |
| Ámbito                | Función/global, bloque en strict  | Depende de la variable            |
| Recursión segura      | Sí (nombre disponible)            | Sí (usando variable o nombre NFE)|
| Uso en callbacks      | Poco práctico                     | Muy común (anónima)               |
| IIFE                  | No puede directamente             | Se utiliza con paréntesis          |

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Iteracion for of in](../02-control-de-flujo/04-iteracion-for-of-in.md) | [🏠 Inicio](../index.md) | [Arrow functions ▶](02-arrow-functions.md) |
