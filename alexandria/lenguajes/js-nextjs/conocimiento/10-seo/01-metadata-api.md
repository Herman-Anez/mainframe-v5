# API de Metadatos en Next.js

## Introducción

La **Metadata API** es el sistema declarativo del App Router para definir etiquetas `<title>`, `<meta>`, `<link>` y otras que influyen en el SEO y la apariencia en redes sociales. Sustituye al componente `next/head` del Pages Router, aunque este último sigue siendo válido para ese sistema de enrutamiento.

Con la Metadata API, puedes exportar un objeto `metadata` o una función `generateMetadata` desde cualquier `layout.js` o `page.js`. Next.js fusiona automáticamente los metadatos de los segmentos anidados y genera las etiquetas en el `<head>` del HTML.

## Metadatos estáticos

La forma más sencilla es exportar un objeto `metadata` con valores fijos.

```tsx
// app/layout.tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Mi Aplicación',
  description: 'Descripción global del sitio',
  metadataBase: new URL('https://miapp.com'),
  alternates: {
    canonical: '/',
    languages: {
      'en-US': '/en-US',
      'es-ES': '/es-ES',
    },
  },
  openGraph: {
    title: 'Mi Aplicación',
    description: 'Descripción global del sitio',
    url: 'https://miapp.com',
    siteName: 'Mi App',
    images: [
      {
        url: '/og-default.png',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'es_ES',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mi Aplicación',
    description: 'Descripción global del sitio',
    images: ['/twitter-default.png'],
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/shortcut-icon.png',
    apple: '/apple-icon.png',
    other: { rel: 'apple-touch-icon', url: '/apple-touch-icon.png' },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'google-site-verification-code',
    yandex: 'yandex-verification-code',
  },
}
```

### Propiedades más comunes

| Propiedad       | Descripción                                                                                     |
|-----------------|-------------------------------------------------------------------------------------------------|
| `title`         | Título de la página. Puede ser string o objeto con `template`, `default`, `absolute`.          |
| `description`   | Descripción breve (usada en snippet de búsqueda).                                              |
| `metadataBase`  | URL base para resolver rutas relativas en metadatos (importante para OG images).               |
| `openGraph`     | Datos para Open Graph (Facebook, LinkedIn, etc.).                                              |
| `twitter`       | Datos para Twitter Cards.                                                                      |
| `alternates`    | Define URL canónica y versiones de idioma.                                                     |
| `robots`        | Configuración de rastreo e indexación.                                                          |
| `icons`         | Iconos (favicon, apple-touch-icon).                                                            |
| `verification`  | Códigos de verificación de motores de búsqueda.                                                |

## Plantillas de título (`title.template`)

Puedes definir un título base en un layout y sobreescribirlo en las páginas usando un patrón `%s`.

```tsx
// app/layout.tsx
export const metadata: Metadata = {
  title: {
    template: '%s | Mi App',
    default: 'Mi App', // Se usa cuando una página no define título
  },
}
```

```tsx
// app/blog/[slug]/page.tsx
export const metadata: Metadata = {
  title: 'Título del Post', // Resulta en "Título del Post | Mi App"
}
```

Si necesitas un título absoluto (sin template), usa `absolute`:

```tsx
export const metadata: Metadata = {
  title: {
    absolute: 'Página de inicio - Marca',
  },
}
```

## Metadatos dinámicos con `generateMetadata`

Cuando los metadatos dependen de datos externos o de los parámetros de la ruta, exporta una función `generateMetadata` en lugar de un objeto estático.

```tsx
// app/productos/[id]/page.tsx
import type { Metadata, ResolvingMetadata } from 'next'

type Props = {
  params: Promise<{ id: string }>
  searchParams: Promise<{ [key: string]: string }>
}

export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { id } = await params
  const producto = await fetch(`https://api.../productos/${id}`).then(res => res.json())
  if (!producto) return { title: 'Producto no encontrado' }

  const parentMetadata = await parent
  const previousImages = parentMetadata.openGraph?.images || []

  return {
    title: producto.nombre,
    description: producto.descripcion,
    openGraph: {
      title: producto.nombre,
      description: producto.descripcion,
      images: [producto.imagen, ...previousImages],
    },
  }
}
```

- `params` y `searchParams` son promesas que debes esperar (Next.js 15+).
- `parent` proporciona los metadatos del segmento superior; puedes fusionarlos (por ejemplo, añadir imágenes adicionales).
- `generateMetadata` se ejecuta en el servidor; puede usar `fetch`, bases de datos, etc.

## Fusión de metadatos

Next.js fusiona los metadatos desde el root layout hacia abajo. Las propiedades definidas en un segmento más profundo sobrescriben las del padre. Algunos campos (como `openGraph.images`) pueden acumularse si usas el array del padre.

## Metadatos en Pages Router (`next/head`)

Si aún usas el Pages Router, la forma de añadir metadatos es mediante el componente `Head` de `next/head`.

```jsx
// pages/blog/[slug].js
import Head from 'next/head'

export default function Post({ post }) {
  return (
    <>
      <Head>
        <title>{post.title}</title>
        <meta name="description" content={post.excerpt} />
        <meta property="og:title" content={post.title} />
        <meta property="og:image" content={post.image} />
        <link rel="canonical" href={`https://miapp.com/blog/${post.slug}`} />
      </Head>
      <article>{/* ... */}</article>
    </>
  )
}
```

- `next/head` se puede usar en cualquier componente (no solo páginas) y se encarga de insertar las etiquetas en el `<head>` del documento.
- Las etiquetas duplicadas se sobrescriben (la última instancia gana).
- Para SEO dinámico, asegúrate de que los datos lleguen al componente; puedes usar `getStaticProps` o `getServerSideProps` para obtenerlos.

## Buenas prácticas

- Siempre define un `metadataBase` para que las rutas relativas de imágenes y canónicas se resuelvan correctamente.
- Usa `title.template` para mantener coherencia de marca.
- En `generateMetadata`, no dupliques peticiones: si ya obtienes los datos para la página, compártelos (React cache los deduplica automáticamente dentro del mismo render).
- Aprovecha los archivos especiales (`opengraph-image.tsx`, `twitter-image.tsx`) para imágenes dinámicas personalizadas.
- Verifica siempre con el validador de Open Graph y Twitter Card.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Estilos Globales en Next.js](../9-estilos/04-estilos-globales.md) | [🏠 Inicio](../index.md) | [Sitemap y Robots.txt en Next.js ▶](02-sitemap-robots.md) |
