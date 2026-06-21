# Navegación con parámetros de consulta (query strings)

Además de `Link` con objetos, se puede manipular la query con `router.push`:

```jsx
router.push({ pathname: '/search', query: { q: 'term' } })
```

Al hacer esto, `router.query` se actualizará automáticamente y la página se re‑renderizará (si es la misma página, con shallow o sin él; pero sin shallow ejecutará `getServerSideProps` nuevamente si existe). Para evitar recarga de datos, usar `shallow: true`.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Navegación superficial (shallow routing)](03-navegacion-superficial-shallow-routing.md) | [🏠 Inicio](../../index.md) | [Navegación en internacionalización (i18n) ▶](05-navegacion-en-internacionalizacion-i18n.md) |
