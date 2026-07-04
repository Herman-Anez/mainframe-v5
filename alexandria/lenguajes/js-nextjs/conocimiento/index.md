# Guía de Documentación de Nextjs Conocimiento

Bienvenido al índice centralizado de esta sección de documentación. Puedes navegar a través de los temas de manera secuencial y lógica utilizando los enlaces al pie de página de cada sección.

## 📂 Índice de Contenidos

### 1. Fundamentos

- [Que es nextjs](1-fundamentos/01-que-es-nextjs.md)
- [React fundamentos](1-fundamentos/02-react-fundamentos.md)
- [Estructura proyecto](1-fundamentos/03-estructura-proyecto.md)
- [Pages vs app router](1-fundamentos/04-pages-vs-app-router.md)

### 2. Pages Router

#### 1. Archivos Especiales

- [Componente de Aplicación Personalizado](2-pages-router/1-archivos-especiales/01-_app.md)
- [Documento HTML personalizado](2-pages-router/1-archivos-especiales/02-_document.md)
- [Página de error personalizada](2-pages-router/1-archivos-especiales/03-_error.md)
- [Resumen de interacciones y prioridades](2-pages-router/1-archivos-especiales/06-resumen-de-interacciones-y-prioridades.md)

#### 2. Enrutamiento

- [Rutas estaticas dinamicas](2-pages-router/2-enrutamiento/01-rutas-estaticas-dinamicas.md)
- [Nested routes](2-pages-router/2-enrutamiento/02-nested-routes.md)
- [Shallow routing](2-pages-router/2-enrutamiento/03-shallow-routing.md)
- [Catch all opcional](2-pages-router/2-enrutamiento/04-catch-all-opcional.md)

#### 3. Data Fetching

- [Getserversideprops](2-pages-router/3-data-fetching/01-getServerSideProps.md)
- [Getstaticprops](2-pages-router/3-data-fetching/02-getStaticProps.md)
- [Getstaticpaths](2-pages-router/3-data-fetching/03-getStaticPaths.md)
- [Fallback modes](2-pages-router/3-data-fetching/04-fallback-modes.md)

#### 4. Api Routes

- [API Routes: Conceptos y uso fundamental](2-pages-router/4-api-routes/01-basico.md)
- [Patrones de middleware en API Routes del Pages Router](2-pages-router/4-api-routes/02-middlewares.md)

#### 5. Layouts

- [Patrón de Layout por Página](2-pages-router/5-layouts/01-per-page-layout.md)
- [Layout Global mediante `_app](2-pages-router/5-layouts/02-_app-layout.md)

#### 6. Navigation

- [`next/link`: El componente de enlace](2-pages-router/6-navigation/01-nextlink-el-componente-de-enlace.md)
- [`next/router` y el hook `useRouter`](2-pages-router/6-navigation/02-nextrouter-y-el-hook-userouter.md)
- [Navegación superficial (shallow routing)](2-pages-router/6-navigation/03-navegacion-superficial-shallow-routing.md)
- [Navegación con parámetros de consulta (query strings)](2-pages-router/6-navigation/04-navegacion-con-parametros-de-consulta-query-strings.md)
- [Navegación en internacionalización (i18n)](2-pages-router/6-navigation/05-navegacion-en-internacionalizacion-i18n.md)
- [Optimización y rendimiento](2-pages-router/6-navigation/06-optimizacion-y-rendimiento.md)
- [Comparativa con App Router](2-pages-router/6-navigation/07-comparativa-con-app-router.md)
- [Buenas prácticas](2-pages-router/6-navigation/08-buenas-practicas.md)

### 3. App Router

#### 1. Archivos Especiales

- [El Layout Persistente](3-app-router/1-archivos-especiales/01-layout.md)
- [La Página](3-app-router/1-archivos-especiales/02-page.md)
- [Pantalla de Carga](3-app-router/1-archivos-especiales/03-loading.md)
- [Manejo de Errores en el Segmento](3-app-router/1-archivos-especiales/04-error.md)
- [Error del Root Layout](3-app-router/1-archivos-especiales/05-global-error.md)
- [Página 404 por Segmento](3-app-router/1-archivos-especiales/06-not-found.md)
- [Plantilla sin Persistencia](3-app-router/1-archivos-especiales/07-template.md)
- [API Route Handler](3-app-router/1-archivos-especiales/08-route.md)
- [Fallback para Rutas Paralelas](3-app-router/1-archivos-especiales/09-default.md)
- [Archivos de Metadatos Estáticos y Dinámicos](3-app-router/1-archivos-especiales/10-metadata-files.md)

- [Streaming y Suspense en el App Router](3-app-router/01-streaming-suspense.md)
- [API de Metadatos y SEO en el App Router](3-app-router/02-metadata-seo.md)
- [Configuración de Segmento](3-app-router/03-configuracion-segmento.md)

#### 2. Convenciones Enrutamiento

- [Grupos de Rutas](3-app-router/2-convenciones-enrutamiento/01-grupos-rutas.md)
- [Rutas Dinámicas en App Router](3-app-router/2-convenciones-enrutamiento/02-dinamicas.md)
- [Rutas Paralelas](3-app-router/2-convenciones-enrutamiento/03-paralelas.md)
- [Rutas Interceptadas](3-app-router/2-convenciones-enrutamiento/04-interceptadas.md)
- [Implementación de Modales con Rutas](3-app-router/2-convenciones-enrutamiento/05-modales.md)

#### 3. Layouts Plantillas

- [Composición de Layouts](3-app-router/3-layouts-plantillas/01-composicion-layouts.md)
- [Layouts vs. Templates](3-app-router/3-layouts-plantillas/02-layout-vs-template.md)
- [Proveedores de Contexto en Layouts](3-app-router/3-layouts-plantillas/03-providers-context.md)
- [El Layout Raíz](3-app-router/3-layouts-plantillas/04-root-layout.md)

#### 4. Obtencion Datos

- [Fetch Extendido y Caché en App Router](3-app-router/4-obtencion-datos/01-fetch-extendido.md)
- [Estrategias de Revalidación en App Router](3-app-router/4-obtencion-datos/02-revalidacion.md)
- [Generación Estática de Parámetros](3-app-router/4-obtencion-datos/03-generateStaticParams.md)
- [Funciones Dinámicas y Comportamiento de Ruta](3-app-router/4-obtencion-datos/04-dynamic-functions.md)
- [Server Actions](3-app-router/4-obtencion-datos/05-server-actions.md)

### 4. Renderizado

- [Server‑Side Rendering (SSR)](4-renderizado/01-ssr.md)
- [Static Site Generation (SSG)](4-renderizado/02-ssg.md)
- [Incremental Static Regeneration (ISR)](4-renderizado/03-isr.md)
- [Client‑Side Rendering (CSR)](4-renderizado/04-csr.md)
- [Streaming con Suspense](4-renderizado/05-streaming-suspense.md)
- [Renderizado Dinámico vs Estático](4-renderizado/06-dinamico-vs-estatico.md)

### 5. Server Client Components

- [React Server Components en Next.js](5-server-client-components/01-conceptos-server-components.md)
- [Componentes de Cliente en el App Router](5-server-client-components/02-client-components.md)
- [Patrones de Composición Server/Client](5-server-client-components/03-patrones.md)
- [Server Actions: Puente entre Cliente y Servidor](5-server-client-components/04-server-actions.md)

### 6. Obtencion Datos General

- [Métodos de obtención de datos en el Pages Router](6-obtencion-datos-general/01-pages-metodos.md)
- [Obtención de datos en el App Router](6-obtencion-datos-general/02-app-router-fetch.md)
- [Sistema de caché en Next.js](6-obtencion-datos-general/03-cacheo.md)
- [Mutaciones de datos en Next.js](6-obtencion-datos-general/04-mutaciones.md)

### 7. Optimizaciones

- [Optimización de imágenes con `next/image](7-optimizaciones/01-imagenes.md)
- [Optimización de fuentes con `next/font](7-optimizaciones/02-fuentes.md)
- [Carga optimizada de scripts con `next/script](7-optimizaciones/03-scripts.md)
- [next/dynamic](7-optimizaciones/04-importaciones-dinamicas.md)
- [Análisis y optimización del bundle](7-optimizaciones/05-analisis-bundle.md)

### 9. Estilos

- [CSS Modules en Next.js](9-estilos/01-css-modules.md)
- [Tailwind CSS en Next.js](9-estilos/02-tailwind.md)
- [CSS‑in‑JS en Next.js](9-estilos/03-css-in-js.md)
- [Estilos Globales en Next.js](9-estilos/04-estilos-globales.md)

### 10. Seo

- [API de Metadatos en Next.js](10-seo/01-metadata-api.md)
- [Sitemap y Robots.txt en Next.js](10-seo/02-sitemap-robots.md)
- [Datos Estructurados (JSON‑LD)](10-seo/03-datos-estructurados.md)

### 12. Api Route Handlers

- [API Routes en el Pages Router](12-api-route-handlers/01-pages-api.md)
- [Route Handlers en el App Router](12-api-route-handlers/02-route-handlers.md)
- [Middleware en Next.js](12-api-route-handlers/03-middleware.md)

### 13. Autenticacion

- [Patrones de autenticación en Next.js](13-autenticacion/01-patrones.md)
- [NextAuth.js (Auth.js) en profundidad](13-autenticacion/02-nextauth.md)

### 14. Internacionalizacion

- [Internacionalización en el Pages Router](14-internacionalizacion/01-internacionalizacion-en-el-pages-router.md)
- [Internacionalización en el App Router](14-internacionalizacion/02-internacionalizacion-en-el-app-router.md)
- [Comparativa y migración](14-internacionalizacion/03-comparativa-y-migracion.md)
- [Buenas prácticas](14-internacionalizacion/04-buenas-practicas.md)

### 15. Testing

- [Pruebas Unitarias y de Integración](15-testing/01-unitarias-integracion.md)
- [Pruebas End‑to‑End (E2E)](15-testing/02-e2e.md)

### 16. Despliegue

- [Profundización en Despliegue en Next.js](16-despliegue/01-profundizacion-en-despliegue-en-nextjs.md)
- [Etapa 1: Construcción](16-despliegue/02-etapa-1-construccion.md)
- [Etapa 2: Producción (solo lo necesario)](16-despliegue/03-etapa-2-produccion-solo-lo-necesario.md)
- [Copiar los archivos del standalone y los estáticos](16-despliegue/04-copiar-los-archivos-del-standalone-y-los-estaticos.md)

### 17. Configuracion

- [Archivo de configuración `next.config.js](17-configuracion/01-next-config.md)
- [Variables de entorno en Next.js](17-configuracion/02-variables-entorno.md)

### 18. Avanzado

- [Turbopack: el nuevo bundler de Next.js](18-avanzado/01-turbopack.md)
- [Partial Prerendering (PPR)](18-avanzado/02-partial-prerendering.md)
- [Dynamic IO (Experimental)](18-avanzado/03-dynamic-io.md)
- [Internals de React Server Components](18-avanzado/04-internals-rsc.md)

