# Uso directo de Markdown en Next.js y react (forma más fácil)

La forma más simple es leer el archivo `.md` con `fs` dentro de un **Server Component** (el default en `app/`, sin `"use client"`). No requiere tocar Webpack ni Turbopack, y funciona igual en ambos bundlers.

> Nota: configurar un loader (`asset/source` en Webpack) para importar `.md` como texto directamente **ya no es la vía recomendada**. Next.js 16 usa Turbopack por defecto, y un `webpack()` custom en `next.config.ts` sin config equivalente de `turbopack` rompe el servidor de desarrollo.

## Archivo Markdown

```
content/articulo.md
```

## Leerlo con `fs` en el Server Component

```tsx
// app/articulo/page.tsx
import fs from "node:fs";
import path from "node:path";

const filePath = path.join(process.cwd(), "content/articulo.md");
const contenido = fs.readFileSync(filePath, "utf-8");

export default function Articulo() {
  return <pre>{contenido}</pre>;
}
```

Esto renderiza el string crudo. Si además quieres convertir el Markdown a HTML/JSX (títulos, listas, negritas, etc.), pásale `contenido` a `react-markdown`:

```tsx
import ReactMarkdown from "react-markdown";
// ...
return <ReactMarkdown>{contenido}</ReactMarkdown>;
```

`react-markdown` v10 es ESM puro y no usa hooks de cliente para el parseo — funciona sin problema dentro de un Server Component, no hace falta `"use client"`.

## Librerías necesarias

| Necesitas | Librería | Para qué |
|---|---|---|
| Solo leer el archivo | ninguna | `fs`/`path` son built-ins de Node, no van en `package.json` |
| Renderizar Markdown → JSX | `react-markdown` | convierte `# título`, `**negrita**`, listas, etc. a elementos React reales (no `dangerouslySetInnerHTML`) |
| Tablas, listas de tareas, strikethrough, autolinks (GFM) | `remark-gfm` | `react-markdown` por sí solo soporta CommonMark básico; sin este plugin las tablas de GitHub-flavored Markdown no se parsean — ya instalado en este proyecto |
| Resaltado de sintaxis en bloques de código | `rehype-highlight` o `rehype-prism-plus` | colorea los ` ```js ` — ya instalado y en uso en este proyecto (ver más abajo) |
| Sanitizar HTML embebido en el `.md` | `rehype-sanitize` | solo hace falta si el Markdown viene de una fuente no confiable (usuarios, CMS externo). Para archivos propios del repo no es necesario |

Instalación mínima:

```bash
pnpm add react-markdown
```

Con GFM (tablas, checkboxes) — lo que ya está instalado en este proyecto:

```bash
pnpm add react-markdown remark-gfm
```

```tsx
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

<ReactMarkdown remarkPlugins={[remarkGfm]}>{contenido}</ReactMarkdown>;
```

## Estilos: que se vea presentable

`react-markdown` genera elementos HTML normales (`h1`, `p`, `pre`, `table`...) sin ninguna clase. Sin CSS se ven como texto plano del navegador. Dos piezas:

1. **`remark-gfm`** — sin este plugin las tablas GFM (`| col | col |`) no se parsean como tabla, quedan como texto con pipes literales.
2. **CSS Module con tipografía** — envolver el `<ReactMarkdown>` en un `<div>` con una clase y estilar los selectores hijos (`h1`, `pre`, `table`, etc.) vía CSS Modules normal, sin librerías extra (no hace falta Tailwind ni `@tailwindcss/typography`).

`markdown.module.css` (mismo directorio que `articulo.tsx`):

```css
.markdown { max-width: 780px; margin: 0 auto; padding: 2rem 1.5rem; line-height: 1.7; }
.markdown h1 { font-size: 2rem; border-bottom: 1px solid var(--foreground); padding-bottom: .5rem; }
.markdown pre { background: rgba(128,128,128,.12); border: 1px solid rgba(128,128,128,.25); border-radius: 8px; padding: 1rem; overflow-x: auto; }
.markdown code { font-family: var(--font-geist-mono), ui-monospace, monospace; background: rgba(128,128,128,.15); padding: .15em .4em; border-radius: 4px; }
.markdown pre code { background: none; padding: 0; }
.markdown table { width: 100%; border-collapse: collapse; }
.markdown th, .markdown td { border: 1px solid rgba(128,128,128,.3); padding: .5rem .75rem; }
/* + blockquote, ul/ol, links, hr — ver archivo completo */
```

Uso: envolver, no reemplazar, el componente de react-markdown:

```tsx
<div className={styles.markdown}>
  <ReactMarkdown remarkPlugins={[remarkGfm]}>{contenido}</ReactMarkdown>
</div>
```

Otras opciones descartadas para este repo:
- `@tailwindcss/typography` (clase `prose`) — requiere Tailwind instalado; este proyecto no lo usa.

## Resaltado de sintaxis en bloques de código

`rehype-highlight` (basado en `lowlight`/`highlight.js`) colorea automáticamente los ` ```tsx `, ` ```bash `, etc. Detecta el lenguaje por el info-string del fence markdown.

```bash
pnpm add rehype-highlight highlight.js
```

`highlight.js` se instala aparte porque `rehype-highlight` no trae los temas CSS — viven en `highlight.js/styles/*.css` (`github-dark.css`, `github.css`, `atom-one-dark.css`, etc.).

```tsx
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css"; // import global de CSS, permitido en cualquier archivo dentro de app/

<ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
  {contenido}
</ReactMarkdown>;
```

El plugin envuelve el código en `<code class="hljs language-xxx">` con `<span>` por token; el tema CSS importado pinta esos spans. El tema trae su propio `background` y `padding` en `.hljs` — si tu CSS ya le pone `padding` al `pre` contenedor (como en `markdown.module.css`), hay que resetear `padding: 0` en `pre code.hljs` para no duplicarlo:

```css
.markdown pre code.hljs {
  padding: 0;
}
```

El tema queda fijo (no seguía el `prefers-color-scheme` de la página) — para eso habría que importar dos temas y alternar con media query, o usar `rehype-highlight` con `mergeCssModules`/CSS variables custom en vez del CSS del tema tal cual.

## Ejemplo real de este repo

`taller/js/4-next/src/app/next/markdown/react-markdown/articulo.tsx` — Server Component sin props, sin `getStaticProps` (eso es de Pages Router, no aplica en `app/`):

```tsx
import fs from "node:fs";
import path from "node:path";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import styles from "./markdown.module.css";
import "highlight.js/styles/github-dark.css";

const filePath = path.join(
  process.cwd(),
  "../../../alexandria/lenguajes/js-nextjs/guias/usar-markdowns/libs/react-markdown/index.md"
);

export const dynamic = "force-dynamic";

const Articulo = () => {
  const contenido = fs.readFileSync(filePath, "utf-8");
  return (
    <div className={styles.markdown}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
        {contenido}
      </ReactMarkdown>
    </div>
  );
};

export default Articulo;
```

Nota meta: este mismo `index.md` es el archivo que lee y renderiza — el ejemplo se explica a sí mismo.

## `fs.readFileSync` debe ir dentro del componente, no arriba del módulo

Si `readFileSync` está en el top-level del módulo (fuera de la función del componente), corre **una sola vez**, al importar el módulo — no en cada request, ni siquiera en `next dev`. Editas el `.md`, refrescas, y sigue el contenido viejo hasta reiniciar el servidor. Confirmado con test: con top-level, edité el `.md` en caliente y el `<h1>` servido seguía siendo el anterior.

Esto es un problema aparte de si Next trata la ruta como estática (SSG, build-time) o dinámica (SSR, cada request):

- Sin `fetch` dinámico, `cookies()`/`headers()`, ni `dynamic = "force-dynamic"` → en producción Next puede tratar la ruta como estática y cachear el HTML en build.
- `fs.readFileSync` no cuenta como API dinámica para Next, así que por sí solo no fuerza SSR.

Fix — lectura dentro de la función del componente **y** `force-dynamic`, para cubrir ambos casos (dev que no refresca, y prod que cachea en build):

```tsx
export const dynamic = "force-dynamic";

const Articulo = () => {
  const contenido = fs.readFileSync(filePath, "utf-8"); // se re-lee en cada request
  return <ReactMarkdown ...>{contenido}</ReactMarkdown>;
};
```

Confirmado con test: con la lectura dentro del componente y el servidor corriendo, editar el `.md` sin reiniciar cambia el `<h1>` renderizado en la siguiente request.

Sin `force-dynamic`, si el `.md` no cambia entre requests, Next lo cachea en build — mejor rendimiento, mismo resultado visual, pero no sirve para contenido que se edita después del build.

## Configuración necesaria

**Ninguna.** Esa es la ventaja frente al enfoque de import directo (`import contenido from './x.md'`):

- No hay que tocar `next.config.ts` (ni `webpack()` ni `turbopack.rules`).
- No hay que instalar loaders (`raw-loader`, etc.).
- No hay que declarar tipos para `.md` (`declare module "*.md"`), porque no estás importando el archivo como módulo — es un `readFileSync` normal que devuelve `string`.
- Funciona igual con Turbopack (default desde Next.js 16) y con Webpack, porque `fs` no pasa por el bundler: se ejecuta en runtime de servidor, no en build de assets.

La única regla: el componente que llama a `fs.readFileSync` **debe ser Server Component** (por defecto en `app/`). Si lo pones en un componente con `"use client"`, `fs` no existe en el navegador y falla.

## Aviso: hydration mismatch con `<pre>` — no es bug del código

Si el navegador muestra un error de **hydration mismatch** señalando algo como:

```
+ <pre>
- <div style={{position:"relative"}}>
```

justo en los bloques de código del markdown, **no es un problema de `articulo.tsx` ni de `react-markdown`**. El HTML que el servidor genera y el que React espera hidratar coinciden — se puede confirmar con `curl` a la ruta y viendo el `<pre>` en crudo. La causa típica es una **extensión del navegador** ("copy code button" y similares) que envuelve cada `<pre>` en un `<div style="position:relative">` antes de que React hidrate, así el árbol del cliente ya no matchea el del servidor.

Cómo confirmar:
1. Abrir la página en ventana de incógnito o con extensiones desactivadas.
2. Si el error desaparece → confirmado, es la extensión, no hace falta tocar código.
3. Si persiste sin extensiones → ahí sí investigar el componente.

## Por qué esta forma es más fácil

- No toca `next.config.ts`.
- No depende de si el proyecto usa Webpack o Turbopack.
- `fs.readFileSync` corre solo en el servidor (Server Component) — el archivo `.md` nunca llega al bundle de cliente, así que no infla el JS que se descarga en el navegador.
- Sirve igual para archivos dentro o fuera de `src/` (rutas relativas a `process.cwd()`, la raíz del proyecto Next.js).
