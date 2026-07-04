# Fundamentos dts

Los archivos de declaración (`.d.ts`) describen la forma de código JavaScript para que TypeScript pueda analizarlo, ofrecer autocompletado y detectar errores sin necesidad de reescribir el código original. Son el pegamento que permite el ecosistema de tipos.

## ¿Qué es un `.d.ts`?

Un archivo `.d.ts` es como un archivo de cabecera (header) en C/C++: describe los tipos, interfaces y firmas de un módulo o script, pero **no contiene implementación ejecutable**. El compilador TypeScript lo lee para entender la estructura de los valores que existirán en tiempo de ejecución.

```ts
// math.d.ts
export declare function sumar(a: number, b: number): number;
export declare const PI: number;
```

En un archivo de declaración **solo pueden aparecer declaraciones de tipo** (`declare`, `export`, `import type`, interfaces, types, etc.). No pueden contener expresiones o sentencias que generen código. La palabra clave `declare` indica al compilador que la variable, función o clase existe en otro lugar y no debe emitirla.

## Ámbitos: script vs módulo

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

## `declare` en profundidad

`declare` se usa en contextos ambientales (ambient) para describir entidades que existen en runtime pero cuyo código TypeScript no puede ver.

- `declare var` / `let` / `const`: variable global o de módulo.
- `declare function`: firma de función. Se pueden escribir sobrecargas.
- `declare class`: describe una clase (constructor y miembros). No se emite.
- `declare namespace`: agrupa declaraciones. Muy usado en tipos globales antiguos.
- `declare enum`: enum que existe en runtime. `const declare enum` no es válido porque no hay código que emitir.
- `declare module`: para declarar módulos de terceros o comodines.
- `declare global`: dentro de un módulo, permite añadir declaraciones al ámbito global.

## Estructura de un proyecto con declaraciones

Las declaraciones pueden venir de varias fuentes:

1. **Archivos propios `.d.ts`**: colocados junto al código fuente o en una carpeta `types/`.
2. **Paquetes de tipos (`@types`)** de DefinitelyTyped.
3. **Tipos incluidos por la librería** (campo `"types"` en su `package.json`).
4. **Declaraciones automáticas** de `lib.d.ts` (DOM, ES).

La opción `compilerOptions.types` controla qué paquetes de tipos se cargan automáticamente. La opción `typeRoots` especifica dónde buscarlos (por defecto `node_modules/@types`).

## Generación de archivos de declaración

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

## Declaraciones ambientales vs declaraciones de módulo

- **Declaración ambiental global**: describe algo en el ámbito global (`declare var $: JQueryStatic`). Útil para librerías con script tag.
- **Declaración de módulo ambiental**: describe la forma de un módulo importable (`declare module 'lodash' { ... }`). Es la forma moderna para librerías instaladas.

## Archivos `.d.ts` y el compilador

- Durante la compilación, TypeScript recoge todos los `.d.ts` referenciados (mediante `includes`, `files`, `types`).
- Si hay un `.d.ts` y un `.ts` con el mismo nombre base, el `.ts` tiene prioridad y el `.d.ts` se ignora.
- Las declaraciones ambientales globales no necesitan ser importadas; simplemente están disponibles.
- Las declaraciones de módulo son accesibles mediante `import` o `/// <reference types="..."/>`.

## `types` y `typings` en `package.json`

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

## Buenas prácticas

- Nunca edites un `.d.ts` generado automáticamente; es mejor corregir el fuente TypeScript y regenerar.
- Para añadir tipos a librerías sin tipos, crea un archivo `*.d.ts` local y asegúrate de que esté incluido en la compilación.
- Usa `declare global` con moderación; los módulos son preferibles para encapsular.
- Cuando escribas un `.d.ts` a mano, sigue la misma estructura de la librería original (CommonJS, ESM, global).
- Aprovecha `declare module 'nombre'` y los patrones con comodines para módulos que no son código (CSS, imágenes).

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Dynamic imports](../04-modulos/05-dynamic-imports.md) | [🏠 Inicio](../index.md) | [Global declarations ▶](02-global-declarations.md) |
