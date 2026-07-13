# Fix: `Module "node:path" has been externalized for browser compatibility`

## Problema original

La story `markdown/baseComponent` (`articulo.stories.tsx`) fallaba al renderizar con este error:

```
Module "node:path" has been externalized for browser compatibility. Cannot access "node:path.join" in client code.
    at Object.get (http://localhost:6006/@id/__vite-browser-external:node:path:3:11)
    at http://localhost:6006/src/components/markdown/articulo.tsx:11:23
```

### Causa raíz

El componente `src/components/markdown/articulo.tsx` estaba escrito como si fuera un **Server Component de Next.js**: usaba `node:fs` y `node:path` a nivel de módulo para leer un archivo `.md` del disco en tiempo de ejecución, y exportaba `dynamic = "force-dynamic"` (convención propia de Next.js, sin efecto fuera de ese framework).

```tsx
import fs from "node:fs";
import path from "node:path";
// ...
const filePath = path.join(
  process.cwd(),
  "../../../alexandria/lenguajes/js-react/guias/usar-markdowns/libs/react-markdown/index.md"
);

export const dynamic = "force-dynamic";

const Articulo = () => {
  const contenido = fs.readFileSync(filePath, "utf-8");
  // ...
};
```

Storybook corre este componente en el **navegador**, vía Vite. Vite no puede resolver módulos nativos de Node (`node:fs`, `node:path`) en un bundle de cliente — los "externaliza" (los reemplaza por un stub que lanza error al primer acceso). Por eso el `path.join(...)` explotaba apenas se importaba el módulo.

Adicionalmente, la ruta apuntaba a un archivo que ya no existe (`.../guias/usar-markdowns/libs/react-markdown/index.md`); el archivo real está en `.../alexandria/lenguajes/js-react/markdown/react-markdown/index.md`.

## Solución aplicada

### 1. `src/components/markdown/articulo.tsx`

Se eliminó la lectura de disco en runtime (`fs.readFileSync` + `path.join`) y se reemplazó por un **import estático de Vite con el sufijo `?raw`**, que inlinea el contenido del `.md` como string en tiempo de build/transform — sin usar APIs de Node, 100% compatible con navegador:

```tsx
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import styles from "./markdown.module.css";
import "highlight.js/styles/github-dark.css";
import contenido from "../../../../../../alexandria/lenguajes/js-react/markdown/react-markdown/index.md?raw";

const Articulo = () => {
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

Cambios puntuales:
- Se quitaron los imports `node:fs` y `node:path`.
- Se quitó `export const dynamic = "force-dynamic"` (sin efecto fuera de Next.js, ruido).
- Se corrigió la ruta al archivo `.md` real (`alexandria/lenguajes/js-react/markdown/react-markdown/index.md`).
- El contenido ahora se obtiene vía `import ... from "...md?raw"`, resuelto por Vite en build time.

### 2. `vite.config.ts` — permitir servir archivos fuera de la raíz del proyecto

Por defecto, el dev server de Vite restringe qué archivos puede servir (`server.fs.allow`) al *workspace root* detectado. El archivo `.md` vive en `alexandria/`, fuera de `taller/js/3-react` (la raíz de este proyecto Vite/Storybook), así que había que ampliar el allowlist:

```ts
server: {
  fs: {
    allow: [path.resolve(dirname, '../../..')]
  }
},
```

`path.resolve(dirname, '../../..')` sube desde `taller/js/3-react` hasta la raíz del repo (`mainframe-v5`), cubriendo así `alexandria/`.

### 3. `vitest.shims.d.ts` — tipado para imports `?raw`

TypeScript no reconoce por defecto el sufijo `?raw` en imports. Vite provee esos tipos en `vite/client`, pero no estaban referenciados en el proyecto. Se agregó:

```ts
/// <reference types="@vitest/browser-playwright" />
/// <reference types="vite/client" />
```

Esto declara `declare module '*?raw' { const src: string; export default src; }`, necesario para que `import contenido from ".../index.md?raw"` compile sin error de tipos.

## Verificación

- Se reinició Storybook (`pnpm storybook`, puerto 6006).
- Se confirmó con `curl` que Vite sirve correctamente tanto el componente (`/src/components/markdown/articulo.tsx` → `200`) como el archivo `.md` vía `@fs` (`/@fs/.../index.md?raw` → `200`).
- Ya no aparece el error de `node:path` externalizado.

## Por qué este enfoque y no otro

- **Alternativa descartada — usar `fetch` en runtime**: requeriría servir el `.md` como asset público y manejar estados de carga (loading/error) en el componente; más complejidad para un caso simple de contenido estático.
- **Alternativa descartada — mantener `fs`/`path` con un decorator/mock en Storybook**: solo tapa el síntoma en Storybook, pero el componente seguiría roto en cualquier build real de cliente (Vite/CRA/etc.), ya que el problema es de fondo: código de servidor (Next.js) ejecutándose en contexto de navegador.
- **Elegido — `?raw` import de Vite**: el contenido es estático y conocido en build time, así que inlinearlo es lo más simple, no requiere fetch ni loading state, y funciona igual en Storybook, dev y build de producción.
