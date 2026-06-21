# Babel esbuild swc

TypeScript es un compilador completo, pero su velocidad de transpilación puede ser un cuello de botella en proyectos grandes. Babel, esbuild y SWC ofrecen transpilación ultrarrápida, delegando el chequeo de tipos a `tsc --noEmit`. Este enfoque híbrido es el estándar en la industria actual.

## ¿Por qué otro transpilador?

- **Velocidad**: Babel con `@babel/preset-typescript` es mucho más rápido que `tsc` para transpilar (no chequea tipos). esbuild y SWC son aún más rápidos (escritos en Go y Rust respectivamente).
- **Ecosistema**: Babel tiene un ecosistema masivo de plugins (propuestas TC39, optimizaciones, JSX). esbuild empaqueta y transpila; SWC se integra en herramientas como Next.js y Parcel.
- **Flexibilidad**: puedes elegir diferentes plugins y configuraciones que `tsc` no soporta directamente.

## Flujo de trabajo híbrido

1. **Desarrollo**: usa Babel/esbuild/SWC para transpilar TS a JS (o directamente en el servidor de desarrollo).
2. **Chequeo de tipos**: ejecuta `tsc --noEmit` por separado (en paralelo o en CI). El editor (VS Code) sigue usando el Language Service de TypeScript para mostrar errores en tiempo real.
3. **Producción**: mismo transpilador, más optimizaciones. El chequeo de tipos se asegura antes de hacer el build final.

## Babel + TypeScript

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

## esbuild

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

## SWC

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

## Comparación y elección

| Característica | Babel | esbuild | SWC |
|----------------|-------|---------|-----|
| Velocidad | Media | Muy alta | Muy alta |
| Ecosistema plugins | Muy amplio | Limitado (plugins en Go/JS) | Creciente |
| Soporte TS completo | No (sin const enum, namespace) | No (sin type check) | No (sin type check) |
| Resolución de paths | Con `babel-plugin-module-resolver` | Plugin o manual | Con `swc-plugin-module-resolver` |
| Ideal para | Proyectos con muchos plugins Babel | Bundling rápido (Vite, esbuild) | Rendimiento máximo (Next.js) |

## Estrategia de chequeo de tipos

En todos los casos, se recomienda añadir un script:

```json
"typecheck": "tsc --noEmit"
```

Y en CI:

```yaml
- run: npm run typecheck
- run: npm run build   # usa babel/esbuild/swc
```

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Tsc API](02-tsc-api.md) | [🏠 Inicio](../index.md) | [Eslint prettier ▶](04-eslint-prettier.md) |
