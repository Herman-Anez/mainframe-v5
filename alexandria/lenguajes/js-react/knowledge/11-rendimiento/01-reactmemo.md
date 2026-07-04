# `React.memo`

`React.memo` es un **Higher-Order Component** (HOC) que envuelve un componente funcional y le añade una optimización: **solo se re-renderiza si sus props cambian**, según una comparación superficial (`Object.is` en cada prop). Es el equivalente funcional de `React.PureComponent` para clases.

## Comportamiento por defecto
Sin `React.memo`, un componente se re-renderiza cada vez que su padre se renderiza, aunque sus props no hayan cambiado. Con `React.memo`, React compara las props anteriores y las nuevas; si ninguna ha variado, omite el renderizado del componente y reutiliza el resultado anterior.

```jsx
const ListaItems = React.memo(({ items }) => {
  return items.map(item => <Item key={item.id} {...item} />);
});
```

## Comparación personalizada
`React.memo` acepta un segundo argumento: una función `(prevProps, nextProps) => boolean` que debe devolver `true` si las props son iguales (y por tanto **no** se debe re-renderizar). Esto permite lógica de comparación profunda o criterios específicos.

```jsx
const Usuario = React.memo(
  ({ usuario }) => <div>{usuario.nombre}</div>,
  (prev, next) => prev.usuario.id === next.usuario.id
);
```

**Precaución:** esta función invierte la semántica típica (`true` = no renderizar). Es fácil equivocarse. Úsala solo cuando realmente necesites comparar algo que la superficial no cubre, y asegúrate de que la lógica sea correcta.

## `React.memo` y hooks
La memoización del componente no afecta a los hooks internos: si el componente se re-renderiza (porque las props cambiaron), los hooks se ejecutan normalmente. Si no se re-renderiza, los hooks no se vuelven a ejecutar, conservando el estado previo.

## Cuándo usarlo
- Componentes que reciben las mismas props con frecuencia (ej. un `Item` dentro de una lista donde solo unos pocos cambian).
- Componentes con renders costosos (cálculos, subárboles grandes) que no deberían repetirse sin cambios en sus entradas.
- Cuando las props son objetos o funciones que se recrean en el padre; en este caso, `React.memo` por sí solo no evitará el render a menos que esas props estén estabilizadas con `useMemo`/`useCallback`.

## Cuándo NO usarlo
- Si el componente siempre recibe props nuevas, `React.memo` añade la comparación (overhead) sin beneficio.
- Como "escudo" universal: la mejor optimización es levantar el estado o dividir componentes para que las props inmutables no se propaguen innecesariamente.
- Sin medir primero: `React.memo` consume memoria y tiempo de comparación. Perfila con React Profiler o las Chrome DevTools antes de aplicarlo masivamente.

## `React.memo` con `children`
Un componente envuelto en `React.memo` que recibe `children` se re-renderizará si el padre le pasa un nuevo árbol `children`. Como `children` es una prop, si el padre recrea el JSX en cada render, la memoización no servirá. La solución es componer para que el hijo memoizado no reciba `children` cambiantes, o memorizar el `children` en el padre con `useMemo`.

## Interacción con `useState` y `useContext`
- `useState`: si el estado interno cambia, el componente se re-renderiza aunque las props no hayan variado.
- `useContext`: `React.memo` **no evita** el re-render cuando un contexto consumido cambia. La suscripción al contexto es independiente de la memoización de props. Para mitigarlo, divide el contexto o usa selectores.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Fragmentos](../10-portales-y-fragments/02-fragmentos.md) | [🏠 Inicio](../index.md) | [`useMemo` y `useCallback`: optimizaciones ▶](02-usememo-y-usecallback-optimizaciones.md) |
