## 01-fundamentos-dts.md

Los archivos de declaración (`.d.ts`) describen la forma de código JavaScript para que TypeScript pueda analizarlo, ofrecer autocompletado y detectar errores sin necesidad de reescribir el código original. Son el pegamento que permite el ecosistema de tipos.

### ¿Qué es un `.d.ts`?

Un archivo `.d.ts` es como un archivo de cabecera (header) en C/C++: describe los tipos, interfaces y firmas de un módulo o script, pero **no contiene implementación ejecutable**. El compilador TypeScript lo lee para entender la estructura de los valores que existirán en tiempo de ejecución.

```ts
// math.d.ts
export declare function sumar(a: number, b: number): number;
export declare const PI: number;
```

En un archivo de declaración **solo pueden aparecer declaraciones de tipo** (`declare`, `export`, `import type`, interfaces, types, etc.). No pueden contener expresiones o sentencias que generen código. La palabra clave `declare` indica al compilador que la variable, función o clase existe en otro lugar y no debe emitirla.

### Ámbitos: script vs módulo

Un archivo `.d.ts` (y `.ts`) puede estar en dos modos según su contenido:

- **Modo script**: si no tiene `import`/`export` a nivel superior. Las declaraciones se añaden al ámbito global. Es la forma típica de los tipos para librerías que se cargan con `<script>` o que exponen variables globales (ej. `jQuery`).
- **Modo módulo**: si contiene al menos un `import` o `export`. Las declaraciones están aisladas; no contaminan el global. Se usan para librerías consumidas mediante `import`.

```ts
// global.d.ts (script)
declare var VERSION: string;
// modulo.d.ts (módulo)
export declare function procesar(): void;
```

TypeScript detecta automáticamente el modo. Para forzar modo módulo en un archivo sin exports reales, se puede usar `export {}`.

### `declare` en profundidad

`declare` se usa en contextos ambientales (ambient) para describir entidades que existen en runtime pero cuyo código TypeScript no puede ver.

- `declare var` / `let` / `const`: variable global o de módulo.
- `declare function`: firma de función. Se pueden escribir sobrecargas.
- `declare class`: describe una clase (constructor y miembros). No se emite.
- `declare namespace`: agrupa declaraciones. Muy usado en tipos globales antiguos.
- `declare enum`: enum que existe en runtime. `const declare enum` no es válido porque no hay código que emitir.
- `declare module`: para declarar módulos de terceros o comodines.
- `declare global`: dentro de un módulo, permite añadir declaraciones al ámbito global.

### Estructura de un proyecto con declaraciones

Las declaraciones pueden venir de varias fuentes:

1. **Archivos propios `.d.ts`**: colocados junto al código fuente o en una carpeta `types/`.
2. **Paquetes de tipos (`@types`)** de DefinitelyTyped.
3. **Tipos incluidos por la librería** (campo `"types"` en su `package.json`).
4. **Declaraciones automáticas** de `lib.d.ts` (DOM, ES).

La opción `compilerOptions.types` controla qué paquetes de tipos se cargan automáticamente. La opción `typeRoots` especifica dónde buscarlos (por defecto `node_modules/@types`).

### Generación de archivos de declaración

Para generar automáticamente `.d.ts` desde código TypeScript se usa `compilerOptions.declaration: true`. Se puede especificar `declarationDir` para separarlos del JS. `declarationMap: true` añade source maps que vinculan las declaraciones al fuente original, mejorando "Ir a definición".

```json
{
  "compilerOptions": {
    "declaration": true,
    "declarationMap": true,
    "declarationDir": "./dist/types"
  }
}
```

Al generar declaraciones, TypeScript emite todas las entidades exportadas y las interfaces/typos que forman parte de la API pública. Los detalles de implementación privados no se incluyen.

### Declaraciones ambientales vs declaraciones de módulo

- **Declaración ambiental global**: describe algo en el ámbito global (`declare var $: JQueryStatic`). Útil para librerías con script tag.
- **Declaración de módulo ambiental**: describe la forma de un módulo importable (`declare module 'lodash' { ... }`). Es la forma moderna para librerías instaladas.

### Archivos `.d.ts` y el compilador

- Durante la compilación, TypeScript recoge todos los `.d.ts` referenciados (mediante `includes`, `files`, `types`).
- Si hay un `.d.ts` y un `.ts` con el mismo nombre base, el `.ts` tiene prioridad y el `.d.ts` se ignora.
- Las declaraciones ambientales globales no necesitan ser importadas; simplemente están disponibles.
- Las declaraciones de módulo son accesibles mediante `import` o `/// <reference types="..."/>`.

### `types` y `typings` en `package.json`

El campo `"types"` (o el alias `"typings"`) en `package.json` indica la ruta al archivo principal de declaraciones de un paquete:

```json
{
  "name": "mi-libreria",
  "version": "1.0.0",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts"
}
```

Si no se especifica, TypeScript busca `index.d.ts` en la raíz del paquete. También puede usar el campo `exports` con la condición `"types"` para paquetes con múltiples puntos de entrada.

### Buenas prácticas

- Nunca edites un `.d.ts` generado automáticamente; es mejor corregir el fuente TypeScript y regenerar.
- Para añadir tipos a librerías sin tipos, crea un archivo `*.d.ts` local y asegúrate de que esté incluido en la compilación.
- Usa `declare global` con moderación; los módulos son preferibles para encapsular.
- Cuando escribas un `.d.ts` a mano, sigue la misma estructura de la librería original (CommonJS, ESM, global).
- Aprovecha `declare module 'nombre'` y los patrones con comodines para módulos que no son código (CSS, imágenes).

---

## 02-global-declarations.md

Las declaraciones globales permiten describir APIs que existen en el ámbito global de JavaScript, como `window`, `console`, `process` (Node.js), o variables inyectadas por otras herramientas. TypeScript ya incluye declaraciones para el DOM y ECMAScript vía `lib`. Aquí cubrimos cómo extender o crear nuevas globales.

### `declare` en ámbito global

Si un archivo `.d.ts` no tiene `import`/`export`, sus declaraciones van al ámbito global. Así se crean tipos para librerías que se cargan con `<script>`:

```ts
// jquery-global.d.ts
declare function $(selector: string): JQuery;
declare namespace $ {
  interface JQuery {
    html(html: string): JQuery;
  }
}
```

Luego, en cualquier archivo del proyecto, `$` está disponible sin importar (si `include` o `files` alcanzan ese archivo).

### `declare global` desde un módulo

Si necesitas añadir declaraciones globales pero tu archivo ya es un módulo (tiene imports/exports), debes envolverlas en un bloque `declare global`:

```ts
import { OtraCosa } from 'otra';
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
  var miGlobal: string;
}
```

El bloque `declare global` tiene el mismo efecto que escribir un script `.d.ts` aparte, pero permite referenciar tipos locales del módulo. Es la forma recomendada en aplicaciones modulares modernas.

### Extender `Window`, `Document`, etc.

Un patrón común es añadir propiedades a objetos globales existentes mediante aumento de interfaces. La interfaz `Window` es abierta (puede extenderse):

```ts
declare global {
  interface Window {
    __INITIAL_STATE__: Record<string, unknown>;
    analytics: Analytics;
  }
}
```

Esto permite que `window.__INITIAL_STATE__` se reconozca en cualquier lugar sin errores.

### Extender `globalThis`

`globalThis` es la forma estándar de acceder al objeto global en cualquier entorno. TypeScript lo declara como `typeof globalThis`, pero se puede aumentar:

```ts
declare global {
  var miApp: { version: string };
}
// En código: globalThis.miApp.version
```

### Tipos para variables inyectadas en tiempo de compilación

Herramientas como Webpack DefinePlugin, Vite `import.meta.env`, o variables de entorno exponen valores que se pueden declarar globalmente:

```ts
// env.d.ts
declare const __DEV__: boolean;
declare const API_URL: string;
declare namespace NodeJS {
  interface ProcessEnv {
    API_KEY: string;
  }
}
```

Para `import.meta.env` de Vite, se puede aumentar `ImportMeta`:

```ts
interface ImportMeta {
  env: {
    VITE_API_URL: string;
    DEV: boolean;
  };
}
```

### Namespaces globales vs interfaces

Históricamente, las librerías declaraban un namespace global (por ejemplo, `declare namespace jQuery`). Hoy, para tipar librerías globales, se prefiere interfaces debido a su capacidad de fusionarse y ser extendidas. Por ejemplo, en lugar de un namespace con funciones, se puede declarar una función global con interfaz adicional:

```ts
declare function grecaptcha: {
  render(container: string, parameters: object): number;
  reset(id?: number): void;
};
```

### ¿Cuándo usar globales?

- Librerías de terceros que no usan módulos (ej. algunas analíticas, widgets embebidos).
- Polyfills o extensiones del prototipo (evitar a menos que sea necesario).
- Variables de entorno o constantes inyectadas por el sistema de build.
- Aumentos de tipos nativos (`String.prototype`, `Array.prototype`).

Pero en general, **prefiere módulos**. Las globales colisionan fácilmente y hacen el código menos mantenible.

### Conflicto entre múltiples declaraciones globales

Si dos archivos `.d.ts` declaran la misma global con diferentes tipos, TypeScript intenta fusionarlos según las reglas de merging:
- Interfaces y namespaces se fusionan.
- Variables y funciones causan error si hay conflicto.
Para evitar conflictos, asegúrate de que las declaraciones globales sean coherentes o usa módulos.

### Patrones seguros

- Coloca las declaraciones globales en un archivo dedicado (ej. `src/global.d.ts`) e inclúyelo en `tsconfig.json`.
- Usa `export {}` al final del archivo si quieres que sea un módulo y evites contaminación global accidental.
- Documenta qué globales se esperan y por qué.

### Ejemplo avanzado: aumentar `String`

```ts
declare global {
  interface String {
    toCamelCase(): string;
  }
}
// En otro archivo asegúrate de que la extensión se cargue
String.prototype.toCamelCase = function() { /*...*/ };
```

Este tipo de aumento es poderoso pero debe usarse con responsabilidad para no romper expectativas.

---

## 03-module-declarations.md

Cuando una librería JavaScript no incluye sus propios tipos, TypeScript permite declarar la forma del módulo mediante `declare module`. Este mecanismo cubre desde librerías completas hasta activos estáticos como imágenes o CSS.

### `declare module "nombre"`

La sintaxis básica para describir un módulo de terceros:

```ts
declare module "lib-sin-tipos" {
  export function foo(bar: string): number;
  export const VERSION: string;
  export default class Cliente { ... }
}
```

TypeScript tratará cualquier importación de `"lib-sin-tipos"` como si tuviera esas exportaciones. Es similar a escribir un `.d.ts` del módulo, pero se puede colocar en cualquier archivo `.d.ts` del proyecto.

### Módulos ambientales vs declaraciones de paquetes

- **Módulo ambiental**: `declare module "nombre" { ... }`. Se puede declarar en un archivo propio (por ejemplo, `types/mi-modulo.d.ts`). No necesita que el módulo exista realmente.
- **Módulo de paquete**: si existe un paquete `@types/nombre`, tiene prioridad sobre un módulo ambiental con el mismo nombre. Para sobrescribirlo se puede usar un `declare module` en un archivo local, pero suele ser mejor contribuir a DefinitelyTyped.

### Exportaciones y default exports

Se pueden describir exportaciones con nombre, default y combinaciones:

```ts
declare module "calculadora" {
  export function sumar(a: number, b: number): number;
  export function restar(a: number, b: number): number;
  export const PI: number;
  // export default
  const calculadora: { sumar: typeof sumar; PI: typeof PI };
  export default calculadora;
}
```

Para módulos CommonJS que usan `module.exports = algo`, se emplea `export =`:

```ts
declare module "moment" {
  function moment(): Moment;
  export = moment;
}
// Se importa con: import moment = require("moment");
// o con esModuleInterop: import moment from "moment";
```

### Comodines para activos (wildcard modules)

Para permitir importar archivos no JS (CSS, imágenes, JSON, etc.):

```ts
declare module "*.css" {
  const content: string;
  export default content;
}
declare module "*.png" {
  const src: string;
  export default src;
}
declare module "*.svg" {
  const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>;
  export default ReactComponent;
}
```

Con estas declaraciones, `import styles from './estilos.css'` es válido y `styles` es `string`. En proyectos React/Next.js se suelen incluir declaraciones similares para SVGs como componentes.

### Módulos con puntos de entrada anidados

Se pueden declarar submódulos:

```ts
declare module "libreria/core" {
  export function coreMethod(): void;
}
declare module "libreria/plugins/plugin1" {
  export function pluginMethod(): void;
}
```

TypeScript los resuelve de forma independiente.

### Módulos con template literal

Desde TypeScript 4.1, se pueden usar patrones con template literals para capturar prefijos:

```ts
declare module "libreria/*" {
  const content: any;
  export default content;
}
```

Esto permite `import img from 'libreria/imagenes/logo.png'` con tipo `any`. Más potente aún, con `declare module` y un patrón genérico no se pueden capturar parámetros, pero para casos simples de comodín basta.

### Módulos genéricos

Se puede declarar un módulo con parámetros de tipo usando la misma sintaxis que una función:

```ts
declare module "observable" {
  export interface Observable<T> {
    subscribe(observer: (value: T) => void): void;
  }
  export function create<T>(value: T): Observable<T>;
}
```

### Módulos que exponen tanto función como namespace

Algunas librerías (ej. `express`) exportan una función que también tiene propiedades. Se describe combinando `declare function` y `declare namespace`:

```ts
declare module "express" {
  function express(): Express;
  namespace express {
    interface Express { ... }
    interface Request { ... }
  }
  export = express;
}
```

### `declare module` dentro de un archivo `.ts` normal

Puedes colocar `declare module` en un archivo `.ts` que ya tiene lógica. Sin embargo, es una mala práctica porque mezcla lógica de tipos con código que sí se ejecuta. Mejor mantenerlo en un `.d.ts` dedicado.

### Aumentación de módulos vs declaración completa

- **Declaración completa**: `declare module "foo" { ... }` describe el módulo desde cero. Se usa cuando no hay tipos o quieres sobrescribirlos completamente.
- **Aumentación**: `declare module "foo" { interface Bar { nuevaProp: number } }` agrega propiedades a interfaces ya existentes del módulo, sin redefinir todo el módulo (ver siguiente tema).

### Buenas prácticas

- Centraliza las declaraciones de módulos de terceros en una carpeta `types/` y asegúrate de que `tsconfig.json` las incluya.
- Usa `export =` para módulos CommonJS de una sola exportación.
- No declares un módulo completo si solo necesitas aumentar una interfaz; usa aumentación.
- Si la librería es popular, considera contribuir a DefinitelyTyped en lugar de mantener un archivo local.

---

## 04-augmentation.md

La aumentación (aumento) de tipos permite extender interfaces existentes con nuevas propiedades, añadir métodos a clases de terceros o modificar tipos globales sin necesidad de modificar los archivos de origen. Se basa en las reglas de fusión de declaraciones de TypeScript.

### Fusión de declaraciones (declaration merging)

TypeScript fusiona automáticamente:
- Interfaces con el mismo nombre en el mismo ámbito.
- Namespaces con el mismo nombre.
- Interfaz con clase (para añadir propiedades estáticas).
- Función con namespace (patrón función+namespace).
Esto no se aplica a `type` alias (no se fusionan).

La aumentación se logra reabriendo una interfaz o namespace declarado en otro lugar.

### Aumentación de módulos (module augmentation)

Sirve para añadir nuevas propiedades a interfaces que pertenecen a un módulo de terceros (por ejemplo, añadir una propiedad `user` a `express.Request`).

```ts
// express-augment.d.ts
import "express";
declare module "express" {
  interface Request {
    user?: { id: number; role: string };
  }
}
```

Para que funcione:
- El archivo debe ser un módulo (tener al menos `import "express";` o `export {}`).
- Debe incluirse en el proyecto (via `include`).
- La sintaxis es `declare module "nombre-del-modulo" { ... }` sin necesidad de redefinir exportaciones; solo las partes que queremos aumentar.

Internamente, TypeScript fusiona nuestra interfaz `Request` con la original del módulo `express`. El resultado es que `req.user` está disponible en todas las rutas.

### Aumentación de módulos con exportaciones específicas

También se pueden aumentar otros elementos del módulo, como agregar una función:

```ts
declare module "lodash" {
  interface LoDashStatic {
    customMethod(): string;
  }
}
```

### Aumentación global

Para extender objetos globales (Window, Document, etc.):

```ts
declare global {
  interface Window {
    __CUSTOM_DATA__: any;
  }
}
```

Esto se puede hacer desde un módulo si se envuelve en `declare global` y el archivo tiene al menos un `import`/`export` (para ser tratado como módulo). Si es un archivo script (sin imports), las declaraciones están en el global y no se necesita el bloque `declare global`.

### Aumentación de `lib.d.ts`

Se pueden añadir métodos a tipos nativos como `Array` o `String`:

```ts
interface Array<T> {
  remove(item: T): boolean;
}
```

Este tipo de aumentación puede afectar a todo el proyecto y debe usarse con cuidado porque puede causar conflictos si diferentes partes añaden lo mismo.

### Aumentación de tipos de paquetes con `@types`

Si un paquete `@types/libreria` es insuficiente, se puede aumentar de la misma forma. El archivo aumentador debe convivir en el proyecto y se fusionará con las declaraciones de `@types`.

### Orden de carga y visibilidad

Los archivos de declaración se cargan según los patrones de `include` y `files`. Para que una aumentación sea efectiva, el archivo que la contiene debe estar incluido. A menudo se colocan en `src/types/augmentations.d.ts` o similar. No es necesario importarlos explícitamente; su presencia en el proyecto es suficiente.

### Aumentación vs `declare module` completo

- **Aumentación**: solo modificas ciertas partes; el resto de las declaraciones del módulo se mantienen como están.
- **Declaración completa**: reemplazas toda la definición del módulo. Esto puede ser necesario si los tipos originales son completamente erróneos o si estás escribiendo tipos desde cero para una librería que no los tiene. Pero con `@types`, reemplazarlos completamente puede causar que se pierdan otras declaraciones.

### Aumentación en librerías (plugins)

Las librerías que funcionan como plugins (por ejemplo, Express middleware) suelen proveer sus propios archivos de aumentación para que sus tipos se integren. Por ejemplo, `passport` añade `user` a `Request`. Cuando instalas `@types/passport`, el archivo de aumentación ya está incluido.

### Casos prácticos avanzados

- **Agregar propiedades a una clase**: las clases son abiertas en su miembro estático (se fusionan con una interfaz del mismo nombre). Para añadir un método estático:
  ```ts
  declare module "vue" {
    interface VueConstructor {
      myGlobalMethod(): void;
    }
  }
  ```
- **Extender una unión discriminada**: no se puede aumentar una unión directamente, pero se puede aumentar el tipo de una propiedad que sea una unión si está en una interfaz que forma parte de la unión.

### Peligros de la aumentación

- **Colisiones**: si dos módulos aumentan la misma interfaz con la misma propiedad pero tipos diferentes, TypeScript dará error.
- **Dependencia de orden**: la aumentación debe estar presente en todos los contextos de compilación; si un proyecto no incluye el archivo aumentador, los tipos serán inconsistentes.
- **Mantenimiento**: cuando se actualiza la librería base, la aumentación puede quedar obsoleta.

### Buenas prácticas

- Agrupa las aumentaciones en un archivo o carpeta específica.
- Nombra el archivo de forma que indique qué módulo aumenta (ej. `express.augment.d.ts`).
- Documenta la razón de la aumentación.
- Considera si es posible enviar un PR a DefinitelyTyped o a la librería original para que incluya los tipos, en lugar de mantener una aumentación local.

---

## 05-definitely-typed.md

DefinitelyTyped (DT) es el repositorio masivo de declaraciones de tipo mantenido por la comunidad bajo el ámbito `@types`. Es la fuente predeterminada para tipar librerías JavaScript que no incluyen tipos propios.

### Estructura del repositorio

- Repo: https://github.com/DefinitelyTyped/DefinitelyTyped
- Cada paquete está en una carpeta con su nombre (ej. `types/react`).
- Dentro: `index.d.ts`, `package.json`, `tsconfig.json`, y opcionalmente tests.
- Las versiones de los paquetes `@types/` siguen el versionado de la librería original, pero con un cuarto dígito para parches de tipos (ej. `@types/react@18.2.45`).

### Cómo usar los tipos

Instalación:
```bash
npm install --save-dev @types/react
```

TypeScript los recoge automáticamente porque por defecto `typeRoots` incluye `node_modules/@types`. Si la librería ya incluye sus propios tipos (campo `"types"`), `@types` no es necesario (y puede interferir).

### Búsqueda de tipos

Puedes buscar si una librería tiene tipos en:
- El propio paquete (busca el logo de TS en npm o el campo `"types"` en `package.json`).
- https://www.typescriptlang.org/dt/search
- https://microsoft.github.io/TypeSearch/

Si no existe, puedes declararlos localmente o contribuir.

### Contribuir a DefinitelyTyped

Pasos generales:
1. Lee la guía oficial: https://github.com/DefinitelyTyped/DefinitelyTyped#readme
2. Forkea el repo.
3. Crea una carpeta con el nombre del paquete (si es scoped: `types/__name` con doble barra baja).
4. Escribe `index.d.ts` con las declaraciones.
5. Añade `package.json` mínimo con `"types": "index.d.ts"`.
6. Añade un `tsconfig.json` con `"compilerOptions": { "strict": true, ... }` y `"files": ["index.d.ts"]`.
7. Escribe tests en una carpeta `test.ts` usando `import` y comprobando que no hay errores. Opcionalmente se usa `tsd` o `dtslint` para validaciones más estrictas.
8. Envía PR. El CI ejecutará linters y pruebas.

### Herramientas de prueba de tipos

- **`dtslint`**: usado por DT para verificar reglas de estilo, existencia de tipos, y probar con comentarios `// $ExpectType` y `// $ExpectError`.
- **`tsd`**: similar, pero más moderno, con `expectType<T>` y `expectError`.
- **`@typescript-eslint`** con reglas para archivos de declaración.

Actualmente DT está migrando de `dtslint` a `tsd`.

### Versiones y mantenimiento

- Los paquetes `@types` suelen lanzar una versión principal por cada versión principal de la librería.
- Se pueden publicar actualizaciones menores para corregir tipos.
- Si un paquete `@types` no está actualizado, puedes enviar un PR con las correcciones.
- En ocasiones, la librería original adopta tipos propios y el paquete `@types` es marcado como deprecated.

### ¿Qué hacer cuando los tipos están incorrectos?

1. Revisa si hay un issue o PR en DefinitelyTyped.
2. Si no, crea un PR con la corrección.
3. Mientras tanto, puedes aumentar los tipos localmente con `declare module` en tu proyecto.

### Consejos al escribir tipos para DT

- Sigue el estilo del módulo original: si usa `module.exports`, usa `export =`; si usa ES modules, `export default` y `export`.
- Incluye JSDoc donde sea útil.
- No incluyas dependencias innecesarias.
- Si la librería es grande, divide en submódulos si tiene puntos de entrada separados.
- Usa `namespace` para funciones con propiedades.
- Prueba los tipos con ejemplos reales de uso.

### Definitivamente y el futuro

Con más librerías adoptando TypeScript nativamente, DT sigue siendo vital para el ecosistema de paquetes legacy. TypeScript mismo depende de la comunidad para mantener la calidad de los tipos. Contribuir es una excelente forma de devolver al ecosistema.

---

## 06-publicando-tipos.md

Cuando publicas una librería escrita en TypeScript, es tu responsabilidad proporcionar archivos de declaración (.d.ts) para que los consumidores puedan usarla con total seguridad de tipos. Aquí cubrimos cómo empaquetar y distribuir tipos correctamente.

### Opciones: incluir tipos o usar DefinitelyTyped

Tienes dos caminos:
1. **Incluir los `.d.ts` en tu paquete npm** (recomendado). El campo `"types"` o `"typings"` en `package.json` apunta al punto de entrada de las declaraciones.
2. **Publicar en DefinitelyTyped** (si no puedes o no quieres incluir tipos, o para versiones legacy). Sin embargo, esto desacopla las versiones de tipos y código, y añade carga de mantenimiento a la comunidad. Para nuevas librerías, se prefiere la opción 1.

### Configuración de TypeScript para emitir declaraciones

```json
{
  "compilerOptions": {
    "declaration": true,
    "declarationMap": true,   // opcional pero recomendado
    "emitDeclarationOnly": false, // emite JS y .d.ts
    "outDir": "./dist",
    "rootDir": "./src"
  }
}
```

Es importante que `rootDir` esté correctamente definido para que la estructura de salida de los `.d.ts` coincida con la de los fuentes y las importaciones internas funcionen.

### Punto de entrada de tipos

En `package.json`:

```json
{
  "name": "mi-libreria",
  "version": "1.0.0",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.mjs",
      "require": "./dist/index.cjs"
    }
  }
}
```

Usar el campo `"exports"` con la condición `"types"` es la forma más moderna y compatible con `moduleResolution: node16`/`bundler`. Asegúrate de que las rutas de los tipos estén listadas **primero** en cada punto de entrada.

### Múltiples puntos de entrada

Si tu librería tiene submódulos (`mi-lib/foo`), debes exponer sus tipos también. Puedes hacerlo:
- Emitiendo los `.d.ts` correspondientes y usando `exports` con condiciones para cada uno.
- O usando una herramienta como `rollup-plugin-dts` para agrupar todos los tipos en un único archivo (si la API es plana).

Ejemplo con `exports`:

```json
{
  "exports": {
    "./foo": {
      "types": "./dist/foo.d.ts",
      "import": "./dist/foo.mjs"
    }
  }
}
```

### Dual CJS/ESM y tipos

Si emites tanto CommonJS como ES Modules, los tipos son los mismos (las declaraciones no dependen del sistema de módulos). Basta con un solo conjunto de `.d.ts`. Se puede usar el campo `"types"` global o `exports` con condición `"types"`.

Algunas herramientas como `tsup` o `unbuild` emiten ambas variantes de JS y copian los `.d.ts` (o generan desde una sola compilación).

### Evitando que los tipos internos se filtren

Los archivos `.d.ts` emitidos incluyen todas las exportaciones de tus módulos fuente. Si tienes funciones o interfaces que no deseas exponer, puedes:
- Usar `@internal` en JSDoc para marcarlas y luego emplear un herramienta como `api-extractor` que las elimina del paquete de tipos.
- Reexportar solo la API pública desde un `index.ts` y usar `stripInternal` en tsconfig (TypeScript puede eliminar declaraciones marcadas con `/** @internal */` si activas `"stripInternal": true` en `compilerOptions`).

### Agrupar declaraciones con API Extractor o `rollup-plugin-dts`

Para librerías grandes, emitir la estructura de carpetas completa puede ser pesado. Herramientas como `@microsoft/api-extractor` o `rollup-plugin-dts` permiten enrollar todos los `.d.ts` en un único archivo (`.d.ts` rollup), manteniendo solo la API pública. Mejora el rendimiento del consumidor y permite ocultar tipos internos.

### Publicar tipos junto con el código

Asegúrate de que los `.d.ts` estén incluidos en el paquete (no en `.gitignore` ni `.npmignore`). Generalmente se emiten a `dist/` y esa carpeta se publica.

### Pruebas de tus tipos antes de publicar

- Compila tu proyecto con `tsc` para asegurar que no hay errores en los tipos.
- Usa `tsd` o crea un proyecto de prueba que importe tu librería y ejercite la API; verifica que no haya errores de tipo.
- Ejecuta `npm pack` y examina los contenidos para comprobar que los `.d.ts` están presentes.

### Versionado semántico de los tipos

Las declaraciones de tipo son parte de la API pública. Cualquier cambio incompatible (renombrar una función, cambiar tipos de parámetros, eliminar una exportación) debe ir acompañado de un major bump. Los consumidores pueden verse afectados por cambios en los tipos aunque el runtime no cambie, así que sigue el versionado semántico estrictamente.

### Migrar de DefinitelyTyped a tipos incluidos

Si tu librería ya tiene tipos en `@types`, y decides incluirlos en el propio paquete:
1. Copia o reescribe los tipos en tu código fuente (preferiblemente migrando a TypeScript puro).
2. Publica una nueva versión con el campo `"types"`.
3. Marca el paquete `@types` como deprecated (enviando un PR a DefinitelyTyped que añada un `"deprecated": true` en `package.json` y un aviso en `index.d.ts`).

### Buenas prácticas finales

- Siempre emite declaraciones si tu librería es TypeScript.
- Proporciona `declarationMap` para una experiencia de desarrollo superior.
- Mantén los tipos y el código en el mismo repositorio para evitar desincronización.
- Documenta los tipos complejos con JSDoc.
- Prueba los tipos en un proyecto consumidor antes de publicar.

Con esto, tus usuarios disfrutarán de una experiencia TypeScript impecable.

---

