# Turbopack: el nuevo bundler de Next.js

## 1. ¿Qué es Turbopack?

Turbopack es el **bundler de nueva generación** escrito en Rust por el equipo de Vercel, presentado como sucesor de Webpack. Diseñado para ser increíblemente rápido, aprovecha la **compilación incremental** y la **memoria compartida** para ofrecer arranques en desarrollo casi instantáneos y una recarga en caliente ultrarrápida.

Next.js integra Turbopack de forma experimental desde la versión 13, y a partir de la versión 14 es estable en desarrollo para la mayoría de proyectos. El objetivo es que pronto sustituya a Webpack también en producción.

## 2. Motivación: por qué reemplazar Webpack

Webpack, aunque potente y extensible, tiene limitaciones de rendimiento inherentes a su arquitectura en JavaScript. Cada cambio en el código fuente puede desencadenar reconstrucciones costosas. Turbopack resuelve esto mediante:

- **Rust**: lenguaje de sistemas que evita las sobrecargas del garbage collector y permite paralelismo real.
- **Compilación incremental**: solo recompila lo que cambia, sin reanalizar todo el árbol de dependencias.
- **Memoria compartida**: el compilador se ejecuta como un servidor en segundo plano, manteniendo las representaciones en memoria entre recargas.
- **Granularidad de módulo**: actualiza a nivel de función o variable, no de archivo completo.

## 3. Configuración en Next.js

En desarrollo, basta con añadir la bandera `--turbo` al comando `next dev`:

```bash
next dev --turbo
```

También se puede configurar en `next.config.js` (experimental en versiones anteriores, pero estable en 15+):

```javascript
module.exports = {
  experimental: {
    turbo: {
      // Opciones de configuración de Turbopack
      rules: {
        // Reglas personalizadas para tipos de archivo, loaders, etc.
      },
      resolveAlias: {
        // Alias de módulos
        '@/components': './src/components',
      },
    },
  },
}
```

Para producción, Turbopack se habilita con `next build --turbo` (todavía experimental en producción en algunas versiones). Se espera que en futuras versiones sea el predeterminado.

## 4. Funcionamiento interno

Turbopack se basa en el **motor de compilación SWC** (también en Rust) y en el **analizador de grafos de dependencias**. Cuando se inicia `next dev --turbo`:

- Se crea un grafo de todos los módulos y sus dependencias.
- Cada módulo se compila en paralelo utilizando SWC para transformar TypeScript, JSX, etc.
- El resultado se cachea por módulo.
- Cuando un archivo cambia, solo se recompilan ese módulo y los que dependen de él, propagando el cambio instantáneamente al navegador.

Además, Turbopack integra el **HMR (Hot Module Replacement)** a un nivel más fino, preservando el estado de React siempre que sea posible.

## 5. Beneficios

- **Arranque en milisegundos**: incluso en proyectos grandes, el servidor de desarrollo se inicia en menos de un segundo.
- **Actualizaciones instantáneas**: los cambios se reflejan en el navegador en 10‑50 ms, independientemente del tamaño del proyecto.
- **Menor consumo de memoria** que Webpack, gracias a Rust y a la compartición de estructuras.
- **Compatibilidad con el ecosistema**: la mayoría de loaders y plugins de Webpack tienen equivalentes en Turbopack (por ejemplo, soporte para CSS, Sass, imágenes). Next.js abstrae estas configuraciones.

## 6. Limitaciones actuales

- Turbopack aún no es compatible con **todas las opciones de Webpack** en producción. Algunas personalizaciones avanzadas pueden no estar disponibles.
- **La configuración mediante `webpack` en `next.config.js` se ignora** al usar Turbopack. Si necesitas modificar la configuración del bundler, debes usar las reglas de Turbopack en `experimental.turbo`.
- Para proyectos muy antiguos con dependencias problemáticas, la migración puede requerir ajustes menores.

## 7. Transición desde Webpack

Next.js mantendrá la compatibilidad con Webpack durante un tiempo. Puedes cambiar entre ambos usando las banderas `--turbo` y la tradicional. Para producción, es recomendable probar el build con Turbopack y comparar tiempos y comportamiento.

## 8. Futuro

Turbopack se convertirá en el bundler único de Next.js. El equipo de Vercel está trabajando en soporte completo para `next build`, incluyendo optimizaciones de producción (minificación, tree shaking más agresivo) y la migración automática de configuraciones de Webpack.

## 9. Buenas prácticas

- Comienza a usar Turbopack en desarrollo cuanto antes para mejorar tu flujo de trabajo.
- Revisa la [lista de compatibilidad](https://turbo.build/pack/docs/migrating-from-webpack) para asegurarte de que tus dependencias funcionan.
- Si encuentras un problema, reporta en el repositorio de Next.js con un caso mínimo.
- No dependas de personalizaciones de Webpack a largo plazo; adapta la configuración al nuevo sistema.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Variables de entorno en Next.js](../17-configuracion/02-variables-entorno.md) | [🏠 Inicio](../index.md) | [Partial Prerendering (PPR) ▶](02-partial-prerendering.md) |
