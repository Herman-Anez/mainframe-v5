# Parametros y rest spread

## Parámetros por defecto

Se asigna un valor por defecto a un parámetro mediante `=` en la firma de la función. La asignación se evalúa **en el momento de la llamada**, y solo si el argumento correspondiente es `undefined`. `null` y otros valores no activan el defecto.

```javascript
function multiplicar(a, b = 1) {
  return a * b;
}
multiplicar(5);     // 5
multiplicar(5, 2);  // 10
multiplicar(5, undefined); // 5
multiplicar(5, null); // 0 (null se convierte a 0)
```

Los valores por defecto pueden ser expresiones, incluso usar parámetros anteriores:

```javascript
function suma(a, b = a * 2) {
  return a + b;
}
```

### Zona Muerta Temporal (TDZ) en parámetros

Los parámetros se evalúan de izquierda a derecha. Si un parámetro intenta usar uno posterior, este último está en TDZ y lanza `ReferenceError`.

```javascript
function err(a = b, b = 1) {} // ReferenceError
```

### Parámetros y el objeto `arguments`

En modo no estricto, el objeto `arguments` mantiene un enlace vivo con los parámetros nombrados: modificar un parámetro también modifica `arguments[i]` y viceversa. En modo estricto (y en funciones flecha, donde no hay `arguments` propio), no existe tal enlace.

## Parámetros rest (`...`)

El último parámetro de una función puede ser precedido por `...` para capturar todos los argumentos restantes en un **array verdadero**.

```javascript
function log(tag, ...mensajes) {
  console.log(`[${tag}]`, ...mensajes);
}
log("INFO", "arranque", "conexión OK"); // [INFO] arranque conexión OK
```

- El parámetro rest **debe ser el último**.
- Siempre es un array (aunque no se pasen argumentos, será un array vacío).
- Reemplaza ventajosamente al objeto `arguments` en funciones modernas.

## Operador spread en la llamada

El mismo operador `...` delante de un iterable (array, cadena, Set, etc.) expande sus elementos como argumentos individuales.

```javascript
const nums = [4, 7, 1];
console.log(Math.max(...nums)); // 7
```

También puede combinarse con argumentos posicionales:

```javascript
function suma(a, b, c) { return a + b + c; }
const valores = [1,2];
suma(...valores, 3); // 6
```

### Spread vs. rest

- **Rest** agrupa elementos en una estructura (definición de función, desestructuración).
- **Spread** expande elementos de una estructura (llamada a función, arrays/objetos literales).

## Desestructuración de parámetros

Se puede desestructurar un objeto o array directamente en los parámetros de la función, opcionalmente con valores por defecto.

```javascript
function mostrar({ nombre, edad = 0 } = {}) {
  console.log(nombre, edad);
}
mostrar({ nombre: "Luis" }); // "Luis", 0
mostrar();                    // undefined, 0 (si no se provee el objeto completo, el defecto evita error)
```

Esto simula parámetros con nombre, una práctica común para funciones con muchas opciones.

## El objeto `arguments` (tradicional)

En funciones no flecha, `arguments` es un objeto array‑like que contiene todos los argumentos pasados a la función. Soporta `length` y acceso por índice, pero carece de métodos de array.

```javascript
function concatenar() {
  return Array.from(arguments).join(', ');
}
```

En modo estricto, `arguments` no está vinculado dinámicamente a los parámetros nombrados y `arguments.callee` / `arguments.caller` lanzan error. En arrow functions no existe.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Arrow functions](02-arrow-functions.md) | [🏠 Inicio](../index.md) | [Scope y closures ▶](04-scope-y-closures.md) |
