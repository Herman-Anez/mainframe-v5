# Profundización en Despliegue en Next.js

El despliegue de una aplicación Next.js puede realizarse en múltiples entornos. Cada opción —Vercel, Docker y exportación estática— responde a necesidades diferentes de infraestructura, escalado y control. A continuación se analizan en profundidad las tres estrategias más comunes.

---

## `vercel.md` – Despliegue en Vercel

### 1. ¿Por qué Vercel?

Vercel es la plataforma creada por los mismos desarrolladores de Next.js. Proporciona una **experiencia de despliegue optimizada**, con integración nativa de las características más avanzadas: ISR, Edge Functions, Middleware, Streaming, Server Actions, etc. El flujo de Git hasta el despliegue es prácticamente automático.

### 2. Primer despliegue

- Conecta el repositorio de Git (GitHub, GitLab, Bitbucket) a Vercel.
- Vercel detecta automáticamente Next.js y configura la construcción (`next build`) y el directorio de salida.
- Cada push a la rama principal dispara un despliegue de producción. Las ramas generan **preview deployments** automáticos.

La configuración puede personalizarse con un archivo `vercel.json` (opcional) o mediante la interfaz.

### 3. Configuración de proyecto (`next.config.js` y variables)

Vercel respeta las opciones de `next.config.js`:

- `images.remotePatterns` – Las imágenes externas se optimizan automáticamente si están en los dominios configurados.
- `rewrites`, `redirects` – Se aplican a nivel de CDN, sin llegar al servidor.
- `headers` – Permite añadir cabeceras HTTP globales.
- `output` – Puede ser `undefined` (por defecto, serverless) o `'standalone'`. En Vercel, el comportamiento por defecto es serverless; no es necesario cambiarlo.
- `experimental` – Muchas funcionalidades experimentales están soportadas (PPR, Server Actions, etc.).

Las **variables de entorno** se definen en el dashboard del proyecto (o mediante CLI) y pueden ser públicas (`NEXT_PUBLIC_`) o privadas. Vercel también proporciona variables de entorno automáticas como `VERCEL_URL`.

### 4. Despliegues de previsualización (Preview)

Cada pull request recibe una URL única. Esto permite probar cambios en un entorno idéntico al de producción antes de fusionar. Las preview deployments heredan las variables de entorno del entorno de desarrollo (preview) configuradas en el proyecto.

### 5. Funciones serverless y Edge

En Vercel, las API Routes del Pages Router y los Route Handlers del App Router se convierten en **funciones serverless** de manera automática.

- **Serverless (Node.js)**: Ejecuta el código en AWS Lambda. Tiene acceso completo a Node.js. Limitaciones de tamaño y tiempo de ejecución según el plan (Hobby: 10s, Pro: 15s, Enterprise: 30s).
- **Edge Functions**: Se despliegan en el Edge Network de Vercel, globalmente distribuidas. Se activan exportando `export const runtime = 'edge'` en el segmento o usando middleware (que siempre se ejecuta en Edge). Son más rápidas pero con APIs restringidas (sin sistema de archivos, sin módulos nativos de Node).

Vercel permite elegir entre los dos por ruta, optimizando coste y latencia.

### 6. Middleware y Edge

El archivo `middleware.ts` se ejecuta en el Edge Network de Vercel antes de que la petición llegue al origen. Permite redirecciones, reescrituras, autenticación ligera, A/B testing, geolocalización, etc. Se escala automáticamente.

### 7. ISR y revalidación bajo demanda

- **ISR por tiempo**: funcionan de forma nativa. Las páginas se regeneran en segundo plano. Vercel almacena la caché en su CDN global y en el sistema de archivos efímero.
- **Revalidación bajo demanda** (`revalidateTag`, `revalidatePath`): se soportan sin configuración adicional. La caché se invalida en segundos globalmente.
- Las páginas estáticas se sirven desde la CDN con una latencia muy baja.

### 8. Analíticas y monitoreo

Vercel ofrece:

- **Web Analytics**: tráfico, páginas vistas, referencias (modo privado, sin cookies).
- **Speed Insights**: métricas Core Web Vitals (LCP, CLS, INP, FID) de usuarios reales.
- **Logs**: visor de logs en tiempo real, con posibilidad de exportar.
- **Integración con herramientas externas**: Datadog, Sentry, etc.

### 9. Precios y límites

- **Hobby**: Gratuito, con 100 GB de ancho de banda/mes, 1 miembro, 1 proyecto concurrente.
- **Pro**: 20 $ por miembro/mes, más ancho de banda y funcionalidades avanzadas (red privada, islas de funciones).
- **Enterprise**: bajo contrato.

Para más detalles, consulta la documentación oficial de precios.

### 10. CLI de Vercel

Instalación: `npm i -g vercel`
Comandos útiles:

- `vercel` – despliega el directorio actual.
- `vercel env pull` – descarga variables de entorno locales.
- `vercel dev` – emula el entorno de Vercel localmente (soporta ISR, Edge Functions, etc.).
- `vercel --prod` – despliega a producción.

### 11. Buenas prácticas

- Activa la protección de ramas y los preview deployments.
- Usa variables de entorno específicas por entorno (producción, preview, desarrollo).
- Configura dominios personalizados y certificados SSL (automáticos en Vercel).
- Aprovecha las redirecciones y rewrites en `next.config.js` para mover rutas sin lógica de servidor.
- Monitoriza el rendimiento con Speed Insights y ajusta el LCP con imágenes `priority`.
- Para sitios grandes, considera el plan Pro que ofrece mayor ancho de banda y funciones concurrentes.

---

## `docker.md` – Despliegue con Docker

### 1. Cuándo usar Docker

Docker es ideal cuando se necesita:

- Control total sobre el entorno de ejecución.
- Integración con orquestadores (Kubernetes, Docker Swarm).
- Despliegue en cualquier proveedor cloud (AWS ECS, Google Cloud Run, Azure Container Apps) o en servidores propios.
- Combinar con otros servicios en contenedores (bases de datos, colas).

Next.js ofrece un modo de salida **standalone** que genera una carpeta autocontenida lista para ejecutarse en un contenedor mínimo.

### 2. Configuración de `next.config.js`

```javascript
module.exports = {
  output: 'standalone',
}
```

Al ejecutar `next build`, se crea una carpeta `.next/standalone` que contiene:

- El servidor Next.js compilado (archivo `server.js`).
- Los archivos estáticos necesarios.
- Un `package.json` con las dependencias mínimas.

### 3. Dockerfile multi‑etapa

```dockerfile

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Pruebas End‑to‑End (E2E)](../15-testing/02-e2e.md) | [🏠 Inicio](../index.md) | [Etapa 1: Construcción ▶](02-etapa-1-construccion.md) |
