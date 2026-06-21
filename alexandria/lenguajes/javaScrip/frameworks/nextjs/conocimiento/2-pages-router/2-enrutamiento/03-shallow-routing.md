# Shallow routing

## Concepto

El **shallow routing** es una técnica que permite cambiar la URL sin ejecutar los métodos de obtención de datos de la página (`getServerSideProps`, `getStaticProps`, `getInitialProps`). La página se re-renderiza en el cliente, pero sin una petición al servidor. Es útil para actualizar parámetros de consulta (query strings) o el hash y reflejarlos en la interfaz sin recargar la página completa.

## Uso con `useRouter`

```javascript
import { useRouter } from 'next/router'

export default function Products() {
  const router = useRouter()

  const handleFilter = (category) => {
    router.push(
      { pathname: '/products', query: { category } },
      undefined,
      { shallow: true }
    )
  }

  return <button onClick={() => handleFilter('shoes')}>Filtrar: Zapatos</button>
}
```

- `router.push(url, as, options)` donde `options` incluye `shallow: true`.
- También funciona con `router.replace({ shallow: true })`.

## Comportamiento

- La URL en el navegador cambia.
- El objeto `router.query` se actualiza.
- El componente de la página se vuelve a renderizar (el estado se mantiene si es un Client Component, aunque hay que tener cuidado con los efectos).
- **No se vuelve a llamar a `getServerSideProps` ni `getStaticProps`**.
- Si la página se recarga por completo (F5), entonces sí se ejecutarán los métodos de datos correspondientes.

## Casos de uso

1. **Filtros y búsquedas**: cambiar `?q=term` sin perder el estado de la interfaz.
2. **Paginación**: `?page=2` actualiza el contenido vía fetch en cliente pero mantiene el scroll.
3. **Ventanas modales**: cambiar la URL para reflejar un contenido mostrado en modal sin recargar la página subyacente.
4. **Parámetros de seguimiento (UTM)**: actualizar `?utm_source=...` sin afectar la experiencia.

## Limitaciones y precauciones

- Shallow routing **solo funciona para la misma página**. Si se navega a una ruta diferente (`/products` → `/about`), no se puede usar shallow. Dará una advertencia.
- El estado de React (useState) no se reinicia porque el componente no se desmonta; esto puede ser deseado, pero si se quiere reiniciar, se debe manejar con `key` o lógica manual.
- Los efectos (`useEffect`) se disparan si cambian las dependencias (`router.query`), por lo que es necesario controlar el fetching en el cliente manualmente.
- No es adecuado para SEO, porque el servidor no conoce esos cambios de URL a menos que se haga una navegación completa. El contenido renderizado por el servidor seguirá siendo el inicial.

## Shallow routing vs. navegación normal

| Acción                        | Se ejecuta getServerSideProps/StaticProps? | Se recarga el HTML completo? | Se mantiene estado local? |
|-------------------------------|--------------------------------------------|------------------------------|---------------------------|
| `router.push('/ruta')`        | Sí                                        | No (Solo se reemplaza el contenido) | No (componente desmontado) |
| `router.push({ shallow: true })` (misma ruta) | No                           | No                           | Sí (componente se re‑renderiza pero estado persiste) |

## Ejemplo práctico: búsqueda con shallow routing

```javascript
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

export default function Search() {
  const router = useRouter()
  const [query, setQuery] = useState(router.query.q || '')

  useEffect(() => {
    setQuery(router.query.q || '')
  }, [router.query.q])

  const handleInput = (e) => {
    setQuery(e.target.value)
    router.push(
      { pathname: '/search', query: { q: e.target.value } },
      undefined,
      { shallow: true }
    )
  }

  // Fetch en cliente cada vez que cambie query
  useEffect(() => {
    if (query) fetchResults(query)
  }, [query])

  return <input value={query} onChange={handleInput} />
}
```

## Notas sobre versiones

- Shallow routing funciona en el Pages Router desde versiones tempranas. En App Router, el concepto es diferente: se usan `useSearchParams` y `useRouter` de `next/navigation`, y la navegación superficial se logra con `router.replace` con `scroll: false` pero sin un equivalente directo a `shallow: true`, ya que la obtención de datos se hace en el servidor. Sin embargo, se puede replicar usando `window.history.pushState` o manejando el estado en cliente.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Nested routes](02-nested-routes.md) | [🏠 Inicio](../../index.md) | [Catch all opcional ▶](04-catch-all-opcional.md) |
