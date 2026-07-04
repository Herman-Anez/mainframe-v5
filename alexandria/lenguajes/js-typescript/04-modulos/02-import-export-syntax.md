# Import export syntax

TypeScript extiende la sintaxis de módulos de ES con construcciones específicas para tipos y compatibilidad con CommonJS. Aquí cubrimos todas las variantes.

## Importaciones y exportaciones con valor (runtime)

### Exportaciones con nombre

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

### Exportación por defecto

```ts
export default class Cliente { ... }
export default function() { ... }
export default 42;
```

Un módulo solo puede tener una exportación por defecto. Se puede combinar con exportaciones con nombre.

### Importación de valores

```ts
import { sumar } from './math';
import { sumar as add } from './math';
import * as math from './math';
import Cliente from './cliente'; // import default
import Cliente, { sumar } from './cliente'; // default + named
import './estilos.css'; // side-effect only
```

## `export =` e `import = require()` (para CommonJS)

TypeScript proporciona una sintaxis heredada para interoperar con módulos CJS que usan `module.exports = algo` (single export) o `exports.foo` (multiple exports).

```ts
// modulo-cjs.ts
class MiClase { ... }
export = MiClase; // Equivalente a module.exports = MiClase

// consumidor.ts
import MiClase = require('./modulo-cjs');
```

Esto es compatible con `module: CommonJS` y `module: AMD`. Con `module: ESNext`, no se puede usar directamente; hay que recurrir a `esModuleInterop` y la sintaxis estándar.

### Importar un módulo CommonJS con múltiples exportaciones

```ts
import utils = require('./utils');
utils.foo();
```

Cuando se compila a ESM, esta sintaxis se transforma usando `createRequire` o `import * as utils from './utils'` si `esModuleInterop` está activo (dependiendo de la versión de TypeScript). La tendencia es evitar `import = require` en código nuevo y preferir la sintaxis de módulos ES con la configuración adecuada.

## Reexportaciones

```ts
export { sumar } from './math';
export { sumar as add } from './math';
export * from './math'; // reexporta todo (excepto default)
export * as MathUtils from './math'; // reexporta como namespace
export { default } from './cliente'; // reexporta default
```

## Importaciones y exportaciones de solo tipo

### `import type` (declaración completa)

```ts
import type { Animal, ID } from './tipos';
import type ClientePorDefecto from './cliente'; // solo el tipo del default
import type * as Types from './tipos'; // todos los tipos como namespace
```

Estas importaciones se borran completamente en tiempo de compilación. No emiten `require` ni `import`. El compilador las usa solo para el chequeo de tipos. Si accidentalmente usas un valor importado de un `import type`, TypeScript lo marcará como error (a menos que el valor sea un tipo, como una clase, que también actúa como tipo).

### Modificador `type` en importaciones individuales

```ts
import { type Animal, sumar } from './util';
// Animal solo se usa como tipo, sumar es valor.
```

Esto es útil cuando necesitas mezclar importaciones de tipo y valor en una misma declaración. Soporta también `import { type Animal as AnimalType }`.

### `export type`

Similarmente:

```ts
export type { Animal };
export { type Animal, sumar };
export type * from './tipos';        // reexporta solo tipos (TS 5.0+)
export type * as Types from './tipos'; // reexporta tipos como namespace
```

### `verbatimModuleSyntax` (TS 5.0+)

Cuando está activada, TypeScript prohíbe la elisión automática de importaciones de solo tipo. Obliga a usar explícitamente `import type` y `export type` para importaciones/exportaciones que son solo tipos. Esto garantiza que el código emitido sea exactamente el esperado sin que el compilador decida eliminar importaciones, lo cual es crucial para compatibilidad con el estándar ESM puro y herramientas como Babel/esbuild.

```json
{
  "compilerOptions": {
    "verbatimModuleSyntax": true
  }
}
```

Con esta bandera, `import { Foo } from './foo'` donde `Foo` es una interfaz, es un error si no usas `import type`. Siempre debes declarar explícitamente las intenciones.

## `import()` dinámico (valor)

```ts
const modulo = await import('./dinamico');
modulo.default();
modulo.miFuncion();
```

TypeScript trata el resultado como `Promise<typeof import('./dinamico')>`. El tipo del módulo se conoce en tiempo de compilación.

## `import()` como tipo (operador de tipo)

En contextos de tipo, `import('./modulo')` obtiene el tipo del módulo (equivalente a `typeof import('./modulo')`). Muy útil para referenciar el tipo de un módulo sin importarlo realmente en runtime, por ejemplo en anotaciones genéricas:

```ts
type MiModulo = import('./mi-modulo');
function cargar(): Promise<MiModulo> { ... }
```

También `import('./modulo').MiClase` para referirse a un miembro concreto.

## `import.meta`

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

## Ciclos y dependencias circulares

TypeScript maneja circularidades de tipos sin problema. Pero con `verbatimModuleSyntax`, las importaciones de solo tipo ayudan a romper ciclos en tiempo de emisión porque no generan dependencia real en el JS.

## Buenas prácticas

- Usa `import type` siempre que solo necesites tipos; mejora el rendimiento del compilador y evita dependencias circulares en runtime.
- Activa `verbatimModuleSyntax` en nuevos proyectos para máxima claridad.
- Evita `import = require` en código nuevo; migra a importaciones estándar ESM con `esModuleInterop`.
- Usa reexportaciones con `export type *` para barriles de solo tipos.
- Aprovecha `import()` dinámico para code splitting con tipado completo.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Sistemas de modulos](01-sistemas-de-modulos.md) | [🏠 Inicio](../index.md) | [Namespaces ▶](03-namespaces.md) |
