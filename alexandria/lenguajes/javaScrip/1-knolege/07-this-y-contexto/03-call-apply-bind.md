# Call apply bind

## Modificación explícita del contexto

JavaScript proporciona tres métodos para invocar funciones estableciendo un valor de `this` específico. Pertenecen a `Function.prototype` y son: `call`, `apply` y `bind`.

## `call(thisArg, ...args)`

Invoca la función **inmediatamente** con un `this` dado y los argumentos proporcionados uno a uno.

```javascript
function saludar(saludo, signo) {
  console.log(`${saludo}, ${this.nombre}${signo}`);
}
const persona = { nombre: 'Ana' };
saludar.call(persona, 'Hola', '!'); // Hola, Ana!
```

- `thisArg` puede ser cualquier valor. Si es `null` o `undefined`, en modo no estricto se reemplaza por el objeto global; en modo estricto, se usa tal cual.
- Para primitivos como `thisArg` (ej. `5`), se realiza un auto-boxing a su objeto envoltorio (`Number`).

## `apply(thisArg, [args])`

Similar a `call`, pero los argumentos se pasan como un array (o array-like).

```javascript
saludar.apply(persona, ['Buenos días', ' :)']); // Buenos días, Ana :)
```

`apply` es útil cuando los argumentos ya están en forma de array, o para funciones como `Math.max`:

```javascript
const numeros = [1, 5, 2, 9];
console.log(Math.max.apply(null, numeros)); // 9
```

Hoy en día, con el operador spread (`Math.max(...numeros)`), `apply` ha perdido protagonismo, pero sigue siendo relevante en contextos donde no se dispone de spread (ej. algunos entornos antiguos) o en algunos patrones.

## `bind(thisArg, ...args)`

A diferencia de `call`/`apply`, `bind` **no ejecuta la función**. Devuelve una **nueva función** con `this` permanentemente enlazado al valor dado. Los argumentos adicionales se fijan parcialmente (aplicación parcial).

```javascript
const personaSaludar = saludar.bind(persona, 'Hey');
personaSaludar('!!'); // Hey, Ana!!
```

- El enlace de `this` es definitivo; llamar a `call` o `apply` sobre la función resultante no cambiará su `this`.
- `bind` puede usarse para crear funciones con parámetros prefijados:
  ```javascript
  function multiplicar(a, b) { return a * b; }
  const duplicar = multiplicar.bind(null, 2);
  console.log(duplicar(5)); // 10
  ```
- Las propiedades `name` y `length` de la función devuelta se ajustan: `name` se prefija con "bound "; `length` es la cantidad de parámetros que aún esperan valor (los restantes después de los fijados), hasta donde sea posible determinar.

### `bind` y funciones flecha

Como ya se mencionó, las funciones flecha tienen un `this` léxico que no se puede cambiar. Si se usa `bind` sobre una flecha, se devolverá una nueva función, pero su `this` seguirá siendo el mismo de la flecha original. `bind` simplemente fija argumentos adicionales (aplicación parcial), pero el `this` no se ve afectado.

```javascript
const flecha = () => console.log(this);
const enlazada = flecha.bind({ a: 1 });
enlazada(); // this sigue siendo el léxico, no {a:1}
```

## Casos de uso prácticos

### Préstamo de métodos (method borrowing)

Se puede usar un método de un objeto sobre otro objeto similar usando `call` o `apply`.

```javascript
const arrayLike = { 0: 'a', 1: 'b', length: 2 };
Array.prototype.slice.call(arrayLike); // ['a', 'b']
```

### Herencia en funciones constructoras (pre-ES6)

Para llamar al constructor padre en una jerarquía de constructores:

```javascript
function Padre(nombre) {
  this.nombre = nombre;
}
function Hijo(nombre, edad) {
  Padre.call(this, nombre);
  this.edad = edad;
}
```

### Binding para callbacks asíncronos

```javascript
class Logger {
  constructor(nombre) {
    this.nombre = nombre;
  }
  log(mensaje) {
    console.log(`[${this.nombre}] ${mensaje}`);
  }
}
const logger = new Logger('App');
setTimeout(logger.log.bind(logger, 'Inicio'), 100);
```

### Aplicación parcial (partial application)

`bind` permite prefijar argumentos, creando funciones más específicas sin necesidad de envoltorios.

```javascript
const log = console.log.bind(console, 'DEBUG:');
log('Mensaje'); // DEBUG: Mensaje
```

## Diferencias entre `call`/`apply` y `bind`

| Método    | Ejecución       | Retorna                      | `this` queda fijo |
|-----------|-----------------|------------------------------|-------------------|
| `call`    | Inmediata       | El valor de retorno de la función | No (solo esa llamada) |
| `apply`   | Inmediata       | El valor de retorno de la función | No (solo esa llamada) |
| `bind`    | Diferida        | Nueva función con `this` enlazado | Sí (permanente)   |

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Arrow functions y this](02-arrow-functions-y-this.md) | [🏠 Inicio](../index.md) | [New y constructores ▶](04-new-y-constructores.md) |
