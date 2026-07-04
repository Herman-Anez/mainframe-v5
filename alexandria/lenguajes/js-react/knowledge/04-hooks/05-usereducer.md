# `useReducer`

`useReducer` es una alternativa a `useState` para lógica de estado compleja. Está inspirado en Redux: un **reducer** recibe el estado actual y una acción, y devuelve el nuevo estado.

## Anatomía
```jsx
const [state, dispatch] = useReducer(reducer, initialState, init?);
```

- `reducer: (state, action) => newState`.
- `initialState`: estado inicial o argumento para `init`.
- `init` (opcional): función que recibe `initialState` y devuelve el estado inicial (lazy initialization).
- `dispatch`: función estable que recibe una acción y la pasa al reducer.

## Cuándo usarlo
- El estado es un objeto o arreglo complejo con múltiples subvalores que cambian juntos.
- Las transiciones de estado dependen de acciones bien definidas (como en una máquina de estados).
- Muchas actualizaciones de estado dependen del valor anterior y quieres centralizar la lógica.
- Mejora la legibilidad cuando `useState` requeriría múltiples setters o lógica dispersa.

Ejemplo:
```jsx
const initialState = { loading: false, data: null, error: null };

function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_START': return { ...state, loading: true, error: null };
    case 'FETCH_SUCCESS': return { loading: false, data: action.payload };
    case 'FETCH_ERROR': return { loading: false, error: action.payload };
    default: return state;
  }
}

function DataFetcher() {
  const [state, dispatch] = useReducer(reducer, initialState);
  // ...
}
```

## Lazy initialization
Puedes pasar una tercera función para calcular el estado inicial de forma perezosa:
```jsx
const [state, dispatch] = useReducer(reducer, initialArg, (arg) => {
  return { count: arg }; // cálculo costoso
});
```

## Dispatch estable y seguro
`dispatch` no cambia entre renders, por lo que puede ser pasado a hijos sin causar re-renderizados. Es común combinarlo con Context para un store global ligero.

## `useReducer` + Context = Redux casero
```
<StateContext.Provider value={state}>
  <DispatchContext.Provider value={dispatch}>
    {children}
  </DispatchContext.Provider>
</StateContext.Provider>
```
Cada componente consume el estado que necesita y usa `dispatch` para enviar acciones. Esta separación minimiza renders (solo los consumidores del estado que cambió se actualizan, pero requiere separar estado en contextos diferentes o utilizar selectores).

## Consideraciones de rendimiento
- El reducer debe ser puro: mismo input → mismo output, sin efectos secundarios.
- Acciones con frecuencia alta pueden generar muchos renders; en esos casos, `useState` o bibliotecas especializadas pueden ser más adecuadas.
- Con la llegada de `useTransition`, puedes marcar actualizaciones de estado como no urgentes para mantener la UI responsiva.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ `useRef` y el DOM](04-useref-y-el-dom.md) | [🏠 Inicio](../index.md) | [`useMemo` y `useCallback` ▶](06-usememo-y-usecallback.md) |
