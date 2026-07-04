# Temporizadores

## `setTimeout` y `clearTimeout`

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

## `setInterval` y `clearInterval`

`setInterval(callback, delay, ...args)` ejecuta repetidamente el callback con un intervalo fijo entre el inicio de cada ejecución (no entre el final de una y el inicio de la siguiente). Retorna un identificador para `clearInterval(id)`.

```javascript
const intervalId = setInterval(() => {
  console.log('Tick');
}, 1000);

// Detener después de 5 segundos
setTimeout(() => clearInterval(intervalId), 5000);
```

### Inconvenientes de `setInterval`

- **Deriva de tiempo**: si el callback tarda más que el intervalo, las ejecuciones se solapan o se encolan, pudiendo ejecutarse sin pausa cuando el event loop está libre.
- **No espera a que termine la anterior**: para tareas asíncronas, puede haber múltiples instancias en vuelo.
- **Falta de control**: no se puede detener fácilmente una ejecución condicional sin perder el intervalo.

### Alternativa: `setTimeout` recursivo

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

## `requestAnimationFrame` (navegador)

Aunque no es un temporizador clásico, permite ejecutar una función antes del siguiente repintado del navegador, con una frecuencia de ~60 fps (16.7ms). Ideal para animaciones eficientes.

```javascript
function animar() {
  // actualizar animación
  requestAnimationFrame(animar);
}
requestAnimationFrame(animar);
```

El navegador pausa automáticamente los callbacks cuando la pestaña no está visible, ahorrando recursos.

## Temporizadores y el event loop

Tanto `setTimeout` como `setInterval` colocan sus callbacks en la cola de **macrotareas**. Entre macrotareas, el event loop procesa todas las microtareas (promesas). Por lo tanto, un callback de `setTimeout(..., 0)` se ejecutará después de que todas las microtareas pendientes se hayan completado.

## Retraso mínimo y anidamiento

Los navegadores aplican una restricción: después de cinco niveles de anidamiento de `setTimeout`/`setInterval`, el retraso mínimo se fuerza a 4 ms. Esto evita que bucles recursivos bloqueen el event loop.

## `this` en callbacks de temporizadores

En callbacks tradicionales (no arrow), `this` en el callback de `setTimeout`/`setInterval` es el objeto global (`window` en navegadores, `global` en Node) en modo no estricto, o `undefined` en modo estricto. Para conservar el contexto, se puede usar una función flecha, `bind`, o capturar `this` en una variable.

## Temporizadores en Node.js: `setImmediate` y `process.nextTick`

- `process.nextTick(callback)`: coloca el callback en la cola de **microtareas propias de Node** (antes que las promesas en el ciclo de Node). Se ejecuta inmediatamente después de la operación actual, antes de cualquier macrotarea o microtarea de promesa.
- `setImmediate(callback)`: similar a `setTimeout(callback, 0)`, pero en Node se ejecuta en una fase específica del event loop (check phase) después de la I/O.

En código para navegador estas funciones no existen; usar `Promise.resolve().then()` para comportamiento de microtarea y `setTimeout(fn,0)` para macrotarea.

## Buenas prácticas

- Preferir `setTimeout` recursivo a `setInterval` para tareas asíncronas o cuando la duración es variable.
- Limpiar siempre temporizadores que ya no sean necesarios para evitar fugas de memoria.
- No confiar en tiempos precisos para lógica crítica; los temporizadores en JavaScript no son en tiempo real.
- Para animaciones, usar `requestAnimationFrame` en lugar de `setTimeout` o `setInterval`.
- En aplicaciones de larga duración, considerar `Web Workers` para tareas costosas que puedan interferir con los temporizadores.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Fetch API](04-fetch-api.md) | [🏠 Inicio](../index.md) | [Event loop ▶](06-event-loop.md) |
