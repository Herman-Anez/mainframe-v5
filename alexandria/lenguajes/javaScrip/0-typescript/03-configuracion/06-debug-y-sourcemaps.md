# Debug y sourcemaps

El debugging de TypeScript se apoya en los source maps, que mapean el código JavaScript generado al código fuente original. Sin ellos, depurar es infernal.

## ¿Qué es un source map?

Un archivo `.js.map` (o inline) contiene un mapeo entre posiciones del código emitido y posiciones del fuente. Los navegadores y Node.js lo usan para mostrar el fuente TypeScript en las herramientas de desarrollo.

## Configuración de source maps

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

## Debugging en VS Code

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

## Debugging con `declarationMap`

`declarationMap: true` genera mapas para los archivos `.d.ts`. Esto permite que cuando un consumidor de nuestra librería hace "Ir a definición" en el editor, vaya al código fuente original en lugar de a la declaración. Esencial para la experiencia de desarrollo en monorepos.

```json
{
  "declaration": true,
  "declarationMap": true
}
```

## Mapas y puntos de interrupción

Los source maps permiten colocar breakpoints en los archivos `.ts` directamente. El depurador los traduce a la ubicación en el JS emitido. Para que funcionen correctamente:
- Los mapas deben generarse antes de lanzar la depuración.
- El código no debe ser modificado después de la generación (por minificadores, etc.) sin regenerar los mapas.
- Si usas `ts-node`, éste genera mapas en memoria; a veces es menos fiable que compilar previamente.

## Source maps en producción

Si decides incluirlos, es buena práctica servirlos con acceso restringido o detrás de una autenticación. También existen herramientas como `sentry-cli` que los suben a servicios de monitoreo sin exponerlos públicamente.

## Alternativas: debugging directamente con `.ts`

Herramientas como `tsx` (TypeScript Execute) o `ts-node` permiten ejecutar TypeScript directamente sin compilación previa. En desarrollo, simplifican el flujo. Para producción, se recomienda compilar.

## Errores comunes en debugging

- **Rutas incorrectas**: si el fuente no se encuentra en la ubicación esperada según `sourceRoot` o la ruta absoluta del equipo de desarrollo, el depurador no lo muestra. `inlineSources` soluciona esto.
- **Mapas desincronizados**: compilar sin limpiar el `outDir` puede dejar mapas antiguos. Usar `--clean` o borrar `outDir`.
- **Extensiones de navegador**: a veces el navegador cachea mapas; forzar recarga o usar "Disable cache".
- **Problemas de permisos**: servir los mapas desde un servidor puede requerir CORS o configuraciones de cabeceras.

---

Dominar la configuración de TypeScript es tan importante como dominar el lenguaje de tipos. Una configuración pulida permite un ciclo de desarrollo rápido, seguro y escalable, mientras que una incorrecta puede generar frustración y bugs sutiles. Recomiendo experimentar con cada bandera en un proyecto de pruebas para interiorizar sus efectos.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Resolucion modulos](05-resolucion-modulos.md) | [🏠 Inicio](../index.md) | [Sistemas de modulos ▶](../04-modulos/01-sistemas-de-modulos.md) |
