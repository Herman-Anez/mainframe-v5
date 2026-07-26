# Fix: overlay decorativo bloqueaba todos los clicks del sitio

## Síntoma

Ningún botón, checkbox ni link respondía en ninguna página bajo `(main)` —
no solo en una página puntual. Visualmente todo se veía bien (los inputs
mostraban el estado correcto, los botones tenían el texto correcto), pero
nada reaccionaba al click.

## Cómo se detectó

Usando Playwright (`playwright`, ya está en `devDependencies` para los tests
de Storybook) para automatizar un click real sobre un checkbox de
`ejemplo-hoc-vanilla`, el error fue:

```
- <div class="display-flex position-relative overflow-hidden fill min-height-0 min-width-0 ">…</div>
  from <div class="display-flex position-absolute top-0 left-0 flex-column align-center min-width-0 fill-width fill-height ">…</div>
  subtree intercepts pointer events
```

Esa es la señal clave: un elemento *distinto* al que se quiere clickear está
"interceptando" el evento porque queda arriba en el stacking order.

## Causa raíz

`src/app/(main)/layout.tsx` — el layout raíz que envuelve **todas** las
páginas del sitio — renderiza un fondo decorativo animado (`MatrixFx` dentro
de un `Mask`) en un contenedor:

```tsx
<Column fillWidth maxHeight="100dvh" aspectRatio="1" horizontal="center" position="absolute" top="0" left="0">
  <Mask maxWidth="m" x={50} y={0} radius={50}>
    <MatrixFx ... />
  </Mask>
</Column>
```

`position="absolute" top="0" left="0"` lo saca del flujo normal y lo deja
flotando por encima del contenido real (`{children}`), que se renderiza
justo después en el JSX pero queda "debajo" en el eje Z porque no hay
`z-index` ni `pointer-events` que lo aparten. El navegador entonces le
entrega los eventos de puntero a ese div decorativo en vez de al checkbox o
botón que el usuario ve debajo.

Como este layout envuelve todo el sitio, el bug no es exclusivo de ninguna
página — cualquier página nueva bajo `(main)` lo va a heredar hasta que se
arregle acá.

## Fix aplicado

Agregar `style={{ pointerEvents: "none" }}` a ese `<Column>` decorativo. Es
puramente visual (un fondo animado), nunca necesita recibir clicks, así que
"apagar" sus eventos de puntero deja pasar el click al elemento real que
está debajo sin cambiar nada visualmente.

## Cómo reconocer este patrón en el futuro

Si un botón/input "no responde" pero se ve bien:

1. No asumas que el bug está en el componente que no responde — puede estar
   en algo que lo tapa invisible.
2. Automatizá un click real (Playwright, Chrome DevTools Protocol, o la
   extensión de Chrome de Claude Code) en vez de solo mirar el DOM
   estático (`curl`/`fetch` no alcanza, hay que ejecutar JS real).
3. El mensaje de Playwright `"<div ...> subtree intercepts pointer events"`
   apunta directo al elemento culpable — buscá qué lo posiciona
   (`position: absolute/fixed`, `z-index` alto) y si tiene sentido que
   reciba eventos de puntero. Si es puramente decorativo, la respuesta casi
   siempre es `pointer-events: none`.
4. Sospechá primero de layouts compartidos (`layout.tsx`) antes que del
   código de la página puntual — un bug ahí afecta a todo lo que envuelve.
