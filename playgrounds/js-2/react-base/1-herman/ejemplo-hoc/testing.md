# Como testear HOCs (explicado para tontos, incluido yo)

Esta carpeta tiene tests reales que corren de verdad. Este archivo explica
QUE es cada cosa, DONDE esta y COMO correrla, sin dar nada por sabido.

## 1. Que es un test aca

Un test es un archivo `*.test.tsx` que:
1. Renderiza un componente (o un componente ya envuelto por un HOC).
2. Busca cosas en el resultado ("¿aparece el texto X?", "¿tiene esta clase css?").
3. Si lo que encuentra no coincide con lo que se esperaba, el test falla y
   te dice exactamente que linea rompio.

No probamos "que el codigo compile" (eso ya lo hace TypeScript). Probamos
"que el componente se comporte como digo que se comporta".

## 2. Archivos de config (nuevos, los agregue yo)

| Archivo | Para que sirve |
|---|---|
| `vitest.config.ts` | Le dice a Vitest COMO correr los tests de esta carpeta: en un DOM simulado (jsdom), y que use `vitest.setup.ts` antes de cada archivo de test. |
| `vitest.setup.ts` | Solo importa `@testing-library/jest-dom/vitest`, que agrega matchers como `toBeInTheDocument()` o `toHaveClass()` a `expect(...)`. Sin esto esos metodos no existen. |

### 2.1 `vitest.config.ts` linea por linea

```ts
export default defineConfig({
    plugins: [react()],
    test: {
        include: ["**/*.test.{ts,tsx}"],
        setupFiles: ["./vitest.setup.ts"],
        environment: "jsdom",
    },
});
```

- `plugins: [react()]` — deja que Vitest entienda JSX/TSX (via el plugin de
  Vite para React), igual que en desarrollo normal.
- `test.include` — patron de que archivos cuentan como test: cualquier
  `*.test.ts` o `*.test.tsx` dentro de esta carpeta.
- `test.setupFiles: ["./vitest.setup.ts"]` — antes de correr CUALQUIER
  test, ejecuta primero `vitest.setup.ts`. Ahi se cargan los matchers extra
  (ver 2.2).
- `test.environment: "jsdom"` — en vez de un navegador real, usa `jsdom`:
  una libreria que simula el DOM (documento, elementos, eventos) dentro de
  Node, sin abrir ningun navegador de verdad. Alcanza para lo que probamos
  aca (texto en pantalla, clases css) y no necesita instalar ningun
  binario aparte — es un paquete npm mas, entra con `pnpm install`.

### 2.2 `vitest.setup.ts`, la unica linea que tiene

```ts
import "@testing-library/jest-dom/vitest";
```

Registra matchers extra en `expect()`: `toBeInTheDocument()`,
`toHaveClass()`, `toHaveAttribute()`, etc. Sin este import esos metodos no
existen y `expect(elemento).toHaveClass(...)` tira error. `setupFiles` en
el config de arriba es lo que engancha este archivo para que corra antes
de cada test.

### 2.3 ¿Por que estos dos archivos estan EN ESTA carpeta y no en la raiz?

Porque `ejemplo-hoc/` vive fuera de `src/`, y el config de la raiz
(`react-base/vite.config.ts`) solo busca tests en `src/**/*.stories.tsx`:

```ts
storybookTest({ configDir: path.join(dirname, '.storybook') })
```

y `.storybook/main.ts` tiene
`stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"]`
— el glob apunta a `src/`, nada mas.

Vitest busca su config subiendo desde el directorio donde lo corres, y se
queda con el primer `vite.config.*`/`vitest.config.*` que encuentra. Si
corres `npx vitest` parado en `ejemplo-hoc/`, encuentra
`ejemplo-hoc/vitest.config.ts` primero y usa ESE — ni siquiera llega a
mirar el de la raiz. Por eso, poniendo el config y el setup aca, esta
carpeta queda autonoma: no depende de que alguien mueva estos archivos a
`src/`, ni de tocar el config de la raiz (que es compartido con el resto
del proyecto real).

La alternativa hubiera sido mover `component/` y `hoc/` dentro de `src/` y
escribir `*.stories.tsx` con funciones `play` para que el proyecto
"storybook" los levante. No lo hice porque esta carpeta es de
practica/aprendizaje — mezclarla con `src/` real la ataria al proyecto
principal.

**¿Por que jsdom aca y no un navegador real (Playwright), como el config de
la raiz (`react-base/vite.config.ts`)?**
Porque para lo que probamos (texto en pantalla, clases css) jsdom es igual
de fiel y mucho mas liviano: no necesita descargar un navegador aparte
(`npx playwright install chromium`, ~180MB), y arranca mas rapido porque
no abre un proceso de Chromium real. Lo unico que se pierde es fidelidad
en cosas que SI dependen de un navegador de verdad (layout real, algunas
APIs del DOM tipo `ResizeObserver`), que no usamos en estos tests. Ese es
el trade-off: el config de la raiz usa navegador real porque corre las
mismas stories que ve Storybook y ahi si importa la fidelidad al 100%;
esta carpeta prioriza que sea facil de correr sin instalar nada extra.

Nota: con jsdom vas a ver en la consola mensajes tipo
`Could not parse CSS stylesheet`. Es jsdom quejandose del `<style>`
raro que tiene `component/ejemplo.component.tsx` (con `contentEditable` y
CSS medio invalido adentro) — no es un error de los tests, es una rareza
de ese componente que ya estaba en el codigo. Los tests igual pasan.

## 3. Como correr los tests

Parado dentro de esta carpeta (`1-herman/ejemplo-hoc`):

```bash
npx vitest run          # corre todo una vez y termina
npx vitest               # modo watch: reintenta cuando guardas un archivo
npx vitest run withCustomText   # corre solo los tests que matcheen ese nombre
```

No hace falta instalar nada aparte de las dependencias normales del
proyecto (`pnpm install` en la raiz de `react-base/`) — a diferencia de
los tests con navegador real, jsdom no necesita descargar ningun binario.

Si ves una carpeta `node_modules/` aparecer en esta carpeta despues de
correr los tests: es normal, es solo cache de Vite (`.vite`,
`.vite-temp`), no paquetes reales. Ya esta cubierta por `.gitignore`, no
hace falta tocarla (la podes borrar, se regenera sola).

## 4. Que hay en `component/ejemplo.component.test.tsx`

Testea el componente **sin ningun HOC encima**. Esto es la base: antes de
probar un HOC, tenes que saber que hace el componente "pelado", asi despues
podes distinguir "esto lo hace el componente" de "esto lo agrega el HOC".

- `Component` necesita `flag1`, `text` y `styles` (las 3 son obligatorias).
  - Si `flag1` es `true` muestra `text`.
  - Si `flag1` es `false` muestra `"nope"` (ignora `text` por completo).
  - La clase css que le pone al `<p>` es la que le pasaste en `styles.texto`.
- `Component1` solo necesita `extraText`, y encima es **opcional**: si no se
  lo pasas, usa `"extraText"` como valor por defecto.

## 5. Que es un HOC (repaso rapido antes de ver sus tests)

HOC = Higher Order Component = **una funcion que recibe un componente y
devuelve OTRO componente**. No es magia, es una funcion normal:

```
HOC(ComponenteA) -> ComponenteB
```

`ComponenteB` es casi siempre "lo mismo que A, pero con alguna prop ya
resuelta o alguna prop nueva agregada". El detalle de tipos (`ver hoc.md`)
distingue dos familias:

- **Mutadores** (`hoc/withCustomText`, `hoc/withModuleStyle`): agarran un
  componente que YA tenia una prop obligatoria, y devuelven un componente
  que ya no la necesita (porque el HOC se la inyecta el solo).
- **Inyectores** (`hoc/withOptionalExtraText`): agarran un componente que
  NO tenia cierta prop, y devuelven un componente que ahora SI la puede
  recibir (como algo opcional, agregado por fuera).

Testear un HOC significa, en la practica, siempre probar estas 3 cosas:

1. **Cuando no le doy configuracion**, ¿usa un valor por defecto razonable?
2. **Cuando SI le doy configuracion**, ¿ese valor pisa al default?
3. **Las props que el HOC no toca**, ¿le siguen llegando bien al componente
   de adentro? (esto es lo que mas se rompe si el HOC esta mal escrito)

## 6. `hoc/withCustomText/withCustomText.test.tsx`

`withCustomText` secuestra `text` y `flag1`. Se usa asi:

```ts
withCustomText({ text: "hola", flag1: true })(Component)
```

El componente que te devuelve **ya no acepta** `text` ni `flag1` como
props: esos valores quedan fijos desde que llamaste a `withCustomText(...)`.

Tests que agregue:
- Sin config -> usa los defaults del HOC (`"default text"`, `flag1=true`).
- Con config -> usa lo que le pasaste.
- `flag1=false` -> se ve `"nope"` (confirma que el componente de adentro
  se sigue comportando igual, el HOC no le cambia esa logica).
- `styles` (que este HOC NO maneja) le sigue llegando bien al componente.

## 7. `hoc/withModuleStyle/withModuleStyle.test.tsx`

`withModuleStyle` secuestra `styles`. Se usa asi:

```ts
withModuleStyle({ styles: miModuloCss })(Component)
// o sin nada, usa un css module por defecto:
withModuleStyle({})(Component)
```

Tests que agregue:
- Sin config -> usa el modulo css por defecto del propio HOC
  (`./ejemplo.module.css`).
- Con config -> usa el modulo css que le pasaste.
- `flag1`/`text` (que este HOC NO maneja) le siguen llegando bien.

**Nota rara que encontre haciendo el test:** `ejemplo1.module.css`,
`ejemplo2.module.css` y `hoc/withModuleStyle/ejemplo.module.css` tienen
exactamente el mismo contenido (mismo texto, letra por letra). Como en
este proyecto el nombre de clase final de un CSS Module sale de un hash
del *contenido* del archivo, esos 3 archivos generan el mismo nombre de
clase final aunque sean archivos distintos. No es un bug de los tests, es
un dato real sobre como esta armado el ejemplo — si algun dia cambias el
contenido de alguno de esos `.css`, las clases van a dejar de coincidir.

## 8. `hoc/withOptionalExtraText/withOptionalExtraText.test.tsx`

`withOptionalExtraText` es distinto a los otros dos: no secuestra nada, le
**inyecta una prop nueva y opcional** (`extraText`) a un componente que
antes no la tenia. Se usa asi:

```ts
withOptionalExtraText(Component)
```

Tests que agregue:
- Sin `extraText` -> no aparece ningun `<p>` extra, solo se ve el
  componente de adentro tal cual.
- Con `extraText` -> aparece un `<p>` con ese texto, ADEMAS del componente
  de adentro (no lo reemplaza).
- `extraText` no se le "filtra" al componente de adentro: el HOC la separa
  del resto de props (`const { extraText, ...rest } = props`) antes de
  pasarle `rest` al componente envuelto. Lo probamos con un componente
  espia que imprime que props le llegaron.

## 9. `hoc/hoc.test.tsx`: combinando HOCs

Este archivo prueba lo mas interesante: **encadenar HOCs**. Cada HOC
secuestra una prop distinta, asi que si los combinas todos, el componente
final puede terminar sin necesitar NINGUNA prop obligatoria:

```ts
const FullyWrapped = withCustomText({})(
    withModuleStyle({})(Component)
);

<FullyWrapped />  // sin props! los dos HOCs ya resolvieron todo
```

Como se lee esto de adentro hacia afuera:
1. `withModuleStyle({})(Component)` -> devuelve un componente que ya no
   necesita `styles` (le queda faltando `flag1` y `text`).
2. `withCustomText({})( ese resultado )` -> devuelve un componente que
   tampoco necesita `flag1` ni `text`.
3. Resultado: un componente que no le falta nada.

Esto es la misma idea que usan `ejemplo.fib.tsx` y `ejemplo.builder.tsx` en
esta carpeta (una forma "encadenada" de armar el mismo tipo de composicion),
solo que ahi esta escrito como builder/fluent-API en vez de llamadas
anidadas de funciones.

## 10. Receta para agregar un test a un HOC nuevo

Cuando crees un HOC nuevo en esta carpeta, copia este esqueleto y
completalo (viendo la seccion 5 de este archivo para saber que preguntas
hacerte):

```tsx
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import miNuevoHoc from "./miNuevoHoc";
import { Component } from "../../component/ejemplo.component"; // o el que uses

afterEach(() => {
    cleanup(); // importante: si no limpias, un test puede "ver" el DOM del anterior
});

describe("miNuevoHoc", () => {
    it("sin config usa un valor por defecto razonable", () => {
        // ...
    });

    it("con config usa el valor que le pasaron", () => {
        // ...
    });

    it("no rompe las props que no maneja", () => {
        // ...
    });
});
```

Y para correrlo: `npx vitest run miNuevoHoc` desde esta carpeta.
