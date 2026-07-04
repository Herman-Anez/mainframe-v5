# Tsc cli

El comando `tsc` es la puerta de entrada al compilador TypeScript. Aunque a menudo se usa de forma sencilla, dispone de un conjunto completo de opciones que permiten desde compilaciones rápidas hasta flujos de CI optimizados con builds incrementales y referencias entre proyectos.

## Sintaxis y modos de ejecución

```bash
tsc [options] [files...]
```

- **Sin argumentos**: busca `tsconfig.json` en la carpeta actual y compila el proyecto definido.
- **Con archivos**: `tsc archivo1.ts archivo2.ts` compila esos archivos ignorando el `tsconfig.json`. Las opciones por defecto del compilador se aplican.
- **`--project` / `-p`**: especifica un directorio con `tsconfig.json` o el archivo directamente.  
  `tsc -p ./src`  o  `tsc -p tsconfig.build.json`
- **`--build` / `-b`**: modo de construcción para project references.  
  `tsc -b src/tsconfig.json --verbose`
- **`--watch` / `-w`**: entra en modo observador y recompila al detectar cambios.

## Opciones de compilación rápida

| Opción | Descripción |
|--------|-------------|
| `--noEmit` | Realiza solo el chequeo de tipos, sin emitir JavaScript. Ideal en CI o junto a otros transpiladores. |
| `--pretty` | Salida con colores y formato (por defecto activo). |
| `--noErrorTruncation` | Muestra mensajes de error completos sin truncar. |
| `--diagnostics` | Imprime estadísticas de tiempo de compilación. |
| `--extendedDiagnostics` | Aún más detalle sobre memoria y fases. |
| `--listFiles` | Lista los archivos que forman parte del programa. |
| `--listEmittedFiles` | Muestra qué archivos JS se emitieron. |
| `--showConfig` | Imprime la configuración final (hereda extend, referencias, etc.). Muy útil para depurar tsconfig. |
| `--traceResolution` | Traza la resolución de cada módulo. Perfecto para depurar problemas de "Cannot find module". |
| `--generateTrace` | Genera un archivo de traza para analizar rendimiento. |

## Modo `--build` para proyectos compuestos

Cuando se trabaja con project references (véase tema 03-04), `tsc -b` construye el grafo de dependencias y compila en orden, respetando la caché incremental. Es mucho más rápido que `tsc -p` sobre cada proyecto individualmente.

Opciones importantes para `--build`:
- `--verbose`: muestra cada proyecto que se compila y el tiempo empleado.
- `--dry`: simula la compilación sin emitir archivos, útil para ver qué proyectos se compilarían.
- `--clean`: elimina los archivos de salida de los proyectos (`outDir`, `.tsbuildinfo`).
- `--force`: fuerza la recompilación de todos los proyectos ignorando la caché.

Ejemplo en monorepo:

```bash
tsc -b packages/*/tsconfig.json --verbose
```

## Modo observador (`--watch`)

`tsc --watch` o `tsc -w` recompila automáticamente al guardar cambios. Se puede configurar en `tsconfig.json` mediante la propiedad `watchOptions`:

```json
{
  "watchOptions": {
    "watchFile": "useFsEvents",
    "watchDirectory": "useFsEvents",
    "fallbackPolling": "dynamicPriority",
    "excludeDirectories": ["**/node_modules"]
  }
}
```

Esto permite afinar el comportamiento según el sistema operativo y el tamaño del proyecto.

## Salida con colores y formato

- `--pretty` (por defecto) colorea los mensajes. Se puede desactivar con `--pretty false` para logs en CI.
- Los códigos de error (ej. `TS2322`) se pueden buscar en la documentación o usar `tsc --explainError 2322`.

## Integración en npm scripts

```json
{
  "scripts": {
    "build": "tsc -p tsconfig.build.json",
    "watch": "tsc -p tsconfig.build.json --watch",
    "typecheck": "tsc --noEmit",
    "clean": "tsc --build tsconfig.build.json --clean"
  }
}
```

## Uso con `ts-node` y similares

`ts-node` utiliza `tsc` internamente para compilar sobre la marcha. Se puede pasar opciones similares mediante variables de entorno o configuración:

```bash
ts-node -P tsconfig.json script.ts
TS_NODE_PROJECT="./tsconfig.json" node --loader ts-node/esm script.ts
```

## Trucos avanzados

- Para verificar tipos sin emitir y con proyectos referenciados, usa `tsc -b --dry --noEmit` (dependiendo de la versión). Lo más común es `tsc -b --noEmit` aunque `--noEmit` no siempre es compatible con `-b`. En su lugar, se puede hacer un `tsc -b` con un proyecto raíz que tenga `"noEmit": true` y referencias a los demás.
- `tsc --init` genera un `tsconfig.json` con los ajustes recomendados y comentarios explicativos. Excelente punto de partida.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Publicando tipos](../05-declaration-files/06-publicando-tipos.md) | [🏠 Inicio](../index.md) | [Tsc API ▶](02-tsc-api.md) |
