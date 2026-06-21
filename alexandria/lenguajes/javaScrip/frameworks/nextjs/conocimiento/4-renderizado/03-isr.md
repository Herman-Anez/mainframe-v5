# Incremental Static Regeneration (ISR)

## Concepto

El ISR extiende el SSG permitiendo que las páginas estáticas se **regeneren en segundo plano** después de un tiempo determinado o bajo demanda, sin necesidad de reconstruir todo el sitio. Así se consigue un equilibrio entre rendimiento estático y datos frescos.

## ISR en Pages Router

Se logra añadiendo la opción `revalidate` en el retorno de `getStaticProps`.

```javascript
export async function getStaticProps() {
  const data = await fetch('https://...').then(res => res.json())
  return {
    props: { data },
    revalidate: 3600, // segundos
  }
}
```

- La página se genera estáticamente en el build.
- En producción, después de 3600 segundos, la primera petición que llegue activará una regeneración en segundo plano. Mientras tanto, se sirve la versión cacheada.
- Una vez regenerada, las siguientes peticiones obtienen la nueva versión.

## ISR en App Router

Existen dos formas principales:

1. **Revalidación por tiempo**:
   ```tsx
   // app/blog/[slug]/page.tsx
   export const revalidate = 3600
   ```
   O mediante `fetch`:
   ```tsx
   const res = await fetch('https://...', { next: { revalidate: 3600 } })
   ```

2. **Revalidación bajo demanda (On‑Demand ISR)**:
   - Usando **tags**:
     ```tsx
     const res = await fetch('https://...', { next: { tags: ['posts'] } })
     ```
     Luego, en una Server Action o Route Handler:
     ```ts
     import { revalidateTag } from 'next/cache'
     revalidateTag('posts')
     ```
   - Usando **path**:
     ```ts
     import { revalidatePath } from 'next/cache'
     revalidatePath('/blog/123')
     ```

## Cómo funciona en segundo plano

1. Un usuario solicita una página.
2. Si la página ya está cacheada y no ha expirado `revalidate`, se sirve instantáneamente.
3. Si el tiempo de revalidación se ha superado, Next.js devuelve la página cacheada (stale) y, en segundo plano, ejecuta nuevamente la obtención de datos y renderiza la nueva versión.
4. La caché se actualiza y los siguientes usuarios ven el contenido fresco.

## Ventajas del ISR

- **Contenido casi en tiempo real** sin sacrificar la velocidad de una CDN.
- **Menor carga que SSR puro**: la regeneración ocurre ocasionalmente.
- **Escalable**: el tráfico se maneja con páginas estáticas, solo algunas regeneraciones.

## Desventajas

- **Inconsistencia momentánea**: el usuario puede ver contenido desactualizado hasta que se complete la regeneración.
- **La primera petición después del tiempo de revalidación puede ser un poco más lenta** (si el servidor está regenerando bajo demanda y no hay caché previa en el borde).
- **Complejidad de caché**: con On‑Demand ISR hay que manejar correctamente las etiquetas.

## Casos de uso

- Páginas de producto de un e‑commerce (inventario, precio que cambia ocasionalmente).
- Portadas de noticias.
- Comentarios de un blog (se regeneran cada pocos minutos).

## Combinación con SSG y fallback

Todas las páginas ISR también se benefician de `generateStaticParams` y `dynamicParams` para las rutas no pre‑renderizadas. Incluso las páginas generadas bajo demanda pueden tener `revalidate`.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Static Site Generation (SSG)](02-ssg.md) | [🏠 Inicio](../index.md) | [Client‑Side Rendering (CSR) ▶](04-csr.md) |
