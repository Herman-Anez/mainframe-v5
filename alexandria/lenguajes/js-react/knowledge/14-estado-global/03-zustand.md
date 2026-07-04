# Zustand

Zustand es una librería de estado **minimalista, sin boilerplate y basada en hooks**. No requiere Provider, ni acciones tipificadas, ni reducers. Su API se reduce a crear un store con `create` y consumirlo con hooks.

## Concepto central
Un store es un hook (en realidad, un objeto con un hook interno). Se define con una función que recibe `set` y `get`. `set` fusiona el estado (mutación superficial) y dispara re-renders solo en los componentes que usan ese store.

```jsx
import { create } from 'zustand';

const useStore = create((set) => ({
  contador: 0,
  incrementar: () => set((state) => ({ contador: state.contador + 1 })),
  resetear: () => set({ contador: 0 }),
}));

function Contador() {
  const contador = useStore((state) => state.contador);
  const incrementar = useStore((state) => state.incrementar);
  return <button onClick={incrementar}>{contador}</button>;
}
```

## Sin Provider
El store se crea fuera de React; cualquier componente puede importarlo y consumirlo directamente. Esto elimina el *wrapper hell* y simplifica las pruebas (puedes resetear el store entre tests).

## Selectores y control de re-renderizados
Por defecto, `useStore` devuelve todo el estado, pero casi siempre se usa con un **selector**: una función que extrae solo lo necesario. Zustand compara el resultado anterior y el nuevo con `Object.is` por defecto, y si son iguales, **no re-renderiza** el componente. Se puede pasar una función de igualdad personalizada como segundo argumento.

```jsx
const contador = useStore(state => state.contador); // solo se re-renderiza si cambia contador
```

## Acciones y estado mutables
En Zustand, el estado no necesita ser inmutable manualmente. `set` fusiona parcialmente (shallow merge). Dentro de `set`, puedes modificar el estado directamente (aunque realmente crea un nuevo objeto). También existe middleware `immer` para mutaciones más complejas.

## Middleware
Zustand soporta middlewares: `persist` (para localStorage), `devtools` (conexión con Redux DevTools), `immer`, `subscribeWithSelector`, etc. Se aplican envolviendo la función del store.

```jsx
import { persist } from 'zustand/middleware';

const useStore = create(persist((set) => ({ ... }), { name: 'mi-store' }));
```

## Estado asíncrono
Las acciones son funciones cualesquiera; pueden ser asíncronas simplemente haciendo `async` y llamando a `set` en el momento adecuado.

```jsx
const useStore = create((set) => ({
  data: null,
  cargar: async (id) => {
    const res = await fetch(`/api/item/${id}`);
    const data = await res.json();
    set({ data });
  },
}));
```

## Ventajas sobre Redux Toolkit
- **API mínima**: no hay slices, reducers, ni acciones separadas.
- **Sin Provider**: menos boilerplate en la raíz.
- **Selectores automáticos**: no requiere `useSelector`; el mismo hook con selector basta.
- **Código más colocado**: la lógica está encapsulada en el store.
- **Bundle pequeño** (~1 KB).

## Comparación y cuándo usarlo
Zustand es ideal para equipos que quieren simplicidad y rendimiento sin la estructura rígida de Redux. Es excelente para aplicaciones de cualquier tamaño porque el rendimiento se obtiene con selectores. Si necesitas DevTools avanzadas y un ecosistema de middleware masivo, Redux sigue siendo fuerte; para todo lo demás, Zustand es una opción moderna y muy productiva.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Redux Toolkit (RTK)](02-redux-toolkit-rtk.md) | [🏠 Inicio](../index.md) | [Jotai y Recoil (Estado atómico) ▶](04-jotai-y-recoil-estado-atomico.md) |
