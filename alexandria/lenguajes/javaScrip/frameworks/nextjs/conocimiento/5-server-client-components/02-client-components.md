# Componentes de Cliente en el App Router

## ¿Qué es un Client Component?

Un **Client Component** es un componente React que se ejecuta **tanto en el servidor (pre‑renderizado)** como **en el cliente (hidratación e interactividad)**. Se marca con la directiva `'use client'` al inicio del archivo.

```tsx
'use client'
import { useState } from 'react'

export default function Counter() {
  const [count, setCount] = useState(0)
  return <button onClick={() => setCount(count + 1)}>{count}</button>
}
```

## ¿Por qué existen?

React Server Components no pueden manejar interactividad por sí solos. Los Client Components llenan ese vacío, manteniendo la compatibilidad con el ecosistema actual de React (hooks, estado, efectos, contextos).

## Proceso de renderizado

1. **Servidor**: Next.js pre‑renderiza el Client Component en el servidor, generando HTML estático con las props iniciales. Esto ocurre durante SSR/SSG.
2. **Cliente**: El HTML se envía y se **hidrata**: React toma el árbol DOM existente, le añade los event listeners y el estado inicial definido en el servidor. A partir de ese momento, el componente es completamente interactivo.

Es importante entender que el **código del Client Component sí se incluye en el bundle de JavaScript** que se envía al navegador.

## Capacidades completas de React

Al ser un Client Component, puedes usar todo lo que React ofrece:

- Hooks (`useState`, `useEffect`, `useRef`, `useContext`, `useReducer`, etc.)
- Eventos (`onClick`, `onSubmit`, `onChange`)
- APIs del navegador (`window`, `document`, `localStorage`)
- Librerías de terceros que dependan de estado o efectos (ej. `framer-motion`, `swr`, `react-hook-form`)

## La directiva `'use client'`

- Se coloca en la **primera línea del archivo** (antes de cualquier import).
- Solo afecta al módulo donde se escribe y a todos los módulos que este importe. Es decir, si un archivo tiene `'use client'`, **todos los componentes que importe también se convertirán en Client Components** (aunque ellos no tengan la directiva). Por eso se recomienda aislar los Client Components en archivos pequeños y mantener los Server Components fuera de ese árbol.
- No puedes usar `'use client'` y `'use server'` en el mismo archivo.

## Límites entre Server y Client

La regla fundamental: **un Client Component no puede importar un Server Component directamente**. Si lo hace, el Server Component perdería su naturaleza y se ejecutaría en el cliente (o simplemente fallaría). La forma correcta de combinarlos es usando el patrón de **children** (ver `patrones.md`).

## Obtención de datos en Client Components

Puedes hacer fetching de datos dentro de un Client Component usando `useEffect`, `useState`, o librerías como `swr` o `react-query`. Ten en cuenta que estos datos no estarán en el HTML inicial, por lo que no beneficiarán al SEO. Es un enfoque adecuado para dashboards privados o contenido secundario.

## Buenas prácticas

- **Minimiza los Client Components**: empuja la interactividad hacia las hojas del árbol. Mantén los layouts y la estructura principal como Server Components.
- **Extrae la parte interactiva**: si una página tiene una sección con estado (un formulario, un carrusel), convierte solo esa sección en Client Component.
- **No envuelvas todo en un `'use client'`** sin necesidad.
- **Usa el `children` pattern** para pasar Server Components a Client Components.

## Ejemplo de combinación

```tsx
// app/layout.tsx (Server Component, por defecto)
import { ThemeProvider } from './ThemeProvider' // Client Component

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
```

```tsx
// app/ThemeProvider.tsx
'use client'
import { createContext, useState } from 'react'

export const ThemeContext = createContext()

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light')
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}
```

Aquí el layout permanece del lado del servidor, y el contexto se maneja en un Client Component.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ React Server Components en Next.js](01-conceptos-server-components.md) | [🏠 Inicio](../index.md) | [Patrones de Composición Server/Client ▶](03-patrones.md) |
