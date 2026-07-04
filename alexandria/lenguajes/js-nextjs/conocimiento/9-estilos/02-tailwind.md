# Tailwind CSS en Next.js

## Integración oficial

Next.js tiene soporte de primera clase para Tailwind CSS. Al crear un proyecto con `create-next-app`, puedes elegir Tailwind y automáticamente se configuran `tailwind.config.js` y `postcss.config.mjs`, además de los estilos base en `globals.css`.

## Instalación manual

Si no se eligió al inicio:

```bash
npm install -D tailwindcss @tailwindcss/postcss postcss
npx tailwindcss init
```

En `postcss.config.mjs`:

```js
export default {
  plugins: {
    '@tailwindcss/postcss': {},
  },
}
```

Y en el archivo CSS global (normalmente `app/globals.css` para App Router o `styles/globals.css` para Pages Router) se añaden las directivas:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

## Configuración (`tailwind.config.js`)

- **content**: define dónde buscar clases. En App Router, incluye `./app/**/*.{js,ts,jsx,tsx,mdx}`, `./components/**/*`, etc.
- **theme.extend**: personaliza colores, tipografías, breakpoints, etc.
- **plugins**: añade funcionalidades extra (formularios, tipografía, etc.).

## Uso con App Router

Tailwind funciona en **Server Components y Client Components** sin diferencias. Las clases se aplican directamente en JSX y Tailwind genera el CSS en tiempo de compilación (JIT).

```tsx
// app/page.tsx (Server Component)
export default function Home() {
  return <h1 className="text-3xl font-bold text-blue-600">Hola</h1>
}
```

No hay hidratación especial; las clases están presentes en el HTML generado.

## Modo oscuro

Puedes configurar `darkMode: 'class'` o `'media'` en `tailwind.config.js`. Luego, usa el prefijo `dark:` en las clases.

```tsx
<div className="bg-white dark:bg-gray-900">
```

Para cambiar el modo, necesitas un Client Component que maneje el estado y añada/elimine la clase `dark` del `<html>` (mediante `document.documentElement.classList`).

## Combinación con `next/font`

Puedes usar fuentes de Google con Tailwind configurando la fuente en el layout raíz y luego referenciándola en la configuración de Tailwind.

```tsx
import { Inter } from 'next/font/google'
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
```

En `tailwind.config.js`:

```js
module.exports = {
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
      },
    },
  },
}
```

## Optimización de producción

Tailwind JIT genera solo las clases utilizadas, resultando en un CSS mínimo. Además, Next.js purga automáticamente el CSS en producción, por lo que no necesitas configurar PurgeCSS manualmente.

## Precauciones con Server Components

- No puedes usar hooks para manejar clases condicionales en Server Components, pero sí puedes calcularlas con lógica simple basada en props.
- Para interacciones (hover, focus, active), Tailwind las maneja con pseudo-clases en las propias clases, por lo que no requieren JavaScript.
- Si necesitas estilos dinámicos que dependen de datos del servidor (por ejemplo, colores de una API), puedes generar las clases condicionalmente.

## Herramientas complementarias

- `clsx` o `classnames` para combinar clases condicionalmente.
- `tailwind-merge` para fusionar clases sin conflictos (útil cuando se combinan clases de props con clases base).
- `@tailwindcss/typography` para estilos de contenido Markdown.

## Buenas prácticas

- Configura correctamente `content` para que Tailwind rastree todas las clases; si añades clases en archivos que no están en las rutas especificadas, no se generarán.
- No uses concatenación dinámica de strings para clases (`className={'text-' + size}`) porque el compilador JIT no las detecta. Usa clases completas (ej. `size === 'lg' ? 'text-lg' : 'text-sm'`).
- Para estilos condicionales, prefiere `clsx` con objetos.
- Aprovecha los `@apply` en capas `@layer components` para reutilizar estilos complejos sin generar muchos `div` con muchas clases.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ CSS Modules en Next.js](01-css-modules.md) | [🏠 Inicio](../index.md) | [CSS‑in‑JS en Next.js ▶](03-css-in-js.md) |
