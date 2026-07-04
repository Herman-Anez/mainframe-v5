# Archivo de configuración `next.config.js

## 1. Formatos y sintaxis

Next.js admite varios formatos para el archivo de configuración:

- `next.config.js` (CommonJS, `module.exports = { ... }`)
- `next.config.mjs` (ES modules, `export default { ... }`)
- `next.config.ts` (TypeScript, experimental, requiere `next.config.ts` con soporte nativo desde v15)

La función **asíncrona** o **multifase** permite acceder a la fase del build (development, production, etc.) mediante la exportación de una función:

```javascript
module.exports = (phase, { defaultConfig }) => {
  const isProd = phase === 'production'
  return {
    reactStrictMode: true,
    env: { API_URL: isProd ? 'https://api.example.com' : 'http://localhost:4000' },
  }
}
```

## 2. Configuraciones básicas

### `reactStrictMode`
Activa el modo estricto de React en desarrollo. Ayuda a detectar efectos no limpios y problemas de ciclo de vida.

```javascript
reactStrictMode: true
```

### `poweredByHeader`
Elimina la cabecera `X-Powered-By: Next.js`. Se desactiva con `false`.

```javascript
poweredByHeader: false
```

### `basePath`
Prefijo para todas las rutas. Ejemplo: `basePath: '/docs'` → `/docs/about`.

```javascript
basePath: '/docs'
```

### `assetPrefix`
Prefijo para los archivos estáticos (JS, CSS, imágenes). Útil para servir assets desde un CDN.

```javascript
assetPrefix: 'https://cdn.miapp.com'
```

### `trailingSlash`
Si `true`, Next.js añade una barra al final de todas las URLs. Útil para compatibilidad con algunos servidores estáticos.

```javascript
trailingSlash: true
```

## 3. Imágenes (`images`)

Controla la optimización de `next/image`.

```javascript
module.exports = {
  images: {
    domains: ['example.com'], // (legacy) lista de dominios permitidos
    remotePatterns: [         // recomendado: patrones más específicos
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 768, 1024, 1280, 1536],
    imageSizes: [16, 32, 48, 64, 96],
    minimumCacheTTL: 60, // segundos
    unoptimized: false,   // desactiva la optimización (exportación estática)
  },
}
```

- `remotePatterns` permite restringir por protocolo, hostname, puerto y pathname, ofreciendo más seguridad que `domains`.
- `deviceSizes` e `imageSizes` controlan los anchos generados.
- `formats` activa formatos modernos (AVIF primero si el navegador lo soporta).
- `unoptimized: true` desactiva completamente el componente `next/image` (útil para `output: 'export'`).

## 4. Redirecciones, reescrituras y cabeceras

### `redirects`
Redirige una ruta a otra con un código de estado (301, 307, 308, etc.). Se ejecuta antes de la caché y no llega al servidor.

```javascript
async redirects() {
  return [
    {
      source: '/old/:path*',
      destination: '/new/:path*',
      permanent: true,
    },
  ]
}
```

### `rewrites`
Reescribe la URL sin cambiar la barra de direcciones. Útil para proxies a APIs o rutas internas.

```javascript
async rewrites() {
  return [
    {
      source: '/api/proxy/:path*',
      destination: 'https://api.externa.com/:path*',
    },
  ]
}
```

### `headers`
Añade cabeceras personalizadas a las respuestas.

```javascript
async headers() {
  return [
    {
      source: '/(.*)',
      headers: [
        { key: 'X-Frame-Options', value: 'DENY' },
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      ],
    },
  ]
}
```

Estas funciones se evalúan en tiempo de construcción y pueden usar la fase actual.

## 5. Internacionalización (Pages Router)

Solo para Pages Router; en App Router se gestiona con middleware.

```javascript
module.exports = {
  i18n: {
    locales: ['en', 'es', 'fr'],
    defaultLocale: 'en',
    domains: [ // opcional
      { domain: 'example.com', defaultLocale: 'en' },
      { domain: 'example.es', defaultLocale: 'es', http: true },
    ],
  },
}
```

## 6. Opciones experimentales

Next.js introduce características bajo la bandera `experimental`. Algunas importantes:

```javascript
experimental: {
  serverActions: {
    bodySizeLimit: '2mb',
  },
  ppr: 'incremental', // Partial Prerendering
  optimizePackageImports: ['@heroicons/react', 'date-fns'],
  typedRoutes: true, // habilitar rutas tipadas (next/link tipado)
  dynamicIO: true, // APIs de caché dinámicas
  mdxRs: true, // compilador MDX en Rust
  webpackBuildWorker: true, // compilación paralela con Webpack
  turbo: { ... }, // configuraciones de Turbopack
}
```

- **`serverActions`**: permite ajustar el tamaño máximo del cuerpo (por defecto 1 MB).
- **`ppr`**: activa Partial Prerendering (`'incremental'` o `true`). Permite combinar estático y dinámico en una misma ruta.
- **`optimizePackageImports`**: agrupa importaciones de librerías grandes para reducir el número de módulos cargados.
- **`typedRoutes`**: habilita la verificación de tipos para `next/link` y `useRouter`, generando errores si la ruta no existe.

## 7. Modos de salida (`output`)

- `undefined` (por defecto): salida serverless/Node.js.
- `'standalone'`: crea una carpeta autocontenida para Docker.
- `'export'`: salida estática (sin servidor).

```javascript
output: 'standalone'
```

## 8. Webpack y Turbopack

Next.js permite extender la configuración de Webpack mediante `webpack` en `next.config.js`:

```javascript
webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
  config.plugins.push(new webpack.IgnorePlugin({ resourceRegExp: /^pg$/ }))
  return config
}
```

Para Turbopack, usa `turbopack` en `experimental` (configuración específica de reglas).

## 9. Compilador de Next.js

El **compilador de Next.js** (basado en SWC) se puede configurar en `compiler`:

```javascript
compiler: {
  removeConsole: true,  // elimina console.log en producción
  styledComponents: true, // soporte para styled-components
}
```

- `removeConsole`: puede ser `true` (elimina todos los `console.*`), o un objeto para excluir métodos.
- `styledComponents`: activa el plugin de SWC para SSR de styled-components (no requiere configuración extra en App Router con Registry).

## 10. Transpilación y dependencias externas

- **`transpilePackages`**: transpila módulos en `node_modules` que no estén compilados a ESM compatible. Útil para monorepos o paquetes locales.
  ```javascript
  transpilePackages: ['@mi-empresa/ui', 'lodash-es']
  ```
- **`serverExternalPackages`**: excluye ciertos paquetes del bundle del servidor, para que se carguen desde `node_modules` en tiempo de ejecución.
  ```javascript
  serverExternalPackages: ['sharp', '@mapbox/node-pre-gyp']
  ```

## 11. Cache de compilación y build ID

- **`generateBuildId`**: permite crear un identificador de build personalizado (útil para manejar versiones en despliegues).
  ```javascript
  generateBuildId: async () => 'my-build-id'
  ```
- **`distDir`**: cambia el directorio de salida de compilación (por defecto `.next`).
  ```javascript
  distDir: 'build'
  ```

## 12. Variables de entorno en la configuración

Puedes acceder a `process.env` para configurar condicionalmente:

```javascript
module.exports = {
  reactStrictMode: process.env.NODE_ENV !== 'production',
}
```

## 13. Configuración TypeScript

Si usas `next.config.ts`, necesitarás soporte experimental. Normalmente se sigue con `.js` o `.mjs`. La configuración TypeScript del proyecto (`tsconfig.json`) se personaliza aparte.

## Buenas prácticas

- Mantén el archivo de configuración limpio y organizado por secciones.
- Usa `async redirects`, `rewrites` y `headers` con funciones que devuelvan el array; permite usar variables de entorno.
- No abuses de las opciones experimentales en producción sin probarlas.
- Documenta las decisiones de configuración.
- Cuando uses `output: 'standalone'`, asegúrate de que los archivos estáticos y públicos se incluyan.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Copiar los archivos del standalone y los estáticos](../16-despliegue/04-copiar-los-archivos-del-standalone-y-los-estaticos.md) | [🏠 Inicio](../index.md) | [Variables de entorno en Next.js ▶](02-variables-entorno.md) |
