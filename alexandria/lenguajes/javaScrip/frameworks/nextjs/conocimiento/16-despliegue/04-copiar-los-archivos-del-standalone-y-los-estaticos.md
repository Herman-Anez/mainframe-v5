# Copiar los archivos del standalone y los estáticos

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
CMD ["node", "server.js"]
```

**Explicación**:
- La etapa `builder` instala todas las dependencias y compila la aplicación.
- La etapa `runner` copia únicamente la carpeta `standalone`, la carpeta `public` y los archivos estáticos de `.next/static`. El peso final de la imagen es mucho menor.
- Se expone el puerto 3000 (por defecto) y se ejecuta el servidor Node.js incluido.

### 4. Imagen aún más ligera con `distroless` o `alpine`

Puedes usar `node:20-alpine` o incluso `gcr.io/distroless/nodejs20-debian12` para un contenedor mínimo (menos de 120 MB). Sin embargo, con Alpine suele ser suficiente y más fácil de depurar.

### 5. Uso de Docker Compose

Para desarrollo local con otros servicios:

```yaml
version: '3'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgres://...
    depends_on:
      - db
  db:
    image: postgres:15
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
      POSTGRES_DB: myapp
    volumes:
      - postgres_data:/var/lib/postgresql/data
volumes:
  postgres_data:
```

### 6. Variables de entorno

Pueden pasarse en el `Dockerfile` con `ENV`, mediante un archivo `.env` en `docker-compose`, o en el orquestador. Las variables con prefijo `NEXT_PUBLIC_` deben estar disponibles en el momento de la construcción, porque se incrustan en el JavaScript del cliente. Si necesitas que sean dinámicas en producción, deberás reconstruir la imagen o usar un patrón de “runtime environment” mediante scripts de entrada.

### 7. Despliegue en cloud

- **Google Cloud Run**: Sube la imagen a Artifact Registry y despliega con `gcloud run deploy --image ...`. Soportan escalado a cero, HTTPS automático y alta disponibilidad.
- **AWS ECS con Fargate**: Sube la imagen a ECR, define una tarea y un servicio. Requiere un Application Load Balancer.
- **Railway, Render, Fly.io**: Opciones simplificadas que aceptan imágenes de Docker directamente.

### 8. Consideraciones

- La imagen standalone no incluye `public/` ni `.next/static` dentro de la carpeta `standalone`; deben copiarse manualmente como en el Dockerfile de ejemplo.
- Si usas ISR, la caché se guarda por defecto en el sistema de archivos (dentro del contenedor). Para escalar horizontalmente necesitarás una caché compartida (Redis) o usar `unstable_cache` con un backend externo.
- Las Server Actions y Route Handlers funcionan igual que en un servidor Node.js estándar.

### 9. Buenas prácticas

- Ejecuta el contenedor con un usuario no root: `USER node` (Alpine tiene el usuario `node`).
- Usa `healthcheck` en el `Dockerfile`:
  ```dockerfile
  HEALTHCHECK --interval=30s --timeout=5s CMD wget --quiet --tries=1 --spider http://localhost:3000/ || exit 1
  ```
- Configura el reinicio automático y límites de recursos.
- Para producción, establece `NODE_ENV=production` y no incluyas herramientas de desarrollo.
- Escala los contenedores según la carga; la arquitectura standalone es stateless si no usas ISR con sistema de archivos local.

---

## `exportacion-estatica.md` – Exportación Estática

### 1. ¿Qué es la exportación estática?

Es el proceso de generar un sitio completamente estático (HTML, CSS, JS) que no necesita un servidor Node.js para funcionar. Los archivos se sirven desde cualquier servidor web, CDN o bucket de almacenamiento (S3, GCS, etc.). Next.js produce esta salida cuando se configura `output: 'export'` (introducido en Next.js 13.2) o mediante el comando `next export` (deprecado en favor de la opción de configuración).

### 2. Limitaciones

Al ser completamente estático, se pierden las características del servidor:

- **No SSR, ISR ni streaming**. Todas las páginas deben estar disponibles en el momento de la compilación.
- **No API Routes ni Route Handlers**. La lógica de servidor debe externalizarse a servicios separados.
- **No middleware**.
- **No Server Actions**.
- **No `next/image` con optimización automática**. Se requiere un loader personalizado o `unoptimized`.
- **No `next/font` auto‑hospedado**? En realidad sí se puede, porque las fuentes se descargan en tiempo de compilación y se incluyen en los estáticos; funciona sin servidor.

La exportación estática es adecuada para:

- Sitios de contenido puro (marketing, documentación, blogs).
- Aplicaciones que obtienen todos los datos durante el build (con `generateStaticParams` y `fetch` en Server Components).
- Entornos donde no se puede ejecutar Node.js (hosting compartido, GitHub Pages, Netlify, S3).

### 3. Configuración

En `next.config.js`:

```javascript
module.exports = {
  output: 'export',
  // Opcional: basePath para rutas relativas
  // basePath: '/docs',
  // Opcional: trailingSlash para compatibilidad con ciertos hosts
  // trailingSlash: true,
}
```

Ejecutar `next build` generará la carpeta `out/` con los archivos estáticos.

### 4. Rutas dinámicas

Todas las rutas dinámicas deben ser pre‑renderizadas con `generateStaticParams`. Si una ruta dinámica no está en la lista, dará 404. No existe `fallback` como en un servidor.

```tsx
export async function generateStaticParams() {
  const posts = await fetch('...').then(res => res.json())
  return posts.map(post => ({ slug: post.slug }))
}
```

### 5. Imágenes

El componente `next/image` sin servidor no puede optimizar bajo demanda. Soluciones:

- Usar `unoptimized` (imagen original, puede ser pesada).
- Configurar un loader que apunte a un servicio de optimización externo (Cloudinary, Imgix, etc.).
- Sustituir por `<img>` tradicional con `sizes` y `srcset` manuales.

```tsx
import Image from 'next/image'

export default function ImageExample() {
  return (
    <Image
      src="/foto.jpg"
      width={800}
      height={600}
      alt=""
      unoptimized
    />
  )
}
```

### 6. Página 404 personalizada

Crea `app/not-found.tsx` (App Router) o `pages/404.js` (Pages Router). Esta página también será estática. Al hacer `next build`, se genera un `404.html` que la mayoría de los servidores estáticos usan automáticamente.

### 7. Despliegue

La carpeta `out/` se puede servir con cualquier herramienta:

- **Netlify**: arrastra la carpeta o configura `publish = "out"` en `netlify.toml`.
- **Vercel**: también soporta exportación estática; se configura `output: 'export'` y se despliega como un sitio estático.
- **GitHub Pages**: usa la acción `peaceiris/actions-gh-pages` para desplegar `out/` a la rama `gh-pages`.
- **Amazon S3 + CloudFront**: sincroniza `out/` con un bucket y configura un CDN.
- **Nginx**: simplemente apunta la raíz del sitio a la carpeta `out/`.

### 8. Variables de entorno

Las variables con `NEXT_PUBLIC_` se incrustan en el build. No se pueden cambiar sin reconstruir el sitio. Para manejar entornos, es necesario generar un build por cada entorno o utilizar un script que sustituya valores en el momento del despliegue (por ejemplo, con `envsubst`).

### 9. Trailing slashes y URLs limpias

Algunos servidores esperan que las rutas terminen en `.html`. Puedes configurar `trailingSlash: true` para que Next.js genere `/about/index.html` en lugar de `/about.html`. Consulta la documentación del host.

### 10. ¿Y si necesito solo algunas páginas estáticas?

No es necesario exportar toda la aplicación. Puedes mantener la aplicación Next.js con servidor y, para páginas específicas, usar ISR o SSR. La exportación estática es todo o nada para el proyecto (no se puede mezclar con rutas dinámicas en el mismo deploy). Si necesitas híbridos, considera mantener el servidor.

### 11. Buenas prácticas

- Verifica que todas las rutas sean generadas con `generateStaticParams`.
- Prueba localmente con `npx serve out/` para simular el entorno de producción.
- Para manejar un gran número de páginas, evalúa el tiempo de build; si es excesivo, considera ISR con un servidor en lugar de exportación pura.
- Mantén los loaders de imágenes y configuración de `next/image` listos para el entorno sin servidor.

Con estos tres documentos, la sección de despliegue proporciona una visión completa de cómo llevar Next.js a producción según las necesidades de infraestructura, desde la comodidad de Vercel hasta la flexibilidad de los contenedores y la simplicidad de los sitios estáticos.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Etapa 2: Producción (solo lo necesario)](03-etapa-2-produccion-solo-lo-necesario.md) | [🏠 Inicio](../index.md) | [Archivo de configuración `next.config.js ▶](../17-configuracion/01-next-config.md) |
