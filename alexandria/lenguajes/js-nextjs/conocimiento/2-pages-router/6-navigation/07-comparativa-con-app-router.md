# Comparativa con App Router

En el App Router, la navegación se maneja con `next/link` y el hook `useRouter` de `next/navigation`. Cambios clave:

- No existe `as`, `shallow`, `legacyBehavior`; la API es más simple.
- `useRouter` retorna `push`, `replace`, `prefetch`, `back`, etc., pero no tiene propiedades como `pathname` directamente; en su lugar se usan `usePathname`, `useSearchParams`.
- La navegación superficial se logra mediante `router.replace` con `scroll: false` y `useSearchParams` para leer/escribir parámetros sin navegación completa.
- El prefetch se controla con la prop `prefetch` en `Link`, con valores `null` (por defecto, automático), `true` o `false`.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Optimización y rendimiento](06-optimizacion-y-rendimiento.md) | [🏠 Inicio](../../index.md) | [Buenas prácticas ▶](08-buenas-practicas.md) |
