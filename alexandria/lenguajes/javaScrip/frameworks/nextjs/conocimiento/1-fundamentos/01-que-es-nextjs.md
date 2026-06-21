# Que es nextjs

## Definición y filosofía

Next.js es un **framework de React de código abierto** creado por Vercel (antes ZEIT) en 2016. Su objetivo es ofrecer una experiencia de desarrollo completa para aplicaciones web modernas, resolviendo problemas comunes de React como el renderizado en el servidor, la generación estática, la división de código, el enrutamiento y las optimizaciones de rendimiento, todo con una configuración mínima.

A diferencia de React, que es una biblioteca para construir interfaces de usuario, Next.js añade **capacidades full‑stack**:

- Renderizado híbrido (SSR, SSG, ISR, streaming).
- Enrutamiento basado en el sistema de archivos.
- API routes / Route Handlers para construir back‑ends sin servidor.
- Optimizaciones automáticas de imágenes, fuentes y scripts.
- Despliegue sencillo en múltiples plataformas.

Next.js abraza los principios de **“Zero Config”** (aunque permite personalización avanzada), **convención sobre configuración** y **rendimiento por defecto**. Esto acelera el desarrollo sin sacrificar el control cuando se necesita.

## Historia y evolución

- **Next.js 1–8**: Basado en Pages Router, con `getInitialProps`, SSR y SSG simples.
- **Next.js 9**: Se introducen `getStaticProps`, `getServerSideProps` y soporte para API Routes, consolidando el modelo de obtención de datos.
- **Next.js 10**: `next/image`, internacionalización, analíticas.
- **Next.js 11**: Scripts optimizados, fuentes, mejoras en desarrollo.
- **Next.js 12**: Middleware, soporte nativo para ES modules, Rust compiler (SWC) reemplazando Babel.
- **Next.js 13**: **App Router** (beta), React Server Components, layouts anidados, streaming, Turbopack (alfa).
- **Next.js 14**: App Router estable, mejoras en Server Actions, Partial Prerendering (experimental).
- **Next.js 15**: Mejoras en rendimiento, `next/font` por defecto, nuevo sistema de caché, React 19.

## Características principales

1. **Renderizado híbrido**
   - **SSR (Server‑Side Rendering)**: La página se genera en cada petición.
   - **SSG (Static Site Generation)**: Generación en tiempo de compilación.
   - **ISR (Incremental Static Regeneration)**: Actualiza páginas estáticas en segundo plano sin reconstruir todo el sitio.
   - **Streaming**: Envía HTML en trozos para mejorar el LCP.
   - **Client Components**: Posibilidad de hidratar solo las partes interactivas.

2. **Enrutamiento automático**
   - Basado en la estructura de archivos dentro de `pages/` (Pages Router) o `app/` (App Router).
   - Soporta rutas dinámicas, catch‑all, grupos de rutas, rutas paralelas e interceptadas.

3. **Obtención de datos simplificada**
   - En Pages Router mediante funciones exportadas (`getServerSideProps`, `getStaticProps`).
   - En App Router directamente en Server Components asíncronos, con `fetch` extendido que cachea y revalida.

4. **División de código automática**
   - Cada ruta se convierte en un bundle separado, cargado bajo demanda.
   - `next/dynamic` para cargar componentes pesados de forma diferida.

5. **Optimizaciones de recursos**
   - `next/image`: imágenes responsivas, WebP/AVIF, lazy loading, placeholder blur.
   - `next/font`: carga optimizada de fuentes locales y de Google, eliminando requests externos.
   - `next/script`: control fino de la carga de scripts.

6. **API Routes / Route Handlers**
   - Crea endpoints en `pages/api/` o con `route.js` en App Router.
   - Compatibles con Edge Runtime y Serverless.

7. **Estilos integrados**
   - CSS Modules, Sass, CSS‑in‑JS, Tailwind CSS con soporte oficial.

8. **SEO dinámico**
   - API de metadatos (`metadata`, `generateMetadata`) y archivos como `sitemap.js`, `robots.js`, `opengraph-image.js`.

9. **Internacionalización**
   - En Pages Router con configuración nativa. En App Router con middleware y librerías.

10. **Despliegue versátil**
    - Vercel (optimizado), Node.js, Docker, exportación estática.

## Relación con React y el ecosistema

Next.js está construido sobre React, pero añade una capa de servidor que permite renderizar componentes antes de enviarlos al cliente. Con la llegada de React Server Components, Next.js se ha convertido en el principal impulsor de esta arquitectura, permitiendo que los componentes se ejecuten exclusivamente en el servidor, reduciendo el JavaScript enviado al navegador.

## Cuándo usar Next.js

- Aplicaciones que necesitan SEO (e‑commerce, blogs, marketing).
- Proyectos que requieren rendimiento percibido rápido (LCP bajo).
- Aplicaciones con partes estáticas y dinámicas en la misma ruta.
- Equipos que quieren una experiencia de desarrollo unificada front‑end y back‑end.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| ➖ | [🏠 Inicio](../index.md) | [React fundamentos ▶](02-react-fundamentos.md) |
