# Strict mode

El modo estricto se activa con `"use strict";` (o `'use strict';`) al inicio de un script o de una función. No se puede desactivar dentro del mismo ámbito. Los módulos ES (`type="module"`) y las clases están automáticamente en modo estricto.

## Principales restricciones y cambios

### Variables y propiedades
- No se pueden crear variables globales implícitamente (asignar a una variable no declarada lanza `ReferenceError`).
- No se puede usar `delete` en variables, funciones o argumentos.
- Las propiedades con `writable: false` no se pueden sobrescribir silenciosamente; lanzan `TypeError`.
- No se pueden declarar propiedades en valores primitivos (`false.prop = 5` lanza error).
- `eval` y `arguments` no pueden usarse como nombres de variable o parámetros.

### `with` está prohibido
`with` se elimina por completo en modo estricto (SyntaxError).

### Parámetros de función
- No se permiten parámetros duplicados.
- El objeto `arguments` no está vinculado dinámicamente a los parámetros (no se modifica al cambiar los parámetros).
- `arguments.callee` y `arguments.caller` lanzan `TypeError` al acceder.

### `this` en funciones
En modo no estricto, `this` en una función llamada sin contexto es el objeto global. En modo estricto, es `undefined`. Así se evitan modificaciones accidentales del objeto global.

### `eval` restringido
- Las variables y funciones declaradas dentro de `eval` no se filtran al ámbito circundante; crean su propio ámbito.
- `eval` no puede sobrescribir el identificador `eval` ni declararlo.

### Seguridad
- No se puede acceder a `caller` ni `arguments` de funciones.
- `Function.prototype.caller` y `.arguments` lanzan error.

### Números octales
En modo estricto, la sintaxis octal con `0` seguido de dígitos (`0123`) no está permitida (SyntaxError). Se debe usar `0o` prefijo.

### Propiedades inmutables y objetos sellados
- Asignar a una propiedad de solo lectura o no extensible lanza `TypeError` (en lugar de fallar silenciosamente).
- Eliminar propiedades no configurables también lanza error.

## Beneficios
- Código más seguro y optimizable.
- Errores silenciosos se convierten en excepciones, facilitando la depuración.
- Prepara el código para futuras versiones del lenguaje eliminando características problemáticas.

---

Cada uno de estos archivos de conocimiento puede ser enriquecido con ejemplos adicionales, diagramas de flujo de coerción, tablas de valores especiales y ejercicios prácticos. La profundidad presentada asegura una base sólida para cualquier desarrollador que quiera dominar JavaScript desde sus fundamentos.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Coercion de tipos](06-coercion-de-tipos.md) | [🏠 Inicio](../index.md) | [Condicionales ▶](../02-control-de-flujo/01-condicionales.md) |
