# Manejo de Errores en el Segmento

## Función

`error.js` es un **Client Component** obligatorio (debe incluir `'use client'`) que actúa como un Error Boundary para un segmento de ruta. Captura errores que ocurren en la página, layouts hijos o componentes del mismo segmento y muestra una interfaz de error.

## Props

Recibe dos props:

- `error`: instancia del error ocurrido (contiene `message`, `stack`).
- `reset`: función que intenta re-renderizar el segmento. Llamará a `router.refresh()` internamente para intentar recuperar el estado.

```tsx
'use client'

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div>
      <h2>¡Algo salió mal!</h2>
      <p>{error.message}</p>
      <button onClick={() => reset()}>Intentar de nuevo</button>
    </div>
  )
}
```

## Alcance

- Captura errores en la página y componentes dentro del mismo segmento y sus hijos, **pero no** errores del layout del propio segmento. Si el layout del segmento lanza un error, ese error se propagará al `error.js` del layout padre o, si no existe, al `global-error.js`.
- Es decir, cada `error.js` protege a su contenido (children), no al layout que lo envuelve.

## Comportamiento en desarrollo vs producción

- En desarrollo se mostrará el stack trace en pantalla y también el componente error en algunos casos (puede alternar). En producción, el componente error reemplaza completamente al contenido fallido.

## Reset

La función `reset` provoca un reintento de renderizado del segmento. Si el error persiste, se volverá a mostrar el componente de error. Ideal para errores transitorios (red).

## No es necesario en el root

El root layout (app/layout.js) no está cubierto por `error.js`. Para eso existe `global-error.js`.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Pantalla de Carga](03-loading.md) | [🏠 Inicio](../../index.md) | [Error del Root Layout ▶](05-global-error.md) |
