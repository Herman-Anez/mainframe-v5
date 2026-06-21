# Internacionalización en el App Router

El App Router no incluye i18n nativo, por lo que se implementa mediante **middleware** y la organización de rutas. La solución más extendida es usar la librería **`next-intl`**, aunque existen otras como `next-i18next` o `i18next` con configuración manual.

## 2.1 Estrategia común: segmento `[locale]`

Se coloca un segmento dinámico `[locale]` en la raíz del `app/` para capturar el idioma.

```
app/
├── [locale]/
│   ├── layout.tsx      # Layout con proveedores de traducción
│   ├── page.tsx        # Página principal
│   └── about/
│       └── page.tsx    # Página about
├── middleware.ts       # Detección y redirección de locale
```

El `middleware` se encarga de:

1. Leer el locale de la URL, una cookie o la cabecera `Accept-Language`.
2. Reescribir o redirigir la petición a la ruta con el prefijo del locale.

## 2.2 Configuración con `next-intl`

### Instalación

```bash
npm install next-intl
```

### Estructura de archivos

- `messages/` contiene los JSON de traducción (`en.json`, `es.json`, etc.).
- `i18n.ts` configura los locales y la función `getRequestConfig`.
- `middleware.ts` implementa la lógica de detección.

### Plugin de Next.js (opcional, next-intl 3+)

Configura `next-intl` en `next.config.js` para una integración más profunda (permite Server Components con hooks de traducción directos):

```javascript
const createNextIntlPlugin = require('next-intl/plugin')
const withNextIntl = createNextIntlPlugin()
module.exports = withNextIntl({})
```

### Configuración de mensajes y request

Crea `i18n.ts`:

```typescript
import { getRequestConfig } from 'next-intl/server'
import { routing } from './routing'

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale
  if (!locale || !routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale
  }
  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  }
})
```

### Routing

Define `routing.ts` con los locales y el default:

```typescript
export const routing = {
  locales: ['en', 'es', 'fr'] as const,
  defaultLocale: 'en' as const,
}
```

### Middleware

```typescript
import createMiddleware from 'next-intl/middleware'
import { routing } from './routing'

export default createMiddleware(routing)

export const config = {
  matcher: ['/', '/(es|en|fr)/:path*'],
}
```

Este middleware:

- Crea una cookie `NEXT_LOCALE` con el locale.
- Redirige las rutas sin prefijo al locale detectado (basado en la cookie o cabeceras).
- Mantiene el locale en la URL.

### Layout raíz

Envuelve la aplicación con `NextIntlClientProvider` (en un Client Component) o usa el proveedor directamente en Server Components.

```tsx
// app/[locale]/layout.tsx
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  const messages = await getMessages()
  return (
    <html lang={params.locale}>
      <body>
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
```

### Uso de traducciones en Server Components

```tsx
import { useTranslations } from 'next-intl'

export default function AboutPage() {
  const t = useTranslations('About')
  return <h1>{t('title')}</h1>
}
```

### Uso en Client Components

El mismo hook funciona si el componente tiene `'use client'` y el proveedor está en el árbol.

```tsx
'use client'
import { useTranslations } from 'next-intl'

export function MyButton() {
  const t = useTranslations('About')
  return <button>{t('cta')}</button>
}
```

## 2.3 Otras librerías y enfoques manuales

- **`next-i18next`**: Popular en Pages Router, también funciona en App Router con configuración adicional. Requiere la carga de traducciones en el servidor y su inyección en el layout.
- **Enfoque manual**: Consiste en leer el locale desde `params.locale` en cada layout o página, cargar los mensajes desde archivos JSON y pasarlos a un contexto o usar una función `t()` simple.

Ejemplo manual:

```tsx
// app/[locale]/layout.tsx
import { notFound } from 'next/navigation'
const locales = ['en', 'es']

export default async function Layout({ children, params }) {
  if (!locales.includes(params.locale)) notFound()
  const messages = (await import(`../messages/${params.locale}.json`)).default
  // ...
}
```

Este enfoque es más artesanal pero viable para proyectos pequeños.

## 2.4 Generación de metadatos dinámicos por locale

Usa `generateMetadata` junto con el `params.locale` para traducir títulos y descripciones:

```tsx
export async function generateMetadata({ params }) {
  const t = await getTranslator(params.locale, 'Metadata')
  return {
    title: t('title'),
    description: t('description'),
  }
}
```

## 2.5 Rutas localizadas (URLs amigables)

Si necesitas que los segmentos de la URL estén traducidos (`/producto` en español, `/product` en inglés), puedes optar por:

- Mapeos estáticos en el middleware para reescribir rutas.
- Definir las rutas dinámicamente con `generateStaticParams` basado en todos los slugs de todos los idiomas.

`next-intl` no maneja esto de forma nativa, pero puedes combinarlo con `path-to-regexp` y un mapeo de rutas.

## 2.6 Sitemaps y robots.txt por locale

Genera sitemaps independientes para cada locale o un sitemap index que enlace a las versiones por idioma. En App Router puedes crear archivos `app/[locale]/sitemap.ts` que devuelvan las URLs con el prefijo del locale.

Ejemplo:

```ts
// app/[locale]/sitemap.ts
import { MetadataRoute } from 'next'

export default function sitemap({ params }: { params: { locale: string } }): MetadataRoute.Sitemap {
  return [
    { url: `https://miapp.com/${params.locale}`, lastModified: new Date() },
    { url: `https://miapp.com/${params.locale}/about`, lastModified: new Date() },
  ]
}
```

Para `robots.txt`, usa un archivo estático por locale o una función generadora.

## 2.7 Dirección RTL (Right‑to‑Left)

Para idiomas como árabe o hebreo, ajusta el atributo `dir` en `<html>` y usa clases CSS lógicas.

```tsx
<html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'}>
```

Tailwind CSS ofrece soporte para RTL activando `rtl` en la configuración.

## 2.8 Formateo de fechas, números y monedas

`next-intl` proporciona hooks como `useFormatter` para fechas, números y listas, basados en el locale actual.

```tsx
import { useFormatter } from 'next-intl'

function EventDate({ date }) {
  const format = useFormatter()
  return <time>{format.dateTime(date, { dateStyle: 'long' })}</time>
}
```

Sin librerías, puedes usar la API nativa `Intl.DateTimeFormat`.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Internacionalización en el Pages Router](01-internacionalizacion-en-el-pages-router.md) | [🏠 Inicio](../index.md) | [Comparativa y migración ▶](03-comparativa-y-migracion.md) |
