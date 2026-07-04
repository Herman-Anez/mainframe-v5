# Redux Toolkit (RTK)

Redux Toolkit es la forma moderna y oficial de usar Redux. Elimina gran parte del boilerplate que caracterizaba a Redux clásico y añade herramientas para manejar datos asíncronos (RTK Query) de forma integrada.

## Principios y estructura
- **Store único**: un árbol de estado centralizado.
- **Slices**: cada "pieza" del estado se define con `createSlice`, que genera automáticamente los **action creators** y los **reducers** usando Immer para mutaciones "inmutables".
- **`configureStore`**: configura el store con middlewares (redux-thunk incluido por defecto, DevTools habilitado).
- **Selectores**: funciones puras para extraer datos del estado; se usan con `useSelector`, que solo re-renderiza el componente si el valor seleccionado cambia (comparación por referencia estricta).

```jsx
// contadorSlice.js
import { createSlice } from '@reduxjs/toolkit';

const contadorSlice = createSlice({
  name: 'contador',
  initialState: { valor: 0 },
  reducers: {
    incrementar(state) {
      state.valor += 1; // "mutación" permitida por Immer
    },
    decrementar(state, action) {
      state.valor -= action.payload;
    },
  },
});

export const { incrementar, decrementar } = contadorSlice.actions;
export default contadorSlice.reducer;
```

## Thunks y lógica asíncrona con `createAsyncThunk`
Para peticiones a API, RTK ofrece `createAsyncThunk`, que despacha acciones `pending`, `fulfilled` y `rejected` automáticamente. Se manejan en el slice con `extraReducers`.

```jsx
export const fetchUsuarios = createAsyncThunk('usuarios/fetch', async () => {
  const response = await fetch('/api/usuarios');
  return response.json();
});

const usuariosSlice = createSlice({
  name: 'usuarios',
  initialState: { data: [], status: 'idle' },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsuarios.pending, (state) => { state.status = 'loading'; })
      .addCase(fetchUsuarios.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchUsuarios.rejected, (state) => { state.status = 'failed'; });
  },
});
```

## RTK Query: la capa de caché y fetching
RTK Query es una extensión incluida en Redux Toolkit que **elimina la necesidad de manejar manualmente el estado de carga** para datos de servidor. Define "endpoints" con `createApi`, y genera hooks automáticos (`useGetPostsQuery`, etc.) con cacheo, invalidación, polling, y optimizaciones.

```jsx
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  endpoints: (builder) => ({
    getPosts: builder.query({ query: () => '/posts' }),
    addPost: builder.mutation({ query: (body) => ({ url: '/posts', method: 'POST', body }) }),
  }),
});

export const { useGetPostsQuery, useAddPostMutation } = api;
```

- Cachea automáticamente y normaliza datos.
- Re-fetching por montaje, intervalo, o invalidación de tags.
- Mutaciones con seguimiento de estado y actualizaciones optimistas.

## Ventajas de Redux Toolkit
- **Ecosistema maduro**: Redux DevTools (viaje en el tiempo, inspección de acciones/estado).
- **Separación clara**: lógica de actualización en reducers, efectos secundarios en thunks o RTK Query.
- **Escalabilidad**: middleware, enhancers, y patrones establecidos.
- **Excelente con TypeScript**: tipado inferido de slices y selectores.

## Cuándo usarlo
- Aplicaciones grandes con múltiples equipos.
- Cuando necesitas un control muy preciso del flujo de acciones y el historial.
- Proyectos donde ya hay inversión en el ecosistema Redux.
- Si necesitas RTK Query para gestionar el estado del servidor de forma centralizada.

## Comparación con Context + useReducer
Redux Toolkit ofrece selectores granulares (evita re-renders masivos), DevTools, middleware, y RTK Query, a costa de un poco más de boilerplate conceptual (aunque mucho menos que Redux legacy). Para proyectos pequeños, Context + useReducer es suficiente; a medida que crece la complejidad, RTK brilla.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Context + `useReducer`](01-context-usereducer.md) | [🏠 Inicio](../index.md) | [Zustand ▶](03-zustand.md) |
