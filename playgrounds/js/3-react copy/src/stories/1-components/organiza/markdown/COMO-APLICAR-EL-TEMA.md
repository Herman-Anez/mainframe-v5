# Cómo aplicar el tema (claro/oscuro) al componente `Articulo`

Este documento explica el patrón de theming usado en `src/components/markdown/markdown.module.css` y cómo aplicarlo/extenderlo a otros componentes.

## 1. Estrategia usada: CSS Custom Properties + `prefers-color-scheme`

No se usa una librería de theming ni contexto de React. El tema se resuelve **100% en CSS**, con dos piezas:

1. Un bloque de **variables CSS** (`--md-*`, `--hljs-*`) declaradas con valores de tema claro por defecto, en el selector raíz del componente (`.page`).
2. Un `@media (prefers-color-scheme: dark)` que **redefine esas mismas variables** con los valores del tema oscuro, en el mismo selector.
3. El resto de las reglas del componente nunca usan colores hardcodeados: siempre `var(--md-text)`, `var(--md-link)`, etc.

```css
.page {
  --md-bg: #ffffff;
  --md-text: #24292e;
  /* ...resto de variables en modo claro... */

  background: var(--md-bg);
  color: var(--md-text);
}

@media (prefers-color-scheme: dark) {
  .page {
    --md-bg: #0d1117;
    --md-text: #c9d1d9;
    /* ...resto de variables en modo oscuro... */
  }
}
```

**Por qué así:** las custom properties heredan por el árbol del DOM (no por selector), así que basta con redefinirlas una vez en el contenedor raíz — todos los hijos que usen `var(--md-text)` cambian automáticamente. No hace falta duplicar reglas de layout, solo los valores de color.

Como el tema depende de `prefers-color-scheme`, **es automático**: sigue la preferencia del sistema operativo / navegador del usuario, sin necesidad de un botón ni de JS.

## 2. Estructura de contenedores: `.page` vs `.markdown`

```tsx
<div className={styles.page}>       {/* fondo + variables de tema, cubre toda el área */}
  <div className={styles.markdown}> {/* solo layout: max-width, padding, tipografía */}
    <ReactMarkdown ... />
  </div>
</div>
```

- **`.page`**: dueño del tema. Define `background`, `color` y todas las variables `--md-*`/`--hljs-*`. Tiene `min-height: 100vh` para que el fondo cubra toda el área visible, no solo el ancho de texto.
- **`.markdown`**: solo layout (centrado, ancho máximo, padding). No define colores — los hereda de `.page` vía las variables.

Si el fondo se define solo en `.markdown` (como pasaba antes de este fix), el área fuera del `max-width` queda con el fondo por defecto de la página (blanco), rompiendo el efecto de modo oscuro. Por eso el fondo se separó a un wrapper full-bleed.

## 3. Cómo aplicar este mismo patrón a otro componente

1. Elegí un contenedor raíz (el nodo más externo del componente).
2. Declará ahí las variables de color que tu componente necesite, con valores de tema claro:
   ```css
   .miComponente {
     --mc-bg: #fff;
     --mc-text: #111;
     background: var(--mc-bg);
     color: var(--mc-text);
   }
   ```
3. Agregá el override oscuro con el mismo selector:
   ```css
   @media (prefers-color-scheme: dark) {
     .miComponente {
       --mc-bg: #111;
       --mc-text: #eee;
     }
   }
   ```
4. En el resto del CSS del componente, usá siempre `var(--mc-*)`, nunca colores fijos.

## 4. Caso especial: clases globales inyectadas por librerías (`highlight.js`)

`rehype-highlight` agrega clases `hljs`, `hljs-keyword`, `hljs-string`, etc. directamente al HTML generado — esas clases **no** pasan por CSS Modules (no se pueden importar como `styles.hljsKeyword`). Para tematizarlas sin perder el scoping del módulo, se usa `:global()`:

```css
.markdown :global(.hljs-keyword) {
  color: var(--hljs-keyword);
}
```

Esto compila a `.markdown_hljs-keyword-generated-hash .hljs-keyword { ... }`, o sea: sigue acotado a instancias de `.markdown`, pero apunta a una clase global no hasheada por dentro.

Antes se resolvía importando un stylesheet completo de `highlight.js` (`github-dark.css`), fijo siempre en oscuro. Se reemplazó por variables `--hljs-*` con paleta GitHub Light/Dark, para que el bloque de código seguna el mismo esquema que el resto del artículo.

## 5. Borde de los bloques de código y el bug del scrollbar

Se agregó un borde `2px solid #ffa500` a `.markdown pre` para resaltar visualmente los bloques de código.

**Problema encontrado:** al principio `overflow-x: auto` (necesario para que el código largo scrollee en vez de desbordar) estaba en el mismo elemento `pre` que tenía el borde. Aumentar el `padding-bottom` de ese `pre` no generaba ningún espacio visible entre el scrollbar horizontal y el borde — el scrollbar seguía pegado/intersectando el borde.

**Causa:** es un comportamiento conocido de los navegadores (Chrome en particular): cuando un elemento es a la vez contenedor de scroll (`overflow-x/y: auto|scroll`) y su contenido desborda, el padding del lado "final" del eje de scroll (`padding-bottom` para scroll vertical, `padding-right`/`padding-bottom` según eje) se recorta y no se respeta visualmente. El scrollbar nativo se dibuja pegado al borde del *padding-box*, ignorando ese padding extra.

**Fix:** separar responsabilidades — el que scrollea no debe ser el que tiene el borde:

```css
.markdown pre {
  border-radius: 8px;
  padding: 1rem;
  background: var(--hljs-bg);
  border: 2px solid #ffa500;
  overflow: hidden; /* no scrollea, solo recorta esquinas redondeadas */
}

.markdown pre code {
  display: block;
  overflow-x: auto;   /* el scroll horizontal se mueve acá */
  background: none;
  padding: 0 0 0.75rem; /* espacio real entre el código/scrollbar y el borde del padre */
  font-size: 0.85em;
}
```

Con esto: `pre` es puramente decorativo (borde, fondo, radio), y `code` es el que scrollea internamente — su propio `padding-bottom` sí se respeta porque `code` no tiene borde ni layout de decoración, y el `pre` (que sí tiene el borde) nunca tiene contenido propio que desborde, por lo que no dispara el bug de recorte de padding.

**Regla general para replicar:** si vas a poner `border` + `overflow-x: auto` en un componente y el contenido puede desbordar, no los pongas en el mismo elemento. Poné el borde en un wrapper exterior sin overflow, y el scroll en un hijo interior sin borde.

## 6. Limitaciones actuales

- **No hay toggle manual.** El tema sigue únicamente la preferencia del SO/navegador (`prefers-color-scheme`). Si se necesita un botón de "modo oscuro" independiente del SO, hay que:
  1. Agregar un atributo, p. ej. `data-theme="dark"` en un ancestro (`<html>` o `.page`).
  2. Duplicar el bloque de variables oscuras bajo un selector de atributo además del media query:
     ```css
     .page[data-theme='dark'] {
       --md-bg: #0d1117;
       /* ... */
     }
     ```
  3. Guardar la preferencia (localStorage) y aplicar el atributo en JS al montar.
- **El tema es local al componente**, no está conectado a las variables globales de `src/index.css` (`--bg`, `--text`, etc.), porque Storybook (`.storybook/preview.tsx`) no importa ese CSS global. Si el componente se usa dentro de la app real (donde sí se carga `index.css`), ambos sistemas de variables coexisten sin conflicto porque usan prefijos distintos (`--md-*` vs los globales).

## 7. Verificar el tema manualmente

En Chrome DevTools: `Rendering` → `Emulate CSS media feature prefers-color-scheme` → alternar `light`/`dark`, y confirmar que fondo, texto, links, tablas, blockquotes y bloques de código cambian juntos.
