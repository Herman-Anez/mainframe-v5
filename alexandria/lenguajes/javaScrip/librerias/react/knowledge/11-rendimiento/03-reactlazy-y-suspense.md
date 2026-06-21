# `React.lazy` y `Suspense`

Estas APIs permiten la **carga diferida de componentes** (code splitting) y la **declaración de estados de carga** de forma declarativa.

## `React.lazy`
Permite definir un componente que se cargará dinámicamente cuando sea renderizado por primera vez. Acepta una función que devuelve un `import()` dinámico, el cual debe resolverse a un módulo con un export `default` del componente.

```jsx
const Graficos = React.lazy(() => import('./Graficos'));
```

`React.lazy` devuelve un componente especial que, al ser renderizado, lanza una promesa. Mientras la promesa no se resuelva, React "suspende" ese subárbol.

## `Suspense`
Es el componente que captura la suspensión de un subárbol y muestra un fallback (UI de carga) hasta que el componente lazy esté listo.

```jsx
import { Suspense } from 'react';

function App() {
  return (
    <Suspense fallback={<div>Cargando gráficos...</div>}>
      <Graficos />
    </Suspense>
  );
}
```

Puedes anidar múltiples `Suspense` para granularidad; React mostrará el fallback más cercano que aún no se ha resuelto. También puedes tener un `Suspense` común para varias rutas o secciones.

## Code splitting basado en rutas
El uso más común de `lazy` + `Suspense` es con el enrutador:

```jsx
const Inicio = React.lazy(() => import('./Inicio'));
const Perfil = React.lazy(() => import('./Perfil'));

function App() {
  return (
    <Suspense fallback={<BarraCarga />}>
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/perfil" element={<Perfil />} />
      </Routes>
    </Suspense>
  );
}
```

Así, los usuarios descargan solo el código necesario para la ruta actual.

## Manejo de errores con Error Boundaries
Si la carga falla (ej. red caída), el `Suspense` no captura el error. Debes combinarlo con un **Error Boundary** (componente de clase con `componentDidCatch` o `getDerivedStateFromError`) que envuelva el `Suspense` para mostrar un mensaje de error y, opcionalmente, reintentar.

```jsx
<ErrorBoundary fallback={<p>Error al cargar</p>}>
  <Suspense fallback={<Spinner />}>
    <Graficos />
  </Suspense>
</ErrorBoundary>
```

## Suspense para datos (Data Fetching)
A partir de React 18 y con librerías como React Query, el mismo mecanismo de Suspense se puede usar para peticiones de datos. Un componente puede "suspender" mientras espera datos, mostrando el fallback. Esto unifica el estado de carga para código y datos.

## Transiciones con `startTransition`
En React 18, puedes marcar una actualización que cause una suspensión como una transición, para que React no oculte el contenido ya visible (mantiene el fallback anterior hasta que el nuevo esté listo, o muestra un fallback después de un retraso). Esto se logra con `useTransition` o `startTransition`.

```jsx
const [isPending, startTransition] = useTransition();
const handleTabChange = (tab) => {
  startTransition(() => { setTab(tab); });
};
```

Mientras la nueva pestaña carga (si su componente es lazy o suspende), `isPending` será `true` y puedes mostrar un indicador sutil sin caer en un fallback brusco.

## Buenas prácticas
- Coloca los `Suspense` en puntos estratégicos, no envuelvas toda la aplicación en uno solo.
- Los fallbacks deben ser ligeros y preferiblemente instantáneos (un esqueleto o spinner).
- Agrupa componentes relacionados en el mismo `lazy` si se cargan juntos.
- Verifica que tu build (Webpack, Vite) soporte importación dinámica correctamente; los bundles se generarán automáticamente.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ `useMemo` y `useCallback`: optimizaciones](02-usememo-y-usecallback-optimizaciones.md) | [🏠 Inicio](../index.md) | [Profiler ▶](04-profiler.md) |
