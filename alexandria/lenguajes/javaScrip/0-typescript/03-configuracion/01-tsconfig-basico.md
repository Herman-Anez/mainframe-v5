# Tsconfig basico

El archivo `tsconfig.json` (o `jsconfig.json` para JavaScript) es el centro de control de un proyecto TypeScript. Define qué archivos forman parte del programa y cómo debe compilarse. Entender su estructura, herencia y resolución es clave para cualquier proyecto serio.

## Descubrimiento y jerarquía

Cuando ejecutas `tsc`, el compilador busca un `tsconfig.json` en el directorio actual y sube por la jerarquía de carpetas hasta encontrarlo. Puedes especificar uno explícitamente con `--project ./ruta/tsconfig.json` o `-p`.

- Sin `--project`, se usa `./tsconfig.json`.
- Si se pasan archivos por línea de comandos (`tsc archivo.ts`), se ignoran los tsconfig; solo se compilan esos archivos con las opciones por defecto.

## Propiedades raíz del archivo

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

## Herencia con `extends`

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

## El contexto de proyecto

Cuando hay un `tsconfig.json`, TypeScript crea un **contexto de proyecto** que abarca todos los archivos incluidos. Esto permite comprobación global, resolución de módulos y generación de declaraciones. Sin tsconfig, cada archivo es una unidad independiente, con el riesgo de inconsistencias en el chequeo de tipos.

## Opciones `rootDir` y `outDir`

- **`rootDir`**: TypeScript lo infiere como la carpeta común más baja de los archivos de entrada si no se establece. Controla la estructura de salida. Todos los archivos fuente deben estar dentro de esta raíz o se emitirán con advertencias/errores.
- **`outDir`**: carpeta donde se emite el JavaScript. La estructura de carpetas dentro de `outDir` replica la estructura desde `rootDir`.
- **`rootDirs`** (plural, array): permite combinar múltiples carpetas como si fueran una sola raíz virtual. Muy útil para fusionar fuentes en tiempo de compilación sin mover archivos.

## Ejemplo de configuración mínima recomendada

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

## Errores comunes

- Olvidar que `exclude` por defecto ya excluye `node_modules`; no es necesario añadirlo manualmente, pero no hace daño.
- No especificar `include` y que el compilador procese archivos no deseados.
- Usar `files` y olvidar añadir nuevos archivos.
- Diferencias entre `tsc --watch` y la recarga del editor: algunos editores no recogen todos los cambios de tsconfig hasta reiniciar.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Never exhaustividad](../02-tipos-avanzados/08-never-exhaustividad.md) | [🏠 Inicio](../index.md) | [Compileroptions ▶](02-compilerOptions.md) |
