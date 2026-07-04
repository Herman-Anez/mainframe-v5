# Carga optimizada de scripts con `next/script

## Propósito

`next/script` es una extensión del elemento `<script>` que permite controlar cuándo y cómo se cargan los scripts de terceros (analytics, publicidad, widgets). Ayuda a evitar que estos scripts ralenticen la carga inicial y la hidratación.

## Estrategias de carga (`strategy`)

| Estrategia         | Descripción                                                                                                                   |
|--------------------|-------------------------------------------------------------------------------------------------------------------------------|
| `beforeInteractive` | El script se ejecuta **antes de que React se hidrate**. Útil para polyfills críticos, pero **debe colocarse en `_app` o `_document`** y solo se permite en esas ubicaciones. **No puede usarse en cualquier componente**. |
| `afterInteractive`  | (Por defecto) El script se carga justo después de que la página se vuelva interactiva (después de la hidratación). Ideal para analytics, mapas. |
| `lazyOnload`        | Se carga durante el tiempo de inactividad del navegador (cuando no hay otros recursos prioritarios). Adecuado para widgets de chat, fondos no críticos. |
| `worker`            | (Experimental) Carga el script en un Web Worker para no bloquear el hilo principal.                                          |

## Uso básico

```jsx
import Script from 'next/script'

export default function MyApp() {
  return (
    <>
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=GA_ID"
        strategy="afterInteractive"
      />
      <Script id="gtag" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'GA_ID');`}
      </Script>
    </>
  )
}
```

## Inline scripts

- Deben tener un `id` para que Next.js pueda rastrearlos y evitar duplicados.
- Se pueden usar con `dangerouslySetInnerHTML` o como children (string). La forma de children es recomendada.

```jsx
<Script id="my-inline-script">{`console.log('hello');`}</Script>
```

## `onLoad` y `onError`

Puedes adjuntar callbacks:

```jsx
<Script
  src="https://example.com/script.js"
  onLoad={() => console.log('Script cargado')}
  onError={(e) => console.error('Error', e)}
/>
```

## Limpiar scripts globales

Algunos scripts (como widgets de chat) añaden elementos al DOM global que pueden persistir entre navegaciones SPA. Para manejarlos, puedes usar `useEffect` y limpiar, o cargarlos con `strategy="lazyOnload"` dentro de un Client Component que se monte/desmonte.

## `beforeInteractive` en detalle

Solo puede usarse en `pages/_document.js` (Pages Router) o en el `root layout` del App Router (dentro de `<head>`) mediante el componente `NextScript`. En App Router, se configura mediante la Metadata API o `next/script` en layout con `beforeInteractive`? En realidad, en App Router, `beforeInteractive` está restringido a `_document` del Pages Router; en App Router, el concepto de `beforeInteractive` no se admite en componentes, solo se puede usar en `RootLayout` con `next/script` en el head? La documentación actual indica que `beforeInteractive` solo funciona en `_document` (Pages Router) y en el `app/layout` (App Router) solo si se coloca en el `<head>`, pero se recomienda usar `afterInteractive` para la mayoría de casos.

## Buenas prácticas

- Carga los scripts de analítica con `afterInteractive` para no retrasar la interacción.
- Los scripts de marketing no críticos (chatbots, popups) con `lazyOnload`.
- Siempre proporciona un `id` a los scripts inline.
- Para scripts que deben cargarse en cada navegación, considera si realmente necesitan volver a ejecutarse; a menudo basta con cargarlos una vez en `_app` o layout.
- Aprovecha `onLoad` para inicializar funcionalidad una vez que el script esté disponible.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Optimización de fuentes con `next/font](02-fuentes.md) | [🏠 Inicio](../index.md) | [next/dynamic ▶](04-importaciones-dinamicas.md) |
