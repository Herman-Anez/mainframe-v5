# Promesas

## Definición y estados

Una **promesa** es un objeto que representa la eventual finalización (o fallo) de una operación asíncrona y su valor resultante. Una promesa puede estar en uno de tres estados:

- **Pendiente (pending):** estado inicial, la operación no ha terminado.
- **Resuelta (fulfilled):** la operación terminó exitosamente, la promesa tiene un valor.
- **Rechazada (rejected):** la operación falló, la promesa tiene un motivo (error).

Una vez que una promesa pasa a fulfilled o rejected, su estado es **final** (settled) y no puede cambiar.

```javascript
const promesa = new Promise((resolve, reject) => {
  // Operación asíncrona
  if (exito) resolve(resultado);
  else reject(new Error('Falló'));
});
```

## Consumo: then, catch, finally

- `.then(onFulfilled, onRejected)`: programa una reacción para cuando la promesa se resuelva o rechace. Retorna una **nueva promesa**, lo que permite encadenamiento.
- `.catch(onRejected)`: equivalente a `.then(null, onRejected)`. Se usa para manejar errores.
- `.finally(onFinally)`: se ejecuta cuando la promesa se asienta (sin importar el resultado), sin recibir argumento. Ideal para limpiar recursos.

```javascript
fetch('/api/datos')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error))
  .finally(() => console.log('Petición finalizada'));
```

## Encadenamiento y propagación de errores

Cada `.then` o `.catch` devuelve una nueva promesa. El valor retornado por el callback se convierte en el valor de resolución de esa nueva promesa. Si se lanza un error, la nueva promesa es rechazada.

Los errores se propagan hacia abajo hasta el primer `.catch`.

```javascript
Promise.resolve(2)
  .then(n => n * 2)
  .then(n => { throw new Error('fallo'); })
  .then(n => console.log(n)) // no se ejecuta
  .catch(err => console.error(err)); // captura el error
```

## Métodos estáticos

### `Promise.resolve(valor)`
Devuelve una promesa resuelta con ese valor. Si el valor ya es una promesa, la retorna sin modificar (o sigue su estado). Útil para normalizar valores a promesas.

### `Promise.reject(motivo)`
Devuelve una promesa rechazada con el motivo.

### `Promise.all(iterable)`
Toma un iterable de promesas. Retorna una sola promesa que se resuelve cuando **todas** las promesas del iterable se han resuelto, con un array de resultados en el mismo orden. Si **alguna** se rechaza, la promesa retornada se rechaza inmediatamente con ese error, sin esperar a las demás (fall-fast).

```javascript
const [usuario, posts] = await Promise.all([
  fetch('/usuario').then(r=>r.json()),
  fetch('/posts').then(r=>r.json())
]);
```

### `Promise.allSettled(iterable)` (ES2020)
Espera que todas las promesas terminen (se resuelvan o rechacen). Retorna un array de objetos `{ status, value/reason }` para cada una. Ideal cuando no se quiere que un fallo detenga las demás.

### `Promise.race(iterable)`
Retorna la primera promesa que se asiente (fulfilled o rejected). Si la primera en asentarse es rechazada, la promesa de `race` se rechaza.

### `Promise.any(iterable)` (ES2021)
Retorna la primera promesa que se **resuelva** (fulfilled). Si todas son rechazadas, rechaza con un `AggregateError` que contiene todos los errores.

## Microtareas

Los callbacks de `then`, `catch` y `finally` se ejecutan como **microtareas**. Esto significa que, después de que la pila de llamadas se vacíe, el event loop procesa **todas** las microtareas antes de pasar a la siguiente macrotarea. Esto garantiza que las reacciones a promesas se ejecuten lo antes posible, antes de otros callbacks como `setTimeout`.

```javascript
console.log('Inicio');
Promise.resolve().then(() => console.log('Promesa'));
setTimeout(() => console.log('Timeout'), 0);
console.log('Fin');
// Salida: Inicio, Fin, Promesa, Timeout
```

## Creación de promesas y "promisificación"

Envolver APIs de callback en promesas:

```javascript
function readFile(path) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, 'utf8', (err, data) => {
      if (err) reject(err);
      else resolve(data);
    });
  });
}
```

Node.js provee `util.promisify` para convertir automáticamente funciones que siguen la convención error-first.

## Anti-patrones y buenas prácticas

- No ignorar rechazos: siempre agregar un `.catch` o manejar el error con `try/catch` en async/await.
- Evitar el `Promise` constructor antipatrón: no envolver una promesa existente en otra `new Promise`.
- Retornar la promesa en los `.then` para mantener el encadenamiento.
- Usar `Promise.all` para operaciones paralelas en lugar de esperas secuenciales innecesarias.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Callbacks](01-callbacks.md) | [🏠 Inicio](../index.md) | [Async await ▶](03-async-await.md) |
