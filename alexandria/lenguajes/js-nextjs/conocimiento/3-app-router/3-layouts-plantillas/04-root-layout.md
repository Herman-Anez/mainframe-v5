# El Layout Raíz

## Obligación y propósito

Todo proyecto con App Router debe contener un archivo `app/layout.tsx` (o `.js`). Es el punto de partida de la interfaz y define:

- Las etiquetas `<html>` y `<body>`.
- Metadatos globales.
- Estilos globales.
- Proveedores de contexto (mediante un wrapper Client Component).
- Fuentes optimizadas con `next/font`.

**No puede ser eliminado ni renombrado.** Next.js lo busca automáticamente.

## Estructura mínima

```tsx
// app/layout.tsx
import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Mi App',
  description: 'Una aplicación Next.js',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}
```

## Metadatos estáticos y dinámicos

- `export const metadata` para valores estáticos.
- `export async function generateMetadata(...)` para valores dinámicos basados en `params`, `searchParams`, etc. Sin embargo, en el root layout `generateMetadata` solo recibe `parent` metadata (no `params` porque no hay segmento dinámico asociado). Se puede usar para construir el título global a partir de metadatos heredados, pero en la raíz normalmente es estático.

## Fuentes con `next/font`

Es el lugar ideal para cargar fuentes optimizadas, ya que se aplican a todo el documento.

```tsx
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({ children }) {
  return (
    <html lang="es" className={inter.className}>
      <body>{children}</body>
    </html>
  )
}
```

Para fuentes locales:

```tsx
import localFont from 'next/font/local'

const myFont = localFont({
  src: './fonts/MiFuente.woff2',
  display: 'swap',
})
```

## Estilos globales

Los archivos CSS globales (incluyendo los generados por Tailwind) se importan únicamente en el root layout. Cualquier otro layout o página debe usar CSS Modules o soluciones de CSS-in-JS.

```tsx
import './globals.css'
```

## Viewport y otros meta tags

Meta tags como `viewport`, `themeColor`, `colorScheme` se configuran exportando un objeto `viewport` (desde Next.js 14).

```tsx
import type { Viewport } from 'next'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#ffffff',
}
```

## Redirecciones y rewrites globales

Se pueden configurar en `next.config.js`, no en el root layout. El layout solo define la interfaz.

## Root Layout como Server Component

El Root Layout **debe ser un Server Component**. Next.js no permite que sea un Client Component (`'use client'`) porque necesita generar el shell HTML en el servidor para streaming y SEO. Si necesitas interactividad (proveedores), inserta un Client Component hijo.

## Acceso a `headers()` y `cookies()`

Puedes usar estas funciones dentro del root layout, pero al hacerlo, toda la aplicación se vuelve dinámica (renderizado bajo demanda). Si solo necesitas ciertas partes dinámicas, es mejor aislarlas en componentes separados con Suspense.

## Root Layout y SEO

- Los metadatos exportados se aplican a todas las páginas que no sobrescriban los suyos. Las páginas heredan los metadatos del root layout y los fusionan (los más específicos ganan).
- El root layout puede incluir elementos en el `<head>` mediante `next/head`? En realidad, el App Router no usa `next/head`; todo se maneja con la Metadata API. Para scripts globales se puede usar `next/script` o la prop `scripts` del metadata.

## Root Layout y `template.js`

No puede coexistir un `template.js` en el mismo segmento raíz que el root layout porque el root layout es el único layout principal. Sí se puede usar `template.js` en segmentos anidados.

## Consideraciones avanzadas

- Si necesitas personalizar la etiqueta `<html>` con atributos dinámicos (por ejemplo, `className` según el tema), puedes leer cookies en un Server Component y pasarlas al root layout, pero esto dinámicamente hará toda la página SSR. Alternativa: usar un Client Component que modifique la clase después de hidratación.
- El root layout no tiene acceso a `params` ni `searchParams` porque no está vinculado a una ruta dinámica.
- Para aplicaciones multi‑idioma, el root layout suele estar dentro de una carpeta `[locale]` y el verdadero root layout envuelve con un proveedor de idioma. La estructura convencional es:
  ```
  app/
    [locale]/
      layout.tsx   → Root Layout real
      page.tsx
    layout.tsx     → Layout mínimo que redirige o asigna locale
  ```
  Este es un patrón avanzado.

## Buenas prácticas

- Mantén el root layout limpio y delegado en componentes.
- No lo conviertas en un "cajón de sastre"; para layouts intermedios crea `layout.tsx` en subcarpetas.
- Aprovecha `generateMetadata` solo si es estrictamente necesario; prefiere metadatos estáticos.
- Importa `globals.css` solo una vez.
- Coloca los providers en un archivo separado para no abarrotar el root layout.

--- 

Con esta profundización, quedan cubiertas todas las aristas de la composición de layouts, las diferencias con templates, la integración de contextos y la configuración del layout raíz.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Proveedores de Contexto en Layouts](03-providers-context.md) | [🏠 Inicio](../../index.md) | [Fetch Extendido y Caché en App Router ▶](../4-obtencion-datos/01-fetch-extendido.md) |
