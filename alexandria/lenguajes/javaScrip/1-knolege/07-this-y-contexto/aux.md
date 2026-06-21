## 01-this-global-y-metodo.md

### El valor de `this` en JavaScript

`this` es una palabra clave especial en JavaScript que se refiere al **contexto de ejecución** de una función. A diferencia de otros lenguajes, su valor no se determina por la definición de la función (excepto en arrow functions), sino por **cómo se llama** la función. Esto se conoce como enlace dinámico (dynamic binding). El valor de `this` puede variar en cada invocación.

### `this` en el ámbito global

#### En el navegador

En el ámbito de nivel superior de un script (modo no estricto), `this` apunta al objeto global: `window` en navegadores, `globalThis` en entornos modernos.

```javascript
console.log(this === window); // true (en navegador, modo no estricto)
```

En modo estricto y en módulos ES, `this` en el ámbito global es `undefined`.

```javascript
// En un módulo o en 'use strict' a nivel script
console.log(this); // undefined
```

#### En Node.js

En el nivel superior de un módulo CommonJS, `this` apunta a `module.exports` (objeto vacío inicialmente), no al objeto global. En modo REPL, `this` se refiere al objeto global.

```javascript
// En un módulo de Node.js (CommonJS)
console.log(this === global); // false
console.log(this === module.exports); // true (inicialmente {})
```

En módulos ES de Node, el comportamiento es el mismo que en navegadores: `this` es `undefined` en el ámbito de nivel superior.

### `this` en funciones

#### Llamada a función simple (no método)

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

### `this` en métodos de objeto

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

#### Métodos en cadenas de prototipos

`this` sigue refiriéndose al objeto que invocó el método, incluso si el método está en el prototipo.

```javascript
const proto = {
  saludar() { console.log(`Hola, soy ${this.nombre}`); }
};
const obj = Object.create(proto);
obj.nombre = 'Juan';
obj.saludar(); // Hola, soy Juan
```

#### Métodos con getters y setters

Los getters y setters también tienen su `this` ligado al objeto sobre el que se accede a la propiedad.

```javascript
const rectangulo = {
  ancho: 10,
  alto: 20,
  get area() { return this.ancho * this.alto; }
};
console.log(rectangulo.area); // 200
```

### Pérdida de contexto

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

### `this` en constructores y clases

Cuando se utiliza `new` con una función constructora o clase, `this` apunta al nuevo objeto creado, pero este es un caso especial que se trata en profundidad en `04-new-y-constructores.md`.

### Resumen

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

---

## 02-arrow-functions-y-this.md

### `this` léxico en funciones flecha

Las funciones flecha **no tienen su propio `this`**. En su lugar, capturan el valor de `this` del ámbito léxico que las envuelve en el momento de su definición. Esto resuelve de raíz muchos problemas de pérdida de contexto.

```javascript
const objeto = {
  nombre: 'Flecha',
  metodo: function() {
    const flecha = () => {
      console.log(this.nombre);
    };
    flecha();
  }
};
objeto.metodo(); // Flecha (this heredado del método tradicional que apunta a objeto)
```

El `this` de la flecha es el mismo que el de `metodo` en el momento en que `metodo` es invocado. Si `metodo` se llama como método de `objeto`, `this` es `objeto`, por lo que la flecha hereda ese valor. Este comportamiento es fijo y no cambia aunque la función flecha se pase como callback o se invoque de otra forma.

### Enlace estático

A diferencia de las funciones tradicionales, el `this` de una flecha no puede ser sobrescrito con `call`, `apply` o `bind`. Cualquier intento será ignorado (aunque `bind` devuelve una nueva función cuyo `this` sigue estando bloqueado al valor original de la flecha).

```javascript
const flecha = () => console.log(this);
flecha.call({ a: 1 }); // ignora el objeto, imprime el this léxico (global/undefined)
```

Por eso, las funciones flecha **no son adecuadas** para métodos que requieran `this` dinámico (por ejemplo, métodos de objetos literales o de prototipos cuando se espera que `this` sea la instancia). Tampoco pueden ser constructores, porque no poseen la propiedad interna `[[Construct]]`.

### Casos de uso ideales

#### Callbacks dentro de métodos

```javascript
class Contador {
  constructor() {
    this.cuenta = 0;
  }
  iniciar() {
    setInterval(() => {
      this.cuenta++; // this es la instancia de Contador
    }, 1000);
  }
}
```

Sin la flecha, `this` dentro de `setInterval` sería el objeto global (o `undefined`), por lo que tradicionalmente se asignaba `this` a una variable (`var self = this;`). Con la flecha, se captura el `this` correcto del método.

#### Mapeo y filtrado con funciones de array

```javascript
const grupo = {
  descuento: 0.1,
  precios: [100, 200, 300],
  preciosConDescuento() {
    return this.precios.map(precio => precio * (1 - this.descuento));
  }
};
console.log(grupo.preciosConDescuento()); // [90, 180, 270]
```

La flecha dentro de `map` captura el `this` de `preciosConDescuento`, que es `grupo`. Si se usara una función tradicional, habría que capturar `this` o usar `bind`.

### No usar arrow functions como métodos de objeto

El siguiente código falla porque la flecha toma el `this` del ámbito donde se define el objeto, no del propio objeto:

```javascript
const mal = {
  nombre: 'Mal',
  saludar: () => `Hola ${this.nombre}`
};
console.log(mal.saludar()); // Hola undefined (this es el global o undefined)
```

`this` está capturado del ámbito léxico donde se define el objeto literal (que puede ser global u otro contexto). No apunta al objeto `mal`. Para métodos de objeto, deben usarse funciones tradicionales o la sintaxis concisa de método (que es una función tradicional).

### `this` en funciones flecha anidadas

Si una flecha se define dentro de otra flecha, hereda el mismo `this` que su ancestro más cercano con un `this` propio, o el ámbito léxico global.

```javascript
const obj = {
  metodo: function() {
    const flecha1 = () => {
      const flecha2 = () => console.log(this);
      flecha2();
    };
    flecha1();
  }
};
obj.metodo(); // this = obj
```

No importa cuántas capas de anidamiento: todas las flechas comparten el mismo `this` del contexto donde fueron definidas.

### `this` en propiedades de clase (class fields) con arrow functions

Al definir un campo de clase con una función flecha, esta se convierte en una propiedad de instancia. Su `this` se vincula al objeto que se construye.

```javascript
class Componente {
  estado = 'activo';
  manejarClick = () => {
    console.log(this.estado);
  };
}
const comp = new Componente();
comp.manejarClick(); // activo
```

Esto es útil para pasar el método como callback sin preocuparse por la pérdida de contexto. Sin embargo, cada instancia tendrá su propia copia de la función, consumiendo más memoria que un método compartido en el prototipo.

---

## 03-call-apply-bind.md

### Modificación explícita del contexto

JavaScript proporciona tres métodos para invocar funciones estableciendo un valor de `this` específico. Pertenecen a `Function.prototype` y son: `call`, `apply` y `bind`.

### `call(thisArg, ...args)`

Invoca la función **inmediatamente** con un `this` dado y los argumentos proporcionados uno a uno.

```javascript
function saludar(saludo, signo) {
  console.log(`${saludo}, ${this.nombre}${signo}`);
}
const persona = { nombre: 'Ana' };
saludar.call(persona, 'Hola', '!'); // Hola, Ana!
```

- `thisArg` puede ser cualquier valor. Si es `null` o `undefined`, en modo no estricto se reemplaza por el objeto global; en modo estricto, se usa tal cual.
- Para primitivos como `thisArg` (ej. `5`), se realiza un auto-boxing a su objeto envoltorio (`Number`).

### `apply(thisArg, [args])`

Similar a `call`, pero los argumentos se pasan como un array (o array-like).

```javascript
saludar.apply(persona, ['Buenos días', ' :)']); // Buenos días, Ana :)
```

`apply` es útil cuando los argumentos ya están en forma de array, o para funciones como `Math.max`:

```javascript
const numeros = [1, 5, 2, 9];
console.log(Math.max.apply(null, numeros)); // 9
```

Hoy en día, con el operador spread (`Math.max(...numeros)`), `apply` ha perdido protagonismo, pero sigue siendo relevante en contextos donde no se dispone de spread (ej. algunos entornos antiguos) o en algunos patrones.

### `bind(thisArg, ...args)`

A diferencia de `call`/`apply`, `bind` **no ejecuta la función**. Devuelve una **nueva función** con `this` permanentemente enlazado al valor dado. Los argumentos adicionales se fijan parcialmente (aplicación parcial).

```javascript
const personaSaludar = saludar.bind(persona, 'Hey');
personaSaludar('!!'); // Hey, Ana!!
```

- El enlace de `this` es definitivo; llamar a `call` o `apply` sobre la función resultante no cambiará su `this`.
- `bind` puede usarse para crear funciones con parámetros prefijados:
  ```javascript
  function multiplicar(a, b) { return a * b; }
  const duplicar = multiplicar.bind(null, 2);
  console.log(duplicar(5)); // 10
  ```
- Las propiedades `name` y `length` de la función devuelta se ajustan: `name` se prefija con "bound "; `length` es la cantidad de parámetros que aún esperan valor (los restantes después de los fijados), hasta donde sea posible determinar.

#### `bind` y funciones flecha

Como ya se mencionó, las funciones flecha tienen un `this` léxico que no se puede cambiar. Si se usa `bind` sobre una flecha, se devolverá una nueva función, pero su `this` seguirá siendo el mismo de la flecha original. `bind` simplemente fija argumentos adicionales (aplicación parcial), pero el `this` no se ve afectado.

```javascript
const flecha = () => console.log(this);
const enlazada = flecha.bind({ a: 1 });
enlazada(); // this sigue siendo el léxico, no {a:1}
```

### Casos de uso prácticos

#### Préstamo de métodos (method borrowing)

Se puede usar un método de un objeto sobre otro objeto similar usando `call` o `apply`.

```javascript
const arrayLike = { 0: 'a', 1: 'b', length: 2 };
Array.prototype.slice.call(arrayLike); // ['a', 'b']
```

#### Herencia en funciones constructoras (pre-ES6)

Para llamar al constructor padre en una jerarquía de constructores:

```javascript
function Padre(nombre) {
  this.nombre = nombre;
}
function Hijo(nombre, edad) {
  Padre.call(this, nombre);
  this.edad = edad;
}
```

#### Binding para callbacks asíncronos

```javascript
class Logger {
  constructor(nombre) {
    this.nombre = nombre;
  }
  log(mensaje) {
    console.log(`[${this.nombre}] ${mensaje}`);
  }
}
const logger = new Logger('App');
setTimeout(logger.log.bind(logger, 'Inicio'), 100);
```

#### Aplicación parcial (partial application)

`bind` permite prefijar argumentos, creando funciones más específicas sin necesidad de envoltorios.

```javascript
const log = console.log.bind(console, 'DEBUG:');
log('Mensaje'); // DEBUG: Mensaje
```

### Diferencias entre `call`/`apply` y `bind`

| Método    | Ejecución       | Retorna                      | `this` queda fijo |
|-----------|-----------------|------------------------------|-------------------|
| `call`    | Inmediata       | El valor de retorno de la función | No (solo esa llamada) |
| `apply`   | Inmediata       | El valor de retorno de la función | No (solo esa llamada) |
| `bind`    | Diferida        | Nueva función con `this` enlazado | Sí (permanente)   |

---

## 04-new-y-constructores.md

### El operador `new`

El operador `new` permite crear instancias de objetos a partir de funciones constructoras o clases. Modifica el comportamiento de una función y establece automáticamente el valor de `this` para que apunte al nuevo objeto.

Cuando se invoca `new Funcion(...)`, el motor realiza estos pasos:

1. **Crear un nuevo objeto vacío**: `{}`, con su `[[Prototype]]` apuntando a `Funcion.prototype`.
2. **Establecer `this`**: dentro de la función constructora, `this` se enlaza al nuevo objeto creado.
3. **Ejecutar el cuerpo de la función**: normalmente se inicializan propiedades en `this`.
4. **Retorno implícito**: si la función no devuelve un objeto explícitamente, el resultado de `new` es el nuevo objeto creado. Si la función devuelve un objeto, ese objeto reemplaza al creado en el paso 1. Si retorna un primitivo, se ignora y se devuelve el nuevo objeto.

```javascript
function Persona(nombre) {
  // 2. this = {}
  // 3. this.__proto__ = Persona.prototype (realizado antes)
  this.nombre = nombre;
  // 4. retorno implícito: this
}
const p = new Persona('Luis');
console.log(p.nombre); // Luis
console.log(Object.getPrototypeOf(p) === Persona.prototype); // true
```

#### `new.target`

Dentro de una función constructora, `new.target` hace referencia a la función que fue invocada con `new`, o `undefined` si la llamada fue normal.

```javascript
function Vehiculo() {
  if (!new.target) {
    throw new Error('Debe usar new para crear vehículos');
  }
  console.log('new.target:', new.target.name);
}
new Vehiculo(); // new.target: Vehiculo
// Vehiculo(); // lanza Error
```

`new.target` es útil para forzar el uso de `new`, evitar invocaciones accidentales y para implementar clases abstractas (verificar que `new.target === ClaseBase` y lanzar error si es el caso).

### Funciones constructoras y `prototype`

Toda función (excepto las flecha) tiene una propiedad `prototype`. Este objeto será el prototipo de las instancias creadas con `new`. Por defecto, `prototype` es un objeto con una única propiedad `constructor` que apunta de vuelta a la función.

```javascript
function Animal() {}
console.log(Animal.prototype.constructor === Animal); // true
```

Los métodos compartidos por todas las instancias se agregan a `prototype`:

```javascript
Animal.prototype.saludar = function() {
  return `Soy un ${this.tipo}`;
};
const perro = new Animal();
perro.tipo = 'perro';
console.log(perro.saludar()); // Soy un perro
```

### Retorno explícito desde una función constructora

- Si la función retorna un **objeto** (incluye arrays, funciones, etc.), ese objeto se convierte en el resultado de `new`, y el `this` original se descarta.
- Si retorna un valor primitivo (o no hay `return`), se devuelve el nuevo objeto creado.

```javascript
function A() { this.a = 1; return { b: 2 }; }
console.log(new A()); // { b: 2 }

function B() { this.a = 1; return 'ignorado'; }
console.log(new B()); // B { a: 1 }
```

Este comportamiento rara vez se usa, pero es importante conocerlo para no retornar accidentalmente un objeto.

### Herencia con `new` y `Object.create`

Para implementar herencia antes de ES6, se combinaba `new` con la asignación del prototipo:

```javascript
function Empleado(nombre, departamento) {
  Persona.call(this, nombre); // invocar superconstructor
  this.departamento = departamento;
}
Empleado.prototype = Object.create(Persona.prototype);
Empleado.prototype.constructor = Empleado;
Empleado.prototype.trabajar = function() {
  return `${this.nombre} trabaja`;
};
```

Al usar `new Empleado(...)` se crea un objeto cuyo prototipo es `Empleado.prototype`, que a su vez hereda de `Persona.prototype`. `Persona.call` asegura que las propiedades de `Persona` se asignen a la instancia.

### `new` con clases ES6

Las clases abstraen estos pasos. `new` sigue operando de la misma manera, pero la sintaxis es más clara:

```javascript
class Persona {
  constructor(nombre) { this.nombre = nombre; }
  saludar() { return `Hola ${this.nombre}`; }
}
const p = new Persona('Eva');
```

Internamente, `new` con una clase:
- No puede ser llamado sin `new` (lanza `TypeError`).
- `this` antes de `super()` en una subclase no está disponible.
- Los métodos de la clase son no enumerables.

### Simulación de `new` manualmente

Para comprender el mecanismo, se puede implementar un `new` rudimentario:

```javascript
function miNew(constructor, ...args) {
  const obj = Object.create(constructor.prototype);
  const resultado = constructor.apply(obj, args);
  return (typeof resultado === 'object' && resultado !== null) ? resultado : obj;
}
```

### Errores comunes

- Olvidar `new`: llamar a una función constructora sin `new` hace que `this` sea el objeto global (o `undefined` en estricto), provocando contaminación global o errores.
- Usar funciones flecha como constructoras: las funciones flecha no tienen `[[Construct]]`, por lo que `new` lanza `TypeError`.

### Resumen

- `new` crea un objeto, enlaza su prototipo a `Funcion.prototype`, asigna `this` y ejecuta el constructor.
- El control del retorno permite devolver un objeto alternativo, pero normalmente se confía en el retorno implícito.
- `new.target` permite verificar si la función fue llamada con `new`.
- El patrón con `prototype` es la base de la herencia prototípica y fue la norma antes de las clases.

---
## 01-seleccion-del-dom.md

### El Modelo de Objetos del Documento (DOM)

El DOM es una representación en memoria, en forma de árbol, del documento HTML. Cada elemento, atributo, texto y comentario es un **nodo**. JavaScript puede acceder y manipular estos nodos mediante la API del DOM proporcionada por el navegador. El punto de entrada principal es el objeto `document`.

### Selección de elementos

Existen métodos tradicionales y modernos para obtener referencias a nodos del DOM.

#### `document.getElementById(id)`

Devuelve un único elemento cuyo atributo `id` coincide exactamente con la cadena proporcionada. Si no existe, retorna `null`.

```javascript
const principal = document.getElementById('principal');
```

- El `id` debe ser único en el documento. Si hay duplicados, el comportamiento es impredecible (suele devolver el primero encontrado).
- Es muy rápido porque los navegadores mantienen un mapa interno de IDs.

#### `document.getElementsByClassName(nombres)`

Devuelve una **HTMLCollection** viva de elementos que tienen todas las clases especificadas (separadas por espacios). Se puede buscar en todo el documento o en un elemento concreto.

```javascript
const especiales = document.getElementsByClassName('destacado');
const sub = document.getElementById('contenedor').getElementsByClassName('item');
```

- **HTMLCollection viva**: si el DOM cambia, la colección se actualiza automáticamente.
- No es un array; carece de métodos como `forEach` (aunque en navegadores modernos se puede usar `for...of`). Se puede convertir a array con `Array.from()`.

#### `document.getElementsByTagName(tag)`

Devuelve una HTMLCollection viva de elementos con el nombre de etiqueta dado (ej. `'div'`, `'p'`). `*` selecciona todos los elementos.

```javascript
const todosDivs = document.getElementsByTagName('div');
```

#### `document.getElementsByName(nombre)`

Devuelve una **NodeList viva** (en la mayoría de navegadores) de elementos cuyo atributo `name` coincide. Útil para formularios (`<input name="email">`).

```javascript
const generos = document.getElementsByName('genero');
```

#### `document.querySelector(selectorCSS)`

Retorna el **primer** elemento que coincida con el selector CSS proporcionado. Si no hay coincidencia, devuelve `null`.

```javascript
const primerParrafo = document.querySelector('p');
const activo = document.querySelector('.menu .activo');
```

Admite cualquier selector CSS válido, incluyendo pseudoclases (`:hover`, `:first-child`) y selectores de atributo. Es el método más versátil.

#### `document.querySelectorAll(selectorCSS)`

Retorna una **NodeList estática** con todos los elementos que coinciden con el selector CSS.

```javascript
const todosLosItems = document.querySelectorAll('.item');
```

- La NodeList no es viva: no se actualiza si el DOM cambia.
- Puede iterarse con `forEach`, `for...of`, y convertirse a array con `Array.from()`.
- `querySelectorAll` puede llamarse sobre cualquier elemento, limitando la búsqueda a sus descendientes.

```javascript
const contenedor = document.getElementById('lista');
const items = contenedor.querySelectorAll('li');
```

### Colecciones vivas vs estáticas

| Método                           | Tipo de colección | Viva | Iterable moderno |
|----------------------------------|-------------------|------|------------------|
| `getElementsByClassName`         | HTMLCollection    | Sí   | Sí (`for...of`)  |
| `getElementsByTagName`           | HTMLCollection    | Sí   | Sí               |
| `getElementsByName`              | NodeList (viva)   | Sí   | Sí               |
| `querySelectorAll`               | NodeList estática | No   | Sí               |
| `querySelector`                  | Element o null    | N/A  | N/A              |
| `getElementById`                 | Element o null    | N/A  | N/A              |

Las colecciones vivas pueden ser problemáticas si se itera sobre ellas mientras se modifica el DOM: pueden causar bucles infinitos o saltarse elementos. Para evitarlo, se puede hacer una copia estática con `Array.from()` o `querySelectorAll`.

### Búsqueda dentro de un elemento

Todos los métodos excepto `getElementById` pueden invocarse sobre un elemento para restringir la búsqueda a sus descendientes.

```javascript
const seccion = document.getElementById('seccion1');
const items = seccion.getElementsByClassName('item');
```

`getElementById` solo existe en `document`, no en elementos. La razón es que los IDs deben ser únicos en todo el documento.

### Recorriendo el árbol del DOM

A veces no se usan selectores, sino que se navega directamente por las relaciones del árbol.

- **Padre/Hijo**: `parentNode`, `parentElement`, `children`, `firstChild`, `lastChild`, `firstElementChild`, `lastElementChild`.
- **Hermanos**: `nextSibling`, `previousSibling`, `nextElementSibling`, `previousElementSibling`.
- **Todos los nodos**: `childNodes` (incluye texto y comentarios).
- **Solo elementos**: `children` (HTMLCollection viva).

```javascript
const lista = document.querySelector('ul');
const primerHijo = lista.firstElementChild;
const siguiente = primerHijo.nextElementSibling;
```

### Métodos de comprobación

- `matches(selector)`: verifica si el elemento cumple con un selector CSS. Retorna `true`/`false`.
- `closest(selector)`: busca el ancestro más cercano (o el propio elemento) que coincida con el selector. Muy útil para delegación de eventos.
- `contains(node)`: comprueba si un nodo es descendiente de otro.

```javascript
if (elemento.matches('.activo')) { /* ... */ }
const padre = elemento.closest('.contenedor');
```

### Consejos de rendimiento

- Preferir `getElementById` y `querySelector`/`querySelectorAll` para búsquedas puntuales.
- Evitar consultas muy amplias (`document.querySelectorAll('*')`) o selectores complejos en bucles.
- Cachear referencias a elementos del DOM que se usen repetidamente.
- Las colecciones vivas pueden impactar el rendimiento si se abusa de ellas.

---

## 02-manipulacion-del-dom.md

### Manipular contenido

#### `textContent`

Obtiene o establece el contenido de texto de un nodo y todos sus descendientes. Descarta cualquier etiqueta HTML. Es más rápido que `innerHTML` porque no fuerza el parseo de HTML.

```javascript
const parrafo = document.querySelector('p');
console.log(parrafo.textContent);
parrafo.textContent = 'Nuevo texto <b>no se renderizará como HTML</b>';
```

#### `innerHTML`

Obtiene o establece el contenido HTML de un elemento como cadena. Al asignar, parsea el HTML y construye nuevos nodos. Es potente pero puede ser peligroso si se inserta contenido no sanitizado (XSS).

```javascript
const div = document.getElementById('contenido');
div.innerHTML = '<h2>Título</h2><p>Párrafo</p>';
```

- Leer `innerHTML` devuelve una representación serializada que puede no ser idéntica al DOM original (los navegadores pueden ajustar mayúsculas, comillas, etc.).
- Reasignar `innerHTML` destruye todos los nodos hijos previos y sus manejadores de eventos.

#### `insertAdjacentHTML(posicion, texto)`

Inserta HTML relativo al elemento sin destruir el contenido existente. Posiciones: `'beforebegin'`, `'afterbegin'`, `'beforeend'`, `'afterend'`.

```javascript
elemento.insertAdjacentHTML('beforeend', '<p>Nuevo párrafo</p>');
```

Es más eficiente que `innerHTML += ...` porque no serializa ni reconstruye todo el contenido previo.

### Creación y eliminación de elementos

#### Crear elementos

```javascript
const nuevoDiv = document.createElement('div');
nuevoDiv.textContent = 'Soy un div';
nuevoDiv.classList.add('caja');
```

#### Insertar elementos

- `parent.appendChild(nuevo)`: añade al final.
- `parent.insertBefore(nuevo, referencia)`: inserta antes de un hijo existente.
- `parent.replaceChild(nuevo, viejo)`: reemplaza.
- `element.remove()`: elimina el propio elemento (ES5 no lo tiene; en entornos antiguos se usa `parent.removeChild(element)`).
- `parent.append(nodo, ...)` y `parent.prepend(nodo, ...)`: métodos modernos (aceptan múltiples nodos y texto, no funcionan en IE).

```javascript
const lista = document.querySelector('ul');
const li = document.createElement('li');
li.textContent = 'Item nuevo';
lista.append(li); // añade al final
```

#### Clonar nodos

`element.cloneNode(deep?)`: si `deep` es `true`, clona todos los descendientes; si es `false`, solo el elemento.

```javascript
const copia = elemento.cloneNode(true);
```

No copia los event listeners añadidos con `addEventListener`. Los atributos `onclick` sí se copian.

### Manipular atributos y propiedades

- `element.getAttribute('data-id')` / `setAttribute('data-id', '123')` / `removeAttribute()`.
- Para atributos estándar es más eficiente usar las propiedades del DOM: `element.id`, `element.href`, `element.checked`, `element.value`.
- `dataset`: acceso a atributos `data-*` como `element.dataset.id`.
- `classList`: manejo de clases CSS (ver sección de estilos).

### Uso de `DocumentFragment`

Es un nodo contenedor ligero que no forma parte del DOM activo. Muy útil para ensamblar múltiples nodos sin disparar reflows/repaints por cada inserción.

```javascript
const fragment = document.createDocumentFragment();
for (let i = 0; i < 1000; i++) {
  const li = document.createElement('li');
  li.textContent = `Item ${i}`;
  fragment.appendChild(li);
}
lista.appendChild(fragment); // una sola inserción en el DOM
```

### Rendimiento y reflows

Cada modificación del DOM puede forzar un reflow (cálculo de layout) y repaint. Para minimizarlo:
- Realizar operaciones de lectura/escritura del DOM de forma agrupada.
- Usar `DocumentFragment` o construir el HTML como cadena y luego insertarlo con `insertAdjacentHTML`.
- Desvincular el elemento del árbol (`display:none` o `visibility:hidden`) antes de hacer múltiples cambios y luego volver a añadirlo.

### Seguridad: Prevención de XSS

Nunca insertar directamente datos provenientes del usuario o de fuentes no confiables con `innerHTML`. En su lugar, usar `textContent` o sanitizar el HTML con bibliotecas como DOMPurify.

---

## 03-eventos-y-delegacion.md

### Modelo de eventos

El DOM tiene un sistema de eventos basado en la **observación** de sucesos (click, teclado, carga, etc.) en elementos. Para manejar eventos, se registran funciones **listeners** o **handlers** en elementos específicos.

#### Registro de manejadores

Método moderno: `addEventListener`.

```javascript
const boton = document.getElementById('btn');
boton.addEventListener('click', function(event) {
  console.log('Click!', event);
});
```

- Se pueden registrar múltiples manejadores para el mismo evento.
- El tercer argumento opcional puede ser un objeto de opciones (`{ capture, once, passive }`) o un booleano (`useCapture`).

#### Eliminar manejadores: `removeEventListener`

Debe pasarse la misma función (referencia) que se registró.

```javascript
function handler(e) { /* ... */ }
boton.addEventListener('click', handler);
boton.removeEventListener('click', handler);
```

#### Objeto `Event`

El callback recibe un objeto `event` con propiedades útiles:
- `type`: tipo de evento (`'click'`, `'keydown'`, etc.).
- `target`: el elemento que originó el evento (el que fue clicado).
- `currentTarget`: el elemento que tiene el manejador actual (útil en delegación).
- `preventDefault()`: cancela la acción por defecto (ej. seguir un enlace).
- `stopPropagation()`: detiene la propagación del evento a ancestros.
- `stopImmediatePropagation()`: detiene la propagación y evita que otros manejadores en el mismo elemento se ejecuten.

#### Fases del evento: Captura y Burbujeo

Cuando se dispara un evento en un elemento, pasa por tres fases:
1. **Fase de captura**: el evento desciende desde el `document` hasta el `target`.
2. **Fase objetivo**: el evento llega al `target`.
3. **Fase de burbujeo**: el evento asciende desde el `target` hasta el `document`.

Por defecto, los manejadores se registran en la fase de burbujeo. Para capturarlos en la fase de captura, se usa `addEventListener(..., true)` o `{ capture: true }`.

### Delegación de eventos

Técnica que aprovecha el burbujeo para manejar eventos en un ancestro común, en lugar de adjuntar manejadores a cada elemento hijo. Es esencial para listas dinámicas.

```javascript
const lista = document.getElementById('lista');
lista.addEventListener('click', function(event) {
  const li = event.target.closest('li');
  if (!li) return; // no se hizo clic en un <li>
  console.log('Clic en', li.textContent);
});
```

Ventajas:
- Menos manejadores en memoria.
- Funciona automáticamente para elementos añadidos después de registrar el manejador.
- Código más sencillo de mantener.

El `closest` permite asegurarse de que el clic ocurrió en un `li` o en un descendiente del `li`.

#### `event.target` vs `event.currentTarget`

En delegación:
- `event.target`: el elemento más anidado que recibió el evento (ej. un `<span>` dentro del `<li>`).
- `event.currentTarget`: el elemento donde se registró el manejador (la `lista`).

#### Eventos que no burbujean

Algunos eventos, como `focus`, `blur`, `mouseenter`, `mouseleave`, no burbujean. Para delegarlos hay que usar sus versiones que sí burbujean: `focusin`, `focusout` (pero no todos los navegadores antiguos las soportan; hoy en día son estándar). `mouseenter`/`mouseleave` no burbujean; `mouseover`/`mouseout` sí.

### Opciones modernas de `addEventListener`

- **`once: true`**: el manejador se ejecuta una sola vez y se autoelimina.
- **`passive: true`**: indica que el manejador nunca llamará a `preventDefault()`. Mejora el rendimiento en eventos como `scroll` y `touchstart`.
- **`capture: true`**: registra en fase de captura.
- **`signal`**: un `AbortSignal` para eliminar el manejador fácilmente.

```javascript
const controller = new AbortController();
document.addEventListener('click', handler, { signal: controller.signal });
// Luego:
controller.abort(); // elimina el manejador
```

### Prevención de la acción por defecto y propagación

- `event.preventDefault()`: cancela el comportamiento nativo asociado al evento (ej. navegación de un enlace, envío de formulario).
- `event.stopPropagation()`: evita que el evento continúe propagándose a ancestros. Se debe usar con moderación, ya que puede romper delegación o otros manejadores.
- `event.stopImmediatePropagation()`: además de detener la propagación, evita que otros manejadores del mismo elemento se ejecuten.

### Manejo de teclado y formularios

- `keydown`, `keypress`, `keyup`: en `event.key` se obtiene la tecla presionada.
- `input`: se dispara cada vez que cambia el valor de un `<input>`, `<select>`, `<textarea>`. Alternativa a `keydown` para campos de texto.
- `change`: se dispara al cambiar el valor y perder el foco (para inputs) o al seleccionar una opción (select).

---

## 04-formularios-y-validacion.md

### Acceso a formularios y elementos

El DOM ofrece colecciones para acceder a formularios:

```javascript
const primerForm = document.forms[0]; // o document.forms['nombreForm']
const campo = form.elements['email']; // o form.email
```

Cada formulario tiene una propiedad `elements` que es una colección de todos los campos (inputs, selects, textareas, buttons, etc.).

### Eventos del formulario

- **`submit`**: se dispara al enviar el formulario (ya sea por botón `submit` o por `Enter` en un campo). Es donde se valida. Se puede cancelar con `preventDefault()` para manejar el envío con JavaScript (AJAX).
- **`reset`**: se dispara al presionar un botón de tipo `reset`.
- **`input`**: en cada cambio de valor de un campo.
- **`change`**: al cambiar y perder el foco.
- **`focus` / `blur`** y sus versiones burbujeantes `focusin`/`focusout`.

### Propiedades importantes de los campos

- `value`: contenido actual (string).
- `checked`: para radio/checkbox (booleano).
- `selectedOptions`: para `<select multiple>`.
- `disabled`: deshabilita el campo.
- `readOnly`: solo lectura.
- `name`: nombre del campo usado en el envío.

### Validación del lado del cliente

#### Validación con la API de Constraint Validation

Cada campo de formulario implementa la interfaz `ValidityState`, expuesta mediante la propiedad `validity`. Además, métodos como `checkValidity()` y `reportValidity()` permiten validar.

Atributos HTML que activan validación nativa:
- `required`: campo obligatorio.
- `minlength`, `maxlength`: longitud mínima/máxima para texto.
- `min`, `max`: valores numéricos.
- `pattern`: expresión regular.
- `type`: email, url, number, date, etc. ya incluyen validación de formato.

```html
<input type="email" name="correo" required>
<input type="number" min="18" max="99">
<input type="text" pattern="[A-Z]{3}-\d{4}">
```

#### Estados de validez (`validity`)

La propiedad `validity` es un objeto con booleanos:
- `valueMissing`: está vacío pero es `required`.
- `typeMismatch`: no cumple el formato del tipo (ej. email).
- `patternMismatch`: no coincide con el `pattern`.
- `tooShort` / `tooLong`: `minlength` / `maxlength`.
- `rangeUnderflow` / `rangeOverflow`: `min` / `max`.
- `badInput`: el navegador no puede interpretar el valor (ej. número mal formado).
- `stepMismatch`: no cumple con el paso (`step`).
- `valid`: `true` si no hay ningún error.

#### Personalizar mensajes de error

Se puede usar `setCustomValidity('mensaje')` para forzar un error personalizado. Si se pasa cadena vacía, se limpia.

```javascript
campo.addEventListener('input', function() {
  if (campo.value === 'admin') {
    campo.setCustomValidity('El nombre "admin" está reservado');
  } else {
    campo.setCustomValidity('');
  }
});
```

#### Validación en el evento `submit`

```javascript
formulario.addEventListener('submit', function(event) {
  if (!formulario.checkValidity()) {
    event.preventDefault();
    // Opcional: mostrar burbujas de error con reportValidity()
    formulario.reportValidity();
  }
  // Si es válido, proceder con envío por fetch o similar
});
```

### Envío con JavaScript (AJAX)

Para enviar datos sin recargar la página:

```javascript
formulario.addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = new FormData(formulario);
  try {
    const response = await fetch('/api/registro', {
      method: 'POST',
      body: formData // FormData establece el Content-Type adecuado
    });
    const resultado = await response.json();
    // manejar resultado
  } catch (error) {
    console.error('Error', error);
  }
});
```

`FormData` también puede construirse desde cero: `new FormData(); formData.append('clave', 'valor');`

### Buenas prácticas

- Siempre validar del lado del cliente y del lado del servidor.
- No confiar solo en la validación HTML5; implementar también lógica en JavaScript para mayor control visual y compatibilidad.
- Usar `reportValidity()` en lugar de `checkValidity()` para mostrar al usuario el primer error.
- Al usar `FormData`, recordar que los campos `disabled` no se incluyen.
- Deshabilitar el botón de envío durante el envío para evitar duplicados.

---

## 05-estilos-y-clases-css.md

### Modificar el atributo `style`

Cada elemento tiene una propiedad `style` que es un objeto `CSSStyleDeclaration`. Permite leer y modificar estilos en línea.

```javascript
const div = document.querySelector('.caja');
div.style.backgroundColor = 'blue';
div.style.fontSize = '16px';
div.style.marginTop = '10px';
```

- Las propiedades CSS con guiones se escriben en camelCase (`background-color` → `backgroundColor`).
- Asignar un valor modifica el estilo en línea del elemento, que tiene la mayor especificidad (salvo `!important`).
- Para eliminar un estilo en línea, se puede asignar `''` o usar `removeProperty('propiedad')`.
- La propiedad `style.cssText` permite establecer todo el estilo en línea en una cadena, sobreescribiendo los estilos existentes.
- Leer `div.style.color` solo devuelve el estilo en línea; no los estilos aplicados mediante CSS externo. Para eso se usa `getComputedStyle`.

#### `getComputedStyle(elemento)`

Devuelve el valor computado de todas las propiedades CSS, considerando estilos heredados, hojas de estilo, etc. Es un objeto de solo lectura.

```javascript
const estilo = getComputedStyle(div);
console.log(estilo.fontSize); // '16px' (puede ser la que el navegador calculó)
```

### Clases CSS: `classList`

La propiedad `classList` proporciona una interfaz más potente que `className` (que es un string).

- `classList.add('clase1', 'clase2')`: añade clases.
- `classList.remove('clase')`: elimina.
- `classList.toggle('clase', force?)`: alterna la clase; si `force` es `true`, la añade; si `false`, la elimina.
- `classList.contains('clase')`: comprueba existencia.
- `classList.replace('antigua', 'nueva')`: reemplaza una clase.

```javascript
elemento.classList.add('activo');
elemento.classList.toggle('visible', someCondition);
```

### Manipular hojas de estilos

Aunque es poco común, se pueden manipular las hojas de estilo directamente vía `document.styleSheets`.

```javascript
const sheet = document.styleSheets[0];
sheet.insertRule('body { background: red; }', sheet.cssRules.length);
sheet.deleteRule(index);
```

Sin embargo, para la mayoría de los casos, es más sencillo alternar clases o modificar variables CSS.

### Variables CSS (Custom Properties)

Se pueden definir en CSS (`--mi-color: red;`) y manipular desde JavaScript.

```javascript
// Obtener valor
const color = getComputedStyle(elemento).getPropertyValue('--mi-color');

// Modificar en el elemento (afecta sus descendientes)
elemento.style.setProperty('--mi-color', 'blue');
```

Ideal para temas dinámicos (cambio de paleta).

### Animaciones y transiciones

- Se pueden activar transiciones añadiendo/quitando clases.
- Para ser notificado cuando una transición CSS termina, se usa el evento `transitionend`.
- Para animaciones CSS, `animationend`, `animationstart`, `animationiteration`.

```javascript
element.addEventListener('transitionend', () => {
  console.log('Transición terminada');
});
```

### Rendimiento

- Preferir cambios de clase a modificar múltiples estilos en línea; los cambios de clase pueden ser optimizados por el motor.
- Agrupar lecturas y escrituras de estilos para evitar reflows forzados.
- Al cambiar el diseño (posición, dimensiones) se dispara reflow (costoso). Cambiar `transform` y `opacity` solo causan repaint y pueden ser acelerados por GPU.

---

## 06-web-storage.md

El almacenamiento web permite guardar pares clave-valor en el navegador del usuario. Existen dos mecanismos principales: `localStorage` y `sessionStorage`. Ambos forman parte de la API de Web Storage y almacenan solo cadenas. Para objetos complejos, se usa `JSON.stringify` / `JSON.parse`.

### `localStorage`

- Persiste incluso después de cerrar el navegador y reiniciar el sistema.
- El límite suele ser de 5-10 MB por origen (depende del navegador).
- Es accesible desde todas las pestañas y ventanas del mismo origen.
- Es síncrono: bloquea el hilo principal si se guardan grandes cantidades.

#### Métodos

```javascript
localStorage.setItem('clave', 'valor');
const valor = localStorage.getItem('clave');
localStorage.removeItem('clave');
localStorage.clear(); // elimina todo
const numItems = localStorage.length;
const claveIndice = localStorage.key(0); // obtiene la clave en la posición
```

#### Iteración

```javascript
for (let i = 0; i < localStorage.length; i++) {
  const clave = localStorage.key(i);
  const valor = localStorage.getItem(clave);
  console.log(clave, valor);
}

// Alternativa: Object.entries
Object.entries(localStorage).forEach(([clave, valor]) => {
  // ...
});
```

#### Evento `storage`

Cuando `localStorage` se modifica desde **otra página** del mismo origen, se dispara el evento `storage` en las demás pestañas/ventanas. No se dispara en la página que realizó el cambio.

```javascript
window.addEventListener('storage', function(e) {
  console.log(e.key, e.oldValue, e.newValue, e.url);
});
```

### `sessionStorage`

- Los datos duran mientras la pestaña/ventana esté abierta. Si se cierra la pestaña, se pierden.
- Cada pestaña tiene su propio `sessionStorage`, aislado de otras del mismo origen.
- La API es idéntica a `localStorage` (`setItem`, `getItem`, etc.).
- El límite es similar (5-10 MB).
- No lanza el evento `storage` porque los cambios son locales a la pestaña.

### Almacenamiento de objetos

Como solo admite cadenas, hay que serializar:

```javascript
const config = { tema: 'oscuro', idioma: 'es' };
localStorage.setItem('config', JSON.stringify(config));

// Leer
const configGuardada = JSON.parse(localStorage.getItem('config'));
```

Siempre verificar que el valor no sea `null` antes de parsear.

### Cookies

Aunque no son parte de "Web Storage", conviene mencionarlas.

- Se pueden leer/crear mediante `document.cookie`.
- Tienen caducidad, se pueden configurar como `HttpOnly`, `Secure`, `SameSite`.
- Se envían al servidor con cada petición HTTP, por lo que no son eficientes para almacenamiento local grande.

```javascript
document.cookie = 'usuario=Juan; max-age=3600; path=/; secure; samesite=lax';
```

Para manipular cookies de forma más robusta, se recomienda usar bibliotecas o la API `CookieStore` (moderna, aún con soporte limitado).

### IndexedDB

Para almacenamiento más complejo y de mayor volumen, se utiliza **IndexedDB**. Es una base de datos NoSQL, transaccional, que usa índices y permite almacenar objetos JavaScript estructurados, incluso archivos. Es asíncrona (basada en eventos) y puede manejar grandes cantidades de datos.

Ejemplo básico con promesas (usando la API nativa con eventos o la librería `idb` que la envuelve en promesas):

```javascript
// Abrir base de datos
const request = indexedDB.open('MiBase', 1);
request.onupgradeneeded = (e) => {
  const db = e.target.result;
  const store = db.createObjectStore('usuarios', { keyPath: 'id' });
  store.createIndex('nombre', 'nombre', { unique: false });
};

request.onsuccess = (e) => {
  const db = e.target.result;
  const tx = db.transaction('usuarios', 'readwrite');
  const store = tx.objectStore('usuarios');
  store.add({ id: 1, nombre: 'Ana' });
};
```

Con async/await, se recomienda la envoltura `idb` (npm install idb). Para producción, `localforage` es una biblioteca que unifica `localStorage`, `IndexedDB` y `WebSQL` con una API simple.

### Comparación de opciones de almacenamiento

| Característica       | localStorage      | sessionStorage   | Cookies          | IndexedDB          |
|----------------------|-------------------|------------------|------------------|---------------------|
| Capacidad            | ~5-10 MB          | ~5-10 MB         | ~4 KB            | Cientos de MB o más |
| Persistencia         | Indefinida        | Hasta cerrar pestaña | Configurable    | Indefinida          |
| Accesible desde      | Cualquier pestaña | Solo la pestaña  | Cualquier pestaña (mismo dominio) | Cualquier pestaña |
| Envío al servidor    | No                | No               | En cada petición | No                  |
| API                  | Síncrona          | Síncrona         | Síncrona         | Asíncrona (eventos/promesas) |
| Tipos de datos       | Solo cadenas      | Solo cadenas     | Solo cadenas     | Objetos, archivos, etc. |

### Buenas prácticas

- No almacenar información sensible en Web Storage, ya que es vulnerable a XSS.
- Capturar excepciones al escribir en `localStorage/sessionStorage`; en modo incógnito o cuando se supera la cuota, puede lanzar `QuotaExceededError`.
- Utilizar `JSON.stringify/parse` para objetos, recordando que no preserva funciones ni tipos complejos.
- Para datos de configuración o tokens de sesión, considerar cookies seguras (`HttpOnly`, `Secure`, `SameSite`) o `sessionStorage` según corresponda.
- Para grandes volúmenes o búsquedas complejas, `IndexedDB` es la opción adecuada.

