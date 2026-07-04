## 01-objetos-literales.md

### Creación de objetos con notación literal

La notación literal de objeto `{}` es la forma más común y concisa de crear objetos en JavaScript. Consiste en un par de llaves que encierran cero o más pares clave-valor, donde las claves pueden ser identificadores, cadenas, números o expresiones computadas.

```javascript
const persona = {
  nombre: "Ana",
  edad: 30,
  "tiene-mascota": true, // clave con caracteres especiales
  saludar() {
    return `Hola, soy ${this.nombre}`;
  }
};
```

#### Claves (property keys)

- Las claves son **cadenas** (o **símbolos**). Si se omite el símbolo y se usa un identificador válido, JavaScript convierte el identificador a cadena.
- Para nombres no válidos como identificadores (con espacios, guiones, etc.), se usan comillas: `"mi-propiedad": valor`.
- Los números también se convierten a cadena; es decir, `1` y `"1"` son la misma clave.

#### Sintaxis abreviada (ES6)

Cuando el valor de una propiedad proviene de una variable con el mismo nombre, se puede omitir los dos puntos:

```javascript
const nombre = "Luis";
const edad = 28;
const usuario = { nombre, edad }; // equivalente a { nombre: nombre, edad: edad }
```

#### Métodos concisos

A partir de ES6, se puede definir un método directamente sin la palabra `function`:

```javascript
const obj = {
  metodo1() { /* ... */ },
  async metodo2() { /* ... */ },
  *generador() { /* ... */ }
};
```

Esto es equivalente a `metodo1: function() { ... }`, pero más corto y, en el caso de métodos que usen `super`, necesario para que `super` resuelva correctamente el prototipo.

#### Nombres de propiedad computados (computed property names)

Con corchetes `[expresión]`, la clave se determina en tiempo de ejecución:

```javascript
const prop = "dinamico";
const valor = 42;
const objeto = {
  [prop]: valor,
  ["clave" + 1]: "valor1"
};
// resultado: { dinamico: 42, clave1: "valor1" }
```

Útil para crear propiedades cuyo nombre depende de variables o funciones.

#### Propagación de objetos (Spread, ES2018)

El operador `...` dentro de un literal de objeto copia las propiedades enumerables propias de otro objeto:

```javascript
const base = { a: 1, b: 2 };
const copia = { ...base, c: 3 }; // { a: 1, b: 2, c: 3 }
const fusion = { ...base, b: 20 }; // { a: 1, b: 20 } (sobrescribe)
```

Realiza una copia superficial: los valores anidados se comparten por referencia.

#### Limitaciones de la notación literal

- No permite crear objetos con prototipo personalizado directamente (siempre hereda de `Object.prototype`).
- No se puede reutilizar como molde sin copiar y pegar; para eso existen clases o funciones constructoras.
- Los métodos definidos en el literal son propiedades propias, no compartidas mediante prototipo, lo que puede consumir más memoria si se crean muchas instancias manualmente.

#### Uso como configuraciones y registros

Los objetos literales son ideales para pasar opciones a funciones, modelar estructuras de datos simples o actuar como mapas de clave-valor (aunque `Map` puede ser más adecuado para claves no string).

---

## 02-propiedades-y-metodos.md

### Acceso a propiedades

JavaScript ofrece dos sintaxis para acceder a las propiedades de un objeto:

- **Notación de punto**: `objeto.propiedad` (la propiedad debe ser un identificador válido).
- **Notación de corchetes**: `objeto["propiedad"]` (la clave es una cadena o un símbolo; permite caracteres especiales y nombres dinámicos).

```javascript
const obj = { nombre: "Test", "clave-especial": 42 };
console.log(obj.nombre);          // "Test"
console.log(obj["clave-especial"]); // 42
const clave = "nombre";
console.log(obj[clave]);           // "Test" (dinámico)
```

Para acceder a símbolos, solo se usa notación de corchetes: `obj[Symbol.iterator]`.

### Comprobación de existencia de una propiedad

- **Operador `in`**: verifica si la propiedad existe en el objeto o en su cadena de prototipos.
  ```javascript
  if ("nombre" in persona) { /* ... */ }
  ```
- **`Object.hasOwn(obj, 'prop')`** (ES2022) o `obj.hasOwnProperty('prop')`: verifica propiedades propias, ignorando el prototipo.
  ```javascript
  Object.hasOwn(persona, 'nombre'); // true
  ```
- Comparación con `undefined` no es segura si la propiedad existe pero su valor es `undefined`.

### Propiedades de datos y propiedades de acceso

Las propiedades de un objeto pueden ser de dos tipos:

- **Propiedad de datos**: contiene un valor (`value`) y atributos `writable`, `enumerable`, `configurable`.
- **Propiedad de acceso**: definida mediante un getter y/o un setter.

#### Getters y setters (propiedades de acceso)

Se definen usando las palabras reservadas `get` y `set`. No se invocan como funciones; la lectura y asignación activan automáticamente el getter y setter.

```javascript
const persona = {
  _nombre: "María",
  get nombre() {
    console.log("Leyendo nombre");
    return this._nombre.toUpperCase();
  },
  set nombre(valor) {
    console.log("Asignando nombre");
    this._nombre = valor.trim();
  }
};

console.log(persona.nombre); // "MARÍA"
persona.nombre = "  Pedro  ";
console.log(persona._nombre); // "Pedro"
```

- Los getters no deben tener parámetros; los setters deben tener exactamente un parámetro.
- Se pueden definir tanto en literales como con `Object.defineProperty`.
- Un setter sin getter convierte la propiedad en "solo escritura" (poco común).
- Propiedades de acceso no tienen atributo `writable`; se gestionan con `configurable` y `enumerable`.

#### Métodos como propiedades

Un método es una propiedad cuyo valor es una función. En el interior, `this` se refiere al objeto que contiene el método (en una invocación `objeto.metodo()`). Si el método se asigna a una variable y se llama como función, `this` será `undefined` (en modo estricto) o el objeto global, lo que provoca pérdida de contexto.

```javascript
const obj = {
  valor: 5,
  duplicar() { return this.valor * 2; }
};
const fn = obj.duplicar;
fn(); // TypeError (no puede leer valor de undefined)
```

Para forzar el contexto, se usa `bind`, `call`, `apply` o funciones flecha.

### Métodos de Object.prototype heredados

Todo objeto derivado de `Object.prototype` hereda métodos como:
- `toString()`: devuelve `[object Object]`; puede sobrescribirse.
- `valueOf()`: devuelve el propio objeto; las subclases lo sobrescriben (Date, Number, etc.).
- `hasOwnProperty()`, `isPrototypeOf()`, `propertyIsEnumerable()`.

Es peligroso usarlos directamente si el objeto podría tener propiedades con esos nombres o un prototipo nulo. Solución: llamarlos desde `Object.prototype` con `.call()` o usar los equivalentes estáticos (`Object.hasOwn`).

### Borrado de propiedades

El operador `delete` elimina una propiedad propia del objeto. Devuelve `true` si la propiedad no existía o si se eliminó con éxito (excepto en propiedades no configurables o en modo estricto donde lanza error).

```javascript
delete obj.propiedad;
```

No afecta a propiedades heredadas; solo elimina la propiedad del propio objeto.

### Enumeración de propiedades

- `for...in` recorre propiedades enumerables, incluyendo heredadas (solo cadenas).
- `Object.keys()`: devuelve un array de claves propias enumerables (cadenas).
- `Object.values()`: devuelve un array de valores de propiedades propias enumerables.
- `Object.entries()`: devuelve pares `[clave, valor]` de propiedades propias enumerables.
- `Object.getOwnPropertyNames()`: claves propias (cadenas), enumerables o no.
- `Object.getOwnPropertySymbols()`: símbolos propios, enumerables o no.

---

## 03-descriptores-de-propiedad.md

### Atributos internos de una propiedad

Cada propiedad de un objeto posee atributos que controlan su comportamiento. Son:

- **`value`**: valor asociado (solo propiedades de datos).
- **`writable`**: si es `true`, el valor puede cambiarse.
- **`enumerable`**: si es `true`, aparece en iteraciones `for...in` y `Object.keys`.
- **`configurable`**: si es `true`, la propiedad puede eliminarse y sus atributos pueden modificarse (excepto `value` y `writable` cuando `configurable` es `false`, aunque en modo no estricto se puede redefinir `writable` de `true` a `false`).

Para propiedades de acceso:
- **`get`**: función getter.
- **`set`**: función setter.
- **`enumerable`** y **`configurable`**.

#### `Object.getOwnPropertyDescriptor(obj, prop)`

Devuelve un objeto descriptor con los atributos actuales de una propiedad propia.

```javascript
const obj = { x: 42 };
console.log(Object.getOwnPropertyDescriptor(obj, 'x'));
// { value: 42, writable: true, enumerable: true, configurable: true }
```

Para propiedades inexistentes o heredadas, devuelve `undefined`.

#### `Object.defineProperty(obj, prop, descriptor)`

Define o modifica una propiedad con los atributos especificados.

```javascript
const obj = {};
Object.defineProperty(obj, 'lectura', {
  value: 100,
  writable: false,
  enumerable: true,
  configurable: false
});
obj.lectura = 200; // en modo estricto TypeError, en no estricto falla silenciosamente
```

#### `Object.defineProperties(obj, props)`

Permite definir múltiples propiedades a la vez.

```javascript
Object.defineProperties(obj, {
  nombre: { value: "Luis", writable: true },
  id: { get() { return this._id; }, set(v) { this._id = v; } }
});
```

#### Comportamiento de `configurable`

Una vez que `configurable` se establece en `false`:
- No se puede volver a cambiar `configurable` a `true`.
- No se puede cambiar `enumerable`.
- No se puede cambiar entre propiedad de datos y de acceso.
- Si es propiedad de datos, `writable` puede cambiarse de `true` a `false`, pero no de `false` a `true`.
- `value` solo puede cambiarse si `writable` es `true`.
- La propiedad no puede eliminarse.

#### `Object.freeze(obj)` y `Object.seal(obj)`

- **`Object.seal(obj)`**: sella el objeto. Para cada propiedad propia, establece `configurable: false`. Impide agregar y eliminar propiedades. Las propiedades existentes pueden modificarse si son `writable`.
- **`Object.freeze(obj)`**: congela el objeto. Aplica `seal` y además pone `writable: false` en todas las propiedades de datos. El objeto y sus propiedades se vuelven inmutables (aunque los objetos anidados no se congelan automáticamente; se requiere congelación profunda).

Se puede verificar el estado con `Object.isSealed()` y `Object.isFrozen()`.

#### Casos de uso

- Crear constantes en objetos (propiedades de solo lectura).
- Definir propiedades internas no enumerables (por ejemplo, claves de caché).
- Proteger objetos de configuración.
- Implementar reactividad (combinado con Proxy).

---

## 04-prototipos.md

### El enlace interno `[[Prototype]]`

Cada objeto en JavaScript tiene un enlace interno denominado `[[Prototype]]` (accesible vía `__proto__` – propiedad histórica no estándar pero ampliamente soportada– y mediante `Object.getPrototypeOf()` / `Object.setPrototypeOf()`). Este enlace apunta a otro objeto o a `null`, formando la **cadena de prototipos**.

Cuando se intenta acceder a una propiedad que no existe en el objeto, el motor recorre la cadena de prototipos hacia arriba hasta encontrarla o llegar a `null`.

```javascript
const padre = { saludo: "Hola" };
const hijo = Object.create(padre);
console.log(hijo.saludo); // "Hola" (heredado)
console.log(hijo.hasOwnProperty('saludo')); // false
```

#### `Object.create(proto [, propertiesObject])`

Crea un nuevo objeto con el prototipo dado. Opcionalmente se pueden definir propiedades con descriptores. Es la forma pura de establecer la herencia sin funciones constructoras.

```javascript
const base = { tipo: "general" };
const especifico = Object.create(base, {
  nombre: { value: "Especial", writable: true }
});
```

Crear con `Object.create(null)` produce un objeto sin prototipo (sin métodos heredados como `toString`), útil para diccionarios limpios.

#### Prototipo en literales y constructores

- Un objeto literal `{ }` tiene como `[[Prototype]]` a `Object.prototype`.
- Un array literal `[ ]` tiene como prototipo `Array.prototype`, que a su vez hereda de `Object.prototype`.
- Una función tiene `Function.prototype`.

#### La propiedad `prototype` en funciones

**Solo las funciones** (excepto las flecha) poseen una propiedad `prototype` (objeto). No es el prototipo de la función misma, sino el objeto que se asignará como `[[Prototype]]` de las instancias creadas con `new` y esa función. Por tanto:

```javascript
function Constructor() {}
console.log(Constructor.prototype); // objeto con constructor apuntando a Constructor
const inst = new Constructor();
console.log(Object.getPrototypeOf(inst) === Constructor.prototype); // true
```

#### Modificación del prototipo

- **`Object.setPrototypeOf(obj, proto)`**: cambia el prototipo de un objeto existente. Operación costosa que desoptimiza el código; evite su uso en bucles críticos.
- **`Object.getPrototypeOf(obj)`**: obtiene el prototipo.
- La propiedad `__proto__` es un getter/setter en `Object.prototype`; no se recomienda su uso en código nuevo.

#### Sombreado (Shadowing)

Si se asigna un valor a una propiedad que existe en la cadena de prototipos, se crea una propiedad propia en el objeto que "sombrea" la del prototipo para lecturas posteriores.

```javascript
hijo.saludo = "Bonjour";
console.log(hijo.saludo);  // "Bonjour"
console.log(padre.saludo); // "Hola"
```

Si la propiedad heredada tiene `writable: false`, la asignación falla en modo estricto o se ignora silenciosamente.

#### Rendimiento y forma (hidden classes)

Los motores JavaScript optimizan el acceso a propiedades mediante "formas" o "clases ocultas". Modificar la cadena de prototipos o añadir muchas propiedades dinámicamente degrada el rendimiento.

---

## 05-herencia-prototipica.md

### Herencia basada en prototipos

JavaScript implementa herencia mediante la delegación de prototipos, sin clases tradicionales (aunque la sintaxis `class` es azúcar sobre este modelo). Un objeto puede heredar propiedades y métodos de otro objeto a través de la cadena de prototipos.

#### Funciones constructoras

Una función constructora se invoca con `new` y automáticamente:
1. Crea un nuevo objeto vacío cuyo `[[Prototype]]` apunta a `Funcion.prototype`.
2. `this` dentro de la función se vincula al nuevo objeto.
3. Al finalizar, si la función no retorna un objeto explícito, devuelve `this`.

```javascript
function Animal(nombre) {
  this.nombre = nombre;
}
Animal.prototype.saludar = function() {
  return `Soy ${this.nombre}`;
};
const perro = new Animal("Rex");
console.log(perro.saludar()); // "Soy Rex"
```

#### Encadenamiento de prototipos para herencia

Para que un "subtipo" herede de un "supertipo", se establece la cadena:

```javascript
function Perro(nombre, raza) {
  Animal.call(this, nombre); // invocar superconstructor
  this.raza = raza;
}
// Hacemos que Perro.prototype herede de Animal.prototype
Perro.prototype = Object.create(Animal.prototype);
// Corregimos la propiedad constructor (opcional pero buena práctica)
Perro.prototype.constructor = Perro;

Perro.prototype.ladrar = function() {
  return "Guau!";
};

const fido = new Perro("Fido", "Labrador");
console.log(fido.saludar()); // "Soy Fido" (heredado)
console.log(fido.ladrar());  // "Guau!"
```

#### `instanceof` y `isPrototypeOf`

- `obj instanceof Constructor` verifica si `Constructor.prototype` está en la cadena de prototipos de `obj`.
- `prototype.isPrototypeOf(obj)` comprueba si un objeto concreto está en la cadena.

#### Herencia con `Object.create()`

Alternativa directa sin constructores:

```javascript
const animal = {
  init(nombre) { this.nombre = nombre; },
  saludar() { return `Soy ${this.nombre}`; }
};

const perro = Object.create(animal);
perro.ladrar = function() { return "Guau"; };

const fido = Object.create(perro);
fido.init("Fido");
```

Este patrón (herencia puramente prototípica) fue popularizado por Douglas Crockford y evita el uso de `new`.

#### Propiedades y métodos estáticos vs de instancia

Las propiedades definidas en el prototipo son compartidas por todas las instancias, mientras que las definidas dentro del constructor (con `this.prop =`) son propias de cada instancia. Las propiedades en la función constructora misma (`Funcion.propEstatica`) no se heredan; son "estáticas" en el sentido de que pertenecen a la función, no a las instancias. Para emular herencia estática, se deben copiar explícitamente.

#### Problemas comunes y soluciones

- **Propiedades de referencia en el prototipo**: si se define un array u objeto en el prototipo, todas las instancias comparten la misma referencia. La solución es inicializar dichas propiedades en el constructor.
- **Herencia múltiple**: no soportada directamente. Se puede simular con mixins (copiando propiedades de varios objetos al prototipo) o usando composición.
- **Métodos privados**: antes de ES6 se simulaban con closures en el constructor; después, con `#` campos privados.

#### Comprobación de la cadena

- `Object.getPrototypeOf(inst)`.
- `inst.constructor` puede no ser confiable si no se corrigió después de la herencia.
- `Object.getOwnPropertyNames(prototype)` para inspeccionar métodos.

### Resumen de conceptos clave

| Concepto | Descripción |
|---|---|
| `[[Prototype]]` | Enlace interno de un objeto a su prototipo |
| `prototype` | Propiedad de funciones constructoras, usada para establecer el prototipo de instancias |
| `Object.create(proto)` | Crear objeto con prototipo específico |
| `Object.setPrototypeOf` | Modificar prototipo de un objeto existente |
| `new` | Crea instancia, llama al constructor, enlaza prototipo |
| `__proto__` | Acceso no estándar al prototipo (evitar en código nuevo) |
| Cadena de prototipos | Secuencia de objetos que termina en `null` |

---

## 06-funciones-constructoras.md

### Qué es una función constructora

Una función constructora es una función normal que se invoca con el operador `new`. Por convención, su nombre comienza con mayúscula. Su propósito es crear e inicializar objetos que comparten un prototipo común.

```javascript
function Persona(nombre, edad) {
  this.nombre = nombre;
  this.edad = edad;
}
const p = new Persona("Ana", 30);
```

### Mecanismo interno de `new`

Al ejecutar `new Persona(...)`, el motor realiza estos pasos:

1. Crea un objeto nuevo y vacío.
2. Establece el `[[Prototype]]` del nuevo objeto a `Persona.prototype`.
3. Invoca la función `Persona` con `this` enlazado al nuevo objeto.
4. Si la función retorna un **objeto** (incluyendo funciones, arrays, etc.), ese objeto se convierte en el resultado de `new` (ignorando el creado en el paso 1). Si retorna un valor primitivo o no hay `return`, el resultado es el objeto creado en el paso 1.

```javascript
function RetornaObjeto() { return { a: 1 }; }
new RetornaObjeto(); // { a: 1 }
```

### La propiedad `prototype`

Toda función (salvo las flecha) tiene una propiedad `prototype`, que es un objeto con una propiedad `constructor` que apunta a la propia función. Cuando se usa `new`, ese objeto se convierte en el prototipo de la nueva instancia.

```javascript
console.log(Persona.prototype.constructor === Persona); // true
const p1 = new Persona("Luis");
console.log(Object.getPrototypeOf(p1) === Persona.prototype); // true
```

**Importante:** la propiedad `prototype` **no** es el prototipo de la función; el prototipo de la función es `Function.prototype`.

### Añadir métodos al prototipo

Para que los métodos se compartan entre todas las instancias (y no se dupliquen por cada creación), se agregan al objeto `prototype`:

```javascript
Persona.prototype.saludar = function() {
  return `Hola, soy ${this.nombre}`;
};
```

Si se definen dentro del constructor (`this.saludar = function...`), cada instancia tendrá su propia copia, desperdiciando memoria.

### Emulación de miembros privados (pre-ES6)

Antes de los campos privados (`#`), se usaban closures en el ámbito del constructor para ocultar datos:

```javascript
function Contador() {
  let _valor = 0;               // privado
  this.inc = function() { return ++_valor; };
  this.getValor = function() { return _valor; };
}
```

Inconveniente: cada instancia crea nuevas funciones, aumentando el uso de memoria. Además, estas funciones no residen en el prototipo, lo que impide la optimización de métodos compartidos.

### `new.target`

Dentro de una función, `new.target` indica si la función fue llamada con `new`. Si fue invocada normalmente, su valor es `undefined`.

```javascript
function Vehiculo() {
  if (!new.target) {
    throw new Error("Debe usar 'new' para crear vehículos");
  }
}
```

Esto permite obligar el uso de `new` o implementar clases abstractas cuando `new.target === Vehiculo` (es decir, la clase base).

### Funciones flecha como constructores

Las arrow functions no poseen `[[Construct]]` ni propiedad `prototype`, por lo que no pueden usarse con `new`. Lanzarán un `TypeError`.

### Herencia con funciones constructoras

Aunque la sintaxis de clases es preferible hoy, el patrón clásico implica:

```javascript
function Empleado(nombre, departamento) {
  Persona.call(this, nombre);
  this.departamento = departamento;
}
Empleado.prototype = Object.create(Persona.prototype);
Empleado.prototype.constructor = Empleado;
Empleado.prototype.trabajar = function() {
  return `${this.nombre} trabaja en ${this.departamento}`;
};
```

### Limitaciones

- No hay manera fácil de hacer propiedades privadas sin closures.
- La sintaxis es más verbosa que `class`.
- La cadena de prototipos debe construirse manualmente.
- No existe herencia estática automática (se deben copiar las propiedades estáticas manualmente).

---

## 07-clases-es6.md

### Sintaxis de clase

La declaración `class` es azúcar sintáctico sobre la herencia prototípica. Aporta una sintaxis más clara y semántica.

```javascript
class Persona {
  constructor(nombre) {
    this.nombre = nombre;
  }

  saludar() {
    return `Hola, soy ${this.nombre}`;
  }

  static especie() {
    return "Homo sapiens";
  }
}
```

#### No hoisting

A diferencia de las declaraciones de función, las declaraciones de clase no sufren hoisting. Existe una zona muerta temporal (TDZ) hasta que se evalúa la declaración.

```javascript
const p = new Persona(); // ReferenceError: Cannot access 'Persona' before initialization
class Persona { /* ... */ }
```

#### Expresiones de clase

Pueden ser anónimas o tener nombre interno:

```javascript
const Rectangulo = class {
  constructor(alto, ancho) { this.alto = alto; this.ancho = ancho; }
};

const Factoria = class FactoriaInterna {
  // El nombre "FactoriaInterna" solo es visible dentro de la clase
};
```

#### Modo estricto automático

El código dentro del cuerpo de una clase siempre se ejecuta en modo estricto.

### Métodos

- **constructor**: opcional; si no se define, se usa uno vacío por defecto (`constructor() {}`). Solo puede haber uno; un duplicado genera `SyntaxError`.
- **Métodos prototípicos**: definidos sin `function`, se añaden a `Persona.prototype`.
- **Getters y setters**: como en objetos literales.
- **Métodos estáticos**: precedidos por `static`, se definen en la propia clase (no en las instancias). No pueden acceder a `this` de la instancia; su `this` es la clase misma.
- **Métodos generadores**: `*nombre() {}`; se convierten en métodos generadores en el prototipo.

### Herencia con `extends` y `super`

```javascript
class Empleado extends Persona {
  constructor(nombre, departamento) {
    super(nombre);               // llama al constructor padre
    this.departamento = departamento;
  }

  saludar() {
    return `${super.saludar()} del departamento ${this.departamento}`;
  }
}
```

- **`super` como función**: en el constructor de la subclase, debe llamarse a `super()` antes de usar `this`.
- **`super` como objeto**: permite acceder a métodos del prototipo padre (en métodos de instancia) y a métodos estáticos del padre (en métodos estáticos).
- En métodos estáticos, `super` referencia la clase padre.
- Las subclases heredan estáticos automáticamente.

#### `extends` con funciones constructoras y nativos

`extends` funciona con cualquier expresión que devuelva un constructor (incluso funciones constructoras antiguas o clases nativas como `Array`, `Error`). Al extender `Array`, se debe usar `super()` y se heredan correctamente `length` y los métodos.

#### Symbol.species

`Array`, `Map`, `Set`, etc., usan `Symbol.species` para que métodos como `map()` o `slice()` creen instancias de la subclase en lugar de la clase base.

```javascript
class MiArray extends Array {
  static get [Symbol.species]() { return Array; } // fuerza que devuelvan Array normal
}
```

### Clases como primer ciudadano

Las clases son valores; se pueden pasar como argumentos, devolver de funciones, etc. La herencia puede basarse en expresiones.

### Mixins con clases

Mediante una función que toma una clase base y devuelve una subclase, se pueden añadir funcionalidades:

```javascript
const Cronometrado = Base => class extends Base {
  logTiempo() { console.timeLog(...); }
};
class Tarea extends Cronometrado(Persona) { /* ... */ }
```

---

## 08-campos-privados-y-estaticos.md

### Campos de clase públicos

Definen propiedades propias en cada instancia sin necesidad de asignarlas en el constructor. Se sitúan fuera de cualquier método.

```javascript
class Rectangulo {
  alto = 10;          // campo público
  ancho = 20;
  constructor(alto, ancho) {
    if (alto !== undefined) this.alto = alto;
    if (ancho !== undefined) this.ancho = ancho;
  }
}
```

Se pueden declarar sin inicializar (valor `undefined`). La inicialización ocurre antes del cuerpo del constructor (en orden de declaración), después de `super()`.

### Campos privados (Private Fields)

Los identificadores con `#` al principio crean campos verdaderamente privados, inaccesibles fuera de la clase.

```javascript
class CuentaBancaria {
  #saldo = 0;

  constructor(saldoInicial) {
    this.#saldo = saldoInicial;
  }

  depositar(monto) {
    this.#saldo += monto;
  }

  get saldo() {
    return this.#saldo;
  }
}

const c = new CuentaBancaria(100);
console.log(c.#saldo); // SyntaxError (no se puede acceder)
```

- El nombre incluye la almohadilla: `#saldo`. Se escribe `this.#saldo` dentro de la clase.
- No se pueden crear campos privados dinámicamente; deben declararse.
- Son invisibles para `Object.keys()`, `JSON.stringify()`, `Proxy`, etc.
- No pueden tener inicializadores diferidos que dependan de `this` sin estar en el constructor (se evalúan antes del constructor, salvo que dependan de argumentos).

#### Métodos privados

También con `#`. Se pueden declarar como funciones o getters/setters.

```javascript
class Logger {
  #log(mensaje) {
    console.log(`[LOG]: ${mensaje}`);
  }

  info(msg) {
    this.#log(msg);
  }
}
```

#### Campos estáticos (públicos y privados)

```javascript
class Config {
  static version = "1.0.0";
  static #instancias = 0; // estático privado

  constructor() {
    Config.#instancias++;
  }
}
```

- Los campos estáticos públicos se definen con `static` y se acceden como `Clase.propiedad`.
- Los estáticos privados solo pueden usarse dentro de la clase.

### Orden de inicialización

1. Campos de instancia públicos y privados se inicializan antes de la ejecución del cuerpo del constructor (inmediatamente después de `super()` en subclases).
2. El constructor ejecuta el resto del código.

### Consideraciones de compatibilidad

Los campos privados (ES2022) están soportados en todos los navegadores modernos y Node.js a partir de la versión 12 con bandera, y plenamente desde 14+.

---

## 09-metodos-de-object.md

### `Object.keys(obj)`

Retorna un array con las **claves propias enumerables** (como cadenas) del objeto.

```javascript
const obj = { a: 1, b: 2 };
Object.keys(obj); // ["a", "b"]
```

No incluye propiedades de la cadena de prototipos ni símbolos.

### `Object.values(obj)`

Devuelve un array con los valores de las propiedades propias enumerables.

```javascript
Object.values({ a: 1, b: 2 }); // [1, 2]
```

### `Object.entries(obj)`

Devuelve un array de pares `[clave, valor]` propios enumerables.

```javascript
Object.entries({ a: 1, b: 2 }); // [["a",1], ["b",2]]
```

Muy útil para iterar con `for...of` o para construir `Map`.

### `Object.assign(target, ...sources)`

Copia todas las propiedades **propias enumerables** de los objetos fuente al objeto destino. Devuelve el destino.

```javascript
const destino = { a: 1 };
Object.assign(destino, { b: 2 }, { c: 3 });
// destino: { a:1, b:2, c:3 }
```

- Es una **copia superficial**: los objetos anidados se comparten por referencia.
- Los getters de las fuentes se ejecutan y se asigna el valor resultante, no el getter.
- No copia símbolos no enumerables ni propiedades de la cadena.

Se usa para clonar superficialmente: `const copia = Object.assign({}, original);`

### `Object.freeze(obj)`

Congela el objeto: impide añadir, eliminar o modificar propiedades. Las propiedades existentes se vuelven `writable: false` y `configurable: false`.

```javascript
const obj = Object.freeze({ x: 10 });
obj.x = 20; // no tiene efecto (en modo estricto TypeError)
```

Devuelve el mismo objeto (no una copia). La congelación es superficial; los objetos anidados permanecen mutables. Para congelación profunda, se requiere una función recursiva.

Se puede comprobar con `Object.isFrozen(obj)`.

### `Object.seal(obj)`

Sella el objeto: no se pueden añadir ni eliminar propiedades, pero las existentes pueden modificarse si son `writable`. Internamente pone `configurable: false` a todas las propiedades.

```javascript
const obj = { y: 2 };
Object.seal(obj);
delete obj.y; // false, no se borra
obj.y = 10;   // funciona si writable: true
```

`Object.isSealed(obj)` comprueba el estado.

### `Object.is(value1, value2)`

Compara dos valores con el algoritmo `SameValue`. Es similar a `===`, pero trata `NaN` y los ceros con signo de manera diferente:

```javascript
Object.is(NaN, NaN);      // true (=== da false)
Object.is(+0, -0);        // false (=== da true)
Object.is(0, -0);         // false
```

### `Object.hasOwn(obj, prop)`

Introducido en ES2022. Retorna `true` si el objeto tiene la propiedad como propia, sin importar si es enumerable o no. Evita problemas de `obj.hasOwnProperty` cuando el objeto puede tener una propiedad llamada `hasOwnProperty` o un prototipo nulo.

```javascript
const obj = { foo: 1 };
Object.hasOwn(obj, 'foo'); // true
Object.hasOwn(obj, 'toString'); // false
```

### `Object.fromEntries(iterable)`

Construye un objeto a partir de un iterable de pares clave-valor (como el que devuelve `Object.entries`).

```javascript
const entries = [['nombre', 'Luis'], ['edad', 25]];
Object.fromEntries(entries); // { nombre: 'Luis', edad: 25 }
```

Perfecto para transformar objetos o para convertir `Map` a objeto.

### `Object.getOwnPropertyDescriptors(obj)`

Devuelve un objeto con todos los descriptores de propiedades propias. Esencial para copiar getters/setters y atributos exactos.

```javascript
const fuente = { get x() { return 1; } };
const copia = Object.defineProperties({}, Object.getOwnPropertyDescriptors(fuente));
```

### `Object.preventExtensions(obj)`, `Object.isExtensible(obj)`

- `preventExtensions` impide que se agreguen nuevas propiedades al objeto (las existentes se pueden modificar o eliminar).
- `isExtensible` verifica si es posible añadir propiedades.

### `Object.getOwnPropertyNames(obj)`

Todas las claves propias (cadenas), enumerables o no.

### `Object.getOwnPropertySymbols(obj)`

Todos los símbolos propios, enumerables o no.

---

## 10-destructuring.md

### Desestructuración de arrays

Asigna elementos de un array a variables discretas en una sola sentencia.

```javascript
const [a, b, c] = [1, 2, 3];
console.log(a, b, c); // 1 2 3
```

- **Ignorar elementos**: `const [primero, , tercero] = arr;`
- **Valores por defecto**: si el elemento es `undefined`, se aplica el valor por defecto.
  ```javascript
  const [x = 0, y = 0] = [5];
  console.log(x, y); // 5, 0
  ```
- **Rest pattern**: `...` recoge el resto de elementos en un array.
  ```javascript
  const [cabeza, ...cola] = [1,2,3,4];
  console.log(cabeza, cola); // 1, [2,3,4]
  ```
  El rest debe ser el último elemento.

### Desestructuración de objetos

Asigna propiedades de un objeto a variables con el mismo nombre, o renombradas.

```javascript
const { nombre, edad } = { nombre: "Ana", edad: 30 };
console.log(nombre, edad); // Ana 30
```

- **Alias**: `const { nombre: n } = obj;` asigna la propiedad `nombre` a la variable `n`.
- **Valores por defecto**: `const { telefono = "N/A" } = obj;`
- **Rest**: `const { a, ...resto } = { a:1, b:2, c:3 };` (resto será `{ b:2, c:3 }`). El rest en objetos (ES2018) recoge las propiedades restantes en un nuevo objeto.
- **Anidamiento**:
  ```javascript
  const { dir: { calle } } = { dir: { calle: "Calle Mayor", numero: 10 } };
  console.log(calle); // "Calle Mayor"
  ```

#### Desestructuración en parámetros de función

Muy útil para opciones:

```javascript
function configurar({ color = 'azul', modo = 'estricto' } = {}) {
  // ...
}
configurar({ color: 'rojo' });
```

Si no se proporciona argumento, el valor por defecto `= {}` evita un error al desestructurar `undefined`.

### Swapping y aplicaciones avanzadas

Intercambiar variables sin variable temporal:

```javascript
let a = 1, b = 2;
[a, b] = [b, a];
```

Retornos múltiples (simulados con arrays/objetos):

```javascript
function division(a, b) {
  return [a / b, a % b];
}
const [cociente, resto] = division(10, 3);
```

### Desestructuración con iterables

Cualquier iterable puede ser desestructurado como array:

```javascript
const [primero, segundo] = new Set([10, 20, 30]);
```

### Desestructuración con expresiones y objetos anidados

Permite extraer valores de estructuras profundas de forma concisa, aunque la legibilidad puede verse afectada si se abusa.

---

## 11-json.md

### `JSON.stringify(valor, replacer?, espacio?)`

Convierte un valor JavaScript a una cadena JSON.

- **Tipos soportados**: objetos, arrays, strings, números, booleanos y `null`. Se omiten las funciones, los `undefined` y los símbolos. Los `Date` se convierten a string ISO. Los `NaN` y `Infinity` se convierten en `null`.
- **Objetos con referencias circulares** lanzan `TypeError`.
- **Replacer**: puede ser una función `(clave, valor)` que permite transformar o filtrar propiedades. También puede ser un array de claves (strings) a incluir.
- **Espacio**: número (indentación con espacios) o string (usado como indentación).

```javascript
const data = { nombre: "Ana", edad: 30, password: "secreto" };
const json = JSON.stringify(data, (key, value) => {
  if (key === "password") return undefined; // excluye
  return value;
}, 2);
```

#### Método `toJSON` en objetos

Si un objeto tiene un método `toJSON`, `stringify` llama a ese método y serializa el valor retornado en lugar del objeto completo. Útil para personalizar la representación.

```javascript
const evento = {
  titulo: "Conferencia",
  fecha: new Date(),
  toJSON() {
    return { titulo: this.titulo, fecha: this.fecha.toISOString() };
  }
};
JSON.stringify(evento); // {"titulo":"Conferencia","fecha":"2025-01-01T00:00:00.000Z"}
```

### `JSON.parse(texto, reviver?)`

Convierte una cadena JSON a un valor JavaScript.

- Si el JSON es inválido, lanza `SyntaxError`.
- **Reviver**: función `(clave, valor)` que transforma cada valor después de parsear. Se ejecuta recursivamente de lo más interno a lo más externo.

```javascript
const cadena = '{"titulo":"Conferencia","fecha":"2025-01-01T00:00:00.000Z"}';
const obj = JSON.parse(cadena, (key, value) => {
  if (key === "fecha") return new Date(value);
  return value;
});
console.log(obj.fecha instanceof Date); // true
```

### Limitaciones y precauciones

- **Pérdida de información**: no conserva tipos como `undefined`, `function`, `symbol`, `Infinity`, `NaN`.
- **Fechas**: se convierten en cadenas, se necesita reviver para reconstruirlas.
- **Propiedades no enumerables**: no se serializan.
- **Clonación profunda**: se puede simular con `JSON.parse(JSON.stringify(obj))`, pero con las limitaciones mencionadas (no sirve con Map, Set, funciones, etc.).
- **Objetos con prototipo personalizado**: se convierten en objetos planos, perdiendo la herencia.

### Buenas prácticas

- Validar siempre las cadenas JSON de fuentes externas con `JSON.parse` envuelto en `try/catch`.
- Usar `replacer` para excluir datos sensibles.
- Para estructuras complejas, considerar serializadores alternativos o librerías.
- No usar `JSON.stringify` para comparación profunda de objetos debido a la falta de orden garantizado en las claves. `Object.entries` y ordenamiento pueden ayudar.

---

Con estos temas se completa el dominio del manejo de objetos y clases en JavaScript, desde los fundamentos de constructores hasta la serialización moderna. Cada archivo de esta sección proporciona las herramientas para escribir código robusto, eficiente y mantenible.

---

