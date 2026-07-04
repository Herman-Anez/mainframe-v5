# Suspense para datos

Antes de React 18, `Suspense` se limitaba a la carga diferida de componentes con `React.lazy`. Con el renderizado concurrente, `Suspense` se convierte en un mecanismo general para **esperar datos asíncronos**, unificando los estados de carga de código y datos.

## Cómo funciona
Un componente puede **suspenderse** durante el renderizado si lanza una promesa mientras lee datos (con `use()`, `React.lazy`, o integraciones como React Query en modo suspense). React captura esa promesa y, en lugar de fallar, busca el `Suspense` más cercano hacia arriba en el árbol. Mientras la promesa no se resuelva, React muestra el `fallback` de ese `Suspense`. Cuando la promesa se resuelve, React reanuda el renderizado del subárbol suspendido.

## Ejemplo con `use` (experimental, React 19 canary)
```jsx
import { use, Suspense } from 'react';

async function fetchNote(id) {
  const res = await fetch(`/api/notes/${id}`);
  return res.json();
}

function Note({ id }) {
  const note = use(fetchNote(id));
  return <h1>{note.title}</h1>;
}

function App() {
  return (
    <Suspense fallback={<p>Cargando nota...</p>}>
      <Note id={1} />
    </Suspense>
  );
}
```
La función `use` desenvuelve la promesa; si no está lista, suspende. No se necesita estado, efecto ni limpieza manual.

## Integraciones con librerías
- **React Query v4+** y **SWR** ofrecen soporte para Suspense activándolo como opción. El hook `useQuery({ suspense: true })` suspenderá automáticamente mientras los datos estén pendientes.
- **Apollo Client** (experimental) también puede suspender.

## Transiciones y Suspense
Combinado con `startTransition`, Suspense evita el parpadeo de cargadores cuando ya hay contenido visible. Si un usuario navega entre pestañas, y la nueva pestaña necesita datos, puedes marcar el cambio de pestaña como una transición. React mantendrá la pestaña anterior visible hasta que la nueva esté lista (o un tiempo límite), en lugar de mostrar inmediatamente el fallback. Esto se logra porque las actualizaciones en transición no fuerzan el fallback inmediato; esperan un lapso configurable antes de mostrar el indicador de carga.

## Diferencia con el enfoque tradicional de `useEffect`
El patrón clásico con `useEffect` y `useState` para fetching tiene desventajas: competiciones de carreras, necesidad de limpiar, múltiples estados (loading, error, data). Suspense traslada esa lógica al marco de React, haciendo que los componentes se lean como si obtuvieran datos de forma síncrona, mientras React maneja la asincronía.

## Jerarquía de `Suspense`
Puedes anidar varios `Suspense` con diferentes límites para granularidad fina: por ejemplo, un fallback para la cabecera y otro para el contenido principal. React mostrará el fallback más cercano al componente suspendido, permitiendo que el resto de la interfaz siga siendo interactiva.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ `createRoot` vs. `ReactDOM.render`](02-createroot-vs-reactdomrender.md) | [🏠 Inicio](../index.md) | [Transiciones: `startTransition` y `useTransition` ▶](04-transiciones-starttransition-y-usetransition.md) |
