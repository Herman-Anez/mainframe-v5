## 01-sistemas-de-modulos.md

TypeScript se integra con los distintos sistemas de módulos del ecosistema JavaScript. Comprender cómo y por qué elegir uno es fundamental para la correcta emisión de código, la resolución de importaciones y la interoperabilidad.

### Sistemas históricos

JavaScript no tuvo un sistema de módulos nativo hasta ES2015. Antes surgieron:

- **CommonJS (CJS)**: usado por Node.js. `require()` y `module.exports`. Síncrono, carga bajo demanda, diseño pensado para servidor.
- **AMD**: Asynchronous Module Definition, para navegadores. `define(['dep'], callback)`. Carga asíncrona.
- **UMD**: Universal Module Definition, un envoltorio que soporta CJS, AMD y global (window). Usado por librerías para compatibilidad universal.
- **SystemJS / System.register**: formato más moderno, permite cargar módulos ES, CJS, etc. en navegador, con soporte de carga dinámica.

### Módulos ES (ESM)

Estándar oficial a partir de ES2015: `import` y `export`. Soporta análisis estático, tree shaking y carga asíncrona en plataformas modernas. Todos los navegadores y Node.js lo soportan actualmente.

**Ventajas sobre CJS**:
- Estático: se pueden analizar las dependencias sin ejecutar.
- Importación en vivo (live bindings): si el módulo exportador cambia una variable, el importador ve el cambio.
- `import()` asíncrono dinámico.
- Sintaxis más limpia y consistente.

### Cómo TypeScript elige el sistema de salida

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

### Interoperabilidad entre CJS y ESM

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

### Dual packages (CJS y ESM)

Muchas librerías publican tanto una versión CJS como una ESM. TypeScript soporta esto con `moduleResolution: node16`/`nodenext`, que lee el campo `exports` en `package.json` y las condiciones `import`, `require`, `types`. Así, un mismo import puede resolverse a diferentes archivos dependiendo del contexto. Para librerías propias, podemos emitir dos salidas con `tsc` (con diferentes tsconfigs) y configurar `package.json` adecuadamente.

### Resolución de módulos (relacionado con 03-05)

El sistema de módulos de salida interactúa fuertemente con la estrategia de resolución (`moduleResolution`). Por ejemplo, `module: NodeNext` fuerza `moduleResolution: NodeNext`. `module: ESNext` con `moduleResolution: node` puede causar confusión porque Node.js clásico no entiende ESM; en ese caso se usa `bundler` o se deja que un empaquetador resuelva.

### Migración de CJS a ESM en un proyecto TypeScript

1. Cambiar `module` a `NodeNext` (o `ESNext` si el empaquetador se encarga).
2. Actualizar `package.json` con `"type": "module"`.
3. Renombrar archivos de `.ts` a `.mts` si se necesita granularidad, o dejarlos como `.ts`.
4. Ajustar importaciones relativas para incluir la extensión `.js` en los imports (ej. `import './foo.js'` aunque el fuente sea `foo.ts`). En `moduleResolution: bundler` esto no es necesario.
5. Reemplazar `require` y `module.exports` por `import`/`export`.
6. Activar `esModuleInterop` si hay dependencias CJS.

### Resumen

TypeScript soporta todos los sistemas de módulos históricos y modernos. La decisión clave es el target de entorno: para navegadores con empaquetador, `ESNext`; para Node.js moderno, `NodeNext`. La interoperabilidad se maneja con las opciones de `esModuleInterop` y, en casos específicos, con sintaxis `import = require`. Conocer la salida esperada evita sorpresas en tiempo de ejecución.

---

## 02-import-export-syntax.md

TypeScript extiende la sintaxis de módulos de ES con construcciones específicas para tipos y compatibilidad con CommonJS. Aquí cubrimos todas las variantes.

### Importaciones y exportaciones con valor (runtime)

#### Exportaciones con nombre

```ts
export const PI = 3.14;
export function sumar(a: number, b: number): number { return a + b; }
export class Persona { ... }
export interface Animal { ... } // Las interfaces se exportan a nivel de tipos; no generan código.
export type ID = string | number; // tipo
```

Se puede exportar un bloque:

```ts
export { PI, sumar, Persona };
export { PI as numeroPi };
```

#### Exportación por defecto

```ts
export default class Cliente { ... }
export default function() { ... }
export default 42;
```

Un módulo solo puede tener una exportación por defecto. Se puede combinar con exportaciones con nombre.

#### Importación de valores

```ts
import { sumar } from './math';
import { sumar as add } from './math';
import * as math from './math';
import Cliente from './cliente'; // import default
import Cliente, { sumar } from './cliente'; // default + named
import './estilos.css'; // side-effect only
```

### `export =` e `import = require()` (para CommonJS)

TypeScript proporciona una sintaxis heredada para interoperar con módulos CJS que usan `module.exports = algo` (single export) o `exports.foo` (multiple exports).

```ts
// modulo-cjs.ts
class MiClase { ... }
export = MiClase; // Equivalente a module.exports = MiClase

// consumidor.ts
import MiClase = require('./modulo-cjs');
```

Esto es compatible con `module: CommonJS` y `module: AMD`. Con `module: ESNext`, no se puede usar directamente; hay que recurrir a `esModuleInterop` y la sintaxis estándar.

#### Importar un módulo CommonJS con múltiples exportaciones

```ts
import utils = require('./utils');
utils.foo();
```

Cuando se compila a ESM, esta sintaxis se transforma usando `createRequire` o `import * as utils from './utils'` si `esModuleInterop` está activo (dependiendo de la versión de TypeScript). La tendencia es evitar `import = require` en código nuevo y preferir la sintaxis de módulos ES con la configuración adecuada.

### Reexportaciones

```ts
export { sumar } from './math';
export { sumar as add } from './math';
export * from './math'; // reexporta todo (excepto default)
export * as MathUtils from './math'; // reexporta como namespace
export { default } from './cliente'; // reexporta default
```

### Importaciones y exportaciones de solo tipo

#### `import type` (declaración completa)

```ts
import type { Animal, ID } from './tipos';
import type ClientePorDefecto from './cliente'; // solo el tipo del default
import type * as Types from './tipos'; // todos los tipos como namespace
```

Estas importaciones se borran completamente en tiempo de compilación. No emiten `require` ni `import`. El compilador las usa solo para el chequeo de tipos. Si accidentalmente usas un valor importado de un `import type`, TypeScript lo marcará como error (a menos que el valor sea un tipo, como una clase, que también actúa como tipo).

#### Modificador `type` en importaciones individuales

```ts
import { type Animal, sumar } from './util';
// Animal solo se usa como tipo, sumar es valor.
```

Esto es útil cuando necesitas mezclar importaciones de tipo y valor en una misma declaración. Soporta también `import { type Animal as AnimalType }`.

#### `export type`

Similarmente:

```ts
export type { Animal };
export { type Animal, sumar };
export type * from './tipos';        // reexporta solo tipos (TS 5.0+)
export type * as Types from './tipos'; // reexporta tipos como namespace
```

#### `verbatimModuleSyntax` (TS 5.0+)

Cuando está activada, TypeScript prohíbe la elisión automática de importaciones de solo tipo. Obliga a usar explícitamente `import type` y `export type` para importaciones/exportaciones que son solo tipos. Esto garantiza que el código emitido sea exactamente el esperado sin que el compilador decida eliminar importaciones, lo cual es crucial para compatibilidad con el estándar ESM puro y herramientas como Babel/esbuild.

```json
{
  "compilerOptions": {
    "verbatimModuleSyntax": true
  }
}
```

Con esta bandera, `import { Foo } from './foo'` donde `Foo` es una interfaz, es un error si no usas `import type`. Siempre debes declarar explícitamente las intenciones.

### `import()` dinámico (valor)

```ts
const modulo = await import('./dinamico');
modulo.default();
modulo.miFuncion();
```

TypeScript trata el resultado como `Promise<typeof import('./dinamico')>`. El tipo del módulo se conoce en tiempo de compilación.

### `import()` como tipo (operador de tipo)

En contextos de tipo, `import('./modulo')` obtiene el tipo del módulo (equivalente a `typeof import('./modulo')`). Muy útil para referenciar el tipo de un módulo sin importarlo realmente en runtime, por ejemplo en anotaciones genéricas:

```ts
type MiModulo = import('./mi-modulo');
function cargar(): Promise<MiModulo> { ... }
```

También `import('./modulo').MiClase` para referirse a un miembro concreto.

### `import.meta`

TypeScript soporta `import.meta` con tipo definido como `ImportMeta`. Puedes aumentarlo con declaración global:

```ts
declare global {
  interface ImportMeta {
    env: Record<string, string>;
  }
}
console.log(import.meta.env);
```

Para `import.meta.url`, el tipo es `string`. Funciona con `module: ESNext` o `NodeNext`.

### Ciclos y dependencias circulares

TypeScript maneja circularidades de tipos sin problema. Pero con `verbatimModuleSyntax`, las importaciones de solo tipo ayudan a romper ciclos en tiempo de emisión porque no generan dependencia real en el JS.

### Buenas prácticas

- Usa `import type` siempre que solo necesites tipos; mejora el rendimiento del compilador y evita dependencias circulares en runtime.
- Activa `verbatimModuleSyntax` en nuevos proyectos para máxima claridad.
- Evita `import = require` en código nuevo; migra a importaciones estándar ESM con `esModuleInterop`.
- Usa reexportaciones con `export type *` para barriles de solo tipos.
- Aprovecha `import()` dinámico para code splitting con tipado completo.

---

## 03-namespaces.md

Los namespaces (espacios de nombres) son la forma antigua de organizar código en TypeScript, conocidos como "módulos internos". Antes de que ES2015 estandarizara los módulos, los namespaces eran la única manera de evitar colisiones globales. Hoy en día su uso está desaconsejado para aplicaciones, pero siguen siendo útiles en archivos de declaración (`.d.ts`) y para ciertos patrones avanzados.

### Concepto y sintaxis básica

```ts
namespace MiApp {
  export class Persona {
    constructor(public nombre: string) {}
  }
  export function saludar(p: Persona): void {
    console.log(`Hola ${p.nombre}`);
  }
  const interna = "secreto"; // no exportada, solo visible dentro
}

const persona = new MiApp.Persona("Ana");
MiApp.saludar(persona);
```

Un namespace puede contener cualquier declaración (variables, funciones, clases, interfaces, otros namespaces). Para que algo sea accesible desde fuera, debe estar marcado con `export`. Sin `export`, es privado al namespace.

### Compilación

Un namespace se compila a un IIFE (Immediately Invoked Function Expression) que crea un objeto global con las propiedades exportadas:

```js
var MiApp;
(function (MiApp) {
    class Persona { ... }
    MiApp.Persona = Persona;
    function saludar(p) { ... }
    MiApp.saludar = saludar;
    var interna = "secreto";
})(MiApp || (MiApp = {}));
```

Esto significa que los namespaces generan código que asume un entorno con variables globales. No son módulos: no usan `import`/`export` a nivel de archivo. Para cargar un namespace desde otro archivo, tradicionalmente se usaba `/// <reference path="..."/>`.

### Anidamiento

Se pueden anidar namespaces:

```ts
namespace App {
  export namespace UI {
    export class Boton { }
  }
}
```

### Fusión de namespaces (declaration merging)

Al igual que las interfaces, los namespaces se fusionan si comparten el mismo nombre en el mismo ámbito. Esto permite extender un namespace en múltiples archivos:

```ts
// archivo1.ts
namespace MiApp {
  export function inicio() {}
}
// archivo2.ts
namespace MiApp {
  export function final() {}
}
```

Ambas funciones coexisten en `MiApp`. Este comportamiento es clave para la estructura de los archivos de declaración globales, como `lib.d.ts`.

### Namespaces en archivos de declaración (`.d.ts`)

Aquí es donde los namespaces aún brillan. Se usan para describir APIs globales o librerías que añaden objetos al ámbito global:

```ts
declare namespace jQuery {
  interface JQuery {
    html(html: string): JQuery;
  }
  function $(selector: string): JQuery;
}
```

Luego en código TypeScript puedes usar `jQuery.$` directamente, previa inclusión del tipo (por ejemplo, instalando `@types/jquery`). Los namespaces también se utilizan para declarar módulos que exponen una API orientada a objetos global.

### Namespaces vs módulos ES

**Namespaces (módulos internos)**:
- Organizan código en el ámbito global.
- No tienen dependencias explícitas; se cargan por orden de scripts o con `/// <reference>`.
- Generan un objeto global (o anidado) en runtime.
- Son útiles para archivos `.d.ts` de librerías que no usan módulos.

**Módulos ES (módulos externos)**:
- Cada archivo es un módulo independiente con su propio ámbito.
- Usan `import`/`export` para relacionarse.
- Mejor encapsulación, análisis estático, carga asíncrona.
- Recomendados para toda aplicación nueva.

La documentación oficial de TypeScript desaconseja los namespaces para organizar código de aplicación. Prefiere módulos ES. Sin embargo, los namespaces tienen cabida en:
- Definición de tipos para librerías legacy globales.
- Aumentación de tipos globales (agregar propiedades a `window` o `global`).
- Archivos de configuración de tipos donde varios plugins pueden aumentar un mismo namespace (ejemplo: `Express.Request`).

### Namespaces y módulos juntos

Puedes tener un namespace dentro de un módulo, lo que crea una estructura anidada interna que no contamina el global. Por ejemplo, para organizar subcomponentes:

```ts
export namespace Geometria {
  export class Punto { }
}
```

Pero en general, se recomienda simplemente exportar las clases/funciones directamente sin envoltorio de namespace, ya que el sistema de módulos ya proporciona el espacio de nombres a través del nombre del módulo.

### `/// <reference>` tags

Son comentarios especiales que indican al compilador dependencias entre archivos cuando no se usan módulos. Los tres tipos principales:

- `/// <reference path="..." />`: incluye otro archivo en la compilación.
- `/// <reference types="..." />`: incluye un paquete de tipos (equivalente a `types` en tsconfig, pero a nivel de archivo).
- `/// <reference lib="..." />`: incluye una biblioteca estándar (ej. `es2015`).

Hoy en día, con `tsconfig.json` y módulos ES, estas referencias casi no se usan, salvo para archivos de declaración que no son módulos.

### Buenas prácticas modernas

- **No crees nuevos namespaces para organizar código**; usa módulos ES.
- Si encuentras una librería con tipos en namespace, envuélvela en un módulo usando `export as namespace` y `export =` para combinarla con un sistema de módulos.
- Para extender tipos globales (por ejemplo, añadir propiedades a `window`), puedes usar `declare global { interface Window { ... } }` sin necesidad de namespaces.
- Los namespaces siguen siendo la forma de representar código global en archivos `.d.ts`. Aprender a leerlos y escribirlos es necesario para contribuir a DefinitelyTyped.

---

## 04-import-type.md

La distinción entre importaciones que solo traen tipos y las que traen valores es crucial para la emisión correcta del código, el rendimiento del compilador y la resolución de dependencias circulares. TypeScript ofrece un soporte completo para importaciones de solo tipo, que han evolucionado hasta la versión 5.0.

### Fundamentos: ¿por qué `import type`?

Cuando importas una clase, interfaz o tipo de otro módulo, TypeScript necesita conocer la forma de ese tipo para el chequeo. Pero en tiempo de ejecución, si nunca usas la clase como valor (no la instancias ni accedes a propiedades estáticas), la importación es innecesaria y puede causar dependencias circulares no deseadas. Al marcar la importación como de solo tipo, TypeScript la elimina completamente del JavaScript emitido, asegurando que no haya `require` o `import` en runtime.

```ts
import type { Animal } from './animal';
import type Perro from './perro';

let mascota: Perro;
```

En el JS resultante, no habrá rastro de `./animal` ni `./perro`.

### `import type` vs `import` con elisión automática

Sin `import type`, TypeScript a menudo elimina importaciones que solo se usan como tipos, si puede determinarlo estáticamente. Pero esta elisión automática tiene limitaciones:
- No funciona si el módulo exporta una mezcla de valores y tipos y usas al menos un valor; entonces toda la declaración de import se emite.
- Puede ser confusa para herramientas externas (Babel, esbuild) que no tienen información de tipos.
- Con `verbatimModuleSyntax`, la elisión automática se deshabilita, forzándote a ser explícito.

`import type` es la forma explícita y robusta.

### Variantes de `import type`

1. **Declaración completa como tipo**:
   ```ts
   import type { A, B } from './mod';
   import type D from './mod'; // D es el tipo del default export
   import type * as Tipos from './mod';
   ```
   Solo los tipos son accesibles; no puedes usar los valores importados (ni siquiera si son clases que también actúan como valor).

2. **Modificador `type` en importaciones individuales** (desde TS 4.5):
   ```ts
   import { type A, B } from './mod';
   ```
   `A` se marca como tipo; `B` se trata como valor. Permite mezclar en una sola línea.

3. **`import()` como tipo**:
   ```ts
   type Modulo = import('./mod');
   type Clase = import('./mod').MiClase;
   ```
   Esto no genera ninguna importación en runtime, pero obtiene el tipo del módulo. Muy útil para tipos recursivos o referencias condicionales.

### `export type`

Similar para exportaciones:

```ts
export type { A, B };
export { type A, B }; // mezcla
export type * from './mod'; // reexporta solo tipos (TS 5.0+)
export type * as NS from './mod'; // reexporta tipos como namespace (TS 5.0+)
```

### `verbatimModuleSyntax` y el futuro

Con esta opción (TS 5.0+), TypeScript exige que todas las importaciones/exportaciones de solo tipo sean explícitas. Si un import contiene solo referencias a tipos y no usas `type`, será un error. Esto alinea TypeScript con la propuesta de "type-only imports" del estándar ECMAScript y garantiza que el código sea seguro para transpiladores que no chequean tipos.

```json
{
  "compilerOptions": {
    "verbatimModuleSyntax": true,
    "module": "NodeNext"
  }
}
```

En este modo, `import { Animal } from './animal'` donde `Animal` es una interfaz, es error. Debe ser `import type { Animal }`.

### Importaciones de clase como tipo y valor

Una clase es a la vez un valor (el constructor) y un tipo (la forma de la instancia). Si solo necesitas la forma, usa `import type`:

```ts
import type { Persona } from './persona';
let p: Persona;
```

Pero si también necesitas instanciar, necesitas la importación de valor normal.

### Aumentación de módulos con `import type`

Cuando haces module augmentation (aumentación de módulos), puedes usar `import type` para referenciar tipos del módulo que estás extendiendo sin introducir una dependencia real:

```ts
declare module 'express' {
  import type { Request as Req } from 'express';
  interface Request {
    user?: User;
  }
}
```

### Desacoplamiento y resolución de dependencias circulares

Los `import type` no generan dependencia en runtime, por lo que pueden romper ciclos de módulos que solo existen por referencias de tipo. Ejemplo: A define un tipo que usa un tipo de B, y B define un tipo que usa un tipo de A. Si ambos usan `import type`, no hay problema en runtime.

### Resumen de buenas prácticas

- Usa `import type` por defecto cuando solo necesitas la forma de algo.
- Activa `verbatimModuleSyntax` si tu entorno lo soporta (empaquetadores modernos y NodeNext).
- Para librerías, emite tipos con `export type` para reexportar solo tipos sin arrastrar el módulo entero.
- En archivos `.d.ts` de librerías, usa `import()` como tipo en anotaciones complejas para no forzar una dependencia de módulo real.

---

## 05-dynamic-imports.md

Los `import()` dinámicos permiten cargar módulos bajo demanda, lo que posibilita la división de código (code splitting) y la carga perezosa. TypeScript los soporta tanto como expresión de valor como operador de tipo.

### Import dinámico como expresión de valor

```ts
async function cargarUtilidad() {
  const modulo = await import('./utilidades');
  modulo.exportarDatos();
}
```

El tipo de `modulo` es `typeof import('./utilidades')`, es decir, el tipo del módulo que se cargaría estáticamente. Esto incluye todas las exportaciones con nombre y la exportación por defecto (en `modulo.default`). TypeScript también admite desestructuración:

```ts
const { exportarDatos } = await import('./utilidades');
```

### Tipado de la promesa

El resultado de `import('./ruta')` es `Promise<typeof import('./ruta')>`. Si el módulo no existe o hay un error, se rechazará la promesa; TypeScript no añade tipado para errores específicos.

### Import dinámico con `await` en funciones síncronas

Solo se puede usar `await` en funciones `async`. Sin embargo, la expresión `import()` puede usarse también sin `await`, devolviendo una promesa, lo que permite encadenar `.then()`.

### Uso con `import.meta.url` y rutas relativas

En entornos Node.js modernos y navegadores, puedes construir rutas dinámicas usando `import.meta.url` y el constructor `URL`:

```ts
const modulePath = new URL('./modulo.js', import.meta.url);
const mod = await import(modulePath.href);
```

TypeScript infiere el tipo como `any` si la ruta es dinámica (no es un string literal). Para preservar el tipado, puedes usar `as typeof import('./modulo')` o usar una función auxiliar que tome un literal de plantilla tipado.

### Import dinámico con rutas completamente dinámicas

Si la ruta es completamente dinámica (variable), TypeScript no puede conocer el tipo y asigna `any`. Para forzar un tipo concreto, usa una aserción:

```ts
const mod = await import(ruta) as typeof import('./mi-modulo');
```

### Code splitting en aplicaciones frontend

Los empaquetadores como Webpack, Vite y Rollup interpretan los `import()` con rutas estáticas (o patrones limitados) para crear chunks separados. TypeScript no interviene en ese proceso, pero el tipado garantiza que uses correctamente el módulo cargado.

Ejemplo con React (lazy):

```tsx
const LazyComponent = React.lazy(() => import('./HeavyComponent'));
```

### `import()` como tipo (operador de tipo)

En contextos de tipo, `import('./Modulo')` devuelve el tipo del módulo (equivalente a `typeof import('./Modulo')`). Se puede usar en cualquier lugar donde se espere un tipo:

```ts
type ConfigType = import('./config').Config;
type FullModule = import('./lib');
function factory(): Promise<import('./plugin')> { ... }
```

Esto es muy útil cuando no quieres (o no puedes) importar el módulo físicamente en tiempo de compilación por razones de dependencias circulares o condicionales. Al ser una expresión puramente de tipo, no genera código ni dependencia real.

### `import()` dinámico en declaraciones ambientales

Puedes declarar módulos que solo existen dinámicamente con `declare module` y luego usar `import()` para tiparlos:

```ts
declare module '*.png' {
  const src: string;
  export default src;
}
const imagen = await import('./logo.png');
// imagen.default es string
```

### Consideraciones según el target de módulo

- **`module: ESNext` o `NodeNext`**: emite `import()` tal cual, el entorno debe soportarlo.
- **`module: CommonJS`**: emite una promesa con `require` (en versiones recientes) o una sintaxis no soportada nativamente; se recomienda usar `esModuleInterop` y un target que soporte ESM dinámico, o dejarlo para empaquetadores.
- **`module: AMD`**: emite la carga asíncrona de AMD.
- **`module: System`**: usa `System.import`.

En la práctica, para aplicaciones modernas con `module: ESNext`, los `import()` se empaquetan y el código resultante depende del empaquetador.

### `import.meta` con importaciones dinámicas

A menudo se usan juntos, por ejemplo para cargar módulos relativos al archivo actual. TypeScript provee el tipo `ImportMeta` que puedes aumentar con propiedades personalizadas (como `env` en Vite). `import.meta.url` es una cadena disponible en ESM.

### Errores comunes y soluciones

- **"Cannot find module" en import dinámico**: verifica que la ruta sea correcta y que el archivo exista; para rutas dinámicas, TypeScript no puede verificar.
- **Pérdida de tipos con rutas dinámicas**: usa `as typeof import(...)` o `import()` como tipo en lugar de `await import()` si solo necesitas el tipo.
- **Ciclos con import dinámico**: pueden romperse en runtime pero a veces causan comportamientos extraños. TypeScript no los analiza; es un problema de diseño.

### Patrones avanzados

- **Carga condicional según entorno**:
  ```ts
  if (typeof window !== 'undefined') {
    const client = await import('./browser');
  } else {
    const server = await import('./node');
  }
  ```
- **Plugin systems**: cargar plugins dinámicamente y tiparlos con `import()` como tipo para una interfaz común.
- **Internacionalización**: cargar los mensajes del idioma detectado.

### Resumen

Los `import()` dinámicos de TypeScript son una herramienta completa que combina la carga bajo demanda con un tipado estático preciso. Usa `import()` como expresión para dividir código en runtime, y `import()` como tipo para referenciar tipos sin cargar módulos, manteniendo tu proyecto rápido y bien tipado.

---

