# Catch all opcional

## Catch‑all routes (rutas de captura total)

Una ruta catch‑all captura uno o más segmentos de la URL y los agrupa en un array. Se define con `[...param]`.

| Archivo                   | URLs coincidentes                   | Parámetro `params.slug`          |
|---------------------------|-------------------------------------|----------------------------------|
| `pages/docs/[...slug].js` | `/docs/a`                           | `['a']`                          |
|                           | `/docs/a/b`                         | `['a', 'b']`                     |
|                           | `/docs/a/b/c`                       | `['a', 'b', 'c']`                |
|                           | `/docs` (sin segmento)              | **No coincide** (404)            |

- El nombre del parámetro es arbitrario (`[...slug]`, `[...path]`).
- El valor es un array de strings.
- Se puede usar con `getStaticPaths` y `getServerSideProps`.

### Ejemplo de `getStaticPaths` con catch‑all

```javascript
export async function getStaticPaths() {
  // Supongamos que tenemos documentos con rutas como ['intro', 'intro/overview']
  const paths = [
    { params: { slug: ['intro'] } },
    { params: { slug: ['intro', 'overview'] } },
  ]
  return { paths, fallback: false }
}

export async function getStaticProps({ params }) {
  const slug = params.slug.join('/')
  const doc = await fetch(`/api/docs/${slug}`)
  return { props: { doc } }
}
```

## Catch‑all opcional (`[[...param]]`)

La versión opcional extiende el catch‑all para que **también coincida con la ruta sin ningún segmento** (es decir, la ruta base).

| Archivo                    | URLs coincidentes                   | Parámetro `params.slug`          |
|----------------------------|-------------------------------------|----------------------------------|
| `pages/shop/[[...slug]].js`| `/shop`                             | `undefined`                      |
|                            | `/shop/products`                    | `['products']`                   |
|                            | `/shop/products/electronics`        | `['products', 'electronics']`    |

- `params.slug` es `undefined` cuando la ruta no tiene segmentos adicionales.
- En `getStaticPaths`, se debe incluir una entrada con `params: { slug: undefined }` o `params: {}` (según la versión; habitualmente se omite el key o se pasa null). En versiones recientes, se usa `params: {}` para el path sin parámetros.
- En el componente, `router.query.slug` será `undefined` o un array.

### Ejemplo con `getStaticPaths`

```javascript
export async function getStaticPaths() {
  return {
    paths: [
      { params: { slug: [] } },          // /shop
      { params: { slug: ['products'] } }, // /shop/products
    ],
    fallback: true,
  }
}
```

En versiones modernas, para el catch‑all opcional se debe pasar `slug: []` para la raíz, o simplemente omitir el campo (depende de la versión; lo seguro es usar `slug: []`). La documentación oficial recomienda usar `{ params: { slug: [] } }` para la ruta base.

## Uso de `router.query`

```javascript
const router = useRouter()
const { slug } = router.query
// slug es undefined o string[]
```

## Implementación práctica: tienda con filtros

`pages/shop/[[...slug]].js` puede manejar categorías anidadas y búsquedas:

```javascript
export default function Shop() {
  const router = useRouter()
  const { slug } = router.query
  // slug puede ser undefined (sin filtro), ['ropa'] o ['ropa','hombre']
}
```

## Comportamiento con `getServerSideProps`

Funciona igual; `params.slug` estará disponible como array o `undefined`.

```javascript
export async function getServerSideProps({ params }) {
  const slug = params.slug || [] // asegurar array
  const path = slug.join('/')
  // ...
}
```

## Precauciones

- Las rutas catch‑all tienen menor prioridad que las estáticas y dinámicas simples. Si hay un archivo `pages/shop/products.js`, ese capturará `/shop/products` antes que `[...slug]`.
- Al usar catch‑all opcional, tener en cuenta que `params.slug` puede ser `undefined`. Siempre validar antes de usar.
- En `getStaticPaths`, asegurarse de incluir el caso base con `slug: []` para que la ruta sin parámetro se pre‑renderice.

## Diferencias con rutas dinámicas normales

| Tipo                         | Captura un solo segmento | Múltiples segmentos | Segmento base sin parámetro |
|------------------------------|--------------------------|---------------------|-----------------------------|
| `[param]`                    | Sí                       | No                  | No                          |
| `[...param]`                 | Sí (al menos uno)        | Sí                  | No                          |
| `[[...param]]`               | Sí                       | Sí                  | Sí                          |

## Integración con layouts y estado

En Pages Router, si se necesita un layout para todas las subrutas del shop, se debe implementar con el patrón `getLayout`. Dado que la página es única (`[[...slug]]`), solo se necesita un componente que envuelva su contenido según los parámetros.

## Consideraciones de SEO

Al tratarse de una sola página, los metadatos deben manejarse dinámicamente con `next/head` y cambiar según el `slug`. Para cada "ruta" lógica (ej. `shop/ropa`), se puede establecer un título y descripción únicos, pero la URL canónica debe ser la correcta.

## Migración al App Router

En App Router, el catch‑all opcional se define con `[...slug]` y `[[...slug]]` de la misma forma, pero la funcionalidad es más avanzada gracias a `generateStaticParams` y el manejo de params directamente en el componente.

---

Cada uno de estos temas se complementa para construir un sistema de enrutamiento robusto en el Pages Router, cubriendo desde las rutas más simples hasta los patrones más complejos de filtrado y navegación superficial.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Shallow routing](03-shallow-routing.md) | [🏠 Inicio](../../index.md) | [Getserversideprops ▶](../3-data-fetching/01-getServerSideProps.md) |
