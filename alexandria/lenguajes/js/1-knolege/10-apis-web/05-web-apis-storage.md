# Web apis storage

Este archivo complementa la sección de almacenamiento vista anteriormente, centrándose en aspectos avanzados y APIs complementarias. Se dará un repaso a detalles adicionales, límites y API moderna.

## Profundizando en `localStorage` y `sessionStorage`

Ya se cubrieron los métodos básicos. Aquí se añaden detalles importantes:

- **Evento `storage`**: solo se dispara en documentos del mismo origen que **no** fueron los que realizaron el cambio. Su objeto `StorageEvent` incluye `key`, `oldValue`, `newValue`, `url` y el objeto `storageArea` afectado. Es excelente para sincronizar estado entre pestañas.
- **Capacidad y cuotas**: el estándar sugiere un límite de 5 MB por origen, pero los navegadores pueden variar (10 MB en muchos). No existe una API para consultar la cuota disponible para Web Storage. Para cuotas más grandes y consultables se debe usar la **Storage API** (ver más abajo).
- **Manejo de errores**: al exceder la cuota, `setItem` lanza `QuotaExceededError`. Se debe envolver en try/catch si se espera mucho volumen.
- **No apto para datos sensibles**: el almacenamiento es accesible desde JavaScript y vulnerable a XSS. No almacenar tokens de sesión o contraseñas.

## Storage API (StorageManager)

La **Storage API** (no confundir con Web Storage) permite estimar la cuota disponible y el uso actual, y solicitar almacenamiento persistente. Está disponible en `navigator.storage`.

### `navigator.storage.estimate()`

Devuelve una promesa con un objeto `{ quota, usage }` en bytes.

```javascript
const estimacion = await navigator.storage.estimate();
console.log(`Usado: ${estimacion.usage}, Cuota: ${estimacion.quota}`);
```

Esto reporta el uso total de todo el almacenamiento del origen (incluye IndexedDB, Cache API, etc.), no solo Web Storage.

### `navigator.storage.persist()`

Solicita que el almacenamiento del origen sea persistente, es decir, el navegador no lo eliminará automáticamente bajo presión de espacio (aunque el usuario podría hacerlo manualmente). Devuelve `true` si se concede.

```javascript
if (await navigator.storage.persist()) {
  console.log('Almacenamiento persistente concedido');
}
const esPersistente = await navigator.storage.persisted();
```

## Cache API

Parte de los Service Workers, pero accesible desde la página principal, permite almacenar pares Request/Response programáticamente. Es ideal para guardar recursos de red (archivos CSS, JS, imágenes) y hacer que la aplicación funcione offline.

```javascript
const cache = await caches.open('mi-cache-v1');
await cache.add('/estilo.css');       // descarga y guarda
await cache.put('/api/data', new Response(JSON.stringify(datos)));
const respuesta = await cache.match('/api/data');
```

El límite de almacenamiento está sujeto a la cuota general del origen; se puede consultar con `navigator.storage.estimate()`.

## IndexedDB (repaso con promesas)

Como se mencionó en `06-web-storage.md`, IndexedDB es una base de datos transaccional asíncrona. Para un uso más moderno, la biblioteca `idb` proporciona una envoltura de promesas. Conceptos clave:

- `indexedDB.open(nombre, version)`: apertura de base de datos.
- `onupgradeneeded`: crear/actualizar almacenes de objetos (`createObjectStore`) e índices.
- Transacciones: `db.transaction(store, mode)` donde `mode` puede ser `'readonly'` o `'readwrite'`.
- Las operaciones son asíncronas y se completan con eventos.

Ejemplo mínimo con `idb`:

```javascript
import { openDB } from 'idb';
const db = await openDB('miDB', 1, {
  upgrade(db) {
    db.createObjectStore('items', { keyPath: 'id' });
  }
});
await db.add('items', { id: 1, nombre: 'uno' });
```

IndexedDB es la opción para almacenar objetos complejos, archivos binarios y realizar búsquedas por índices con alto rendimiento.

## Elección según necesidad

| Uso                              | API recomendada                   |
|----------------------------------|------------------------------------|
| Configuración simple (clave/valor) | `localStorage` / `sessionStorage` |
| Datos de red offline             | Cache API                          |
| Búsquedas complejas, archivos, gran volumen | IndexedDB                 |
| Conocer cuota y persistencia     | StorageManager (`navigator.storage`)|

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Canvas basico](04-canvas-basico.md) | [🏠 Inicio](../index.md) | [Notifications ▶](06-notifications.md) |
