# Fullscreen

## Fullscreen API

Permite mostrar un elemento (o toda la página) en modo pantalla completa, ocultando la interfaz del navegador. Es útil para presentaciones, vídeos, juegos y aplicaciones inmersivas.

## Métodos principales

### `element.requestFullscreen(options?)`

Solicita que el elemento ocupe la pantalla completa. Debe ser invocado como resultado de un gesto del usuario (clic, tecla), por razones de seguridad y UX.

```javascript
const elem = document.getElementById('contenido');
elem.requestFullscreen().catch(err => console.error('No se pudo', err));
```

Opciones (en navegadores que lo soportan):
- `navigationUI`: `'auto'`, `'show'`, `'hide'` (controla la visibilidad de la UI de navegación del navegador durante pantalla completa; no todos los navegadores la implementan).

### `document.exitFullscreen()`

Sale del modo pantalla completa. No requiere gesto del usuario.

```javascript
document.exitFullscreen();
```

## Propiedades y eventos

### `document.fullscreenElement`

Devuelve el elemento que está actualmente en pantalla completa, o `null` si no hay ninguno.

### `document.fullscreenEnabled`

Booleano que indica si la API de pantalla completa está disponible y permitida en el contexto actual.

### Evento `fullscreenchange`

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

### Evento `fullscreenerror`

Se dispara cuando una solicitud de pantalla completa falla (por ejemplo, por falta de gesto del usuario o por políticas).

```javascript
document.addEventListener('fullscreenerror', () => {
  console.error('Error al intentar pantalla completa');
});
```

## Consideraciones de estilo

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

## Seguridad

- La solicitud debe originarse de un gesto del usuario (no desde `setTimeout` o al cargar la página).
- Solo se puede llamar desde el hilo principal y en un contexto seguro (HTTPS).
- Algunos navegadores requieren que la página esté en el mismo origen que el iframe si se solicita sobre un iframe (con atributo `allowfullscreen`).

## Casos de uso

- Reproductores de vídeo personalizados.
- Presentaciones de diapositivas.
- Juegos.
- Visualización de imágenes o mapas.

## Compatibilidad

La API está ampliamente soportada, aunque con prefijos en navegadores antiguos (`webkitRequestFullscreen`, `msRequestFullscreen`). En código moderno se puede usar sin prefijos. Siempre verificar `fullscreenEnabled` antes de intentar.

---

Estos siete archivos completan el conocimiento práctico de diversas APIs web, desde la manipulación del historial y la pantalla completa hasta el portapapeles y las notificaciones, proporcionando ejemplos listos para implementar y las consideraciones de seguridad y compatibilidad necesarias.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Notifications](06-notifications.md) | [🏠 Inicio](../index.md) | [Closures aplicados ▶](../11-conceptos-avanzados/01-closures-aplicados.md) |
