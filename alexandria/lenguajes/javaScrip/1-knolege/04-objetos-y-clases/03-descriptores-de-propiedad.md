# Descriptores de propiedad

## Atributos internos de una propiedad

Cada propiedad de un objeto posee atributos que controlan su comportamiento. Son:

- **`value`**: valor asociado (solo propiedades de datos).
- **`writable`**: si es `true`, el valor puede cambiarse.
- **`enumerable`**: si es `true`, aparece en iteraciones `for...in` y `Object.keys`.
- **`configurable`**: si es `true`, la propiedad puede eliminarse y sus atributos pueden modificarse (excepto `value` y `writable` cuando `configurable` es `false`, aunque en modo no estricto se puede redefinir `writable` de `true` a `false`).

Para propiedades de acceso:
- **`get`**: función getter.
- **`set`**: función setter.
- **`enumerable`** y **`configurable`**.

### `Object.getOwnPropertyDescriptor(obj, prop)`

Devuelve un objeto descriptor con los atributos actuales de una propiedad propia.

```javascript
const obj = { x: 42 };
console.log(Object.getOwnPropertyDescriptor(obj, 'x'));
// { value: 42, writable: true, enumerable: true, configurable: true }
```

Para propiedades inexistentes o heredadas, devuelve `undefined`.

### `Object.defineProperty(obj, prop, descriptor)`

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

### `Object.defineProperties(obj, props)`

Permite definir múltiples propiedades a la vez.

```javascript
Object.defineProperties(obj, {
  nombre: { value: "Luis", writable: true },
  id: { get() { return this._id; }, set(v) { this._id = v; } }
});
```

### Comportamiento de `configurable`

Una vez que `configurable` se establece en `false`:
- No se puede volver a cambiar `configurable` a `true`.
- No se puede cambiar `enumerable`.
- No se puede cambiar entre propiedad de datos y de acceso.
- Si es propiedad de datos, `writable` puede cambiarse de `true` a `false`, pero no de `false` a `true`.
- `value` solo puede cambiarse si `writable` es `true`.
- La propiedad no puede eliminarse.

### `Object.freeze(obj)` y `Object.seal(obj)`

- **`Object.seal(obj)`**: sella el objeto. Para cada propiedad propia, establece `configurable: false`. Impide agregar y eliminar propiedades. Las propiedades existentes pueden modificarse si son `writable`.
- **`Object.freeze(obj)`**: congela el objeto. Aplica `seal` y además pone `writable: false` en todas las propiedades de datos. El objeto y sus propiedades se vuelven inmutables (aunque los objetos anidados no se congelan automáticamente; se requiere congelación profunda).

Se puede verificar el estado con `Object.isSealed()` y `Object.isFrozen()`.

### Casos de uso

- Crear constantes en objetos (propiedades de solo lectura).
- Definir propiedades internas no enumerables (por ejemplo, claves de caché).
- Proteger objetos de configuración.
- Implementar reactividad (combinado con Proxy).

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Propiedades y metodos](02-propiedades-y-metodos.md) | [🏠 Inicio](../index.md) | [Prototipos ▶](04-prototipos.md) |
