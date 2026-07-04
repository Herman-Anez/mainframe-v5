## `tipos-utilitarios.md`

TypeScript incluye un conjunto de **tipos utilitarios predefinidos** que realizan transformaciones comunes sobre tipos existentes. Conocerlos y saber combinarlos es esencial para escribir tipos mantenibles. Además, veremos patrones de utilidades personalizadas que extienden estas capacidades.

### Modificadores de propiedades

#### `Partial<T>`

Convierte todas las propiedades de `T` en opcionales.

```ts
interface Usuario {
  nombre: string;
  edad: number;
  email: string;
}

type UsuarioParcial = Partial<Usuario>;
// { nombre?: string; edad?: number; email?: string }
```

**Implementación manual**:
```ts
type Partial<T> = { [P in keyof T]?: T[P] };
```

#### `Required<T>`

Lo opuesto a `Partial`: hace que todas las propiedades sean obligatorias.

```ts
type UsuarioCompleto = Required<UsuarioParcial>;
// { nombre: string; edad: number; email: string }
```

**Implementación**:
```ts
type Required<T> = { [P in keyof T]-?: T[P] };
```

El `-?` elimina la opcionalidad.

#### `Readonly<T>`

Convierte todas las propiedades en solo lectura.

```ts
type UsuarioReadonly = Readonly<Usuario>;
// { readonly nombre: string; readonly edad: number; readonly email: string }
```

**Implementación**:
```ts
type Readonly<T> = { readonly [P in keyof T]: T[P] };
```

#### `Mutable<T>` (custom)

Elimina el modificador `readonly` de un tipo.

```ts
type Mutable<T> = { -readonly [P in keyof T]: T[P] };
```

### Selección de propiedades

#### `Pick<T, K>`

Extrae un subconjunto de propiedades `K` de `T`.

```ts
type TarjetaUsuario = Pick<Usuario, "nombre" | "email">;
// { nombre: string; email: string }
```

**Implementación**:
```ts
type Pick<T, K extends keyof T> = { [P in K]: T[P] };
```

#### `Omit<T, K>`

Excluye las propiedades `K` de `T`.

```ts
type UsuarioSinEmail = Omit<Usuario, "email">;
// { nombre: string; edad: number }
```

**Implementación** (usando `Pick` y `Exclude`):
```ts
type Omit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>;
```

### Construcción de objetos

#### `Record<K, T>`

Crea un tipo con claves `K` y valores `T`.

```ts
type Paginas = "home" | "about" | "contact";
type Navegacion = Record<Paginas, { url: string; titulo: string }>;
// { home: {...}; about: {...}; contact: {...} }
```

**Implementación**:
```ts
type Record<K extends keyof any, T> = { [P in K]: T };
```

### Filtrado de uniones

#### `Exclude<T, U>`

Elimina de `T` los miembros que son asignables a `U`.

```ts
type T = Exclude<"a" | "b" | "c", "a" | "b">; // "c"
type SinNull = Exclude<string | null | undefined, null | undefined>; // string
```

**Implementación**:
```ts
type Exclude<T, U> = T extends U ? never : T;
```

#### `Extract<T, U>`

Extrae los miembros de `T` que son asignables a `U`.

```ts
type SoloStrings = Extract<string | number | boolean, string>; // string
```

**Implementación**:
```ts
type Extract<T, U> = T extends U ? T : never;
```

#### `NonNullable<T>`

Elimina `null` y `undefined` de `T`.

```ts
type T = NonNullable<string | null | undefined>; // string
```

**Implementación**:
```ts
type NonNullable<T> = T & {};  // forma corta moderna
// o usando Exclude
type NonNullable<T> = Exclude<T, null | undefined>;
```

### Obtención de tipos de funciones

#### `ReturnType<T>`

Obtiene el tipo de retorno de una función.

```ts
function createUser() {
  return { name: "Ana", age: 30 };
}
type User = ReturnType<typeof createUser>; // { name: string; age: number }
```

#### `Parameters<T>`

Obtiene el tipo de los parámetros de una función como tupla.

```ts
function saveUser(name: string, age: number): void {}
type SaveParams = Parameters<typeof saveUser>; // [name: string, age: number]
```

#### `ConstructorParameters<T>`

Parámetros del constructor de una clase.

```ts
class Usuario {
  constructor(public nombre: string, public edad: number) {}
}
type ParamsCtor = ConstructorParameters<typeof Usuario>; // [string, number]
```

#### `InstanceType<T>`

Tipo de la instancia de una clase constructora.

```ts
type InstanciaUsuario = InstanceType<typeof Usuario>; // Usuario
```

#### `ThisParameterType<T>` y `OmitThisParameter<T>`

Extraen o eliminan el parámetro `this` de una función.

```ts
function fn(this: { nombre: string }, x: number) {}
type ThisCtx = ThisParameterType<typeof fn>; // { nombre: string }
type FnSinThis = OmitThisParameter<typeof fn>; // (x: number) => void
```

### Tipos para promesas y encadenamiento

#### `Awaited<T>`

Desenvuelve promesas recursivamente (TS 4.5+).

```ts
type A = Awaited<Promise<string>>; // string
type B = Awaited<Promise<Promise<number>>>; // number
```

### Manipulación de strings mediante tipos intrínsecos

Estos tipos están integrados en el compilador y no tienen una implementación visible.

```ts
type Saludo = "hola";
type Gritando = Uppercase<Saludo>;        // "HOLA"
type Susurrando = Lowercase<"TYPESCRIPT">; // "typescript"
type Capitalizado = Capitalize<Saludo>;    // "Hola"
type Decapitalizado = Uncapitalize<"Hola">; // "hola"
```

### Utilidades para contexto de prueba (TS 5.4+)

#### `NoInfer<T>`

Bloquea la inferencia del parámetro genérico en ese sitio.

```ts
function crearElemento<T>(etiqueta: string, contenido: T, extra: NoInfer<T>): void {}
crearElemento("div", 42, 100); // OK, extra no influye en inferencia
crearElemento("div", 42, "texto"); // Error: string no asignable a number
```

### Colección de utilidades personalizadas

#### `DeepPartial<T>`

Hace todas las propiedades de todos los niveles opcionales.

```ts
type DeepPartial<T> = T extends object
  ? { [P in keyof T]?: DeepPartial<T[P]> }
  : T;
```

#### `DeepRequired<T>`

Lo opuesto.

```ts
type DeepRequired<T> = T extends object
  ? { [P in keyof T]-?: DeepRequired<T[P]> }
  : T;
```

#### `DeepReadonly<T>`

```ts
type DeepReadonly<T> = T extends object
  ? { readonly [P in keyof T]: DeepReadonly<T[P]> }
  : T;
```

#### `NonNullableKeys<T>`

Obtiene solo las claves que no aceptan `null | undefined`.

```ts
type NonNullableKeys<T> = {
  [K in keyof T]: T[K] extends null | undefined ? never : K;
}[keyof T];
```

#### `Merge<T, U>`

Combina dos objetos dando prioridad a `U` en caso de conflicto.

```ts
type Merge<T, U> = Omit<T, keyof U> & U;
```

#### `ValueOf<T>`

Obtiene la unión de todos los tipos de valor de un objeto.

```ts
type ValueOf<T> = T[keyof T];
```

#### `Override<T, U>`

Sobrescribe las propiedades de `T` con las de `U` pero manteniendo las que no existen en `U`.

```ts
type Override<T, U> = Omit<T, keyof U> & U;
```

**Nota**: Hay infinitas variaciones; estas son las más utilizadas. Los tipos mapeados, condicionales e `infer` permiten construir cualquier transformación que necesites.

---

## `configuracion-rapida.md`

Una guía para configurar TypeScript rápidamente en diferentes tipos de proyectos, con los `compilerOptions` más importantes y plantillas listas para copiar.

### Configuración mínima recomendada (estricta)

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src"]
}
```

Esta base sirve para la mayoría de aplicaciones empaquetadas con Vite, Webpack, etc. Siempre activa `strict`.

### Para Node.js actual (ESM)

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src"]
}
```

Acompañar con `"type": "module"` en el `package.json`. Las importaciones relativas deben llevar extensión `.js` (TypeScript emitirá `.js`). Puedes evitar la extensión usando `module: "ESNext"` y `moduleResolution: "bundler"` si luego empaquetas.

### Para librerías (publicación de tipos)

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist", "**/*.test.ts"]
}
```

Para emitir solo declaraciones (sin JS) usa `"emitDeclarationOnly": true` junto con otro transpilador.

### Para React con JSX

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src"]
}
```

### Monorepo con project references

Raíz `tsconfig.json` (solo referencias, sin fuentes):

```json
{
  "files": [],
  "references": [
    { "path": "./packages/common" },
    { "path": "./packages/server" },
    { "path": "./packages/client" }
  ]
}
```

Cada paquete debe tener `composite: true`:

```json
{
  "compilerOptions": {
    "composite": true,
    "declaration": true,
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true
  },
  "include": ["src"]
}
```

Compilar todo con: `tsc --build`.

### Opciones estrictas detalladas

`"strict": true` activa:
- `strictNullChecks`
- `noImplicitAny`
- `noImplicitThis`
- `strictFunctionTypes`
- `strictPropertyInitialization`
- `strictBindCallApply`
- `alwaysStrict`

Puedes activar alguna por separado si necesitas un modo semiestricto, pero no se recomienda.

### Otras opciones de calidad

- `"noUnusedLocals": true` – error si hay variables locales sin usar.
- `"noUnusedParameters": true` – error si hay parámetros sin usar.
- `"noImplicitReturns": true` – todas las ramas deben devolver un valor.
- `"noFallthroughCasesInSwitch": true` – prohibe la caída entre `case`.
- `"exactOptionalPropertyTypes": true` – no permite `undefined` en propiedades opcionales.
- `"noUncheckedIndexedAccess": true` – añade `| undefined` a accesos con índice.

### Mapeo de rutas (aliases)

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@app/*": ["src/app/*"],
      "@utils/*": ["src/utils/*"]
    }
  }
}
```

Recuerda que los empaquetadores necesitan replicar estos alias. Con Vite puedes usar `vite-tsconfig-paths`.

### Scripts npm recomendados

```json
{
  "scripts": {
    "build": "tsc",
    "watch": "tsc --watch",
    "typecheck": "tsc --noEmit",
    "lint": "eslint 'src/**/*.{ts,tsx}'",
    "test": "vitest"
  }
}
```

### `tsconfig` para chequeo de tipos sin emisión (solo CI)

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "strict": true,
    "noEmit": true,
    "skipLibCheck": true
  },
  "include": ["src"]
}
```

### Depuración rápida de errores

- `--traceResolution` para ver cómo se resuelven los módulos.
- `--showConfig` para ver la configuración final aplicada.
- `--noErrorTruncation` para mensajes de error completos.
- `--explainFiles` para ver qué archivos se incluyen.

---

## `migraciones-desde-js.md`

Migrar un proyecto JavaScript a TypeScript puede hacerse de forma incremental. Aquí tienes una estrategia paso a paso, consideraciones con dependencias, trucos con JSDoc y manejo de deuda técnica.

### 1. Preparación del entorno

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

### 2. Estrategia de migración progresiva

#### Opción A: archivo por archivo

- Renombra un archivo de `.js` a `.ts` (o `.jsx` a `.tsx`).
- Corrige los errores que aparezcan. Anota tipos básicos.
- Repite hasta migrar todo.

#### Opción B: habilitar `checkJs` con JSDoc

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

### 3. Añadir tipos gradualmente

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

### 4. Manejo de dependencias sin tipos

- Busca tipos en DefinitelyTyped: `npm install --save-dev @types/lodash`.
- Si no hay, puedes declarar el módulo con `any` temporalmente y luego refinarlo:
  ```ts
  declare module 'modulo-desconocido';
  // Con esto puedes importarlo y se tratará como any
  ```
- Crea un archivo `src/global.d.ts` para declarar variables globales y módulos comodín (CSS, imágenes).

### 5. Activación progresiva de `strict`

El verdadero poder de TypeScript está en el modo estricto. Ve activando las banderas una a una para acotar los cambios:

1. **`noImplicitAny`**: forzará a tipar parámetros que no infieran. Es la que más trabajo da. Puedes dejar `any` explícito en algunos sitios y luego refinarlos.
2. **`strictNullChecks`**: te obligará a manejar `null`/`undefined`. Es la más transformadora. Requiere anidar comprobaciones.
3. **`strictFunctionTypes`**: corrige la varianza en callbacks.
4. **`strictPropertyInitialization`**: para clases; puede requerir inicializadores directos o marcar con `!`.

Puedes activar `strict: true` y luego deshabilitar las que causen demasiados errores con `false`, pero es más didáctico ir activando.

### 6. Migración de CommonJS a módulos ES

Si tu proyecto usa `require`:
- Cambia `const express = require('express')` → `import express from 'express'`.
- Cambia `module.exports = ...` → `export default ...` o `export const ...`.
- Para imports con nombre que vienen de CJS, puede que necesites `esModuleInterop: true`.
- Si tienes `__dirname` y `__filename`, en ESM se obtienen con `import.meta.url` y `fileURLToPath`.

### 7. Reemplazar patrones dinámicos problemáticos

- **Objetos con propiedades dinámicas**: Define una interfaz o usa `Record<string, unknown>` como paso inicial.
- **Acceso a propiedades con `any`**: usa genéricos con `keyof` o `unknown` más estrechamiento.
- **Callbacks sin tipar**: tipa los parámetros del callback.

### 8. Uso de `any` de escape

Es normal dejar algunos `any` durante la migración. Para que no se escapen, puedes configurar `noImplicitAny` pero aún así usar `any` explícito. Incluso puedes usar `// @ts-ignore` o `// @ts-expect-error` para casos puntuales, pero siempre con un comentario y un TODO.

### 9. Integración con el build existente

Si usas Webpack/Vite con Babel/esbuild, puedes mantener la transpilación y añadir `tsc --noEmit` en CI para chequeo de tipos. Así separas transpilación de verificación.

**Ejemplo de scripts**:
```json
{
  "build": "webpack",
  "typecheck": "tsc --noEmit",
  "lint": "eslint 'src/**/*.{ts,tsx}'"
}
```

### 10. Herramientas de automatización

- **`ts-migrate`** de Airbnb: añade tipos `any` automáticamente y renombra archivos.
- **`typescript-codemods`**: transformaciones automáticas (ej. convertir `React.createClass` a clases ES).
- **`tsc --noEmit --pretty`** para obtener errores legibles.
- **Editores**: VS Code muestra errores en archivos JS si `checkJs` está activo; puedes ir corrigiendo sobre la marcha.

### 11. Checklist de migración completa

- [ ] Todos los archivos fuente están en `.ts`/`.tsx`.
- [ ] `tsconfig.json` tiene `strict: true` (o al menos las banderas deseadas).
- [ ] `tsc --noEmit` sale sin errores.
- [ ] Las dependencias tienen tipos (instalados o declarados).
- [ ] Los paths/aliases coinciden entre `tsconfig` y el empaquetador.
- [ ] Los scripts npm incluyen `typecheck`.
- [ ] CI ejecuta `typecheck`.

### 12. Ejemplo de declaración para módulos comunes (añadir a `global.d.ts`)

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
