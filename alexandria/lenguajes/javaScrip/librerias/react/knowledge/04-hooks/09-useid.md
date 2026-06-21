# `useId`

## Propósito
`useId` es un hook para generar identificadores únicos, estables entre renderizados del servidor y del cliente, pensados para atributos de accesibilidad (`aria-labelledby`, `id` y `for` en etiquetas). Se introdujo en React 18 para resolver problemas de hidratación con IDs generados aleatoriamente.

## Por qué no `Math.random()` o un contador
En aplicaciones con SSR, los IDs deben coincidir exactamente entre el HTML generado en el servidor y el que el cliente hidrata. Si generas IDs aleatorios o basados en un contador incremental que no es determinista entre servidor y cliente, obtendrás errores de hidratación. `useId` produce un ID único basado en la "ruta" del componente en el árbol, garantizando que sea el mismo en ambos entornos.

## Uso básico
```jsx
function PasswordField() {
  const id = useId();
  return (
    <>
      <label htmlFor={id}>Contraseña:</label>
      <input id={id} type="password" />
    </>
  );
}
```

El ID generado tiene un formato como `:r0:` y puede incluir un sufijo si se usa la misma instancia de `useId` en múltiples lugares (React le añade automáticamente algo para desambiguar). No es recomendable inspeccionar su formato porque podría cambiar.

## Múltiples IDs en un componente
Para crear varios IDs, puedes derivarlos del ID base:
```jsx
const id = useId();
const nameId = `${id}-name`;
const emailId = `${id}-email`;
```
O bien, llamar a `useId` múltiples veces (cada llamada devuelve un ID distinto y estable). La segunda forma es más segura porque no depende de la implementación manual de sufijos.

## `useId` y listas
En listas de elementos que necesitan IDs, **no debes usar `useId` en cada iteración** porque violaría las reglas de los hooks (llamada en bucle). En su lugar, genera un ID base en el padre y concatena un identificador propio del ítem (ej. su `key`):
```jsx
function List({ items }) {
  const baseId = useId();
  return items.map(item => (
    <label key={item.id} htmlFor={`${baseId}-${item.id}`}>...</label>
  ));
}
```

## Nota sobre `useId` y `aria-labelledby`
Puedes usarlo para asociar múltiples elementos con el mismo `id` en `aria-labelledby`:
```jsx
const labelId = useId();
const errorId = useId();
<input aria-labelledby={`${labelId} ${errorId}`} />
```
Esto garantiza IDs únicos y estables.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ `forwardRef` y `useImperativeHandle`](08-forwardref-y-useimperativehandle.md) | [🏠 Inicio](../index.md) | [`useDebugValue` ▶](10-usedebugvalue.md) |
