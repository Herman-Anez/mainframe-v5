# Rutas Dinámicas en App Router

## Segmentos dinámicos

Se definen con corchetes `[param]` y capturan un segmento de la URL.

```
app/blog/[slug]/page.tsx   → /blog/mi-post
```

El valor está disponible en el componente mediante `params`. En versiones recientes de Next.js (15+), `params` es una **promesa** que debe ser `await`eada.

```tsx
// Next.js 15+
export default async function BlogPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  return <h1>Post: {slug}</h1>
}
```

En layouts funciona igual. El layout recibe `params` correspondientes al segmento donde se ubica.

## Catch‑all `[...slug]`

Captura uno o más segmentos y los convierte en un array.

```
app/docs/[...slug]/page.tsx   → /docs/a/b/c   → slug = ['a','b','c']
```

Si no hay ningún segmento extra, la ruta no coincide (devuelve 404). Se debe usar `[[...slug]]` para que sea opcional.

## Catch‑all opcional `[[...slug]]`

El mismo array, pero la ruta base sin segmentos también funciona, y `slug` será `undefined` (o `[]` en versiones más recientes con ajustes). En Next.js 15, cuando no hay segmentos, `slug` es `undefined`.

```tsx
export default async function ShopPage({
  params,
}: {
  params: Promise<{ slug?: string[] }>
}) {
  const { slug } = await params
  // slug puede ser undefined o un array
}
```

## Generación estática con `generateStaticParams`

Reemplaza a `getStaticPaths`. Se exporta desde la página (o layout) que contiene segmentos dinámicos.

```tsx
export async function generateStaticParams() {
  const posts = await fetch('...').then(res => res.json())
  return posts.map(post => ({ slug: post.slug }))
}
```

> [!IMPORTANT]
> **Importante**: Si `dynamicParams` es `true` (por defecto), las rutas no generadas se renderizan bajo demanda (equivalente a `fallback: 'blocking'` del Pages Router). Si es `false`, devuelven 404.

## `params` en Route Handlers

En `route.ts`, `params` también está disponible como segundo argumento de los métodos HTTP. En Next.js 15 es una promesa.

```ts
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return Response.json({ id })
}
```

## Precedencia de rutas

Las rutas estáticas tienen prioridad sobre las dinámicas. Por ejemplo, si existe `app/blog/featured/page.tsx`, `/blog/featured` usará esa página, no `[slug]`. Si existe un catch‑all, una ruta estática más específica también gana.

## Consideraciones con TypeScript

Tipar `params` es esencial:

```ts
type PageProps = {
  params: Promise<{ category: string; product: string }>
}
```

A veces se necesita un tipo genérico para reutilizar.

## Query strings (`searchParams`)

Los parámetros de consulta no forman parte de la ruta pero se acceden mediante la prop `searchParams` en la página (no en layouts). En Next.js 15 también es una promesa.

```tsx
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ q: string }>
}) {
  const { q } = await searchParams
  return <div>Búsqueda: {q}</div>
}
```

Si se necesita leer `searchParams` en un Client Component, se usa `useSearchParams` de `next/navigation`.

## Validación y manejo de errores

Siempre validar `params` y `searchParams` antes de usarlos (por ejemplo, con `zod`). Llamar a `notFound()` si no coinciden.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Grupos de Rutas](01-grupos-rutas.md) | [🏠 Inicio](../../index.md) | [Rutas Paralelas ▶](03-paralelas.md) |
