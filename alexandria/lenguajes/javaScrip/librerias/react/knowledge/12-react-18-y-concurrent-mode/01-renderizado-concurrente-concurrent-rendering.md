# Renderizado concurrente (Concurrent Rendering)

El renderizado concurrente es un rediseño fundamental del planificador de React que permite que el trabajo de renderizado se **interrumpa, pause y reanude**, en lugar de ser un proceso sincrónico e ininterrumpible. No es una funcionalidad que se active con una bandera global; en React 18, está disponible automáticamente al usar la nueva API `createRoot`.

## ¿Qué cambia respecto al renderizado síncrono?
En el modelo legacy (React 17 y anteriores), una vez que comenzaba un renderizado, debía completarse de principio a fin sin pausa. Si el árbol era grande o había cálculos costosos, la UI se congelaba hasta que el render terminaba. Con el modo concurrente:
- React puede **interrumpir** un renderizado en curso si llega una actualización de mayor prioridad (por ejemplo, una escritura del teclado o un clic).
- Descarta el trabajo parcialmente completado y vuelve a empezar con la nueva prioridad.
- Una vez manejada la tarea urgente, reanuda el renderizado interrumpido o lo reprograma.

Esto se logra mediante una **estructura de fibra** (React Fiber) que permite dividir el trabajo en unidades pequeñas y cooperativas, cediendo el control al hilo principal periódicamente.

## Características clave
- **Interrumpibilidad**: React puede pausar el renderizado para atender eventos del usuario, manteniendo la interfaz responsiva.
- **Priorización**: Las actualizaciones se clasifican en urgentes (transiciones de usuario) y no urgentes (actualizaciones de datos, renderizados inducidos por Suspense). `startTransition` marca explícitamente una actualización como no urgente.
- **Procesamiento en segundo plano**: React puede trabajar en renders no urgentes "en segundo plano" mientras la UI sigue respondiendo.
- **Descartar trabajo obsoleto**: Si una actualización deja de ser relevante porque el estado cambió de nuevo, React puede tirar el render intermedio y empezar con el último valor.

## Implicaciones para el desarrollador
- El código debe ser **puro** y **libre de efectos secundarios** en la fase de render. React puede ejecutar el render de un componente varias veces antes de commit. StrictMode ayuda a detectar impurezas.
- Los efectos (`useEffect`, `useLayoutEffect`) siguen ejecutándose en la fase de commit, que es sincrónica.
- Algunas bibliotecas que manipulan el DOM directamente pueden necesitar ajustes si asumen un orden de ejecución estricto. React 18 es en su mayoría compatible hacia atrás.
- Las nuevas funcionalidades (Suspense para datos, transiciones) dependen del renderizado concurrente para funcionar correctamente.

## Relación con el batching automático
En React 18, el batching automático se extiende a todas las actualizaciones (no solo eventos sintéticos). Varias actualizaciones de estado dentro de promesas, `setTimeout` o eventos nativos se agrupan en un solo render, evitando renders parciales innecesarios. Esto mejora el rendimiento sin cambios en el código.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Windowing (Virtualización)](../11-rendimiento/05-windowing-virtualizacion.md) | [🏠 Inicio](../index.md) | [`createRoot` vs. `ReactDOM.render` ▶](02-createroot-vs-reactdomrender.md) |
