# Documento HTML personalizado

## Propósito

`_document` se renderiza **únicamente en el servidor** y permite modificar las etiquetas `<html>`, `<head>` y `<body>` de la respuesta HTML inicial. No se hidrata en el cliente y **no admite hooks de React** (como `useState`, `useEffect`). Es el lugar para agregar metadatos a nivel de documento, fuentes, scripts de terceros que requieran estar en el `<head>` o atributos en el `<html>`.

## Estructura básica

```js
import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="es">
      <Head />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
```

- `<Html>`: reemplaza la etiqueta `<html>`, permite pasar atributos como `lang`, `className`.
- `<Head>`: contenido del `<head>` que no es el de las páginas (no confundir con `next/head`). Los elementos aquí son comunes a todas las páginas.
- `<Main>`: donde se inyecta el contenido de la aplicación.
- `<NextScript>`: donde se inyectan los scripts de Next.js (bundles, polyfills).

## Renderizado exclusivo en servidor

- En desarrollo, `_document` se ejecuta en cada recarga.
- En producción, se ejecuta durante la construcción (SSG) o en cada petición (SSR). Nunca llega al navegador.

## Casos de uso

### 1. Agregar atributos al `<html>` o `<body>`

```js
<Html lang="es" className="scroll-smooth">
```

### 2. Incluir fuentes externas

```js
<Head>
  <link href="https://fonts.googleapis.com/css2?family=Roboto" rel="stylesheet" />
</Head>
```

> [!NOTE]
> **Nota**: Desde Next.js 13, es preferible usar `next/font` para optimización automática. Pero si no se puede, `_document` es la alternativa.

### 3. Añadir scripts de terceros en el `<head>`

```js
<Head>
  <script src="https://example.com/analytics.js" />
</Head>
```

Sin embargo, para un control más fino se recomienda `next/script`.

### 4. Metaetiquetas estáticas globales

```js
<Head>
  <meta name="description" content="Sitio web de ..." />
  <link rel="icon" href="/favicon.ico" />
</Head>
```

Pero estas metaetiquetas pueden ser sobrescritas por el componente `next/head` de cada página; `_document` establece los valores por defecto.

### 5. PWA (service worker)

Para instalar un service worker, se puede colocar un script en `_document`:

```js
<Head>
  <script dangerouslySetInnerHTML={{
    __html: `if ('serviceWorker' in navigator) { ... }`
  }} />
</Head>
```

### 6. Solucionar problemas de CSS-in-JS (server-side rendering)

Librerías como `styled-components` necesitan extraer los estilos en el servidor e inyectarlos en el `<head>`. Para ello se sobrescribe `getInitialProps` de `_document`.

```js
import Document, { Html, Head, Main, NextScript } from 'next/document'
import { ServerStyleSheet } from 'styled-components'

export default class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const sheet = new ServerStyleSheet()
    const originalRenderPage = ctx.renderPage

    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: (App) => (props) => sheet.collectStyles(<App {...props} />),
        })

      const initialProps = await Document.getInitialProps(ctx)
      return {
        ...initialProps,
        styles: [initialProps.styles, sheet.getStyleElement()],
      }
    } finally {
      sheet.seal()
    }
  }
}
```

Este es un patrón clásico con CSS-in-JS que aún se usa en proyectos con Pages Router.

## `Document.getInitialProps` en detalle

- Se ejecuta solo en el servidor.
- Recibe un contexto con `renderPage`: función que renderiza la aplicación para obtener el HTML.
- Debe devolver `{ html, head, styles }`. Next.js usará `styles` para inyectar los estilos en el `<head>`.

## Limitaciones

- **No puede usar hooks** ni estado.
- **No se puede importar componentes que usen `'use client'`** porque son solo del cliente; aunque `_document` es del servidor, pero si se importa un Client Component, su lógica de cliente no se ejecutará allí. Mejor evitarlo.
- No es un componente React normal, se trata como un documento HTML en el servidor.
- No se puede acceder a `next/router` ni a datos dinámicos de la petición porque no tiene acceso al contexto de la página.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Componente de Aplicación Personalizado](01-_app.md) | [🏠 Inicio](../../index.md) | [Página de error personalizada ▶](03-_error.md) |
