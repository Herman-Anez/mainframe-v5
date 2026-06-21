# Propiedades y metodos

## Acceso a propiedades

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

## Comprobación de existencia de una propiedad

- **Operador `in`**: verifica si la propiedad existe en el objeto o en su cadena de prototipos.
  ```javascript
  if ("nombre" in persona) { /* ... */ }
  ```
- **`Object.hasOwn(obj, 'prop')`** (ES2022) o `obj.hasOwnProperty('prop')`: verifica propiedades propias, ignorando el prototipo.
  ```javascript
  Object.hasOwn(persona, 'nombre'); // true
  ```
- Comparación con `undefined` no es segura si la propiedad existe pero su valor es `undefined`.

## Propiedades de datos y propiedades de acceso

Las propiedades de un objeto pueden ser de dos tipos:

- **Propiedad de datos**: contiene un valor (`value`) y atributos `writable`, `enumerable`, `configurable`.
- **Propiedad de acceso**: definida mediante un getter y/o un setter.

### Getters y setters (propiedades de acceso)

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

### Métodos como propiedades

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

## Métodos de Object.prototype heredados

Todo objeto derivado de `Object.prototype` hereda métodos como:
- `toString()`: devuelve `[object Object]`; puede sobrescribirse.
- `valueOf()`: devuelve el propio objeto; las subclases lo sobrescriben (Date, Number, etc.).
- `hasOwnProperty()`, `isPrototypeOf()`, `propertyIsEnumerable()`.

Es peligroso usarlos directamente si el objeto podría tener propiedades con esos nombres o un prototipo nulo. Solución: llamarlos desde `Object.prototype` con `.call()` o usar los equivalentes estáticos (`Object.hasOwn`).

## Borrado de propiedades

El operador `delete` elimina una propiedad propia del objeto. Devuelve `true` si la propiedad no existía o si se eliminó con éxito (excepto en propiedades no configurables o en modo estricto donde lanza error).

```javascript
delete obj.propiedad;
```

No afecta a propiedades heredadas; solo elimina la propiedad del propio objeto.

## Enumeración de propiedades

- `for...in` recorre propiedades enumerables, incluyendo heredadas (solo cadenas).
- `Object.keys()`: devuelve un array de claves propias enumerables (cadenas).
- `Object.values()`: devuelve un array de valores de propiedades propias enumerables.
- `Object.entries()`: devuelve pares `[clave, valor]` de propiedades propias enumerables.
- `Object.getOwnPropertyNames()`: claves propias (cadenas), enumerables o no.
- `Object.getOwnPropertySymbols()`: símbolos propios, enumerables o no.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Objetos literales](01-objetos-literales.md) | [🏠 Inicio](../index.md) | [Descriptores de propiedad ▶](03-descriptores-de-propiedad.md) |
