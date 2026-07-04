# Optimización de imágenes con `next/image

## Introducción

El componente `next/image` es la solución nativa de Next.js para servir imágenes optimizadas. Proporciona **tamaño adecuado según dispositivo**, **formatos modernos (WebP, AVIF)**, **lazy loading** automático, **placeholder** para evitar saltos de layout (CLS) y sirve las imágenes desde un **caché optimizado** (a través de Vercel o un loader personalizado).

## Uso básico

```jsx
import Image from 'next/image'

function MyComponent() {
  return (
    <Image
      src="/foto.jpg"        // Ruta en public/
      width={800}
      height={600}
      alt="Descripción"
    />
  )
}
```

- **Obligatorio**: especificar `width` y `height` (a menos que se use `fill`). Esto reserva el espacio y evita CLS.
- La imagen se sirve redimensionada al tamaño solicitado, en formato moderno si el navegador lo soporta.

## Propiedades esenciales

| Prop         | Descripción                                                                                                                       |
|--------------|-----------------------------------------------------------------------------------------------------------------------------------|
| `src`        | Ruta estática (relativa a `public/`) o URL externa (requiere configuración).                                                      |
| `width`      | Ancho de la imagen renderizada (en píxeles). Se usa para reservar espacio y generar la imagen redimensionada.                     |
| `height`     | Alto. Ídem.                                                                                                                       |
| `fill`       | Si es `true`, la imagen llena su contenedor. La posición y tamaño se controlan con `objectFit`, `objectPosition`. No se usa `width`/`height`. |
| `loader`     | Función personalizada para resolver URLs. Por defecto, el loader interno de Next.js usa caché si el dominio está configurado.      |
| `sizes`      | Cadena de consulta de medios (`(max-width: 768px) 100vw, 50vw`) para que el navegador descargue el tamaño más adecuado.            |
| `quality`    | Calidad de la imagen (1-100). Por defecto, 75.                                                                                    |
| `priority`   | Si es `true`, la imagen se considera LCP y se precarga, sin lazy loading. Debe usarse en la imagen más grande del viewport inicial.|
| `placeholder`| `"empty"` (por defecto) o `"blur"`. `blur` genera una versión de baja calidad (blurhash) que se muestra hasta que la imagen carga. |
| `blurDataURL`| URL de datos base64 para el placeholder blur. Se puede generar con `plaiceholder` o similar.                                      |
| `unoptimized`| Si `true`, la imagen se sirve tal cual, sin optimización.                                                                          |

## Placeholder "blur"

Elimina completamente el CLS y da una sensación de carga progresiva.

```jsx
import Image from 'next/image'
import hero from '../public/hero.jpg' // import local

<Image
  src={hero}
  placeholder="blur"
  alt=""
/>
```

Cuando importas una imagen local (con `import`), Next.js genera automáticamente el `blurDataURL` y el width/height se obtienen del archivo. Esta es la forma más conveniente.

Para imágenes remotas, debes proporcionar manualmente `blurDataURL`.

## Imágenes responsivas con `fill`

```jsx
<div style={{ position: 'relative', width: '100%', aspectRatio: '16/9' }}>
  <Image
    src="/banner.jpg"
    fill
    alt=""
    style={{ objectFit: 'cover' }}
  />
</div>
```

- El contenedor padre debe tener `position: relative` (o `absolute`/`fixed`).
- `fill` estira la imagen para cubrir el contenedor. Con `sizes` y `loader`, el navegador elegirá el mejor tamaño.

## Dominios remotos

Para imágenes de URLs externas, hay que configurar los dominios en `next.config.js`:

```js
module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'example.com',
        port: '',
        pathname: '/images/**',
      },
    ],
  },
}
```

A partir de Next.js 14, `remotePatterns` es la forma recomendada. También se puede usar `domains` (menos específico). Esto asegura que Next.js pueda optimizar y cachear esas imágenes.

## Loaders y CDN personalizada

Si no estás en Vercel y quieres usar otro servicio (Cloudinary, Imgix), puedes configurar un `loader` personalizado:

```js
module.exports = {
  images: {
    loader: 'custom',
    loaderFile: './lib/image-loader.js',
  },
}
```

El archivo `loader` exporta una función que recibe `{ src, width, quality }` y devuelve la URL de la imagen optimizada.

## Generación de imágenes blur placeholder

Para imágenes externas sin blur automático, puedes usar `plaiceholder`:

```bash
npm install plaiceholder
```

```js
import { getPlaiceholder } from 'plaiceholder'

export async function getStaticProps() {
  const { base64, img } = await getPlaiceholder('https://...')
  return { props: { blurDataURL: base64, ... } }
}
```

## Buenas prácticas

- Usa `priority` en la imagen LCP para mejorar el Largest Contentful Paint.
- Especifica `sizes` cuando la imagen tenga un ancho variable según viewport.
- Aprovecha la importación local para obtener width/height y blur automático.
- Para imágenes decorativas, considera `<img>` nativo con `loading="lazy"` si no necesitas optimización del servidor.
- No envuelvas `next/image` en un componente sin pasar `ref` si usas `priority` (Next.js necesita la ref para la precarga).
- Habilita `sharp` para un procesamiento más rápido (instalar `sharp` si usas Node.js).

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Mutaciones de datos en Next.js](../6-obtencion-datos-general/04-mutaciones.md) | [🏠 Inicio](../index.md) | [Optimización de fuentes con `next/font ▶](02-fuentes.md) |
