# Herencia prototipica

## Herencia basada en prototipos

JavaScript implementa herencia mediante la delegación de prototipos, sin clases tradicionales (aunque la sintaxis `class` es azúcar sobre este modelo). Un objeto puede heredar propiedades y métodos de otro objeto a través de la cadena de prototipos.

### Funciones constructoras

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

### Encadenamiento de prototipos para herencia

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

### `instanceof` y `isPrototypeOf`

- `obj instanceof Constructor` verifica si `Constructor.prototype` está en la cadena de prototipos de `obj`.
- `prototype.isPrototypeOf(obj)` comprueba si un objeto concreto está en la cadena.

### Herencia con `Object.create()`

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

### Propiedades y métodos estáticos vs de instancia

Las propiedades definidas en el prototipo son compartidas por todas las instancias, mientras que las definidas dentro del constructor (con `this.prop =`) son propias de cada instancia. Las propiedades en la función constructora misma (`Funcion.propEstatica`) no se heredan; son "estáticas" en el sentido de que pertenecen a la función, no a las instancias. Para emular herencia estática, se deben copiar explícitamente.

### Problemas comunes y soluciones

- **Propiedades de referencia en el prototipo**: si se define un array u objeto en el prototipo, todas las instancias comparten la misma referencia. La solución es inicializar dichas propiedades en el constructor.
- **Herencia múltiple**: no soportada directamente. Se puede simular con mixins (copiando propiedades de varios objetos al prototipo) o usando composición.
- **Métodos privados**: antes de ES6 se simulaban con closures en el constructor; después, con `#` campos privados.

### Comprobación de la cadena

- `Object.getPrototypeOf(inst)`.
- `inst.constructor` puede no ser confiable si no se corrigió después de la herencia.
- `Object.getOwnPropertyNames(prototype)` para inspeccionar métodos.

## Resumen de conceptos clave

| Concepto | Descripción |
|---|---|
| `[[Prototype]]` | Enlace interno de un objeto a su prototipo |
| `prototype` | Propiedad de funciones constructoras, usada para establecer el prototipo de instancias |
| `Object.create(proto)` | Crear objeto con prototipo específico |
| `Object.setPrototypeOf` | Modificar prototipo de un objeto existente |
| `new` | Crea instancia, llama al constructor, enlaza prototipo |
| `__proto__` | Acceso no estándar al prototipo (evitar en código nuevo) |
| Cadena de prototipos | Secuencia de objetos que termina en `null` |

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Prototipos](04-prototipos.md) | [🏠 Inicio](../index.md) | [Funciones constructoras ▶](06-funciones-constructoras.md) |
