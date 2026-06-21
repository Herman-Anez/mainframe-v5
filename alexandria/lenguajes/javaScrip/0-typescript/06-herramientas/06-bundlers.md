# Bundlers

Los empaquetadores modernos integran TypeScript de forma natural, ofreciendo desde transpilación rápida hasta división de código y tree shaking. Cada uno tiene su estrategia de integración y configuraciones recomendadas.

## Webpack

Webpack es el empaquetador más veterano y configurable. Para TypeScript hay dos enfoques principales:

1. **ts-loader**: usa `tsc` para compilar los archivos. Puede ejecutar el chequeo de tipos durante el build.
   ```js
   module.exports = {
     module: {
       rules: [{ test: /\.tsx?$/, loader: 'ts-loader' }]
     }
   };
   ```
   Ventajas: reporta errores de tipo en el proceso de build (si `transpileOnly: false`). Desventaja: más lento, especialmente sin `transpileOnly`. En desarrollo se suele combinar con `ForkTsCheckerWebpackPlugin` para mover el chequeo de tipos a un proceso separado.

2. **babel-loader / swc-loader / esbuild-loader**: transpilan sin chequear tipos. Se usan junto con `tsc --noEmit` en paralelo.
   - `babel-loader` con `@babel/preset-typescript`.
   - `esbuild-loader` (muy rápido, recomendado).
   - `swc-loader` (similar, buena integración con Rust).

   Ejemplo con `esbuild-loader`:
   ```js
   module: {
     rules: [
       {
         test: /\.tsx?$/,
         loader: 'esbuild-loader',
         options: {
           loader: 'tsx',
           target: 'es2020'
         }
       }
     ]
   }
   ```

Webpack resuelve `import` de TypeScript usando la configuración de `resolve.extensions` (incluyendo `.ts`, `.tsx`). Para aliases como `@app/*`, deben configurarse tanto en `resolve.alias` como en `tsconfig.json` (`paths`). No olvides que `tsconfig.json` solo afecta al tiempo de compilación; el empaquetador necesita su propia configuración.

## Vite

Vite se ha convertido en el estándar de facto para desarrollo frontend por su velocidad. Usa esbuild para transpilar TypeScript en desarrollo (sin chequeo de tipos) y Rollup para producción.

- **Configuración cero**: Vite reconoce archivos `.ts` y los transpila automáticamente.
- Para chequeo de tipos, se recomienda ejecutar `tsc --noEmit` en paralelo (puedes usar `vite-plugin-checker` para mostrarlo en la consola).
- Aliases: los `paths` de `tsconfig.json` se pueden reflejar en `vite.config.ts` usando `resolve.alias` con el plugin `vite-tsconfig-paths` o manualmente.
- Librerías: Vite en modo librería (`build.lib`) genera salidas optimizadas; la configuración de tipos debe hacerse con `tsc` aparte (emitiendo declaraciones).

## Rollup

Rollup es ideal para librerías gracias a su tree shaking y formato de salida limpio. Para TypeScript usa `@rollup/plugin-typescript`:

```js
import typescript from '@rollup/plugin-typescript';

export default {
  input: 'src/index.ts',
  output: { dir: 'dist', format: 'esm' },
  plugins: [typescript({ tsconfig: './tsconfig.json' })]
};
```

Este plugin usa `tsc` internamente y puede emitir declaraciones si `tsconfig.json` lo configura. Sin embargo, puede ser lento. Alternativas: usar `esbuild` o `swc` en el pipeline de Rollup y luego generar `.d.ts` con `tsc --emitDeclarationOnly`. También existe `rollup-plugin-dts` para enrollar los archivos `.d.ts` ya generados en un único archivo de tipos.

## esbuild (como empaquetador)

esbuild puede empaquetar una aplicación completa con `--bundle`. Soporta TypeScript nativamente pero sin chequeo de tipos. Es increíblemente rápido. Para librerías, puede generar ESM y CJS simultáneamente.

```bash
esbuild src/index.ts --bundle --platform=neutral --outfile=dist/bundle.js --external:react
```

La resolución de paths no es automática; se puede configurar con el plugin `esbuild-plugin-tsconfig-paths` o manualmente con `alias`.

## Consideraciones comunes a todos

- **`isolatedModules`**: con transpiladores que no chequean tipos, debes activar esta opción en tsconfig para evitar construcciones no soportadas (como `const enum` o reexportaciones de tipo sin `type`).
- **Librerías externas**: en modo librería, usa `external` para no empaquetar `node_modules`.
- **CSS / Assets**: TypeScript no los procesa; cada bundler tiene sus propios loaders (Webpack) o soporte nativo (Vite).
- **Source maps**: generados según la configuración de cada bundler, no la de `tsconfig.json` (aunque pueden interoperar).

## Recomendación general

- **Aplicaciones web**: Vite por defecto.
- **Librerías**: Rollup con `@rollup/plugin-typescript` o `esbuild` + `tsc` para declaraciones.
- **Proyectos con mucha personalización**: Webpack con `esbuild-loader`.
- **Rendimiento extremo**: esbuild o SWC para todo.

La clave es separar claramente transpilación y chequeo de tipos, y asegurarse de que el bundler y TypeScript compartan la misma visión de las rutas y módulos.

--- 

Dominar estas herramientas te permite construir flujos de trabajo modernos, rápidos y seguros, aprovechando al máximo el ecosistema TypeScript. Cada herramienta tiene su lugar; la mejor configuración es la que se adapta a tu proyecto y equipo sin sacrificar la calidad de tipos.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Testing](05-testing.md) | [🏠 Inicio](../index.md) | [Discriminated union ▶](../07-patrones-avanzados/01-discriminated-union.md) |
