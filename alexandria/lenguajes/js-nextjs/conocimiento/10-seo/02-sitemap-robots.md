# Sitemap y Robots.txt en Next.js

Next.js ofrece dos maneras de generar `sitemap.xml` y `robots.txt`: mediante archivos especiales en el App Router o con archivos estáticos en la carpeta `public/`. Los archivos especiales permiten una generación dinámica y se integran con el sistema de enrutamiento.

## Sitemap en App Router

Crea un archivo `app/sitemap.ts` (o `.js`) que exporte por defecto una función que devuelva un array de objetos `SitemapEntry`.

```ts
// app/sitemap.ts
import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://miapp.com',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: 'https://miapp.com/about',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
  ]
}
```

- La función puede ser asíncrona; puedes obtener datos de una API o base de datos.
- Cada entrada puede incluir `lastModified`, `changeFrequency`, `priority` e `images` (para sitemaps de imágenes).
- El archivo se sirve automáticamente en `/sitemap.xml` (Next.js también genera un sitemap index si produces múltiples sitemaps).

### Sitemaps múltiples (index)

Para sitios grandes, puedes generar múltiples sitemaps retornando un array de objetos con la propiedad `sitemaps`:

```ts
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: 'https://miapp.com/sitemap-posts.xml' },
    { url: 'https://miapp.com/sitemap-products.xml' },
  ]
}
```

Luego crea los archivos `app/sitemap-posts.xml/route.ts` y `app/sitemap-products.xml/route.ts` (usando Route Handlers) o usa `generateSitemaps` (experimental) para generar dinámicamente los sitemaps hijos.

## Sitemap en Pages Router

No hay soporte nativo de sitemaps como en App Router. Las opciones son:

- Colocar un archivo `sitemap.xml` estático en `public/sitemap.xml` (si no cambia a menudo).
- Crear una API Route en `pages/api/sitemap.xml.js` que genere el XML dinámicamente y devolverlo con `res.setHeader('Content-Type', 'text/xml')`. Luego, redirigir o enlazar a `/api/sitemap.xml` en el `robots.txt`.

```javascript
// pages/api/sitemap.xml.js
import { SitemapStream, streamToPromise } from 'sitemap'

export default async function handler(req, res) {
  const smStream = new SitemapStream({ hostname: 'https://miapp.com' })
  // ... escribir en el stream
  const sitemap = await streamToPromise(smStream).then(sm => sm.toString())
  res.setHeader('Content-Type', 'text/xml')
  res.write(sitemap)
  res.end()
}
```

## Robots.txt en App Router

Crea un archivo `app/robots.ts` que exporte un objeto `Robots`.

```ts
// app/robots.ts
import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/admin/',
    },
    sitemap: 'https://miapp.com/sitemap.xml',
  }
}
```

- La función puede ser asíncrona si necesitas determinar reglas dinámicamente.
- Se sirve automáticamente en `/robots.txt`.

## Robots.txt en Pages Router

Coloca un archivo `robots.txt` estático en `public/robots.txt`. Si necesitas generación dinámica, puedes crear una API Route similar a la del sitemap.

```javascript
// pages/api/robots.js
export default function handler(req, res) {
  res.setHeader('Content-Type', 'text/plain')
  res.write(`User-agent: *\nAllow: /\nDisallow: /admin/\nSitemap: https://miapp.com/sitemap.xml`)
  res.end()
}
```

## Buenas prácticas

- Mantén los sitemaps actualizados, especialmente si usas ISR o contenido dinámico.
- Para sitios grandes, usa múltiples sitemaps y un sitemap index.
- Asegúrate de que las URLs en el sitemap sean canónicas y accesibles (sin redirecciones).
- En `robots.ts`, no olvides incluir la ruta al sitemap.
- Testea el sitemap con Google Search Console.
- Si usas App Router, aprovecha la generación dinámica de sitemaps con datos de la aplicación (por ejemplo, listar todos los posts).

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ API de Metadatos en Next.js](01-metadata-api.md) | [🏠 Inicio](../index.md) | [Datos Estructurados (JSON‑LD) ▶](03-datos-estructurados.md) |
