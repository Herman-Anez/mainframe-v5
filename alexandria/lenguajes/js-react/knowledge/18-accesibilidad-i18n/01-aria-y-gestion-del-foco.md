# ARIA y gestión del foco

La accesibilidad en la web se rige por las WCAG (Web Content Accessibility Guidelines) y se basa en cuatro principios: **perceptible, operable, comprensible y robusto**. React, al generar HTML, puede ser completamente accesible si utilizamos correctamente los elementos semánticos, ARIA y la gestión del foco.

## La base: HTML semántico
El 80 % de la accesibilidad se logra usando los elementos HTML adecuados: `<button>` para acciones, `<a>` para navegación, `<input>` con `<label>` para formularios, `<main>`, `<nav>`, `<header>`, `<footer>`, `<table>` para datos tabulares. Esto proporciona roles, estados y comportamientos de teclado sin esfuerzo.

- **No reinventes la rueda**: un `<div onClick={handler}>` no es un botón. No es focuseable por teclado, no responde a Enter/Espacio, y no expone su rol. Mejor: `<button onClick={handler}>`.

## ARIA: cuándo y cómo
ARIA (Accessible Rich Internet Applications) es un conjunto de atributos que suplen la semántica cuando el HTML nativo no alcanza. La **primera regla de ARIA**: no lo uses si puedes usar un elemento HTML nativo. Solo recurre a ARIA para componentes complejos (sliders, tabs, modales, menús autocompletables) que no tienen equivalente nativo.

**Atributos comunes en React:**
- `aria-label`: proporciona una etiqueta textual para un elemento (ej. un botón sin texto visible, solo un icono).
  ```jsx
  <button aria-label="Cerrar" onClick={handleClose}><IconClose /></button>
  ```
- `aria-labelledby`: referencia el `id` de otro elemento que actúa como etiqueta visible. Más robusto que `aria-label` porque usa contenido existente.
  ```jsx
  <h2 id="dialog-title">Confirmación</h2>
  <div role="dialog" aria-labelledby="dialog-title">...</div>
  ```
- `aria-describedby`: apunta a un elemento que contiene una descripción más larga (ej. un mensaje de error).
  ```jsx
  <input aria-describedby="email-error" />
  <span id="email-error">El email no es válido</span>
  ```
- `aria-hidden`: oculta un elemento a los lectores de pantalla (útil para iconos decorativos).
  ```jsx
  <span aria-hidden="true">🔔</span>
  ```
- `aria-expanded`: indica si un elemento colapsable (acordeón, menú desplegable) está abierto.
- `aria-current`: señala el elemento activo en una navegación.

**Roles personalizados:**  
Cuando no hay un elemento nativo, se asigna `role` y se gestionan los estados y el comportamiento de teclado manualmente.

```jsx
<ul role="tablist">
  <li role="tab" aria-selected={selectedIndex === 0} tabIndex={selectedIndex === 0 ? 0 : -1}>Pestaña 1</li>
</ul>
```
Pero hoy en día, componentes como `<button role="tab">` pueden heredar el comportamiento de botón, simplificando el teclado.

## Gestión del foco
En una SPA, la navegación no recarga la página, por lo que el foco no vuelve al inicio. Debemos moverlo explícitamente.

**Técnicas fundamentales:**
- **Envío a contenido principal**: tras navegar, enfocamos el nuevo contenido.
  ```jsx
  const headingRef = useRef(null);
  useEffect(() => {
    headingRef.current?.focus();
  }, [ruta]);
  return <h1 ref={headingRef} tabIndex={-1}>Perfil</h1>;
  ```
- **Trampa de foco en modales**: cuando un modal se abre, el foco debe moverse al interior y no salir hasta que se cierre. Herramientas como `react-focus-lock` o `@radix-ui/react-dialog` lo implementan correctamente. Manualmente, se escucha `onKeyDown` y se maneja Tab para ciclar entre los elementos interactivos del modal.
- **Retorno del foco al cerrar**: al desmontar el modal, el foco debe regresar al elemento que lo abrió.
- **Skip links**: enlaces invisibles al inicio que permiten saltar al contenido principal.
  ```jsx
  <a href="#main-content" className="sr-only focus:not-sr-only">Saltar al contenido principal</a>
  ```

**En React, el hook `useEffect` y `useRef` son las herramientas para controlar el foco de manera declarativa.**

```jsx
function Modal({ isOpen, onClose, triggerRef }) {
  const modalRef = useRef(null);
  useEffect(() => {
    if (isOpen) {
      modalRef.current?.focus(); // mueve foco al modal
    } else {
      triggerRef.current?.focus(); // devuelve foco al trigger
    }
  }, [isOpen]);
  // ... implementar trampa de foco con keydown
}
```

## Navegación por teclado
Los componentes interactivos deben responder al teclado según el patrón de diseño ARIA correspondiente. Por ejemplo:
- **Menú de navegación**: usar `ArrowUp`/`ArrowDown`, `Enter`, `Escape`.
- **Tabs**: `ArrowRight`/`ArrowLeft`, `Home`, `End`.
- **Listbox**: `ArrowUp`/`ArrowDown`, `Enter`.

React permite añadir estos manejadores con `onKeyDown` y actualizar el estado.

## Generación de IDs únicos con `useId`
Para asociar elementos como `aria-labelledby` o `htmlFor` sin colisiones, React 18 introdujo `useId`. Genera un ID estable y único por instancia.
```jsx
function Campo() {
  const id = useId();
  return (
    <>
      <label htmlFor={id}>Nombre</label>
      <input id={id} type="text" />
    </>
  );
}
```

## Pruebas de accesibilidad
- **`eslint-plugin-jsx-a11y`**: analiza el JSX en búsqueda de problemas comunes.
- **`axe-core` / `@axe-core/react`**: ejecuta auditorías en tiempo de ejecución durante el desarrollo.
- **React Testing Library** fomenta consultas por rol (`getByRole`), lo que naturalmente valida la accesibilidad del componente.

## Buenas prácticas en React
- Siempre proporciona `<label>` asociado a `<input>` mediante `htmlFor` o anidando.
- No uses `aria-label` como sustituto de un label visible cuando el diseño lo permite.
- Avisa a los lectores de pantalla de cambios dinámicos con `aria-live="polite"` o `role="alert"` en mensajes de error.
- Usa componentes de librerías de UI accesibles (Radix UI, Headless UI, Reach UI) que ya implementan estos patrones.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Render Props vs. Higher-Order Components (HOC)](../17-patrones-avanzados/04-render-props-vs-higher-order-components-hoc.md) | [🏠 Inicio](../index.md) | [Internacionalización (i18n) ▶](02-internacionalizacion-i18n.md) |
