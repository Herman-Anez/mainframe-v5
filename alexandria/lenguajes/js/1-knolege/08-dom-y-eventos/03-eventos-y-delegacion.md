# Eventos y delegacion

## Modelo de eventos

El DOM tiene un sistema de eventos basado en la **observación** de sucesos (click, teclado, carga, etc.) en elementos. Para manejar eventos, se registran funciones **listeners** o **handlers** en elementos específicos.

### Registro de manejadores

Método moderno: `addEventListener`.

```javascript
const boton = document.getElementById('btn');
boton.addEventListener('click', function(event) {
  console.log('Click!', event);
});
```

- Se pueden registrar múltiples manejadores para el mismo evento.
- El tercer argumento opcional puede ser un objeto de opciones (`{ capture, once, passive }`) o un booleano (`useCapture`).

### Eliminar manejadores: `removeEventListener`

Debe pasarse la misma función (referencia) que se registró.

```javascript
function handler(e) { /* ... */ }
boton.addEventListener('click', handler);
boton.removeEventListener('click', handler);
```

### Objeto `Event`

El callback recibe un objeto `event` con propiedades útiles:
- `type`: tipo de evento (`'click'`, `'keydown'`, etc.).
- `target`: el elemento que originó el evento (el que fue clicado).
- `currentTarget`: el elemento que tiene el manejador actual (útil en delegación).
- `preventDefault()`: cancela la acción por defecto (ej. seguir un enlace).
- `stopPropagation()`: detiene la propagación del evento a ancestros.
- `stopImmediatePropagation()`: detiene la propagación y evita que otros manejadores en el mismo elemento se ejecuten.

### Fases del evento: Captura y Burbujeo

Cuando se dispara un evento en un elemento, pasa por tres fases:
1. **Fase de captura**: el evento desciende desde el `document` hasta el `target`.
2. **Fase objetivo**: el evento llega al `target`.
3. **Fase de burbujeo**: el evento asciende desde el `target` hasta el `document`.

Por defecto, los manejadores se registran en la fase de burbujeo. Para capturarlos en la fase de captura, se usa `addEventListener(..., true)` o `{ capture: true }`.

## Delegación de eventos

Técnica que aprovecha el burbujeo para manejar eventos en un ancestro común, en lugar de adjuntar manejadores a cada elemento hijo. Es esencial para listas dinámicas.

```javascript
const lista = document.getElementById('lista');
lista.addEventListener('click', function(event) {
  const li = event.target.closest('li');
  if (!li) return; // no se hizo clic en un <li>
  console.log('Clic en', li.textContent);
});
```

Ventajas:
- Menos manejadores en memoria.
- Funciona automáticamente para elementos añadidos después de registrar el manejador.
- Código más sencillo de mantener.

El `closest` permite asegurarse de que el clic ocurrió en un `li` o en un descendiente del `li`.

### `event.target` vs `event.currentTarget`

En delegación:
- `event.target`: el elemento más anidado que recibió el evento (ej. un `<span>` dentro del `<li>`).
- `event.currentTarget`: el elemento donde se registró el manejador (la `lista`).

### Eventos que no burbujean

Algunos eventos, como `focus`, `blur`, `mouseenter`, `mouseleave`, no burbujean. Para delegarlos hay que usar sus versiones que sí burbujean: `focusin`, `focusout` (pero no todos los navegadores antiguos las soportan; hoy en día son estándar). `mouseenter`/`mouseleave` no burbujean; `mouseover`/`mouseout` sí.

## Opciones modernas de `addEventListener`

- **`once: true`**: el manejador se ejecuta una sola vez y se autoelimina.
- **`passive: true`**: indica que el manejador nunca llamará a `preventDefault()`. Mejora el rendimiento en eventos como `scroll` y `touchstart`.
- **`capture: true`**: registra en fase de captura.
- **`signal`**: un `AbortSignal` para eliminar el manejador fácilmente.

```javascript
const controller = new AbortController();
document.addEventListener('click', handler, { signal: controller.signal });
// Luego:
controller.abort(); // elimina el manejador
```

## Prevención de la acción por defecto y propagación

- `event.preventDefault()`: cancela el comportamiento nativo asociado al evento (ej. navegación de un enlace, envío de formulario).
- `event.stopPropagation()`: evita que el evento continúe propagándose a ancestros. Se debe usar con moderación, ya que puede romper delegación o otros manejadores.
- `event.stopImmediatePropagation()`: además de detener la propagación, evita que otros manejadores del mismo elemento se ejecuten.

## Manejo de teclado y formularios

- `keydown`, `keypress`, `keyup`: en `event.key` se obtiene la tecla presionada.
- `input`: se dispara cada vez que cambia el valor de un `<input>`, `<select>`, `<textarea>`. Alternativa a `keydown` para campos de texto.
- `change`: se dispara al cambiar el valor y perder el foco (para inputs) o al seleccionar una opción (select).

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Manipulacion del dom](02-manipulacion-del-dom.md) | [🏠 Inicio](../index.md) | [Formularios y validacion ▶](04-formularios-y-validacion.md) |
