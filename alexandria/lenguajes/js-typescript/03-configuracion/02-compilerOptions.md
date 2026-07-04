# Compileroptions

Las opciones del compilador controlan el proceso de transpilación y el chequeo de tipos. Se agrupan en categorías: emisión, módulos, compatibilidad, chequeo estricto, etc.

## Target y lib

- **`target`**: versión de ECMAScript de salida. Valores: `ES3` (por defecto si no se especifica), `ES5`, `ES6`/`ES2015`, ... hasta `ESNext`. Afecta a la sintaxis generada (por ejemplo, funciones flecha a funciones anónimas, clases a prototipos, etc.). Cuanto más moderno, más compacto el código.
- **`lib`**: array de bibliotecas a incluir para el entorno (e.g., `["dom", "es2022"]`). Por defecto se incluyen las correspondientes al `target`. Si se especifica manualmente, solo se incluyen las listadas; hay que añadir las necesarias.

```json
{
  "target": "ES2020",
  "lib": ["ES2020", "DOM"]
}
```

## Module y moduleResolution

- **`module`**: sistema de módulos de salida. `CommonJS`, `AMD`, `UMD`, `System`, `ES6`/`ES2015`, `ES2020`, `ESNext`, `Node16`, `NodeNext`. Para Node.js moderno con `type: "module"`, se recomienda `NodeNext`.
- **`moduleResolution`**: estrategia de resolución de módulos. `classic` (obsoleto), `node` (para CommonJS), `bundler` (para Vite, Webpack, similares, sin extensiones y con condiciones de exportación), `node16`/`nodenext` (para Node.js ESM/CJS moderno).

Elección común para aplicaciones empaquetadas: `module: "ESNext"` y `moduleResolution: "bundler"`.

## `outDir` y `rootDir`

Ya vistos. La carpeta de salida se estructura igual que la fuente a partir de `rootDir`. `outFile` empaqueta todo en un solo archivo (solo para módulos `amd` o `system`).

## Emisión de declaraciones

- **`declaration`**: genera archivos `.d.ts`.
- **`declarationDir`**: carpeta separada para las declaraciones.
- **`declarationMap`**: genera source maps para las declaraciones, permitiendo navegar desde la definición al fuente original en el editor.
- **`emitDeclarationOnly`**: solo emite `.d.ts`, sin JavaScript (útil para librerías que usan otro transpilador).

## Source maps y debugging

- **`sourceMap`**: genera `.js.map`.
- **`inlineSourceMap`**: incluye el source map como comentario en el `.js`.
- **`inlineSources`**: incluye el código fuente original dentro del source map.
- **`sourceRoot`** y **`mapRoot`**: ajustan las rutas dentro de los mapas.

## Import helpers y ESModule interop

- **`importHelpers`**: reduce el código duplicado de helpers de transpilación (ej. `__assign`) importándolos de `tslib`. Requiere instalar `tslib`.
- **`noEmitHelpers`**: no emite helpers en absoluto; si los necesitas, debes proveerlos globalmente.
- **`esModuleInterop`**: permite importar módulos CommonJS como si fueran ESM por defecto (añade `__importDefault` y `__importStar`). Recomendado activarlo siempre.
- **`allowSyntheticDefaultImports`**: permite la sintaxis de import por defecto aunque el módulo no tenga export default, pero sin emitir el helper. `esModuleInterop` lo activa implícitamente.

## Strict y comprobaciones relacionadas

Se detallan en el siguiente punto. Desde aquí podemos mencionar que `strict: true` activa todas las banderas de la familia.

## Otras comprobaciones

- **`skipLibCheck`**: omite el chequeo de tipos de los archivos `.d.ts`. Acelera la compilación y evita errores en tipos de terceros. Muy recomendable.
- **`forceConsistentCasingInFileNames`**: obliga a que las mayúsculas/minúsculas de los imports coincidan con el disco. Previene errores en sistemas de archivos case-sensitive.
- **`isolatedModules`**: requerido por transpiladores como Babel/esbuild. Prohíbe ciertas construcciones que no pueden analizarse archivo por archivo sin información de tipos (como `const enum`, reexportación de tipos sin `type`).
- **`noUnusedLocals`** y **`noUnusedParameters`**: marcan variables/parámetros sin usar como errores.
- **`noImplicitReturns`**: todas las ramas de una función deben devolver un valor.
- **`noFallthroughCasesInSwitch`**: impide que un `case` caiga en el siguiente sin `break`/`return`.

## JSX

- **`jsx`**: `"react"` (React.createElement), `"react-jsx"` (JSX automático con `react/jsx-runtime`), `"preserve"` (deja el JSX intacto), `"react-native"` (preserva y espera que React Native lo transforme).
- **`jsxFactory`**: función de fábrica (default `React.createElement`).
- **`jsxFragmentFactory`**: componente Fragment.
- **`jsxImportSource`**: desde dónde importar los helpers JSX (e.g., `"react"`, `"preact"`).

## Paths y base URL

- **`baseUrl`**: directorio base para resolución de módulos no relativos.
- **`paths`**: mapeos de alias. Por ejemplo, `"@app/*": ["src/*"]`. Requiere `baseUrl`. Son solo para tiempo de compilación; los empaquetadores (Webpack, Vite) necesitan su propia configuración equivalente.

## Emisión de módulos y compatibilidad

- **`typeRoots`**: lista de carpetas que contienen `@types` (por defecto `node_modules/@types`).
- **`types`**: lista de paquetes de tipos a incluir automáticamente. Si se especifica, solo se incluyen esos.
- **`allowJs`**: permite importar archivos JavaScript en el proyecto.
- **`checkJs`**: activa el chequeo de tipos en archivos `.js` (JSDoc).
- **`resolveJsonModule`**: permite importar módulos JSON y obtener el tipo automáticamente.
- **`verbatimModuleSyntax`** (TS 5.0): obliga a usar `import type` para importaciones de solo tipo y no emitirá las importaciones eliminadas en módulos ESM; garantiza compatibilidad con el estándar.

## Consejos de configuración

- Siempre activar `strict: true` si empiezas un proyecto nuevo.
- Usar `skipLibCheck: true` para evitar dolores de cabeza con tipos de terceros.
- Para librerías, emitir `declaration` y `declarationMap`.
- Para monorepos, considerar `composite: true` y project references (sección 04).
- Para empaquetadores modernos, `moduleResolution: "bundler"` simplifica las importaciones.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Tsconfig basico](01-tsconfig-basico.md) | [🏠 Inicio](../index.md) | [Strict y otras banderas ▶](03-strict-y-otras-banderas.md) |
