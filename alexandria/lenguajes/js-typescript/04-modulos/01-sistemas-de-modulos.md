# Sistemas de modulos

TypeScript se integra con los distintos sistemas de módulos del ecosistema JavaScript. Comprender cómo y por qué elegir uno es fundamental para la correcta emisión de código, la resolución de importaciones y la interoperabilidad.

## Sistemas históricos

JavaScript no tuvo un sistema de módulos nativo hasta ES2015. Antes surgieron:

- **CommonJS (CJS)**: usado por Node.js. `require()` y `module.exports`. Síncrono, carga bajo demanda, diseño pensado para servidor.
- **AMD**: Asynchronous Module Definition, para navegadores. `define(['dep'], callback)`. Carga asíncrona.
- **UMD**: Universal Module Definition, un envoltorio que soporta CJS, AMD y global (window). Usado por librerías para compatibilidad universal.
- **SystemJS / System.register**: formato más moderno, permite cargar módulos ES, CJS, etc. en navegador, con soporte de carga dinámica.

## Módulos ES (ESM)

Estándar oficial a partir de ES2015: `import` y `export`. Soporta análisis estático, tree shaking y carga asíncrona en plataformas modernas. Todos los navegadores y Node.js lo soportan actualmente.

**Ventajas sobre CJS**:
- Estático: se pueden analizar las dependencias sin ejecutar.
- Importación en vivo (live bindings): si el módulo exportador cambia una variable, el importador ve el cambio.
- `import()` asíncrono dinámico.
- Sintaxis más limpia y consistente.

## Cómo TypeScript elige el sistema de salida

La opción `module` en `tsconfig.json` determina el formato de módulo que TypeScript emite en el JavaScript resultante:

- `CommonJS`: emite `require` y `exports`.
- `AMD`: emite `define`.
- `UMD`: emite un envoltorio UMD (requiere configuración adicional como `outFile` o `jsx` en algunos casos).
- `System`: emite `System.register`.
- `ES6` / `ES2015` / `ES2020` / `ESNext`: emite `import` y `export` (ES Modules), dejando la gestión al entorno.
- `Node16` / `NodeNext`: emite CJS o ESM en función de la detección del archivo más cercano `package.json` con `"type": "module"` o extensión `.mts`/`.mjs`. Es la opción moderna para Node.js.
- `None`: no emite módulos; se espera que el código se concatene o esté en un entorno sin módulos.

**Elección recomendada**:
- Para aplicaciones frontend empaquetadas (Webpack, Vite, etc.): `ESNext` o `ES2020` con `moduleResolution: "bundler"`.
- Para librerías que se publican en npm y deben funcionar en CJS y ESM: se pueden generar dos salidas (con `tsc` por separado o usando herramientas como `tsup`, `unbuild`), o emitir ESM y confiar en que los empaquetadores resuelvan.
- Para Node.js actual (≥12, con soporte ESM): `NodeNext` + `"type": "module"` en package.json, o usar `.mts`/`.mjs`.

## Interoperabilidad entre CJS y ESM

El mayor punto de fricción es la interoperabilidad entre sintaxis de importación estándar y módulos CJS. TypeScript ofrece opciones para mitigarlo:

- **`esModuleInterop`** (`true`): 
  - Emite ayudantes `__importDefault` y `__importStar` que permiten que `import modulo from 'paquete-cjs'` funcione aunque el módulo no tenga `export default`.
  - También habilita `allowSyntheticDefaultImports` (implícitamente), que permite la sintaxis en el chequeo de tipos aunque no se emitan los ayudantes.
  - Recomendado activarlo siempre.
- **`allowSyntheticDefaultImports`**: activa el chequeo de tipos para importaciones por defecto sin necesitar los ayudantes de emisión. Útil si el empaquetador se encarga de la compatibilidad.
- **`importHelpers`**: reduce la duplicación de código de ayudantes usando `tslib`.
- **`moduleDetection`** (TS 4.7+): `"auto"` o `"force"` para determinar si un archivo es módulo basándose en imports/exports o forzar que todos sean módulos. Relevante para la emisión en `NodeNext`.

**Sintaxis especial para CommonJS en TypeScript**:
- `import modulo = require('paquete')` y `export = modulo` (ver 02-import-export-syntax). Permite consumir y exportar módulos CJS de forma natural sin ayudantes. Al compilar a `module: CommonJS`, el emit es directo.

## Dual packages (CJS y ESM)

Muchas librerías publican tanto una versión CJS como una ESM. TypeScript soporta esto con `moduleResolution: node16`/`nodenext`, que lee el campo `exports` en `package.json` y las condiciones `import`, `require`, `types`. Así, un mismo import puede resolverse a diferentes archivos dependiendo del contexto. Para librerías propias, podemos emitir dos salidas con `tsc` (con diferentes tsconfigs) y configurar `package.json` adecuadamente.

## Resolución de módulos (relacionado con 03-05)

El sistema de módulos de salida interactúa fuertemente con la estrategia de resolución (`moduleResolution`). Por ejemplo, `module: NodeNext` fuerza `moduleResolution: NodeNext`. `module: ESNext` con `moduleResolution: node` puede causar confusión porque Node.js clásico no entiende ESM; en ese caso se usa `bundler` o se deja que un empaquetador resuelva.

## Migración de CJS a ESM en un proyecto TypeScript

1. Cambiar `module` a `NodeNext` (o `ESNext` si el empaquetador se encarga).
2. Actualizar `package.json` con `"type": "module"`.
3. Renombrar archivos de `.ts` a `.mts` si se necesita granularidad, o dejarlos como `.ts`.
4. Ajustar importaciones relativas para incluir la extensión `.js` en los imports (ej. `import './foo.js'` aunque el fuente sea `foo.ts`). En `moduleResolution: bundler` esto no es necesario.
5. Reemplazar `require` y `module.exports` por `import`/`export`.
6. Activar `esModuleInterop` si hay dependencias CJS.

## Resumen

TypeScript soporta todos los sistemas de módulos históricos y modernos. La decisión clave es el target de entorno: para navegadores con empaquetador, `ESNext`; para Node.js moderno, `NodeNext`. La interoperabilidad se maneja con las opciones de `esModuleInterop` y, en casos específicos, con sintaxis `import = require`. Conocer la salida esperada evita sorpresas en tiempo de ejecución.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Debug y sourcemaps](../03-configuracion/06-debug-y-sourcemaps.md) | [🏠 Inicio](../index.md) | [Import export syntax ▶](02-import-export-syntax.md) |
