# Buenas prácticas

- **Centraliza los mensajes** en archivos JSON por locale, estructurados por secciones (ej. `common.json`, `home.json`).
- **Usa siempre el locale de `params.locale`** en Server Components; no dependas de `useRouter` para obtener el locale en el servidor.
- **Proporciona `hreflang`** en el `<head>` para SEO, usando la API de metadatos: `alternates.languages`.
- **No generes páginas estáticas para todos los locales** si tu contenido varía enormemente; usa ISR o SSR para contenido traducido bajo demanda.
- **Mantén las claves de traducción consistentes**; herramientas como `i18n-ally` para VSCode ayudan.
- **Considera el impacto en el rendimiento** del middleware; mantén la lógica de detección liviana.
- **Prueba exhaustivamente** los cambios de locale, la persistencia en cookies y la navegación.

Con esta guía, la internacionalización en Next.js deja de ser un desafío y se convierte en una característica robusta y escalable.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Comparativa y migración](03-comparativa-y-migracion.md) | [🏠 Inicio](../index.md) | [Pruebas Unitarias y de Integración ▶](../15-testing/01-unitarias-integracion.md) |
