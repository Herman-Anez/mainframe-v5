# Variables de entorno en Next.js

## 1. Archivos de entorno

Next.js carga archivos `.env` de manera jerárquica. Los archivos se sobreescriben en el siguiente orden (de menor a mayor prioridad):

- `.env`
- `.env.local` (no debe ir al control de versiones)
- `.env.development`, `.env.production`, `.env.test` (según `NODE_ENV`)
- `.env.development.local`, `.env.production.local`, `.env.test.local`

**Solo las variables con prefijo `NEXT_PUBLIC_` son accesibles desde el navegador.** Todas las demás solo están disponibles en el entorno de Node.js (servidor, `getServerSideProps`, `getStaticProps`, Server Components, API Routes).

## 2. Variables públicas (`NEXT_PUBLIC_`)

- Se incrustan en el bundle de JavaScript durante el build.
- No deben contener secretos (claves de API, tokens de base de datos).
- Ejemplo: `NEXT_PUBLIC_ANALYTICS_ID=UA-XXXXX`

## 3. Uso en el código

### Pages Router

- **`getServerSideProps` / `getStaticProps`**: `process.env.MY_SECRET` está disponible.
- **Componentes**: solo las variables con `NEXT_PUBLIC_`.

### App Router

- **Server Components**: acceso a todas las variables (públicas y privadas) mediante `process.env`.
- **Client Components**: solo las públicas. Si necesitas pasar una variable privada al cliente, debes crear un endpoint, o leerla en un Server Component y pasarla como prop serializable.
- **Route Handlers**: igual que Server Components.

### Middleware

El middleware se ejecuta en el Edge Runtime y tiene acceso a variables de entorno definidas en el proyecto. Las variables con `NEXT_PUBLIC_` están disponibles, así como las privadas (siempre que estén definidas en el entorno de ejecución del Edge).

## 4. Variables de entorno en `next.config.js`

Se puede acceder a `process.env` para configurar opciones dinámicamente. Esto es útil para cambiar el `basePath` según el entorno o habilitar ciertas características en desarrollo.

```javascript
module.exports = {
  env: {
    API_URL: process.env.API_URL,
  },
}
```

La propiedad `env` en `next.config.js` **exponía variables al cliente** en versiones antiguas, pero ahora se desaconseja. Para exponer variables al cliente, usa el prefijo `NEXT_PUBLIC_` en el archivo `.env` directamente.

## 5. Variables en tiempo de ejecución vs compilación

- **Tiempo de compilación**: Las variables con `NEXT_PUBLIC_` y las usadas en `getStaticProps`/`generateStaticParams` se resuelven durante el build. Cualquier cambio requiere reconstruir la aplicación.
- **Tiempo de ejecución**: Las variables usadas en `getServerSideProps`, Server Components (con funciones dinámicas), API Routes y Route Handlers se leen en cada petición. Puedes cambiarlas sin reconstruir, solo reiniciando el servidor o redesplegando la función.

## 6. Variables de entorno en Vercel

- Se configuran en el dashboard (Settings > Environment Variables).
- Se pueden definir por entorno: Production, Preview, Development.
- Las variables se cifran y se exponen a las funciones serverless y Edge.
- Las variables del sistema como `VERCEL_URL` están disponibles automáticamente.

## 7. Variables de entorno con Docker

Puedes pasarlas con `-e` o mediante un archivo `.env` con Docker Compose. Las variables `NEXT_PUBLIC_` deben estar disponibles **en el momento del build**, por lo que si necesitas que cambien en producción sin reconstruir la imagen, debes adoptar un enfoque de "runtime configuration" (por ejemplo, un script de entrada que escriba un archivo `.env.production` con los valores).

## 8. Configuración obsoleta: `publicRuntimeConfig` y `serverRuntimeConfig`

En Pages Router existía la función `next/config` con `publicRuntimeConfig` y `serverRuntimeConfig`. Se consideran obsoletas porque no funcionan con App Router ni con Server Components. Se recomienda migrar a variables de entorno con `NEXT_PUBLIC_` y `process.env` directamente.

## 9. Buenas prácticas

- **No expongas secretos**: todo lo que va al cliente debe llevar `NEXT_PUBLIC_`. Asegúrate de que no haya tokens privados.
- **Usa `.env.local`** para desarrollo y no lo versiones.
- **Mantén un `.env.example`** con las claves necesarias (sin valores sensibles) para que otros desarrolladores sepan qué configurar.
- **Proporciona valores por defecto** en el código para evitar errores si falta una variable.
- **Para cambios en caliente** en producción, prefiere variables de entorno del sistema (no del build) y reinicia el servidor.
- **En Edge Functions**, algunas variables pueden no estar disponibles; verifica la compatibilidad.
- **Usa `NODE_ENV`** para condicionar lógica (aunque Next.js ya lo gestiona, puede ser útil en configuraciones personalizadas).

Con estos dos documentos, la sección de configuración queda completa, proporcionando al desarrollador el control necesario sobre el comportamiento de Next.js y la gestión segura de datos sensibles.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Archivo de configuración `next.config.js](01-next-config.md) | [🏠 Inicio](../index.md) | [Turbopack: el nuevo bundler de Next.js ▶](../18-avanzado/01-turbopack.md) |
