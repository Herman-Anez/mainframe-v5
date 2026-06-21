# New y constructores

## El operador `new`

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

### `new.target`

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

## Funciones constructoras y `prototype`

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

## Retorno explícito desde una función constructora

- Si la función retorna un **objeto** (incluye arrays, funciones, etc.), ese objeto se convierte en el resultado de `new`, y el `this` original se descarta.
- Si retorna un valor primitivo (o no hay `return`), se devuelve el nuevo objeto creado.

```javascript
function A() { this.a = 1; return { b: 2 }; }
console.log(new A()); // { b: 2 }

function B() { this.a = 1; return 'ignorado'; }
console.log(new B()); // B { a: 1 }
```

Este comportamiento rara vez se usa, pero es importante conocerlo para no retornar accidentalmente un objeto.

## Herencia con `new` y `Object.create`

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

## `new` con clases ES6

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

## Simulación de `new` manualmente

Para comprender el mecanismo, se puede implementar un `new` rudimentario:

```javascript
function miNew(constructor, ...args) {
  const obj = Object.create(constructor.prototype);
  const resultado = constructor.apply(obj, args);
  return (typeof resultado === 'object' && resultado !== null) ? resultado : obj;
}
```

## Errores comunes

- Olvidar `new`: llamar a una función constructora sin `new` hace que `this` sea el objeto global (o `undefined` en estricto), provocando contaminación global o errores.
- Usar funciones flecha como constructoras: las funciones flecha no tienen `[[Construct]]`, por lo que `new` lanza `TypeError`.

## Resumen

- `new` crea un objeto, enlaza su prototipo a `Funcion.prototype`, asigna `this` y ejecuta el constructor.
- El control del retorno permite devolver un objeto alternativo, pero normalmente se confía en el retorno implícito.
- `new.target` permite verificar si la función fue llamada con `new`.
- El patrón con `prototype` es la base de la herencia prototípica y fue la norma antes de las clases.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Call apply bind](03-call-apply-bind.md) | [🏠 Inicio](../index.md) | [Seleccion del dom ▶](05-seleccion-del-dom.md) |
