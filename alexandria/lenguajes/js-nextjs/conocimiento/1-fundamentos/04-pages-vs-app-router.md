# Pages vs app router

## Dos paradigmas de enrutamiento

Next.js ofrece dos sistemas de enrutamiento que conviven (aunque no se mezclan en el mismo proyecto):

- **Pages Router**: Carpeta `pages/`. Modelo tradicional, maduro y estable.
- **App Router**: Carpeta `app/`. Modelo moderno, recomendado para nuevos proyectos, basado en React Server Components.

## Comparativa detallada

| Característica                | Pages Router                            | App Router                                    |
|-------------------------------|-----------------------------------------|-----------------------------------------------|
| **Carpeta base**              | `pages/`                                | `app/`                                        |
| **Componente de página**      | Export default de un archivo en `pages/`| `page.js` / `page.tsx`                        |
| **Layouts anidados**          | No nativo; se implementan manualmente.  | Nativos con `layout.js`, persistencia de estado. |
| **Obtención de datos**        | `getServerSideProps`, `getStaticProps`, `getStaticPaths`. | Directamente en Server Components asíncronos, `fetch` extendido. |
| **API**                       | `pages/api/*.js` → función `(req, res)` | `route.js` → `GET`, `POST`, etc. (Web API)    |
| **Metadatos y SEO**           | `next/head` en cada página.            | API de `metadata` y `generateMetadata`.       |
| **Carga y errores**           | Manual con estado local.               | `loading.js`, `error.js` por segmento.        |
| **Streaming y Suspense**      | No soportado de forma nativa.          | Integración automática con streaming.         |
| **React Server Components**   | No disponible (solo CSR/SSR/SSG).      | Sí, por defecto. Componentes de servidor asíncronos. |
| **Client Components**         | Todos los componentes tienen estado.   | Marcados explícitamente con `'use client'`.   |
| **Rutas dinámicas**           | `[id].js`                              | `[id]/page.js`                                |
| **Catch‑all**                 | `[...slug].js`                         | `[...slug]/page.js`                           |
| **Rutas paralelas**           | No soportadas.                         | Slots con `@folder`.                          |
| **Rutas interceptadas**       | No soportadas.                         | `(.)folder`, `(..)folder`.                    |
| **Middleware**                | No disponible.                         | `middleware.ts` en raíz.                      |
| **Internacionalización nativa**| Sí (`i18n` en config).                 | No nativa; se implementa con middleware.      |
| **Estabilidad**               | Maduro, considerado legacy.            | Estable y recomendado para nuevos proyectos.  |

## Ventajas del App Router

- **Renderizado híbrido más potente**: Streaming y Partial Prerendering (PPR) permiten una experiencia de carga más rápida.
- **Separación clara** entre código de servidor y cliente, reduciendo el JavaScript enviado al navegador.
- **Layouts persistentes**: La UI que envuelve una sección no se re-renderiza al cambiar de página.
- **Suspense integrado**: Carga granular de partes de la interfaz.
- **Obtención de datos simplificada**: Menos boilerplate; se puede hacer fetch directamente en el componente.
- **Server Actions**: Mutaciones sin necesidad de endpoints manuales.
- **Mejor SEO**: Metadatos declarativos y dinámicos por segmento.

## Ventajas del Pages Router

- **Curva de aprendizaje más suave**: Para desarrolladores acostumbrados a React clásico.
- **Ecosistema más amplio de ejemplos y tutoriales** (aunque se está equilibrando).
- **Internacionalización nativa** sin configuraciones extra.
- **Ciertas funcionalidades legacy** o patrones de código aún dependen de `getInitialProps` o de acceso directo a `req`/`res`.

## Migración y coexistencia

- **No se recomienda mezclar ambos routers en el mismo proyecto**, aunque técnicamente es posible (carpetas `pages/` y `app/` coexisten; las rutas de `pages/` se montan primero). Para migrar, lo habitual es ir moviendo rutas gradualmente al App Router.

- **Incremental adoption**: El App Router fue diseñado para permitir una adopción progresiva. Se puede empezar un nuevo proyecto directamente con App Router y, si se necesita, mantener algunas páginas en el Pages Router mientras se migran.

## Elección para nuevos proyectos

Next.js recomienda el **App Router** para todas las nuevas aplicaciones, ya que incorpora las últimas innovaciones de React (RSC, Suspense) y es el foco de desarrollo futuro. El Pages Router se mantiene por compatibilidad pero no recibirá nuevas características significativas.

## Ejemplo comparativo de una página de blog

**Pages Router:**
```javascript
// pages/posts/[slug].js
export async function getStaticProps({ params }) {
  const post = await getPost(params.slug)
  return { props: { post }, revalidate: 60 }
}

export async function getStaticPaths() {
  const posts = await getPosts()
  return { paths: posts.map(p => ({ params: { slug: p.slug } })), fallback: 'blocking' }
}

export default function Post({ post }) {
  return <article>{post.content}</article>
}
```

**App Router:**
```javascript
// app/posts/[slug]/page.js
export async function generateStaticParams() {
  const posts = await getPosts()
  return posts.map(p => ({ slug: p.slug }))
}

export default async function Post({ params }) {
  const post = await getPost(params.slug) // fetch con cache y revalidación
  return <article>{post.content}</article>
}
```

La diferencia principal es la eliminación de funciones exportadas separadas y la posibilidad de usar `async/await` directamente en el componente.

---

Cada uno de estos documentos constituye una pieza fundamental para comprender el porqué, el cómo y el contexto de Next.js. A partir de aquí se puede profundizar en los sistemas de enrutamiento específicos, el renderizado y todas las capas avanzadas.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Estructura proyecto](03-estructura-proyecto.md) | [🏠 Inicio](../index.md) | [Componente de Aplicación Personalizado ▶](../2-pages-router/1-archivos-especiales/01-_app.md) |
