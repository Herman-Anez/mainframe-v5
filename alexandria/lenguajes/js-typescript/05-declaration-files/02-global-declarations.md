# Global declarations

Las declaraciones globales permiten describir APIs que existen en el ámbito global de JavaScript, como `window`, `console`, `process` (Node.js), o variables inyectadas por otras herramientas. TypeScript ya incluye declaraciones para el DOM y ECMAScript vía `lib`. Aquí cubrimos cómo extender o crear nuevas globales.

## `declare` en ámbito global

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

## `declare global` desde un módulo

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

## Extender `Window`, `Document`, etc.

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

## Extender `globalThis`

`globalThis` es la forma estándar de acceder al objeto global en cualquier entorno. TypeScript lo declara como `typeof globalThis`, pero se puede aumentar:

```ts
declare global {
  var miApp: { version: string };
}
// En código: globalThis.miApp.version
```

## Tipos para variables inyectadas en tiempo de compilación

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

## Namespaces globales vs interfaces

Históricamente, las librerías declaraban un namespace global (por ejemplo, `declare namespace jQuery`). Hoy, para tipar librerías globales, se prefiere interfaces debido a su capacidad de fusionarse y ser extendidas. Por ejemplo, en lugar de un namespace con funciones, se puede declarar una función global con interfaz adicional:

```ts
declare function grecaptcha: {
  render(container: string, parameters: object): number;
  reset(id?: number): void;
};
```

## ¿Cuándo usar globales?

- Librerías de terceros que no usan módulos (ej. algunas analíticas, widgets embebidos).
- Polyfills o extensiones del prototipo (evitar a menos que sea necesario).
- Variables de entorno o constantes inyectadas por el sistema de build.
- Aumentos de tipos nativos (`String.prototype`, `Array.prototype`).

Pero en general, **prefiere módulos**. Las globales colisionan fácilmente y hacen el código menos mantenible.

## Conflicto entre múltiples declaraciones globales

Si dos archivos `.d.ts` declaran la misma global con diferentes tipos, TypeScript intenta fusionarlos según las reglas de merging:
- Interfaces y namespaces se fusionan.
- Variables y funciones causan error si hay conflicto.
Para evitar conflictos, asegúrate de que las declaraciones globales sean coherentes o usa módulos.

## Patrones seguros

- Coloca las declaraciones globales en un archivo dedicado (ej. `src/global.d.ts`) e inclúyelo en `tsconfig.json`.
- Usa `export {}` al final del archivo si quieres que sea un módulo y evites contaminación global accidental.
- Documenta qué globales se esperan y por qué.

## Ejemplo avanzado: aumentar `String`

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

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Fundamentos dts](01-fundamentos-dts.md) | [🏠 Inicio](../index.md) | [Module declarations ▶](03-module-declarations.md) |
