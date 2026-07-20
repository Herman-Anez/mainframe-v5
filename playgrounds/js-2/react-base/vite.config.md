# `vite.config.ts` explicado para tontos (incluido yo)

Este documento explica, linea por linea, que hace
`playgrounds/js-2/react-base/vite.config.ts`. Es el config raiz de TODO el
proyecto `react-base` (no solo de un ejemplo puntual como
`1-herman/ejemplo-hoc`).

## 0. Antes que nada: que es Vite y que es Vitest

Son dos cosas relacionadas pero distintas, facil confundirlas:

- **Vite** = herramienta que arranca tu app en desarrollo (`npm run dev`) y
  la empaqueta para produccion (`npm run build`). Piensa "servidor + bundler".
- **Vitest** = el corredor de tests, hecho por el mismo equipo de Vite, que
  REUTILIZA la config de Vite (mismos plugins, mismo resolve de imports,
  etc.) para que los tests vean el codigo exactamente igual que la app real.

Por eso un solo archivo `vite.config.ts` puede tener configuracion para
ambas cosas: la parte de siempre (`plugins`, `server`, etc.) y una parte
extra llamada `test` que solo usa Vitest.

## 1. El archivo completo, para tener referencia

```ts
/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react, { reactCompilerPreset } from '@vitejs/plugin-react';
import babel from '@rolldown/plugin-babel';

import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { playwright } from '@vitest/browser-playwright';
const dirname = typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react(), babel({
    presets: [reactCompilerPreset()]
  })],
  server: {
    fs: {
      allow: [path.resolve(dirname, '../../..')]
    }
  },
  test: {
    projects: [{
      extends: true,
      plugins: [
        storybookTest({
          configDir: path.join(dirname, '.storybook')
        })
      ],
      test: {
        name: 'storybook',
        browser: {
          enabled: true,
          headless: true,
          provider: playwright({}),
          instances: [{
            browser: 'chromium'
          }]
        }
      }
    }]
  }
});
```

Ahora lo desarmamos pieza por pieza.

## 2. Linea 1: `/// <reference types="vitest/config" />`

```ts
/// <reference types="vitest/config" />
```

Esto NO es codigo que se ejecute. Es una instruccion para TypeScript: "che,
cargate los tipos de `vitest/config`". La necesitas porque mas abajo el
objeto de config tiene una propiedad `test: {...}` que **no existe** en el
tipo normal de Vite — solo existe si Vitest "amplia" ese tipo. Sin esta
linea, TypeScript te marcaria error en `test: {...}` diciendo que esa
propiedad no es valida.

## 3. Los imports (lineas 2-10)

```ts
import { defineConfig } from 'vite';
import react, { reactCompilerPreset } from '@vitejs/plugin-react';
import babel from '@rolldown/plugin-babel';

import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { playwright } from '@vitest/browser-playwright';
```

Uno por uno:

- **`defineConfig`** (de `vite`): funcion helper que no hace nada magico,
  solo te da autocompletado/tipos cuando escribis el objeto de config. Es
  el equivalente a "esto que estoy escribiendo es un config de Vite".

- **`react`** (de `@vitejs/plugin-react`): el plugin oficial que le enseña
  a Vite a entender archivos `.jsx`/`.tsx` y a hacer Hot Module Replacement
  (que al guardar un componente se actualice en el navegador sin recargar
  toda la pagina).

- **`reactCompilerPreset`** (tambien de `@vitejs/plugin-react`): un preset
  de Babel para el **React Compiler**. El React Compiler es una herramienta
  nueva de React que analiza tus componentes y les agrega memoizacion
  automatica (lo que antes escribias a mano con `useMemo`/`useCallback`/
  `React.memo`). Este preset es lo que activa esa magia en el build.

- **`babel`** (de `@rolldown/plugin-babel`): plugin de Vite que corre
  Babel como paso de transformacion. Vite normalmente usa esbuild (mas
  rapido) y NO Babel, pero el React Compiler es un plugin de Babel, asi
  que hace falta este puente para poder usarlo dentro de Vite.

- **`path`** y **`fileURLToPath`** (de Node.js, no de una libreria): sirven
  para trabajar con rutas de archivos del sistema operativo. Se explican
  en el punto 4.

- **`storybookTest`** (de `@storybook/addon-vitest/vitest-plugin`): plugin
  que conecta Storybook con Vitest. Lee tus archivos `*.stories.tsx` y
  genera un test por cada "story" (cada variante que definiste en
  Storybook). Se explica en el punto 6.

- **`playwright`** (de `@vitest/browser-playwright`): el "motor" que le
  dice a Vitest como abrir un navegador real (Chromium) para correr los
  tests ahi, en vez de simular el DOM con algo como jsdom.

## 4. Linea 11: reconstruyendo `__dirname`

```ts
const dirname = typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url));
```

`__dirname` es una variable magica que en CommonJS (el sistema de modulos
"viejo" de Node, el de `require(...)`) te da automaticamente la carpeta
donde esta el archivo actual. Pero este proyecto usa **ESM** (el sistema
"moderno", el de `import ... from ...`, fijate que `package.json` tiene
`"type": "module"`), y en ESM `__dirname` **no existe**.

Esta linea es la forma estandar de conseguir el equivalente en ESM:
1. `import.meta.url` te da la ubicacion del archivo actual como una URL
   (ej: `file:///home/.../vite.config.ts`).
2. `fileURLToPath(...)` convierte esa URL en una ruta de archivo normal
   (ej: `/home/.../vite.config.ts`).
3. `path.dirname(...)` se queda solo con la carpeta, sacando el nombre del
   archivo (ej: `/home/.../react-base`).

El `typeof __dirname !== 'undefined' ? __dirname : ...` de adelante es una
proteccion por si en algun entorno raro `__dirname` SI existiera (no pasa
en este proyecto, pero es un patron defensivo comun).

**En resumidas cuentas:** `dirname` termina siendo la ruta absoluta a la
carpeta `react-base/`, y se usa mas abajo para armar otras rutas relativas
a ella sin importar desde donde ejecutes el comando.

## 5. `plugins` y `server.fs.allow`

```ts
export default defineConfig({
  plugins: [react(), babel({
    presets: [reactCompilerPreset()]
  })],
  server: {
    fs: {
      allow: [path.resolve(dirname, '../../..')]
    }
  },
  ...
```

- **`plugins`**: la lista de plugins que se aplican SIEMPRE (en `dev`, en
  `build`, y tambien los heredan los tests). Aca son dos: el plugin de
  React normal, y el puente de Babel con el preset del React Compiler.

- **`server.fs.allow`**: por seguridad, el servidor de desarrollo de Vite
  por defecto **no deja servir archivos fuera de la raiz del proyecto**
  (para que una pagina no pueda pedir, por ejemplo, tu `/etc/passwd` o
  archivos de otro proyecto). `allow` es una lista blanca de carpetas
  extra que si se pueden servir.

  Aca el valor es `path.resolve(dirname, '../../..')` — o sea, subir 3
  niveles desde `react-base/`. Contando desde
  `playgrounds/js-2/react-base/`, tres niveles arriba es `playgrounds/`.
  Esto existe porque hay cosas fuera de `react-base/` (como
  `playgrounds/js-2/3-react` o tu carpeta `1-herman/`) que en algun momento
  se sirvieron o importaron desde este dev server, y sin este `allow` Vite
  las hubiera bloqueado con un error 403.

## 6. La parte de tests: `test.projects`

```ts
  test: {
    projects: [{
      extends: true,
      plugins: [
        storybookTest({
          configDir: path.join(dirname, '.storybook')
        })
      ],
      test: {
        name: 'storybook',
        browser: {
          enabled: true,
          headless: true,
          provider: playwright({}),
          instances: [{
            browser: 'chromium'
          }]
        }
      }
    }]
  }
```

Esto es solo para Vitest (no afecta `dev` ni `build`).

### 6.1 ¿Que es `test.projects`?

Vitest 4 permite definir varios "proyectos" (sub-configuraciones) dentro
de un mismo comando `vitest`. Por ejemplo, un proyecto para tests unitarios
rapidos y otro proyecto distinto para tests de integracion mas lentos, cada
uno con su propia config de navegador/plugins. Aca solo hay **un
proyecto**, llamado `"storybook"`.

### 6.2 `extends: true`

Le dice a este proyecto "no arranques de cero, heredá la config de arriba"
(el `plugins` y el `server` que vimos en el punto 5). Sin esto tendrias que
repetir `react()` y todo lo demas adentro de este proyecto tambien.

### 6.3 El plugin `storybookTest`

```ts
storybookTest({
  configDir: path.join(dirname, '.storybook')
})
```

Este es el plugin que hace la magia real. Le decis donde esta la
configuracion de Storybook (`configDir: .storybook/`), y el plugin:

1. Lee `.storybook/main.ts`, que tiene esto:
   ```ts
   stories: [
     "../src/**/*.mdx",
     "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"
   ]
   ```
   O sea: **solo mira archivos `*.stories.tsx` (o similares) dentro de
   `src/`**. Nada fuera de `src/` cuenta.

2. Por cada "story" que encuentra (cada export de un archivo
   `*.stories.tsx`), genera automaticamente un test de Vitest. Si esa story
   tiene una funcion `play` (una funcion que simula interacciones del
   usuario: clicks, escribir texto, etc.), la ejecuta y valida los
   `expect(...)` que tenga adentro. Si no tiene `play`, el test simplemente
   confirma que el componente renderiza sin tirar error.

**Este es el motivo por el cual tus tests en `1-herman/ejemplo-hoc/`
necesitaron su PROPIO `vitest.config.ts`** (ver `1-herman/ejemplo-hoc/testing.md`,
seccion 2.3): esa carpeta esta fuera de `src/`, entonces este plugin ni
siquiera la mira. No es un bug, es que este archivo esta configurado a
proposito para trabajar solo con Storybook + `src/`.

### 6.4 `test.name: 'storybook'`

Simplemente el nombre de este proyecto, para identificarlo en la salida de
la consola cuando corres `vitest` (vas a ver algo como
`✓ |storybook| src/stories/Button.stories.tsx`).

### 6.5 `test.browser`: correr en un navegador real

```ts
browser: {
  enabled: true,
  headless: true,
  provider: playwright({}),
  instances: [{ browser: 'chromium' }]
}
```

- `enabled: true` — en vez de simular el DOM con algo como jsdom, Vitest
  abre un navegador de verdad para cada test.
- `headless: true` — ese navegador corre sin ventana visible (mas rapido,
  y es obligatorio en servidores/CI donde no hay pantalla).
- `provider: playwright({})` — el motor que sabe controlar navegadores es
  Playwright (la libreria que tambien usa Storybook para sus propios
  tests visuales).
- `instances: [{ browser: 'chromium' }]` — de los navegadores que soporta
  Playwright (Chromium, Firefox, WebKit), este proyecto solo usa Chromium.

**¿Por que un navegador real y no algo simulado?** Porque este proyecto
usa el mismo navegador para correr las stories que despues renderiza
Storybook — quiere fidelidad al 100% (CSS real, layout real, APIs del
navegador reales), no una simulacion. `jsdom` si esta instalado en el
proyecto (se agrego como devDependency para los tests de
`1-herman/ejemplo-hoc/`, que priorizan velocidad y cero instalacion extra
por sobre fidelidad — ver `1-herman/ejemplo-hoc/testing.md` seccion 2.3),
pero este proyecto raiz sigue usando Playwright a proposito, porque es lo
que corre contra las mismas stories que ve Storybook.

## 7. Como se usa esto en la practica

Comandos relevantes (definidos en `package.json`):

```bash
npm run dev              # arranca el servidor de desarrollo (usa plugins + server.fs.allow)
npm run build             # compila para produccion (usa plugins, tsc -b primero)
npm run storybook         # levanta la UI de Storybook (usa .storybook/main.ts)
npx vitest run             # corre el proyecto "storybook": un test por cada *.stories.tsx en src/
```

Si algun dia queres que tests fuera de `src/` (como los de
`1-herman/ejemplo-hoc/`) se corran desde este mismo comando `vitest`, dos
opciones:

1. Agregar otro objeto dentro de `test.projects` que apunte a esa carpeta
   (sin el plugin `storybookTest`, con su propio `include` de archivos
   `*.test.tsx`).
2. Mover esos archivos dentro de `src/` y escribirlos como
   `*.stories.tsx` con funciones `play`, para que el proyecto
   `"storybook"` los levante solo.

Mientras tanto, cada carpeta de ejemplo que quiera tests corridos aparte
(como `ejemplo-hoc/`) necesita su propio `vitest.config.ts` local — ver
`1-herman/ejemplo-hoc/testing.md`.
