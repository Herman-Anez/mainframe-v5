# Module declarations

Cuando una librería JavaScript no incluye sus propios tipos, TypeScript permite declarar la forma del módulo mediante `declare module`. Este mecanismo cubre desde librerías completas hasta activos estáticos como imágenes o CSS.

## `declare module "nombre"`

La sintaxis básica para describir un módulo de terceros:

```ts
declare module "lib-sin-tipos" {
  export function foo(bar: string): number;
  export const VERSION: string;
  export default class Cliente { ... }
}
```

TypeScript tratará cualquier importación de `"lib-sin-tipos"` como si tuviera esas exportaciones. Es similar a escribir un `.d.ts` del módulo, pero se puede colocar en cualquier archivo `.d.ts` del proyecto.

## Módulos ambientales vs declaraciones de paquetes

- **Módulo ambiental**: `declare module "nombre" { ... }`. Se puede declarar en un archivo propio (por ejemplo, `types/mi-modulo.d.ts`). No necesita que el módulo exista realmente.
- **Módulo de paquete**: si existe un paquete `@types/nombre`, tiene prioridad sobre un módulo ambiental con el mismo nombre. Para sobrescribirlo se puede usar un `declare module` en un archivo local, pero suele ser mejor contribuir a DefinitelyTyped.

## Exportaciones y default exports

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

## Comodines para activos (wildcard modules)

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

## Módulos con puntos de entrada anidados

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

## Módulos con template literal

Desde TypeScript 4.1, se pueden usar patrones con template literals para capturar prefijos:

```ts
declare module "libreria/*" {
  const content: any;
  export default content;
}
```

Esto permite `import img from 'libreria/imagenes/logo.png'` con tipo `any`. Más potente aún, con `declare module` y un patrón genérico no se pueden capturar parámetros, pero para casos simples de comodín basta.

## Módulos genéricos

Se puede declarar un módulo con parámetros de tipo usando la misma sintaxis que una función:

```ts
declare module "observable" {
  export interface Observable<T> {
    subscribe(observer: (value: T) => void): void;
  }
  export function create<T>(value: T): Observable<T>;
}
```

## Módulos que exponen tanto función como namespace

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

## `declare module` dentro de un archivo `.ts` normal

Puedes colocar `declare module` en un archivo `.ts` que ya tiene lógica. Sin embargo, es una mala práctica porque mezcla lógica de tipos con código que sí se ejecuta. Mejor mantenerlo en un `.d.ts` dedicado.

## Aumentación de módulos vs declaración completa

- **Declaración completa**: `declare module "foo" { ... }` describe el módulo desde cero. Se usa cuando no hay tipos o quieres sobrescribirlos completamente.
- **Aumentación**: `declare module "foo" { interface Bar { nuevaProp: number } }` agrega propiedades a interfaces ya existentes del módulo, sin redefinir todo el módulo (ver siguiente tema).

## Buenas prácticas

- Centraliza las declaraciones de módulos de terceros en una carpeta `types/` y asegúrate de que `tsconfig.json` las incluya.
- Usa `export =` para módulos CommonJS de una sola exportación.
- No declares un módulo completo si solo necesitas aumentar una interfaz; usa aumentación.
- Si la librería es popular, considera contribuir a DefinitelyTyped en lugar de mantener un archivo local.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Global declarations](02-global-declarations.md) | [🏠 Inicio](../index.md) | [Augmentation ▶](04-augmentation.md) |
