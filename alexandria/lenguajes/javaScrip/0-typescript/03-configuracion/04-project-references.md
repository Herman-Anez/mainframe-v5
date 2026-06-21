# Project references

Los project references permiten estructurar un programa TypeScript en múltiples proyectos más pequeños, con dependencias explícitas entre ellos. Mejoran el tiempo de compilación (incremental build) y la organización del código, especialmente en monorepos.

## Concepto

Cada proyecto tiene su propio `tsconfig.json` con `composite: true` (para proyectos referenciables) y una lista `references` que apunta a otros proyectos. Cuando se construye con `tsc --build` (modo build), TypeScript compila los proyectos en orden, reutilizando las salidas de los que no han cambiado.

## Configuración de un proyecto referenciado (library)

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

## Proyecto que consume la librería

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

## Modo build (`--build` o `-b`)

`tsc -b` compila el proyecto indicado y sus dependencias. Opciones útiles:
- `--verbose`: muestra qué proyectos se están compilando.
- `--dry`: simula sin emitir.
- `--clean`: elimina las salidas (`outDir` y declaration).
- `--force`: recompila todo ignorando la caché.

La caché se basa en timestamps y en un archivo `.tsbuildinfo` que guarda la información del grafo y las firmas de los archivos. Este archivo se genera en `outDir` por defecto, o se puede especificar con `tsBuildInfoFile`.

## Uso en monorepos

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

## Beneficios

- **Compilación incremental rápida**: solo se recompilan los proyectos cambiados.
- **Separación de dominios**: cada proyecto tiene sus propias opciones.
- **Edición más rápida**: el editor puede cargar solo el proyecto necesario y sus referencias.
- **Compilación en paralelo**: con `tsc -b` se pueden compilar varios proyectos en paralelo.

## Limitaciones

- La resolución de módulos debe coincidir: si la librería usa paths, deben configurarse en el consumidor o usar `rootDirs`.
- Los `const enum` pueden dar problemas porque con `isolatedModules` no se exportan correctamente entre proyectos.
- Cambiar una interfaz en la librería obliga a recompilar todos los consumidores.
- Requiere gestionar correctamente `outDir` y las rutas de salida.

## Migrar un proyecto grande

1. Identificar las partes independientes (librerías, utilidades).
2. Crear tsconfigs individuales con `composite: true`.
3. Establecer las referencias.
4. Verificar con `tsc -b --dry` que el grafo es correcto.
5. Ajustar el sistema de build (Webpack, Jest) para que también apunte a los `outDir` o use los tsconfig correspondientes.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Strict y otras banderas](03-strict-y-otras-banderas.md) | [🏠 Inicio](../index.md) | [Resolucion modulos ▶](05-resolucion-modulos.md) |
