# Profiler

El componente `<Profiler>` de React permite medir el **rendimiento de renderizado** de un subárbol de componentes de forma programática. Es la herramienta nativa para identificar cuellos de botella sin depender solo de las DevTools.

## API básica
```jsx
import { Profiler } from 'react';

function onRenderCallback(
  id,                // ID del Profiler
  phase,             // "mount" o "update"
  actualDuration,    // tiempo real del render (commit + layout effects)
  baseDuration,      // tiempo estimado sin memoización (render puro)
  startTime,         // cuando comenzó el render
  commitTime,        // cuando se aplicó el commit
  interactions       // conjunto de interacciones rastreadas
) {
  console.log(`${id} (${phase}): ${actualDuration}ms`);
}

function App() {
  return (
    <Profiler id="Navigation" onRender={onRenderCallback}>
      <Nav />
    </Profiler>
  );
}
```

## Parámetros del callback
- **`id`**: identifica el Profiler, útil cuando hay varios.
- **`phase`**: `"mount"` para el montaje inicial; `"update"` para re-renderizados.
- **`actualDuration`**: tiempo total que React dedicó al renderizado y commit de este subárbol, incluyendo sus hijos. Refleja el costo real en el usuario.
- **`baseDuration`**: duración estimada si ningún componente del subárbol estuviera memoizado. Sirve para comparar el beneficio potencial de optimizaciones.
- **`startTime` / `commitTime`**: marcas de tiempo para situar la medición en el tiempo global.
- **`interactions`**: permite rastrear qué interacciones del usuario (con el rastreador experimental) causaron el render.

## Usos prácticos
- Envolver secciones clave (listas largas, dashboards) y registrar métricas en producción para detectar degradaciones.
- Comparar `actualDuration` con `baseDuration`: si `baseDuration` es mucho mayor, hay margen para memoizar componentes.
- Integrar con servicios de monitoreo (Datadog, Sentry) para capturar regresiones de rendimiento.

## React DevTools Profiler
Además del componente, las DevTools ofrecen un Profiler visual que graba sesiones y muestra flame graphs de cada render, con el tiempo de cada componente. Esto es invaluable en desarrollo. El componente `Profiler` es la contraparte programática para producción o pruebas automatizadas.

## Consideraciones
- Añadir muchos `Profiler` añade un pequeño overhead; en producción úsalos con moderación, quizá solo en puntos críticos y activados por muestreo.
- Los tiempos incluyen los efectos de layout (`useLayoutEffect`) pero no `useEffect`.
- En modo estricto, los tiempos pueden duplicarse porque React ejecuta dos veces algunas fases; en producción no ocurre.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ `React.lazy` y `Suspense`](03-reactlazy-y-suspense.md) | [🏠 Inicio](../index.md) | [Windowing (Virtualización) ▶](05-windowing-virtualizacion.md) |
