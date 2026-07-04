# Service workers

## Definición y propósito

Un **Service Worker** es un script que el navegador ejecuta en segundo plano, separado de la página web, y que actúa como un proxy entre la aplicación, la red y la caché. Es la base para crear **Progressive Web Apps (PWA)** con capacidades offline, notificaciones push y sincronización en segundo plano.

El service worker se sitúa entre el navegador y el servidor, interceptando todas las peticiones de red de las páginas que controla.

## Ciclo de vida

1. **Registro**: la página registra un service worker con `navigator.serviceWorker.register('/sw.js')`.
2. **Instalación**: el navegador descarga el script y dispara el evento `install`. Es el momento ideal para precachear recursos.
3. **Activación**: tras la instalación (y cuando no hay páginas usando el worker antiguo), se dispara el evento `activate`. Se suele limpiar cachés antiguas aquí.
4. **Control**: el service worker controla las páginas abiertas bajo su scope. Puede interceptar peticiones con el evento `fetch` y manejar mensajes con `message`.

### Registro

```javascript
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js')
    .then(reg => console.log('Registrado con scope:', reg.scope))
    .catch(err => console.error('Fallo:', err));
}
```

El scope determina qué URLs serán controladas; por defecto es el directorio del script.

### Eventos del ciclo de vida

```javascript
// sw.js
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open('v1').then(cache => {
      return cache.addAll(['/', '/styles.css', '/app.js']);
    })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== 'v1').map(key => caches.delete(key))
      );
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});
```

`event.waitUntil` extiende la vida del evento hasta que la promesa se resuelva, evitando que el worker sea terminado prematuramente.

## Estrategias de caché

- **Cache First**: ideal para recursos estáticos. Intenta servir desde caché, si no está, va a red.
- **Network First**: para datos dinámicos; intenta red y si falla, muestra la versión en caché.
- **Stale-While-Revalidate**: sirve desde caché inmediatamente y actualiza la caché en segundo plano con la respuesta de red.
- **Cache Only / Network Only**: para casos específicos.

Ejemplo de Network First:

```javascript
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
```

## Notificaciones Push

El service worker puede recibir mensajes push del servidor incluso con la aplicación cerrada (si el navegador está abierto) y mostrar notificaciones.

```javascript
self.addEventListener('push', event => {
  const data = event.data.json();
  self.registration.showNotification(data.title, {
    body: data.body,
    icon: '/icon.png'
  });
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(clients.openWindow('/'));
});
```

## Sincronización en segundo plano (Background Sync)

Permite aplazar acciones hasta que el usuario tenga conexión. Se usa en conjunto con el evento `sync`.

```javascript
// En la página
navigator.serviceWorker.ready.then(reg => reg.sync.register('enviar-mensajes'));

// En el service worker
self.addEventListener('sync', event => {
  if (event.tag === 'enviar-mensajes') {
    event.waitUntil(enviarMensajesPendientes());
  }
});
```

## Ciclo de actualización

Cuando se modifica el service worker, el navegador lo descarga pero no lo activa inmediatamente si hay páginas controladas abiertas. El nuevo worker queda en estado `waiting` hasta que todas las pestañas controladas se cierren o se pueda forzar la actualización con `self.skipWaiting()` en el evento `install`. Se puede combinar con `clients.claim()` en el `activate` para tomar control de las páginas sin recargar.

## Límites y consideraciones

- Solo funciona en contextos seguros (HTTPS o localhost).
- El scope es restringido (no puede controlar páginas fuera de su ruta).
- El almacenamiento en caché está sujeto a la cuota general del origen.
- No tiene acceso al DOM, pero sí a `fetch`, `Cache`, `IndexedDB`.
- Los service workers se actualizan cada 24 horas como máximo (el navegador comprueba actualizaciones en cada navegación).

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Web workers](06-web-workers.md) | [🏠 Inicio](../index.md) | [Memoizacion ▶](08-memoizacion.md) |
