# API de Metadatos y SEO en el App Router

## De `next/head` a la Metadata API

El App Router reemplaza el componente `next/head` del Pages Router por una **API de metadatos declarativa y extensible**. En lugar de insertar etiquetas manualmente, se exportan objetos o funciones generadoras que Next.js convierte automáticamente en etiquetas `<title>`, `<meta>`, `<link>`, etc.

## Metadatos estáticos

Para valores fijos, se exporta una constante `metadata`.

```tsx
// app/layout.tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Mi Aplicación',
  description: 'Descripción global del sitio',
  openGraph: {
    title: 'Mi App',
    description: 'Comparte esta app',
    url: 'https://miapp.com',
    siteName: 'Mi App',
    images: ['/og-default.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mi App',
    images: ['/twitter-default.png'],
  },
}
```

Estos metadatos se aplican a todas las páginas a menos que un hijo los sobrescriba.

## Metadatos dinámicos

Cuando los metadatos dependen de la ruta o de datos externos, se exporta una función `generateMetadata`. Esta recibe `params`, `searchParams` y el `parent` metadata (los metadatos del segmento padre).

```tsx
// app/blog/[slug]/page.tsx
export async function generateMetadata({ params, searchParams }): Promise<Metadata> {
  const post = await getPost(params.slug)
  if (!post) return { title: 'Post no encontrado' }

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      images: [post.image],
    },
  }
}
```

`generateMetadata` se ejecuta en el servidor en el momento de la petición (para SSR/SSG/ISR). Puede usar `fetch` y cualquier lógica de servidor.

## Fusión de metadatos

Los metadatos se heredan y se fusionan desde el segmento raíz hasta la página más interna. Los campos definidos en la página sobrescriben los del layout. Algunos campos, como `title.template`, permiten un patrón de composición:

```tsx
// app/layout.tsx
export const metadata: Metadata = {
  title: {
    template: '%s | Mi App',
    default: 'Mi App',
  },
}
```

```tsx
// app/blog/[slug]/page.tsx
export async function generateMetadata({ params }) {
  return { title: post.title } // se convierte en "Título del Post | Mi App"
}
```

## Principales propiedades del objeto Metadata

- `title`: string o `{ default: string, template: string, absolute: string }`
- `description`: string
- `keywords`: string[]
- `robots`: string o objeto `{ index, follow, googleBot, ... }`
- `alternates`: `{ canonical, languages, media }`
- `openGraph`: `{ title, description, url, siteName, images, type, ... }`
- `twitter`: `{ card, title, description, images, ... }`
- `icons`: `{ icon, shortcut, apple, other }`
- `metadataBase`: URL base para resolver rutas relativas en metadatos (importante para OG images).
- `verification`: para claves de Google, Yandex, etc.
- `other`: para metadatos personalizados (objeto clave-valor).

## Archivos de metadatos complementarios

Además de las exportaciones, el App Router permite generar recursos como imágenes y manifiestos mediante archivos especiales (ya profundizados en `metadata-files.md`):
- `opengraph-image.tsx` / `twitter-image.tsx` – Imágenes dinámicas.
- `icon.tsx` / `apple-icon.tsx` – Favicones.
- `sitemap.ts` – Sitemap XML.
- `robots.ts` – Robots.txt.
- `manifest.ts` – Web App Manifest.

## SEO avanzado con la Metadata API

- **Canonical URL**: usar `metadata.alternates.canonical` para evitar contenido duplicado.
- **Structured Data**: no hay integración nativa en la Metadata API, pero se puede inyectar `<script type="application/ld+json">` mediante `metadata.other` o renderizando manualmente en el layout.
- **Metaetiquetas para redes sociales**: Open Graph y Twitter Cards se configuran directamente en el objeto, sin necesidad de componentes adicionales.
- **Redirecciones y `notFound` en `generateMetadata`**: Si se llama a `notFound()` o `redirect()` dentro de `generateMetadata`, la página se comportará en consecuencia.

## Viewport y themeColor

Desde Next.js 14, `viewport` y `themeColor` no forman parte del objeto `metadata`; se exportan por separado.

```tsx
import type { Viewport } from 'next'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#000000',
}
```

## Uso con TypeScript

El tipo `Metadata` de `next` cubre todas las propiedades. Para `generateMetadata`, se recomienda tipar la función:

```tsx
import type { Metadata, ResolvingMetadata } from 'next'

type Props = { params: { slug: string }, searchParams: { [key: string]: string } }

export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const parentMetadata = await parent
  // ...
}
```

## Buenas prácticas

- Define un `metadataBase` global para simplificar rutas de imágenes y canonical.
- Centraliza los valores por defecto en el layout raíz y sobreescribe en páginas.
- Asegúrate de que cada página tenga un título único y descriptivo.
- Utiliza `title.template` para mantener coherencia de marca.
- Genera imágenes Open Graph dinámicas cuando el contenido varíe.
- No abuses de `generateMetadata`; si los datos ya están disponibles en un fetch de página, reutilízalos (React cache los deduplica).
- Verifica con herramientas como Google Rich Results Test y Meta Tags debugger.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Implementación de Modales con Rutas](2-convenciones-enrutamiento/05-modales.md) | [🏠 Inicio](../index.md) | [Configuración de Segmento ▶](03-configuracion-segmento.md) |
