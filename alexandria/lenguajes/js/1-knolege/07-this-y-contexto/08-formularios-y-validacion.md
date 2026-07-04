# Formularios y validacion

## Acceso a formularios y elementos

El DOM ofrece colecciones para acceder a formularios:

```javascript
const primerForm = document.forms[0]; // o document.forms['nombreForm']
const campo = form.elements['email']; // o form.email
```

Cada formulario tiene una propiedad `elements` que es una colección de todos los campos (inputs, selects, textareas, buttons, etc.).

## Eventos del formulario

- **`submit`**: se dispara al enviar el formulario (ya sea por botón `submit` o por `Enter` en un campo). Es donde se valida. Se puede cancelar con `preventDefault()` para manejar el envío con JavaScript (AJAX).
- **`reset`**: se dispara al presionar un botón de tipo `reset`.
- **`input`**: en cada cambio de valor de un campo.
- **`change`**: al cambiar y perder el foco.
- **`focus` / `blur`** y sus versiones burbujeantes `focusin`/`focusout`.

## Propiedades importantes de los campos

- `value`: contenido actual (string).
- `checked`: para radio/checkbox (booleano).
- `selectedOptions`: para `<select multiple>`.
- `disabled`: deshabilita el campo.
- `readOnly`: solo lectura.
- `name`: nombre del campo usado en el envío.

## Validación del lado del cliente

### Validación con la API de Constraint Validation

Cada campo de formulario implementa la interfaz `ValidityState`, expuesta mediante la propiedad `validity`. Además, métodos como `checkValidity()` y `reportValidity()` permiten validar.

Atributos HTML que activan validación nativa:
- `required`: campo obligatorio.
- `minlength`, `maxlength`: longitud mínima/máxima para texto.
- `min`, `max`: valores numéricos.
- `pattern`: expresión regular.
- `type`: email, url, number, date, etc. ya incluyen validación de formato.

```html
<input type="email" name="correo" required>
<input type="number" min="18" max="99">
<input type="text" pattern="[A-Z]{3}-\d{4}">
```

### Estados de validez (`validity`)

La propiedad `validity` es un objeto con booleanos:
- `valueMissing`: está vacío pero es `required`.
- `typeMismatch`: no cumple el formato del tipo (ej. email).
- `patternMismatch`: no coincide con el `pattern`.
- `tooShort` / `tooLong`: `minlength` / `maxlength`.
- `rangeUnderflow` / `rangeOverflow`: `min` / `max`.
- `badInput`: el navegador no puede interpretar el valor (ej. número mal formado).
- `stepMismatch`: no cumple con el paso (`step`).
- `valid`: `true` si no hay ningún error.

### Personalizar mensajes de error

Se puede usar `setCustomValidity('mensaje')` para forzar un error personalizado. Si se pasa cadena vacía, se limpia.

```javascript
campo.addEventListener('input', function() {
  if (campo.value === 'admin') {
    campo.setCustomValidity('El nombre "admin" está reservado');
  } else {
    campo.setCustomValidity('');
  }
});
```

### Validación en el evento `submit`

```javascript
formulario.addEventListener('submit', function(event) {
  if (!formulario.checkValidity()) {
    event.preventDefault();
    // Opcional: mostrar burbujas de error con reportValidity()
    formulario.reportValidity();
  }
  // Si es válido, proceder con envío por fetch o similar
});
```

## Envío con JavaScript (AJAX)

Para enviar datos sin recargar la página:

```javascript
formulario.addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = new FormData(formulario);
  try {
    const response = await fetch('/api/registro', {
      method: 'POST',
      body: formData // FormData establece el Content-Type adecuado
    });
    const resultado = await response.json();
    // manejar resultado
  } catch (error) {
    console.error('Error', error);
  }
});
```

`FormData` también puede construirse desde cero: `new FormData(); formData.append('clave', 'valor');`

## Buenas prácticas

- Siempre validar del lado del cliente y del lado del servidor.
- No confiar solo en la validación HTML5; implementar también lógica en JavaScript para mayor control visual y compatibilidad.
- Usar `reportValidity()` en lugar de `checkValidity()` para mostrar al usuario el primer error.
- Al usar `FormData`, recordar que los campos `disabled` no se incluyen.
- Deshabilitar el botón de envío durante el envío para evitar duplicados.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Eventos y delegacion](07-eventos-y-delegacion.md) | [🏠 Inicio](../index.md) | [Estilos y clases css ▶](09-estilos-y-clases-css.md) |
