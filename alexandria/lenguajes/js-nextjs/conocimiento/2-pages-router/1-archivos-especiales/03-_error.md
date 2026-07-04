# Página de error personalizada

## Definición

`_error` es un componente que se muestra cuando ocurre un error en el servidor (500) o en el cliente (error genérico). También actúa como fallback para cualquier código de estado HTTP que no tenga una página específica (por defecto, Next.js muestra una página de error simple). Puede ser estático o con `getInitialProps` para personalizar el mensaje según el código.

## Ubicación

`pages/_error.js` (o `.tsx`).

## Props y comportamiento

- **En el servidor**: Recibe `statusCode` desde la respuesta (si está disponible).
- **En el cliente**: También recibe `statusCode` si ocurre un error durante la hidratación o navegación.

Si no se define `_error`, Next.js usa un componente predeterminado con estilos mínimos.

## Implementación básica (clase o funcional)

```js
function Error({ statusCode }) {
  return (
    <p>
      {statusCode
        ? `Ocurrió un error ${statusCode} en el servidor`
        : 'Ocurrió un error en el cliente'}
    </p>
  )
}

Error.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404
  return { statusCode }
}

export default Error
```

- Si `res` existe (servidor), toma `res.statusCode`.
- Si `err` existe, toma `err.statusCode`.
- Si ninguno existe, devuelve 404 (aunque esto puede ser controvertido; en realidad, si hay un error en cliente, se recomienda 500 o undefined). La lógica anterior es la documentación oficial.

## Página de error de 500 vs _error

`_error` es genérico; `pages/500.js` es una página específica para el código 500. Si existe, `_error` no se usará para 500. Lo mismo para 404: `pages/404.js` tiene prioridad.

## Personalizar UI según el código

```js
function Error({ statusCode }) {
  if (statusCode === 404) {
    return <CustomNotFound />
  }
  if (statusCode === 500) {
    return <CustomServerError />
  }
  return <GenericError statusCode={statusCode} />
}
```

## `getInitialProps` en detalle

- `getInitialProps` se ejecuta en el servidor (si el error ocurre en servidor) y también en el cliente (si ocurre después de la hidratación).
- Permite obtener el código de estado y pasarlo como prop.
- No se puede usar `getServerSideProps` ni `getStaticProps` porque `_error` es especial.

## Consideraciones con TypeScript

```ts
import { NextPageContext } from 'next'

interface ErrorProps {
  statusCode?: number
}

function Error({ statusCode }: ErrorProps) {
  // ...
}

Error.getInitialProps = ({ res, err }: NextPageContext): ErrorProps => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404
  return { statusCode }
}
```

## Limitaciones

- En modo desarrollo, Next.js muestra una pantalla de error con stack trace; `_error` no se muestra en desarrollo para errores de servidor (se muestra el overlay). En producción sí.
- No captura errores de renderizado en Client Components que están dentro de un Error Boundary (eso es otro concepto).

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Documento HTML personalizado](02-_document.md) | [🏠 Inicio](../../index.md) | [Resumen de interacciones y prioridades ▶](06-resumen-de-interacciones-y-prioridades.md) |
