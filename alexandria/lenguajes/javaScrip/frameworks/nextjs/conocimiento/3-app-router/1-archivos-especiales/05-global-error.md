# Error del Root Layout

## Propósito

El archivo `global-error.js` se coloca en la raíz del `app/` y captura errores que ocurren en el **Root Layout**. Es la última línea de defensa; si falla el layout raíz, `global-error.js` se renderiza, reemplazando todo el árbol.

## Características

- Debe ser un Client Component ( `'use client'` ).
- Debe definir sus propias etiquetas `<html>` y `<body>` porque reemplaza al documento entero.
- Recibe `error` y `reset` igual que `error.js`.

```tsx
'use client'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html>
      <body>
        <h1>Error crítico</h1>
        <button onClick={() => reset()}>Reintentar</button>
      </body>
    </html>
  )
}
```

- Si no se define `global-error.js`, un error en el root layout causará una pantalla de error estática de Next.js.

## Interacción con `error.js`

Un error en un layout anidado (no root) es capturado por el `error.js` del segmento padre, no por `global-error`. El `global-error` solo se activa cuando el error ocurre en el Root Layout o se propaga desde un layout que no tiene `error.js` en ningún nivel superior.

## Cuándo usarlo

Poco común. Normalmente el Root Layout es sencillo (proveedores, HTML). Se recurre a `global-error` como salvaguarda.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Manejo de Errores en el Segmento](04-error.md) | [🏠 Inicio](../../index.md) | [Página 404 por Segmento ▶](06-not-found.md) |
