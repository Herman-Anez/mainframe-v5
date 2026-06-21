# `next/router` y el hook `useRouter`

## Hook `useRouter`

Proporciona acceso programático al router de Next.js. Devuelve un objeto con información de la ruta actual, utilidades de navegación y eventos.

```jsx
import { useRouter } from 'next/router'

function CurrentRoute() {
  const router = useRouter()
  return <p>Estás en: {router.pathname}</p>
}
```

### Propiedades del objeto router

| Propiedad        | Descripción                                                                      |
|------------------|----------------------------------------------------------------------------------|
| `pathname`       | Ruta actual sin query string (ej. `/blog/[slug]`).                               |
| `asPath`         | Ruta completa tal como se ve en el navegador, incluyendo query (ej. `/blog/mi-post?ref=home`). |
| `query`          | Objeto con los parámetros de ruta y query string (`{ slug: 'mi-post', ref: 'home' }`). |
| `isFallback`     | `true` si la página se está generando bajo demanda (fallback mode).               |
| `isReady`        | `true` cuando la ruta ha sido completamente resuelta y `query` está disponible.   |
| `locale`         | Locale activo.                                                                   |
| `locales`        | Array de locales configurados.                                                   |
| `defaultLocale`  | Locale predeterminado.                                                           |
| `isPreview`      | Indica si estamos en modo preview de un CMS.                                     |

> [!IMPORTANT]
> **Importante**: `router.query` puede estar vacío durante la hidratación (primer render) porque Next.js debe esperar a que el cliente reciba los datos del servidor. Para evitar errores, se puede usar `router.isReady`:

```jsx
const router = useRouter()
useEffect(() => {
  if (!router.isReady) return
  // Ahora router.query es seguro
}, [router.isReady])
```

## Métodos de navegación imperativa

### `router.push(url, as?, options?)`

Añade una nueva entrada al historial y navega a la ruta indicada. Soporta los mismos tipos que `href` de `Link`.

```jsx
router.push('/about')
router.push({ pathname: '/post/[id]', query: { id: 1 } })
```

Con opciones:
```jsx
router.push('/search', undefined, { shallow: true, scroll: false })
```

### `router.replace(url, as?, options?)`

Similar a `push`, pero **reemplaza** la entrada actual del historial en lugar de añadir una nueva. Útil para redirecciones después de un login.

### `router.prefetch(url, as?)`

Precarga manualmente una ruta (similar al prefetch de `Link`). Puede ejecutarse en cualquier momento.

### `router.back()`

Navega hacia atrás en el historial. Equivalente a `window.history.back()`.

### `router.reload()`

Recarga la página actual (como F5). No es recomendable porque rompe la experiencia SPA.

### `router.beforePopState(cb)`

Permite interceptar eventos de navegación hacia atrás/adelante (popstate) y decidir si se permite o se maneja manualmente.

```jsx
useEffect(() => {
  router.beforePopState(({ url, as, options }) => {
    // Impedir la navegación si estamos en un formulario no guardado
    if (window.confirm('¿Descartar cambios?')) {
      return true // permite la navegación
    }
    // Si retorna false, el popstate es cancelado
    history.go(1) // volver al estado anterior en historial
    return false
  })
  return () => router.beforePopState(() => true)
}, [router])
```

## Eventos del router

El objeto `router` expone un emisor de eventos (`router.events`) que permite reaccionar a cambios en la navegación:

- `routeChangeStart(url, { shallow })`: Se dispara cuando una navegación comienza.
- `routeChangeComplete(url, { shallow })`: Se dispara cuando la navegación se completa exitosamente.
- `routeChangeError(err, url, { shallow })`: Se dispara si la navegación falla (por ejemplo, al cancelar).
- `beforeHistoryChange(url, { shallow })`: Justo antes de que el historial del navegador cambie.
- `hashChangeStart(url, { shallow })`: Al cambiar el hash de la URL.
- `hashChangeComplete(url, { shallow })`: Al completarse el cambio de hash.

**Ejemplo: Barra de progreso global**

```jsx
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import NProgress from 'nprogress'

export default function MyApp({ Component, pageProps }) {
  const router = useRouter()

  useEffect(() => {
    const handleStart = () => NProgress.start()
    const handleStop = () => NProgress.done()

    router.events.on('routeChangeStart', handleStart)
    router.events.on('routeChangeComplete', handleStop)
    router.events.on('routeChangeError', handleStop)
    return () => {
      router.events.off('routeChangeStart', handleStart)
      router.events.off('routeChangeComplete', handleStop)
      router.events.off('routeChangeError', handleStop)
    }
  }, [router])

  return <Component {...pageProps} />
}
```

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ `next/link`: El componente de enlace](01-nextlink-el-componente-de-enlace.md) | [🏠 Inicio](../../index.md) | [Navegación superficial (shallow routing) ▶](03-navegacion-superficial-shallow-routing.md) |
