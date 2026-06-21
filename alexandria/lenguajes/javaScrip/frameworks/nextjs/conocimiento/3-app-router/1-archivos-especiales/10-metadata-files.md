# Archivos de Metadatos Estáticos y Dinámicos

## Tipos de archivos

El App Router permite generar metadatos y recursos como imágenes, faviconos, sitemaps mediante archivos especiales. Todos se basan en la convención de nombres y, en muchos casos, pueden ser dinámicos (usando `ImageResponse` o funciones).

| Archivo               | Propósito                                | Dinámico (generación)   |
|-----------------------|------------------------------------------|---------------------------|
| `opengraph-image.js`  | Imagen Open Graph (1200x630)             | Sí (JSX con ImageResponse)|
| `twitter-image.js`    | Imagen para Twitter Card                 | Sí                        |
| `icon.js`             | Favicon (devuelve blob de imagen)        | Sí                        |
| `apple-icon.js`       | Apple Touch Icon                         | Sí                        |
| `sitemap.js`          | Sitemap XML                              | Sí (función que devuelve array) |
| `robots.js`           | Robots.txt                               | Sí (objeto o función)     |
| `manifest.js`         | Web App Manifest                         | Sí (función)              |
| `opengraph-image.png` | Estático (ubicado en carpeta)            | No (archivo físico)       |

## Imágenes dinámicas (opengraph-image, icon, etc.)

Estos archivos exportan por defecto una función que retorna JSX renderizado en el servidor usando `ImageResponse` (de `@vercel/og` o `next/server`). Pueden recibir `params` y `searchParams`.

```tsx
// app/opengraph-image.tsx
import { ImageResponse } from 'next/og'

export const runtime = 'edge' // recomendado para rendimiento
export const alt = 'Acerca de'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image({ params }: { params: { slug: string } }) {
  return new ImageResponse(
    (
      <div style={{ background: 'white' }}>
        <h1>{params.slug}</h1>
      </div>
    ),
    { width: 1200, height: 630 }
  )
}
```

Archivos estáticos como `opengraph-image.png` en la carpeta `public/` también funcionan, pero los dinámicos permiten personalización.

## Sitemap

El archivo `sitemap.js` exporta por defecto una función que devuelve un array de objetos con las entradas del sitemap.

```ts
// app/sitemap.ts
import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: 'https://example.com', lastModified: new Date() },
    { url: 'https://example.com/about', lastModified: new Date() },
  ]
}
```

Puede ser asíncrono y aceptar params para rutas dinámicas? No directamente; se generan todas las entradas de una vez. Para múltiples segmentos, se puede usar `generateSitemaps` (experimental).

## Robots

`robots.js` exporta un objeto `Robots` o una función que devuelve uno.

```ts
// app/robots.ts
import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/', disallow: '/private/' },
    sitemap: 'https://example.com/sitemap.xml',
  }
}
```

## Manifest

`manifest.js` genera el manifiesto de aplicación web.

```ts
// app/manifest.ts
import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Mi App',
    short_name: 'App',
    start_url: '/',
    display: 'standalone',
    icons: [{ src: '/icon.png', sizes: '192x192', type: 'image/png' }],
  }
}
```

## Archivos estáticos

Si no se necesita personalización, se pueden colocar directamente en `public/` con los nombres esperados (`favicon.ico`, `robots.txt`, etc.). Los archivos en `public/` tienen prioridad sobre los generados en `app/` en algunos casos (por ejemplo, `favicon.ico` en `public` se usará antes que `icon.js`). Se recomienda usar el sistema de archivos del App Router para mayor flexibilidad.

## Convenciones de ubicación

- Los archivos de metadatos se colocan en la raíz del `app/` para el sitio completo, o en segmentos específicos para personalizar por ruta (por ejemplo, `app/blog/opengraph-image.tsx` para el blog). Next.js usará el más específico.
- `sitemap.js`, `robots.js` y `manifest.js` generalmente van en la raíz, aunque se pueden colocar en segmentos (el comportamiento exacto puede variar).

## Notas sobre TypeScript

Los tipos de retorno están definidos en `next` (`MetadataRoute.Sitemap`, `MetadataRoute.Robots`, etc.), por lo que se obtiene autocompletado y validación.

---

Con este profundo repaso, se tiene un dominio completo de cada archivo especial del App Router y su rol en la construcción de aplicaciones modernas con Next.js.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Fallback para Rutas Paralelas](09-default.md) | [🏠 Inicio](../../index.md) | [Streaming y Suspense en el App Router ▶](../01-streaming-suspense.md) |
