# La Página

## Definición

El archivo `page.js` (o `.tsx`) convierte una carpeta en una ruta accesible. Sin él, la carpeta no es una ruta pública, solo puede contener layouts, componentes internos, etc. Representa el contenido **único** de esa ruta.

## Props

Recibe dos props (ambas son Promesas en versiones recientes de Next.js, aunque en la práctica son resueltas automáticamente):

- `params`: objeto con los segmentos dinámicos de esa ruta.
- `searchParams`: objeto con los query strings de la URL. A partir de Next.js 15, `searchParams` es una **promesa** que debe ser `await`eada.

```tsx
// app/products/[id]/page.tsx
export default async function ProductPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ discount: string }>
}) {
  const { id } = await params
  const { discount } = await searchParams
  return <div>Producto {id} (desc: {discount})</div>
}
```

En Next.js 14 y anteriores, `searchParams` era un objeto plano. La tendencia a promesas es para alinearse con el modelo asíncrono y la parcial prerenderización.

## Comportamiento Server Component

Las páginas son Server Components por defecto. Pueden ser `async` y ejecutar fetching de datos directamente.

```tsx
export default async function BlogPage() {
  const posts = await fetch('https://...').then(res => res.json())
  return <ul>{posts.map(...)}</ul>
}
```

## Configuración por página

Se pueden exportar variables de configuración desde una página (o layout):

- `export const dynamic = 'force-dynamic' | 'force-static'`
- `export const revalidate = 3600`
- `export const runtime = 'edge' | 'nodejs'`

Estas anulan la configuración heredada.

## Obtención de datos estáticos

Para páginas estáticas con `generateStaticParams`, la función se exporta desde la misma página.

```tsx
export async function generateStaticParams() {
  const posts = await fetch('https://...').then(res => res.json())
  return posts.map(post => ({ slug: post.slug }))
}

export default function Page({ params }) { ... }
```

## Navegación y query strings

Para leer los searchParams de forma dinámica sin hacer SSR, se puede usar el hook `useSearchParams` de `next/navigation` en un Client Component.

## Errores comunes

- Acceder a `searchParams` sin await en Next.js 15+ lanzará una advertencia.
- No se puede usar hooks (useState, etc.) en una página a menos que se añada `'use client'` al principio.
- Si la página es un Client Component, no puede ser `async` ni usar `fetch` directamente en el cuerpo; la obtención de datos debe hacerse con hooks o SWR.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ El Layout Persistente](01-layout.md) | [🏠 Inicio](../../index.md) | [Pantalla de Carga ▶](03-loading.md) |
