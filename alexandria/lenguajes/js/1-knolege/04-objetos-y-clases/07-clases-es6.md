# Clases es6

## Sintaxis de clase

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

### No hoisting

A diferencia de las declaraciones de función, las declaraciones de clase no sufren hoisting. Existe una zona muerta temporal (TDZ) hasta que se evalúa la declaración.

```javascript
const p = new Persona(); // ReferenceError: Cannot access 'Persona' before initialization
class Persona { /* ... */ }
```

### Expresiones de clase

Pueden ser anónimas o tener nombre interno:

```javascript
const Rectangulo = class {
  constructor(alto, ancho) { this.alto = alto; this.ancho = ancho; }
};

const Factoria = class FactoriaInterna {
  // El nombre "FactoriaInterna" solo es visible dentro de la clase
};
```

### Modo estricto automático

El código dentro del cuerpo de una clase siempre se ejecuta en modo estricto.

## Métodos

- **constructor**: opcional; si no se define, se usa uno vacío por defecto (`constructor() {}`). Solo puede haber uno; un duplicado genera `SyntaxError`.
- **Métodos prototípicos**: definidos sin `function`, se añaden a `Persona.prototype`.
- **Getters y setters**: como en objetos literales.
- **Métodos estáticos**: precedidos por `static`, se definen en la propia clase (no en las instancias). No pueden acceder a `this` de la instancia; su `this` es la clase misma.
- **Métodos generadores**: `*nombre() {}`; se convierten en métodos generadores en el prototipo.

## Herencia con `extends` y `super`

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

### `extends` con funciones constructoras y nativos

`extends` funciona con cualquier expresión que devuelva un constructor (incluso funciones constructoras antiguas o clases nativas como `Array`, `Error`). Al extender `Array`, se debe usar `super()` y se heredan correctamente `length` y los métodos.

### Symbol.species

`Array`, `Map`, `Set`, etc., usan `Symbol.species` para que métodos como `map()` o `slice()` creen instancias de la subclase en lugar de la clase base.

```javascript
class MiArray extends Array {
  static get [Symbol.species]() { return Array; } // fuerza que devuelvan Array normal
}
```

## Clases como primer ciudadano

Las clases son valores; se pueden pasar como argumentos, devolver de funciones, etc. La herencia puede basarse en expresiones.

## Mixins con clases

Mediante una función que toma una clase base y devuelve una subclase, se pueden añadir funcionalidades:

```javascript
const Cronometrado = Base => class extends Base {
  logTiempo() { console.timeLog(...); }
};
class Tarea extends Cronometrado(Persona) { /* ... */ }
```

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Funciones constructoras](06-funciones-constructoras.md) | [🏠 Inicio](../index.md) | [Campos privados y estaticos ▶](08-campos-privados-y-estaticos.md) |
