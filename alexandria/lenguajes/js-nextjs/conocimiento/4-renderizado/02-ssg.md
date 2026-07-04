# Static Site Generation (SSG)

## Concepto

La Generación de Sitios Estáticos (SSG) consiste en pre‑renderizar las páginas **en tiempo de construcción** (build time). El HTML resultante se sirve directamente desde un CDN o servidor estático, sin ejecución de lógica en cada petición. Es la estrategia más rápida y eficiente para contenido que no cambia con frecuencia.

## SSG en Pages Router

Se utiliza `getStaticProps` y, para rutas dinámicas, `getStaticPaths`.

```javascript
// pages/blog/[slug].js
export async function getStaticPaths() {
  const posts = await fetch('https://...').then(res => res.json())
  const paths = posts.map(post => ({ params: { slug: post.slug } }))
  return { paths, fallback: 'blocking' }
}

export async function getStaticProps({ params }) {
  const post = await fetch(`https://.../${params.slug}`).then(res => res.json())
  return { props: { post } }
}

export default function Post({ post }) {
  return <article>{post.content}</article>
}
```

- `getStaticProps` se ejecuta en el momento del build y sus datos se inyectan en la página.
- `getStaticPaths` determina qué rutas dinámicas se pre‑renderizarán.

## SSG en App Router

En el App Router, las páginas son **estáticas por defecto** si no contienen funciones dinámicas. Para rutas dinámicas, se usa `generateStaticParams`.

```tsx
// app/blog/[slug]/page.tsx
export async function generateStaticParams() {
  const posts = await fetch('https://...').then(res => res.json())
  return posts.map(post => ({ slug: post.slug }))
}

export default async function Post({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await fetch(`https://.../${slug}`).then(res => res.json())
  return <article>{post.content}</article>
}
```

- El `fetch` sin opciones de caché especiales se comporta como `force-cache`, por lo que se cachea permanentemente.
- Los componentes de servidor asíncronos se ejecutan en el build y el resultado HTML se guarda.

## Funcionamiento

1. Durante `next build`, Next.js identifica las páginas estáticas.
2. Ejecuta los métodos de obtención de datos y renderiza los componentes a HTML.
3. Los archivos HTML generados se colocan en el directorio de salida (`.next/server/app/` o `pages/`).
4. En producción, el servidor devuelve estos archivos estáticos directamente.

## Ventajas del SSG

- **Rendimiento máximo**: el HTML se sirve desde CDN, con latencia mínima.
- **Escalabilidad**: no hay carga en el servidor por cada petición.
- **SEO excelente**: el contenido está siempre presente en el HTML.

## Desventajas del SSG

- **Contenido estático**: no se actualiza hasta la próxima construcción, a menos que se combine con ISR.
- **Tiempos de build largos**: para sitios con muchas páginas, el build puede demorar.
- **No apto para contenido por petición**: no se puede acceder a cookies, headers, etc.

## Consideraciones

- **`fallback` en Pages Router**: controla qué ocurre con rutas no generadas (`false`, `true`, `'blocking'`).
- **`dynamicParams` en App Router**: `true` (por defecto) permite generación bajo demanda; `false` devuelve 404.
- SSG puro (sin ISR) es ideal para documentación, blogs que no cambian, páginas de marketing.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Server‑Side Rendering (SSR)](01-ssr.md) | [🏠 Inicio](../index.md) | [Incremental Static Regeneration (ISR) ▶](03-isr.md) |
