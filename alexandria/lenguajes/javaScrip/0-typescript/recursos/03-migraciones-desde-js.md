# Migraciones desde js

Migrar un proyecto JavaScript a TypeScript puede hacerse de forma incremental. Aquí tienes una estrategia paso a paso, consideraciones con dependencias, trucos con JSDoc y manejo de deuda técnica.

## 1. Preparación del entorno

1. Instala TypeScript como dependencia de desarrollo:
   ```bash
   npm install --save-dev typescript @types/node
   ```
   Si usas React, instala también `@types/react`, `@types/react-dom`.

2. Crea un `tsconfig.json` inicial **tolerante** con JavaScript:
   ```json
   {
     "compilerOptions": {
       "target": "ES2020",
       "module": "ESNext",
       "moduleResolution": "bundler",
       "strict": false,
       "allowJs": true,
       "checkJs": false,
       "esModuleInterop": true,
       "skipLibCheck": true,
       "outDir": "./dist",
       "rootDir": "."
     },
     "include": ["src", "lib"]
   }
   ```
   - `allowJs: true` permite importar archivos `.js`.
   - `checkJs: false` (por ahora) no reporta errores en archivos JS.
   - `strict: false` para empezar sin cientos de errores.

3. Asegura que el compilador pueda ejecutarse (`npx tsc --noEmit`) sin errores de configuración.

## 2. Estrategia de migración progresiva

### Opción A: archivo por archivo

- Renombra un archivo de `.js` a `.ts` (o `.jsx` a `.tsx`).
- Corrige los errores que aparezcan. Anota tipos básicos.
- Repite hasta migrar todo.

### Opción B: habilitar `checkJs` con JSDoc

Antes de renombrar, puedes añadir tipos en comentarios JSDoc y activar `checkJs: true`. Esto te permite obtener verificación de tipos sin cambiar la extensión.

```js
// sumar.js (con JSDoc)
/**
 * @param {number} a
 * @param {number} b
 * @returns {number}
 */
export function sumar(a, b) {
  return a + b;
}
```

Con `checkJs`, el compilador usará esos tipos. Luego puedes renombrar y eliminar los comentarios, generando las anotaciones automáticamente.

## 3. Añadir tipos gradualmente

Comienza por las funciones de utilidad, APIs de módulos y modelos de datos. Define interfaces para objetos clave.

```ts
// types.ts
export interface Usuario {
  id: number;
  nombre: string;
  email: string;
  activo: boolean;
}
```

Cuando llegues a un código que usa `require`, conviértelo a `import`:

```ts
import express from 'express';
```

Si una librería no tiene tipos, instala el paquete `@types/...`. Si no existe, crea una declaración local temporal:

```ts
// types/libreria-sin-tipos.d.ts
declare module 'libreria-sin-tipos' {
  export function hacerAlgo(): void;
}
```

## 4. Manejo de dependencias sin tipos

- Busca tipos en DefinitelyTyped: `npm install --save-dev @types/lodash`.
- Si no hay, puedes declarar el módulo con `any` temporalmente y luego refinarlo:
  ```ts
  declare module 'modulo-desconocido';
  // Con esto puedes importarlo y se tratará como any
  ```
- Crea un archivo `src/global.d.ts` para declarar variables globales y módulos comodín (CSS, imágenes).

## 5. Activación progresiva de `strict`

El verdadero poder de TypeScript está en el modo estricto. Ve activando las banderas una a una para acotar los cambios:

1. **`noImplicitAny`**: forzará a tipar parámetros que no infieran. Es la que más trabajo da. Puedes dejar `any` explícito en algunos sitios y luego refinarlos.
2. **`strictNullChecks`**: te obligará a manejar `null`/`undefined`. Es la más transformadora. Requiere anidar comprobaciones.
3. **`strictFunctionTypes`**: corrige la varianza en callbacks.
4. **`strictPropertyInitialization`**: para clases; puede requerir inicializadores directos o marcar con `!`.

Puedes activar `strict: true` y luego deshabilitar las que causen demasiados errores con `false`, pero es más didáctico ir activando.

## 6. Migración de CommonJS a módulos ES

Si tu proyecto usa `require`:
- Cambia `const express = require('express')` → `import express from 'express'`.
- Cambia `module.exports = ...` → `export default ...` o `export const ...`.
- Para imports con nombre que vienen de CJS, puede que necesites `esModuleInterop: true`.
- Si tienes `__dirname` y `__filename`, en ESM se obtienen con `import.meta.url` y `fileURLToPath`.

## 7. Reemplazar patrones dinámicos problemáticos

- **Objetos con propiedades dinámicas**: Define una interfaz o usa `Record<string, unknown>` como paso inicial.
- **Acceso a propiedades con `any`**: usa genéricos con `keyof` o `unknown` más estrechamiento.
- **Callbacks sin tipar**: tipa los parámetros del callback.

## 8. Uso de `any` de escape

Es normal dejar algunos `any` durante la migración. Para que no se escapen, puedes configurar `noImplicitAny` pero aún así usar `any` explícito. Incluso puedes usar `// @ts-ignore` o `// @ts-expect-error` para casos puntuales, pero siempre con un comentario y un TODO.

## 9. Integración con el build existente

Si usas Webpack/Vite con Babel/esbuild, puedes mantener la transpilación y añadir `tsc --noEmit` en CI para chequeo de tipos. Así separas transpilación de verificación.

**Ejemplo de scripts**:
```json
{
  "build": "webpack",
  "typecheck": "tsc --noEmit",
  "lint": "eslint 'src/**/*.{ts,tsx}'"
}
```

## 10. Herramientas de automatización

- **`ts-migrate`** de Airbnb: añade tipos `any` automáticamente y renombra archivos.
- **`typescript-codemods`**: transformaciones automáticas (ej. convertir `React.createClass` a clases ES).
- **`tsc --noEmit --pretty`** para obtener errores legibles.
- **Editores**: VS Code muestra errores en archivos JS si `checkJs` está activo; puedes ir corrigiendo sobre la marcha.

## 11. Checklist de migración completa

- [ ] Todos los archivos fuente están en `.ts`/`.tsx`.
- [ ] `tsconfig.json` tiene `strict: true` (o al menos las banderas deseadas).
- [ ] `tsc --noEmit` sale sin errores.
- [ ] Las dependencias tienen tipos (instalados o declarados).
- [ ] Los paths/aliases coinciden entre `tsconfig` y el empaquetador.
- [ ] Los scripts npm incluyen `typecheck`.
- [ ] CI ejecuta `typecheck`.

## 12. Ejemplo de declaración para módulos comunes (añadir a `global.d.ts`)

```ts
// Para CSS modules
declare module '*.module.css' {
  const classes: { readonly [key: string]: string };
  export default classes;
}

// Para imágenes
declare module '*.png' {
  const src: string;
  export default src;
}

// Para SVG como componente React
declare module '*.svg' {
  import React from 'react';
  const SVG: React.FC<React.SVGProps<SVGSVGElement>>;
  export default SVG;
}
```

Con estos tres cheatsheets, tienes a mano las transformaciones de tipos más útiles, la configuración lista para copiar y una guía completa para llevar un proyecto JavaScript a TypeScript de manera controlada.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Configuracion rapida](02-configuracion-rapida.md) | [🏠 Inicio](../index.md) | ➖ |
