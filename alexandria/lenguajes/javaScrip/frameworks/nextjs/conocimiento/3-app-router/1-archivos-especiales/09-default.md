# Fallback para Rutas Paralelas

## Concepto

En el App Router, las rutas paralelas se definen usando slots (carpetas con `@`). Por ejemplo, `@dashboard`, `@modal`. En la navegación, si una ruta no tiene contenido para un slot específico, Next.js renderizará el archivo `default.js` de ese slot.

## Ejemplo

Estructura:
```
app/
  @modal/
    default.js       → contenido cuando no hay modal específico (ej. null)
    login/
      page.js        → contenido del modal en /login
  page.js            → página principal
  layout.js          → layout con slots
```

Si el usuario visita `/`, el slot `@modal` no tiene `page.js`, por lo que se muestra `@modal/default.js`. Al navegar a `/login`, `@modal/login/page.js` se renderiza y `default.js` queda inactivo.

## Implementación

El archivo `default.js` exporta un componente React que puede ser tan simple como `null` si no se desea contenido.

```tsx
// app/@modal/default.tsx
export default function DefaultModal() {
  return null
}
```

Es esencial para evitar errores de "no se pudo encontrar el slot" y permitir que el layout funcione correctamente.

## Reglas

- `default.js` es opcional, pero recomendado si el slot puede no tener contenido en algunas rutas.
- Solo se aplica a slots paralelos; las rutas normales no lo usan.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ API Route Handler](08-route.md) | [🏠 Inicio](../../index.md) | [Archivos de Metadatos Estáticos y Dinámicos ▶](10-metadata-files.md) |
