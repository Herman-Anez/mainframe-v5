# Event loop

## El modelo de concurrencia de JavaScript

JavaScript es **single-threaded**: tiene un único hilo principal de ejecución. Sin embargo, puede delegar operaciones en APIs externas (temporizadores, E/S, red) proporcionadas por el entorno de ejecución (navegador, Node.js). Para coordinar la ejecución de código, el entorno implementa el **event loop** (bucle de eventos).

El event loop es el mecanismo que permite que JavaScript realice operaciones no bloqueantes, gestionando la ejecución de múltiples tareas pendientes en un solo hilo.

## Componentes del modelo

### 1. Pila de llamadas (Call Stack)

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

### 2. APIs del entorno (Web APIs / Node APIs)

Funciones como `setTimeout`, `fetch`, `addEventListener`, `fs.readFile` (Node) no son parte del motor JavaScript, sino del entorno. Permiten operaciones asíncronas. Cuando se llaman, sus callbacks se registran y las operaciones se procesan fuera del hilo principal.

### 3. Colas de tareas (Task Queues)

Cuando una operación asíncrona se completa, su callback no se ejecuta inmediatamente, sino que se coloca en una **cola de tareas**. Existen dos tipos principales:

- **Macrotareas** (Task Queue): para la mayoría de callbacks asíncronos.
- **Microtareas** (Microtask Queue): para callbacks de promesas y otros.

### 4. El Event Loop

Es un bucle continuo que realiza los siguientes pasos conceptuales:

1. **Ejecutar tarea síncrona actual** hasta que la pila de llamadas esté vacía (es decir, ejecutar el script hasta el final o hasta que no haya más funciones que retornen).
2. **Procesar todas las microtareas** pendientes. Mientras haya microtareas en la cola, las ejecuta una a una, y si durante su ejecución se encolan más microtareas, también se procesan en este mismo paso hasta dejar la cola vacía.
3. **Opcionalmente, renderizar** la interfaz (en navegadores) si es necesario.
4. **Tomar la próxima macrotarea** de la cola de macrotareas y ejecutarla (volviendo al paso 1 con la pila de esa macrotarea).

Este ciclo se repite indefinidamente. El event loop orquesta la ejecución de tareas, microtareas y, en navegadores, el renderizado.

## Visualización con un ejemplo

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

## El event loop en Node.js

Node.js implementa el event loop basado en `libuv`. Tiene distintas **fases**:

- **Timers**: ejecuta callbacks de `setTimeout` y `setInterval`.
- **Pending callbacks**: para operaciones de sistema (errores de socket, por ejemplo).
- **Idle, prepare**: uso interno.
- **Poll**: recupera nuevos eventos de I/O; ejecuta callbacks de I/O (excepto `setImmediate` y timers).
- **Check**: ejecuta `setImmediate`.
- **Close callbacks**: callbacks de cierre (ej. `socket.on('close')`).

Entre cada fase, Node.js procesa las microtareas (tanto `process.nextTick` como promesas), con prioridad para `nextTick`.

### `process.nextTick` vs microtareas de promesas

`process.nextTick` coloca su callback en una cola especial que se procesa **inmediatamente después de la operación actual y antes de cualquier otra microtarea**. Tiene mayor prioridad que las promesas.

```javascript
// Node.js
Promise.resolve().then(() => console.log('Promesa'));
process.nextTick(() => console.log('nextTick'));
// Salida: nextTick, Promesa
```

## Consecuencias importantes

- Las microtareas pueden bloquear la ejecución de macrotareas si se encadenan infinitamente.
- Un callback de `setTimeout(..., 0)` no se ejecuta inmediatamente; se espera a que la pila actual y todas las microtareas pendientes terminen.
- En navegadores, el renderizado se intercala entre macrotareas (después de vaciar microtareas), pero no interrumpe una microtarea.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Temporizadores](05-temporizadores.md) | [🏠 Inicio](../index.md) | [Microtareas vs macrotareas ▶](07-microtareas-vs-macrotareas.md) |
