# `createRoot` vs. `ReactDOM.render`

React 18 introduce una nueva API de montaje que reemplaza a `ReactDOM.render`. Es la puerta de entrada al renderizado concurrente y al nuevo comportamiento.

## Antes (legacy):
```javascript
import ReactDOM from 'react-dom';
ReactDOM.render(<App />, document.getElementById('root'));
```

## Ahora (React 18):
```javascript
import { createRoot } from 'react-dom/client';
const root = createRoot(document.getElementById('root'));
root.render(<App />);
```

## Diferencias y beneficios
- **Habilita el modo concurrente**: sin `createRoot`, la aplicación funciona en modo legacy síncrono, incluso si usas React 18. Las APIs como `startTransition` o `useDeferredValue` no tendrán efecto o lanzarán advertencias.
- **Batching automático completo**: solo con `createRoot` todas las actualizaciones se agrupan automáticamente; con el render legacy, el batching sigue limitado a eventos sintéticos.
- **`root.unmount()`**: para desmontar la aplicación completamente, útil en microfrontends o pruebas.
- **`root.render()` reemplaza**: permite actualizaciones posteriores sin pasar el contenedor cada vez. Llamar a `root.render(<NuevoApp />)` reemplaza el árbol.
- **Comportamiento más estricto en desarrollo**: con `createRoot`, React elimina warnings obsoletos y aplica las nuevas comprobaciones de StrictMode de manera más precisa.

## Migración
Es sencillo: en el punto de entrada, cambia `ReactDOM.render` por `createRoot`. Asegúrate de que tu código no dependa de comportamientos legacy (por ejemplo, acceder a `ReactDOM.render` como método de instancia). La mayoría de las aplicaciones migran sin cambios adicionales.

## SSR e hidratación
`hydrateRoot` sustituye a `ReactDOM.hydrate` con una API similar, habilitando el streaming y la hidratación progresiva en el servidor.

```javascript
import { hydrateRoot } from 'react-dom/client';
hydrateRoot(document.getElementById('root'), <App />);
```

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Renderizado concurrente (Concurrent Rendering)](01-renderizado-concurrente-concurrent-rendering.md) | [🏠 Inicio](../index.md) | [Suspense para datos ▶](03-suspense-para-datos.md) |
