# Comparativa y migración

| Característica                  | Pages Router (i18n nativo)                  | App Router (middleware + librería)              |
|---------------------------------|---------------------------------------------|-------------------------------------------------|
| Configuración                   | `next.config.js` con `i18n`                | Middleware + archivos de mensajes               |
| Prefijo de URL                  | Automático (`/es/about`)                    | Manual con `[locale]` + middleware               |
| Dominios por locale             | Soportado                                   | Requiere configuración de dominio en middleware |
| Soporte en layouts anidados     | No aplica (no hay layouts)                  | Completo (proveedor de contexto)                |
| Obtención de traducciones       | Manual (archivos JSON, API)                 | Librerías como `next-intl` o manual             |
| Librerías compatibles           | `next-i18next`, `react-intl`, etc.          | `next-intl`, `next-i18next`, `i18next`          |

**Migrar del Pages Router al App Router** implica:

- Eliminar la configuración `i18n` de `next.config.js`.
- Crear el segmento `[locale]` y mover las páginas dentro.
- Implementar el middleware de detección de locale.
- Adaptar la carga de traducciones al sistema elegido (`next-intl` es el más directo).

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Internacionalización en el App Router](02-internacionalizacion-en-el-app-router.md) | [🏠 Inicio](../index.md) | [Buenas prácticas ▶](04-buenas-practicas.md) |
