# Notifications

## Notifications API

Permite mostrar notificaciones al usuario fuera del contexto de la página (a nivel sistema operativo), incluso si la página no está en primer plano. Está disponible en el objeto `Notification` (solo en contextos seguros).

## Permisos

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

## Crear una notificación

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

## Eventos

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

## Notificaciones desde Service Workers

Las notificaciones más potentes son las que se envían desde un **Service Worker**, ya que pueden mostrarse incluso con la aplicación cerrada (Web Push). El Service Worker puede escuchar el evento `push` y mostrar una notificación con `self.registration.showNotification(title, options)`. Además, puede manejar clics con el evento `notificationclick`. Esto escapa del ámbito de la API básica de notificaciones de la página, pero es su extensión natural.

## Restricciones

- No todos los navegadores móviles soportan `Notification` en el contexto de página; muchos requieren que la notificación se muestre a través del Service Worker (especialmente en iOS, donde las notificaciones web se soportaron a partir de iOS 16.4, pero con limitaciones).
- Las notificaciones pueden ser silenciadas por el usuario a nivel de sistema operativo.
- El icono debe ser una URL accesible; si no se carga, la notificación podría fallar.

## Buenas prácticas

- Solicitar el permiso en contexto adecuado: explicar por qué se necesitan las notificaciones y tras una acción del usuario.
- Respetar el permiso denegado y no insistir.
- Usar la propiedad `tag` para reemplazar notificaciones anteriores en lugar de saturar al usuario.
- Cerrar la notificación después de manejarla.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Web apis storage](05-web-apis-storage.md) | [🏠 Inicio](../index.md) | [Fullscreen ▶](07-fullscreen.md) |
