# Optimización y rendimiento

- **Prefetch inteligente**: Solo las rutas en el viewport se precargan. Se puede forzar con `router.prefetch` para rutas que se sabe que se visitarán.
- **Client-side navigation**: No se hace una carga completa del HTML; solo se reemplaza el componente de la página y los datos necesarios.
- **Código dividido automáticamente**: Cada página se convierte en un chunk separado, por lo que la navegación carga exactamente el JS necesario.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Navegación en internacionalización (i18n)](05-navegacion-en-internacionalizacion-i18n.md) | [🏠 Inicio](../../index.md) | [Comparativa con App Router ▶](07-comparativa-con-app-router.md) |
