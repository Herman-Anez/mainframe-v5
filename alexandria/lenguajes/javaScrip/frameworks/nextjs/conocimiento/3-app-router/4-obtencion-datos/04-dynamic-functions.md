# Funciones Dinámicas y Comportamiento de Ruta

## Qué son

Son funciones y propiedades que, al ser utilizadas, convierten automáticamente una ruta en **renderizado dinámico** (SSR). Next.js las detecta en tiempo de compilación y marca el segmento como `dynamic = 'force-dynamic'`.

## Lista de funciones dinámicas

- `cookies()` de `next/headers`
- `headers()` de `next/headers`
- `searchParams` prop de la página (a partir de Next.js 15 es una promesa, pero igual la página se vuelve dinámica si se usa)
- `noStore()` de `next/cache`
- `connection()` (experimental, de Dynamic IO)
- Uso de `draftMode()` (para previews)
- Cualquier función que dependa explícitamente de la petición entrante.

## Ejemplo

```tsx
import { cookies } from 'next/headers'

export default async function Page() {
  const cookieStore = cookies()
  const theme = cookieStore.get('theme')
  // Al usar cookies(), esta página se renderiza dinámicamente
  return <div className={theme.value}>...</div>
}
```

## Consecuencias

- La página se convierte en SSR, no se genera estáticamente.
- No se puede usar `revalidate` ni `generateStaticParams` de forma efectiva (se ignoran).
- La caché de datos no se aplica de la misma manera; los `fetch` con `force-cache` seguirán siendo cacheados, pero la página completa se reconstruye en cada petición.

## Control explícito con `export const dynamic`

Se puede forzar el comportamiento dinámico o estático:

```tsx
export const dynamic = 'force-dynamic'  // SSR siempre
export const dynamic = 'force-static'   // Forzar estático (falla si hay funciones dinámicas)
export const dynamic = 'auto'           // Por defecto
```

Si se usa `force-static` y la página emplea alguna función dinámica, Next.js lanzará un error en la compilación.

## Optimización: Aislamiento de partes dinámicas

Si solo una pequeña parte de la página necesita ser dinámica, se puede encapsular en un Client Component con Suspense, evitando que el resto pierda el renderizado estático.

```tsx
// Componente estático
import DynamicWidget from './DynamicWidget'

export default function Page() {
  return (
    <div>
      <h1>Contenido estático</h1>
      <Suspense fallback={<p>Cargando widget...</p>}>
        <DynamicWidget />
      </Suspense>
    </div>
  )
}
```

Dentro de `DynamicWidget` (Client Component) se pueden usar hooks y leer cookies en el cliente, sin volver dinámica la página entera.

## `noStore()`

La función `noStore()` de `next/cache` se puede llamar en un Server Component para desactivar completamente la caché de la página, similar a `cache: 'no-store'` en todos los fetch, pero a nivel de segmento.

```tsx
import { noStore } from 'next/cache'

export default function Page() {
  noStore()
  // cualquier fetch aquí será dinámico
}
```

## Buenas prácticas

- Minimiza el uso de funciones dinámicas en layouts raíz o secciones amplias; preferible aislarlas.
- Usa `cookies()` y `headers()` solo cuando sea absolutamente necesario; a menudo se pueden leer en el cliente o mediante middleware.
- Aprovecha `generateStaticParams` y `revalidate` para la mayoría de las páginas, y reserva el SSR para contenido personalizado.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Generación Estática de Parámetros](03-generateStaticParams.md) | [🏠 Inicio](../../index.md) | [Server Actions ▶](05-server-actions.md) |
