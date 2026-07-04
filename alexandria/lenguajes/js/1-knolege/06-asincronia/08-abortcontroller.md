# Abortcontroller

## El problema de la cancelación de operaciones asíncronas

Tradicionalmente, cancelar una operación asíncrona en JavaScript era complicado. `setTimeout`/`setInterval` tenían sus propios métodos (`clearTimeout`), pero otras APIs como `fetch` o promesas arbitrarias no ofrecían un mecanismo estándar de cancelación. `AbortController` y `AbortSignal` resuelven este problema proporcionando una interfaz unificada para señalar la cancelación.

## AbortController y AbortSignal

Un `AbortController` es un objeto que permite abortar una o varias operaciones asíncronas a través de una señal asociada.

### Creación

```javascript
const controller = new AbortController();
const signal = controller.signal;
```

- `controller.signal`: devuelve una instancia de `AbortSignal` asociada.
- `controller.abort(reason?)`: marca la señal como abortada y opcionalmente establece un motivo (reason). Dispara el evento `abort` en la señal.

### Propiedades del AbortSignal

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

## Uso con fetch

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

### Detalles importantes

- Después de abortar, el `AbortController` no puede reutilizarse; se debe crear uno nuevo para una nueva operación.
- La señal puede pasarse a múltiples operaciones `fetch`; una sola llamada a `abort()` las cancelará todas.
- El `AbortError` es una `DOMException` con nombre `"AbortError"`. Se puede verificar con `error.name === 'AbortError'`.

## Cancelación de promesas genéricas

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

## Cancelación en APIs modernas

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

## Cancelación de streams

En streams, `AbortSignal` se puede usar para cancelar una lectura o escritura.

```javascript
const controller = new AbortController();
const readable = response.body;
const reader = readable.getReader({ mode: 'byob' }); // no acepta signal directamente en todas partes
// Pero se puede integrar manualmente:
controller.signal.addEventListener('abort', () => reader.cancel());
```

## Buenas prácticas

- **Siempre limpiar recursos** cuando se aborta (timers, listeners, streams).
- **Pasar la señal** a todas las capas involucradas para que la cancelación se propague correctamente.
- **No ignorar el `AbortError`** sin más; si no se espera, podría ser síntoma de un bug.
- **Reutilización**: un `AbortController` es de un solo uso. Para operaciones repetitivas, crear uno nuevo cada vez.
- **Compatibilidad**: `AbortController` está disponible en navegadores modernos y Node.js (desde v15 con flag, estable en v16+). En versiones antiguas se puede usar un polyfill.

## Ejemplo completo: solicitud con timeout y cancelación por usuario

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

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Microtareas vs macrotareas](07-microtareas-vs-macrotareas.md) | [🏠 Inicio](../index.md) | [This global y metodo ▶](../07-this-y-contexto/01-this-global-y-metodo.md) |
