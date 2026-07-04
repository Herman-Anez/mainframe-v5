# Prototipos

## El enlace interno `[[Prototype]]`

Cada objeto en JavaScript tiene un enlace interno denominado `[[Prototype]]` (accesible vía `__proto__` – propiedad histórica no estándar pero ampliamente soportada– y mediante `Object.getPrototypeOf()` / `Object.setPrototypeOf()`). Este enlace apunta a otro objeto o a `null`, formando la **cadena de prototipos**.

Cuando se intenta acceder a una propiedad que no existe en el objeto, el motor recorre la cadena de prototipos hacia arriba hasta encontrarla o llegar a `null`.

```javascript
const padre = { saludo: "Hola" };
const hijo = Object.create(padre);
console.log(hijo.saludo); // "Hola" (heredado)
console.log(hijo.hasOwnProperty('saludo')); // false
```

### `Object.create(proto [, propertiesObject])`

Crea un nuevo objeto con el prototipo dado. Opcionalmente se pueden definir propiedades con descriptores. Es la forma pura de establecer la herencia sin funciones constructoras.

```javascript
const base = { tipo: "general" };
const especifico = Object.create(base, {
  nombre: { value: "Especial", writable: true }
});
```

Crear con `Object.create(null)` produce un objeto sin prototipo (sin métodos heredados como `toString`), útil para diccionarios limpios.

### Prototipo en literales y constructores

- Un objeto literal `{ }` tiene como `[[Prototype]]` a `Object.prototype`.
- Un array literal `[ ]` tiene como prototipo `Array.prototype`, que a su vez hereda de `Object.prototype`.
- Una función tiene `Function.prototype`.

### La propiedad `prototype` en funciones

**Solo las funciones** (excepto las flecha) poseen una propiedad `prototype` (objeto). No es el prototipo de la función misma, sino el objeto que se asignará como `[[Prototype]]` de las instancias creadas con `new` y esa función. Por tanto:

```javascript
function Constructor() {}
console.log(Constructor.prototype); // objeto con constructor apuntando a Constructor
const inst = new Constructor();
console.log(Object.getPrototypeOf(inst) === Constructor.prototype); // true
```

### Modificación del prototipo

- **`Object.setPrototypeOf(obj, proto)`**: cambia el prototipo de un objeto existente. Operación costosa que desoptimiza el código; evite su uso en bucles críticos.
- **`Object.getPrototypeOf(obj)`**: obtiene el prototipo.
- La propiedad `__proto__` es un getter/setter en `Object.prototype`; no se recomienda su uso en código nuevo.

### Sombreado (Shadowing)

Si se asigna un valor a una propiedad que existe en la cadena de prototipos, se crea una propiedad propia en el objeto que "sombrea" la del prototipo para lecturas posteriores.

```javascript
hijo.saludo = "Bonjour";
console.log(hijo.saludo);  // "Bonjour"
console.log(padre.saludo); // "Hola"
```

Si la propiedad heredada tiene `writable: false`, la asignación falla en modo estricto o se ignora silenciosamente.

### Rendimiento y forma (hidden classes)

Los motores JavaScript optimizan el acceso a propiedades mediante "formas" o "clases ocultas". Modificar la cadena de prototipos o añadir muchas propiedades dinámicamente degrada el rendimiento.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Descriptores de propiedad](03-descriptores-de-propiedad.md) | [🏠 Inicio](../index.md) | [Herencia prototipica ▶](05-herencia-prototipica.md) |
