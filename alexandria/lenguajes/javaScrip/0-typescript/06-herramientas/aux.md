## 01-tsc-cli.md

El comando `tsc` es la puerta de entrada al compilador TypeScript. Aunque a menudo se usa de forma sencilla, dispone de un conjunto completo de opciones que permiten desde compilaciones rápidas hasta flujos de CI optimizados con builds incrementales y referencias entre proyectos.

### Sintaxis y modos de ejecución

```bash
tsc [options] [files...]
```

- **Sin argumentos**: busca `tsconfig.json` en la carpeta actual y compila el proyecto definido.
- **Con archivos**: `tsc archivo1.ts archivo2.ts` compila esos archivos ignorando el `tsconfig.json`. Las opciones por defecto del compilador se aplican.
- **`--project` / `-p`**: especifica un directorio con `tsconfig.json` o el archivo directamente.  
  `tsc -p ./src`  o  `tsc -p tsconfig.build.json`
- **`--build` / `-b`**: modo de construcción para project references.  
  `tsc -b src/tsconfig.json --verbose`
- **`--watch` / `-w`**: entra en modo observador y recompila al detectar cambios.

### Opciones de compilación rápida

| Opción | Descripción |
|--------|-------------|
| `--noEmit` | Realiza solo el chequeo de tipos, sin emitir JavaScript. Ideal en CI o junto a otros transpiladores. |
| `--pretty` | Salida con colores y formato (por defecto activo). |
| `--noErrorTruncation` | Muestra mensajes de error completos sin truncar. |
| `--diagnostics` | Imprime estadísticas de tiempo de compilación. |
| `--extendedDiagnostics` | Aún más detalle sobre memoria y fases. |
| `--listFiles` | Lista los archivos que forman parte del programa. |
| `--listEmittedFiles` | Muestra qué archivos JS se emitieron. |
| `--showConfig` | Imprime la configuración final (hereda extend, referencias, etc.). Muy útil para depurar tsconfig. |
| `--traceResolution` | Traza la resolución de cada módulo. Perfecto para depurar problemas de "Cannot find module". |
| `--generateTrace` | Genera un archivo de traza para analizar rendimiento. |

### Modo `--build` para proyectos compuestos

Cuando se trabaja con project references (véase tema 03-04), `tsc -b` construye el grafo de dependencias y compila en orden, respetando la caché incremental. Es mucho más rápido que `tsc -p` sobre cada proyecto individualmente.

Opciones importantes para `--build`:
- `--verbose`: muestra cada proyecto que se compila y el tiempo empleado.
- `--dry`: simula la compilación sin emitir archivos, útil para ver qué proyectos se compilarían.
- `--clean`: elimina los archivos de salida de los proyectos (`outDir`, `.tsbuildinfo`).
- `--force`: fuerza la recompilación de todos los proyectos ignorando la caché.

Ejemplo en monorepo:

```bash
tsc -b packages/*/tsconfig.json --verbose
```

### Modo observador (`--watch`)

`tsc --watch` o `tsc -w` recompila automáticamente al guardar cambios. Se puede configurar en `tsconfig.json` mediante la propiedad `watchOptions`:

```json
{
  "watchOptions": {
    "watchFile": "useFsEvents",
    "watchDirectory": "useFsEvents",
    "fallbackPolling": "dynamicPriority",
    "excludeDirectories": ["**/node_modules"]
  }
}
```

Esto permite afinar el comportamiento según el sistema operativo y el tamaño del proyecto.

### Salida con colores y formato

- `--pretty` (por defecto) colorea los mensajes. Se puede desactivar con `--pretty false` para logs en CI.
- Los códigos de error (ej. `TS2322`) se pueden buscar en la documentación o usar `tsc --explainError 2322`.

### Integración en npm scripts

```json
{
  "scripts": {
    "build": "tsc -p tsconfig.build.json",
    "watch": "tsc -p tsconfig.build.json --watch",
    "typecheck": "tsc --noEmit",
    "clean": "tsc --build tsconfig.build.json --clean"
  }
}
```

### Uso con `ts-node` y similares

`ts-node` utiliza `tsc` internamente para compilar sobre la marcha. Se puede pasar opciones similares mediante variables de entorno o configuración:

```bash
ts-node -P tsconfig.json script.ts
TS_NODE_PROJECT="./tsconfig.json" node --loader ts-node/esm script.ts
```

### Trucos avanzados

- Para verificar tipos sin emitir y con proyectos referenciados, usa `tsc -b --dry --noEmit` (dependiendo de la versión). Lo más común es `tsc -b --noEmit` aunque `--noEmit` no siempre es compatible con `-b`. En su lugar, se puede hacer un `tsc -b` con un proyecto raíz que tenga `"noEmit": true` y referencias a los demás.
- `tsc --init` genera un `tsconfig.json` con los ajustes recomendados y comentarios explicativos. Excelente punto de partida.

---

## 02-tsc-api.md

El compilador de TypeScript expone una API pública (paquete `typescript`) que permite análisis, transformación y emisión de código de manera programática. Es la base sobre la que se construyen herramientas como linters, formateadores, generadores de documentación y plugins de editores.

### Instalación y objeto principal

```bash
npm install typescript
```

El módulo exporta la función principal `ts` que contiene todas las utilidades. Los conceptos clave son:

- **`ts.System`**: abstracción del sistema de archivos.
- **`ts.CompilerHost`**: interfaz entre el compilador y el entorno. Se puede implementar para leer archivos virtuales.
- **`ts.createProgram`**: crea un programa que contiene todos los archivos fuente y sus dependencias.
- **`ts.Program`**: representa el proyecto compilado, con acceso al AST, diagnóstico y emisión.
- **`ts.LanguageService`**: nivel más alto, usado para autocompletado, refactors, etc.

### Ejemplo mínimo: chequeo de tipos de un archivo

```ts
import * as ts from "typescript";

const fileNames = ["src/index.ts"];
const options: ts.CompilerOptions = {
  target: ts.ScriptTarget.ES2022,
  module: ts.ModuleKind.ESNext,
  strict: true,
  noEmit: true
};

const program = ts.createProgram(fileNames, options);
const diagnostics = ts.getPreEmitDiagnostics(program);

diagnostics.forEach(diagnostic => {
  const message = ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n");
  if (diagnostic.file) {
    const { line, character } = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start!);
    console.log(`${diagnostic.file.fileName} (${line + 1},${character + 1}): ${message}`);
  } else {
    console.log(message);
  }
});

if (diagnostics.length === 0) {
  console.log("Sin errores.");
}
```

### Transformaciones personalizadas (Custom Transformers)

Se pueden modificar el AST antes o después de la emisión. Los transformers se pasan a `program.emit()`.

```ts
const transformer: ts.TransformerFactory<ts.SourceFile> = context => {
  return sourceFile => {
    function visit(node: ts.Node): ts.Node {
      if (ts.isCallExpression(node) && node.expression.getText() === "debug") {
        return ts.createCall(ts.createIdentifier("console.log"), undefined, node.arguments);
      }
      return ts.visitEachChild(node, visit, context);
    }
    return ts.visitNode(sourceFile, visit);
  };
};

program.emit(undefined, undefined, undefined, undefined, {
  before: [transformer]
});
```

Esta capacidad permite desde eliminar logs en producción hasta añadir metadatos. Herramientas como `ts-patch` y `ttypescript` permiten usar transformers declarados en `tsconfig.json`.

### Build API y Project References

Desde TypeScript 3.0 existe `ts.createSolutionBuilder` para orquestar la construcción de múltiples proyectos con referencias. Emula el comportamiento de `tsc --build`.

```ts
const host = ts.createSolutionBuilderHost(ts.sys, undefined, ts.createBuilderProgram);
const builder = ts.createSolutionBuilder(host, ["tsconfig.app.json"], {});
const exitStatus = builder.build();
```

Esto respeta la caché incremental y emite solo lo necesario.

### Language Service

El `LanguageService` proporciona operaciones de alto nivel sin necesidad de compilar todo el programa (útil para editores). Ofrece completions, quickInfo, diagnostics por archivo, etc.

```ts
const service = ts.createLanguageService(host);
const completions = service.getCompletionsAtPosition("file.ts", 10, {});
```

### Casos de uso habituales

- **Linters y reglas personalizadas** (ESLint internamente no usa la API de TS para análisis sintáctico, sino `@typescript-eslint/parser` que se basa en el AST de TS).
- **Generadores de código** (tipo `graphql-codegen`, `prisma`).
- **Herramientas de documentación** (TypeDoc usa la API).
- **Migraciones y codemods** (usando `ts-morph` que envuelve la API de TS).
- **Pruebas de tipos** (se puede usar `ts.createProgram` para verificar que ciertos fragmentos dan errores esperados).

### Limitaciones y alternativas

La API es estable pero muy verbosa y con documentación a veces escasa. Librerías como `ts-morph` y `tsutils` facilitan el trabajo con el AST. Para analizar archivos individuales sin contexto de proyecto, `ts.createSourceFile` es útil.

---

## 03-babel-esbuild-swc.md

TypeScript es un compilador completo, pero su velocidad de transpilación puede ser un cuello de botella en proyectos grandes. Babel, esbuild y SWC ofrecen transpilación ultrarrápida, delegando el chequeo de tipos a `tsc --noEmit`. Este enfoque híbrido es el estándar en la industria actual.

### ¿Por qué otro transpilador?

- **Velocidad**: Babel con `@babel/preset-typescript` es mucho más rápido que `tsc` para transpilar (no chequea tipos). esbuild y SWC son aún más rápidos (escritos en Go y Rust respectivamente).
- **Ecosistema**: Babel tiene un ecosistema masivo de plugins (propuestas TC39, optimizaciones, JSX). esbuild empaqueta y transpila; SWC se integra en herramientas como Next.js y Parcel.
- **Flexibilidad**: puedes elegir diferentes plugins y configuraciones que `tsc` no soporta directamente.

### Flujo de trabajo híbrido

1. **Desarrollo**: usa Babel/esbuild/SWC para transpilar TS a JS (o directamente en el servidor de desarrollo).
2. **Chequeo de tipos**: ejecuta `tsc --noEmit` por separado (en paralelo o en CI). El editor (VS Code) sigue usando el Language Service de TypeScript para mostrar errores en tiempo real.
3. **Producción**: mismo transpilador, más optimizaciones. El chequeo de tipos se asegura antes de hacer el build final.

### Babel + TypeScript

**Instalación**:
```bash
npm install --save-dev @babel/core @babel/preset-env @babel/preset-typescript
```

**Configuración** (`babel.config.json`):
```json
{
  "presets": [
    ["@babel/preset-env", { "targets": "defaults" }],
    "@babel/preset-typescript"
  ]
}
```

**Características y limitaciones**:
- No emite código de ayuda (`__awaiter`, etc.) a menos que uses `@babel/plugin-transform-runtime`.
- No soporta `const enum` (los trata como enum normal). Puede dar errores si `isolatedModules` está activo.
- No soporta `namespace` (debes usar módulos ES).
- Soporta `import type` (se eliminan).
- Para decoradores legacy, necesitas `@babel/plugin-proposal-decorators`.
- El archivo `.babelrc` debe configurarse para leer `.ts` y `.tsx`.

**Integración con Webpack / Vite**:
- Webpack: `babel-loader` con `@babel/preset-typescript`.
- Vite: internamente usa esbuild para TypeScript, pero puedes forzar Babel con el plugin `@vitejs/plugin-legacy` o configuraciones manuales.

### esbuild

esbuild es un empaquetador y transpilador increíblemente rápido. Soporta TypeScript de forma nativa.

**Uso directo**:
```bash
npm install --save-dev esbuild
npx esbuild src/index.ts --bundle --outfile=dist/bundle.js --platform=node
```

**Como transpilador en desarrollo**:
- Vite usa esbuild para transformar TypeScript en tiempo de desarrollo.
- Webpack puede usar `esbuild-loader` en lugar de `babel-loader`.
- Jest puede usar `@swc/jest` o `esbuild-jest` (aunque SWC es más común).

**Características**:
- Transpila TypeScript a JavaScript pero **no verifica tipos**. Asume que el código es válido.
- Soporta `import type`, `const enum` (con `--keep-names`), JSX, etc.
- Las opciones de tsconfig como `paths` no se resuelven; esbuild no lee `tsconfig.json` por defecto. Se pueden pasar con `--tsconfig-raw` o mediante plugins.
- Emite código compatible con el `target` especificado.

### SWC

SWC (Speedy Web Compiler) es una alternativa en Rust, usada por Next.js, Deno, Parcel, etc. Ofrece tanto transpilación como bundling (con `spack`).

**Configuración para transpilación simple**:
`.swcrc`:
```json
{
  "jsc": {
    "parser": {
      "syntax": "typescript",
      "tsx": true
    },
    "target": "es2022"
  }
}
```

**Con Webpack** (`swc-loader`):
```js
module: {
  rules: [
    {
      test: /\.tsx?$/,
      loader: 'swc-loader',
      options: {
        jsc: { parser: { syntax: 'typescript' } }
      }
    }
  ]
}
```

**Características**:
- Muy rápido.
- Soporta la mayoría de TypeScript, incluido `const enum` (aunque con advertencias), decoradores (experimental y TC39).
- No chequea tipos.
- Puede leer `tsconfig.json` parcialmente mediante la opción `"swc.parser.tsconfig"` o pasando el archivo explícitamente.

### Comparación y elección

| Característica | Babel | esbuild | SWC |
|----------------|-------|---------|-----|
| Velocidad | Media | Muy alta | Muy alta |
| Ecosistema plugins | Muy amplio | Limitado (plugins en Go/JS) | Creciente |
| Soporte TS completo | No (sin const enum, namespace) | No (sin type check) | No (sin type check) |
| Resolución de paths | Con `babel-plugin-module-resolver` | Plugin o manual | Con `swc-plugin-module-resolver` |
| Ideal para | Proyectos con muchos plugins Babel | Bundling rápido (Vite, esbuild) | Rendimiento máximo (Next.js) |

### Estrategia de chequeo de tipos

En todos los casos, se recomienda añadir un script:

```json
"typecheck": "tsc --noEmit"
```

Y en CI:

```yaml
- run: npm run typecheck
- run: npm run build   # usa babel/esbuild/swc
```

---

## 04-eslint-prettier.md

Mantener la calidad del código TypeScript requiere un linter y un formateador. ESLint con el plugin `@typescript-eslint` proporciona análisis profundo, incluyendo reglas que requieren información de tipos. Prettier se encarga del formato consistente.

### ESLint para TypeScript

**Instalación base**:
```bash
npm install --save-dev eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin
```

**Configuración mínima** (`.eslintrc.json`):
```json
{
  "root": true,
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "project": ["./tsconfig.json"]
  },
  "plugins": ["@typescript-eslint"],
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking"
  ],
  "rules": {
    "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
    "@typescript-eslint/explicit-function-return-type": "warn"
  }
}
```

- `parser: "@typescript-eslint/parser"` le dice a ESLint cómo parsear TypeScript.
- `parserOptions.project` es necesario para las reglas que usan información de tipos. Apunta a uno o varios `tsconfig.json`. **Atención**: Esto puede ralentizar el linting; se puede omitir si no se usan reglas con tipo.
- `plugin:@typescript-eslint/recommended` activa un conjunto seguro de reglas.
- `recommended-requiring-type-checking` añade reglas más estrictas que necesitan el proyecto.

### Reglas potentes con información de tipos

- `@typescript-eslint/no-floating-promises`: exige manejar promesas (await, .catch, etc.).
- `@typescript-eslint/no-misused-promises`: evita pasar promesas donde se espera un void.
- `@typescript-eslint/strict-boolean-expressions`: prohíbe usar valores no booleanos en condiciones (ej. `if (array)` sin comprobar length).
- `@typescript-eslint/prefer-nullish-coalescing`: sugiere `??` en lugar de `||` para valores nulos.
- `@typescript-eslint/no-unnecessary-condition`: detecta condiciones siempre verdaderas/falsas basadas en tipos.

Estas reglas elevan la seguridad, pero pueden ser ruidosas; actívalas gradualmente.

### Rendimiento

Las reglas con tipo pueden ser lentas. Consejos:
- Usa `parserOptions.project` solo en configuraciones de CI o en un `.eslintrc.typed.json` que se aplica solo a ciertos archivos.
- Ejecuta ESLint con `--cache` para no reprocesar archivos sin cambios.
- En monorepos, usa `project` apuntando a los `tsconfig.json` de cada paquete, no al raíz.

### Integración con Prettier

Prettier formatea el código, pero algunas de sus reglas pueden chocar con las de ESLint. La solución es:
1. Instalar Prettier y el plugin de ESLint para desactivar reglas conflictivas:
   ```bash
   npm install --save-dev prettier eslint-config-prettier
   ```
2. Añadir `"prettier"` al final de `extends` en ESLint:
   ```json
   "extends": [
     "some-other-config",
     "plugin:@typescript-eslint/recommended",
     "prettier"
   ]
   ```
   `eslint-config-prettier` desactiva todas las reglas de ESLint que podrían interferir con Prettier.
3. Configurar Prettier con `.prettierrc`:
   ```json
   {
     "semi": true,
     "singleQuote": true,
     "tabWidth": 2,
     "trailingComma": "all"
   }
   ```
4. Ejecutar ambos por separado o mediante `eslint-plugin-prettier` (que ejecuta Prettier como regla de ESLint). Personalmente se recomienda ejecutarlos por separado (formateo con Prettier, linting con ESLint) para mejor rendimiento y separación de responsabilidades.

### Editor y flujo de trabajo

- VS Code: extensiones ESLint y Prettier. Configura `editor.formatOnSave: true` y `editor.defaultFormatter: esbenp.prettier-vscode` para TypeScript.
- Husky + lint-staged: ejecutar ESLint y Prettier solo en los archivos staged.
  ```json
  "lint-staged": {
    "*.{ts,tsx}": ["eslint --fix", "prettier --write"]
  }
  ```

### Migrar desde TSLint

TSLint está deprecado. El camino es migrar a `@typescript-eslint`. Existen herramientas como `tslint-to-eslint-config` que ayudan a convertir la configuración.

---

## 05-testing.md

Probar aplicaciones TypeScript implica tanto pruebas unitarias/de integración como pruebas específicas de tipos para asegurar que las definiciones de tipo funcionan como se espera.

### Frameworks de testing y TypeScript

Los frameworks más populares tienen soporte nativo o mediante plugins.

#### Jest

**Opción A: `ts-jest`**
```bash
npm install --save-dev jest typescript ts-jest @types/jest
npx ts-jest config:init
```

`jest.config.js` resultante:
```js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
};
```

`ts-jest` compila TypeScript usando `tsc` (o `ts-jest` internamente) y puede leer `tsconfig.json`. Soporta chequeo de tipos opcional (`diagnostics: true`), lo que puede ralentizar. Es la opción más compatible.

**Opción B: `@swc/jest`**
```bash
npm install --save-dev @swc/core @swc/jest
```
Configuración:
```js
module.exports = {
  transform: {
    '^.+\\.tsx?$': ['@swc/jest', { /* swc config */ }],
  },
};
```
Muchísimo más rápido que `ts-jest` porque solo transpila sin chequear tipos. El chequeo de tipos se ejecuta por separado con `tsc --noEmit`.

**Opción C: `esbuild-jest`** (similar, pero usa esbuild).

#### Vitest

Vitest es el framework de testing moderno basado en Vite. Soporta TypeScript de forma nativa gracias a esbuild. No necesita configuración adicional para TS; basta con instalar `vitest` y ejecutar.

```bash
npm install --save-dev vitest
```

Ejemplo de test:
```ts
import { describe, it, expect } from 'vitest';
import { sumar } from './math';

describe('sumar', () => {
  it('suma dos números', () => {
    expect(sumar(1, 2)).toBe(3);
  });
});
```

Vitest también ofrece modos de watch ultrarrápidos. Para pruebas con DOM, se puede configurar `environment: 'jsdom'`. Es la opción más rápida y moderna.

### Pruebas de tipos (type testing)

No basta con probar la lógica; hay que verificar que los tipos inferidos y las restricciones funcionan. Herramientas:

#### `tsd`

```bash
npm install --save-dev tsd
```

Crea un archivo `*.test-d.ts` y usa las funciones de aserción:
```ts
import { expectType, expectError } from 'tsd';
import { miFuncion } from './mi-modulo';

expectType<number>(miFuncion(2));
expectError(miFuncion('string')); // debe dar error
```

`tsd` ejecuta un subconjunto del compilador y verifica que los comentarios de expectativa se cumplan. Es el estándar para DefinitelyTyped y librerías.

#### `vitest` con `expect-type`

`vitest` tiene integración con `expect-type`:
```ts
import { expectTypeOf } from 'vitest';

expectTypeOf(miFuncion).returns.toBeNumber();
expectTypeOf(miFuncion).parameter(0).toMatchTypeOf<number>();
```

Muy legible y mantenible.

#### `@typescript-eslint` en pruebas

También se pueden escribir pruebas que usen `ts.createProgram` para verificar fragmentos de código dinámicamente, pero suele ser demasiado complejo para pruebas comunes.

### Testing de archivos de declaración

Si publicas `.d.ts`, debes probarlos. El método más sencillo es incluir un proyecto de prueba que importe la librería y ejercite los tipos (usando `tsc --noEmit`). Si el proyecto compila sin errores, los tipos son correctos en ese uso. Para validaciones más finas, `tsd` es ideal.

### Cobertura de código y sourcemaps

Tanto Jest como Vitest pueden generar cobertura. Si usas TypeScript, necesitan los source maps para mapear el JS transpilado al fuente original. Asegúrate de que tu configuración de build genere sourcemaps (o que el framework use el transpilador que las genera). Vitest maneja esto transparentemente.

### Buenas prácticas

- Ejecuta las pruebas con el mismo transpilador que usas en desarrollo para evitar discrepancias.
- Separa el chequeo de tipos (`tsc --noEmit`) de la ejecución de pruebas unitarias. Esto acelera el ciclo.
- En monorepos, cada paquete puede tener su propia configuración de Jest/Vitest o heredar de una base.
- Para pruebas end-to-end que usan TypeScript, herramientas como Playwright o Cypress con soporte TS configurado directamente (Playwright acepta `.ts` nativamente).

---

## 06-bundlers.md

Los empaquetadores modernos integran TypeScript de forma natural, ofreciendo desde transpilación rápida hasta división de código y tree shaking. Cada uno tiene su estrategia de integración y configuraciones recomendadas.

### Webpack

Webpack es el empaquetador más veterano y configurable. Para TypeScript hay dos enfoques principales:

1. **ts-loader**: usa `tsc` para compilar los archivos. Puede ejecutar el chequeo de tipos durante el build.
   ```js
   module.exports = {
     module: {
       rules: [{ test: /\.tsx?$/, loader: 'ts-loader' }]
     }
   };
   ```
   Ventajas: reporta errores de tipo en el proceso de build (si `transpileOnly: false`). Desventaja: más lento, especialmente sin `transpileOnly`. En desarrollo se suele combinar con `ForkTsCheckerWebpackPlugin` para mover el chequeo de tipos a un proceso separado.

2. **babel-loader / swc-loader / esbuild-loader**: transpilan sin chequear tipos. Se usan junto con `tsc --noEmit` en paralelo.
   - `babel-loader` con `@babel/preset-typescript`.
   - `esbuild-loader` (muy rápido, recomendado).
   - `swc-loader` (similar, buena integración con Rust).

   Ejemplo con `esbuild-loader`:
   ```js
   module: {
     rules: [
       {
         test: /\.tsx?$/,
         loader: 'esbuild-loader',
         options: {
           loader: 'tsx',
           target: 'es2020'
         }
       }
     ]
   }
   ```

Webpack resuelve `import` de TypeScript usando la configuración de `resolve.extensions` (incluyendo `.ts`, `.tsx`). Para aliases como `@app/*`, deben configurarse tanto en `resolve.alias` como en `tsconfig.json` (`paths`). No olvides que `tsconfig.json` solo afecta al tiempo de compilación; el empaquetador necesita su propia configuración.

### Vite

Vite se ha convertido en el estándar de facto para desarrollo frontend por su velocidad. Usa esbuild para transpilar TypeScript en desarrollo (sin chequeo de tipos) y Rollup para producción.

- **Configuración cero**: Vite reconoce archivos `.ts` y los transpila automáticamente.
- Para chequeo de tipos, se recomienda ejecutar `tsc --noEmit` en paralelo (puedes usar `vite-plugin-checker` para mostrarlo en la consola).
- Aliases: los `paths` de `tsconfig.json` se pueden reflejar en `vite.config.ts` usando `resolve.alias` con el plugin `vite-tsconfig-paths` o manualmente.
- Librerías: Vite en modo librería (`build.lib`) genera salidas optimizadas; la configuración de tipos debe hacerse con `tsc` aparte (emitiendo declaraciones).

### Rollup

Rollup es ideal para librerías gracias a su tree shaking y formato de salida limpio. Para TypeScript usa `@rollup/plugin-typescript`:

```js
import typescript from '@rollup/plugin-typescript';

export default {
  input: 'src/index.ts',
  output: { dir: 'dist', format: 'esm' },
  plugins: [typescript({ tsconfig: './tsconfig.json' })]
};
```

Este plugin usa `tsc` internamente y puede emitir declaraciones si `tsconfig.json` lo configura. Sin embargo, puede ser lento. Alternativas: usar `esbuild` o `swc` en el pipeline de Rollup y luego generar `.d.ts` con `tsc --emitDeclarationOnly`. También existe `rollup-plugin-dts` para enrollar los archivos `.d.ts` ya generados en un único archivo de tipos.

### esbuild (como empaquetador)

esbuild puede empaquetar una aplicación completa con `--bundle`. Soporta TypeScript nativamente pero sin chequeo de tipos. Es increíblemente rápido. Para librerías, puede generar ESM y CJS simultáneamente.

```bash
esbuild src/index.ts --bundle --platform=neutral --outfile=dist/bundle.js --external:react
```

La resolución de paths no es automática; se puede configurar con el plugin `esbuild-plugin-tsconfig-paths` o manualmente con `alias`.

### Consideraciones comunes a todos

- **`isolatedModules`**: con transpiladores que no chequean tipos, debes activar esta opción en tsconfig para evitar construcciones no soportadas (como `const enum` o reexportaciones de tipo sin `type`).
- **Librerías externas**: en modo librería, usa `external` para no empaquetar `node_modules`.
- **CSS / Assets**: TypeScript no los procesa; cada bundler tiene sus propios loaders (Webpack) o soporte nativo (Vite).
- **Source maps**: generados según la configuración de cada bundler, no la de `tsconfig.json` (aunque pueden interoperar).

### Recomendación general

- **Aplicaciones web**: Vite por defecto.
- **Librerías**: Rollup con `@rollup/plugin-typescript` o `esbuild` + `tsc` para declaraciones.
- **Proyectos con mucha personalización**: Webpack con `esbuild-loader`.
- **Rendimiento extremo**: esbuild o SWC para todo.

La clave es separar claramente transpilación y chequeo de tipos, y asegurarse de que el bundler y TypeScript compartan la misma visión de las rutas y módulos.

--- 

Dominar estas herramientas te permite construir flujos de trabajo modernos, rápidos y seguros, aprovechando al máximo el ecosistema TypeScript. Cada herramienta tiene su lugar; la mejor configuración es la que se adapta a tu proyecto y equipo sin sacrificar la calidad de tipos.

---

