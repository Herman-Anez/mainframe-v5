# Fetch API

## `fetch()` básico

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

## El objeto Response

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

## Opciones de la solicitud (Request)

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

### Envío de datos

- JSON: `body: JSON.stringify(objeto)`, `Content-Type: application/json`.
- Formularios: `body: new FormData(formulario)`; el navegador establece el Content-Type automáticamente (incluyendo `multipart/form-data`).
- Datos URL-encoded: `body: new URLSearchParams({clave: 'valor'})`.
- Blob / ArrayBuffer: para subir archivos binarios.

## Manejo de errores

- Errores de red (DNS no resuelto, conexión rechazada) provocan rechazo de la promesa.
- Errores HTTP (4xx, 5xx) **no** provocan rechazo. Debe comprobarse `response.ok`.
- Errores al parsear la respuesta (ej. JSON mal formado) provocan rechazo en el método de lectura.

## Cancelación con AbortController

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

## Streaming de la respuesta

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

## Comparación con `XMLHttpRequest`

| Característica     | fetch                            | XMLHttpRequest             |
|--------------------|----------------------------------|----------------------------|
| Promesas           | Sí                               | No (requiere callbacks)    |
| Cancelación        | AbortController                  | `xhr.abort()`              |
| Progreso           | No nativo (requiere stream manual) | Evento `progress`        |
| Soporte de cookies | `credentials: 'include'`         | `withCredentials`          |
| Sincrónico         | No (siempre asíncrono)           | Sí (obsoleto)              |

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Async await](03-async-await.md) | [🏠 Inicio](../index.md) | [Temporizadores ▶](05-temporizadores.md) |
