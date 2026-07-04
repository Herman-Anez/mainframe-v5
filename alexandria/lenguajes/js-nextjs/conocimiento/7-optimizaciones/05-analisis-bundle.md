# Análisis y optimización del bundle

## Introducción

El tamaño del bundle de JavaScript afecta directamente a la velocidad de carga. Next.js incluye herramientas y prácticas para analizar y reducir el código que se envía al navegador.

## @next/bundle-analyzer

Es el plugin oficial para inspeccionar la composición del bundle.

### Instalación y configuración

```bash
npm install @next/bundle-analyzer
```

En `next.config.js`:

```js
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})
module.exports = withBundleAnalyzer({})
```

Luego, ejecuta:

```bash
ANALYZE=true npm run build
```

Esto generará dos archivos HTML en `.next/analyze/`: `client.html` (lo que ve el cliente) y `server.html`. Ábrelos en el navegador para ver un treemap interactivo de los módulos.

## Interpretación del análisis

- Los bloques grandes representan módulos que ocupan mucho espacio.
- Busca librerías duplicadas, imports que traen todo un paquete en lugar de subrutas (ejemplo: `import { map } from 'lodash'` en lugar de `import map from 'lodash/map'`).
- Fíjate en el color y nombre de los chunks; los que contienen `node_modules` son dependencias externas.

## Reducción del bundle

### Tree shaking y módulos ES

Asegúrate de que las librerías que usas soporten ES modules y tengan `sideEffects: false` en su `package.json`. Next.js usa Webpack (o Turbopack) para eliminar código muerto.

### Importaciones selectivas

```jsx
// Malo
import { debounce } from 'lodash' // Carga todo lodash

// Bueno
import debounce from 'lodash/debounce'
```

O usa alternativas más ligeras como `lodash-es`.

### Evita duplicar dependencias

El analizador te mostrará si una misma librería aparece en varios chunks. Puedes usar la configuración `splitChunks` de Webpack en `next.config.js` para forzar la agrupación.

### Eliminar dependencias no usadas

Usa herramientas como `depcheck` para detectar paquetes que no se importan en el código.

## Code splitting automático de Next.js

Next.js divide automáticamente el código por página. Solo se carga el JavaScript necesario para la ruta actual. Además, con `next/dynamic` partes grandes pueden aislarse en chunks separados.

## Carga de módulos duplicados entre páginas

Cuando una dependencia se usa en muchas páginas, Webpack la extrae en un chunk común. Puedes influir en esto con la propiedad `experimental.optimizePackageImports` (Next.js 13.2+):

```js
module.exports = {
  experimental: {
    optimizePackageImports: ['@heroicons/react', 'date-fns'],
  },
}
```

Esto agrupa las importaciones de esos paquetes para evitar cargarlos múltiples veces.

## Medición del rendimiento en producción

- Usa Lighthouse en una ventana de incógnito.
- Next.js Report: `next build` muestra el tamaño de los chunks de cada página.
- `npx next telemetry`? No, mejor usa `ANALYZE`.

## Buenas prácticas

- Mantén el analizador en un script npm (`"analyze": "ANALYZE=true next build"`).
- Revisa el bundle cada vez que añadas una nueva librería grande.
- Prefiere formatos ESM.
- Si una librería es pesada y solo se usa en el servidor, asegúrate de que no llegue al bundle del cliente (si se usa en un Server Component, nunca llegará al cliente; pero si accidentalmente la importas en un Client Component, sí).
- Para imágenes, fuentes y CSS, las optimizaciones propias de Next.js ya reducen la carga.

Con estos cinco pilares, la aplicación no solo será más rápida, sino que ofrecerá una experiencia de usuario profesional y medible.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ next/dynamic](04-importaciones-dinamicas.md) | [🏠 Inicio](../index.md) | [CSS Modules en Next.js ▶](../9-estilos/01-css-modules.md) |
