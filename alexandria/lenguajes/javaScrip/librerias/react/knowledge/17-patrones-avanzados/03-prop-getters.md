# Prop Getters

Un prop getter es una función que retorna un objeto de props ya configuradas (event handlers, roles, atributos aria, claves, estilos) que el usuario debe esparcir sobre un elemento. El objetivo es **reducir el boilerplate y garantizar la accesibilidad y el comportamiento correcto**, permitiendo al mismo tiempo que el usuario añada sus propios props.

## Escenario típico
En un `useSelect` o `useCombobox` personalizado, el usuario necesita esparcir `onClick`, `onKeyDown`, `aria-expanded`, `aria-haspopup`, etc. Si el hook devuelve un `getToggleButtonProps`, el usuario simplemente escribe:
```jsx
<button {...getToggleButtonProps()}>Abrir menú</button>
```
Y el hook se encarga de fusionar los manejadores de eventos internos con cualquier prop adicional que el usuario quiera pasar (ej. `className`, `onFocus`).

## Implementación
La función getter acepta un objeto opcional de `props` del usuario y las combina con las internas. La fusión debe ser inteligente: los handlers de eventos deben encadenarse (llamar al interno y al del usuario), y otros atributos como `className` pueden combinarse.

```jsx
function useButton({ onClick: userOnClick, ...userProps } = {}) {
  const [pressed, setPressed] = useState(false);

  // Handler interno
  const handleClick = () => setPressed(prev => !prev);

  // Prop getter
  const getButtonProps = (additionalProps = {}) => ({
    'aria-pressed': pressed,
    onClick: composeHandlers(handleClick, additionalProps.onClick, userOnClick),
    ...userProps,
    ...additionalProps,
    // fusionar className si se quiere
    className: [userProps.className, additionalProps.className].filter(Boolean).join(' '),
  });

  return { pressed, getButtonProps };
}

// Utilidad para encadenar múltiples event handlers
function composeHandlers(...fns) {
  return (event) => fns.forEach(fn => { if (fn) fn(event); });
}
```

**Uso del hook:**
```jsx
function ToggleButton() {
  const { getButtonProps } = useButton({ onClick: () => console.log('Clicked!') });
  return <button {...getButtonProps()}>Toggle</button>;
}
```

## Beneficios
- **Simplicidad para el consumidor**: un solo `getProps` en lugar de múltiples props manuales.
- **Accesibilidad asegurada**: el componente puede incluir roles y atributos aria sin que el usuario los olvide.
- **Encadenamiento de eventos**: varios manejadores coexisten sin sobrescribirse.
- **Estabilidad**: la función getter se puede memoizar con `useCallback` si sus dependencias cambian poco, evitando re-renders en hijos puros.

## Precauciones
- No memorices los getters si dependen de muchos valores que cambian a menudo; el costo de `useCallback` puede superar el beneficio.
- La fusión de `className` y `style` debe ser explícita y documentada.
- Si el usuario esparce sus props después del getter, podría sobrescribir los internos. Para evitarlo, la convención es que los props del usuario pasen como argumento al getter y que este los coloque en el orden adecuado (normalmente al final, para que los del usuario tengan prioridad, o viceversa según el diseño). Un buen diseño permite que el usuario sobrescriba los manejadores de eventos si realmente lo necesita.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ State Reducer Pattern](02-state-reducer-pattern.md) | [🏠 Inicio](../index.md) | [Render Props vs. Higher-Order Components (HOC) ▶](04-render-props-vs-higher-order-components-hoc.md) |
