## 01-history-api.md

### Introducción a la History API

La **History API** permite manipular el historial de sesión del navegador (la pila de páginas visitadas en una pestaña) sin necesidad de recargar la página. Es el fundamento de las **Single Page Applications (SPAs)**, ya que posibilita cambiar la URL, gestionar la navegación con los botones del navegador (atrás/adelante) y mantener el estado asociado a cada entrada del historial.

El objeto principal es `window.history`, que expone métodos y propiedades para interactuar con el historial.

### Propiedades del objeto `history`

- `history.length`: devuelve el número de entradas en la pila de historial de la pestaña actual. Es de solo lectura.
- `history.state`: devuelve el objeto de estado asociado a la entrada actual del historial (el último pasado a `pushState` o `replaceState`, o `null` si no hay).

### Métodos fundamentales

#### `pushState(state, title, url?)`

Agrega una nueva entrada al historial. No provoca una navegación real (no recarga la página), pero cambia la URL en la barra de direcciones.

- `state`: un objeto JavaScript arbitrario que se asocia con la nueva entrada. Puede ser cualquier cosa serializable (se recomienda que sea ligero, ya que se almacena en el historial del navegador y se puede perder si el usuario cierra la pestaña). Puede ser `null`.
- `title`: la mayoría de navegadores ignoran este parámetro (por razones históricas). Se suele pasar una cadena vacía.
- `url` (opcional): la nueva URL que se mostrará. Debe ser del mismo origen que la actual; si es relativa, se resuelve respecto a la actual.

```javascript
history.pushState({ pagina: 1, filtro: 'activo' }, '', '/productos?pagina=1');
```

Después de esta llamada, la URL cambia, pero la página no se recarga. El objeto `{ pagina: 1, filtro: 'activo' }` queda guardado y puede ser recuperado más tarde con `history.state` o con el evento `popstate`.

#### `replaceState(state, title, url?)`

Similar a `pushState`, pero en lugar de añadir una nueva entrada, **reemplaza la entrada actual** del historial. Es útil para actualizar la URL sin acumular entradas en el historial (por ejemplo, tras una redirección interna, o para reflejar el estado inicial sin que al volver atrás se regrese a una URL anterior sin contenido).

```javascript
history.replaceState({ pagina: 2 }, '', '/productos?pagina=2');
```

#### `back()`, `forward()`, `go(delta)`

Permiten navegar por el historial programáticamente:

- `history.back()`: equivale a `history.go(-1)`. Vuelve a la entrada anterior.
- `history.forward()`: equivale a `history.go(1)`. Avanza a la siguiente entrada.
- `history.go(n)`: carga una entrada específica relativa a la actual (por ejemplo, `-2` retrocede dos páginas).

Estos métodos actúan como si el usuario pulsara los botones de navegación; si hay un cambio de URL que implique una recarga (porque la entrada anterior era de una navegación real), se producirá la navegación completa.

### El evento `popstate`

Se dispara en `window` cuando **se navega a una entrada del historial** (por ejemplo, al pulsar atrás o adelante). No se dispara al llamar a `pushState` o `replaceState`. Su propiedad `event.state` contiene el objeto de estado asociado a la entrada a la que se está navegando.

```javascript
window.addEventListener('popstate', function(event) {
  if (event.state) {
    // Restaurar la vista según event.state (p.ej., pagina, filtro)
  } else {
    // state puede ser null (entradas sin estado)
  }
});
```

Es importante que la aplicación restaure el estado de la interfaz basándose en `event.state` o en la nueva URL, para mantener la coherencia.

### Patrón típico en SPAs

1. Al realizar una acción (cambiar de vista, filtrar, paginar), se actualiza el DOM y luego se llama a `pushState` con un estado representativo y la nueva URL.
2. Se define un manejador del evento `popstate` que, a partir del estado o de la URL actual (`location`), reconstruye la vista correspondiente.
3. Para la carga inicial, se lee `history.state` y `location` y se construye la vista inicial.

Ejemplo simplificado:

```javascript
function navegar(ruta, datos) {
  // Actualizar DOM según datos
  document.getElementById('app').textContent = datos.titulo;
  history.pushState(datos, '', ruta);
}

window.addEventListener('popstate', (e) => {
  if (e.state) {
    document.getElementById('app').textContent = e.state.titulo;
  } else {
    // Volver a la página inicial
    document.getElementById('app').textContent = 'Inicio';
  }
});
```

### Límites y consideraciones

- El estado debe ser serializable (objetos simples, arrays, primitivos). No se pueden almacenar funciones ni referencias al DOM. El tamaño máximo depende del navegador, pero se recomienda no superar unos cientos de KB (algunos limitan a 640 KB, otros a 2 MB por entrada). En la práctica, mantener el estado pequeño (un ID y algunos flags) es suficiente.
- La URL proporcionada debe ser del mismo origen; de lo contrario se lanza una excepción `SecurityError`.
- `pushState` nunca dispara la verificación de `hashchange`. Si se usa solo el hash, se puede seguir usando el evento `hashchange`.
- Los motores de búsqueda pueden rastrear las URLs generadas con History API si la aplicación implementa renderizado del lado del servidor (SSR) o pre‑renderizado.

---

## 02-clipboard.md

### Acceso al portapapeles

La **Clipboard API** proporciona métodos asíncronos para leer y escribir contenido en el portapapeles del sistema. Reemplaza al antiguo enfoque basado en `document.execCommand('copy')`. Está disponible en el objeto `navigator.clipboard`.

### Escritura en el portapapeles

#### `navigator.clipboard.writeText(text)`

Escribe una cadena de texto en el portapapeles. Devuelve una promesa que se resuelve cuando la operación ha tenido éxito.

```javascript
async function copiarTexto() {
  try {
    await navigator.clipboard.writeText('Texto a copiar');
    console.log('Copiado al portapapeles');
  } catch (err) {
    console.error('Error al copiar:', err);
  }
}
```

#### `navigator.clipboard.write(data)`

Permite escribir datos en formatos distintos a texto plano mediante objetos `ClipboardItem`. Soporta, por ejemplo, imágenes PNG o HTML. Requiere permisos.

```javascript
const blob = await fetch('/imagen.png').then(r => r.blob());
const item = new ClipboardItem({ 'image/png': blob });
await navigator.clipboard.write([item]);
```

### Lectura del portapapeles

#### `navigator.clipboard.readText()`

Lee el texto del portapapeles. Retorna una promesa con el string. Requiere que el usuario haya concedido permiso previamente (o que la página esté en foco y se haya originado por un gesto del usuario).

```javascript
async function pegarTexto() {
  const texto = await navigator.clipboard.readText();
  document.getElementById('area').value = texto;
}
```

#### `navigator.clipboard.read()`

Lee el contenido del portapapeles en múltiples formatos. Devuelve un array de `ClipboardItem`. También requiere permisos. Cada `ClipboardItem` puede tener varios tipos MIME.

```javascript
const items = await navigator.clipboard.read();
for (const item of items) {
  if (item.types.includes('image/png')) {
    const blob = await item.getType('image/png');
    // Usar blob para mostrar imagen
  }
}
```

### Permisos y contexto seguro

- La Clipboard API **solo funciona en contextos seguros** (HTTPS o localhost).
- Para `writeText`, normalmente no se requiere un permiso explícito si la operación se desencadena por un gesto del usuario (clic, tecla). Fuera de un gesto del usuario, la mayoría de navegadores la rechazan.
- `readText` y `read` requieren que el usuario haya otorgado el permiso `"clipboard-read"`. Los navegadores suelen mostrar un diálogo de permiso.
- Se puede consultar el estado del permiso con la **Permissions API**:

```javascript
const result = await navigator.permissions.query({ name: 'clipboard-read' });
if (result.state === 'granted' || result.state === 'prompt') {
  // intentar leer
}
```

### Eventos `copy`, `cut`, `paste`

Los elementos del DOM pueden escuchar estos eventos para interceptar la operación. El objeto `event` expone `clipboardData`, que permite leer o modificar los datos que se copian/pegan (en navegadores modernos, dentro de un gesto del usuario). Esto es útil para personalizar el contenido copiado (por ejemplo, añadir formato adicional o atribución).

```javascript
document.addEventListener('copy', (e) => {
  const seleccion = document.getSelection().toString();
  e.clipboardData.setData('text/plain', seleccion + ' (fuente: mi web)');
  e.preventDefault();
});
```

Nota: `e.clipboardData` es un objeto `DataTransfer` y no requiere permisos porque es una respuesta directa al gesto del usuario.

### Compatibilidad y alternativas

La Clipboard API asíncrona es ampliamente soportada en navegadores modernos. Para compatibilidad con navegadores antiguos (IE, versiones muy antiguas de otros), se puede usar `document.execCommand('copy')`, que solo permite copiar texto seleccionado o el contenido de un input, y solo funciona en un gesto de usuario. Hoy se considera obsoleto.

---

## 03-geolocation.md

### Geolocation API

Permite obtener la ubicación geográfica del dispositivo. Está disponible en `navigator.geolocation` y solo funciona en contextos seguros (HTTPS). El usuario debe conceder permiso explícito.

### Métodos principales

#### `getCurrentPosition(success, error?, options?)`

Obtiene la posición actual una sola vez.

```javascript
navigator.geolocation.getCurrentPosition(
  (position) => {
    const { latitude, longitude, accuracy } = position.coords;
    console.log(`Lat: ${latitude}, Lon: ${longitude} (±${accuracy} m)`);
  },
  (error) => {
    switch (error.code) {
      case error.PERMISSION_DENIED: console.log('Permiso denegado'); break;
      case error.POSITION_UNAVAILABLE: console.log('Posición no disponible'); break;
      case error.TIMEOUT: console.log('Tiempo agotado'); break;
    }
  },
  { enableHighAccuracy: false, timeout: 10000, maximumAge: 60000 }
);
```

- **success**: función que recibe un objeto `Position` con propiedades `coords` y `timestamp`.
  - `coords.latitude`, `coords.longitude`, `coords.accuracy` (en metros), `coords.altitude`, `coords.altitudeAccuracy`, `coords.heading`, `coords.speed` (según disponibilidad del dispositivo).
- **error**: función que recibe un objeto `PositionError` con `code` y `message`.
- **options**:
  - `enableHighAccuracy` (boolean): solicita mayor precisión (puede consumir más batería y tiempo).
  - `timeout` (ms): tiempo máximo de espera.
  - `maximumAge` (ms): tiempo máximo de caché aceptado; 0 fuerza una nueva lectura.

#### `watchPosition(success, error?, options?)`

Similar a `getCurrentPosition`, pero invoca el callback `success` cada vez que la posición cambia (y ante el primer resultado). Retorna un `watchId` que se usa para cancelar.

```javascript
const watchId = navigator.geolocation.watchPosition(
  (pos) => console.log(`Nueva posición: ${pos.coords.latitude}`),
  (err) => console.error(err),
  { enableHighAccuracy: true }
);

// Para dejar de observar:
// navigator.geolocation.clearWatch(watchId);
```

#### `clearWatch(id)`

Detiene la observación iniciada con `watchPosition`.

### Permisos

La primera vez que se solicita la geolocalización, el navegador muestra un diálogo de permiso. El usuario puede conceder o denegar. El estado del permiso se puede consultar con la Permissions API:

```javascript
const estado = await navigator.permissions.query({ name: 'geolocation' });
// estado.state = 'granted' | 'denied' | 'prompt'
```

Si la página se sirve sobre HTTP (no seguro), la API no funciona en la mayoría de navegadores modernos.

### Precisión y privacidad

- La precisión varía enormemente: GPS puede dar < 5 m, WiFi ~20-50 m, celda de telefonía ~100-1000 m.
- Los navegadores limitan el uso de geolocalización en iframes y pestañas de fondo.
- Es buena práctica solicitar la geolocalización solo tras una acción explícita del usuario y explicar por qué se necesita.

### Casos de uso

- Mapas y navegación.
- Localización de tiendas cercanas.
- Registro de rutas deportivas.
- Filtros de contenido basados en ubicación.

---

## 04-canvas-basico.md

### El elemento `<canvas>`

`<canvas>` es un elemento HTML que provee un área de dibujo de píxeles (bitmap) manipulable mediante JavaScript. Es ideal para gráficos, animaciones, procesamiento de imágenes y juegos 2D.

```html
<canvas id="lienzo" width="400" height="300"></canvas>
```

Los atributos `width` y `height` definen la resolución interna del canvas (no el tamaño CSS). Si no se especifican, el tamaño por defecto es 300×150 píxeles. El tamaño mostrado puede escalarse con CSS, pero la resolución interna permanece; para gráficos nítidos se deben ajustar ambos.

### Contexto de dibujo 2D

Se obtiene mediante `getContext('2d')`. Devuelve un objeto `CanvasRenderingContext2D` con métodos y propiedades para dibujar.

```javascript
const canvas = document.getElementById('lienzo');
const ctx = canvas.getContext('2d');
```

### Dibujo de formas básicas

#### Rectángulos

- `fillRect(x, y, ancho, alto)`: rectángulo relleno.
- `strokeRect(x, y, ancho, alto)`: rectángulo con solo borde.
- `clearRect(x, y, ancho, alto)`: borra un área (transparente).

```javascript
ctx.fillStyle = 'blue';
ctx.fillRect(10, 10, 100, 50);
ctx.strokeStyle = 'red';
ctx.lineWidth = 2;
ctx.strokeRect(150, 10, 100, 50);
```

#### Trazados (paths)

El canvas dibuja mediante un trazado en memoria:

1. `beginPath()`: inicia un nuevo trazado.
2. `moveTo(x, y)`: mueve el lápiz a un punto sin dibujar.
3. `lineTo(x, y)`: dibuja una línea desde el punto actual.
4. `arc(x, y, radio, inicioAng, finAng, antihorario?)`: dibuja un arco/círculo.
5. `rect(x, y, ancho, alto)`: añade un rectángulo al trazado.
6. `closePath()`: cierra el trazado conectando con el punto inicial.
7. `stroke()`: dibuja el contorno del trazado con el estilo actual.
8. `fill()`: rellena el área del trazado.

Ejemplo de círculo:

```javascript
ctx.beginPath();
ctx.arc(200, 150, 50, 0, Math.PI * 2);
ctx.fillStyle = 'green';
ctx.fill();
ctx.stroke();
```

#### Texto

- `fillText(texto, x, y, maxWidth?)`: texto relleno.
- `strokeText(texto, x, y, maxWidth?)`: texto con contorno.
- `font`: define la fuente (sintaxis similar a CSS, ej. `'20px sans-serif'`).
- `textAlign`, `textBaseline`: alineación horizontal y vertical.

```javascript
ctx.font = 'bold 24px Arial';
ctx.fillStyle = 'black';
ctx.textAlign = 'center';
ctx.fillText('Hola Canvas', canvas.width / 2, 50);
```

### Colores, estilos y gradientes

- `fillStyle`, `strokeStyle`: aceptan colores CSS, gradientes o patrones.
- `createLinearGradient(x1, y1, x2, y2)`: crea un gradiente lineal.
- `createRadialGradient(...)`: gradiente radial.
- `createPattern(image, repeticion)`: crea un patrón a partir de una imagen.

```javascript
const grad = ctx.createLinearGradient(0, 0, 400, 0);
grad.addColorStop(0, 'red');
grad.addColorStop(1, 'blue');
ctx.fillStyle = grad;
ctx.fillRect(0, 0, 400, 300);
```

### Transformaciones

- `translate(x, y)`: desplaza el origen.
- `rotate(angulo)`: rota en radianes.
- `scale(x, y)`: escala.
- `save()` y `restore()`: guardan y restauran el estado completo de transformaciones y estilos, útil para aislar efectos.

```javascript
ctx.save();
ctx.translate(100, 100);
ctx.rotate(Math.PI / 4);
ctx.fillRect(-25, -25, 50, 50);
ctx.restore();
```

### Imágenes

Dibujar una imagen en el canvas:

```javascript
const img = new Image();
img.onload = () => ctx.drawImage(img, x, y, ancho?, alto?);
img.src = 'ruta.png';
```

También se pueden recortar regiones con `drawImage(img, sx, sy, sW, sH, dx, dy, dW, dH)`.

### Animaciones

Se usa `requestAnimationFrame` para crear bucles de animación suaves:

```javascript
function animar() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // Actualizar estado y dibujar
  requestAnimationFrame(animar);
}
requestAnimationFrame(animar);
```

### Exportar contenido

- `canvas.toDataURL('image/png')`: devuelve una cadena base64 de la imagen.
- `canvas.toBlob(callback, 'image/png')`: devuelve un Blob.
- Útil para guardar capturas o subirlas al servidor.

### Contexto 3D (WebGL)

Además del contexto 2D, el canvas puede proporcionar un contexto `webgl` o `webgl2` para gráficos 3D acelerados por GPU. Es un tema extenso que va más allá de este archivo introductorio.

---

## 05-web-apis-storage.md

Este archivo complementa la sección de almacenamiento vista anteriormente, centrándose en aspectos avanzados y APIs complementarias. Se dará un repaso a detalles adicionales, límites y API moderna.

### Profundizando en `localStorage` y `sessionStorage`

Ya se cubrieron los métodos básicos. Aquí se añaden detalles importantes:

- **Evento `storage`**: solo se dispara en documentos del mismo origen que **no** fueron los que realizaron el cambio. Su objeto `StorageEvent` incluye `key`, `oldValue`, `newValue`, `url` y el objeto `storageArea` afectado. Es excelente para sincronizar estado entre pestañas.
- **Capacidad y cuotas**: el estándar sugiere un límite de 5 MB por origen, pero los navegadores pueden variar (10 MB en muchos). No existe una API para consultar la cuota disponible para Web Storage. Para cuotas más grandes y consultables se debe usar la **Storage API** (ver más abajo).
- **Manejo de errores**: al exceder la cuota, `setItem` lanza `QuotaExceededError`. Se debe envolver en try/catch si se espera mucho volumen.
- **No apto para datos sensibles**: el almacenamiento es accesible desde JavaScript y vulnerable a XSS. No almacenar tokens de sesión o contraseñas.

### Storage API (StorageManager)

La **Storage API** (no confundir con Web Storage) permite estimar la cuota disponible y el uso actual, y solicitar almacenamiento persistente. Está disponible en `navigator.storage`.

#### `navigator.storage.estimate()`

Devuelve una promesa con un objeto `{ quota, usage }` en bytes.

```javascript
const estimacion = await navigator.storage.estimate();
console.log(`Usado: ${estimacion.usage}, Cuota: ${estimacion.quota}`);
```

Esto reporta el uso total de todo el almacenamiento del origen (incluye IndexedDB, Cache API, etc.), no solo Web Storage.

#### `navigator.storage.persist()`

Solicita que el almacenamiento del origen sea persistente, es decir, el navegador no lo eliminará automáticamente bajo presión de espacio (aunque el usuario podría hacerlo manualmente). Devuelve `true` si se concede.

```javascript
if (await navigator.storage.persist()) {
  console.log('Almacenamiento persistente concedido');
}
const esPersistente = await navigator.storage.persisted();
```

### Cache API

Parte de los Service Workers, pero accesible desde la página principal, permite almacenar pares Request/Response programáticamente. Es ideal para guardar recursos de red (archivos CSS, JS, imágenes) y hacer que la aplicación funcione offline.

```javascript
const cache = await caches.open('mi-cache-v1');
await cache.add('/estilo.css');       // descarga y guarda
await cache.put('/api/data', new Response(JSON.stringify(datos)));
const respuesta = await cache.match('/api/data');
```

El límite de almacenamiento está sujeto a la cuota general del origen; se puede consultar con `navigator.storage.estimate()`.

### IndexedDB (repaso con promesas)

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

### Elección según necesidad

| Uso                              | API recomendada                   |
|----------------------------------|------------------------------------|
| Configuración simple (clave/valor) | `localStorage` / `sessionStorage` |
| Datos de red offline             | Cache API                          |
| Búsquedas complejas, archivos, gran volumen | IndexedDB                 |
| Conocer cuota y persistencia     | StorageManager (`navigator.storage`)|

---

## 06-notifications.md

### Notifications API

Permite mostrar notificaciones al usuario fuera del contexto de la página (a nivel sistema operativo), incluso si la página no está en primer plano. Está disponible en el objeto `Notification` (solo en contextos seguros).

### Permisos

Antes de mostrar notificaciones, es necesario solicitar permiso. El estado se consulta con `Notification.permission`, que puede ser `'granted'`, `'denied'` o `'default'` (el usuario aún no ha decidido).

```javascript
if (Notification.permission === 'granted') {
  crearNotificacion();
} else if (Notification.permission !== 'denied') {
  const permiso = await Notification.requestPermission();
  if (permiso === 'granted') {
    crearNotificacion();
  }
}
```

`requestPermission()` retorna una promesa con el nuevo estado. Debe llamarse como resultado de un gesto del usuario (clic, tecla); algunos navegadores ignoran la llamada si no hay interacción.

### Crear una notificación

```javascript
const notificacion = new Notification('Título', {
  body: 'Cuerpo del mensaje',
  icon: '/icono.png',
  badge: '/badge.png',  // solo móviles
  tag: 'identificador', // agrupa notificaciones con el mismo tag
  requireInteraction: false, // si true, no se cierra automáticamente
  data: { id: 1 } // datos arbitrarios no visibles
});
```

La notificación se muestra inmediatamente. Si el permiso no es `granted`, no se muestra.

### Eventos

La instancia `Notification` emite eventos:

- `click`: cuando el usuario hace clic en la notificación (ideal para enfocar la pestaña o navegar a una URL).
- `close`: cuando la notificación se cierra.
- `error`: si ocurre un error al mostrarse.
- `show`: cuando se muestra.

```javascript
notificacion.onclick = () => {
  window.focus();
  // Opcional: navegar a una URL específica
  notificacion.close();
};
```

### Notificaciones desde Service Workers

Las notificaciones más potentes son las que se envían desde un **Service Worker**, ya que pueden mostrarse incluso con la aplicación cerrada (Web Push). El Service Worker puede escuchar el evento `push` y mostrar una notificación con `self.registration.showNotification(title, options)`. Además, puede manejar clics con el evento `notificationclick`. Esto escapa del ámbito de la API básica de notificaciones de la página, pero es su extensión natural.

### Restricciones

- No todos los navegadores móviles soportan `Notification` en el contexto de página; muchos requieren que la notificación se muestre a través del Service Worker (especialmente en iOS, donde las notificaciones web se soportaron a partir de iOS 16.4, pero con limitaciones).
- Las notificaciones pueden ser silenciadas por el usuario a nivel de sistema operativo.
- El icono debe ser una URL accesible; si no se carga, la notificación podría fallar.

### Buenas prácticas

- Solicitar el permiso en contexto adecuado: explicar por qué se necesitan las notificaciones y tras una acción del usuario.
- Respetar el permiso denegado y no insistir.
- Usar la propiedad `tag` para reemplazar notificaciones anteriores en lugar de saturar al usuario.
- Cerrar la notificación después de manejarla.

---

## 07-fullscreen.md

### Fullscreen API

Permite mostrar un elemento (o toda la página) en modo pantalla completa, ocultando la interfaz del navegador. Es útil para presentaciones, vídeos, juegos y aplicaciones inmersivas.

### Métodos principales

#### `element.requestFullscreen(options?)`

Solicita que el elemento ocupe la pantalla completa. Debe ser invocado como resultado de un gesto del usuario (clic, tecla), por razones de seguridad y UX.

```javascript
const elem = document.getElementById('contenido');
elem.requestFullscreen().catch(err => console.error('No se pudo', err));
```

Opciones (en navegadores que lo soportan):
- `navigationUI`: `'auto'`, `'show'`, `'hide'` (controla la visibilidad de la UI de navegación del navegador durante pantalla completa; no todos los navegadores la implementan).

#### `document.exitFullscreen()`

Sale del modo pantalla completa. No requiere gesto del usuario.

```javascript
document.exitFullscreen();
```

### Propiedades y eventos

#### `document.fullscreenElement`

Devuelve el elemento que está actualmente en pantalla completa, o `null` si no hay ninguno.

#### `document.fullscreenEnabled`

Booleano que indica si la API de pantalla completa está disponible y permitida en el contexto actual.

#### Evento `fullscreenchange`

Se dispara en el documento (o en el elemento) cuando se entra o sale del modo pantalla completa.

```javascript
document.addEventListener('fullscreenchange', () => {
  if (document.fullscreenElement) {
    console.log('Entró en pantalla completa');
  } else {
    console.log('Salió de pantalla completa');
  }
});
```

#### Evento `fullscreenerror`

Se dispara cuando una solicitud de pantalla completa falla (por ejemplo, por falta de gesto del usuario o por políticas).

```javascript
document.addEventListener('fullscreenerror', () => {
  console.error('Error al intentar pantalla completa');
});
```

### Consideraciones de estilo

Cuando un elemento entra en pantalla completa, se le aplica el pseudo-selector CSS `:fullscreen`, permitiendo personalizar su apariencia (por ejemplo, fondo, tamaño, etc.).

```css
#contenido:fullscreen {
  background-color: black;
  display: flex;
  align-items: center;
  justify-content: center;
}
```

La pseudo-clase `::backdrop` permite estilizar el fondo detrás del elemento en pantalla completa.

### Seguridad

- La solicitud debe originarse de un gesto del usuario (no desde `setTimeout` o al cargar la página).
- Solo se puede llamar desde el hilo principal y en un contexto seguro (HTTPS).
- Algunos navegadores requieren que la página esté en el mismo origen que el iframe si se solicita sobre un iframe (con atributo `allowfullscreen`).

### Casos de uso

- Reproductores de vídeo personalizados.
- Presentaciones de diapositivas.
- Juegos.
- Visualización de imágenes o mapas.

### Compatibilidad

La API está ampliamente soportada, aunque con prefijos en navegadores antiguos (`webkitRequestFullscreen`, `msRequestFullscreen`). En código moderno se puede usar sin prefijos. Siempre verificar `fullscreenEnabled` antes de intentar.

---

Estos siete archivos completan el conocimiento práctico de diversas APIs web, desde la manipulación del historial y la pantalla completa hasta el portapapeles y las notificaciones, proporcionando ejemplos listos para implementar y las consideraciones de seguridad y compatibilidad necesarias.

---

