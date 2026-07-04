# Excepciones trycatch

## Lanzamiento de errores: `throw`
`throw` lanza cualquier valor, aunque se recomienda lanzar instancias de `Error` o sus subclases para conservar la pila de llamadas.
```javascript
throw new Error('Algo salió mal');
throw { mensaje: 'error personalizado' }; // posible pero no recomendado
```
- Después de `throw`, la ejecución se detiene en el bloque actual y el error se propaga hacia arriba en la pila de llamadas hasta que es capturado o se convierte en un error no controlado.

## Captura de errores: `try...catch...finally`
```javascript
try {
  // código que puede lanzar un error
} catch (error) {
  // manejo del error
} finally {
  // se ejecuta siempre, haya o no error
}
```
- **`catch`** puede omitir la variable de error si no se necesita (ES10+): `catch { ... }`.
- **`finally`** se ejecuta incluso si dentro de `try` o `catch` hay un `return`, `throw` o `break`. Si el `finally` también lanza una excepción, esta reemplaza a cualquier excepción previa. Si `finally` tiene un `return`, anula cualquier `return` anterior en el `try`/`catch`.

**Ejemplo de interacción con `return`:**
```javascript
function test() {
  try {
    return 1;
  } finally {
    return 2; // este return prevalece, resultado = 2
  }
}
```

### Jerarquía de errores
`Error` es el constructor base. Subclases nativas:
- `TypeError`: operación sobre un tipo inadecuado.
- `ReferenceError`: acceso a variable no declarada.
- `SyntaxError`: código mal formado (suele ocurrir en tiempo de parseo).
- `RangeError`: valor fuera del rango permitido.
- `URIError`: funciones de codificación/decodificación de URI con parámetros inválidos.
- `EvalError`: errores relacionados con `eval` (obsoleto en la práctica).

### Errores personalizados
Se puede extender `Error` para añadir propiedades o un nombre distinto:
```javascript
class ValidationError extends Error {
  constructor(message, field) {
    super(message);
    this.name = 'ValidationError';
    this.field = field;
  }
}
throw new ValidationError('Campo requerido', 'email');
```

### `cause` (ES2022)
Al lanzar un error se puede especificar una propiedad `cause` para encapsular el error original que provocó este.
```javascript
try {
  // ...
} catch (err) {
  throw new Error('Fallo al procesar', { cause: err });
}
```
Al capturar, se puede acceder a `error.cause`.

## Propagación y manejo asíncrono
- En funciones `async`, un `throw` dentro de la función rechaza la promesa.
- Los errores no capturados en promesas se convierten en eventos `unhandledrejection` (Node.js) o en el navegador.
- `try/catch` puede usarse con `await` para capturar rechazos de promesas.
- No se puede capturar un error lanzado en un callback asíncrono con un `try/catch` exterior, porque el callback se ejecuta en otro contexto.

## Buenas prácticas
- Lanzar siempre objetos `Error` o derivados.
- No suprimir errores sin manejarlos; al menos registrarlos.
- En aplicaciones, crear barreras de captura de errores globales (ej. `window.onerror`, `unhandledrejection`).

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Bucles](02-bucles.md) | [🏠 Inicio](../index.md) | [Iteracion for of in ▶](04-iteracion-for-of-in.md) |
