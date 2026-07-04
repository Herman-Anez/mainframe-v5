# Ciclo de vida con hooks

En componentes funcionales no existen métodos de ciclo de vida explícitos; en su lugar, el hook `useEffect` (y sus variantes) permite sincronizar con sistemas externos. El modelo mental es: **sincronización reactiva**.

## El principio de sincronización
Un componente funcional se ejecuta por completo en cada render. Los hooks permiten "engancharse" a ese flujo y ejecutar efectos después de que React haya reflejado los cambios en el DOM. En lugar de pensar en montar/actualizar/desmontar, piensas en **lo que debe ocurrir cuando ciertos valores cambian**.

## `useEffect` como reemplazo de múltiples métodos
```jsx
useEffect(() => {
  // Código que se ejecuta después de cada render (montaje + actualizaciones)
  console.log('Efecto ejecutado');

  // Opcional: función de limpieza (se ejecuta antes de desmontar o antes de re-ejecutar)
  return () => {
    console.log('Limpieza');
  };
}, [dependencias]); // array de dependencias
```

**Equivalencia con clases** (simplificada):
- Sin dependencias (`useEffect(fn)`): se ejecuta tras cada render → `componentDidMount` + `componentDidUpdate`.
- Con `[]`: solo se ejecuta tras el montaje y la limpieza al desmontar → `componentDidMount` + `componentWillUnmount`.
- Con `[dep1, dep2]`: se ejecuta tras el montaje y cuando alguna dependencia cambia desde el último render. La limpieza corre antes de cada re-ejecución y al desmontar.

**Ejemplo de suscripción a API:**
```jsx
useEffect(() => {
  const socket = connectToChat(roomId);
  socket.on('message', handleMessage);
  return () => {
    socket.off('message', handleMessage);
    socket.disconnect();
  };
}, [roomId]); // se re-conecta si roomId cambia
```

## `useLayoutEffect`
Tiene la misma firma pero se ejecuta **sincrónicamente después de todas las mutaciones del DOM, pero antes de que el navegador pinte**. Es útil para leer medidas del DOM y realizar ajustes que deben ser imperceptibles (sin parpadeo). Se asemeja a `componentDidMount` + `componentDidUpdate` pero con garantía de que el DOM está listo antes del pintado. Casi siempre `useEffect` es la opción correcta; recurre a `useLayoutEffect` si notas un flash de contenido incorrecto.

## Ciclo de vida "visual" con hooks
1. **Montaje**: Se ejecuta el cuerpo del componente, se renderiza el DOM, luego `useEffect` (con `[]` o deps) se ejecuta.
2. **Actualización**: El componente se re-ejecuta por cambio de estado/props. React compara la salida y actualiza el DOM. Después, se ejecutan las limpiezas de efectos anteriores (si las dependencias cambiaron) y luego los nuevos efectos.
3. **Desmontaje**: Se ejecutan las funciones de limpieza de todos los efectos que aún estén activos.

## Reemplazo de `shouldComponentUpdate`
Los componentes funcionales envueltos en `React.memo` hacen una comparación superficial de props. Además, `useMemo` y `useCallback` evitan recalcular valores o recrear funciones, lo que ayuda a que `memo` sea efectivo.

## Uso de múltiples efectos
A diferencia de las clases, donde agrupas toda la lógica en un mismo método, puedes tener varios `useEffect` separados por funcionalidad, lo que hace el código más mantenible.

## Nota sobre el modo estricto (StrictMode)
En desarrollo, React 18 ejecuta los efectos dos veces (montaje, limpieza, montaje) para ayudar a detectar lógica no idempotente. No ocurre en producción.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Ciclo de vida en componentes de clase](02-ciclo-de-vida-en-componentes-de-clase.md) | [🏠 Inicio](../index.md) | [`useEffect` y `useLayoutEffect` en profundidad ▶](04-useeffect-y-uselayouteffect-en-profundidad.md) |
