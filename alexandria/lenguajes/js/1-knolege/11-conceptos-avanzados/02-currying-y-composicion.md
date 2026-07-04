# Currying y composicion

## Currying (Currificación)

Currificar una función significa transformarla de manera que, en lugar de recibir todos sus argumentos a la vez, los reciba uno a uno, devolviendo una nueva función por cada argumento faltante.

```javascript
// Función normal
function suma(a, b, c) {
  return a + b + c;
}

// Versión currificada manual
function sumaCurry(a) {
  return function(b) {
    return function(c) {
      return a + b + c;
    };
  };
}
console.log(sumaCurry(1)(2)(3)); // 6
```

### Función curry genérica

Se puede implementar un `curry` que transforme cualquier función multiargumento.

```javascript
function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) {
      return fn.apply(this, args);
    }
    return (...next) => curried(...args, ...next);
  };
}
const sumaC = curry((a, b, c) => a + b + c);
console.log(sumaC(1)(2)(3)); // 6
console.log(sumaC(1, 2)(3)); // 6
```

La currificación permite crear funciones reutilizables altamente especializadas. Por ejemplo, `map` con un transformador fijo:

```javascript
const map = curry((fn, arr) => arr.map(fn));
const duplicarNumeros = map(x => x * 2);
console.log(duplicarNumeros([1, 2, 3])); // [2,4,6]
```

### Currying vs aplicación parcial

- **Currying**: descompone la función en funciones unarias (de un argumento) y solo se ejecuta cuando todos los argumentos están presentes.
- **Aplicación parcial**: fija algunos argumentos y devuelve una función que espera los restantes, sin importar cuántos sean.

```javascript
// Aplicación parcial con bind
function saludar(saludo, nombre) {
  return `${saludo} ${nombre}`;
}
const saludarHola = saludar.bind(null, 'Hola');
console.log(saludarHola('Ana')); // Hola Ana
```

### Beneficios del currying

- **Reutilización**: generar funciones preconfiguradas.
- **Punto libre (point-free)**: definir funciones sin mencionar los datos, solo componiendo otras funciones.
- **Legibilidad** en pipelines funcionales.
- **Evaluación parcial**: diferir la ejecución hasta tener todos los argumentos.

## Composición de funciones

Componer funciones implica combinar dos o más para formar una nueva, donde la salida de una se convierte en la entrada de la siguiente.

```javascript
const compose = (f, g) => x => f(g(x));
const aMayus = str => str.toUpperCase();
const exclamar = str => `${str}!`;
const gritar = compose(exclamar, aMayus);
console.log(gritar('hola')); // "HOLA!"
```

### `compose` y `pipe`

- **compose(f, g)**: aplica de derecha a izquierda (f(g(x))).
- **pipe**: aplica de izquierda a derecha (g(f(x))), a menudo más legible en programación funcional.

```javascript
const pipe = (...fns) => x => fns.reduce((v, f) => f(v), x);
const gritarPipe = pipe(aMayus, exclamar);
console.log(gritarPipe('hola')); // "HOLA!"
```

### Composición sobre herencia

En lugar de crear jerarquías de clases, se prefiere combinar pequeñas funciones independientes mediante composición para construir comportamientos complejos.

### Transductores (introducción breve)

Un transductor es una función que compone transformaciones sin crear colecciones intermedias. Por ejemplo, combinar `map` y `filter` en un solo paso eficiente.

```javascript
function compose(...fns) { /* ... */ }
const filter = pred => reducer => (acc, val) => pred(val) ? reducer(acc, val) : acc;
const map = fn => reducer => (acc, val) => reducer(acc, fn(val));

const transducir = compose(
  filter(x => x % 2 === 0),
  map(x => x * 10)
);

const push = (arr, val) => { arr.push(val); return arr; };
[1,2,3,4].reduce(transducir(push), []); // [20, 40]
```

Aunque es un tema avanzado, muestra el poder de la composición más allá de funciones básicas.

### Casos de uso reales

- **Redux** (y otros state managers): los middlewares y reducers se componen.
- **Librerías como Lodash/fp, Ramda**: fomentan currying y composición para flujos de datos inmutables.
- **React**: Componentes de orden superior (HOC) y hooks personalizados se basan en composición.
- **Validación de datos**: componer validadores atómicos para reglas complejas.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Closures aplicados](01-closures-aplicados.md) | [🏠 Inicio](../index.md) | [Proxy y reflect ▶](03-proxy-y-reflect.md) |
