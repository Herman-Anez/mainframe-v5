# Geolocation

## Geolocation API

Permite obtener la ubicación geográfica del dispositivo. Está disponible en `navigator.geolocation` y solo funciona en contextos seguros (HTTPS). El usuario debe conceder permiso explícito.

## Métodos principales

### `getCurrentPosition(success, error?, options?)`

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

### `watchPosition(success, error?, options?)`

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

### `clearWatch(id)`

Detiene la observación iniciada con `watchPosition`.

## Permisos

La primera vez que se solicita la geolocalización, el navegador muestra un diálogo de permiso. El usuario puede conceder o denegar. El estado del permiso se puede consultar con la Permissions API:

```javascript
const estado = await navigator.permissions.query({ name: 'geolocation' });
// estado.state = 'granted' | 'denied' | 'prompt'
```

Si la página se sirve sobre HTTP (no seguro), la API no funciona en la mayoría de navegadores modernos.

## Precisión y privacidad

- La precisión varía enormemente: GPS puede dar < 5 m, WiFi ~20-50 m, celda de telefonía ~100-1000 m.
- Los navegadores limitan el uso de geolocalización en iframes y pestañas de fondo.
- Es buena práctica solicitar la geolocalización solo tras una acción explícita del usuario y explicar por qué se necesita.

## Casos de uso

- Mapas y navegación.
- Localización de tiendas cercanas.
- Registro de rutas deportivas.
- Filtros de contenido basados en ubicación.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Clipboard](02-clipboard.md) | [🏠 Inicio](../index.md) | [Canvas basico ▶](04-canvas-basico.md) |
