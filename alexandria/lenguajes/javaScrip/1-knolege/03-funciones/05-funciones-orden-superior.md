# Funciones orden superior

## Funciones como ciudadanos de primera clase

En JavaScript, las funciones son objetos. Pueden:
- Asignarse a variables o propiedades.
- Pasarse como argumentos a otras funciones.
- Devolverse como resultado de otras funciones.
- Tener propiedades y métodos propios (como `call`, `bind`).

## Funciones de orden superior (Higher-Order Functions, HOF)

Una función se considera de orden superior si cumple **al menos una** de estas condiciones:
- Recibe una o más funciones como argumentos.
- Retorna una función.

### Recepción de funciones (callbacks)

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

### Retorno de funciones (factory functions)

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

### Composición de funciones

La composición permite combinar funciones pequeñas para formar otras más complejas. Dos funciones `f` y `g` se pueden componer como `f ∘ g` (f(g(x))).

```javascript
const compose = (f, g) => x => f(g(x));
const aMayusculas = str => str.toUpperCase();
const exclamar = str => str + "!";
const gritar = compose(exclamar, aMayusculas);
gritar("hola"); // "HOLA!"
```

Las utilidades `pipe` (inversa de `compose`) son comunes en programación funcional.

### Abstracción de patrones comunes

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

### Inversión de control

Al pasar callbacks, se cede parte del flujo de ejecución a otra función o biblioteca. Esto es poderoso, pero puede llevar al "callback hell" si se abusa de anidaciones. Las promesas y `async/await` mitigan este problema.

### Relación con programación funcional

Las HOF son piedra angular de un estilo declarativo. Junto con **inmutabilidad**, **transparencia referencial** y **evitación de efectos secundarios**, fomentan un código más predecible y testeable.

### Currificación y aplicación parcial como HOF

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

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Scope y closures](04-scope-y-closures.md) | [🏠 Inicio](../index.md) | [Iife y recursividad ▶](06-iife-y-recursividad.md) |
