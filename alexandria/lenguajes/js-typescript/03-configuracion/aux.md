## 01-tsconfig-basico.md

El archivo `tsconfig.json` (o `jsconfig.json` para JavaScript) es el centro de control de un proyecto TypeScript. Define qué archivos forman parte del programa y cómo debe compilarse. Entender su estructura, herencia y resolución es clave para cualquier proyecto serio.

### Descubrimiento y jerarquía

Cuando ejecutas `tsc`, el compilador busca un `tsconfig.json` en el directorio actual y sube por la jerarquía de carpetas hasta encontrarlo. Puedes especificar uno explícitamente con `--project ./ruta/tsconfig.json` o `-p`.

- Sin `--project`, se usa `./tsconfig.json`.
- Si se pasan archivos por línea de comandos (`tsc archivo.ts`), se ignoran los tsconfig; solo se compilan esos archivos con las opciones por defecto.

### Propiedades raíz del archivo

```json
{
  "compilerOptions": { ... },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"],
  "files": ["core.ts"],
  "references": [{ "path": "../comun" }],
  "extends": "./tsconfig.base.json",
  "buildOptions": { ... }   // para proyectos composite
}
```

- **`compilerOptions`**: el conjunto más amplio de configuraciones (obligatorio, aunque puede estar vacío).
- **`include`**: array de patrones glob que indican archivos a incluir. Si no se especifica, se incluyen todos los archivos `.ts`, `.tsx`, `.d.ts` del directorio base, excepto los de `exclude`. Los patrones soportan `*`, `**`, `?`.
- **`exclude`**: patrones a excluir. Por defecto excluye `node_modules`, `bower_components`, `jspm_packages` y el directorio de salida si se especifica `outDir`. `exclude` solo afina lo que `include` ha capturado; no añade archivos.
- **`files`**: lista explícita de archivos. Se usa en proyectos pequeños o cuando `include` no es suficiente. No admite globs.
- **`extends`**: permite heredar configuración de otro archivo. Las propiedades se fusionan; las del hijo sobrescriben a las del padre. Muy útil para monorepos con una base común.
- **`references`**: para project references (ver tema 04). Lista de proyectos de los que se depende.
- **`compileOnSave`** (opcional): booleano que indica a los editores que compilen al guardar (no todos los soportan).
- **`ts-node`** y otras herramientas pueden extender con opciones adicionales bajo su propio namespace.

### Herencia con `extends`

```json
// tsconfig.base.json
{
  "compilerOptions": {
    "strict": true,
    "target": "ES2022"
  }
}
// tsconfig.json
{
  "extends": "./tsconfig.base.json",
  "compilerOptions": {
    "outDir": "./dist"
  },
  "include": ["src"]
}
```

La fusión es superficial para `compilerOptions` (las claves se sobrescriben). Para `include`, `exclude` y `files`, el hijo reemplaza completamente al padre, no los combina. Por eso conviene que el hijo los defina explícitamente.

### El contexto de proyecto

Cuando hay un `tsconfig.json`, TypeScript crea un **contexto de proyecto** que abarca todos los archivos incluidos. Esto permite comprobación global, resolución de módulos y generación de declaraciones. Sin tsconfig, cada archivo es una unidad independiente, con el riesgo de inconsistencias en el chequeo de tipos.

### Opciones `rootDir` y `outDir`

- **`rootDir`**: TypeScript lo infiere como la carpeta común más baja de los archivos de entrada si no se establece. Controla la estructura de salida. Todos los archivos fuente deben estar dentro de esta raíz o se emitirán con advertencias/errores.
- **`outDir`**: carpeta donde se emite el JavaScript. La estructura de carpetas dentro de `outDir` replica la estructura desde `rootDir`.
- **`rootDirs`** (plural, array): permite combinar múltiples carpetas como si fueran una sola raíz virtual. Muy útil para fusionar fuentes en tiempo de compilación sin mover archivos.

### Ejemplo de configuración mínima recomendada

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "outDir": "./dist",
    "rootDir": "./src",
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src"]
}
```

### Errores comunes

- Olvidar que `exclude` por defecto ya excluye `node_modules`; no es necesario añadirlo manualmente, pero no hace daño.
- No especificar `include` y que el compilador procese archivos no deseados.
- Usar `files` y olvidar añadir nuevos archivos.
- Diferencias entre `tsc --watch` y la recarga del editor: algunos editores no recogen todos los cambios de tsconfig hasta reiniciar.

---

## 02-compilerOptions.md

Las opciones del compilador controlan el proceso de transpilación y el chequeo de tipos. Se agrupan en categorías: emisión, módulos, compatibilidad, chequeo estricto, etc.

### Target y lib

- **`target`**: versión de ECMAScript de salida. Valores: `ES3` (por defecto si no se especifica), `ES5`, `ES6`/`ES2015`, ... hasta `ESNext`. Afecta a la sintaxis generada (por ejemplo, funciones flecha a funciones anónimas, clases a prototipos, etc.). Cuanto más moderno, más compacto el código.
- **`lib`**: array de bibliotecas a incluir para el entorno (e.g., `["dom", "es2022"]`). Por defecto se incluyen las correspondientes al `target`. Si se especifica manualmente, solo se incluyen las listadas; hay que añadir las necesarias.

```json
{
  "target": "ES2020",
  "lib": ["ES2020", "DOM"]
}
```

### Module y moduleResolution

- **`module`**: sistema de módulos de salida. `CommonJS`, `AMD`, `UMD`, `System`, `ES6`/`ES2015`, `ES2020`, `ESNext`, `Node16`, `NodeNext`. Para Node.js moderno con `type: "module"`, se recomienda `NodeNext`.
- **`moduleResolution`**: estrategia de resolución de módulos. `classic` (obsoleto), `node` (para CommonJS), `bundler` (para Vite, Webpack, similares, sin extensiones y con condiciones de exportación), `node16`/`nodenext` (para Node.js ESM/CJS moderno).

Elección común para aplicaciones empaquetadas: `module: "ESNext"` y `moduleResolution: "bundler"`.

### `outDir` y `rootDir`

Ya vistos. La carpeta de salida se estructura igual que la fuente a partir de `rootDir`. `outFile` empaqueta todo en un solo archivo (solo para módulos `amd` o `system`).

### Emisión de declaraciones

- **`declaration`**: genera archivos `.d.ts`.
- **`declarationDir`**: carpeta separada para las declaraciones.
- **`declarationMap`**: genera source maps para las declaraciones, permitiendo navegar desde la definición al fuente original en el editor.
- **`emitDeclarationOnly`**: solo emite `.d.ts`, sin JavaScript (útil para librerías que usan otro transpilador).

### Source maps y debugging

- **`sourceMap`**: genera `.js.map`.
- **`inlineSourceMap`**: incluye el source map como comentario en el `.js`.
- **`inlineSources`**: incluye el código fuente original dentro del source map.
- **`sourceRoot`** y **`mapRoot`**: ajustan las rutas dentro de los mapas.

### Import helpers y ESModule interop

- **`importHelpers`**: reduce el código duplicado de helpers de transpilación (ej. `__assign`) importándolos de `tslib`. Requiere instalar `tslib`.
- **`noEmitHelpers`**: no emite helpers en absoluto; si los necesitas, debes proveerlos globalmente.
- **`esModuleInterop`**: permite importar módulos CommonJS como si fueran ESM por defecto (añade `__importDefault` y `__importStar`). Recomendado activarlo siempre.
- **`allowSyntheticDefaultImports`**: permite la sintaxis de import por defecto aunque el módulo no tenga export default, pero sin emitir el helper. `esModuleInterop` lo activa implícitamente.

### Strict y comprobaciones relacionadas

Se detallan en el siguiente punto. Desde aquí podemos mencionar que `strict: true` activa todas las banderas de la familia.

### Otras comprobaciones

- **`skipLibCheck`**: omite el chequeo de tipos de los archivos `.d.ts`. Acelera la compilación y evita errores en tipos de terceros. Muy recomendable.
- **`forceConsistentCasingInFileNames`**: obliga a que las mayúsculas/minúsculas de los imports coincidan con el disco. Previene errores en sistemas de archivos case-sensitive.
- **`isolatedModules`**: requerido por transpiladores como Babel/esbuild. Prohíbe ciertas construcciones que no pueden analizarse archivo por archivo sin información de tipos (como `const enum`, reexportación de tipos sin `type`).
- **`noUnusedLocals`** y **`noUnusedParameters`**: marcan variables/parámetros sin usar como errores.
- **`noImplicitReturns`**: todas las ramas de una función deben devolver un valor.
- **`noFallthroughCasesInSwitch`**: impide que un `case` caiga en el siguiente sin `break`/`return`.

### JSX

- **`jsx`**: `"react"` (React.createElement), `"react-jsx"` (JSX automático con `react/jsx-runtime`), `"preserve"` (deja el JSX intacto), `"react-native"` (preserva y espera que React Native lo transforme).
- **`jsxFactory`**: función de fábrica (default `React.createElement`).
- **`jsxFragmentFactory`**: componente Fragment.
- **`jsxImportSource`**: desde dónde importar los helpers JSX (e.g., `"react"`, `"preact"`).

### Paths y base URL

- **`baseUrl`**: directorio base para resolución de módulos no relativos.
- **`paths`**: mapeos de alias. Por ejemplo, `"@app/*": ["src/*"]`. Requiere `baseUrl`. Son solo para tiempo de compilación; los empaquetadores (Webpack, Vite) necesitan su propia configuración equivalente.

### Emisión de módulos y compatibilidad

- **`typeRoots`**: lista de carpetas que contienen `@types` (por defecto `node_modules/@types`).
- **`types`**: lista de paquetes de tipos a incluir automáticamente. Si se especifica, solo se incluyen esos.
- **`allowJs`**: permite importar archivos JavaScript en el proyecto.
- **`checkJs`**: activa el chequeo de tipos en archivos `.js` (JSDoc).
- **`resolveJsonModule`**: permite importar módulos JSON y obtener el tipo automáticamente.
- **`verbatimModuleSyntax`** (TS 5.0): obliga a usar `import type` para importaciones de solo tipo y no emitirá las importaciones eliminadas en módulos ESM; garantiza compatibilidad con el estándar.

### Consejos de configuración

- Siempre activar `strict: true` si empiezas un proyecto nuevo.
- Usar `skipLibCheck: true` para evitar dolores de cabeza con tipos de terceros.
- Para librerías, emitir `declaration` y `declarationMap`.
- Para monorepos, considerar `composite: true` y project references (sección 04).
- Para empaquetadores modernos, `moduleResolution: "bundler"` simplifica las importaciones.

---

## 03-strict-y-otras-banderas.md

TypeScript dispone de una familia de comprobaciones estrictas que, en conjunto, elevan la seguridad del código. `"strict": true` es la forma más simple de activarlas todas. Cada una puede ser desactivada individualmente si `strict` está activo, estableciendo explícitamente la bandera a `false`.

### `strictNullChecks`

Sin ella, `null` y `undefined` se pueden asignar a cualquier tipo. Activarla los convierte en tipos separados. Esto fuerza a manejar explícitamente la nulabilidad.

```ts
let nombre: string;
nombre = null; // Error con strictNullChecks
```

Es, probablemente, la bandera más importante. Obliga a usar uniones (`string | null`) y a estrechar antes de operar.

### `noImplicitAny`

Cuando el compilador no puede inferir un tipo y no hay anotación, infiere `any`. Esta bandera prohíbe ese `any` implícito.

```ts
function f(x) { return x; } // Error: parámetro 'x' tiene tipo implícito 'any'
```

Fuerza a anotar o asegurar que haya inferencia. Mejora la robustez de la base de código.

### `noImplicitThis`

Prohíbe `this` implícito de tipo `any`. Obliga a tipar `this` como primer parámetro falso o a usar funciones flecha.

```ts
function mostrar(this: { nombre: string }) {
  console.log(this.nombre);
}
```

### `strictFunctionTypes`

Corrige la varianza de los parámetros de función en la compatibilidad de tipos. Sin ella, TypeScript es bivariante en parámetros de función (menos seguro). Con `strictFunctionTypes`, la compatibilidad de funciones sigue la varianza correcta (contravariante en parámetros, covariante en retorno). Afecta a la asignación de callbacks.

```ts
type Handler = (x: string) => void;
let h: Handler = (x: string | number) => { }; // OK sin strictFunctionTypes, Error con ella
```

Es una mejora de seguridad importante.

### `strictPropertyInitialization`

Asegura que todas las propiedades de una clase que no son opcionales se inicialicen en el constructor o directamente.

```ts
class Persona {
  nombre: string; // Error si no se asigna en constructor o inicializador
}
```

Solo funciona si `strictNullChecks` está activo. Promueve clases bien definidas.

### `strictBindCallApply`

Habilita el chequeo de tipos para los métodos `bind`, `call` y `apply`. Verifica que los argumentos coincidan con la firma.

```ts
function saludar(nombre: string) { }
saludar.call(null, 42); // Error con strictBindCallApply
```

### `alwaysStrict`

Emite `"use strict"` en cada archivo de salida. Prácticamente siempre se activa en proyectos modernos.

### Combinación de `strict: true`

Activa todas las anteriores y añade otras futuras. Es la configuración recomendada para nuevos proyectos. Se puede desactivar una bandera concreta si causa problemas, pero es mejor adaptar el código.

### Otras banderas de calidad relevantes

- **`noUnusedLocals`**: reporta variables locales declaradas pero no usadas. Muy útil para limpiar código.
- **`noUnusedParameters`**: similar para parámetros de función. Los que empiezan por `_` se ignoran en algunas convenciones, pero aquí no por defecto.
- **`exactOptionalPropertyTypes`** (TS 4.4): distingue entre `prop?: Tipo` y `prop?: Tipo | undefined`. Con esta bandera, una propiedad opcional no puede recibir `undefined` explícitamente; solo omitirse. Útil para APIs REST y formularios.
- **`noUncheckedIndexedAccess`** (TS 4.1, en beta experimental): añade `| undefined` a todos los accesos indexados. Por ejemplo, `array[0]` pasa a ser `T | undefined`. Refleja la realidad del runtime, pero puede ser verboso; se activa bajo demanda.
- **`noPropertyAccessFromIndexSignature`**: obliga a usar notación de corchetes para propiedades que vienen de una firma de índice, evitando errores en nombres.
- **`noImplicitOverride`**: obliga a usar la palabra clave `override` al sobrescribir métodos.
- **`useUnknownInCatchVariables`**: cambia el tipo de la variable del `catch` de `any` a `unknown`, forzando un manejo seguro.

### Configuración recomendada para máxima calidad

```json
{
  "strict": true,
  "noUnusedLocals": true,
  "noUnusedParameters": true,
  "exactOptionalPropertyTypes": true,
  "noImplicitReturns": true,
  "noFallthroughCasesInSwitch": true,
  "forceConsistentCasingInFileNames": true,
  "skipLibCheck": true
}
```

Cada bandera añade una capa de protección. En proyectos existentes, se pueden activar progresivamente para no saturar con errores.

---

## 04-project-references.md

Los project references permiten estructurar un programa TypeScript en múltiples proyectos más pequeños, con dependencias explícitas entre ellos. Mejoran el tiempo de compilación (incremental build) y la organización del código, especialmente en monorepos.

### Concepto

Cada proyecto tiene su propio `tsconfig.json` con `composite: true` (para proyectos referenciables) y una lista `references` que apunta a otros proyectos. Cuando se construye con `tsc --build` (modo build), TypeScript compila los proyectos en orden, reutilizando las salidas de los que no han cambiado.

### Configuración de un proyecto referenciado (library)

```json
// tsconfig.lib.json
{
  "compilerOptions": {
    "composite": true,
    "declaration": true,
    "outDir": "./dist/lib",
    "rootDir": "./src",
    "strict": true
  },
  "include": ["src"]
}
```

Requisitos para `composite`:
- `declaration` debe ser `true`.
- `rootDir` debe estar explícito o todos los fuentes deben estar dentro de una raíz común que el compilador pueda inferir sin ambigüedad.
- `outDir` debe ser especificado.

### Proyecto que consume la librería

```json
// tsconfig.app.json
{
  "compilerOptions": {
    "outDir": "./dist/app",
    "rootDir": ".",
    "strict": true
  },
  "references": [
    { "path": "../lib" }
  ],
  "include": ["src"]
}
```

Al hacer `tsc --build tsconfig.app.json`, TypeScript compila primero `lib` si es necesario (o usa su salida anterior) y luego `app`. La resolución de módulos para los imports desde `app` a `lib` usa los `.d.ts` generados en `dist/lib`.

### Modo build (`--build` o `-b`)

`tsc -b` compila el proyecto indicado y sus dependencias. Opciones útiles:
- `--verbose`: muestra qué proyectos se están compilando.
- `--dry`: simula sin emitir.
- `--clean`: elimina las salidas (`outDir` y declaration).
- `--force`: recompila todo ignorando la caché.

La caché se basa en timestamps y en un archivo `.tsbuildinfo` que guarda la información del grafo y las firmas de los archivos. Este archivo se genera en `outDir` por defecto, o se puede especificar con `tsBuildInfoFile`.

### Uso en monorepos

En un monorepo con herramientas como Yarn Workspaces o npm workspaces, cada paquete puede tener su `tsconfig.json` con `composite: true` y referencias a otros paquetes. Un tsconfig raíz puede contener solo `references` a todos los proyectos y opcionalmente `noEmit: true` para verificar tipos sin emitir.

Estructura típica:

```
packages/
  lib/
    src/
    tsconfig.json (composite)
  app/
    src/
    tsconfig.json (references lib)
tsconfig.base.json (opciones comunes)
tsconfig.json (raíz, solo referencias)
```

### Beneficios

- **Compilación incremental rápida**: solo se recompilan los proyectos cambiados.
- **Separación de dominios**: cada proyecto tiene sus propias opciones.
- **Edición más rápida**: el editor puede cargar solo el proyecto necesario y sus referencias.
- **Compilación en paralelo**: con `tsc -b` se pueden compilar varios proyectos en paralelo.

### Limitaciones

- La resolución de módulos debe coincidir: si la librería usa paths, deben configurarse en el consumidor o usar `rootDirs`.
- Los `const enum` pueden dar problemas porque con `isolatedModules` no se exportan correctamente entre proyectos.
- Cambiar una interfaz en la librería obliga a recompilar todos los consumidores.
- Requiere gestionar correctamente `outDir` y las rutas de salida.

### Migrar un proyecto grande

1. Identificar las partes independientes (librerías, utilidades).
2. Crear tsconfigs individuales con `composite: true`.
3. Establecer las referencias.
4. Verificar con `tsc -b --dry` que el grafo es correcto.
5. Ajustar el sistema de build (Webpack, Jest) para que también apunte a los `outDir` o use los tsconfig correspondientes.

---

## 05-resolucion-modulos.md

La resolución de módulos es el algoritmo que TypeScript usa para encontrar el archivo correspondiente a una declaración `import` o `require`. Es uno de los aspectos más confusos y críticos para que el proyecto funcione en diferentes entornos.

### Estrategias de resolución

- **`classic`**: usada antiguamente para proyectos no-Node. Busca en directorios hermanos y subiendo. Ya no debe usarse.
- **`node`**: emula el comportamiento de Node.js (CommonJS). Busca en `node_modules`, considera extensiones `.ts`, `.tsx`, `.d.ts`. No soporta `exports` en package.json ni condiciones.
- **`node16` / `nodenext`**: resolución moderna de Node.js con soporte para ESM y CJS. Lee `package.json` con `"type"`, condiciones de exportación, extensiones obligatorias en imports relativos (`.js` aunque el fuente sea `.ts`). Es la opción correcta para proyectos Node.js actuales.
- **`bundler`**: similar a cómo resuelven los empaquetadores (Webpack, Vite, esbuild). No requiere extensiones en imports relativos, permite condiciones de exportación sin la rigidez de `node16`. Es la mejor opción para aplicaciones frontend o backend empaquetadas.

### Algoritmo base (simplificado)

1. Si el import es relativo (`./` o `../`), se busca el archivo o carpeta en esa ubicación.
2. Si no es relativo, se busca en `node_modules` subiendo por la jerarquía.
3. Para `node` y variantes, se consideran los campos `types`, `typings` en package.json, el array `typeRoots`, etc.

### `baseUrl` y `paths`

Permiten crear alias y raíces no relativas:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@utils/*": ["src/utils/*"],
      "@models": ["src/models/index"]
    }
  }
}
```

Los `paths` son puramente una transformación de tiempo de compilación; no afectan al código emitido. Los empaquetadores o Node.js (con `tsconfig-paths` o `module-alias`) deben replicarlos en runtime.

### `rootDirs` para fusión virtual

`rootDirs` permite que múltiples carpetas se traten como una sola raíz. Por ejemplo, una carpeta `src` y una carpeta `generated` pueden fusionarse:

```json
{
  "compilerOptions": {
    "rootDirs": ["src", "generated"]
  }
}
```

Así, un import `#nucleo/Util` podría resolverse tanto en `src/nucleo/Util.ts` como en `generated/nucleo/Util.ts`.

### `typeRoots` y `types`

Controlan la carga de archivos de declaración globales (`*.d.ts` de paquetes `@types`).

- **`typeRoots`**: array de carpetas que contienen paquetes de tipos. Por defecto `["node_modules/@types"]`. Si se especifica, reemplaza el por defecto; hay que incluir `node_modules/@types` manualmente si se quiere mantener.
- **`types`**: lista de paquetes de tipos a cargar. Si se especifica, solo se incluyen esos; todos los demás `@types` se ignoran. Útil para evitar que se carguen tipos globales que interfieran (por ejemplo, `"node"` para APIs de Node).

```json
{
  "compilerOptions": {
    "typeRoots": ["./tipos", "./node_modules/@types"],
    "types": ["jest", "node"]
  }
}
```

### `esModuleInterop` y ayudantes

`esModuleInterop` permite `import modulo from 'modulo'` aunque el módulo CommonJS no tenga `export default`. Emite código que asegura la compatibilidad. `allowSyntheticDefaultImports` permite la sintaxis sin emitir los helpers (asume que otro transpilador o entorno lo maneja). Recomendación: activar ambos.

### `resolveJsonModule`

Permite `import datos from './data.json'` y obtiene el tipo automáticamente. El `target` debe ser al menos `ES2015` (para módulos ES).

### Extensiones y condiciones

Con `moduleResolution: "node16"` o `"bundler"`, TypeScript entiende el campo `"exports"` en `package.json` y puede seguir condiciones como `"import"`, `"require"`, `"types"`. Esto permite que un paquete exponga diferentes puntos de entrada para ESM y CJS, y TypeScript elige la correcta según el contexto.

### Solución de problemas comunes

- **"Cannot find module"**: verifica que el módulo exista, que la extensión sea correcta (en `node16` se requiere `.js`), que el path alias esté bien configurado, y que `baseUrl` sea correcto.
- **Conflicto entre versiones de tipos**: usar `skipLibCheck: true` y/o limitar `types`.
- **Importaciones circulares**: la resolución puede fallar; refactorizar usando referencias internas o project references.

---

## 06-debug-y-sourcemaps.md

El debugging de TypeScript se apoya en los source maps, que mapean el código JavaScript generado al código fuente original. Sin ellos, depurar es infernal.

### ¿Qué es un source map?

Un archivo `.js.map` (o inline) contiene un mapeo entre posiciones del código emitido y posiciones del fuente. Los navegadores y Node.js lo usan para mostrar el fuente TypeScript en las herramientas de desarrollo.

### Configuración de source maps

- **`sourceMap: true`**: genera archivos `.js.map` separados.
- **`inlineSourceMap: true`**: incrusta el mapa como un comentario `//# sourceMappingURL=data:...` al final del archivo JS. No requiere servir archivos extra, pero aumenta el tamaño del JS.
- **`inlineSources: true`**: incluye el contenido del fuente original dentro del mapa. Muy útil para entornos donde los fuentes no están disponibles.
- **`sourceRoot`**: ajusta la raíz de las rutas de los fuentes dentro del mapa. Normalmente no es necesario si la estructura de archivos es estándar.
- **`mapRoot`**: ajusta la ruta base desde donde se cargan los mapas. Raramente usado.

Ejemplo típico para desarrollo:

```json
{
  "compilerOptions": {
    "sourceMap": true,
    "inlineSources": true
  }
}
```

Para producción, los source maps pueden omitirse o publicarse por separado para no exponer el fuente. Algunas empresas prefieren no incluirlos.

### Debugging en VS Code

El archivo `launch.json` debe apuntar a los archivos JS generados y tener activada la opción `"sourceMaps": true`. Con `tsc --watch` o `ts-node`, el debugger puede engancharse directamente a los `.ts` si se usa `ts-node` con `--transpile-only` o con el loader adecuado.

Configuración típica de Node.js:

```json
{
  "type": "node",
  "request": "launch",
  "name": "Debug TS",
  "program": "${workspaceFolder}/src/index.ts",
  "outFiles": ["${workspaceFolder}/dist/**/*.js"],
  "sourceMaps": true,
  "runtimeArgs": ["-r", "ts-node/register"]
}
```

Para aplicaciones frontend, frameworks como Next.js, Vite, CRA ya configuran los source maps automáticamente.

### Debugging con `declarationMap`

`declarationMap: true` genera mapas para los archivos `.d.ts`. Esto permite que cuando un consumidor de nuestra librería hace "Ir a definición" en el editor, vaya al código fuente original en lugar de a la declaración. Esencial para la experiencia de desarrollo en monorepos.

```json
{
  "declaration": true,
  "declarationMap": true
}
```

### Mapas y puntos de interrupción

Los source maps permiten colocar breakpoints en los archivos `.ts` directamente. El depurador los traduce a la ubicación en el JS emitido. Para que funcionen correctamente:
- Los mapas deben generarse antes de lanzar la depuración.
- El código no debe ser modificado después de la generación (por minificadores, etc.) sin regenerar los mapas.
- Si usas `ts-node`, éste genera mapas en memoria; a veces es menos fiable que compilar previamente.

### Source maps en producción

Si decides incluirlos, es buena práctica servirlos con acceso restringido o detrás de una autenticación. También existen herramientas como `sentry-cli` que los suben a servicios de monitoreo sin exponerlos públicamente.

### Alternativas: debugging directamente con `.ts`

Herramientas como `tsx` (TypeScript Execute) o `ts-node` permiten ejecutar TypeScript directamente sin compilación previa. En desarrollo, simplifican el flujo. Para producción, se recomienda compilar.

### Errores comunes en debugging

- **Rutas incorrectas**: si el fuente no se encuentra en la ubicación esperada según `sourceRoot` o la ruta absoluta del equipo de desarrollo, el depurador no lo muestra. `inlineSources` soluciona esto.
- **Mapas desincronizados**: compilar sin limpiar el `outDir` puede dejar mapas antiguos. Usar `--clean` o borrar `outDir`.
- **Extensiones de navegador**: a veces el navegador cachea mapas; forzar recarga o usar "Disable cache".
- **Problemas de permisos**: servir los mapas desde un servidor puede requerir CORS o configuraciones de cabeceras.

---

Dominar la configuración de TypeScript es tan importante como dominar el lenguaje de tipos. Una configuración pulida permite un ciclo de desarrollo rápido, seguro y escalable, mientras que una incorrecta puede generar frustración y bugs sutiles. Recomiendo experimentar con cada bandera en un proyecto de pruebas para interiorizar sus efectos.

---

