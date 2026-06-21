# Layout Global mediante `_app

## Concepto

En lugar de (o además de) layouts por página, se puede utilizar `_app` para envolver toda la aplicación con un **layout global**. Esto es lo más parecido a un layout raíz único.

## Implementación básica

```js
// pages/_app.js
import '../styles/globals.css'
import Layout from '../components/Layout'

export default function MyApp({ Component, pageProps }) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  )
}
```

Todas las páginas se renderizan dentro de `<Layout>`. El layout no se desmonta entre navegaciones, por lo que su estado se conserva (por ejemplo, el scroll de una barra lateral, el estado de una búsqueda).

## Ventajas

- **Simplicidad**: Una sola línea y toda la aplicación comparte el mismo esqueleto.
- **Estado persistente garantizado**: Al estar en `_app`, nunca se desmonta.
- **Ideal para cabeceras, pies de página y menús globales**.

## Desventajas

- **Todas las páginas usan el mismo layout**: No se pueden tener layouts distintos para secciones diferentes (ej. una página de marketing sin sidebar).
- Para variaciones, se debe usar lógica condicional dentro del layout (basada en la ruta), lo que puede acoplar el layout a la estructura de rutas.
- No ofrece granularidad: los layout anidados no son posibles directamente.

## Convivencia con layouts por página

Se pueden combinar ambos enfoques: un layout global en `_app` (por ejemplo, un header común) y luego cada página define su propio `getLayout` para contenido específico.

```js
// pages/_app.js
import Layout from '../components/Layout'

export default function MyApp({ Component, pageProps }) {
  const getLayout = Component.getLayout || ((page) => page)
  return (
    <Layout>
      {getLayout(<Component {...pageProps} />)}
    </Layout>
  )
}
```

Aquí `<Layout>` es el layout global y `getLayout` puede añadir layouts intermedios.

## Layout global con datos dinámicos

Si el layout global necesita datos del servidor (por ejemplo, información del usuario autenticado, categorías de un menú), se pueden obtener usando `getInitialProps` en `_app`. **Cuidado**: esto desactiva la generación estática automática para todas las páginas.

```js
MyApp.getInitialProps = async (appContext) => {
  const appProps = await App.getInitialProps(appContext)
  const categories = await fetchCategories()
  return { ...appProps, categories }
}
```

Luego en `_app`:

```js
export default function MyApp({ Component, pageProps, categories }) {
  return (
    <Layout categories={categories}>
      <Component {...pageProps} />
    </Layout>
  )
}
```

Si no se desea perder la optimización estática, se puede cargar los datos del menú en el cliente (con `useEffect` + fetch) o en cada página, pero esto no preserva el estado en el servidor.

## Layout global y proveedores de contexto

`_app` es el lugar ideal para los proveedores de contexto (Theme, Auth, etc.) porque envuelven toda la aplicación. Generalmente estos proveedores se colocan por fuera del layout visual.

```js
import { ThemeProvider } from '../context/ThemeContext'
import { AuthProvider } from '../context/AuthContext'

export default function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Component {...pageProps} />
      </ThemeProvider>
    </AuthProvider>
  )
}
```

El orden importa: los proveedores más externos envuelven a los internos.

## Integración con estilos globales y fuentes

En `_app` se importan los archivos CSS globales. También se puede usar `next/head` para establecer metadatos globales (pero es preferible en `_document`).

```js
import '../styles/globals.css'
import Head from 'next/head'

export default function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Mi App</title>
      </Head>
      <Component {...pageProps} />
    </>
  )
}
```

## Ejemplo: Layout con navegación condicional

A veces se desea mostrar una barra lateral solo en ciertas secciones. Se puede leer `router.pathname` dentro de `_app` o en el componente Layout.

```js
import { useRouter } from 'next/router'

export default function Layout({ children }) {
  const router = useRouter()
  const showSidebar = router.pathname.startsWith('/dashboard')
  return (
    <div>
      <Header />
      {showSidebar && <Sidebar />}
      <main>{children}</main>
      <Footer />
    </div>
  )
}
```

Pero esto acopla el layout a las rutas. Es más limpio usar el patrón per‑page layout para secciones concretas.

## Manejo de errores y carga en el layout global

No hay `loading.js` o `error.js` en el Pages Router. Para simular una pantalla de carga a nivel global, se puede usar un estado en `_app` con `router.events`:

```js
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

export default function MyApp({ Component, pageProps }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const handleStart = () => setLoading(true)
    const handleComplete = () => setLoading(false)

    router.events.on('routeChangeStart', handleStart)
    router.events.on('routeChangeComplete', handleComplete)
    router.events.on('routeChangeError', handleComplete)
    return () => {
      router.events.off('routeChangeStart', handleStart)
      router.events.off('routeChangeComplete', handleComplete)
      router.events.off('routeChangeError', handleComplete)
    }
  }, [router])

  return (
    <>
      {loading && <ProgressBar />}
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </>
  )
}
```

## Layout global con TypeScript

```tsx
import type { AppProps } from 'next/app'
import Layout from '../components/Layout'

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  )
}
```

Si también se usa el patrón `getLayout`, se combina con el tipo personalizado descrito en `per-page-layout.md`.

## Consideraciones finales

- El layout global es la opción más sencilla, pero su rigidez lo hace adecuado solo para aplicaciones con una estructura uniforme.
- Combinarlo con layouts por página ofrece un equilibrio entre simplicidad y flexibilidad.
- En el App Router, esta función la cumple `app/layout.tsx`, que además permite layouts anidados y persistencia automática.

Ambos patrones pueden coexistir y son fundamentales para construir aplicaciones bien estructuradas en el Pages Router.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Patrón de Layout por Página](01-per-page-layout.md) | [🏠 Inicio](../../index.md) | [`next/link`: El componente de enlace ▶](../6-navigation/01-nextlink-el-componente-de-enlace.md) |
