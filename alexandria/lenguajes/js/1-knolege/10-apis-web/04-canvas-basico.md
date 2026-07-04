# Canvas basico

## El elemento `<canvas>`

`<canvas>` es un elemento HTML que provee un área de dibujo de píxeles (bitmap) manipulable mediante JavaScript. Es ideal para gráficos, animaciones, procesamiento de imágenes y juegos 2D.

```html
<canvas id="lienzo" width="400" height="300"></canvas>
```

Los atributos `width` y `height` definen la resolución interna del canvas (no el tamaño CSS). Si no se especifican, el tamaño por defecto es 300×150 píxeles. El tamaño mostrado puede escalarse con CSS, pero la resolución interna permanece; para gráficos nítidos se deben ajustar ambos.

## Contexto de dibujo 2D

Se obtiene mediante `getContext('2d')`. Devuelve un objeto `CanvasRenderingContext2D` con métodos y propiedades para dibujar.

```javascript
const canvas = document.getElementById('lienzo');
const ctx = canvas.getContext('2d');
```

## Dibujo de formas básicas

### Rectángulos

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

### Trazados (paths)

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

### Texto

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

## Colores, estilos y gradientes

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

## Transformaciones

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

## Imágenes

Dibujar una imagen en el canvas:

```javascript
const img = new Image();
img.onload = () => ctx.drawImage(img, x, y, ancho?, alto?);
img.src = 'ruta.png';
```

También se pueden recortar regiones con `drawImage(img, sx, sy, sW, sH, dx, dy, dW, dH)`.

## Animaciones

Se usa `requestAnimationFrame` para crear bucles de animación suaves:

```javascript
function animar() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // Actualizar estado y dibujar
  requestAnimationFrame(animar);
}
requestAnimationFrame(animar);
```

## Exportar contenido

- `canvas.toDataURL('image/png')`: devuelve una cadena base64 de la imagen.
- `canvas.toBlob(callback, 'image/png')`: devuelve un Blob.
- Útil para guardar capturas o subirlas al servidor.

## Contexto 3D (WebGL)

Además del contexto 2D, el canvas puede proporcionar un contexto `webgl` o `webgl2` para gráficos 3D acelerados por GPU. Es un tema extenso que va más allá de este archivo introductorio.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Geolocation](03-geolocation.md) | [🏠 Inicio](../index.md) | [Web apis storage ▶](05-web-apis-storage.md) |
