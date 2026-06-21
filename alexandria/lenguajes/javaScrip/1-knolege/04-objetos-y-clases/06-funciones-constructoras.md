# Funciones constructoras

## Qué es una función constructora

Una función constructora es una función normal que se invoca con el operador `new`. Por convención, su nombre comienza con mayúscula. Su propósito es crear e inicializar objetos que comparten un prototipo común.

```javascript
function Persona(nombre, edad) {
  this.nombre = nombre;
  this.edad = edad;
}
const p = new Persona("Ana", 30);
```

## Mecanismo interno de `new`

Al ejecutar `new Persona(...)`, el motor realiza estos pasos:

1. Crea un objeto nuevo y vacío.
2. Establece el `[[Prototype]]` del nuevo objeto a `Persona.prototype`.
3. Invoca la función `Persona` con `this` enlazado al nuevo objeto.
4. Si la función retorna un **objeto** (incluyendo funciones, arrays, etc.), ese objeto se convierte en el resultado de `new` (ignorando el creado en el paso 1). Si retorna un valor primitivo o no hay `return`, el resultado es el objeto creado en el paso 1.

```javascript
function RetornaObjeto() { return { a: 1 }; }
new RetornaObjeto(); // { a: 1 }
```

## La propiedad `prototype`

Toda función (salvo las flecha) tiene una propiedad `prototype`, que es un objeto con una propiedad `constructor` que apunta a la propia función. Cuando se usa `new`, ese objeto se convierte en el prototipo de la nueva instancia.

```javascript
console.log(Persona.prototype.constructor === Persona); // true
const p1 = new Persona("Luis");
console.log(Object.getPrototypeOf(p1) === Persona.prototype); // true
```

> [!IMPORTANT]
> **Importante:** la propiedad `prototype` **no** es el prototipo de la función; el prototipo de la función es `Function.prototype`.

## Añadir métodos al prototipo

Para que los métodos se compartan entre todas las instancias (y no se dupliquen por cada creación), se agregan al objeto `prototype`:

```javascript
Persona.prototype.saludar = function() {
  return `Hola, soy ${this.nombre}`;
};
```

Si se definen dentro del constructor (`this.saludar = function...`), cada instancia tendrá su propia copia, desperdiciando memoria.

## Emulación de miembros privados (pre-ES6)

Antes de los campos privados (`#`), se usaban closures en el ámbito del constructor para ocultar datos:

```javascript
function Contador() {
  let _valor = 0;               // privado
  this.inc = function() { return ++_valor; };
  this.getValor = function() { return _valor; };
}
```

Inconveniente: cada instancia crea nuevas funciones, aumentando el uso de memoria. Además, estas funciones no residen en el prototipo, lo que impide la optimización de métodos compartidos.

## `new.target`

Dentro de una función, `new.target` indica si la función fue llamada con `new`. Si fue invocada normalmente, su valor es `undefined`.

```javascript
function Vehiculo() {
  if (!new.target) {
    throw new Error("Debe usar 'new' para crear vehículos");
  }
}
```

Esto permite obligar el uso de `new` o implementar clases abstractas cuando `new.target === Vehiculo` (es decir, la clase base).

## Funciones flecha como constructores

Las arrow functions no poseen `[[Construct]]` ni propiedad `prototype`, por lo que no pueden usarse con `new`. Lanzarán un `TypeError`.

## Herencia con funciones constructoras

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

## Limitaciones

- No hay manera fácil de hacer propiedades privadas sin closures.
- La sintaxis es más verbosa que `class`.
- La cadena de prototipos debe construirse manualmente.
- No existe herencia estática automática (se deben copiar las propiedades estáticas manualmente).

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Herencia prototipica](05-herencia-prototipica.md) | [🏠 Inicio](../index.md) | [Clases es6 ▶](07-clases-es6.md) |
