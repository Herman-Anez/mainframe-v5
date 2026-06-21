# Internacionalización en el Pages Router

## 1.1 Configuración

En `next.config.js` se define la propiedad `i18n`:

```javascript
module.exports = {
  i18n: {
    locales: ['en', 'es', 'fr'],
    defaultLocale: 'en',
    // Opcional: dominios por locale
    domains: [
      { domain: 'example.com', defaultLocale: 'en' },
      { domain: 'example.es', defaultLocale: 'es', http: true },
    ],
  },
}
```

- **`locales`**: Lista de idiomas soportados.
- **`defaultLocale`**: Idioma predeterminado (usado cuando no se detecta ninguno).
- **`domains`** (opcional): Permite servir cada locale en un dominio o subdominio distinto.

## 1.2 Enrutamiento automático

Next.js genera automáticamente las rutas con el prefijo del locale:

- `/` → redirige a `/{defaultLocale}` (ej. `/en`)
- `/about` → `/{locale}/about`
- Las páginas se definen sin el prefijo en `pages/`; Next.js añade el parámetro `locale`.

**Comportamiento del locale por defecto:**  
La raíz `/` redirige a la versión del `defaultLocale`. Si se desea que el defaultLocale esté en la raíz sin prefijo, se puede configurar `localeDetection: false` y manejar manualmente.

## 1.3 Acceso al locale en la aplicación

- **En componentes**: Usa `useRouter().locale` para obtener el locale activo.
- **En `getStaticProps` / `getServerSideProps`**: El `context` incluye `locale`, `locales` y `defaultLocale`.

```javascript
export async function getStaticProps({ locale }) {
  const data = await import(`../content/${locale}.json`)
  return { props: { data } }
}
```

## 1.4 Navegación entre idiomas

`next/link` y `next/router` aceptan la prop `locale` para cambiar de idioma manteniendo la misma página:

```jsx
<Link href="/about" locale="es">Español</Link>
```

```javascript
router.push('/about', undefined, { locale: 'es' })
```

## 1.5 Detección automática del locale

Por defecto, Next.js examina la cabecera `Accept-Language` para redirigir al usuario al locale más adecuado en la primera visita. Se puede desactivar con `localeDetection: false`.

## 1.6 Consideraciones con SSG e ISR

- Con `getStaticPaths`, debes generar los paths para cada locale. Puedes iterar sobre `locales` y combinar con los parámetros dinámicos.
- `fallback` funciona normalmente dentro de cada locale.
- La regeneración ISR se realiza por separado para cada página localizada.

## 1.7 Limitaciones

- No soporta traducciones dentro de layouts anidados (no existía ese concepto en Pages Router).
- La estructura de URL siempre incluye el prefijo del locale, lo que puede no ser deseado en todos los casos.
- La internacionalización es solo de enrutamiento; la carga de contenido traducido debe implementarse manualmente con archivos JSON, CMS, etc.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ NextAuth.js (Auth.js) en profundidad](../13-autenticacion/02-nextauth.md) | [🏠 Inicio](../index.md) | [Internacionalización en el App Router ▶](02-internacionalizacion-en-el-app-router.md) |
