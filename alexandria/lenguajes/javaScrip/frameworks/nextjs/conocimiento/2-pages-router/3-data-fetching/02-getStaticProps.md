# Getstaticprops

## Definición

`getStaticProps` es una función asíncrona exportada desde una página del Pages Router que se ejecuta **en tiempo de construcción** (build time) y opcionalmente en **segundo plano** cuando se usa ISR (Incremental Static Regeneration). Sirve para obtener datos que no cambian con frecuencia y pre‑renderizar la página como HTML estático.

## Cuándo usarla

- Contenido de un blog, documentación, páginas de productos que no cambian constantemente.
- Datos provenientes de un CMS, base de datos o API que pueden ser cacheados.
- Cuando se desea un rendimiento óptimo y SEO, ya que la página se sirve como archivo estático desde una CDN.

## Estructura básica

```javascript
export async function getStaticProps() {
  const res = await fetch('https://api.example.com/posts')
  const posts = await res.json()

  return {
    props: { posts },
    // Opcional: ISR
    revalidate: 3600, // segundos
  }
}

export default function Blog({ posts }) {
  return ( /* renderizado */ )
}
```

## Parámetro `context`

```javascript
export async function getStaticProps(context) {
  const { params } = context // si la página es dinámica: [id].js
  // ...
}
```

El `context` para `getStaticProps` contiene:

| Propiedad      | Descripción                                                    |
|----------------|----------------------------------------------------------------|
| `params`       | Parámetros de ruta (para rutas dinámicas).                     |
| `preview`      | Booleano. Indica si la página está en modo preview (CMS).      |
| `previewData`  | Datos del preview.                                             |
| `locale`       | (si se usa i18n) Locale activo.                                |
| `locales`      | Todos los locales.                                             |
| `defaultLocale`| Locale por defecto.                                            |

## Valores de retorno

- **`props`** (obligatorio): datos que se inyectarán en el componente. Debe ser un objeto plano y serializable a JSON.
- **`revalidate`** (opcional): número de segundos tras los cuales Next.js regenerará la página en segundo plano cuando llegue una petición. (ISR)
- **`notFound`**: booleano. Si es `true`, se muestra la página 404.
- **`redirect`**: objeto `{ destination: string, permanent: boolean }` para redirección.

## Incremental Static Regeneration (ISR)

Con `revalidate`, Next.js regenera la página en segundo plano después del tiempo especificado.

```javascript
export async function getStaticProps() {
  const data = await fetch('https://...')
  return {
    props: { data },
    revalidate: 60, // regenera cada minuto si hay tráfico
  }
}
```

- La primera petición después de `revalidate` segundos servirá la versión cacheada mientras se dispara la regeneración.
- La siguiente petición (y todas mientras dure el `revalidate`) verán la página actualizada si ya se completó la regeneración.
- No se regenera sin tráfico; solo cuando alguien visita la página.

## Errores

Si se lanza una excepción dentro de `getStaticProps`, la página fallará en build. Para ISR, si falla la regeneración, se sigue mostrando la página antigua.

## TypeScript

```typescript
import { GetStaticProps } from 'next'

interface Props { posts: Post[] }

export const getStaticProps: GetStaticProps<Props> = async (context) => {
  return { props: { posts: [] } }
}
```

## Acceso a sistema de archivos, bases de datos, etc.

Como se ejecuta en Node.js, se puede leer archivos del sistema, consultar bases de datos directamente o importar módulos privados sin exponerlos al cliente.

```javascript
import fs from 'fs'
import path from 'path'

export async function getStaticProps() {
  const filePath = path.join(process.cwd(), 'data.json')
  const jsonData = fs.readFileSync(filePath, 'utf-8')
  const data = JSON.parse(jsonData)
  return { props: { data } }
}
```

## Uso con `getStaticPaths`

Para rutas dinámicas, `getStaticProps` se combina obligatoriamente con `getStaticPaths`. La función `getStaticPaths` define qué rutas se pre‑renderizarán.

## Modo “fallback” y relación con `getStaticProps`

- Si `fallback: false`, cualquier ruta no incluida en `getStaticPaths` devolverá 404.
- Si `fallback: true`, se permite generar páginas no pre‑renderizadas bajo demanda.
- Si `fallback: 'blocking'`, igual que `true` pero sin mostrar fallback; el servidor espera a generar la página.

## Consideraciones

- El código dentro de `getStaticProps` nunca se incluye en el bundle del cliente.
- No se puede usar `window` o APIs del navegador.
- Para parámetros de consulta (`?search=...`) no se puede usar `context.query` directamente; en lugar de ello se recomienda usar `getServerSideProps` o leer la query en el cliente.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Getserversideprops](01-getServerSideProps.md) | [🏠 Inicio](../../index.md) | [Getstaticpaths ▶](03-getStaticPaths.md) |
