# Componente `CodeBlock`

**Ubicación:** `src/components/basic/codeblok/CodeBlock.tsx` + `CodeBlock.module.css`

## Qué es

Componente de bloque ("basic", reusable, sin conocimiento del dominio markdown/artículo) que renderiza un `<pre>` con:

- borde de color y fondo tematizado (claro/oscuro)
- scroll horizontal propio para código largo
- resaltado de sintaxis vía clases `hljs-*` (generadas externamente, no por este componente)
- un botón "Copiar" que copia el texto del bloque al portapapeles

No sabe nada de `react-markdown` ni de markdown en general: solo recibe las props que tendría un `<pre>` nativo y las usa para renderizar su contenido (`children`, típicamente un `<code>` ya resaltado).

## API

```tsx
type CodeBlockProps = React.ComponentPropsWithoutRef<"pre">;

<CodeBlock className="opcional">
  <code className="hljs language-ts">...</code>
</CodeBlock>
```

- Acepta cualquier prop válida de `<pre>` (`children`, `className`, `id`, atributos `data-*`, etc.) y se las reenvía al `<pre>` real que renderiza internamente.
- `className` recibido se mergea con la clase interna `styles.pre` (no la reemplaza).
- No expone props propias (no hay `onCopy`, no hay variante de idioma, etc.) — es deliberadamente mínimo.

## Estructura interna

```tsx
<code className={styles.codeBlockWrapper}>       {/* contenedor + tema, position:relative */}
  <button onClick={handleCopy}>{copied ? "Copiado" : "Copiar"}</button>
  <pre {...props} ref={preRef} className={...} /> {/* el pre real, con overflow-x + borde */}
</code>
```

- **`.codeBlockWrapper`** (`<code>`, no `<div>`): contenedor raíz, `display:block` + `position:relative` para anclar el botón, y `margin-bottom` para el espaciado entre bloques.
- **botón "Copiar"**: posicionado absoluto arriba a la derecha, opacidad reducida hasta hover/focus.
- **`<pre>` interno**: tiene el borde naranja, el fondo tematizado y el `overflow-x: auto` — es el que realmente scrollea.

## Copiar al portapapeles

```tsx
const handleCopy = async () => {
  const text = preRef.current?.textContent ?? "";
  await navigator.clipboard.writeText(text);
  setCopied(true);
  clearTimeout(timeoutRef.current);
  timeoutRef.current = setTimeout(() => setCopied(false), 1500);
};
```

- Usa `textContent` del `<pre>` (vía `ref`) en vez de reconstruir el string a mano: recorre todos los `<span class="hljs-*">` internos y devuelve solo el texto visible, sin marcado de color.
- `timeoutRef` + `clearTimeout` en cleanup de `useEffect`: evita "Copiado" quedando pegado si el usuario clickea rápido dos veces, y evita actualizar estado de un componente ya desmontado.
- Requiere contexto seguro (`https://` o `localhost`) para que `navigator.clipboard` exista — ver limitaciones en `CAMBIOS-boton-copiar.md`.

## Theming

`CodeBlock.module.css` no define ningún color propio: todo pasa por `var(--hljs-*)` / `var(--md-hr)` / `var(--md-code-bg)` / `var(--md-text)`, variables que **no** declara — las espera heredadas de un ancestro (ver `COMPONENTE-Articulo.md` e `INTEGRACION-Articulo-CodeBlock.md`). Esto es intencional: `CodeBlock` es "tema-agnóstico", cualquier padre que le dé esas variables lo tematiza correctamente.

## Qué NO hace (por diseño)

- No decide *cuándo* usarse (eso lo decide quien lo integra — ver doc de integración).
- No sabe resaltar sintaxis: espera que el `children` ya venga resaltado (clases `hljs-*` puestas por otra librería).
- No tiene fallback visual si `navigator.clipboard.writeText` falla (rechaza la promesa silenciosamente).
