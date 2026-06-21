# Resumen de interacciones y prioridades

- Next.js busca primero páginas específicas (`404.js`, `500.js`) antes de recurrir a `_error.js`.
- `_app` envuelve todas las páginas, incluyendo las de error (404, 500, _error).
- `_document` envuelve el HTML de cualquier página renderizada en servidor, incluyendo errores de servidor.
- Si se usa `getInitialProps` en `_app`, también afecta a las páginas de error, pero `getInitialProps` en `_error` se ejecutará por separado.

Con estos conocimientos, se pueden manejar de forma profesional todos los casos de personalización de la interfaz de aplicación y errores en el Pages Router.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Página de error personalizada](03-_error.md) | [🏠 Inicio](../../index.md) | [Rutas estaticas dinamicas ▶](../2-enrutamiento/01-rutas-estaticas-dinamicas.md) |
