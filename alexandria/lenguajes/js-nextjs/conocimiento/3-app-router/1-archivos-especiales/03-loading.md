# Pantalla de Carga

## Propósito

El archivo `loading.js` proporciona una interfaz de usuario de carga instantánea para un segmento de ruta mientras se resuelven los contenidos de la página o layouts anidados. Next.js lo envuelve automáticamente en un `<Suspense>`.

## Convención

Se coloca dentro de la carpeta del segmento (por ejemplo, `app/dashboard/loading.js`). Cuando se navega hacia una ruta dentro de ese segmento, se muestra el componente `loading` en lugar del contenido de la página (o layout/layouts hijos) hasta que esté listo.

## Funcionamiento con layouts

- Si existe un `loading.js` en el mismo segmento que un `layout.js`, la carga reemplazará **solo el contenido del slot `children`** del layout, no el layout mismo. Es decir, el layout se renderiza inmediatamente, y dentro de su área de contenido se muestra el spinner.
- Si queremos que la carga cubra también el layout (por ejemplo, mientras se carga un layout superior), se debe colocar `loading.js` en el segmento del layout que se quiere demorar.

## Ejemplo

```tsx
// app/dashboard/loading.tsx
export default function DashboardLoading() {
  return <div className="spinner">Cargando panel...</div>
}
```

En la página `app/dashboard/page.tsx` (asíncrona), mientras se espera la respuesta, se verá el componente de carga.

## Streaming

Gracias a Suspense, el servidor envía primero el shell de la página (layouts) y luego, cuando los datos están listos, envía el HTML del contenido. El `loading.js` actúa como fallback del Suspense.

## Múltiples cargas

Se pueden tener archivos `loading.js` en diferentes niveles para granularidad. También se puede usar `<Suspense>` manualmente dentro de una página para partes concretas.

## Desactivar carga

Si no se desea una pantalla de carga, simplemente no se crea el archivo. La página se renderizará completa en el servidor (si es SSR o SSG) y se enviará de una vez.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ La Página](02-page.md) | [🏠 Inicio](../../index.md) | [Manejo de Errores en el Segmento ▶](04-error.md) |
