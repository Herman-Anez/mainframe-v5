# Tipos de datos

JavaScript distingue entre **tipos primitivos** y **objetos**.

### Primitivos
Son inmutables, se comparan por valor.
- `undefined` – variable no inicializada.
- `null` – ausencia intencional de valor.
- `boolean` – `true` / `false`.
- `number` – punto flotante de doble precisión IEEE 754.
- `bigint` – enteros de precisión arbitraria.
- `string` – secuencia de caracteres UTF-16.
- `symbol` – valor único e inmutable (ES6).

### Objetos
Colección de propiedades, comparados por referencia. Subtipos:
- `Object`, `Array`, `Function`, `Date`, `RegExp`, `Map`, `Set`, etc.
- Las funciones son objetos invocables.

### `typeof`
Devuelve una cadena con el tipo:
- `"undefined"`, `"boolean"`, `"number"`, `"bigint"`, `"string"`, `"symbol"`, `"function"`, `"object"`.
- Casos especiales:
  - `typeof null === "object"` (error histórico en la implementación).
  - `typeof function(){} === "function"` (aunque es objeto).
  - `typeof [] === "object"`.

### `instanceof`
Verifica si un objeto tiene en su cadena de prototipos la propiedad `prototype` de una función constructora.
```javascript
[] instanceof Array // true
[] instanceof Object // true (la cadena incluye Object.prototype)
```
No funciona bien entre contextos de ejecución distintos (iframes) y no sirve para primitivos.

### Valores primitivos y objetos envoltorio
Los primitivos no tienen métodos, pero el motor crea temporalmente un objeto envoltorio (`String`, `Number`, `Boolean`) al acceder a un método, permitiendo `"hola".toUpperCase()`. No se debe usar `new String()` explícitamente porque produce un objeto, no un primitivo.

### `undefined` vs `null`
- `undefined`: valor por defecto de variables no inicializadas, parámetros no pasados, retorno de funciones sin `return`.
- `null`: representa "nada", "vacío", normalmente asignado intencionalmente.
- `typeof null` debería ser `"null"` pero es `"object"`.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Sintaxis y variables](01-sintaxis-y-variables.md) | [🏠 Inicio](../index.md) | [Numeros y bigint ▶](03-numeros-y-bigint.md) |
