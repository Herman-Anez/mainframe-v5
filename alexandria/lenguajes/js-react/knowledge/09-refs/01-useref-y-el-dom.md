# `useRef` y el DOM

## El hook `useRef`
`useRef(initialValue)` devuelve un objeto mutable `{ current: initialValue }` que **persiste durante toda la vida del componente**. A diferencia de `useState`, modificar la propiedad `.current` **no provoca un nuevo renderizado**.

```jsx
import { useRef } from 'react';

function Componente() {
  const refContainer = useRef(null);
  // refContainer = { current: null }
}
```

## Acceso directo al DOM
El uso más común es obtener una referencia a un nodo del DOM. Se asigna mediante el atributo `ref` en cualquier elemento JSX. React establece `ref.current` al nodo DOM después del montaje y lo restablece a `null` al desmontar.

```jsx
function EnfocarInput() {
  const inputRef = useRef(null);

  const handleClick = () => {
    inputRef.current?.focus(); // acceso imperativo
  };

  return (
    <>
      <input ref={inputRef} type="text" />
      <button onClick={handleClick}>Enfocar</button>
    </>
  );
}
```

## Ciclo de vida de la referencia
1. En el primer render, `inputRef.current` es `null`.
2. Tras el montaje (commit phase), React asigna el nodo DOM real a `current`.
3. Si el input se desmonta (por renderizado condicional), React restablece `current` a `null`.
4. En renderizados posteriores, la misma referencia se mantiene (el objeto no se recrea).

## No leer ni escribir `ref.current` durante el render
React espera que el componente sea una función pura respecto a sus props y estado. Leer o modificar una ref durante el cuerpo del componente (fuera de `useEffect` o manejadores) puede producir comportamientos impredecibles. Los lugares correctos son:
- **Manejadores de eventos** (onClick, onChange...).
- **`useEffect` o `useLayoutEffect`** (después de que el DOM esté listo).

**Mal ejemplo:**
```jsx
function Componente() {
  const ref = useRef(null);
  ref.current?.focus(); // ❌ Podría ejecutarse antes de que el nodo exista o en cada render.
  return <input ref={ref} />;
}
```

## Referencia a componentes de clase
En componentes de clase, un `ref` apunta a la instancia de la clase, lo que permite llamar a sus métodos. Con la migración a funciones y hooks, esto ha sido reemplazado por `forwardRef` y `useImperativeHandle` para exponer una API imperativa.

## Comparación con `createRef` (en clases)
En clases se usa `React.createRef()` y se asigna a una propiedad de instancia. `useRef` es el equivalente en funciones, pero con la ventaja de que la referencia no se recrea en cada render (a menos que se use `createRef` dentro de la función, lo cual sería un error).

## Resumen: ¿cuándo usar `useRef` para el DOM?
- Enfocar, seleccionar texto, reproducir/pausar medios.
- Animar manualmente con librerías como GSAP.
- Medir dimensiones (`getBoundingClientRect`) para tooltips, overlays.
- Forzar scroll a un elemento.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Composición vs. Contexto](../08-contexto/03-composicion-vs-contexto.md) | [🏠 Inicio](../index.md) | [`forwardRef` ▶](02-forwardref.md) |
