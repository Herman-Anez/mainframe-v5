# `next/link`: El componente de enlace

## Funcionamiento básico

`next/link` es un componente React que permite realizar **transiciones del lado del cliente** entre páginas de la aplicación. A diferencia de un `<a>` tradicional, evita la recarga completa del documento y precarga automáticamente la página destino cuando aparece en el viewport.

```jsx
import Link from 'next/link'

function Nav() {
  return (
    <Link href="/about">
      <a>Acerca de</a>
    </Link>
  )
}
```

Hasta Next.js 12, era obligatorio incluir un elemento `<a>` como hijo. A partir de Next.js 13 (también en Pages Router), `Link` acepta cualquier hijo y le inyecta automáticamente los atributos `href` y `onClick`, por lo que la etiqueta `<a>` puede omitirse:

```jsx
<Link href="/about">
  Acerca de
</Link>
```

Esto simplifica el marcado y evita errores de anidación.

## Propiedades principales

| Prop         | Tipo                               | Descripción                                                                                                                                     |
|--------------|------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------|
| `href`       | `string \| { pathname, query, hash }` | La ruta destino. Puede ser una cadena o un objeto URL.                                                                                        |
| `as`         | `string`                           | Opcional. URL decorativa que se mostrará en el navegador. Útil para rutas dinámicas con slugs amigables.                                       |
| `replace`    | `boolean`                          | Si `true`, reemplaza la entrada actual en el historial en lugar de añadir una nueva. Por defecto `false`.                                      |
| `scroll`     | `boolean`                          | Si `true` (predeterminado), la página se desplaza al inicio después de la navegación. Puede desactivarse con `false`.                          |
| `prefetch`   | `boolean`                          | Por defecto, precarga la ruta destino (solo en producción) cuando el enlace entra en el viewport. Se puede deshabilitar con `false`.           |
| `locale`     | `string`                           | Sobrescribe el locale activo para esta navegación (si se usa internacionalización nativa).                                                     |
| `shallow`    | `boolean`                          | Si `true`, la navegación es superficial (shallow routing) – no ejecuta métodos de obtención de datos.                                         |
| `passHref`   | `boolean`                          | Obligatorio si el hijo es un componente personalizado que envuelve un `<a>`, para forzar el paso del `href`.                                   |
| `legacyBehavior` | `boolean`                     | Permite volver al comportamiento antiguo (Next.js 12) si es `true`. No recomendado para nuevos proyectos.                                      |

## Navegación con objetos URL

En lugar de una cadena, se puede pasar un objeto `href` para construir rutas dinámicas con query strings:

```jsx
<Link href={{
  pathname: '/blog/[slug]',
  query: { slug: 'mi-post' },
}}>
  Leer post
</Link>
```

Esto es especialmente útil cuando se necesita pasar parámetros de ruta o mantener la query actual. El `as` se puede usar para "enmascarar" la URL:

```jsx
<Link
  href="/post/1?ref=home"
  as="/post/mi-post"
>
  Mi Post
</Link>
```

Aunque esta práctica ha sido reemplazada en muchos casos por enrutamiento limpio.

## Prefetch (precarga)

- **Producción**: `Link` precarga automáticamente la página destino cuando el enlace entra en el viewport (mediante `IntersectionObserver`). Esto acelera la navegación al tener los datos ya cacheados.
- **Desarrollo**: La precarga está deshabilitada para evitar sobrecargas innecesarias.
- **Desactivar prefetch**: Pasa `prefetch={false}`. Útil para enlaces a páginas raramente visitadas.

## Scroll restoration

Por defecto, al navegar con `Link` o `router.push`, la página se desplaza al tope (scroll to top). Para evitarlo:

```jsx
<Link href="/faq" scroll={false}>
  Preguntas frecuentes
</Link>
```

Esto mantiene la posición del scroll actual.

## Enlaces con componentes personalizados

Si se envuelve un componente que no es un `<a>` simple (por ejemplo, un botón estilizado con `styled-components`), se debe usar `passHref` para garantizar que el `href` se pase correctamente.

```jsx
import styled from 'styled-components'

const StyledLink = styled.a`
  color: red;
`

function CustomLink({ children, ...props }) {
  return <StyledLink {...props}>{children}</StyledLink>
}

export default function Nav() {
  return (
    <Link href="/about" passHref legacyBehavior>
      <CustomLink>Acerca</CustomLink>
    </Link>
  )
}
```

Con el nuevo comportamiento (Next.js 13+), ya no es necesario `legacyBehavior` ni `passHref` si el componente renderiza un `<a>` directamente; `Link` le inyecta el `href` y `onClick`.

## Accesibilidad

`Link` automáticamente genera un `<a>` con atributos de accesibilidad. Al usar `legacyBehavior` o versiones antiguas, el `<a>` debe ser semánticamente correcto. Se recomienda siempre incluir texto descriptivo o un `aria-label` si el enlace no contiene texto visible.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Layout Global mediante `_app](../5-layouts/02-_app-layout.md) | [🏠 Inicio](../../index.md) | [`next/router` y el hook `useRouter` ▶](02-nextrouter-y-el-hook-userouter.md) |
