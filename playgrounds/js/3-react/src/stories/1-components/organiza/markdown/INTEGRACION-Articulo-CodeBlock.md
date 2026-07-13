# Cómo se integran `Articulo` y `CodeBlock`

Este documento explica el punto de unión entre el componente de dominio (`Articulo`) y el componente básico reusable (`CodeBlock`) — ver `COMPONENTE-Articulo.md` y `COMPONENTE-CodeBlock.md` para el detalle de cada uno por separado.

## 1. Punto de unión: la prop `components` de `react-markdown`

```tsx
// articulo.tsx
import CodeBlock from "../basic/codeblok/CodeBlock";

<ReactMarkdown
  remarkPlugins={[remarkGfm]}
  rehypePlugins={[rehypeHighlight]}
  components={{ pre: CodeBlock }}
>
  {contenido}
</ReactMarkdown>
```

`react-markdown` permite mapear cualquier tag HTML del resultado a un componente React custom vía `components`. Acá se mapea únicamente `pre`: cada vez que el markdown produce un bloque de código, en vez de un `<pre>` plano se renderiza `<CodeBlock {...propsDelPreOriginal} />`.

`Articulo` es el **único** que conoce a `CodeBlock` — la relación es unidireccional. `CodeBlock` no importa nada de `Articulo` ni de `react-markdown`; solo declara que acepta las props de un `<pre>` (`ComponentPropsWithoutRef<"pre">`), que es exactamente lo que `react-markdown` le pasa.

## 2. Qué le llega a `CodeBlock` en `props`

Cuando `rehypeHighlight` ya procesó el markdown, el `<pre>` original tiene como único hijo un `<code class="hljs language-xxx">` con el código ya envuelto en `<span class="hljs-keyword">`, etc. Ese `<code>` llega a `CodeBlock` como `props.children`, y `CodeBlock` simplemente lo renderiza sin tocarlo:

```tsx
<pre {...props} ref={preRef} className={[styles.pre, className].filter(Boolean).join(" ")} />
```

`CodeBlock` no sabe ni le importa que ese `children` tenga clases `hljs-*` — solo le da un contenedor con borde/scroll/tema y un botón encima. El *quién* resalta la sintaxis (`rehypeHighlight`, decisión de `Articulo`) y el *cómo se ve* ese resaltado (colores `--hljs-*`, definidos en `Articulo`) están completamente desacoplados de `CodeBlock`.

## 3. El acoplamiento real: variables de tema CSS

Este es el punto de integración menos obvio, porque no es una prop ni un import — es **herencia de variables CSS por posición en el DOM**:

```
.page (markdown.module.css)          ← DECLARA --md-*, --hljs-*
  .markdown
    ...
      <code class="codeBlockWrapper">  ← CodeBlock.module.css, CONSUME var(--hljs-bg), var(--md-hr), etc.
        <pre class="pre">...
```

`CodeBlock.module.css` nunca declara un solo valor de color: todo son `var(--hljs-*)`/`var(--md-*)`. Para que `CodeBlock` se vea bien, tiene que renderizarse **dentro de un `.page`** (o de cualquier ancestro que declare esas mismas variables). Si mañana `CodeBlock` se usara en un lugar que no está dentro de `.page`, se rompería visualmente — no por un error de JS, sino porque las variables CSS simplemente no existirían en ese contexto (los colores caerían a transparent/valores por defecto del navegador).

**Consecuencia práctica:** `CodeBlock` no es 100% standalone pese a vivir en `src/components/basic/`. Es "básico" en el sentido de que no conoce markdown/react-markdown, pero sigue dependiendo implícitamente del contrato de variables de tema que hoy solo define `Articulo` (vía `.page`). Si se reusa en otro árbol de componentes, hay que asegurarse de definir ese mismo set de variables (`--hljs-bg`, `--hljs-fg`, `--hljs-keyword`, ..., `--md-hr`, `--md-code-bg`, `--md-text`) en algún ancestro — ver la lista completa en `COMO-APLICAR-EL-TEMA.md`.

## 4. Diagrama de dependencias

```
articulo.tsx
  ├── react-markdown, remark-gfm, rehype-highlight   (pipeline de parseo/resaltado)
  ├── markdown.module.css                            (tema + prosa)
  └── CodeBlock.tsx                                  (import directo, vía components={{ pre: CodeBlock }})
        └── CodeBlock.module.css                     (consume var(--hljs-*), var(--md-*) — no las declara)
```

- Flecha de import: `Articulo → CodeBlock` (una sola dirección, `CodeBlock` no sabe que existe `Articulo`).
- Flecha de datos: `Articulo → CodeBlock` vía props (`children`, atributos del `<pre>`).
- Flecha de estilo: `Articulo (.page) → CodeBlock` vía variables CSS heredadas (no vía import de CSS ni de JS).

## 5. Qué pasaría si se quisiera romper este acoplamiento

Para que `CodeBlock` fuera realmente standalone (sin depender de que algún ancestro defina `--hljs-*`/`--md-*`), habría que:

1. Definir sus propios valores por defecto de esas variables directamente en `.codeBlockWrapper` (con `@media (prefers-color-scheme: dark)` propio, como tiene `.page` hoy).
2. Dejar que un ancestro las sobreescriba *opcionalmente* si quiere integrarlo a un tema mayor (lo cual ya funciona igual, por cascada normal de CSS custom properties).

No se hizo así porque, en el estado actual del proyecto, `CodeBlock` solo se usa dentro de `Articulo` — duplicar la paleta de colores en dos archivos sería la abstracción prematura que se evita según las convenciones del proyecto. Si en el futuro aparece un segundo consumidor de `CodeBlock` fuera de un `.page`, ese es el momento de mover los valores por defecto a `CodeBlock.module.css`.
