# Navegación en internacionalización (i18n)

En Pages Router con configuración `i18n`, `Link` y `router` respetan el locale. Se puede sobreescribir:

```jsx
<Link href="/about" locale="en">
  English
</Link>
```

O de manera imperativa:

```jsx
router.push('/about', undefined, { locale: 'en' })
```

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Navegación con parámetros de consulta (query strings)](04-navegacion-con-parametros-de-consulta-query-strings.md) | [🏠 Inicio](../../index.md) | [Optimización y rendimiento ▶](06-optimizacion-y-rendimiento.md) |
