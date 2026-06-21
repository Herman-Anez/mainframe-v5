# CSS‑in‑JS en Next.js

## Panorama general

CSS‑in‑JS es una técnica donde los estilos se escriben en archivos JavaScript/TypeScript, proporcionando **encapsulamiento dinámico**, **tematización** y **estilo basado en props**. Librerías populares incluyen `styled-components`, `emotion`, `vanilla-extract`, `stitches`.

Next.js soporta CSS‑in‑JS de manera diferente según el enrutador:

- **Pages Router**: funciona de forma casi nativa con configuración adicional (normalmente un `_document.js` personalizado para recoger estilos del servidor).
- **App Router**: presenta **desafíos importantes** debido a los Server Components. La mayoría de las librerías están diseñadas para el cliente y requieren `'use client'`, lo que limita su uso a Client Components.

## Retos en el App Router

- Los Server Components no pueden usar CSS‑in‑JS porque no pueden ejecutar JavaScript en el cliente. Los estilos deben renderizarse en el servidor e inyectarse en el HTML, pero las librerías tradicionales necesitan un contexto de React (estado, hooks) que no está disponible en Server Components.
- Para usar CSS‑in‑JS en App Router, se necesita un **wrapper Client Component** que inyecte los estilos y envuelva a los hijos. Además, se debe configurar un **registro de estilos** para recopilar los estilos generados durante el SSR y evitar un flash de contenido sin estilo.

## Configuración con `styled-components` en App Router

Se requiere un archivo `lib/registry.tsx` (o similar) que use la API `StyleSheetManager` de `styled-components` con un `registry` personalizado.

### 1. Instalación

```bash
npm install styled-components
```

### 2. Crear un registro (registry)

```tsx
// lib/styled-components-registry.tsx
'use client'
import React, { useState } from 'react'
import { useServerInsertedHTML } from 'next/navigation'
import { ServerStyleSheet, StyleSheetManager } from 'styled-components'

export default function StyledComponentsRegistry({ children }: { children: React.ReactNode }) {
  const [styledComponentsStyleSheet] = useState(() => new ServerStyleSheet())

  useServerInsertedHTML(() => {
    const styles = styledComponentsStyleSheet.getStyleElement()
    styledComponentsStyleSheet.instance.clearTag()
    return <>{styles}</>
  })

  if (typeof window !== 'undefined') return <>{children}</>

  return (
    <StyleSheetManager sheet={styledComponentsStyleSheet.instance}>
      {children}
    </StyleSheetManager>
  )
}
```

### 3. Envolver el Root Layout

```tsx
// app/layout.tsx
import StyledComponentsRegistry from '@/lib/styled-components-registry'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <StyledComponentsRegistry>{children}</StyledComponentsRegistry>
      </body>
    </html>
  )
}
```

### 4. Uso en Client Components

```tsx
'use client'
import styled from 'styled-components'

const Button = styled.button<{ $primary?: boolean }>`
  background: ${props => props.$primary ? 'blue' : 'gray'};
  color: white;
`

export default function MyButton() {
  return <Button $primary>Styled</Button>
}
```

> [!NOTE]
> **Nota:** Solo puedes usar `styled-components` dentro de componentes con `'use client'`. No funcionará en Server Components.

## Configuración con `emotion`

Similar a `styled-components`, se necesita un registro para el caché de estilos.

```tsx
// lib/emotion-registry.tsx
'use client'
import createCache from '@emotion/cache'
import { useServerInsertedHTML } from 'next/navigation'
import { CacheProvider } from '@emotion/react'
import { useState } from 'react'

export default function EmotionRegistry({ children, key = 'emotion' }: { children: React.ReactNode, key?: string }) {
  const [cache] = useState(() => {
    const c = createCache({ key })
    c.compat = true
    return c
  })
  useServerInsertedHTML(() => {
    const inserted = cache.inserted
    const styles = Object.keys(inserted).map(name => (
      <style key={name} data-emotion={`${key} ${name}`} dangerouslySetInnerHTML={{ __html: inserted[name] }} />
    ))
    return <>{styles}</>
  })
  return <CacheProvider value={cache}>{children}</CacheProvider>
}
```

Luego envolver el Root Layout con `EmotionRegistry`.

## Alternativas modernas: `vanilla-extract` y `Panda CSS`

- **vanilla-extract**: CSS-in-JS de **compilación cero‑runtime**. Se puede usar en Server Components sin problemas porque genera CSS estático. Muy recomendado para App Router.
- **Panda CSS**: similar, genera CSS at compile time. Soporte nativo para Server Components.

Estas librerías eliminan la necesidad de registros porque no requieren JavaScript en el cliente para los estilos.

## Cuándo usar CSS‑in‑JS hoy

- En Pages Router, sin problemas (con configuración en `_document`).
- En App Router, **solo si es estrictamente necesario** y estás dispuesto a limitarte a Client Components y agregar el registro.
- Para proyectos nuevos, se recomienda **Tailwind, CSS Modules o una solución cero‑runtime** (vanilla-extract, Panda CSS) que funcionen en ambos lados.

## Buenas prácticas

- Si adoptas CSS‑in‑JS en App Router, centraliza el registro en un solo lugar.
- Limita el uso de CSS‑in‑JS a componentes interactivos; para layouts y páginas usa CSS Modules o Tailwind.
- Considera migrar a soluciones modernas si estás empezando un proyecto con App Router.
- Con `styled-components`, utiliza el prefijo `$` para props transitorias (evita que se pasen al DOM).

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Tailwind CSS en Next.js](02-tailwind.md) | [🏠 Inicio](../index.md) | [Estilos Globales en Next.js ▶](04-estilos-globales.md) |
