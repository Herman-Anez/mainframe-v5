# Scope y closures

## Ámbito léxico (Lexical Scope)

JavaScript utiliza ámbito léxico (o estático): la visibilidad de las variables viene determinada por la estructura del código fuente en tiempo de compilación, no por la dinámica de ejecución. Cada función y cada bloque (`{ }`) puede introducir un nuevo ámbito anidado.

- `var`: ámbito de función o global; ignora bloques (excepto en módulos donde `var` no se vuelve propiedad global).
- `let` y `const`: ámbito de bloque; cualquier par de llaves (bloque, `if`, `for`, etc.) crea un nuevo ámbito.
- Las funciones hijas anidadas tienen acceso al ámbito de sus padres, pero no al revés.

## Entorno léxico en la especificación

Internamente, cada contexto de ejecución tiene un **LexicalEnvironment** que asocia identificadores con valores. Cuando se resuelve una variable, se recorre la cadena de entornos léxicos hacia afuera hasta encontrarla. Un closure es, en esencia, una función que mantiene una referencia a su entorno léxico exterior, incluso después de que la función exterior haya retornado.

## Closures

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

### Closures en bucles

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

### Múltiples closures sobre el mismo ámbito

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

### Aplicaciones prácticas

- **Módulos reveladores**: funciones que devuelven métodos públicos con acceso a variables privadas.
- **Funciones parciales y currificación**: generan funciones especializadas capturando argumentos iniciales.
- **Memoización**: almacenar resultados en variables cerradas para evitar cálculos repetidos.
- **Encapsulación de estado**: patrones como hook `useState` en React (conceptualmente closures).

### Memoria y recolección de basura

Mientras exista una referencia a una función que cierre sobre un ámbito, las variables de ese ámbito no pueden ser recolectadas. Si el closure captura más variables de las necesarias, puede provocar retención innecesaria de memoria. Es buena práctica que los closures capturen solo lo indispensable.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Parametros y rest spread](03-parametros-y-rest-spread.md) | [🏠 Inicio](../index.md) | [Funciones orden superior ▶](05-funciones-orden-superior.md) |
