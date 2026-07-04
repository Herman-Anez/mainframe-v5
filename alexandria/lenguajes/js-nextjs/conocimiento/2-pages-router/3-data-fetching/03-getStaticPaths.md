# Getstaticpaths

## Definición

`getStaticPaths` es una función que **debe** exportarse desde una página dinámica (`[id].js`) cuando se usa `getStaticProps`. Su propósito es devolver la lista de rutas (paths) que se pre‑renderizarán en el momento de la construcción. Las rutas no incluidas se comportarán según el `fallback` elegido.

## Estructura básica

```javascript
export async function getStaticPaths() {
  // Obtener los IDs de los elementos que queremos pre-renderizar
  const res = await fetch('https://.../posts')
  const posts = await res.json()

  // Crear los paths
  const paths = posts.map(post => ({
    params: { id: post.id.toString() },
  }))

  return { paths, fallback: false }
}
```

## Formato de `paths`

Cada elemento del array `paths` debe tener la estructura:

```javascript
{ params: { [param]: value } }
```

- Para rutas con múltiples parámetros: `{ params: { category: 'tech', slug: 'nextjs' } }`
- Para catch‑all (`[...slug]`): `{ params: { slug: ['a', 'b'] } }`
- Para catch‑all opcional (`[[...slug]]`): incluir `{ params: { slug: [] } }` para la ruta sin segmentos.

## Fallback modes (introducción)

- `fallback: false` → Si una ruta no está en `paths`, devuelve 404.
- `fallback: true` → Muestra una versión de "cargando" (puedes usar `router.isFallback`) y luego genera la página en servidor.
- `fallback: 'blocking'` → El servidor espera a que se genere la página antes de responder (sin estado de carga).

Se profundiza en el archivo `fallback-modes.md`.

## Obtención de datos para `paths`

Normalmente se consulta la misma API o base de datos que `getStaticProps` para obtener todos los identificadores.

```javascript
export async function getStaticPaths() {
  const response = await fetch('https://api.example.com/items')
  const items = await response.json()

  const paths = items.map(item => ({
    params: { id: item.id.toString() },
  }))

  return { paths, fallback: 'blocking' }
}
```

## Uso con TypeScript

```typescript
import { GetStaticPaths } from 'next'

export const getStaticPaths: GetStaticPaths = async () => {
  // ...
  return { paths: [], fallback: false }
}
```

Si se necesitan tipos para `params`:

```typescript
type PathParams = { id: string }
export const getStaticPaths: GetStaticPaths<PathParams> = async () => { ... }
```

## Número máximo de paths

Por defecto, Next.js no tiene límite estricto, pero generar demasiadas páginas (miles o millones) puede hacer que el build sea muy lento y consuma mucha memoria. En esos casos se recomienda usar `fallback: true` o `'blocking'` para generar solo las más populares y el resto bajo demanda.

## Catch‑all y parámetros opcionales

**Catch‑all**: `pages/docs/[...slug].js`

```javascript
export async function getStaticPaths() {
  return {
    paths: [
      { params: { slug: ['intro'] } },
      { params: { slug: ['intro', 'overview'] } },
    ],
    fallback: false,
  }
}
```

**Catch‑all opcional**: `pages/shop/[[...slug]].js`

```javascript
export async function getStaticPaths() {
  return {
    paths: [
      { params: { slug: [] } },                 // /shop
      { params: { slug: ['products'] } },       // /shop/products
    ],
    fallback: true,
  }
}
```

## `getStaticPaths` con `getStaticProps`

Ambas funciones se ejecutan en build time. `getStaticPaths` primero determina las rutas; luego para cada ruta se ejecuta `getStaticProps` con los `params` correspondientes.

## Limitaciones

- `getStaticPaths` solo puede usarse en páginas que contengan segmentos dinámicos o catch‑all.
- Si la página no es dinámica, no tiene sentido exportarla.
- No puede usarse con `getServerSideProps`; son mutuamente excluyentes.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Getstaticprops](02-getStaticProps.md) | [🏠 Inicio](../../index.md) | [Fallback modes ▶](04-fallback-modes.md) |
