# Rutas Interceptadas

## Concepto

Las rutas interceptadas permiten "interceptar" una navegación desde un determinado contexto y mostrar una vista alternativa (por ejemplo, un modal) en lugar de la página completa de destino, **mientras la URL cambia a la de destino**. Si se recarga la página desde esa URL, se muestra la página completa normal.

Es la base del patrón de **modales con rutas**.

## Convención de nombres

Se usan prefijos de ruta relativa, similar a los directorios en terminal:

- `(.)folder` – mismo nivel de jerarquía.
- `(..)folder` – un nivel superior.
- `(..)(..)folder` – dos niveles superiores.
- `(...)folder` – desde la raíz del `app/`.

Se colocan en la carpeta del segmento desde donde se quiere interceptar.

## Ejemplo: galería de fotos

```
app/
  feed/
    page.js               → /feed (lista de fotos)
  photo/
    [id]/
      page.js             → /photo/[id] (página completa de foto)
  (.)photo/
    [id]/
      page.js             → versión modal interceptada desde feed
```

Cuando el usuario está en `/feed` y hace clic en una foto, se navega a `/photo/123`. Next.js intercepta esta navegación y, en lugar de `app/photo/[id]/page.js`, renderiza `app/(.)photo/[id]/page.js` (porque `(.)photo` está al mismo nivel que `feed`). Si el usuario abre directamente `/photo/123` o recarga la página, se usa la página normal.

## Mecanismo de intercepción

- Solo se intercepta en navegación **del lado del cliente** (usando `next/link` o `router.push`). Las peticiones completas al servidor (recarga, enlace externo) no se interceptan.
- La intercepción es relativa al árbol de carpetas, no al `pathname` absoluto. Por eso los prefijos `(.)`, `(..)` son importantes.
- Se pueden interceptar rutas anidadas profundas. Por ejemplo, `(..)(..)photo` intercepta desde dos niveles arriba.

## Combinación con rutas paralelas (modales)

Para que el contenido interceptado aparezca en un modal, se utiliza en conjunto con un slot `@modal`. La ruta interceptada devuelve contenido dentro del slot, no como página principal.

Véase el archivo `modales.md` para la implementación completa.

## Interceptación y `default.js`

En slots, si se intercepta una ruta, el slot se llena con la página interceptada (por ejemplo, `app/@modal/(.)photo/[id]/page.js`). Si no hay intercepción, el slot usa su `default.js`.

## Navegación hacia atrás

Cuando el modal está abierto y se presiona "atrás", el navegador vuelve a la URL anterior y el slot regresa a su `default.js`, cerrando el modal. Esto proporciona una experiencia nativa.

## Consideraciones

- Las rutas interceptadas **no se pueden usar solas**; necesitan una ruta "real" que las respalde para los casos de carga directa.
- Los prefijos solo son válidos dentro del App Router.
- Para depurar, verifica la jerarquía de carpetas con cuidado; un `(..)` mal ubicado no interceptará nada.
- Funcionan con rutas dinámicas sin problema: `(.)photo/[id]/page.js`.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Rutas Paralelas](03-paralelas.md) | [🏠 Inicio](../../index.md) | [Implementación de Modales con Rutas ▶](05-modales.md) |
