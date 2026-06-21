# Publicando tipos

Cuando publicas una librería escrita en TypeScript, es tu responsabilidad proporcionar archivos de declaración (.d.ts) para que los consumidores puedan usarla con total seguridad de tipos. Aquí cubrimos cómo empaquetar y distribuir tipos correctamente.

## Opciones: incluir tipos o usar DefinitelyTyped

Tienes dos caminos:
1. **Incluir los `.d.ts` en tu paquete npm** (recomendado). El campo `"types"` o `"typings"` en `package.json` apunta al punto de entrada de las declaraciones.
2. **Publicar en DefinitelyTyped** (si no puedes o no quieres incluir tipos, o para versiones legacy). Sin embargo, esto desacopla las versiones de tipos y código, y añade carga de mantenimiento a la comunidad. Para nuevas librerías, se prefiere la opción 1.

## Configuración de TypeScript para emitir declaraciones

```json
{
  "compilerOptions": {
    "declaration": true,
    "declarationMap": true,   // opcional pero recomendado
    "emitDeclarationOnly": false, // emite JS y .d.ts
    "outDir": "./dist",
    "rootDir": "./src"
  }
}
```

Es importante que `rootDir` esté correctamente definido para que la estructura de salida de los `.d.ts` coincida con la de los fuentes y las importaciones internas funcionen.

## Punto de entrada de tipos

En `package.json`:

```json
{
  "name": "mi-libreria",
  "version": "1.0.0",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.mjs",
      "require": "./dist/index.cjs"
    }
  }
}
```

Usar el campo `"exports"` con la condición `"types"` es la forma más moderna y compatible con `moduleResolution: node16`/`bundler`. Asegúrate de que las rutas de los tipos estén listadas **primero** en cada punto de entrada.

## Múltiples puntos de entrada

Si tu librería tiene submódulos (`mi-lib/foo`), debes exponer sus tipos también. Puedes hacerlo:
- Emitiendo los `.d.ts` correspondientes y usando `exports` con condiciones para cada uno.
- O usando una herramienta como `rollup-plugin-dts` para agrupar todos los tipos en un único archivo (si la API es plana).

Ejemplo con `exports`:

```json
{
  "exports": {
    "./foo": {
      "types": "./dist/foo.d.ts",
      "import": "./dist/foo.mjs"
    }
  }
}
```

## Dual CJS/ESM y tipos

Si emites tanto CommonJS como ES Modules, los tipos son los mismos (las declaraciones no dependen del sistema de módulos). Basta con un solo conjunto de `.d.ts`. Se puede usar el campo `"types"` global o `exports` con condición `"types"`.

Algunas herramientas como `tsup` o `unbuild` emiten ambas variantes de JS y copian los `.d.ts` (o generan desde una sola compilación).

## Evitando que los tipos internos se filtren

Los archivos `.d.ts` emitidos incluyen todas las exportaciones de tus módulos fuente. Si tienes funciones o interfaces que no deseas exponer, puedes:
- Usar `@internal` en JSDoc para marcarlas y luego emplear un herramienta como `api-extractor` que las elimina del paquete de tipos.
- Reexportar solo la API pública desde un `index.ts` y usar `stripInternal` en tsconfig (TypeScript puede eliminar declaraciones marcadas con `/** @internal */` si activas `"stripInternal": true` en `compilerOptions`).

## Agrupar declaraciones con API Extractor o `rollup-plugin-dts`

Para librerías grandes, emitir la estructura de carpetas completa puede ser pesado. Herramientas como `@microsoft/api-extractor` o `rollup-plugin-dts` permiten enrollar todos los `.d.ts` en un único archivo (`.d.ts` rollup), manteniendo solo la API pública. Mejora el rendimiento del consumidor y permite ocultar tipos internos.

## Publicar tipos junto con el código

Asegúrate de que los `.d.ts` estén incluidos en el paquete (no en `.gitignore` ni `.npmignore`). Generalmente se emiten a `dist/` y esa carpeta se publica.

## Pruebas de tus tipos antes de publicar

- Compila tu proyecto con `tsc` para asegurar que no hay errores en los tipos.
- Usa `tsd` o crea un proyecto de prueba que importe tu librería y ejercite la API; verifica que no haya errores de tipo.
- Ejecuta `npm pack` y examina los contenidos para comprobar que los `.d.ts` están presentes.

## Versionado semántico de los tipos

Las declaraciones de tipo son parte de la API pública. Cualquier cambio incompatible (renombrar una función, cambiar tipos de parámetros, eliminar una exportación) debe ir acompañado de un major bump. Los consumidores pueden verse afectados por cambios en los tipos aunque el runtime no cambie, así que sigue el versionado semántico estrictamente.

## Migrar de DefinitelyTyped a tipos incluidos

Si tu librería ya tiene tipos en `@types`, y decides incluirlos en el propio paquete:
1. Copia o reescribe los tipos en tu código fuente (preferiblemente migrando a TypeScript puro).
2. Publica una nueva versión con el campo `"types"`.
3. Marca el paquete `@types` como deprecated (enviando un PR a DefinitelyTyped que añada un `"deprecated": true` en `package.json` y un aviso en `index.d.ts`).

## Buenas prácticas finales

- Siempre emite declaraciones si tu librería es TypeScript.
- Proporciona `declarationMap` para una experiencia de desarrollo superior.
- Mantén los tipos y el código en el mismo repositorio para evitar desincronización.
- Documenta los tipos complejos con JSDoc.
- Prueba los tipos en un proyecto consumidor antes de publicar.

Con esto, tus usuarios disfrutarán de una experiencia TypeScript impecable.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Definitely typed](05-definitely-typed.md) | [🏠 Inicio](../index.md) | [Tsc cli ▶](../06-herramientas/01-tsc-cli.md) |
