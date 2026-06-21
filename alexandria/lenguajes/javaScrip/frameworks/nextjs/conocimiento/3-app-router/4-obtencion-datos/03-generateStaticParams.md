# Generación Estática de Parámetros

## Propósito

`generateStaticParams` reemplaza a `getStaticPaths` del Pages Router. Es una función asíncrona que se exporta desde una página dinámica o layout, y devuelve un array de objetos que representan las rutas que se pre‑renderizarán estáticamente en la compilación.

```tsx
// app/blog/[slug]/page.tsx
export async function generateStaticParams() {
  const posts = await fetch('https://...').then(res => res.json())
  return posts.map(post => ({ slug: post.slug }))
}

export default function Page({ params }) { ... }
```

## Formato de retorno

Debe retornar un array de objetos que contengan los `params` necesarios para el segmento dinámico.

- Para `[slug]`: `{ slug: 'valor' }`
- Para `[...slug]`: `{ slug: ['a', 'b'] }`
- Para `[[...slug]]`: Incluir `{ slug: [] }` para la ruta sin parámetros, además de `{ slug: ['a'] }` etc.
- Para múltiples parámetros: `{ category: 'ropa', product: 'camisa' }`

## Parámetros opcionales y catch‑all

En el caso de `[[...slug]]`, el parámetro `slug` puede ser `undefined` o un array vacío según la versión. Para Next.js 15, se debe devolver `params: { slug: [] }` para la ruta base.

## Comportamiento de `dynamicParams`

Por defecto, `dynamicParams` es `true`, lo que significa que las rutas no incluidas en el array se generarán bajo demanda (similar a `fallback: 'blocking'`). Si se quiere que cualquier ruta no generada devuelva 404, se debe exportar:

```tsx
export const dynamicParams = false
```

## Uso junto con `revalidate`

Las páginas pre‑renderizadas con `generateStaticParams` pueden seguir siendo incrementales si se exporta `revalidate`. Next.js revalidará las páginas estáticas en segundo plano según el tiempo configurado.

## Acceso a datos

`generateStaticParams` puede usar `fetch` con todas las capacidades de caché. También puede consultar bases de datos o sistemas de archivos directamente.

## Coexistencia con Route Handlers

`generateStaticParams` no aplica a Route Handlers (`route.ts`). Solo para páginas y layouts que definen segmentos dinámicos.

## Tipado en TypeScript

```tsx
import type { Metadata } from 'next'

type Props = { params: { slug: string } }

export async function generateStaticParams(): Promise<Array<{ slug: string }>> {
  return [{ slug: 'hello' }]
}

export default function Page({ params }: Props) { ... }
```

## Consideraciones de rendimiento

- Generar miles de páginas puede ralentizar la compilación. Para sitios grandes, combina con `dynamicParams: true` para pre‑renderizar solo las más populares y generar el resto bajo demanda.
- `generateStaticParams` se ejecuta en el momento de la construcción y puede incrementar el tiempo de build.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Estrategias de Revalidación en App Router](02-revalidacion.md) | [🏠 Inicio](../../index.md) | [Funciones Dinámicas y Comportamiento de Ruta ▶](04-dynamic-functions.md) |
