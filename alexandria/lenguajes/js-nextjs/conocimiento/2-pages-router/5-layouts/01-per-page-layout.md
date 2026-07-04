# Patrón de Layout por Página

## El problema: falta de layouts anidados

En el Pages Router, Next.js no ofrece un sistema de layouts anidados como el App Router. Al navegar entre páginas, el componente de la página se desmonta y se monta el nuevo. Si se utiliza un componente Layout dentro de cada página, este también se destruye y se recrea, perdiendo su estado interno.

El patrón **per‑page layout** resuelve parcialmente esta carencia: permite que cada página defina su propio layout, el cual se reutiliza entre navegaciones dentro de la misma “familia” de rutas, manteniendo el estado (si se implementa adecuadamente).

## Funcionamiento básico

Cada página exporta una función estática `getLayout` que recibe el elemento de página y devuelve JSX envuelto con el layout deseado. En `_app`, se invoca esta función para obtener el componente final.

```js
// pages/_app.js
export default function MyApp({ Component, pageProps }) {
  // Si la página tiene getLayout, lo usamos; si no, envolvemos sin nada
  const getLayout = Component.getLayout || ((page) => page)
  return getLayout(<Component {...pageProps} />)
}
```

Ahora cualquier página puede definir su layout:

```js
// pages/dashboard/index.js
import DashboardLayout from '../../components/DashboardLayout'

function Dashboard() {
  return <div>Panel principal</div>
}

Dashboard.getLayout = function getLayout(page) {
  return <DashboardLayout>{page}</DashboardLayout>
}

export default Dashboard
```

## Ventajas

- **Layouts persistentes (estado)**: Si varias páginas comparten el mismo layout (misma función `getLayout`), al navegar entre ellas, `_app` no se desmonta y el layout se mantiene. Esto es útil para conservar el estado de una barra lateral, un reproductor de música, etc.
- **Flexibilidad**: Cada página puede tener un layout diferente o incluso layouts anidados manualmente (componiendo funciones). Por ejemplo, una página puede anidar varios layouts:
  ```js
  Page.getLayout = (page) => (
    <MainLayout>
      <Sidebar>{page}</Sidebar>
    </MainLayout>
  )
  ```
- **Separación de responsabilidades**: La lógica del layout se coloca en componentes reutilizables, no en `_app`.

## Desventajas y limitaciones

- **No es nativo**: Requiere modificar `_app` y todas las páginas que quieran un layout especial.
- **Anidamiento de layouts**: Para layouts jerárquicos (abuelo → padre → hijo) se necesita componer funciones manualmente, lo que puede volverse complejo.
- **No hay carga ni errores por segmento**: No existe equivalente a `loading.js` o `error.js` del App Router.
- **Dependencia de `_app`**: Si se migra a App Router, este patrón queda obsoleto.

## Implementación detallada paso a paso

### 1. Modificar `_app.js`

El corazón del patrón. Se verifica si la página tiene una propiedad `getLayout`; si no, se devuelve la página sin envoltorio.

```js
import '../styles/globals.css'

export default function MyApp({ Component, pageProps }) {
  const getLayout = Component.getLayout || ((page) => page)
  return getLayout(<Component {...pageProps} />)
}
```

### 2. Crear componentes de Layout

Son componentes React normales que reciben `children`.

```js
// components/DashboardLayout.js
export default function DashboardLayout({ children }) {
  return (
    <div className="dashboard-layout">
      <nav>Dashboard Nav</nav>
      <main>{children}</main>
    </div>
  )
}
```

### 3. Asignar `getLayout` en las páginas

Para cada página que desee usar un layout, se define la función estática.

```js
// pages/dashboard/stats.js
import DashboardLayout from '../../components/DashboardLayout'

function Stats() {
  return <p>Estadísticas</p>
}

Stats.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>

export default Stats
```

### 4. Opcional: Layout anidado con múltiples funciones

Si se requiere un layout más específico dentro de un layout mayor, se puede crear una función que envuelva sucesivamente:

```js
// pages/admin/users.js
import AdminLayout from '../../components/AdminLayout'
import UserTableLayout from '../../components/UserTableLayout'

function Users() { ... }

Users.getLayout = (page) => (
  <AdminLayout>
    <UserTableLayout>{page}</UserTableLayout>
  </AdminLayout>
)
```

Aunque esto funciona, es mejor reutilizar la misma función en varias páginas para mantener la persistencia.

## Mantenimiento del estado entre navegaciones

El estado del layout se conserva siempre que la instancia del layout sea la misma. Esto ocurre si:

- Las páginas comparten exactamente la misma función `getLayout`.
- El layout se renderiza dentro de `_app` y `_app` no se desmonta.

**Ejemplo**: Todas las páginas de dashboard apuntan a la misma `DashboardLayout`. El estado de un menú colapsable permanece al cambiar de una página a otra.

Si se define una función anónima en cada página (aunque devuelva el mismo componente), se crea una nueva referencia y React lo considera un componente diferente, **perdiendo el estado**. Por eso se recomienda extraer la función a una variable compartida o usar siempre la misma referencia.

```js
// shared-layouts.js
import DashboardLayout from '../components/DashboardLayout'
export const DashboardPageLayout = (page) => <DashboardLayout>{page}</DashboardLayout>
```

```js
// pages/dashboard/index.js
import { DashboardPageLayout } from '../../shared-layouts'

function DashboardHome() { ... }
DashboardHome.getLayout = DashboardPageLayout
export default DashboardHome
```

## Integración con `getServerSideProps` y `getStaticProps`

El patrón es independiente de la obtención de datos. Las props obtenidas se pasan a la página y esta las recibe normalmente. Dentro de `getLayout`, la página ya viene con sus props, por lo que el layout no necesita conocerlas (a menos que el propio layout requiera datos). Para pasar datos al layout, se pueden usar proveedores de contexto (dentro del layout) o pasar props manualmente en `getLayout` si es necesario, pero esto último rompe la igualdad de referencia.

## TypeScript

Se debe extender el tipo `NextPage` para incluir `getLayout`.

```ts
// types/next.d.ts o en _app.tsx
import type { NextPage } from 'next'
import type { AppProps } from 'next/app'
import type { ReactElement, ReactNode } from 'react'

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode
}

export type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}
```

`_app.tsx`:

```tsx
import type { AppPropsWithLayout } from '../types/next'

export default function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => page)
  return getLayout(<Component {...pageProps} />)
}
```

Ahora en una página:

```tsx
import type { NextPageWithLayout } from '../types/next'
import DashboardLayout from '../components/DashboardLayout'

const Profile: NextPageWithLayout = () => {
  return <div>Perfil</div>
}

Profile.getLayout = function getLayout(page) {
  return <DashboardLayout>{page}</DashboardLayout>
}

export default Profile
```

## Casos de uso prácticos

- **Tienda con carrito persistente**: Un `ShopLayout` con un carrito en la barra lateral que conserva los artículos al navegar entre productos.
- **Dashboard con pestañas**: Las pestañas dentro de un layout mantienen su estado activo.
- **Autenticación**: El layout puede incluir lógica de redirección a login; se ejecuta en el cliente y el servidor (si se hidrata adecuadamente).

## Alternativas y evolución

Este patrón fue la forma recomendada durante años en el Pages Router. Con la llegada del App Router, se recomienda migrar a los layouts anidados nativos. Sin embargo, entenderlo sigue siendo útil para mantener proyectos heredados.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Patrones de middleware en API Routes del Pages Router](../4-api-routes/02-middlewares.md) | [🏠 Inicio](../../index.md) | [Layout Global mediante `_app ▶](02-_app-layout.md) |
