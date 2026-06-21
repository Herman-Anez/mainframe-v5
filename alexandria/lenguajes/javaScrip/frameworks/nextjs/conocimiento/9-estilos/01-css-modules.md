# CSS Modules en Next.js

## ¿Qué son los CSS Modules?

Los **CSS Modules** son una técnica que permite escribir hojas de estilo CSS con **alcance local por componente**. Next.js los soporta de forma nativa en ambos enrutadores. Cualquier archivo con extensión `.module.css` (o `.module.scss`, `.module.less`) se trata como un módulo CSS.

Cuando importas un archivo `.module.css`, obtienes un objeto donde cada clase definida es una propiedad única, con un nombre generado automáticamente que evita colisiones globales.

```css
/* Button.module.css */
.primary {
  background-color: blue;
  color: white;
}
.secondary {
  background-color: gray;
}
```

```tsx
import styles from './Button.module.css'

export default function Button({ variant }) {
  return <button className={styles[variant]}>{/* ... */}</button>
}
```

En el DOM, las clases se convierten en algo como `Button_primary__abc123`, garantizando que no interfieran con otras.

## Convenciones y alcance

- Los archivos deben terminar en `.module.css` (o `.module.scss`, `.module.sass`, `.module.less`).
- Las clases se pueden componer usando `composes` desde otro módulo.
- Se pueden definir estilos globales dentro de un módulo usando `:global(.selector)` para aplicar a elementos que están fuera del alcance del módulo (útil para librerías de terceros).

```css
/* Dentro de un CSS Module */
.wrapper {
  display: flex;
}
.wrapper :global(.external-class) {
  color: red;
}
```

## Uso en Pages Router

Funcionan sin configuración adicional. Se importan directamente en cualquier componente.

```jsx
// pages/index.js
import styles from '../styles/Home.module.css'
```

No hay diferencia entre Server y Client Components porque en Pages Router todos los componentes se ejecutan tanto en servidor como en cliente.

## Uso en App Router

También funcionan tanto en Server Components como en Client Components. Sin embargo, ten en cuenta:

- En **Server Components**, puedes usar CSS Modules sin problema, pero no puedes aplicar estilos dinámicos basados en estado (porque no hay estado). Las clases se asignan estáticamente en función de las props.
- En **Client Components**, puedes combinarlos con lógica de estado para cambiar clases condicionalmente.

```tsx
// app/components/Button.tsx (Client Component)
'use client'
import { useState } from 'react'
import styles from './Button.module.css'

export function Button() {
  const [active, setActive] = useState(false)
  return (
    <button
      className={`${styles.base} ${active ? styles.active : ''}`}
      onClick={() => setActive(!active)}
    >
      Click
    </button>
  )
}
```

## Composición de módulos

Puedes importar clases de otro módulo y combinarlas:

```css
/* base.module.css */
.reset {
  margin: 0;
  padding: 0;
}
```

```css
/* Button.module.css */
.primary {
  composes: reset from './base.module.css';
  background: blue;
}
```

La clase `.primary` ahora incluirá las reglas de `.reset`. Esto se resuelve en tiempo de compilación y se genera una sola clase que contiene ambas.

## Integración con TypeScript

Para que TypeScript reconozca los imports de módulos CSS sin errores, puedes crear un archivo de declaración `global.d.ts` (a menudo ya incluido por Next.js):

```ts
declare module '*.module.css' {
  const classes: { readonly [key: string]: string }
  export default classes
}
```

Esto permite autocompletado y verificación de tipos.

## Variables CSS dinámicas

CSS Modules no soportan variables CSS de forma dinámica como CSS‑in‑JS, pero puedes combinarlas con `style` props o con variables CSS personalizadas.

```tsx
<button style={{ '--button-color': 'blue' } as React.CSSProperties} className={styles.primary} />
```

Y en el CSS:

```css
.primary {
  background-color: var(--button-color);
}
```

## Comparación con otros enfoques

- **CSS Modules** son una solución intermedia: encapsulan estilos sin la complejidad de JavaScript, se integran con el ecosistema de CSS (Sass, PostCSS) y no generan sobrecarga de runtime.
- Son ideales para equipos que prefieren escribir CSS puro o con preprocesadores y desean evitar conflictos de nombres.

## Buenas prácticas

- Mantén los módulos cerca del componente que los usa (co‑ubicación).
- Usa `camelCase` para los nombres de clase en el módulo (porque los accederás como propiedades de objeto en JS).
- Evita demasiada anidación innecesaria; deja que el alcance del módulo se encargue.
- Para estilos globales (resets, tipografía), usa archivos CSS globales y no módulos.
- Si necesitas variantes dinámicas, combina con librerías como `clsx` o `classnames`:

```tsx
import clsx from 'clsx'
import styles from './Button.module.css'

<button className={clsx(styles.base, isPrimary && styles.primary)} />
```

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Análisis y optimización del bundle](../7-optimizaciones/05-analisis-bundle.md) | [🏠 Inicio](../index.md) | [Tailwind CSS en Next.js ▶](02-tailwind.md) |
