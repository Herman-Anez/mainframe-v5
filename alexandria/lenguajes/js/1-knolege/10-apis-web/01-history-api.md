# History API

## Introducción a la History API

La **History API** permite manipular el historial de sesión del navegador (la pila de páginas visitadas en una pestaña) sin necesidad de recargar la página. Es el fundamento de las **Single Page Applications (SPAs)**, ya que posibilita cambiar la URL, gestionar la navegación con los botones del navegador (atrás/adelante) y mantener el estado asociado a cada entrada del historial.

El objeto principal es `window.history`, que expone métodos y propiedades para interactuar con el historial.

## Propiedades del objeto `history`

- `history.length`: devuelve el número de entradas en la pila de historial de la pestaña actual. Es de solo lectura.
- `history.state`: devuelve el objeto de estado asociado a la entrada actual del historial (el último pasado a `pushState` o `replaceState`, o `null` si no hay).

## Métodos fundamentales

### `pushState(state, title, url?)`

Agrega una nueva entrada al historial. No provoca una navegación real (no recarga la página), pero cambia la URL en la barra de direcciones.

- `state`: un objeto JavaScript arbitrario que se asocia con la nueva entrada. Puede ser cualquier cosa serializable (se recomienda que sea ligero, ya que se almacena en el historial del navegador y se puede perder si el usuario cierra la pestaña). Puede ser `null`.
- `title`: la mayoría de navegadores ignoran este parámetro (por razones históricas). Se suele pasar una cadena vacía.
- `url` (opcional): la nueva URL que se mostrará. Debe ser del mismo origen que la actual; si es relativa, se resuelve respecto a la actual.

```javascript
history.pushState({ pagina: 1, filtro: 'activo' }, '', '/productos?pagina=1');
```

Después de esta llamada, la URL cambia, pero la página no se recarga. El objeto `{ pagina: 1, filtro: 'activo' }` queda guardado y puede ser recuperado más tarde con `history.state` o con el evento `popstate`.

### `replaceState(state, title, url?)`

Similar a `pushState`, pero en lugar de añadir una nueva entrada, **reemplaza la entrada actual** del historial. Es útil para actualizar la URL sin acumular entradas en el historial (por ejemplo, tras una redirección interna, o para reflejar el estado inicial sin que al volver atrás se regrese a una URL anterior sin contenido).

```javascript
history.replaceState({ pagina: 2 }, '', '/productos?pagina=2');
```

### `back()`, `forward()`, `go(delta)`

Permiten navegar por el historial programáticamente:

- `history.back()`: equivale a `history.go(-1)`. Vuelve a la entrada anterior.
- `history.forward()`: equivale a `history.go(1)`. Avanza a la siguiente entrada.
- `history.go(n)`: carga una entrada específica relativa a la actual (por ejemplo, `-2` retrocede dos páginas).

Estos métodos actúan como si el usuario pulsara los botones de navegación; si hay un cambio de URL que implique una recarga (porque la entrada anterior era de una navegación real), se producirá la navegación completa.

## El evento `popstate`

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

## Patrón típico en SPAs

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

## Límites y consideraciones

- El estado debe ser serializable (objetos simples, arrays, primitivos). No se pueden almacenar funciones ni referencias al DOM. El tamaño máximo depende del navegador, pero se recomienda no superar unos cientos de KB (algunos limitan a 640 KB, otros a 2 MB por entrada). En la práctica, mantener el estado pequeño (un ID y algunos flags) es suficiente.
- La URL proporcionada debe ser del mismo origen; de lo contrario se lanza una excepción `SecurityError`.
- `pushState` nunca dispara la verificación de `hashchange`. Si se usa solo el hash, se puede seguir usando el evento `hashchange`.
- Los motores de búsqueda pueden rastrear las URLs generadas con History API si la aplicación implementa renderizado del lado del servidor (SSR) o pre‑renderizado.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Commonjs](../09-modulos/03-commonjs.md) | [🏠 Inicio](../index.md) | [Clipboard ▶](02-clipboard.md) |
