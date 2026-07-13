# Componente `Articulo`

**Ubicación:** `src/components/markdown/articulo.tsx` + `markdown.module.css`

## Qué es

Componente de dominio (no "basic"): sabe específicamente que tiene que renderizar **un artículo markdown concreto** como HTML con estilo de prosa, tema claro/oscuro y bloques de código con resaltado + botón de copiar.

```tsx
const Articulo = () => {
  return (
    <div className={styles.page}>
      <div className={styles.markdown}>
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeHighlight]}
          components={{ pre: CodeBlock }}
        >
          {contenido}
        </ReactMarkdown>
      </div>
    </div>
  );
};
```

No recibe props: el contenido (`contenido`) es un import estático (`?raw`) del archivo `alexandria/lenguajes/js-react/markdown/react-markdown/index.md`, resuelto en build time por Vite (ver `CAMBIOS-fix-node-path.md` para el porqué de este enfoque en vez de `fs`/`node:path`).

## Pipeline de renderizado

1. **`contenido`** (string markdown crudo) entra a `<ReactMardown>`.
2. **`remarkGfm`**: agrega soporte GFM (tablas, listas de tareas, strikethrough, autolinks) al parseo del markdown.
3. **`rehypeHighlight`**: una vez que el markdown se convirtió a HTML (hast), recorre los bloques ` ``` ` y les agrega clases `hljs`/`hljs-*` de resaltado de sintaxis — sin esto, `CodeBlock`/`CodeBlock.module.css` no tendrían nada que colorear.
4. **`components={{ pre: CodeBlock }}`**: cada `<pre>` que el pipeline anterior generó se reemplaza por `<CodeBlock>` en vez de un `<pre>` plano — así los bloques de código salen con borde, tema y botón de copiar en vez de HTML sin estilo.

## Estructura de contenedores: `.page` vs `.markdown`

```
.page                    ← dueño del tema (fondo, texto, TODAS las variables --md-*/--hljs-*), full-bleed (min-height:100vh)
  .markdown              ← solo layout de prosa (max-width, padding, tipografía)
    <ReactMarkdown>...</ReactMarkdown>
```

Separar el fondo del tema (`.page`) del layout de contenido (`.markdown`) evita que el modo oscuro se corte en los bordes del texto (ver `COMO-APLICAR-EL-TEMA.md` § 1-2) — el fondo cubre toda el área visible, el texto queda centrado en una columna de lectura de 780px.

## Qué vive en `markdown.module.css` (y qué no)

Vive acá:
- Variables de tema (`--md-*`, `--hljs-*`) en `.page`, con override bajo `@media (prefers-color-scheme: dark)`.
- Estilos de prosa: headings, párrafos, listas, links, código **inline** (` `` `, con `:not([class])` para no pisar el bloque de código — ver `CAMBIOS-separar-css-codeblock.md`), blockquote, tabla, hr.

NO vive acá (se movió a `CodeBlock.module.css`):
- Borde, padding, scroll y fondo del bloque de código (`<pre>`).
- Botón de copiar.
- Colores de resaltado de sintaxis (`hljs-keyword`, `hljs-string`, etc.).

## Qué NO hace (por diseño)

- No es genérico: el markdown a renderizar está hardcodeado (`contenido`), no es una prop. Si se necesita reusar para otro artículo, hay que parametrizar `contenido` (y probablemente el título de la story).
- No maneja estados de carga/error: como el contenido se resuelve en build time (`?raw`), no hay fetch ni posibilidad de fallo en runtime por ese lado.
