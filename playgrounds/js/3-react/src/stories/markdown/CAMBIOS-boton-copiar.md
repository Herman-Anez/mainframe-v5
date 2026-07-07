# Botón "Copiar" en los bloques de código

## Qué se agregó

Cada bloque de código (`<pre>`) renderizado por `ReactMarkdown` ahora tiene un botón "Copiar" en la esquina superior derecha que copia el contenido del bloque al portapapeles y muestra feedback ("Copiado") por 1.5s.

## Cómo funciona

### 1. Reemplazo del renderer `pre` de `react-markdown`

`react-markdown` permite sobreescribir cómo se renderiza cada tag HTML vía la prop `components`. Se agregó un componente `CodeBlock` en `src/components/markdown/articulo.tsx` y se lo conectó así:

```tsx
<ReactMarkdown
  remarkPlugins={[remarkGfm]}
  rehypePlugins={[rehypeHighlight]}
  components={{ pre: CodeBlock }}
>
  {contenido}
</ReactMarkdown>
```

Cada vez que el markdown produce un bloque de código (` ```lang ... ``` `), en vez de renderizar un `<pre>` plano, React renderiza `<CodeBlock {...props} />`, donde `props` incluye el `<code>` ya resaltado por `rehype-highlight` como `children`.

### 2. `CodeBlock`

```tsx
const CodeBlock = (props: ComponentPropsWithoutRef<"pre">) => {
  const preRef = useRef<HTMLPreElement>(null);
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(timeoutRef.current), []);

  const handleCopy = async () => {
    const text = preRef.current?.textContent ?? "";
    await navigator.clipboard.writeText(text);
    setCopied(true);
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className={styles.codeBlockWrapper}>
      <button type="button" className={styles.copyButton} onClick={handleCopy} aria-label="Copiar código">
        {copied ? "Copiado" : "Copiar"}
      </button>
      <pre {...props} ref={preRef} />
    </div>
  );
};
```

Decisiones puntuales:

- **`preRef.current.textContent`** en vez de reconstruir el string desde el AST de markdown: `textContent` recorre todos los `<span class="hljs-*">` que `rehype-highlight` mete adentro y concatena solo el texto visible, sin los tags de resaltado ni las clases — exactamente el código fuente tal cual, sin colores.
- **`timeoutRef` + cleanup en `useEffect`**: evita el warning de React "no se puede actualizar el estado de un componente desmontado" si el usuario navega fuera de la story mientras el timeout de "Copiado" sigue pendiente. También cancela el timeout anterior si el usuario clickea "Copiar" dos veces seguidas rápido.
- **`{...props}` spread sobre el `<pre>` real**: preserva cualquier atributo/clase que `react-markdown`/`rehype-highlight` le pongan al `<pre>` original (como `className` con el lenguaje), en vez de recrearlo a mano.
- **`node` no se desestructura ni se pasa**: `react-markdown` inyecta un prop extra `node` (el nodo AST de `hast`) a los componentes custom. Como `props` está tipado como `ComponentPropsWithoutRef<"pre">` (sin `node`), TypeScript solo permite pasar las props válidas de un `<pre>` nativo al spread — `node` queda afuera implícitamente y no llega al DOM (evita el warning "Unknown prop `node` on <pre> tag").

### 3. Estilos (`markdown.module.css`)

```css
.codeBlockWrapper {
  position: relative;
}

.copyButton {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  z-index: 1;
  font-family: inherit;
  font-size: 0.75rem;
  line-height: 1;
  padding: 0.35rem 0.6rem;
  border-radius: 6px;
  border: 1px solid var(--md-hr);
  background: var(--md-code-bg);
  color: var(--md-text);
  cursor: pointer;
  opacity: 0.75;
  transition: opacity 0.15s ease;
}

.copyButton:hover,
.copyButton:focus-visible {
  opacity: 1;
}
```

- El wrapper (`.codeBlockWrapper`) es el que tiene `position: relative` para anclar el botón `position: absolute` en su esquina — el `<pre>` en sí no cambió su `position`.
- El botón usa las mismas variables de tema (`--md-hr`, `--md-code-bg`, `--md-text`) documentadas en [`COMO-APLICAR-EL-TEMA.md`](./COMO-APLICAR-EL-TEMA.md), así que ya sale correcto en claro/oscuro sin código adicional.
- `opacity: 0.75` por defecto y `1` en hover/focus: para que no compita visualmente con el código pero siga siendo descubrible.

## Limitaciones conocidas

- **`navigator.clipboard.writeText` requiere contexto seguro** (HTTPS o `localhost`). En Storybook local (`http://localhost:6006`) funciona porque `localhost` cuenta como origen seguro. Si el componente se sirve algún día desde HTTP no-localhost, el copiado fallaría silenciosamente (la promesa rechaza) — no hay manejo de error/fallback (ej. `document.execCommand('copy')`) porque no aplica al entorno actual del proyecto.
- **No hay manejo de error visual** si `writeText` rechaza (por permisos de portapapeles denegados, por ejemplo): el botón simplemente no mostraría "Copiado". No se agregó por no ser un caso esperado en este contexto (Storybook/demo), pero si el componente se reutiliza en producción real, convendría un `try/catch` con feedback de error.
