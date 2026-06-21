# Web workers

## Introducción a los Web Workers

Los **Web Workers** permiten ejecutar scripts en hilos en segundo plano, separados del hilo principal de la interfaz de usuario. Esto evita que las operaciones costosas bloqueen la página y degraden la experiencia de usuario. Un worker se ejecuta en su propio contexto global (`DedicatedWorkerGlobalScope` o `SharedWorkerGlobalScope`), sin acceso al DOM pero con capacidad para realizar cómputos, manejar peticiones de red y comunicarse con el hilo principal mediante mensajes.

## Creación y ciclo de vida

### Worker dedicado

Se crea con el constructor `Worker` pasando la URL del script.

```javascript
// En el hilo principal
const worker = new Worker('worker.js');

// Enviar un mensaje al worker
worker.postMessage({ tipo: 'calcular', datos: 1000000 });

// Recibir mensajes del worker
worker.onmessage = function(event) {
  console.log('Resultado:', event.data);
};

// Manejo de errores
worker.onerror = function(error) {
  console.error('Error en worker:', error.message);
};

// Terminar el worker
worker.terminate();
```

Dentro del worker (`worker.js`), el contexto global es `self` (similar a `window` pero restringido). Se comunica con `onmessage` y `postMessage`.

```javascript
// worker.js
self.onmessage = function(event) {
  const { tipo, datos } = event.data;
  if (tipo === 'calcular') {
    let suma = 0;
    for (let i = 0; i < datos; i++) {
      suma += Math.sqrt(i);
    }
    self.postMessage({ resultado: suma });
  }
};
```

### Workers compartidos (SharedWorker)

Permiten que varios contextos (p.ej., múltiples pestañas) se comuniquen con el mismo worker. Se identifican mediante un nombre o la misma URL.

```javascript
// Hilo principal (en cada página)
const sharedWorker = new SharedWorker('shared-worker.js');
sharedWorker.port.start(); // necesario para iniciar la comunicación
sharedWorker.port.postMessage({ type: 'increment' });
sharedWorker.port.onmessage = (e) => console.log(e.data);
```

Dentro del shared worker, se usa el evento `connect` para manejar cada conexión:

```javascript
// shared-worker.js
let contador = 0;
self.onconnect = function(e) {
  const port = e.ports[0];
  port.onmessage = function(event) {
    contador++;
    port.postMessage(contador);
  };
};
```

## Comunicación: mensajes y transferencia de datos

`postMessage` puede enviar casi cualquier tipo de dato serializable (copia estructurada): primitivos, objetos planos, arrays, `Date`, `Map`, `Set`, etc. No se pueden enviar funciones, elementos del DOM ni objetos con referencias circulares complejas.

### Transferencia de propiedad (Transferable objects)

Para datos binarios grandes (ArrayBuffer, MessagePort) se puede **transferir** la propiedad en lugar de copiarlos, lo que es mucho más eficiente. Una vez transferidos, el remitente pierde el acceso.

```javascript
const buffer = new ArrayBuffer(1024);
worker.postMessage(buffer, [buffer]);
// buffer ahora está desvinculado en el hilo principal (byteLength = 0)
```

Esto es común en procesamiento de imágenes, video y WebGL.

## Contexto y limitaciones del worker

### APIs disponibles

El `WorkerGlobalScope` proporciona muchas APIs del navegador, pero **no el DOM**. Entre ellas:

- `fetch`, `XMLHttpRequest`
- `setTimeout`, `setInterval`
- `console`
- `navigator` y `location` (solo lectura)
- `importScripts()` para cargar otros scripts de forma síncrona (aunque en workers modernos también se pueden usar módulos ES)
- `WebSocket`, `IndexedDB`

No hay acceso a `window`, `document` o APIs de UI.

### Workers como módulos

Se pueden cargar workers usando módulos ES:

```javascript
const worker = new Worker('worker.js', { type: 'module' });
```

El worker puede entonces usar `import` y `export` dentro de su script.

### Subworkers

Un worker puede crear otros workers (subworkers), generando árboles de hilos. Esto es útil para tareas masivamente paralelas, aunque la latencia de comunicación puede aumentar.

## Casos de uso típicos

- **Procesamiento intensivo de CPU**: cifrado, compresión, análisis de datos, operaciones matemáticas complejas (ej. cálculo de números primos, procesamiento de imágenes con Canvas offscreen).
- **Operaciones de red en segundo plano**: mantener conexiones WebSocket, sincronizar datos.
- **Búsqueda y filtrado de grandes conjuntos de datos en el navegador**.
- **OffscreenCanvas**: permite renderizar gráficos en un worker y transferir el resultado al canvas principal, evitando bloquear la UI.

## Workers en Node.js (`worker_threads`)

Node.js tiene su propia implementación de workers con el módulo `worker_threads`. La API es similar pero con diferencias:

```javascript
const { Worker, isMainThread, parentPort } = require('worker_threads');
if (isMainThread) {
  const worker = new Worker(__filename);
  worker.on('message', console.log);
  worker.postMessage('Hola');
} else {
  parentPort.on('message', msg => parentPort.postMessage(msg.toUpperCase()));
}
```

En Node.js, los workers comparten memoria mediante `SharedArrayBuffer` y pueden usar `Atomics` para sincronización.

## Manejo de errores y depuración

- `worker.onerror` captura errores no manejados dentro del worker.
- Los workers pueden ser inspeccionados en las DevTools del navegador (pestaña "Sources" > "Workers").
- Es importante terminar los workers con `terminate()` cuando ya no se necesiten para evitar fugas de memoria.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Event loop profundo](05-event-loop-profundo.md) | [🏠 Inicio](../index.md) | [Service workers ▶](07-service-workers.md) |
