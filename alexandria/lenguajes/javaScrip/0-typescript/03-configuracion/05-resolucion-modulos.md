# Resolucion modulos

La resolución de módulos es el algoritmo que TypeScript usa para encontrar el archivo correspondiente a una declaración `import` o `require`. Es uno de los aspectos más confusos y críticos para que el proyecto funcione en diferentes entornos.

## Estrategias de resolución

- **`classic`**: usada antiguamente para proyectos no-Node. Busca en directorios hermanos y subiendo. Ya no debe usarse.
- **`node`**: emula el comportamiento de Node.js (CommonJS). Busca en `node_modules`, considera extensiones `.ts`, `.tsx`, `.d.ts`. No soporta `exports` en package.json ni condiciones.
- **`node16` / `nodenext`**: resolución moderna de Node.js con soporte para ESM y CJS. Lee `package.json` con `"type"`, condiciones de exportación, extensiones obligatorias en imports relativos (`.js` aunque el fuente sea `.ts`). Es la opción correcta para proyectos Node.js actuales.
- **`bundler`**: similar a cómo resuelven los empaquetadores (Webpack, Vite, esbuild). No requiere extensiones en imports relativos, permite condiciones de exportación sin la rigidez de `node16`. Es la mejor opción para aplicaciones frontend o backend empaquetadas.

## Algoritmo base (simplificado)

1. Si el import es relativo (`./` o `../`), se busca el archivo o carpeta en esa ubicación.
2. Si no es relativo, se busca en `node_modules` subiendo por la jerarquía.
3. Para `node` y variantes, se consideran los campos `types`, `typings` en package.json, el array `typeRoots`, etc.

## `baseUrl` y `paths`

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

## `rootDirs` para fusión virtual

`rootDirs` permite que múltiples carpetas se traten como una sola raíz. Por ejemplo, una carpeta `src` y una carpeta `generated` pueden fusionarse:

```json
{
  "compilerOptions": {
    "rootDirs": ["src", "generated"]
  }
}
```

Así, un import `#nucleo/Util` podría resolverse tanto en `src/nucleo/Util.ts` como en `generated/nucleo/Util.ts`.

## `typeRoots` y `types`

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

## `esModuleInterop` y ayudantes

`esModuleInterop` permite `import modulo from 'modulo'` aunque el módulo CommonJS no tenga `export default`. Emite código que asegura la compatibilidad. `allowSyntheticDefaultImports` permite la sintaxis sin emitir los helpers (asume que otro transpilador o entorno lo maneja). Recomendación: activar ambos.

## `resolveJsonModule`

Permite `import datos from './data.json'` y obtiene el tipo automáticamente. El `target` debe ser al menos `ES2015` (para módulos ES).

## Extensiones y condiciones

Con `moduleResolution: "node16"` o `"bundler"`, TypeScript entiende el campo `"exports"` en `package.json` y puede seguir condiciones como `"import"`, `"require"`, `"types"`. Esto permite que un paquete exponga diferentes puntos de entrada para ESM y CJS, y TypeScript elige la correcta según el contexto.

## Solución de problemas comunes

- **"Cannot find module"**: verifica que el módulo exista, que la extensión sea correcta (en `node16` se requiere `.js`), que el path alias esté bien configurado, y que `baseUrl` sea correcto.
- **Conflicto entre versiones de tipos**: usar `skipLibCheck: true` y/o limitar `types`.
- **Importaciones circulares**: la resolución puede fallar; refactorizar usando referencias internas o project references.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Project references](04-project-references.md) | [🏠 Inicio](../index.md) | [Debug y sourcemaps ▶](06-debug-y-sourcemaps.md) |
