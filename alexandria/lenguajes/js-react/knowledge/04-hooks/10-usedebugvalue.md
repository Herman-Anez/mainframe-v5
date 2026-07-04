# `useDebugValue`

## Depuración de hooks personalizados
`useDebugValue` permite mostrar una etiqueta para un hook personalizado en las herramientas de desarrollo de React (React DevTools). No tiene impacto en producción; es puramente para desarrollo.

```jsx
function useOnlineStatus() {
  const online = /* ... */;
  useDebugValue(online ? '🟢 Online' : '🔴 Offline');
  return online;
}
```

En DevTools, al inspeccionar un componente que use este hook, verás el valor junto al nombre del hook.

## Formateo diferido (lazy)
Si calcular el valor de depuración es costoso, puedes pasar una función como segundo argumento. Esta función solo se ejecuta cuando las DevTools están abiertas e inspeccionando el hook.

```jsx
useDebugValue(fetchStatus, status => {
  return status === 'loading' ? 'Cargando...' : `Estado: ${status}`;
});
```
Así evitas trabajo extra cuando no se está depurando.

## ¿Cuándo usarlo?
- Cuando construyes hooks reutilizables para una librería o equipo, y quieres que los consumidores tengan visibilidad del estado interno.
- Para hacer más amigable la inspección de hooks complejos.

En aplicaciones no compartidas, su utilidad es marginal pero puede ser una buena práctica en hooks con lógica de estado intrincada.

## No es para estado de producción
No uses `useDebugValue` para pasar información entre componentes o para lógica de negocio. Es solo una ayuda visual que desaparece en producción.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ `useId`](09-useid.md) | [🏠 Inicio](../index.md) | [Custom Hooks (Hooks personalizados) ▶](11-custom-hooks-hooks-personalizados.md) |
