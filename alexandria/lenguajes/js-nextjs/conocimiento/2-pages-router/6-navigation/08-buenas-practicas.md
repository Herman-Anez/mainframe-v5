# Buenas prácticas

- Usa `Link` siempre que sea posible para navegación declarativa; es más accesible y optimizado.
- Para navegación tras acciones (submit de formularios, redirecciones), emplea `router.push` o `router.replace`.
- En páginas con `getServerSideProps`, considera si la navegación realmente necesita datos frescos; si es solo un cambio visual, usa shallow routing.
- Maneja el estado de carga con los eventos del router para mejorar la UX.
- No abuses de `router.reload`; las transiciones del lado del cliente son preferibles.
- Al usar componentes que envuelven enlaces, verifica la compatibilidad con `passHref` o la nueva API de Link.
- En TypeScript, tipa los parámetros de ruta con los tipos genéricos de `useRouter` cuando sea necesario (aunque la inferencia suele bastar).
- Para aplicaciones grandes, centraliza las rutas en constantes o archivos de configuración para evitar cadenas hardcode.

Con estos fundamentos, la navegación en el Pages Router es fluida, rápida y altamente personalizable, sentando las bases para experiencias de usuario profesionales.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Comparativa con App Router](07-comparativa-con-app-router.md) | [🏠 Inicio](../../index.md) | [El Layout Persistente ▶](../../3-app-router/1-archivos-especiales/01-layout.md) |
