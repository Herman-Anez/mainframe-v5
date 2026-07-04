# next/dynamic

## Concepto

`next/dynamic` es una extensión de `React.lazy` que permite **importar componentes de forma diferida (lazy loading)**, con soporte para SSR y opciones avanzadas como desactivar la renderización en servidor.

Es la herramienta principal para **reducir el tamaño del bundle** de JavaScript que se envía al cliente, cargando solo los componentes que el usuario necesita en el momento en que los necesita.

## Uso básico

```jsx
import dynamic from 'next/dynamic'

const HeavyComponent = dynamic(() => import('../components/HeavyComponent'))

export default function Page() {
  return (
    <div>
      <h1>Mi página</h1>
      <HeavyComponent />
    </div>
  )
}
```

- El componente se carga solo cuando se renderiza (por defecto, tanto en cliente como en servidor durante SSR).
- Mientras se carga, puedes mostrar un fallback con la opción `loading`.

## Opciones principales

```jsx
const DynamicComponent = dynamic(() => import('./Component'), {
  loading: () => <p>Cargando...</p>,
  ssr: false,                      // Desactiva el renderizado en servidor
  suspense: true,                  // (Next.js 15+) Usa Suspense directamente
})
```

| Opción    | Descripción                                                                                                         |
|-----------|---------------------------------------------------------------------------------------------------------------------|
| `loading` | Componente que se muestra mientras el módulo se carga.                                                              |
| `ssr`     | Si `false`, el componente no se renderiza en el servidor (solo en cliente). Útil para librerías que acceden a `window`. |
| `suspense`| (Opcional) Habilita el uso de Suspense para el componente dinámico.                                                  |

## Importación con nombres exportados

Si el módulo no exporta por defecto, puedes usar promesas con destructuración:

```jsx
const NamedComponent = dynamic(() =>
  import('../components').then(mod => mod.NamedComponent)
)
```

## Casos de uso

1. **Componentes pesados**: gráficos (recharts, visx), editores de texto (Monaco, Quill), visualizadores de mapas.
2. **Componentes que dependen de APIs del navegador**: si un componente usa `window` o `document`, debes desactivar SSR (`ssr: false`).
3. **Modales y paneles que se abren bajo demanda**: solo cargas el código cuando el usuario abre el modal.
4. **Optimización de carga inicial**: partes de la página que no son visibles en el viewport inicial (below the fold) pueden cargarse bajo demanda.

## Carga de librerías de alto peso

En lugar de importar directamente una librería, puedes crear un wrapper que la importe dinámicamente.

```jsx
// components/Chart.js
'use client'
import dynamic from 'next/dynamic'
const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false })

export default function Chart(props) {
  return <ReactApexChart {...props} />
}
```

## Notas sobre SSR

Si un componente hace referencia a `window` y no configuras `ssr: false`, Next.js lanzará un error en el servidor. Para componentes que deben renderizarse en servidor pero necesitan ciertas APIs, puedes verificar `typeof window === 'undefined'` y retornar null en servidor, o usar `ssr: false`.

## Next.js 15 y `suspense`

A partir de Next.js 15, se recomienda usar la opción `suspense: true` junto con `<Suspense>` para manejar la carga, en lugar de la prop `loading`. Esto unifica el comportamiento con el streaming.

```jsx
import { Suspense } from 'react'
import dynamic from 'next/dynamic'

const Heavy = dynamic(() => import('./Heavy'), { suspense: true })

export default function Page() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <Heavy />
    </Suspense>
  )
}
```

## Con Server Components

`next/dynamic` funciona con Server Components. Puedes importar dinámicamente un Client Component desde un Server Component, pero no al revés (un Client Component no puede importar un Server Component dinámicamente en el cliente, porque el Server Component no existe en el bundle del cliente).

## Buenas prácticas

- Divide los puntos de entrada grandes en chunks más manejables.
- Monitorea el tamaño de los chunks con el analizador de bundle.
- No hagas dinámicos todos los componentes; solo los que realmente suman peso y son opcionales.
- Para librerías de terceros pesadas, considera alternativas más ligeras antes de aplicar lazy loading.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Carga optimizada de scripts con `next/script](03-scripts.md) | [🏠 Inicio](../index.md) | [Análisis y optimización del bundle ▶](05-analisis-bundle.md) |
