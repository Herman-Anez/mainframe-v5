# Fix: separar el CSS del `CodeBlock` del CSS del `Articulo`

## Contexto

`CodeBlock` se movió a su propio componente reusable en `src/components/basic/codeblok/CodeBlock.tsx`, pero su CSS (borde, botón de copiar, resaltado de sintaxis) seguía viviendo en `src/components/markdown/markdown.module.css`, anclado al selector `.markdown`. Eso significaba que `CodeBlock` no era realmente independiente: su apariencia dependía de estar dentro de un `.markdown`, y las reglas quedaban mezcladas con las de prosa del artículo en el mismo archivo.

## Qué se movió

De `markdown.module.css` → a `src/components/basic/codeblok/CodeBlock.module.css`:

- `.markdown pre` → `.pre` (radio de borde, padding, `overflow-x`, fondo, borde naranja `#ffa500`)
- `.markdown pre code` / `.markdown pre code.hljs` → `.pre code` / `.pre :global(code.hljs)`
- Todo el bloque de resaltado de sintaxis `.markdown :global(.hljs*)` → `.codeBlockWrapper :global(.hljs*)`
- `margin-bottom: 1rem` que antes vivía en la lista combinada `.markdown p, ul, ol, blockquote, table, pre` → ahora es propiedad directa de `.codeBlockWrapper`

`markdown.module.css` quedó únicamente con estilos de prosa (headings, listas, links, código inline, blockquote, tabla, hr) y las variables de tema (`--md-*`, `--hljs-*`, en `.page`).

## Por qué las variables de tema NO se movieron

`--hljs-*` y `--md-*` siguen declaradas en `.page` (`markdown.module.css`), aunque `CodeBlock.module.css` las consuma. Las custom properties de CSS heredan por árbol del DOM, no por archivo — como `CodeBlock` sigue renderizado dentro de `.page` en `articulo.tsx`, `var(--hljs-bg)` etc. le llegan igual. Esto mantiene una sola fuente de verdad para los colores del tema (ver `COMO-APLICAR-EL-TEMA.md`), en vez de duplicarlos en cada componente que los consume.

## Bug encontrado en el camino

Al aislar el CSS apareció un problema real, no solo cosmético de organización:

```css
.markdown code {
  background: var(--md-code-bg);
  padding: 0.15em 0.4em;
  border-radius: 4px;
  font-size: 0.85em;
}
```

Esta regla usa el tag `code` sin filtrar por clase, así que también matcheaba:

1. El `<code className={styles.codeBlockWrapper}>` — el wrapper raíz de `CodeBlock` (desde el cambio anterior de `<div>` a `<code>`).
2. El `<code class="hljs language-xxx">` interno, generado por `rehype-highlight`.

Resultado: el bloque de código completo (wrapper + `pre` + botón) heredaba un fondo gris translúcido y padding pensados para código inline dentro de un párrafo — un halo visual no intencional alrededor de todo el bloque, superpuesto a los estilos propios de `CodeBlock`.

**Fix:**

```css
.markdown code:not([class]) {
  /* ... */
}
```

El código inline real (` `` ` en markdown) nunca tiene atributo `class`; el wrapper de `CodeBlock` y el `<code class="hljs...">` sí. `:not([class])` excluye ambos sin necesitar acoplar `markdown.module.css` a los nombres de clase (hasheados por CSS Modules) de otro archivo.

## Cómo verificar que sigue andando

```bash
npx tsc --noEmit -p tsconfig.json   # sin errores de tipos
```

Y en Storybook: confirmar visualmente que el código inline (` `` `) dentro de un párrafo sigue con su fondo gris pequeño, y que el bloque de código (` ``` `) no tiene ningún fondo/padding extra detrás del borde naranja.
