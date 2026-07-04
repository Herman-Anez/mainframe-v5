# StrictMode

`<React.StrictMode>` es un componente envolvente que **activa verificaciones adicionales y advertencias** para sus hijos en modo desarrollo. No afecta al build de producción.

## ¿Qué hace?
Al envolver tu aplicación o parte de ella con `<StrictMode>`, React:
1. **Detecta prácticas inseguras y obsoletas**: como el uso de APIs legacy (`findDOMNode`, `UNSAFE_` lifecycle methods en clases, refs de string, etc.).
2. **Ejecuta dos veces ciertas funciones** para ayudar a identificar efectos secundarios no idempotentes (componentes funcionales, `useState`/`useReducer`/`useMemo`/`useEffect`).

## El doble renderizado (solo en desarrollo)
En StrictMode, durante el montaje de un componente funcional, React:
- Ejecuta la función del componente (render).
- Llama a `useEffect` (montaje).
- Inmediatamente después, ejecuta la limpieza del `useEffect`.
- Luego **vuelve a ejecutar** el render y el `useEffect` (montaje de nuevo).

Esto se hace para verificar que el componente y sus efectos se comporten correctamente si fueran montados, desmontados y vueltos a montar con el mismo estado. Así, se detectan fugas de memoria, suscripciones no limpiadas, peticiones fetch no canceladas, etc.

En React 18, también se aplica a **actualizaciones**: en StrictMode, el estado se actualiza dos veces (ej. un `setCount(c => c + 1)` dentro de un efecto puede resultar en `+2`). Esto te obliga a usar funciones puras y a no confiar en el número de invocaciones.

## APIs inseguras detectadas
- `findDOMNode` (desaconsejado, usar refs).
- Ciclos de vida con prefijo `UNSAFE_` (en clases).
- Refs de string (ej. `ref="miRef"`).
- `React.createFactory` (obsoleto).
- Componentes que retornan undefined (en lugar de null o JSX).

## Beneficios futuros
StrictMode prepara tu aplicación para las nuevas funcionalidades de React, como el **modo concurrente** y los **server components**, donde los componentes pueden montarse y desmontarse varias veces antes de su commit final. Si tu aplicación sobrevive a StrictMode, estará lista para estos avances.

## Cómo usarlo
```jsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

const root = createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

Puedes anidar `StrictMode` solo en partes de tu aplicación, por ejemplo, si estás migrando progresivamente. Lo recomendable es envolver toda la aplicación.

## Efectos en producción
- No tiene ningún impacto de rendimiento; todo el código extra se elimina en el bundle de producción.
- Es completamente seguro habilitarlo; solo muestra warnings en consola de desarrollo.

---

Con estos seis pilares, conoces el motor interno que impulsa React: desde cómo representa la UI en memoria, cómo decide eficientemente qué cambiar, el rol crítico de las keys, las técnicas de renderizado condicional, la coreografía en dos fases y la herramienta de auditoría que te mantiene en el camino correcto. Este conocimiento es indispensable para diseñar componentes predecibles y aplicaciones de alto rendimiento.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Fases: Render y Commit](05-fases-render-y-commit.md) | [🏠 Inicio](../index.md) | [SyntheticEvent (Synthetic Events) ▶](../06-eventos/01-syntheticevent-synthetic-events.md) |
