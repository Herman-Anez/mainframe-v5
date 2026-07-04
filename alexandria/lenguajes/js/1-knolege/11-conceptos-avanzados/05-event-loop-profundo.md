# Event loop profundo

## Arquitectura del Event Loop

JavaScript es **single-threaded**, pero el entorno (navegador o Node.js) proporciona **APIs asíncronas** que se ejecutan fuera del hilo principal. El **Event Loop** coordina la ejecución de código, recogiendo eventos y tareas de colas cuando la pila de llamadas está vacía.

### Componentes clave

- **Call Stack (pila de llamadas)**: estructura LIFO que ejecuta el código síncrono. Cada función invocada añade un frame.
- **Web APIs / Node APIs**: funciones como `setTimeout`, `fetch`, `fs.readFile` que procesan trabajo en segundo plano.
- **Colas de tareas**:
  - **Macrotareas (Task Queue)**: timers (`setTimeout`, `setInterval`), I/O, eventos de UI, `setImmediate` (Node).
  - **Microtareas (Microtask Queue)**: promesas (`.then`, `catch`, `finally`), `queueMicrotask`, `MutationObserver`.

### Flujo del Event Loop (Navegador)

1. Ejecuta el script actual (macrotarea inicial) hasta vaciar la pila.
2. **Vacía la cola de microtareas** completamente, incluyendo las que se agreguen durante este proceso.
3. **Renderizado**: si hay cambios pendientes en el DOM y el navegador lo considera oportuno, se realiza un repaint.
4. **Próxima macrotarea**: se toma una tarea de la cola de macrotareas y se ejecuta (vuelve al paso 1).

Este ciclo se repite constantemente.

### Visualización con un ejemplo

```javascript
console.log('A');

setTimeout(() => console.log('B'), 0);

Promise.resolve()
  .then(() => console.log('C'))
  .then(() => console.log('D'));

console.log('E');
```

**Salida:** A, E, C, D, B.

**Explicación paso a paso:**
- Script se ejecuta (macrotarea): log A, `setTimeout` encola macrotarea B, promesas encolan microtareas C y luego D, log E.
- Pila vacía → microtareas: se ejecutan C y D.
- Microtareas vacías → se toma siguiente macrotarea: B.

### Bloqueo del Event Loop

Si una tarea (especialmente una microtarea) no termina o encadena microtareas infinitamente, el bucle nunca procesará macrotareas ni renderizará, congelando la UI.

```javascript
function microInfinita() {
  Promise.resolve().then(microInfinita);
}
// Esto bloqueará la página
```

## Diferencias en Node.js

Node.js tiene fases específicas en su event loop (basado en `libuv`):

1. **Timers**: ejecuta callbacks de `setTimeout` y `setInterval`.
2. **Pending callbacks**: para errores de sistema y ciertos callbacks diferidos.
3. **Idle, prepare** (uso interno).
4. **Poll**: recupera nuevos eventos de I/O y ejecuta sus callbacks.
5. **Check**: ejecuta `setImmediate`.
6. **Close callbacks**: callbacks de cierre (ej. `socket.on('close')`).

Entre cada fase, Node procesa las **microtareas** (promesas y `process.nextTick`). `process.nextTick` tiene prioridad incluso sobre las promesas.

```javascript
// En Node.js
Promise.resolve().then(() => console.log('Promesa'));
process.nextTick(() => console.log('nextTick'));
// Salida: nextTick, Promesa
```

## `setTimeout` vs `setImmediate` vs `nextTick`

- `setTimeout(fn, 0)`: la tarea se encola en la fase de timers; su ejecución depende de cuándo se llegue a esa fase.
- `setImmediate(fn)`: se ejecuta en la fase check, después de la poll (I/O).
- `process.nextTick(fn)`: no es una microtarea, sino una cola interna de Node que se ejecuta **inmediatamente después de la operación actual**, antes de cualquier otra microtarea o fase. Puede causar inanición de I/O si se abusa.

## Macrotareas y microtareas en detalle

### Macrotareas más comunes

- `setTimeout`, `setInterval`
- Eventos de usuario (`click`, `keydown`)
- `requestAnimationFrame` (se considera una tarea de renderizado, con tiempo específico)
- `fetch` (la resolución de la promesa es una microtarea, pero la recepción de la respuesta puede implicar macrotareas internas)

### Microtareas más comunes

- `.then`, `.catch`, `.finally`
- `queueMicrotask(fn)`
- `MutationObserver`
- `await` (la reanudación tras un `await` se encola como microtarea)

### Ejemplo complejo

```javascript
setTimeout(() => console.log('1'), 0);

new Promise(resolve => {
  console.log('2');
  resolve();
}).then(() => console.log('3'));

console.log('4');

queueMicrotask(() => console.log('5'));
```

Salida: 2, 4, 3, 5, 1.
- El script es la macrotarea inicial: log 2, encola micro .then (3), log 4.
- Al final del script, la pila vacía → microtareas: 3, luego queueMicrotask 5.
- Luego macrotarea: 1.

## Implicaciones en el desarrollo

- **No bloquear el event loop** con operaciones síncronas pesadas (bucles largos, cálculos intensivos). Usar `Web Workers` o dividir en tareas con `setTimeout`/`requestAnimationFrame`.
- **Priorizar microtareas solo para lo necesario**, ya que se ejecutan antes que el renderizado. Demasiadas microtareas seguidas pueden retrasar la actualización visual.
- **Utilizar `requestAnimationFrame` para animaciones** porque se sincroniza con el ciclo de renderizado.
- **Comprender el orden** para evitar condiciones de carrera sutiles entre promesas y timers.

## Herramientas de depuración

Los navegadores modernos y Node.js ofrecen herramientas de performance que muestran el event loop, tareas y microtareas, lo que ayuda a encontrar bloqueos y optimizar la asincronía.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Symbols iteradores](04-symbols-iteradores.md) | [🏠 Inicio](../index.md) | [Web workers ▶](06-web-workers.md) |
