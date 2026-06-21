# Objetos literales

## Creación de objetos con notación literal

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

### Claves (property keys)

- Las claves son **cadenas** (o **símbolos**). Si se omite el símbolo y se usa un identificador válido, JavaScript convierte el identificador a cadena.
- Para nombres no válidos como identificadores (con espacios, guiones, etc.), se usan comillas: `"mi-propiedad": valor`.
- Los números también se convierten a cadena; es decir, `1` y `"1"` son la misma clave.

### Sintaxis abreviada (ES6)

Cuando el valor de una propiedad proviene de una variable con el mismo nombre, se puede omitir los dos puntos:

```javascript
const nombre = "Luis";
const edad = 28;
const usuario = { nombre, edad }; // equivalente a { nombre: nombre, edad: edad }
```

### Métodos concisos

A partir de ES6, se puede definir un método directamente sin la palabra `function`:

```javascript
const obj = {
  metodo1() { /* ... */ },
  async metodo2() { /* ... */ },
  *generador() { /* ... */ }
};
```

Esto es equivalente a `metodo1: function() { ... }`, pero más corto y, en el caso de métodos que usen `super`, necesario para que `super` resuelva correctamente el prototipo.

### Nombres de propiedad computados (computed property names)

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

### Propagación de objetos (Spread, ES2018)

El operador `...` dentro de un literal de objeto copia las propiedades enumerables propias de otro objeto:

```javascript
const base = { a: 1, b: 2 };
const copia = { ...base, c: 3 }; // { a: 1, b: 2, c: 3 }
const fusion = { ...base, b: 20 }; // { a: 1, b: 20 } (sobrescribe)
```

Realiza una copia superficial: los valores anidados se comparten por referencia.

### Limitaciones de la notación literal

- No permite crear objetos con prototipo personalizado directamente (siempre hereda de `Object.prototype`).
- No se puede reutilizar como molde sin copiar y pegar; para eso existen clases o funciones constructoras.
- Los métodos definidos en el literal son propiedades propias, no compartidas mediante prototipo, lo que puede consumir más memoria si se crean muchas instancias manualmente.

### Uso como configuraciones y registros

Los objetos literales son ideales para pasar opciones a funciones, modelar estructuras de datos simples o actuar como mapas de clave-valor (aunque `Map` puede ser más adecuado para claves no string).

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Parametros por defecto](../03-funciones/08-parametros-por-defecto.md) | [🏠 Inicio](../index.md) | [Propiedades y metodos ▶](02-propiedades-y-metodos.md) |
