## 01-callbacks.md

### El patrón callback

Un **callback** (función de retrollamada) es una función que se pasa como argumento a otra función, para que sea invocada en un momento posterior, generalmente cuando una operación asíncrona ha finalizado o cuando se alcanza una condición.

```javascript
function procesarDatos(datos, callback) {
  // Simulación de operación asíncrona
  setTimeout(() => {
    const resultado = datos.toUpperCase();
    callback(null, resultado);
  }, 1000);
}

procesarDatos("hola", (error, resultado) => {
  if (error) return console.error(error);
  console.log(resultado);
});
```

### Naturaleza síncrona vs asíncrona del callback

- **Callback síncrono**: se ejecuta inmediatamente dentro de la función que lo recibe, como en `array.forEach(callback)`.
- **Callback asíncrono**: se difiere su ejecución (temporizadores, E/S, peticiones de red) y se despacha a través del event loop, generalmente desde una cola de tareas (macrotareas) o microtareas.

El hecho de que un callback sea asíncrono no depende de la función en sí, sino del contexto en el que se invoca (si se envuelve en `setTimeout`, `fetch`, `nextTick`, etc.).

### Convención "error-first" (Node.js)

En las API de Node.js, los callbacks siguen la convención de que el primer argumento es el error (si ocurre, `null` en caso de éxito) y los siguientes son los resultados.

```javascript
fs.readFile('archivo.txt', 'utf8', (err, data) => {
  if (err) {
    console.error('Error:', err);
    return;
  }
  console.log(data);
});
```

Esto facilita el manejo unificado de errores y evita mezclar resultados con posibles errores.

### Callback Hell (pirámide de la muerte)

Al anidar múltiples operaciones asíncronas dependientes, el código se vuelve profundamente indentado, difícil de leer, mantener y depurar.

```javascript
obtenerUsuario(id, (err, usuario) => {
  if (err) return manejarError(err);
  obtenerPosts(usuario.id, (err, posts) => {
    if (err) return manejarError(err);
    obtenerComentarios(posts[0].id, (err, comentarios) => {
      if (err) return manejarError(err);
      // ...
    });
  });
});
```

#### Soluciones históricas

- **Nombrar funciones** en lugar de usar anónimas, declarándolas fuera del anidamiento y pasarlas como referencia.
- **Modularización**: separar cada paso en funciones independientes.
- **Librerías de control de flujo** como `async.js` (series, parallel, waterfall).
- **Promesas** y **async/await** (estándar moderno).

### Inversión de control (IoC)

Al entregar un callback a una función de terceros, cedemos el control de *qué*, *cuándo* y *cuántas veces* se ejecuta nuestro código. Esto puede generar problemas:
- Que el callback no se ejecute nunca.
- Que se ejecute varias veces (por error de la API).
- Que se ejecute síncronamente a veces y asíncronamente otras (comportamiento impredecible).

Para mitigarlo, se pueden implementar salvaguardas (ejecutar una vez, manejar timeouts), pero las promesas resuelven este problema invirtiendo la inversión de control: la promesa nos entrega el resultado cuando esté listo, bajo nuestro control.

### Callbacks y el event loop

Los callbacks asíncronos (por ejemplo, los pasados a `setTimeout`, `setInterval`, eventos del DOM, I/O de red) se registran y se encolan en la **cola de tareas (task queue)** correspondiente (macrotasks o microtareas). El event loop los ejecuta cuando la pila de llamadas está vacía y el tipo de tarea es el próximo a procesar.

- `setTimeout` / `setInterval` → macrotareas.
- `.then()` / `catch()` → microtareas.
- Eventos de usuario, `fetch` callbacks (en la API antigua con `XMLHttpRequest`), I/O → macrotareas.

### Limitaciones de los callbacks

- Falta de retorno de valores: no se puede usar `return` para devolver el resultado; solo se puede pasar al callback.
- Composición compleja: para coordinar múltiples tareas asíncronas en paralelo o serie se requiere código adicional.
- Manejo de errores complicado: `try/catch` no funciona con callbacks asíncronos porque el error se lanza en otro contexto.
- Callback hell afecta la legibilidad.

### Cuándo se usan hoy

Aunque las promesas y `async/await` han reemplazado en gran medida los callbacks para flujos asíncronos, los callbacks siguen siendo esenciales en:
- APIs antiguas o de bajo nivel (Node.js `fs` antes de promisificarse).
- Suscripciones a eventos (`addEventListener`).
- Métodos funcionales de arrays (`map`, `filter`, `reduce`).
- Algunos patrones como el callback de finalización de animaciones.

---

## 02-promesas.md

### Definición y estados

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

### Consumo: then, catch, finally

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

### Encadenamiento y propagación de errores

Cada `.then` o `.catch` devuelve una nueva promesa. El valor retornado por el callback se convierte en el valor de resolución de esa nueva promesa. Si se lanza un error, la nueva promesa es rechazada.

Los errores se propagan hacia abajo hasta el primer `.catch`.

```javascript
Promise.resolve(2)
  .then(n => n * 2)
  .then(n => { throw new Error('fallo'); })
  .then(n => console.log(n)) // no se ejecuta
  .catch(err => console.error(err)); // captura el error
```

### Métodos estáticos

#### `Promise.resolve(valor)`
Devuelve una promesa resuelta con ese valor. Si el valor ya es una promesa, la retorna sin modificar (o sigue su estado). Útil para normalizar valores a promesas.

#### `Promise.reject(motivo)`
Devuelve una promesa rechazada con el motivo.

#### `Promise.all(iterable)`
Toma un iterable de promesas. Retorna una sola promesa que se resuelve cuando **todas** las promesas del iterable se han resuelto, con un array de resultados en el mismo orden. Si **alguna** se rechaza, la promesa retornada se rechaza inmediatamente con ese error, sin esperar a las demás (fall-fast).

```javascript
const [usuario, posts] = await Promise.all([
  fetch('/usuario').then(r=>r.json()),
  fetch('/posts').then(r=>r.json())
]);
```

#### `Promise.allSettled(iterable)` (ES2020)
Espera que todas las promesas terminen (se resuelvan o rechacen). Retorna un array de objetos `{ status, value/reason }` para cada una. Ideal cuando no se quiere que un fallo detenga las demás.

#### `Promise.race(iterable)`
Retorna la primera promesa que se asiente (fulfilled o rejected). Si la primera en asentarse es rechazada, la promesa de `race` se rechaza.

#### `Promise.any(iterable)` (ES2021)
Retorna la primera promesa que se **resuelva** (fulfilled). Si todas son rechazadas, rechaza con un `AggregateError` que contiene todos los errores.

### Microtareas

Los callbacks de `then`, `catch` y `finally` se ejecutan como **microtareas**. Esto significa que, después de que la pila de llamadas se vacíe, el event loop procesa **todas** las microtareas antes de pasar a la siguiente macrotarea. Esto garantiza que las reacciones a promesas se ejecuten lo antes posible, antes de otros callbacks como `setTimeout`.

```javascript
console.log('Inicio');
Promise.resolve().then(() => console.log('Promesa'));
setTimeout(() => console.log('Timeout'), 0);
console.log('Fin');
// Salida: Inicio, Fin, Promesa, Timeout
```

### Creación de promesas y "promisificación"

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

### Anti-patrones y buenas prácticas

- No ignorar rechazos: siempre agregar un `.catch` o manejar el error con `try/catch` en async/await.
- Evitar el `Promise` constructor antipatrón: no envolver una promesa existente en otra `new Promise`.
- Retornar la promesa en los `.then` para mantener el encadenamiento.
- Usar `Promise.all` para operaciones paralelas en lugar de esperas secuenciales innecesarias.

---

## 03-async-await.md

### Sintaxis y semántica

`async`/`await` es azúcar sintáctico sobre promesas que permite escribir código asíncrono con un estilo síncrono, más legible y fácil de mantener.

- **`async`**: antepuesto a una función (declaración, expresión, flecha, método de clase), hace que la función retorne siempre una promesa. Si la función retorna un valor, la promesa se resuelve con ese valor; si lanza una excepción, la promesa se rechaza con ese error.
- **`await`**: solo puede usarse dentro de funciones `async`. Pausa la ejecución de la función hasta que la promesa a su derecha se asiente. Si la promesa se resuelve, `await` devuelve el valor resuelto. Si se rechaza, `await` lanza una excepción que puede ser capturada con `try/catch`.

```javascript
async function obtenerUsuario(id) {
  const respuesta = await fetch(`/api/usuarios/${id}`);
  if (!respuesta.ok) throw new Error('Error en la petición');
  return respuesta.json();
}

// Uso
obtenerUsuario(1).then(usuario => console.log(usuario));
```

### Manejo de errores

Se usa `try/catch` alrededor de las expresiones `await`:

```javascript
async function main() {
  try {
    const datos = await fetch('/api');
    // ...
  } catch (error) {
    console.error('Falló:', error);
  }
}
```

También se puede capturar el rechazo en el nivel de llamada agregando `.catch` a la función async invocada, ya que devuelve una promesa.

### Ejecución secuencial vs paralela

- **Secuencial**: cada `await` espera a que termine la operación anterior.
  ```javascript
  const a = await obtenerA();
  const b = await obtenerB(); // no empieza hasta que termine a
  ```
- **Paralela**: se inician las promesas sin `await` y luego se espera a todas.
  ```javascript
  const promesaA = obtenerA();
  const promesaB = obtenerB();
  const [a, b] = await Promise.all([promesaA, promesaB]);
  ```
  Esto es fundamental para reducir tiempos de carga.

### Top-level await (módulos ES)

En módulos ES, `await` puede usarse fuera de una función `async`, en el nivel superior del módulo. Esto hace que el módulo espere la resolución de la promesa antes de completar su carga. Disponible en navegadores y Node.js.

```javascript
const config = await fetch('/config.json').then(r => r.json());
export const apiUrl = config.apiUrl;
```

### Iteración asíncrona y `for await...of`

Se puede iterar sobre iterables asíncronos (que implementan `Symbol.asyncIterator`):

```javascript
async function* generarPáginas(url) {
  let pagina = 1;
  while (true) {
    const res = await fetch(`${url}?page=${pagina}`);
    const datos = await res.json();
    if (datos.length === 0) break;
    yield datos;
    pagina++;
  }
}

for await (const pagina of generarPáginas('/api/items')) {
  console.log(pagina);
}
```

### Consideraciones y buenas prácticas

- No marcar como `async` una función que no usa `await`; añade una promesa innecesaria.
- No abusar de `await` secuencial cuando se puede ejecutar en paralelo.
- En un `.forEach` o `map` asíncrono, usar `Promise.all` en lugar de esperar en cada iteración.
- Al combinar `async/await` con métodos de arrays, recordar que `async (item) => ...` devuelve promesas. `arr.map(async ...)` devuelve un array de promesas, por lo que se debe envolver con `Promise.all` si se necesita esperar a todas.
- `await` puede usarse con cualquier "thenable" (objeto con método `then`), no solo promesas nativas.

---

## 04-fetch-api.md

### `fetch()` básico

`fetch` es una API moderna para realizar solicitudes HTTP. Reemplaza a `XMLHttpRequest`. Es parte del objeto `window` (navegadores) y también está disponible en Node.js a partir de la versión 18 (experimental antes).

`fetch(url, options?)` retorna una **promesa** que se resuelve en un objeto `Response` una vez que la respuesta esté disponible (cuando se reciben los headers). No rechaza si el servidor devuelve un error HTTP (404, 500); solo rechaza en caso de error de red o si la solicitud es abortada.

```javascript
fetch('/api/datos')
  .then(response => {
    if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
    return response.json();
  })
  .then(data => console.log(data))
  .catch(error => console.error('Error de red:', error));
```

### El objeto Response

Propiedades y métodos principales:

- `response.ok`: `true` si el estado HTTP está entre 200-299.
- `response.status`: código de estado HTTP.
- `response.statusText`: texto del estado.
- `response.headers`: objeto `Headers` (iterable, con `get(name)`, `has(name)`, etc.).
- Métodos para leer el cuerpo (devuelven promesas):
  - `json()`: parsea como JSON.
  - `text()`: devuelve texto.
  - `blob()`: devuelve un `Blob`.
  - `arrayBuffer()`: devuelve `ArrayBuffer`.
  - `formData()`: devuelve `FormData`.
- El cuerpo solo puede leerse una vez; después de consumirlo, los métodos devuelven promesas rechazadas.

### Opciones de la solicitud (Request)

El segundo parámetro de `fetch` es un objeto de configuración:

```javascript
fetch(url, {
  method: 'POST',               // GET, POST, PUT, DELETE, etc.
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer token'
  },
  body: JSON.stringify(datos),  // cuerpo de la petición
  mode: 'cors',                 // same-origin, no-cors, cors
  credentials: 'include',       // omit, same-origin, include
  cache: 'default',             // default, no-store, reload, no-cache, force-cache, only-if-cached
  redirect: 'follow',           // follow, error, manual
  referrerPolicy: 'no-referrer-when-downgrade',
  signal: abortController.signal // para cancelar la solicitud
});
```

#### Envío de datos

- JSON: `body: JSON.stringify(objeto)`, `Content-Type: application/json`.
- Formularios: `body: new FormData(formulario)`; el navegador establece el Content-Type automáticamente (incluyendo `multipart/form-data`).
- Datos URL-encoded: `body: new URLSearchParams({clave: 'valor'})`.
- Blob / ArrayBuffer: para subir archivos binarios.

### Manejo de errores

- Errores de red (DNS no resuelto, conexión rechazada) provocan rechazo de la promesa.
- Errores HTTP (4xx, 5xx) **no** provocan rechazo. Debe comprobarse `response.ok`.
- Errores al parsear la respuesta (ej. JSON mal formado) provocan rechazo en el método de lectura.

### Cancelación con AbortController

Se puede cancelar una solicitud `fetch` mediante un `AbortSignal`:

```javascript
const controller = new AbortController();
const timeoutId = setTimeout(() => controller.abort(), 5000);

try {
  const response = await fetch(url, { signal: controller.signal });
  // ...
} catch (err) {
  if (err.name === 'AbortError') {
    console.log('Solicitud cancelada');
  }
} finally {
  clearTimeout(timeoutId);
}
```

La señal también puede pasarse a múltiples solicitudes para cancelarlas en grupo.

### Streaming de la respuesta

`fetch` permite leer la respuesta como un stream usando `response.body` (un `ReadableStream`). Se puede procesar por chunks en lugar de esperar el cuerpo completo.

```javascript
const response = await fetch('/api/grande');
const reader = response.body.getReader();
while (true) {
  const { done, value } = await reader.read();
  if (done) break;
  console.log('Recibido chunk de', value.length, 'bytes');
}
```

### Comparación con `XMLHttpRequest`

| Característica     | fetch                            | XMLHttpRequest             |
|--------------------|----------------------------------|----------------------------|
| Promesas           | Sí                               | No (requiere callbacks)    |
| Cancelación        | AbortController                  | `xhr.abort()`              |
| Progreso           | No nativo (requiere stream manual) | Evento `progress`        |
| Soporte de cookies | `credentials: 'include'`         | `withCredentials`          |
| Sincrónico         | No (siempre asíncrono)           | Sí (obsoleto)              |

---

## 05-temporizadores.md

### `setTimeout` y `clearTimeout`

`setTimeout(callback, delay, ...args)` programa la ejecución de una función una sola vez después de un retraso mínimo expresado en milisegundos. Retorna un identificador numérico que puede usarse con `clearTimeout(id)` para cancelar la ejecución.

```javascript
const id = setTimeout(() => {
  console.log('Ejecutado');
}, 2000);

// Cancelar
clearTimeout(id);
```

- El retraso no es garantizado; es el tiempo mínimo después del cual el callback se coloca en la cola de macrotareas. Si la pila está ocupada, la ejecución se demora más.
- Los argumentos adicionales se pasan al callback (evitando closures).
- En navegadores, el retraso mínimo se fuerza a 4 ms para timeouts anidados (a partir del quinto anidado) y 0 ms en otros contextos (aunque 0 se comporta como ≥0). En Node.js, es 1 ms.

### `setInterval` y `clearInterval`

`setInterval(callback, delay, ...args)` ejecuta repetidamente el callback con un intervalo fijo entre el inicio de cada ejecución (no entre el final de una y el inicio de la siguiente). Retorna un identificador para `clearInterval(id)`.

```javascript
const intervalId = setInterval(() => {
  console.log('Tick');
}, 1000);

// Detener después de 5 segundos
setTimeout(() => clearInterval(intervalId), 5000);
```

#### Inconvenientes de `setInterval`

- **Deriva de tiempo**: si el callback tarda más que el intervalo, las ejecuciones se solapan o se encolan, pudiendo ejecutarse sin pausa cuando el event loop está libre.
- **No espera a que termine la anterior**: para tareas asíncronas, puede haber múltiples instancias en vuelo.
- **Falta de control**: no se puede detener fácilmente una ejecución condicional sin perder el intervalo.

#### Alternativa: `setTimeout` recursivo

Programar el siguiente `setTimeout` al final del callback garantiza un tiempo **entre ejecuciones** (no entre inicios):

```javascript
let timerId;
function tarea() {
  console.log('Tick');
  timerId = setTimeout(tarea, 1000);
}
timerId = setTimeout(tarea, 1000);
// Para cancelar: clearTimeout(timerId);
```

Esto evita solapamientos y se adapta a la duración real de la tarea.

### `requestAnimationFrame` (navegador)

Aunque no es un temporizador clásico, permite ejecutar una función antes del siguiente repintado del navegador, con una frecuencia de ~60 fps (16.7ms). Ideal para animaciones eficientes.

```javascript
function animar() {
  // actualizar animación
  requestAnimationFrame(animar);
}
requestAnimationFrame(animar);
```

El navegador pausa automáticamente los callbacks cuando la pestaña no está visible, ahorrando recursos.

### Temporizadores y el event loop

Tanto `setTimeout` como `setInterval` colocan sus callbacks en la cola de **macrotareas**. Entre macrotareas, el event loop procesa todas las microtareas (promesas). Por lo tanto, un callback de `setTimeout(..., 0)` se ejecutará después de que todas las microtareas pendientes se hayan completado.

### Retraso mínimo y anidamiento

Los navegadores aplican una restricción: después de cinco niveles de anidamiento de `setTimeout`/`setInterval`, el retraso mínimo se fuerza a 4 ms. Esto evita que bucles recursivos bloqueen el event loop.

### `this` en callbacks de temporizadores

En callbacks tradicionales (no arrow), `this` en el callback de `setTimeout`/`setInterval` es el objeto global (`window` en navegadores, `global` en Node) en modo no estricto, o `undefined` en modo estricto. Para conservar el contexto, se puede usar una función flecha, `bind`, o capturar `this` en una variable.

### Temporizadores en Node.js: `setImmediate` y `process.nextTick`

- `process.nextTick(callback)`: coloca el callback en la cola de **microtareas propias de Node** (antes que las promesas en el ciclo de Node). Se ejecuta inmediatamente después de la operación actual, antes de cualquier macrotarea o microtarea de promesa.
- `setImmediate(callback)`: similar a `setTimeout(callback, 0)`, pero en Node se ejecuta en una fase específica del event loop (check phase) después de la I/O.

En código para navegador estas funciones no existen; usar `Promise.resolve().then()` para comportamiento de microtarea y `setTimeout(fn,0)` para macrotarea.

### Buenas prácticas

- Preferir `setTimeout` recursivo a `setInterval` para tareas asíncronas o cuando la duración es variable.
- Limpiar siempre temporizadores que ya no sean necesarios para evitar fugas de memoria.
- No confiar en tiempos precisos para lógica crítica; los temporizadores en JavaScript no son en tiempo real.
- Para animaciones, usar `requestAnimationFrame` en lugar de `setTimeout` o `setInterval`.
- En aplicaciones de larga duración, considerar `Web Workers` para tareas costosas que puedan interferir con los temporizadores.

---

## 06-event-loop.md

### El modelo de concurrencia de JavaScript

JavaScript es **single-threaded**: tiene un único hilo principal de ejecución. Sin embargo, puede delegar operaciones en APIs externas (temporizadores, E/S, red) proporcionadas por el entorno de ejecución (navegador, Node.js). Para coordinar la ejecución de código, el entorno implementa el **event loop** (bucle de eventos).

El event loop es el mecanismo que permite que JavaScript realice operaciones no bloqueantes, gestionando la ejecución de múltiples tareas pendientes en un solo hilo.

### Componentes del modelo

#### 1. Pila de llamadas (Call Stack)

Es una estructura de datos LIFO (Last In, First Out) que registra la posición actual en la ejecución del programa. Cuando se invoca una función, se crea un marco (frame) y se apila; al retornar, se desapila.

```javascript
function primera() {
  segunda();
}
function segunda() {
  console.log("Hola");
}
primera();
// Call stack: [] -> [primera] -> [primera, segunda] -> [primera] -> []
```

Un stack overflow ocurre cuando la pila supera su límite (por recursión infinita o muy profunda).

#### 2. APIs del entorno (Web APIs / Node APIs)

Funciones como `setTimeout`, `fetch`, `addEventListener`, `fs.readFile` (Node) no son parte del motor JavaScript, sino del entorno. Permiten operaciones asíncronas. Cuando se llaman, sus callbacks se registran y las operaciones se procesan fuera del hilo principal.

#### 3. Colas de tareas (Task Queues)

Cuando una operación asíncrona se completa, su callback no se ejecuta inmediatamente, sino que se coloca en una **cola de tareas**. Existen dos tipos principales:

- **Macrotareas** (Task Queue): para la mayoría de callbacks asíncronos.
- **Microtareas** (Microtask Queue): para callbacks de promesas y otros.

#### 4. El Event Loop

Es un bucle continuo que realiza los siguientes pasos conceptuales:

1. **Ejecutar tarea síncrona actual** hasta que la pila de llamadas esté vacía (es decir, ejecutar el script hasta el final o hasta que no haya más funciones que retornen).
2. **Procesar todas las microtareas** pendientes. Mientras haya microtareas en la cola, las ejecuta una a una, y si durante su ejecución se encolan más microtareas, también se procesan en este mismo paso hasta dejar la cola vacía.
3. **Opcionalmente, renderizar** la interfaz (en navegadores) si es necesario.
4. **Tomar la próxima macrotarea** de la cola de macrotareas y ejecutarla (volviendo al paso 1 con la pila de esa macrotarea).

Este ciclo se repite indefinidamente. El event loop orquesta la ejecución de tareas, microtareas y, en navegadores, el renderizado.

### Visualización con un ejemplo

```javascript
console.log('A');

setTimeout(() => console.log('B'), 0);

Promise.resolve().then(() => console.log('C'));

console.log('D');
```

**Salida:** A, D, C, B.

**Explicación paso a paso:**

1. `console.log('A')` se ejecuta (pila → []).
2. `setTimeout` registra el callback y lo coloca en la cola de **macrotareas**.
3. `Promise.resolve().then()` coloca su callback en la cola de **microtareas**.
4. `console.log('D')` se ejecuta.
5. La pila queda vacía → se procesan **microtareas**: `console.log('C')`.
6. Microtareas vacías → se toma la siguiente **macrotarea**: `console.log('B')`.

### El event loop en Node.js

Node.js implementa el event loop basado en `libuv`. Tiene distintas **fases**:

- **Timers**: ejecuta callbacks de `setTimeout` y `setInterval`.
- **Pending callbacks**: para operaciones de sistema (errores de socket, por ejemplo).
- **Idle, prepare**: uso interno.
- **Poll**: recupera nuevos eventos de I/O; ejecuta callbacks de I/O (excepto `setImmediate` y timers).
- **Check**: ejecuta `setImmediate`.
- **Close callbacks**: callbacks de cierre (ej. `socket.on('close')`).

Entre cada fase, Node.js procesa las microtareas (tanto `process.nextTick` como promesas), con prioridad para `nextTick`.

#### `process.nextTick` vs microtareas de promesas

`process.nextTick` coloca su callback en una cola especial que se procesa **inmediatamente después de la operación actual y antes de cualquier otra microtarea**. Tiene mayor prioridad que las promesas.

```javascript
// Node.js
Promise.resolve().then(() => console.log('Promesa'));
process.nextTick(() => console.log('nextTick'));
// Salida: nextTick, Promesa
```

### Consecuencias importantes

- Las microtareas pueden bloquear la ejecución de macrotareas si se encadenan infinitamente.
- Un callback de `setTimeout(..., 0)` no se ejecuta inmediatamente; se espera a que la pila actual y todas las microtareas pendientes terminen.
- En navegadores, el renderizado se intercala entre macrotareas (después de vaciar microtareas), pero no interrumpe una microtarea.

---

## 07-microtareas-vs-macrotareas.md

### Definición de macrotarea (Task)

Una macrotarea es una unidad de trabajo que se encola en la **Task Queue**. El event loop ejecuta una macrotarea a la vez. Ejemplos:

- Ejecución del script completo (primer script).
- Callbacks de `setTimeout`, `setInterval`.
- Eventos del DOM (`click`, `keydown`).
- `XMLHttpRequest`, `fetch` (aunque `fetch` usa promesas, el callback de finalización de red genera una macrotarea para resolver la promesa, que a su vez genera microtareas).
- `setImmediate` (Node.js).
- `requestAnimationFrame` (se considera una macrotarea especial de renderizado).

### Definición de microtarea (Microtask)

Las microtareas son tareas de alta prioridad que se ejecutan **inmediatamente después de que la pila de llamadas se vacíe**, pero **antes** de la siguiente macrotarea. Se almacenan en la **Microtask Queue**. Ejemplos:

- `.then()`, `.catch()`, `.finally()` de promesas.
- `queueMicrotask(fn)` (API explícita).
- `MutationObserver` (navegador).
- `process.nextTick` (Node.js, con su propia cola de prioridad aún mayor).

### Flujo de ejecución

1. Se ejecuta el script actual (macrotarea inicial).
2. Cuando la pila queda vacía, se drena **completamente** la cola de microtareas. Si al ejecutar una microtarea se encolan nuevas microtareas, estas también se procesan en esta misma fase (hasta que la cola quede vacía).
3. (Navegador) Se puede realizar un repintado/reflujo si es necesario.
4. Se toma la siguiente macrotarea de la cola y se repite.

### Ejemplo comparativo

```javascript
console.log('Inicio');

setTimeout(() => console.log('Timeout 1'), 0);
setTimeout(() => console.log('Timeout 2'), 0);

Promise.resolve()
  .then(() => console.log('Promesa 1'))
  .then(() => console.log('Promesa 2'));

queueMicrotask(() => console.log('Microtask explícita'));

console.log('Fin');
```

**Salida garantizada:**

```
Inicio
Fin
Promesa 1
Microtask explícita
Promesa 2
Timeout 1
Timeout 2
```

**Análisis:**

- Las microtareas (`Promesa 1`, `Microtask explícita`, `Promesa 2`) se ejecutan antes que cualquier macrotarea.
- Dentro de las microtareas, el orden es: `then` de la primera promesa, `queueMicrotask`, `then` encadenado de la segunda promesa (porque el `then` de `Promesa 1` encola `Promesa 2` como microtarea adicional que se procesa en la misma fase).
- Las macrotareas (`Timeout 1`, `Timeout 2`) se ejecutan en orden de encolamiento después de vaciar todas las microtareas.

### Interacción entre macrotareas y microtareas

Cuando una macrotarea se ejecuta, puede generar nuevas microtareas. Antes de pasar a la siguiente macrotarea, el event loop drena todas esas microtareas.

```javascript
setTimeout(() => {
  console.log('Macrotarea');
  Promise.resolve().then(() => console.log('Micro dentro de macro'));
}, 0);

Promise.resolve().then(() => {
  console.log('Micro inicial');
  setTimeout(() => console.log('Macro dentro de micro'), 0);
});
```

**Salida:**

```
Micro inicial
Macrotarea
Micro dentro de macro
Macro dentro de micro
```

**Explicación:**
1. Script termina → se drena micro: `Micro inicial` (encola `setTimeout` en macrotareas).
2. Se toma siguiente macrotarea: `Macrotarea` (encola promesa en micro).
3. Antes de siguiente macrotarea, se drena micro: `Micro dentro de macro`.
4. Siguiente macrotarea: `Macro dentro de micro`.

### Implicaciones y riesgos

- **Bloqueo del event loop:** Si una microtarea encola otra microtarea recursivamente, nunca se procesarán macrotareas ni se renderizará (en navegador), congelando la UI.
- **Diferencias entre `process.nextTick` y promesas en Node:** `nextTick` tiene prioridad incluso sobre las promesas, lo que puede causar inanición (starvation) de promesas si se abusa.
- **`queueMicrotask`** es la forma estándar de encolar microtareas explícitamente sin depender de promesas.

### Tabla resumen

| Tipo       | Ejemplos                                   | Prioridad relativa |
|------------|--------------------------------------------|---------------------|
| Macrotarea | `setTimeout`, eventos, `setImmediate`      | Menor               |
| Microtarea | `then/catch`, `queueMicrotask`             | Mayor (se drena entre macrotareas) |
| NextTick   | `process.nextTick` (Node)                  | Máxima (antes que promesas) |

### Buenas prácticas

- No usar microtareas para trabajos pesados o recursivos infinitos.
- Preferir macrotareas (`setTimeout`) para ceder el control al event loop y no bloquear la UI.
- Al implementar bibliotecas asíncronas, considerar si se debe ejecutar algo sincrónicamente, como microtarea o como macrotarea para garantizar un orden específico.

---

## 08-abortcontroller.md

### El problema de la cancelación de operaciones asíncronas

Tradicionalmente, cancelar una operación asíncrona en JavaScript era complicado. `setTimeout`/`setInterval` tenían sus propios métodos (`clearTimeout`), pero otras APIs como `fetch` o promesas arbitrarias no ofrecían un mecanismo estándar de cancelación. `AbortController` y `AbortSignal` resuelven este problema proporcionando una interfaz unificada para señalar la cancelación.

### AbortController y AbortSignal

Un `AbortController` es un objeto que permite abortar una o varias operaciones asíncronas a través de una señal asociada.

#### Creación

```javascript
const controller = new AbortController();
const signal = controller.signal;
```

- `controller.signal`: devuelve una instancia de `AbortSignal` asociada.
- `controller.abort(reason?)`: marca la señal como abortada y opcionalmente establece un motivo (reason). Dispara el evento `abort` en la señal.

#### Propiedades del AbortSignal

- `signal.aborted`: booleano, `true` si la señal ha sido abortada.
- `signal.reason`: el motivo del aborto (el argumento pasado a `abort()`, o un `DOMException` por defecto).
- `signal.addEventListener('abort', callback)`: permite escuchar el evento de aborto.
- `signal.throwIfAborted()`: método de conveniencia que lanza el `reason` si la señal está abortada (útil para comprobaciones tempranas).

```javascript
const controller = new AbortController();
controller.signal.addEventListener('abort', () => {
  console.log('Abortado con motivo:', controller.signal.reason);
});
controller.abort('El usuario canceló');
```

### Uso con fetch

La API `fetch` acepta una propiedad `signal` en sus opciones. Si la señal se aborta, la promesa de `fetch` se rechaza con un `AbortError`.

```javascript
async function obtenerConTimeout(url, ms) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), ms);
  
  try {
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.json();
  } catch (error) {
    if (error.name === 'AbortError') {
      console.log('Solicitud cancelada por timeout');
    }
    throw error;
  }
}
```

#### Detalles importantes

- Después de abortar, el `AbortController` no puede reutilizarse; se debe crear uno nuevo para una nueva operación.
- La señal puede pasarse a múltiples operaciones `fetch`; una sola llamada a `abort()` las cancelará todas.
- El `AbortError` es una `DOMException` con nombre `"AbortError"`. Se puede verificar con `error.name === 'AbortError'`.

### Cancelación de promesas genéricas

`AbortSignal` no cancela automáticamente cualquier promesa; debe integrarse manualmente. Patrón común: envolver una promesa en una carrera con una promesa que se rechaza al abortar.

```javascript
function conCancelacion(promesa, signal) {
  return new Promise((resolve, reject) => {
    if (signal.aborted) {
      return reject(signal.reason);
    }
    
    const onAbort = () => reject(signal.reason);
    signal.addEventListener('abort', onAbort);
    
    promesa.then(
      result => {
        signal.removeEventListener('abort', onAbort);
        resolve(result);
      },
      error => {
        signal.removeEventListener('abort', onAbort);
        reject(error);
      }
    );
  });
}

// Uso
const controller = new AbortController();
const operacion = fetch('/api/datos', { signal: controller.signal });
const conCancel = conCancelacion(operacion, controller.signal);
controller.abort(); // rechazará la promesa
```

Nota: `fetch` ya soporta `signal` nativamente, así que este envoltorio no es necesario para `fetch`. Es útil para otras promesas que no integran `AbortSignal`.

### Cancelación en APIs modernas

Cada vez más APIs aceptan `AbortSignal`:

- `fetch()`
- `addEventListener` tiene una opción `{ signal }` para eliminar el listener cuando se aborte.
  ```javascript
  const controller = new AbortController();
  window.addEventListener('resize', handler, { signal: controller.signal });
  // Más tarde, controller.abort() elimina el listener
  ```
- `ReadableStream`, `WritableStream` en algunos contextos.
- `queueMicrotask` no lo soporta; las microtareas no son cancelables.

### Cancelación de streams

En streams, `AbortSignal` se puede usar para cancelar una lectura o escritura.

```javascript
const controller = new AbortController();
const readable = response.body;
const reader = readable.getReader({ mode: 'byob' }); // no acepta signal directamente en todas partes
// Pero se puede integrar manualmente:
controller.signal.addEventListener('abort', () => reader.cancel());
```

### Buenas prácticas

- **Siempre limpiar recursos** cuando se aborta (timers, listeners, streams).
- **Pasar la señal** a todas las capas involucradas para que la cancelación se propague correctamente.
- **No ignorar el `AbortError`** sin más; si no se espera, podría ser síntoma de un bug.
- **Reutilización**: un `AbortController` es de un solo uso. Para operaciones repetitivas, crear uno nuevo cada vez.
- **Compatibilidad**: `AbortController` está disponible en navegadores modernos y Node.js (desde v15 con flag, estable en v16+). En versiones antiguas se puede usar un polyfill.

### Ejemplo completo: solicitud con timeout y cancelación por usuario

```javascript
let controller;

async function cargarDatos() {
  // Cancelar solicitud previa si existe
  if (controller) controller.abort();
  controller = new AbortController();
  const { signal } = controller;

  try {
    const response = await fetch('/api/datos', { signal });
    const datos = await response.json();
    mostrar(datos);
  } catch (err) {
    if (err.name === 'AbortError') {
      console.log('Solicitud cancelada');
    } else {
      console.error('Error:', err);
    }
  }
}

document.getElementById('btn-cancelar').addEventListener('click', () => {
  if (controller) controller.abort();
});
```

