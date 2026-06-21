# Estilos Globales en Next.js

## Propósito

Los estilos globales afectan a toda la aplicación: resets de CSS, tipografía base, variables CSS, utilidades globales. Next.js permite importar archivos CSS globales solo en lugares específicos.

## Pages Router

Los estilos globales se importan **únicamente** en `pages/_app.js` (o `.tsx`). Cualquier intento de importar un archivo CSS global en otro lugar lanza un error.

```jsx
// pages/_app.js
import '../styles/globals.css'

export default function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />
}
```

Puedes tener múltiples archivos globales (por ejemplo, uno de reset, uno de variables) y simplemente importarlos secuencialmente en `_app`.

## App Router

En el App Router, los estilos globales se importan en el **Root Layout** (`app/layout.tsx`). También se permite importar en layouts anidados, pero **solo se recomienda** en el root layout para mantener la consistencia.

```tsx
// app/layout.tsx
import './globals.css'

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}
```

A diferencia del Pages Router, no puedes importar CSS global en cualquier componente (ni siquiera en otros layouts). Si necesitas estilos específicos para una sección, usa CSS Modules o el enfoque de `@import` dentro de archivos CSS globales para organizar.

## Archivos de reset y normalización

Es común incluir un reset como `modern-normalize` o `sanitize.css`. Puedes instalarlos e importarlos.

```bash
npm install modern-normalize
```

```css
/* globals.css */
@import 'modern-normalize';
```

O directamente importar en `_app` / root layout: `import 'modern-normalize/modern-normalize.css'`.

## Variables CSS globales

Define variables en `:root` dentro de tu CSS global.

```css
:root {
  --color-primary: #0070f3;
  --color-background: #ffffff;
}
```

Luego úsalas en cualquier módulo o Tailwind.

## Sass y preprocesadores

Next.js soporta Sass de forma nativa. Solo debes instalar `sass`:

```bash
npm install sass
```

Puedes usar archivos `.scss` o `.sass`. Los archivos globales con extensión `.scss` también se importan en `_app` o root layout, y los módulos como `*.module.scss`.

```jsx
// pages/_app.js
import '../styles/globals.scss'
```

Dentro de `globals.scss` puedes usar `@use` o `@import` para estructurar tus estilos. Nota: `@import` está obsoleto en Dart Sass; prefiere `@use`.

## Buenas prácticas

- Mantén los estilos globales mínimos: solo resets, variables y tipografía base.
- Evita sobrecargar con reglas muy específicas que podrían interferir con módulos o Tailwind.
- Si usas Tailwind, la mayoría de los resets ya están incluidos en `@tailwind base`.
- Organiza los archivos CSS globales con una estructura clara (por ejemplo, `styles/base.css`, `styles/utilities.css`), luego impórtalos en el archivo principal con `@import`.
- No abuses de `!important` en estilos globales.
- Para estilos condicionales globales (por ejemplo, temas claro/oscuro), utiliza variables CSS o Tailwind con la clase `dark`.

Con estos cuatro documentos, se cubre todo el espectro de manejo de estilos en Next.js, desde las técnicas más clásicas hasta las más modernas y los desafíos del App Router.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ CSS‑in‑JS en Next.js](03-css-in-js.md) | [🏠 Inicio](../index.md) | [API de Metadatos en Next.js ▶](../10-seo/01-metadata-api.md) |
