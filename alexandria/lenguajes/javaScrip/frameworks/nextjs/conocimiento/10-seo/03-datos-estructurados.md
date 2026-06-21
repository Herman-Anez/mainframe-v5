# Datos Estructurados (JSON‑LD)

## ¿Qué son los datos estructurados?

Los **datos estructurados** son un formato estandarizado para proporcionar información sobre una página y clasificar su contenido (por ejemplo, artículos, productos, eventos, FAQs). El formato recomendado por Google es **JSON‑LD**, que se inyecta como un `<script type="application/ld+json">` en el `<head>` o `<body>`.

Next.js no tiene una API específica para datos estructurados, pero existen varios patrones para añadirlos correctamente.

## Inyección en App Router

### Opción 1: Usar `generateMetadata` y el campo `other`

Puedes aprovechar la Metadata API y el campo `other` para inyectar scripts arbitrarios.

```tsx
// app/productos/[id]/page.tsx
export async function generateMetadata({ params }): Promise<Metadata> {
  const producto = await getProducto(params.id)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: producto.nombre,
    description: producto.descripcion,
    image: producto.imagen,
    offers: {
      '@type': 'Offer',
      price: producto.precio,
      priceCurrency: 'EUR',
      availability: 'https://schema.org/InStock',
    },
  }

  return {
    title: producto.nombre,
    other: {
      'application/ld+json': JSON.stringify(jsonLd),
    },
  }
}
```

Next.js tomará el objeto `other` y generará etiquetas `<meta>` o `<script>` según la clave. En este caso, al ser `application/ld+json`, generará un `<script type="application/ld+json">` con el JSON.

**Ventaja**: Se integra con la Metadata API y se puede combinar con otros metadatos.  
**Limitación**: El script se coloca en el `<head>` (es válido, pero algunos prefieren al final del body).

### Opción 2: Inyectar directamente en el JSX del componente

Puedes insertar el script en el JSX del Server Component (o Client Component) usando una etiqueta `<script>` con `type="application/ld+json"` y `dangerouslySetInnerHTML`. Next.js no escapa este contenido.

```tsx
// app/productos/[id]/page.tsx
export default async function ProductoPage({ params }) {
  const producto = await getProducto(params.id)

  const jsonLd = { /* ... */ }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <article>{/* contenido */}</article>
    </>
  )
}
```

- Funciona perfectamente en Server Components.
- Puedes colocarlo en cualquier parte del JSX (normalmente al principio del componente).
- También puedes usar un componente reutilizable `JsonLd` que encapsule esta lógica.

```tsx
// components/JsonLd.tsx
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}
```

### Opción 3: Usar un layout o template

Para datos estructurados globales (como la organización), colócalos en el Root Layout usando el mismo método.

## Datos estructurados en Pages Router

En Pages Router, el enfoque es similar: usa `next/head` para inyectar el script.

```jsx
import Head from 'next/head'

export default function Producto({ producto }) {
  const jsonLd = { /* ... */ }
  return (
    <>
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </Head>
      <article>{/* ... */}</article>
    </>
  )
}
```

## Consideraciones importantes

- **Validez JSON**: Asegúrate de que el objeto JSON no contenga valores `undefined`; usa `JSON.stringify` que los omite (excepto en arrays). Para datos dinámicos, valida con un esquema o usa `replacer`.
- **Tipado**: Para mantener la consistencia, define tipos para los esquemas comunes (Article, Product, FAQ, etc.) usando TypeScript. Existen librerías como `schema-dts` que proporcionan estos tipos.

```bash
npm install schema-dts
```

```tsx
import type { Product, WithContext } from 'schema-dts'

const jsonLd: WithContext<Product> = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: producto.nombre,
  // ...
}
```

- **Múltiples entidades**: Puedes incluir varios objetos JSON-LD en la misma página; solo asegúrate de que cada uno sea un script separado. Los buscadores los procesarán correctamente.
- **Pruebas**: Usa la [Herramienta de pruebas de datos estructurados de Google](https://search.google.com/test/rich-results) y el validador de Schema.org.

## Ejemplos comunes de esquemas

### Artículo (BlogPosting)

```tsx
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BlogPosting',
  headline: post.title,
  description: post.excerpt,
  image: post.image,
  datePublished: post.publishedAt,
  author: {
    '@type': 'Person',
    name: post.author.name,
  },
}
```

### FAQ

```tsx
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map(faq => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.answer,
    },
  })),
}
```

### BreadcrumbList

```tsx
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://miapp.com' },
    { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://miapp.com/blog' },
  ],
}
```

## Buenas prácticas

- Centraliza la generación de datos estructurados en funciones helper o componentes reutilizables.
- No incluyas datos que no estén visibles en la página (riesgo de penalización).
- Mantén los datos actualizados: si el contenido de la página cambia, el JSON-LD debe reflejarlo.
- En sitios con ISR, asegúrate de que la revalidación también actualice los datos estructurados.
- Para grandes volúmenes de páginas, evita sobrecargar el JSX con lógica; mueve la construcción del JSON a una función utilitaria.

Con estos tres documentos, el apartado de SEO queda completamente cubierto, desde los metadatos básicos hasta la inclusión de datos estructurados para enriquecer los resultados de búsqueda.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Sitemap y Robots.txt en Next.js](02-sitemap-robots.md) | [🏠 Inicio](../index.md) | [API Routes en el Pages Router ▶](../12-api-route-handlers/01-pages-api.md) |
