# `useLayoutEffect`

## Timing y orden de ejecución
`useLayoutEffect` se ejecuta **sincrónicamente después de todas las mutaciones del DOM, pero antes de que el navegador pinte los píxeles en pantalla**. Es decir, se dispara en la misma fase de commit que `componentDidMount` y `componentDidUpdate` en las clases. Bloquea el pintado, por lo que el usuario no verá el estado intermedio.

```
Render → React aplica cambios al DOM → useLayoutEffect → (navegador pinta) → useEffect
```

## Cuándo usarlo
La regla práctica: **si tu efecto necesita leer medidas del DOM y luego modificar algo visualmente de forma sincrónica, `useLayoutEffect` es la herramienta correcta**. De lo contrario, `useEffect` es preferible porque no retrasa el pintado.

Ejemplos clásicos:
- Posicionar un tooltip, dropdown o popover basado en medidas de un elemento.
- Restaurar la posición del scroll después de una actualización.
- Animaciones que requieren el estado final del DOM antes de pintar.
- Sincronizar una librería de terceros que manipula el DOM inmediatamente.

```jsx
function Tooltip({ targetRef, children }) {
  const tooltipRef = useRef(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  useLayoutEffect(() => {
    if (!targetRef.current || !tooltipRef.current) return;
    const targetRect = targetRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    // Calcula posición sin parpadeo
    setPos({
      x: targetRect.left + targetRect.width / 2 - tooltipRect.width / 2,
      y: targetRect.bottom + 8
    });
  }, [targetRef]);

  return (
    <div ref={tooltipRef} style={{ position: 'fixed', left: pos.x, top: pos.y }}>
      {children}
    </div>
  );
}
```

Si usáramos `useEffect`, el tooltip aparecería primero en (0,0) o en la posición anterior, y luego saltaría a la correcta tras el pintado, provocando un destello.

## Precauciones
- **Es bloqueante**: si el código dentro es costoso, la interfaz se congelará. Por eso debe usarse solo cuando sea estrictamente necesario y con lógica ligera.
- **Server-side rendering (SSR)**: `useLayoutEffect` no se ejecuta en el servidor y mostrará un warning. Debes usar `useEffect` para código que pueda correr en el servidor, o aplicar guardias (`typeof window !== 'undefined'`).
- **No abusar**: el 99 % de los efectos se satisfacen con `useEffect`. Si encuentras que lo usas a menudo, replantea tu diseño; probablemente estás midiendo el DOM demasiado imperativamente. Mejor usa CSS cuando sea posible.

## Relación con el modo concurrente
En React 18 con renderizado concurrente, `useLayoutEffect` sigue ejecutándose sincrónicamente en la fase de commit. Si React interrumpe el render y luego lo completa, los `useLayoutEffect` se aplican en el commit final antes del pintado. Su naturaleza sincrónica asegura que las medidas del DOM sean consistentes.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ `useMemo` y `useCallback`](06-usememo-y-usecallback.md) | [🏠 Inicio](../index.md) | [`forwardRef` y `useImperativeHandle` ▶](08-forwardref-y-useimperativehandle.md) |
