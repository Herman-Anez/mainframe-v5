# Componente de Aplicación Personalizado

## Concepto fundamental

`_app` es el componente de React que envuelve todas las páginas en el Pages Router. Se puede personalizar creando `pages/_app.js` (o `.tsx`). Es el **único archivo que Next.js ejecuta tanto en servidor como en cliente** durante la hidratación inicial, lo que lo convierte en el lugar ideal para inyectar estado global, estilos, y proveedores.

## Props que recibe

```ts
function MyApp({ Component, pageProps, router }: AppProps) {
  return <Component {...pageProps} />
}
```

- `Component`: El componente de la página activa.
- `pageProps`: Las props que se obtienen mediante `getServerSideProps`, `getStaticProps` o `getInitialProps`. Si la página no tiene ninguno, será un objeto vacío.
- `router`: Instancia del router de Next.js, útil para acceder a información de la ruta actual (`pathname`, `query`, `asPath`).

## Ciclo de ejecución

1. **En el servidor** (primera carga o SSR):
   - Se ejecuta `_app` antes de enviar el HTML.
   - Puede agregar lógica que solo se ejecute en el servidor comprobando `typeof window === 'undefined'`.

2. **En el cliente** (hidratación y navegaciones SPA):
   - Tras la hidratación, `_app` permanece montado; solo cambia `Component` y `pageProps` al navegar internamente.
   - Los hooks como `useEffect` se ejecutan en el cliente.

## Casos de uso esenciales

### 1. Incluir estilos globales

El único lugar donde se puede importar CSS global (no módulos) es `_app`.

```js
import '../styles/globals.css'

export default function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />
}
```

### 2. Proveedores globales (contexto, estado, temas)

Para envolver toda la aplicación con un proveedor de Redux, Theme, Auth, etc.

```js
import { ThemeProvider } from '../context/ThemeContext'

export default function MyApp({ Component, pageProps }) {
  return (
    <ThemeProvider>
      <Component {...pageProps} />
    </ThemeProvider>
  )
}
```

> [!IMPORTANT]
> **Importante**: Al envolver con Providers, el estado se mantiene entre navegaciones porque `_app` no se desmonta.

### 3. Persistencia de layouts globales

Se puede envolver todas las páginas con un layout fijo (header, footer, sidebar).

```js
import Layout from '../components/Layout'

export default function MyApp({ Component, pageProps }) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  )
}
```

### 4. Manejo de estado global o suscripciones

Si se necesita suscribirse a eventos que perduren (WebSockets, autenticación), se hace en `_app` con `useEffect`.

```js
import { useEffect } from 'react'

export default function MyApp({ Component, pageProps }) {
  useEffect(() => {
    // Inicializar analytics, lógica de auth, etc.
  }, [])
  return <Component {...pageProps} />
}
```

### 5. Animar transiciones entre páginas

Con librerías como `framer-motion`, se puede envolver `<Component>` en `<AnimatePresence>` y aplicar animaciones al cambiar de ruta.

## Patrón "per-page layout" usando `getLayout`

Para que diferentes páginas tengan distintos layouts sin perder el estado, se define una función estática `getLayout` en cada página y `_app` la invoca.

```js
// pages/_app.js
export default function MyApp({ Component, pageProps }) {
  const getLayout = Component.getLayout || ((page) => page)
  return getLayout(<Component {...pageProps} />)
}
```

```js
// pages/dashboard.js
import DashboardLayout from '../components/DashboardLayout'

const Dashboard = () => <div>Contenido</div>
Dashboard.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>
export default Dashboard
```

Esto evita tener un solo layout global y permite composición.

## `getInitialProps` en `_app`

Se puede definir `MyApp.getInitialProps` para cargar datos en el servidor que estén disponibles en todas las páginas. **Sin embargo, al hacerlo se desactiva la optimización automática de estática**, porque toda la aplicación pasa a servirse vía SSR. Se usa para lógica como autenticación temprana.

```js
MyApp.getInitialProps = async (appContext) => {
  // appContext incluye ctx (req, res) y router
  const appProps = await App.getInitialProps(appContext) // para que las páginas también obtengan sus props
  return { ...appProps, customProp: 'value' }
}
```

Si una página ya tiene `getServerSideProps`, este se ejecutará y sus props estarán en `appProps.pageProps`. De lo contrario, se obtienen desde `getInitialProps` de la página si existe.

## TypeScript

```ts
import type { AppProps } from 'next/app'

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}
```

Para páginas con `getLayout` se puede extender:

```ts
type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}
```

## Limitaciones y precauciones

- No se puede usar `getServerSideProps` o `getStaticProps` dentro de `_app`; solo `getInitialProps`.
- Al añadir `getInitialProps` en `_app`, **todas las páginas pasan a ser renderizadas bajo demanda (SSR)**, perdiendo la generación estática automática. Solo debe usarse si es estrictamente necesario.
- El `Component` cambiará en cada navegación pero `_app` se mantiene, por lo tanto, los efectos dentro de `_app` se ejecutan una sola vez (como `useEffect` con `[]`), no en cada cambio de página.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Pages vs app router](../../1-fundamentos/04-pages-vs-app-router.md) | [🏠 Inicio](../../index.md) | [Documento HTML personalizado ▶](02-_document.md) |
