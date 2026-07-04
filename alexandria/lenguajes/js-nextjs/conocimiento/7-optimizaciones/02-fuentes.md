# Optimización de fuentes con `next/font

## Introducción

El módulo `next/font` permite cargar fuentes (locales o de Google) sin ninguna petición externa en el cliente, eliminando el **flash de texto sin estilo (FOUT/FOIT)** y el **layout shift**. Las fuentes se descargan en el servidor, se autohospedan y se inyectan como CSS con `size-adjust` para que coincida con las métricas.

## Fuentes de Google

```tsx
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'], display: 'swap' })

export default function Layout({ children }) {
  return <html className={inter.className}>{/* ... */}</html>
}
```

- Las fuentes se descargan en build time y se sirven desde el mismo dominio, sin conexiones a Google.
- Puedes especificar `weight`, `style`, `subsets` y `display`. Por defecto, `display: 'swap'` (muestra texto con fuente de sistema hasta que la custom esté lista).
- `subsets`: `['latin']` es esencial; reduce el tamaño del archivo.

## Fuentes variables

Si la fuente soporta variable (inter, open-sans), puedes omitir `weight` y usar `variable: '--font-inter'` para definir una CSS variable y usarla en CSS.

```tsx
const inter = Inter({ variable: '--font-inter', subsets: ['latin'] })

// En CSS global
body {
  font-family: var(--font-inter), sans-serif;
}
```

## Fuentes locales

```tsx
import localFont from 'next/font/local'

const myFont = localFont({
  src: [
    {
      path: './fonts/MyFont-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: './fonts/MyFont-Bold.woff2',
      weight: '700',
    },
  ],
  display: 'swap',
  variable: '--font-myfont',
})
```

- Soporta múltiples variantes (peso, estilo) con arrays.
- Las rutas son relativas al archivo donde se define.

## Propiedades importantes

| Opción      | Descripción                                                                                                                   |
|-------------|-------------------------------------------------------------------------------------------------------------------------------|
| `subsets`   | Para Google fonts, array de subconjuntos (`['latin']`, `['latin-ext']`).                                                      |
| `display`   | `'auto'`, `'block'`, `'swap'`, `'fallback'`, `'optional'`. Controla el comportamiento de carga. Por defecto, `swap`.          |
| `weight`    | Peso de la fuente. Para fuentes no variables.                                                                                 |
| `style`     | Estilo (`normal`, `italic`).                                                                                                  |
| `variable`  | Nombre de la variable CSS que se creará para usar en fuentes alternativas.                                                     |
| `preload`   | Por defecto `true`. Precarga la fuente. Desactivar solo si se maneja manualmente.                                            |
| `adjustFontFallback` | Ajusta las métricas de la fuente de respaldo para evitar CLS. Por defecto `true`.                                      |

## Sin peticiones externas

Al hacer build, Next.js descarga la fuente, la guarda en `.next/static/media` y genera el CSS correspondiente con `@font-face`. En producción, las fuentes se sirven desde el mismo dominio, mejorando la privacidad y el rendimiento.

## Eliminación de layout shift (CLS)

`next/font` aplica automáticamente un `size-adjust` en la fuente de fallback (por ejemplo, Arial) para que ocupe el mismo espacio que la fuente personalizada. Así, cuando la fuente termina de cargar, no hay salto de línea.

## Múltiples fuentes

Puedes cargar varias fuentes y combinarlas.

```tsx
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const robotoMono = Roboto_Mono({ subsets: ['latin'], variable: '--font-roboto-mono' })

export default function RootLayout({ children }) {
  return (
    <html className={`${inter.variable} ${robotoMono.variable}`}>
      <body>{children}</body>
    </html>
  )
}
```

## Uso con Tailwind

Para integrar con Tailwind, extiende la configuración:

```js
module.exports = {
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
        mono: ['var(--font-roboto-mono)', 'monospace'],
      },
    },
  },
}
```

## Buenas prácticas

- Carga solo los subsets y pesos necesarios.
- Prefiere `display: 'swap'` para una carga progresiva.
- Usa fuentes variables cuando sea posible (un solo archivo para múltiples pesos).
- Para sitios con mucho tráfico, sirve las fuentes localmente con `localFont` si no quieres dependencia de Google (aunque Next.js cachea la descarga).
- Monitoriza el impacto en el performance: las fuentes se inyectan en el `<head>`, por lo que no deberían bloquear el render si usas `swap`.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Optimización de imágenes con `next/image](01-imagenes.md) | [🏠 Inicio](../index.md) | [Carga optimizada de scripts con `next/script ▶](03-scripts.md) |
