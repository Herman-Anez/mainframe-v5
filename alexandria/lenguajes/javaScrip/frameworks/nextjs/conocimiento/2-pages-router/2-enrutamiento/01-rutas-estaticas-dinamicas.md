# Rutas estaticas dinamicas

## Sistema de enrutamiento basado en archivos

En el Pages Router, cualquier archivo dentro de la carpeta `pages/` que exporte un componente React por defecto se convierte automáticamente en una ruta accesible desde el navegador. El nombre del archivo y su ubicación relativa a `pages/` determinan la URL.

## Rutas estáticas

Son aquellas cuyo nombre de archivo es fijo y no contiene corchetes.

| Archivo                  | URL resultante      |
|--------------------------|---------------------|
| `pages/index.js`         | `/`                 |
| `pages/about.js`         | `/about`            |
| `pages/contact.js`       | `/contact`          |
| `pages/blog/index.js`    | `/blog`             |

- **`index.js`** actúa como la página raíz de un directorio. Por ejemplo, `pages/blog/index.js` resuelve `/blog`, mientras que `pages/blog.js` también resolvería `/blog`, pero es preferible usar una carpeta para organizar subrutas.
- El componente exportado puede ser una función o una clase. Next.js lo renderizará en el servidor (SSR/SSG) o en el cliente según corresponda.
- Se puede usar cualquier extensión de Next.js: `.js`, `.jsx`, `.ts`, `.tsx`.

## Rutas dinámicas

Se utilizan para crear páginas cuyos segmentos de URL varían (por ejemplo, un post de blog identificado por `slug`). Se definen encerrando el nombre del parámetro entre corchetes `[]`.

| Archivo                      | URL coincidente                | Parámetros en `query`       |
|------------------------------|--------------------------------|-----------------------------|
| `pages/posts/[id].js`        | `/posts/1`, `/posts/abc`       | `{ id: '1' }`              |
| `pages/products/[category]/[product].js` | `/products/electronics/laptop` | `{ category: 'electronics', product: 'laptop' }` |

- Los parámetros se reciben en el objeto `router.query`. Dentro de `getServerSideProps` o `getStaticProps`, están disponibles en `context.params`.
- El nombre del parámetro puede ser cualquiera (ejemplo: `[slug]`, `[id]`, `[username]`).
- **Rutas dinámicas anidadas**: se pueden colocar carpetas con parámetros dinámicos en cualquier nivel. `pages/users/[userId]/posts/[postId].js` capturará `/users/42/posts/17`.

## Captura de parámetros desde el componente

```javascript
// pages/posts/[id].js
import { useRouter } from 'next/router'

export default function Post() {
  const router = useRouter()
  const { id } = router.query
  return <p>Post: {id}</p>
}
```

Durante la primera carga (SSR), `router.query` estará vacío en el cliente hasta que la hidratación se complete, pero en el servidor se puede acceder directamente a `context.params`. En el cliente, tras la hidratación, `router.query` se llena. Para evitar problemas, se puede verificar `router.isReady`.

## Obtención de datos con `getServerSideProps` o `getStaticProps`

```javascript
// Ejemplo con getStaticProps + getStaticPaths
export async function getStaticPaths() {
  // Retornar la lista de ids posibles
  return {
    paths: [{ params: { id: '1' } }, { params: { id: '2' } }],
    fallback: false,
  }
}

export async function getStaticProps({ params }) {
  const post = await fetch(`https://api.example.com/posts/${params.id}`)
  return { props: { post } }
}
```

En `getServerSideProps` se accede igual con `params`:

```javascript
export async function getServerSideProps({ params }) {
  const res = await fetch(`https://api.example.com/posts/${params.id}`)
  const post = await res.json()
  return { props: { post } }
}
```

## Convenciones de nomenclatura

- Parámetros múltiples: `[category]/[product]` produce `params.category` y `params.product`.
- Es posible combinar segmentos estáticos y dinámicos: `blog/[slug]/edit.js`.
- El nombre del parámetro debe ser una cadena alfanumérica válida y no puede empezar con un número.

## Comportamiento con `fallback`

- En `getStaticPaths`, `fallback: false` hace que cualquier ruta no especificada devuelva 404.
- `fallback: true` permite que páginas no generadas se rendericen en servidor en el primer acceso (se muestra un fallback mientras tanto).
- `fallback: 'blocking'` espera a generar la página antes de responder.

## Prioridad de rutas

Next.js resuelve las rutas en este orden:
1. Rutas estáticas (nombres exactos).
2. Rutas dinámicas (parámetros).
3. Catch‑all.

Si hay conflicto entre una ruta estática y una dinámica, la estática tiene prioridad. Ejemplo: `pages/posts/special.js` y `pages/posts/[id].js`; para `/posts/special` se usará la página estática.

## TypeScript

```ts
import { GetStaticPaths, GetStaticProps } from 'next'

export const getStaticPaths: GetStaticPaths = async () => { ... }
export const getStaticProps: GetStaticProps = async ({ params }) => { ... }
```

El tipo de `params` se infiere del nombre del archivo. Para más control se puede definir una interfaz.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Resumen de interacciones y prioridades](../1-archivos-especiales/06-resumen-de-interacciones-y-prioridades.md) | [🏠 Inicio](../../index.md) | [Nested routes ▶](02-nested-routes.md) |
