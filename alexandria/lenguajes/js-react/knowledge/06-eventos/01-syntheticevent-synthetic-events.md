# SyntheticEvent (Synthetic Events)

El sistema de eventos de React no utiliza directamente los eventos nativos del DOM. En su lugar, crea una capa uniforme llamada **`SyntheticEvent`** que envuelve el evento nativo, proporcionando una interfaz consistente entre navegadores y optimizando el rendimiento mediante delegación.

## ¿Qué es `SyntheticEvent`?
Es un **objeto contenedor multiplataforma** que replica la API de los eventos nativos del DOM (`event.target`, `event.preventDefault()`, `event.stopPropagation()`, etc.). Cada vez que interactúas con un evento en JSX (`onClick`, `onChange`), la función recibe una instancia de `SyntheticEvent`, no el evento nativo directamente.

```jsx
function handleClick(e) {
  // 'e' es un SyntheticEvent
  console.log(e.target);    // nodo DOM que disparó el evento
  e.preventDefault();       // previene el comportamiento por defecto
  e.stopPropagation();      // detiene la propagación en el árbol de React
}
```

## Delegación de eventos
React no adjunta manejadores individuales a cada nodo del DOM. En lugar de eso, **adjunta un único listener en la raíz del contenedor** (en React 16 y anteriores, era `document`; a partir de React 17, es el nodo raíz donde se monta la aplicación). Cuando ocurre un evento nativo, este burbujea hasta la raíz, donde React lo intercepta, lo envuelve en un `SyntheticEvent` y lo despacha al componente correcto según el árbol de React.

**Ventajas:**
- **Rendimiento**: un solo listener en lugar de cientos, reduciendo el consumo de memoria.
- **Consistencia**: React maneja la propagación internamente, asegurando que `e.stopPropagation()` detenga el evento dentro del árbol de React, incluso si el evento nativo ya ha burbujeado a la raíz.
- **Múltiples versiones de React**: al delegar en el nodo raíz propio, diferentes versiones de React en la misma página no interfieren (React 17+).

## Normalización entre navegadores
Los navegadores difieren en propiedades y comportamientos de eventos. `SyntheticEvent` unifica:
- `event.target` y `event.currentTarget`.
- Métodos como `preventDefault()`, `stopPropagation()`.
- Propiedades como `event.clientX`, `event.key`, `event.which`, etc.
- Garantiza que `event` se comporte igual en Chrome, Firefox, Safari, etc.

## Pooling de eventos (histórico y eliminado)
En versiones anteriores a React 17, los objetos `SyntheticEvent` se **reutilizaban (pooling)** para mejorar el rendimiento. Sus propiedades se ponían a `null` después de que el callback finalizaba, lo que impedía acceder a ellos de forma asíncrona a menos que se llamara a `event.persist()`.

```jsx
// Antes de React 17
function handleClick(e) {
  e.persist(); // necesario para usar 'e' fuera del callback
  setTimeout(() => console.log(e.target), 1000);
}
```

**React 17 eliminó el pooling**. Ahora los eventos son persistentes; puedes acceder a sus propiedades sin `persist()`. Esto simplifica el desarrollo y elimina una fuente común de bugs.

## Cambios en React 17
- La delegación pasó de `document` al **contenedor raíz** (`rootNode`). Esto hace que los eventos de React no lleguen a `document` hasta que se despachan, facilitando la coexistencia de múltiples instancias de React y la integración con jQuery u otras librerías que esperan eventos en `document`.
- Se eliminó el pooling.
- Se mejoró la alineación con el comportamiento nativo para `onScroll`, `onFocus`, `onBlur` (React pasó a usar `focusin`/`focusout` por defecto).

## Eventos soportados
React maneja la mayoría de los eventos estándar del DOM, agrupados por categorías:
- **Clipboard**: `onCopy`, `onCut`, `onPaste`.
- **Composición**: `onCompositionEnd`, `onCompositionStart`, `onCompositionUpdate`.
- **Teclado**: `onKeyDown`, `onKeyPress`, `onKeyUp`.
- **Foco**: `onFocus`, `onBlur` (usan `focusin`/`focusout` para que burbujeen).
- **Formulario**: `onChange`, `onInput`, `onSubmit`, `onInvalid`.
- **Ratón**: `onClick`, `onDoubleClick`, `onMouseDown`, `onMouseMove`, `onMouseUp`, `onWheel`, etc.
- **Táctil**: `onTouchStart`, `onTouchMove`, `onTouchEnd`.
- **UI**: `onScroll`.
- **Imagen/Media**: `onLoad`, `onError` (en etiquetas `<img>`, `<video>`, etc.).
- **Animación/Transición**: `onAnimationEnd`, `onTransitionEnd`.

**Nota sobre `onLoad` y `onError`**: en elementos como `<img>`, estos eventos no burbujean nativamente. React los captura mediante listeners directos y los integra en su sistema sintético, por lo que sí funcionan en JSX.

## Fases de captura y burbujeo
React soporta ambas fases. Los manejadores en fase de captura se especifican añadiendo `Capture` al nombre del evento:
```jsx
<div onClickCapture={handleClick}>  // se ejecuta en la fase de captura
```

## Propiedades principales de `SyntheticEvent`
- `bubbles: boolean` – si el evento burbujea.
- `cancelable: boolean` – si se puede cancelar.
- `currentTarget: DOMElement` – el elemento al que está adjunto el handler React (no cambia durante la propagación sintética).
- `defaultPrevented: boolean` – indica si se llamó `preventDefault()`.
- `eventPhase: number` – fase actual (captura, target, burbujeo).
- `isTrusted: boolean` – `true` si fue generado por el usuario, `false` si es programático.
- `nativeEvent: DOMEvent` – el evento nativo original.
- `target: DOMElement` – el elemento que disparó el evento.
- `timeStamp: number` – marca de tiempo.
- `type: string` – tipo de evento (ej. "click").
- `preventDefault()` – previene el comportamiento por defecto.
- `stopPropagation()` – detiene la propagación en el árbol de React.
- `isPropagationStopped()` – si se detuvo la propagación.

## Eventos personalizados
React no crea `SyntheticEvent` para eventos no estándar ni `CustomEvent`. Para usarlos, debes adjuntar un listener nativo con una `ref`:
```jsx
const ref = useRef(null);
useEffect(() => {
  const el = ref.current;
  const handler = (e) => console.log(e.detail);
  el.addEventListener('my-custom-event', handler);
  return () => el.removeEventListener('my-custom-event', handler);
}, []);
```

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ StrictMode](../05-renderizado-y-reconciliacion/06-strictmode.md) | [🏠 Inicio](../index.md) | [Manejo de eventos en React ▶](02-manejo-de-eventos-en-react.md) |
