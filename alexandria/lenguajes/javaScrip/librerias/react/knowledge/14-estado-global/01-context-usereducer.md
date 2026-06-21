# Context + `useReducer`

Combinar la API de Contexto con el hook `useReducer` es la forma más directa de crear un **store global sin dependencias externas**. Es la evolución natural de `useState` + Context para lógica de estado compleja.

## Arquitectura del patrón
Se basa en tres pilares:
1. **Un reducer**: función pura `(state, action) => newState`.
2. **Un Provider**: componente que inicializa el estado con `useReducer` y expone el estado y la función `dispatch` mediante Contexto.
3. **Hooks de acceso**: `useSelector` (simulado) y `useDispatch` a través de `useContext`.

```jsx
// store.js
import { createContext, useContext, useReducer } from 'react';

const EstadoContext = createContext();
const DispatchContext = createContext();

function reducer(state, action) {
  switch (action.type) {
    case 'INCREMENTAR':
      return { ...state, contador: state.contador + 1 };
    case 'SET_USUARIO':
      return { ...state, usuario: action.payload };
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, { contador: 0, usuario: null });
  return (
    <EstadoContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        {children}
      </DispatchContext.Provider>
    </EstadoContext.Provider>
  );
}

export function useAppState() {
  return useContext(EstadoContext);
}

export function useAppDispatch() {
  return useContext(DispatchContext);
}
```

## Ventaja clave: separación de estado y dispatch
Al usar dos contextos separados, los componentes que solo despachan acciones **no se re-renderizan** cuando el estado cambia, porque `dispatch` es estable (su referencia no cambia). Solo los consumidores del estado se actualizan.

## Limitaciones importantes
- **Falta de selectores granulares**: cualquier cambio en el estado provoca el re-render de **todos** los componentes que consumen `EstadoContext`. En un store grande, esto puede ser catastrófico para el rendimiento.
  - *Solución parcial*: partir el estado en múltiples contextos más pequeños (ej. `UsuarioContext`, `ProductosContext`).
  - *Solución manual*: pasar solo la parte necesaria mediante `useMemo` en el componente, pero el componente aún se re-renderiza; solo evita renders en hijos si se les pasan props memoizadas.
- **Lógica asíncrona**: `useReducer` es síncrono. Para operaciones asíncronas (peticiones), necesitas **middleware casero** con `useEffect` en el Provider o un patrón de thunks manual, lo que puede volverse engorroso.
- **Sin herramientas de desarrollo avanzadas**: no hay time-travel debugging ni inspección de acciones como en Redux DevTools (aunque se puede integrar manualmente).

## Cuándo usarlo
- Aplicaciones pequeñas o medianas con estado global poco volátil (temas, usuario autenticado, preferencias).
- Cuando quieres evitar dependencias externas.
- Como paso intermedio antes de migrar a una solución más robusta si el rendimiento se resiente.

## Extensión con selectores (useReducer + useMemo)
Para mitigar el renderizado masivo, se puede crear un hook `useSelector` que compare una porción del estado con una función de igualdad, pero requiere que el estado sea inmutable y la comparación sea eficiente.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Rutas protegidas y layouts](../13-enrutamiento/02-rutas-protegidas-y-layouts.md) | [🏠 Inicio](../index.md) | [Redux Toolkit (RTK) ▶](02-redux-toolkit-rtk.md) |
