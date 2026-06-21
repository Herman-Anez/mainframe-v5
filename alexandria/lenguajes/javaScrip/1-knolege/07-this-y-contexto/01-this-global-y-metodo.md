# This global y metodo

## El valor de `this` en JavaScript

`this` es una palabra clave especial en JavaScript que se refiere al **contexto de ejecución** de una función. A diferencia de otros lenguajes, su valor no se determina por la definición de la función (excepto en arrow functions), sino por **cómo se llama** la función. Esto se conoce como enlace dinámico (dynamic binding). El valor de `this` puede variar en cada invocación.

## `this` en el ámbito global

### En el navegador

En el ámbito de nivel superior de un script (modo no estricto), `this` apunta al objeto global: `window` en navegadores, `globalThis` en entornos modernos.

```javascript
console.log(this === window); // true (en navegador, modo no estricto)
```

En modo estricto y en módulos ES, `this` en el ámbito global es `undefined`.

```javascript
// En un módulo o en 'use strict' a nivel script
console.log(this); // undefined
```

### En Node.js

En el nivel superior de un módulo CommonJS, `this` apunta a `module.exports` (objeto vacío inicialmente), no al objeto global. En modo REPL, `this` se refiere al objeto global.

```javascript
// En un módulo de Node.js (CommonJS)
console.log(this === global); // false
console.log(this === module.exports); // true (inicialmente {})
```

En módulos ES de Node, el comportamiento es el mismo que en navegadores: `this` es `undefined` en el ámbito de nivel superior.

## `this` en funciones

### Llamada a función simple (no método)

Cuando una función se invoca directamente (sin un objeto que la preceda), el valor de `this` depende del modo:

- **Modo no estricto**: `this` es el objeto global (`window` o `global`).
- **Modo estricto**: `this` es `undefined`.

```javascript
function mostrarThis() {
  console.log(this);
}

mostrarThis(); // objeto global (no estricto), undefined (estricto)

// En modo estricto con 'use strict' dentro de la función
function estricta() {
  'use strict';
  console.log(this); // undefined
}
estricta();
```

Es crucial recordar: el `this` se fija en el momento de la invocación, no en la definición. Si se asigna la función a una variable y se llama, se considera una llamada simple.

```javascript
const obj = {
  metodo: function() { console.log(this); }
};
const fn = obj.metodo;
fn(); // objeto global / undefined (depende del modo)
```

Aquí la función no se invoca como método de `obj`, por lo que `this` no es `obj`. Es la forma de llamada lo que cuenta.

## `this` en métodos de objeto

Cuando una función se invoca como propiedad de un objeto (método), `this` apunta al objeto sobre el cual se hizo la llamada, es decir, el objeto que está a la izquierda del punto en el momento de la llamada.

```javascript
const persona = {
  nombre: 'Ana',
  saludar: function() {
    console.log(`Hola, soy ${this.nombre}`);
  }
};

persona.saludar(); // Hola, soy Ana
```

Incluso si la función fue definida en otro lugar, al invocarse como método de `persona`, `this` será `persona`.

```javascript
function saludar() {
  console.log(`Hola, soy ${this.nombre}`);
}

const persona1 = { nombre: 'Luis', saludar };
const persona2 = { nombre: 'María', saludar };

persona1.saludar(); // Hola, soy Luis
persona2.saludar(); // Hola, soy María
```

### Métodos en cadenas de prototipos

`this` sigue refiriéndose al objeto que invocó el método, incluso si el método está en el prototipo.

```javascript
const proto = {
  saludar() { console.log(`Hola, soy ${this.nombre}`); }
};
const obj = Object.create(proto);
obj.nombre = 'Juan';
obj.saludar(); // Hola, soy Juan
```

### Métodos con getters y setters

Los getters y setters también tienen su `this` ligado al objeto sobre el que se accede a la propiedad.

```javascript
const rectangulo = {
  ancho: 10,
  alto: 20,
  get area() { return this.ancho * this.alto; }
};
console.log(rectangulo.area); // 200
```

## Pérdida de contexto

El valor de `this` puede perderse fácilmente cuando se pasa un método como callback, porque la nueva llamada no se hace sobre el objeto original.

```javascript
const boton = {
  texto: 'Click',
  manejarClick: function() { console.log(this.texto); }
};

// Al pasar como callback a un evento
document.addEventListener('click', boton.manejarClick); // this = elemento que recibe el evento (o el documento según el evento)

// Solución: bind o arrow function
document.addEventListener('click', boton.manejarClick.bind(boton));
```

Otro caso común: dentro de `setTimeout`, el callback se ejecuta en un contexto global (o `undefined` en estricto). Nuevamente, `this` se pierde.

```javascript
const obj = {
  nombre: 'Timer',
  accion: function() {
    setTimeout(function() {
      console.log(this.nombre); // undefined (this es global/undefined)
    }, 100);
  }
};
obj.accion();
```

Para solucionarlo se utilizaban closures (`const self = this;`) o funciones flecha (que capturan léxicamente `this`). Hoy la función flecha es la opción moderna.

## `this` en constructores y clases

Cuando se utiliza `new` con una función constructora o clase, `this` apunta al nuevo objeto creado, pero este es un caso especial que se trata en profundidad en `04-new-y-constructores.md`.

## Resumen

| Contexto de llamada                     | Valor de `this`                                        |
|-----------------------------------------|--------------------------------------------------------|
| Ámbito global (script normal)           | Objeto global (`window`/`global`)                      |
| Ámbito global (módulo o strict)         | `undefined`                                            |
| Función simple (no método)              | Objeto global (no estricto) / `undefined` (estricto)   |
| Método de objeto `obj.fn()`             | El objeto `obj`                                        |
| Método de prototipo                     | El objeto sobre el que se invoca                       |
| Getter / setter                         | El objeto sobre el que se accede                       |
| Función pasada como callback            | Depende de quién invoque; típicamente global/undefined o el elemento del DOM |
| Constructor (`new`)                     | El nuevo objeto creado                                 |

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Abortcontroller](../06-asincronia/08-abortcontroller.md) | [🏠 Inicio](../index.md) | [Arrow functions y this ▶](02-arrow-functions-y-this.md) |
