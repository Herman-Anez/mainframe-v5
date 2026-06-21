# Configuración de Segmento

## ¿Qué son las configuraciones de segmento?

Son variables que se exportan desde un `layout.tsx`, `page.tsx` o `route.ts` para controlar el comportamiento del renderizado y la caché de ese segmento y sus hijos. Sustituyen a las antiguas opciones de `getStaticProps` y `getServerSideProps` y ofrecen un control declarativo.

## Variables disponibles

| Exportación        | Tipo                   | Descripción                                                                                              |
|--------------------|------------------------|----------------------------------------------------------------------------------------------------------|
| `dynamic`          | `'auto' | 'force-dynamic' | 'force-static'` | Fuerza el renderizado dinámico (SSR) o estático (SSG). `auto` por defecto.               |
| `revalidate`       | `number | false`       | Tiempo en segundos para ISR. `false` desactiva ISR (equivalente a `force-dynamic`).                      |
| `fetchCache`       | `'auto' | 'force-cache' | 'only-no-store' | 'force-no-store'` | Controla cómo se cachean las peticiones `fetch`.          |
| `runtime`          | `'nodejs' | 'edge'`    | Entorno de ejecución del segmento.                                                                       |
| `preferredRegion`  | `string[]`            | Regiones preferidas para ejecución (en Vercel, Edge Network).                                            |
| `dynamicParams`    | `boolean`             | Solo en páginas con `generateStaticParams`. `true` permite generación bajo demanda; `false` devuelve 404.|

## `dynamic`

- **`'auto'`** (por defecto): Next.js decide automáticamente si la página es estática o dinámica basándose en el uso de funciones dinámicas y opciones de fetch.
- **`'force-dynamic'`**: La página se comporta como SSR, es decir, se renderiza en cada petición. Equivale a `cache: 'no-store'` en todas las peticiones y desactiva la caché estática.
- **`'force-static'`**: Fuerza la generación estática. Si la página utiliza funciones dinámicas (`cookies()`, `headers()`, etc.), Next.js lanzará un error en la compilación. Útil para evitar que accidentalmente una página se vuelva dinámica.

## `revalidate`

Define cuántos segundos debe esperar Next.js antes de intentar regenerar la página en segundo plano (ISR). Acepta un número entero o `false`. Si se exporta en un layout, afecta a todas las páginas dentro de ese segmento a menos que se sobrescriba.

```tsx
// app/blog/layout.tsx
export const revalidate = 3600 // 1 hora
```

También puede usarse en combinación con `generateStaticParams` para ISR en rutas dinámicas. `revalidate: false` equivale a `dynamic: 'force-dynamic'` (sin caché estática).

## `fetchCache`

Controla la estrategia de caché de las peticiones `fetch` dentro del segmento, pero **solo afecta a las peticiones que no especifiquen una opción `cache` explícita**. Si un `fetch` individual ya tiene `cache: 'no-store'`, esa petición será dinámica independientemente de `fetchCache`.

- **`'auto'`**: Caché por defecto de Next.js (`force-cache` para GET, sin revalidate).
- **`'force-cache'`**: Todas las peticiones se cachean con `force-cache` (anula incluso las que tengan `cache: 'no-store'` en el fetch? No, respeta la opción explícita; en realidad `fetchCache` define el comportamiento para los fetch que no tienen opción de caché).
- **`'only-no-store'`**: Todas las peticiones se tratan como `cache: 'no-store'` a menos que se especifique lo contrario.
- **`'force-no-store'`**: Fuerza `no-store` en todas las peticiones, anulando cualquier opción.

Esta configuración es avanzada; en la mayoría de los casos, `auto` es suficiente.

## `runtime`

Especifica en qué entorno se ejecuta el segmento.

- **`'nodejs'`**: Utiliza el runtime de Node.js estándar. Permite acceso total al sistema de archivos y APIs de Node.
- **`'edge'`**: Utiliza el Edge Runtime, más limitado en módulos pero con latencia muy baja. Ideal para APIs ligeras y páginas que necesitan responder rápidamente desde el borde.

```tsx
export const runtime = 'edge'
```

## `preferredRegion`

Lista de regiones donde se prefiere ejecutar el segmento (solo en Vercel). Por ejemplo, `['iad1', 'sfo1']` indica que la función se ejecute preferentemente en Iowa o San Francisco.

## `dynamicParams`

Se usa únicamente en páginas que exportan `generateStaticParams`. Controla qué sucede con los parámetros no generados estáticamente.

- **`true`** (por defecto): Las rutas no pre‑renderizadas se generan bajo demanda (similar a `fallback: 'blocking'` en Pages Router). El primer acceso desencadena una renderización y la página se cachea.
- **`false`**: Cualquier ruta no incluida devuelve 404.

```tsx
export const dynamicParams = false
```

## Cascada de configuraciones

Las configuraciones definidas en un layout o página afectan a todo el subárbol, pero un hijo puede sobrescribirlas. La regla es: **el valor más cercano a la hoja gana**. Por ejemplo, si un layout padre tiene `revalidate: 60` y una página hija exporta `revalidate: 120`, esa página específica se revalidará cada 120 segundos.

## Interacción con opciones de `fetch`

Las opciones de `fetch` (como `next.revalidate` o `cache`) tienen prioridad sobre las exportaciones de segmento en el ámbito de esa petición. Si un `fetch` tiene `cache: 'no-store'`, esa petición será dinámica independientemente de que el segmento tenga `revalidate` o `dynamic: 'force-static'` (esto último causaría un error por contradicción). En la práctica, lo recomendable es mantener consistencia: usar `fetch` con sus opciones y las exportaciones de segmento como un control general para todas las peticiones de ese segmento.

## Ejemplos prácticos

### Forzar una página dinámica

```tsx
// app/dashboard/page.tsx
import { cookies } from 'next/headers'

export const dynamic = 'force-dynamic' // redundante con cookies(), pero explícito

export default async function Page() {
  const userCookie = cookies().get('session')
  // ...
}
```

### ISR para un blog

```tsx
// app/blog/[slug]/page.tsx
export const revalidate = 3600

export async function generateStaticParams() {
  const posts = await fetch('...').then(res => res.json())
  return posts.map(post => ({ slug: post.slug }))
}
```

### Combinar fetch con `revalidate` de segmento

```tsx
export const revalidate = 60

export default async function Page() {
  const data = await fetch('https://...', { next: { revalidate: 30 } }) // prioridad 30s
  // ...
}
```

En este caso, la página se revalidará cada 60 segundos en conjunto, pero esa petición particular lo hará cada 30 segundos.

## Consideraciones de rendimiento

- No abuses de `force-dynamic`; pierdes las ventajas de SSG/ISR.
- `revalidate` alto (ej. 86400) para contenido que cambia poco; bajo para contenido casi en tiempo real.
- El Edge Runtime tiene limitaciones (no soporta todos los módulos de Node). Asegúrate de que tu código sea compatible.
- `dynamicParams: false` es útil para sitios con un conjunto cerrado de rutas, evitando generaciones innecesarias.

## TypeScript

Puedes importar los tipos desde `next`:

```tsx
import type { Metadata, ResolvingMetadata } from 'next'

// Para configuraciones no hay tipos específicos, solo se exportan constantes.
// Sin embargo, puedes tipar las funciones generadoras como generateMetadata.
```

No existe un tipo unificado para todas las exportaciones de configuración; son valores literales que Next.js valida internamente.

## Buenas prácticas

- Define `revalidate` a nivel de layout si la sección comparte la misma estrategia de caché.
- Usa `dynamic: 'force-dynamic'` solo cuando sea estrictamente necesario; considera si puedes aislar la parte dinámica con Suspense.
- Prefiere `fetch` con opciones de caché explícitas en lugar de depender excesivamente de `fetchCache`.
- Especifica `runtime: 'edge'` en APIs ligeras para mejorar latencia global.
- Para sitios mayoritariamente estáticos, configura `dynamicParams: false` en las páginas dinámicas para evitar contenido no deseado.
- Mantén las configuraciones lo más arriba posible en la jerarquía para evitar repeticiones; sobreescribe solo donde sea necesario.

Con estos tres documentos, se completa una comprensión integral de cómo Next.js maneja el streaming, el SEO y la configuración fina de los segmentos.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ API de Metadatos y SEO en el App Router](02-metadata-seo.md) | [🏠 Inicio](../index.md) | [Composición de Layouts ▶](3-layouts-plantillas/01-composicion-layouts.md) |
