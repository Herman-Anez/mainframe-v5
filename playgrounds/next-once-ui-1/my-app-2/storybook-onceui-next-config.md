# Cómo se conectaron Storybook + Next.js + Once UI en este proyecto

Este documento explica, paso a paso y en lenguaje simple, qué se hizo para que Storybook funcione en un proyecto Next.js que usa la librería de componentes **Once UI**. La idea es que puedas entenderlo aunque nunca hayas tocado Storybook antes.

## ¿Qué problema resolvemos?

Storybook es una herramienta que te deja ver y probar componentes de React de forma aislada, sin tener que levantar toda la app (`next dev`) y navegar hasta la pantalla correcta. Abres un componente, ves cómo se ve, y puedes escribir tests automáticos ("stories") que comprueban que funciona.

El problema es que un componente de Once UI no se ve bien "solo": necesita que le rodeen ciertas cosas para funcionar igual que en la app real:

1. Los **estilos CSS** de Once UI (sin ellos, todo se ve como HTML plano, sin colores ni espaciado).
2. Los **Providers** de React (código que da "contexto" a los componentes: tema claro/oscuro, iconos, notificaciones, etc.).

Si no configuras esto, Storybook muestra los componentes rotos o sin estilo, y las pruebas automáticas no significan nada.

## Paso 1: Instalar Storybook y arrancar la configuración

Se ejecutó:

```bash
pnpm exec storybook ai setup
```

Esto detecta que el proyecto es Next.js + TypeScript + pnpm, e instala Storybook con el framework correcto: `@storybook/nextjs-vite` (una versión de Storybook pensada específicamente para proyectos Next, usando Vite como motor interno en vez de Webpack, que es más rápido).

**Problema encontrado:** pnpm bloqueó la instalación porque un paquete (`esbuild`) intentaba ejecutar un script después de instalarse, y pnpm por seguridad pide aprobación manual para eso. Se resolvió con:

```bash
pnpm approve-builds esbuild
```

Esto le dice a pnpm "confío en este paquete, déjalo ejecutar su script de instalación".

Después de eso, la instalación creó automáticamente:

- Una carpeta `.storybook/` con dos archivos de configuración: `main.ts` y `preview.tsx`.
- Una carpeta `src/stories/` con componentes de ejemplo (`Button`, `Header`, `Page`) que Storybook usa como demo genérica — no tienen nada que ver con nuestra app.

## Paso 2: Entender qué necesita la app para renderizar bien

Antes de tocar nada, se leyeron los archivos clave de la app para entender cómo arranca normalmente:

- `src/app/(main)/layout.tsx`: aquí la app importa las hojas de estilo de Once UI:
  ```ts
  import '@once-ui-system/core/css/styles.css';
  import '@once-ui-system/core/css/tokens.css';
  import '@/resources/custom.css'
  ```
  `styles.css` trae los estilos de todos los componentes (botones, layouts, etc.). `tokens.css` trae las variables de diseño (colores, tamaños). `custom.css` es donde el proyecto podría sobreescribir esos valores (en este proyecto está vacío/comentado, pero se importa igual por si acaso).

- `src/components/Providers.tsx`: aquí está el árbol de "Providers" que la app envuelve alrededor de todo:
  ```tsx
  <LayoutProvider>
    <ThemeProvider ...>
      <DataThemeProvider ...>
        <ToastProvider>
          <IconProvider icons={iconLibrary}>
            {children}
          </IconProvider>
        </ToastProvider>
      </DataThemeProvider>
    </ThemeProvider>
  </LayoutProvider>
  ```
  Cada uno de estos "Provider" es un componente de React que no dibuja nada visible por sí mismo, pero le pasa información a todos sus hijos a través de React Context. Por ejemplo, `ThemeProvider` le dice a todos los componentes de adentro qué colores usar (brand, accent, neutral, etc., definidos en `src/resources/once-ui.config.js`).

Conclusión de esta investigación: **cualquier componente de Once UI que pongamos en Storybook necesita estar envuelto por este mismo árbol de Providers, y necesita las mismas 3 hojas de estilo cargadas.**

También se revisó si la app usaba cosas más complicadas — llamadas a APIs (`fetch`), `localStorage`, "portals" (componentes que se renderizan fuera de su lugar normal en el DOM, como modales) — porque si las usara, habría que simularlas en Storybook también. **No se encontró nada de eso**: la app es simple, solo páginas estáticas. Esto simplificó mucho la configuración.

## Paso 3: Configurar `.storybook/preview.tsx`

Este archivo es el punto central: define qué envuelve a **todas** las stories del proyecto, para no tener que repetir configuración en cada archivo de story.

Se editó así (se agregó a lo que ya existía, no se reemplazó):

```tsx
import type { Preview } from '@storybook/nextjs-vite'
import '@once-ui-system/core/css/styles.css';
import '@once-ui-system/core/css/tokens.css';
import '../src/resources/custom.css';
import { Providers } from '../src/components/Providers';

const preview: Preview = {
  decorators: [
    (Story) => (
      <Providers>
        <Story />
      </Providers>
    ),
  ],
  parameters: {
    // ... lo que ya venía configurado (a11y, controls)
  },
};

export default preview;
```

Explicación simple:

- Las tres líneas de `import '...css'` cargan los mismos estilos que carga la app real. Es exactamente lo mismo que pasa en `layout.tsx`, pero puesto aquí para que aplique a Storybook.
- Un **decorator** es una función que envuelve cada story antes de mostrarla. Aquí decimos: "antes de mostrar cualquier componente, méteme por dentro del componente `Providers` real de la app". Así cada story tiene tema, iconos, toasts, etc. disponibles exactamente como en producción — no estamos inventando una versión falsa de los Providers, es literalmente el mismo archivo que usa la app.

No se agregó nada para simular APIs (MSW) ni "portals" porque, como se explicó arriba, esta app no los usa.

## Paso 4: Escribir las "stories" (los archivos de prueba)

Una "story" es un archivo `.stories.tsx` que vive al lado del componente que prueba, y describe: "así se ve/usa este componente, y esto es lo que debe cumplir".

Como este proyecto es chico (solo tiene dos páginas reales, sin componentes propios reutilizables — todo lo visual viene de Once UI), se escribieron 2 archivos:

### `src/app/(main)/page.stories.tsx`
Prueba la página principal (`Home`). El test ("play function") comprueba dos cosas:
- Que el título "Presence that doesn't beg for attention" se ve.
- Que el botón "Explore docs" es en realidad un link (`<a>`) que apunta a la URL correcta. Esto prueba que la propiedad `href` que le pasamos al componente `Button` realmente llegó al HTML final.

### `src/app/(main)/componentes/page.stories.tsx`
Prueba la página de demo de layouts (columnas y filas). Aquí se agregó también la prueba más importante de todas, llamada **CssCheck**:

```tsx
export const CssCheck: Story = {
  play: async ({ canvas }) => {
    const col1 = canvas.getByText('col1');
    await expect(getComputedStyle(col1.parentElement as HTMLElement).display).toBe('flex');
  },
};
```

¿Por qué es importante esta prueba? Porque un test que solo comprueba "¿el botón está visible?" pasaría igual aunque los CSS de Once UI nunca se hubieran cargado — un `<div>` sin ningún estilo también "está visible", solo que feo y sin estructura. Esta prueba en cambio le pregunta al navegador: "¿cuál es el `display` calculado de este elemento?". Un `<div>` normal tiene `display: block` por defecto. Si da `flex`, es porque el CSS de Once UI (que convierte su componente `Column` en un contenedor flexbox) sí se cargó correctamente. Es la única forma de probar, con un valor concreto, que toda la cadena (imports de CSS + Providers) está funcionando de verdad.

Todas las stories nuevas se marcaron con `tags: ['ai-generated', 'needs-work']` al principio — una convención para decir "esto lo escribió una IA y todavía no se verificó". Una vez que los tests pasaron, se les quitó `'needs-work'`, dejando solo `['ai-generated']`.

## Paso 5: El error raro que apareció al correr los tests

Al correr:

```bash
pnpm exec vitest --project storybook run
```

**Todos** los archivos de story fallaban (incluso los de ejemplo que trae Storybook por defecto, que no tocamos) con este error:

```
ReferenceError: __dirname is not defined
```

Esto pasaba dentro de un archivo interno de Next.js (`ua-parser-js`, una librería que detecta qué navegador está usando el visitante). La causa: Storybook usa Vite (no Webpack) para correr los tests, y Vite ejecuta el código en un entorno tipo "módulos de JavaScript modernos" (ESM) donde la variable `__dirname` (que es propia de Node.js/CommonJS clásico) no existe. Como Next.js internamente todavía usa `__dirname` en algunas partes, y `@storybook/nextjs-vite` carga piezas de Next.js para poder renderizar páginas del App Router, el navegador simulado (Chromium vía Playwright) explotaba apenas arrancaba, antes incluso de leer nuestros archivos de story.

Como fallaba de la misma forma en **todos** los archivos por igual (incluso en los que no tocamos), quedó claro que no era un problema de cómo escribimos las stories, sino de la configuración compartida. La arreglamos en `vitest.config.ts`, agregando:

```ts
export default defineConfig({
  define: {
    __dirname: JSON.stringify(dirname),
  },
  test: { /* ... */ },
});
```

`define` le dice a Vite: "en cualquier parte del código donde veas la palabra `__dirname`, reemplázala directamente por este texto fijo (la ruta del proyecto) antes de ejecutar". Así ya no depende de que exista la variable en tiempo de ejecución — Vite la sustituye de antemano, como un "buscar y reemplazar" a nivel de build. Con este cambio, los 5 archivos de story pasaron a funcionar **dentro de los tests** (`vitest --project storybook run`).

## Paso 6: el mismo error, pero en el servidor real de Storybook

**Importante:** el fix del Paso 5 solo se aplicó a `vitest.config.ts`, que es la configuración que usan los *tests* automáticos. No se aplicó a `.storybook/main.ts`, que es la configuración que usa `storybook dev` — el servidor que efectivamente abrís en el navegador para mirar las stories a mano.

Esto no se notó de inmediato porque son dos configuraciones de Vite separadas, y los tests pasaban perfecto. Pero al correr `pnpm exec storybook dev -p 6006` y abrir cualquier story en el navegador, la pantalla se quedaba con el spinner de carga para siempre — el mismo `ReferenceError: __dirname is not defined`, esta vez explotando dentro del proceso de Vite que sirve el navegador, sin mostrar ningún error visible en pantalla.

La solución fue copiar exactamente el mismo truco a `.storybook/main.ts`, usando el gancho `viteFinal` que Storybook expone para modificar su configuración de Vite antes de arrancar:

```ts
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const dirname =
  typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url));

const config: StorybookConfig = {
  // ...resto de la config...
  viteFinal: async (viteConfig) => {
    viteConfig.define = {
      ...viteConfig.define,
      __dirname: JSON.stringify(dirname),
    };
    return viteConfig;
  },
};
```

**Moraleja para el futuro:** si `storybook dev` se queda cargando sin mostrar error, y en particular si acabás de tocar `.storybook/main.ts` o actualizar dependencias, revisar primero si este `define` sigue ahí. También conviene borrar `node_modules/.cache/storybook` y reiniciar el servidor limpio (`lsof -ti:6006 | xargs -r kill -9` antes de volver a levantarlo), por si quedó una versión vieja de la config cacheada.

## Paso 7: Limpieza

Storybook, al instalarse, agrega una carpeta `src/stories/` con componentes y stories de ejemplo genéricos (no relacionados a Once UI ni a esta app) solo para que tengas algo que ver la primera vez que abres Storybook. Una vez que confirmamos que **nuestras** stories reales funcionan, se borró esa carpeta de ejemplo (`Button`, `Header`, `Page`, sus `.css` y las imágenes de `assets/`) porque ya no aporta nada y solo generaría confusión o falsos positivos en los tests.

## Paso 8: Verificación final

Con la carpeta de ejemplo ya borrada, solo quedan las stories reales del proyecto:

```bash
pnpm exec vitest --project storybook run   # 2 archivos, 3 tests, todos verdes
pnpm exec tsc --noEmit                     # sin errores de TypeScript
pnpm exec storybook dev -p 6006            # abre en el navegador sin quedarse cargando
```

## Resumen en una frase

Se le enseñó a Storybook a envolver cada componente exactamente igual que lo hace `layout.tsx` en la app real (mismos CSS, mismo árbol de Providers), se escribieron pruebas para las dos páginas reales del proyecto, se probó con un valor de CSS concreto (`display: flex`) que los estilos de Once UI de verdad se cargan, y se corrigió el mismo choque de compatibilidad entre Next.js y Vite (`__dirname`) en **dos configuraciones distintas** — la de los tests y la del servidor de desarrollo real — porque arreglar solo una no alcanza para que todo funcione de punta a punta.

## Nota (sesión posterior)

Este documento describe el setup original. Una sesión posterior de trabajo agregó ~120 archivos de stories documentando (casi) todos los componentes de Once UI, organizados en categorías, y encontró/corrigió el problema del Paso 6 descrito arriba (que en ese momento seguía sin arreglar). El estado actual completo del proyecto — qué falta, comandos de verificación, gotchas conocidos — está en `HANDOFF.md` en la raíz del repo.
