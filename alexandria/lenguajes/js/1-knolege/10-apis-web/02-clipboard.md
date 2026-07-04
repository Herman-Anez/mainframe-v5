# Clipboard

## Acceso al portapapeles

La **Clipboard API** proporciona métodos asíncronos para leer y escribir contenido en el portapapeles del sistema. Reemplaza al antiguo enfoque basado en `document.execCommand('copy')`. Está disponible en el objeto `navigator.clipboard`.

## Escritura en el portapapeles

### `navigator.clipboard.writeText(text)`

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

### `navigator.clipboard.write(data)`

Permite escribir datos en formatos distintos a texto plano mediante objetos `ClipboardItem`. Soporta, por ejemplo, imágenes PNG o HTML. Requiere permisos.

```javascript
const blob = await fetch('/imagen.png').then(r => r.blob());
const item = new ClipboardItem({ 'image/png': blob });
await navigator.clipboard.write([item]);
```

## Lectura del portapapeles

### `navigator.clipboard.readText()`

Lee el texto del portapapeles. Retorna una promesa con el string. Requiere que el usuario haya concedido permiso previamente (o que la página esté en foco y se haya originado por un gesto del usuario).

```javascript
async function pegarTexto() {
  const texto = await navigator.clipboard.readText();
  document.getElementById('area').value = texto;
}
```

### `navigator.clipboard.read()`

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

## Permisos y contexto seguro

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

## Eventos `copy`, `cut`, `paste`

Los elementos del DOM pueden escuchar estos eventos para interceptar la operación. El objeto `event` expone `clipboardData`, que permite leer o modificar los datos que se copian/pegan (en navegadores modernos, dentro de un gesto del usuario). Esto es útil para personalizar el contenido copiado (por ejemplo, añadir formato adicional o atribución).

```javascript
document.addEventListener('copy', (e) => {
  const seleccion = document.getSelection().toString();
  e.clipboardData.setData('text/plain', seleccion + ' (fuente: mi web)');
  e.preventDefault();
});
```

Nota: `e.clipboardData` es un objeto `DataTransfer` y no requiere permisos porque es una respuesta directa al gesto del usuario.

## Compatibilidad y alternativas

La Clipboard API asíncrona es ampliamente soportada en navegadores modernos. Para compatibilidad con navegadores antiguos (IE, versiones muy antiguas de otros), se puede usar `document.execCommand('copy')`, que solo permite copiar texto seleccionado o el contenido de un input, y solo funciona en un gesto de usuario. Hoy se considera obsoleto.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ History API](01-history-api.md) | [🏠 Inicio](../index.md) | [Geolocation ▶](03-geolocation.md) |
