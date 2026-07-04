# Página 404 por Segmento

## Función

Define la interfaz de usuario para el código de estado 404 dentro de un segmento. Se puede renderizar de dos formas:

1. Automáticamente cuando una URL no coincide con ninguna ruta (y no hay `not-found` en un nivel superior).
2. Explícitamente cuando se llama a la función `notFound()` desde un Server Component.

## Ubicación y jerarquía

Se puede colocar en cualquier carpeta. Si un segmento no tiene `not-found.js`, se usa el del padre, y en última instancia, Next.js renderiza una página 404 predeterminada.

## Ejemplo

```tsx
// app/not-found.tsx
import Link from 'next/link'

export default function NotFound() {
  return (
    <div>
      <h1>404 - No encontrado</h1>
      <Link href="/">Volver al inicio</Link>
    </div>
  )
}
```

## Uso con `notFound()`

En un Server Component, se puede invocar `notFound()` de `next/navigation` para mostrar la página 404 del segmento actual.

```tsx
import { notFound } from 'next/navigation'

export default async function Post({ params }) {
  const post = await getPost(params.slug)
  if (!post) notFound()
  return <article>{post.title}</article>
}
```

Al llamar a `notFound()`, se busca el `not-found.js` más cercano en el árbol. Si no existe, se usa el predeterminado.

## Datos dinámicos

`not-found.js` puede ser un Server Component y también puede usar `generateMetadata` para definir el título, etc. Sin embargo, no recibe `params` ni `searchParams` (a diferencia de una página normal). Si se necesita información de la URL, se puede leer en el cliente con `usePathname`.

## Revalidación y comportamiento

La página 404 generada es estática por defecto (si no usa funciones dinámicas). Puede revalidarse con `export const revalidate`.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Error del Root Layout](05-global-error.md) | [🏠 Inicio](../../index.md) | [Plantilla sin Persistencia ▶](07-template.md) |
