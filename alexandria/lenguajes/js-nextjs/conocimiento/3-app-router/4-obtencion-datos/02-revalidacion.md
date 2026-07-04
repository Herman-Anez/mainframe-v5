# Estrategias de Revalidación en App Router

## Revalidación por tiempo (ISR)

La forma más simple de revalidación es especificar un intervalo en segundos mediante la opción `next.revalidate` en el `fetch` o mediante la exportación de una variable `revalidate` en el segmento (layout o página).

### Con `fetch`

```tsx
// Revalida como máximo cada 60 segundos
const res = await fetch('https://api.example.com/data', {
  next: { revalidate: 60 },
})
```

La primera petición después de transcurridos 60 segundos disparará una regeneración en segundo plano y servirá la página antigua mientras tanto. Las siguientes peticiones verán la nueva versión una vez finalizada la regeneración.

### Con exportación de segmento

```tsx
// app/blog/layout.tsx
export const revalidate = 3600 // 1 hora

export default function BlogLayout({ children }) {
  return <div>{children}</div>
}
```

Esta configuración afecta a todo el segmento y a sus hijos (a menos que se sobrescriba más abajo). Funciona incluso si no hay `fetch` explícito (por ejemplo, al leer directamente de una base de datos). En ese caso, Next.js tratará la página como ISR y la revalidará según el tiempo indicado.

## Revalidación bajo demanda (On‑Demand Revalidation)

Permite purgar la caché manualmente usando **tags** o **rutas**. Es ideal para contenidos que deben actualizarse inmediatamente tras una mutación (por ejemplo, al publicar un nuevo post).

### Revalidación por etiqueta (`revalidateTag`)

Se asignan etiquetas a las peticiones `fetch`:

```ts
const res = await fetch('https://...', { next: { tags: ['posts'] } })
```

Luego, en un Server Action o Route Handler, se invoca:

```ts
import { revalidateTag } from 'next/cache'

export async function createPost(formData: FormData) {
  // ... lógica para crear el post
  revalidateTag('posts')
}
```

Todas las peticiones que tengan el tag `posts` se invalidarán, y las páginas que las usan se regenerarán en el próximo acceso.

### Revalidación por ruta (`revalidatePath`)

Invalida un path entero.

```ts
import { revalidatePath } from 'next/cache'

export async function updatePost(postId: string) {
  // ...
  revalidatePath(`/posts/${postId}`)
}
```

Esto purga la caché de la página específica. Se puede usar también con layouts: `revalidatePath('/dashboard', 'layout')` para revalidar solo el layout de esa ruta.

## Revalidación con `unstable_cache` (API experimental)

Para operaciones que no son `fetch` (bases de datos, cálculos), Next.js proporciona `unstable_cache` para cachear manualmente y revalidar.

```ts
import { unstable_cache } from 'next/cache'
import { getPostsFromDB } from '@/lib/db'

const getCachedPosts = unstable_cache(
  async () => getPostsFromDB(),
  ['posts'], // tags
  { revalidate: 3600, tags: ['posts'] }
)
```

Luego se usa como una función normal, y se puede revalidar con `revalidateTag('posts')`.

## Caché de Router y revalidación

La caché del lado del cliente (Router Cache) almacena las páginas visitadas recientemente para una navegación instantánea. Dura unos minutos y se puede invalidar con `router.refresh()`. No debe confundirse con la Data Cache del servidor; la revalidación del servidor eventualmente se reflejará en el cliente cuando la caché expire o el usuario refresque.

## Estrategias combinadas

- **Tiempo + Tags**: Usa `revalidate` para un límite máximo y `tags` para forzar revalidación cuando sea necesario.
- **ISR dinámico**: Con `generateStaticParams` y `revalidate`, las páginas no pre‑renderizadas se generan bajo demanda y luego se revalidan como cualquier otra estática.

## Consideraciones de rendimiento

- La revalidación en segundo plano consume recursos; establece intervalos razonables.
- Las etiquetas deben ser únicas y específicas para evitar invalidaciones masivas innecesarias.
- Monitorea el número de peticiones que generan revalidación para evitar picos de carga.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Fetch Extendido y Caché en App Router](01-fetch-extendido.md) | [🏠 Inicio](../../index.md) | [Generación Estática de Parámetros ▶](03-generateStaticParams.md) |
