# Renderizado condicional

El renderizado condicional permite que un componente devuelva diferentes elementos JSX en función de las props, el estado u otras variables.

## Técnicas básicas
1. **Operador ternario**:
   ```jsx
   {logueado ? <Dashboard /> : <Login />}
   ```

2. **Operador lógico AND (`&&`)**:
   ```jsx
   {notificaciones.length > 0 && <ListaNotificaciones />}
   ```
   Precaución: si la expresión izquierda es `0`, React renderizará `0` en la interfaz (porque evalúa `0` como falsy pero no es `null` ni `undefined`). Solución: convertir a booleano `{notificaciones.length > 0 && ...}` o `{!!notificaciones.length && ...}`.

3. **`if` externo al JSX** (asignación de variables):
   ```jsx
   let contenido;
   if (error) {
     contenido = <Error />;
   } else if (cargando) {
     contenido = <Spinner />;
   } else {
     contenido = <Contenido />;
   }
   return <div>{contenido}</div>;
   ```

4. **Enlineado con ternario anidado o funciones** (menos legible, mejor extraer lógica).

## Evitar el desmontaje/montaje involuntario
Recuerda la heurística de tipos. Si cambias entre dos componentes de distinto tipo en la misma posición del árbol, React desmontará uno y montará el otro, perdiendo el estado local. Para preservar el estado entre transiciones, mantén el mismo tipo de componente y controla su visibilidad con props o con la misma referencia al componente.

```jsx
// ❌ Perderá estado si `activo` cambia
{activo ? <VistaA /> : <VistaB />}

// ✅ Mantiene el componente pero oculta/muestra
<Vista activa={activo} />
// o con CSS: style={{ display: activo ? 'block' : 'none' }}
```

## `null`, `undefined`, `false` y `true`
- `null`, `undefined`, `false`, `true` no producen salida en el DOM (son ignorados).
- Útil para retornos condicionales: `if (!data) return null;`
- Cuidado con `0` y `NaN`, que sí se renderizan como texto. Convierte a booleano explícitamente.

## Renderizado condicional y rendimiento
- Los componentes que no se renderizan (retornan `null`) no contribuyen al Virtual DOM, pero React aún ejecuta la función de componente (a menos que uses `React.memo` o que el padre no re-renderice esa rama).
- `React.lazy` y `Suspense` permiten diferir la carga de componentes condicionales.

## Patrones avanzados
- **Render props condicionales**: pasar funciones que el hijo invoca para decidir qué mostrar.
- **Componente `Switch`/`Match`** (patrón similar a rutas): un componente que evalúa condiciones y renderiza el primer hijo que cumple.
- **State machines con `useReducer`**: modelas los estados posibles (loading, error, success) y el JSX refleja directamente el estado actual.

## Consideraciones con el tipo de dato
React renderiza strings y números directamente como nodos de texto. Los arrays se aplanan y renderizan uno tras otro (deben tener keys si son dinámicos). Los objetos no son válidos como hijos de React (causan error). Así que cuidado con `{objeto}` accidental.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Keys y listas](03-keys-y-listas.md) | [🏠 Inicio](../index.md) | [Fases: Render y Commit ▶](05-fases-render-y-commit.md) |
