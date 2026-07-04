# Portales

## Definición y propósito
Un portal es una forma de renderizar un subárbol de React en un nodo del DOM que está **fuera de la jerarquía del componente padre**. ReactDOM proporciona la función `createPortal(children, domNode)` para este fin.

```jsx
import { createPortal } from 'react-dom';

function Modal({ children }) {
  return createPortal(
    <div className="modal-backdrop">{children}</div>,
    document.getElementById('modal-root') // contenedor externo al root de React
  );
}
```

La magia es que, aunque el DOM resultante esté en otro lugar, **el comportamiento de React (contexto, eventos sintéticos, ciclo de vida) sigue funcionando como si el subárbol estuviera en su ubicación original dentro del árbol de React**. Es decir, un portal no rompe el árbol de componentes: sigue siendo hijo del componente que lo creó, lo que preserva el flujo de datos descendente y el burbujeo de eventos hacia los ancestros.

## ¿Por qué existen?
Algunos elementos de la interfaz necesitan escapar visual y semánticamente del contenedor principal por restricciones de CSS o accesibilidad:
- **Modales y diálogos**: deben estar en la capa superior del DOM para evitar que un `overflow: hidden` o `z-index` de un ancestro los recorte.
- **Tooltips y popovers**: para posicionarlos correctamente y evitar conflictos con `transform` o `filter` del ancestro.
- **Menús flotantes y dropdowns**: similar a lo anterior.
- **Notificaciones toast**: suelen anclarse a una esquina de la ventana.

Sin portales, tendrías que montar estos elementos fuera del árbol de React y perderías el contexto, la propagación de eventos y el ciclo de vida.

## API: `createPortal(children, container)`
- `children`: cualquier contenido renderizable por React (JSX, string, números, otros componentes).
- `container`: un nodo del DOM (no un string, debe ser un elemento existente). Normalmente se obtiene con `document.getElementById` o `useRef` a un div en el `index.html`.

El portal se monta dentro del `container` especificado al momento del commit. React mantiene la sincronización: si el estado o las props cambian, el contenido del portal se actualiza; si el componente que lo crea se desmonta, el portal se limpia.

```jsx
function App() {
  return (
    <div>
      <MainContent />
      {createPortal(<Notificaciones />, document.body)}
    </div>
  );
}
```

Aquí `<Notificaciones />` se pinta al final de `document.body`, pero React lo considera hijo de `<App />` en el árbol de componentes.

## Eventos y portales: el comportamiento híbrido
Este es uno de los aspectos más sorprendentes y poderosos: **los eventos sintéticos se propagan siguiendo el árbol de React, no la jerarquía del DOM**. Si haces clic dentro de un portal, el evento burbujeará hacia los ancestros del componente que creó el portal (en el árbol React), aunque en el DOM real no estén anidados.

```jsx
function Padre() {
  const handleClick = () => console.log('Clic en el portal capturado por el padre');
  return (
    <div onClick={handleClick}>
      <HijoConPortal />
    </div>
  );
}

function HijoConPortal() {
  return createPortal(
    <button>Clic aquí</button>,
    document.body
  );
}
```

Cuando se hace clic en el botón (que está en `document.body`), el evento se origina ahí, pero React lo captura y lo propaga a través del árbol: primero `HijoConPortal`, luego `Padre` y sus ancestros. Esto permite patrones como un modal que se cierra al hacer clic en el backdrop, donde el `onClick` se maneja en el componente padre.

**Implicaciones prácticas:**
- No necesitas parchear eventos manualmente entre ventanas externas.
- `stopPropagation()` en un portal detiene la propagación hacia ancestros React, pero no afecta el burbujeo nativo en el DOM real.
- Los eventos nativos añadidos fuera de React (por ejemplo, con `addEventListener` en `document.body`) sí se propagan por el DOM real, y pueden llegar a otros elementos si no se controla.

## Contexto y portales
Un portal sigue teniendo acceso a los contextos de sus ancestros React. Si el portal es creado dentro de un `ThemeProvider`, puede consumir el tema normalmente. Esto es una ventaja enorme: no necesitas duplicar proveedores para el contenido desacoplado.

```jsx
<ThemeContext.Provider value="dark">
  <App />
</ThemeContext.Provider>

function App() {
  return createPortal(<ThemedButton />, document.body); // lee "dark"
}
```

## Creación dinámica del contenedor
El nodo destino debe existir en el momento del renderizado. Puedes tener un `<div id="modal-root">` estático en el `index.html`, o bien crearlo dinámicamente con un efecto:

```jsx
function usePortal(id) {
  const [container, setContainer] = useState(null);
  useEffect(() => {
    const el = document.createElement('div');
    el.id = id;
    document.body.appendChild(el);
    setContainer(el);
    return () => {
      document.body.removeChild(el);
    };
  }, [id]);
  return container;
}

function Modal({ children }) {
  const container = usePortal('modal');
  if (!container) return null;
  return createPortal(children, container);
}
```

## Server-Side Rendering (SSR) y portales
En SSR, `document` no existe. `createPortal` no puede ejecutarse en el servidor. Para componentes que usan portales, debes renderizar un fallback en el servidor y montar el portal solo en el cliente. Un patrón es usar un estado que solo se active tras el montaje:

```jsx
function Modal({ children }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null; // no renderiza en el servidor
  return createPortal(children, document.getElementById('modal-root'));
}
```

O usar librerías que abstraen esto, como `react-portal` o `@headlessui/react`.

## Consideraciones de accesibilidad
- El portal debe mantener el manejo del foco: un modal debe atrapar el foco y devolverlo al elemento que lo abrió al cerrarse.
- Usa `aria-modal` y roles apropiados, además de gestionar el foco con JavaScript (técnica de "focus trap").
- Dado que el contenido está fuera de la jerarquía del DOM, los lectores de pantalla pueden necesitar que se gestione la secuencia de lectura; pero la mayoría funciona correctamente mientras el foco esté bien manejado.

## Limitaciones y cuándo no usar portales
- **No es para todo**: si puedes resolver un posicionamiento con CSS, no necesitas un portal. Úsalo solo cuando el DOM padre imponga restricciones reales.
- **Estilos**: los estilos CSS aplicados a los ancestros no se heredan (porque el portal está fuera). Debes estilizarlo independientemente o usar CSS-in-JS con contexto.
- **Pruebas**: en testing, asegúrate de que el contenedor existe en el DOM de prueba o mockea `createPortal`.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Usos avanzados de refs](../09-refs/03-usos-avanzados-de-refs.md) | [🏠 Inicio](../index.md) | [Fragmentos ▶](02-fragmentos.md) |
