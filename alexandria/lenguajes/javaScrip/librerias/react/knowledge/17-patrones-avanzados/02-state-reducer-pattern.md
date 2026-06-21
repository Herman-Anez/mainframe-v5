# State Reducer Pattern

Este patrón permite al usuario de un componente **redefinir cómo se gestionan las transiciones de estado internas**, sin necesidad de reimplementar toda la lógica. Se basa en el hook `useReducer` y en una función "reducer" personalizable.

## Motivación
Imagina un `Autocomplete` con teclado. El estado interno incluye `isOpen`, `highlightedIndex`, `inputValue`. Si el usuario quiere evitar que se abra el menú cuando el input está vacío, o quiere que al presionar Escape se limpie el input en lugar de solo cerrar, tendría que modificar el componente desde fuera. El state reducer permite interceptar cada cambio de estado y decidir si aceptarlo, modificarlo o rechazarlo.

## Implementación
1. El componente define un reducer interno por defecto.
2. Acepta un prop `stateReducer` (opcional).
3. En lugar de llamar a `dispatch` directamente, crea una función `internalDispatch` que:
   - Aplica el reducer por defecto.
   - Si existe `stateReducer`, le pasa el estado anterior, la acción y el nuevo estado (o el estado propuesto) y toma la decisión final.
4. El estado final es el que devuelva el `stateReducer` del usuario (o el por defecto si no existe).

**Ejemplo simplificado de un `Toggle` con patrón state reducer:**
```jsx
// Reducer por defecto
const toggleReducer = (state, action) => {
  switch (action.type) {
    case 'TOGGLE':
      return { on: !state.on };
    case 'RESET':
      return { on: false };
    default:
      return state;
  }
};

function useToggle({ initialOn = false, stateReducer = (s, a) => a.changes } = {}) {
  const [state, dispatch] = useReducer((prevState, action) => {
    const changes = toggleReducer(prevState, action);
    // Llamamos al stateReducer del usuario con: estado anterior, acción, cambios propuestos
    const reducedChanges = stateReducer(prevState, action, changes);
    return reducedChanges;
  }, { on: initialOn });

  const toggle = () => dispatch({ type: 'TOGGLE' });
  const reset = () => dispatch({ type: 'RESET' });
  return { on: state.on, toggle, reset };
}
```

Ahora, un usuario puede prohibir el toggle si se cumple alguna condición:
```jsx
const { on, toggle } = useToggle({
  stateReducer: (prevState, action, changes) => {
    // Previene apagar si está encendido (raro, solo ejemplo)
    if (action.type === 'TOGGLE' && prevState.on) {
      return prevState; // rechaza el cambio
    }
    return changes; // acepta cambios por defecto
  }
});
```

## ¿Por qué es tan poderoso?
- **Control total sin romper encapsulamiento**: el usuario puede modificar el comportamiento de un componente sin tener que reescribir toda su lógica.
- **Composibilidad**: se pueden encadenar reducers con librerías como `composeReducers`.
- **Base de librerías como downshift**: el popular autocomplete de Kent C. Dodds basa su flexibilidad en este patrón.

## Consideraciones
- **El API puede intimidar** si se expone sin necesidad. Se recomienda proveer el `stateReducer` solo para componentes genéricos o muy reutilizables.
- **Mantener la acción y el estado bien tipados** (con TypeScript) es clave para que el usuario sepa qué propiedades puede modificar.
- **Combinar con `useImperativeHandle`** si se necesita exponer acciones imperativas.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Compound Components (Componentes Compuestos)](01-compound-components-componentes-compuestos.md) | [🏠 Inicio](../index.md) | [Prop Getters ▶](03-prop-getters.md) |
