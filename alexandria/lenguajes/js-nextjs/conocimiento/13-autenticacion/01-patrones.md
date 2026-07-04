# Patrones de autenticación en Next.js

## 1. Tipos de autenticación

- **Autenticación basada en sesión (stateful)**  
  El servidor mantiene una sesión (en memoria, base de datos o Redis) y envía una cookie de sesión al cliente. En cada petición, el servidor busca la sesión y obtiene los datos del usuario.

- **Autenticación basada en token (stateless)**  
  El servidor emite un token (normalmente JWT) que contiene la información del usuario y una firma. El cliente lo almacena (cookie httpOnly o localStorage) y lo envía en cada petición. El servidor verifica la firma sin necesidad de consultar un almacén central.

En Next.js se recomienda el uso de **tokens JWT** o **sesiones en base de datos** con cookies, ya que combinan seguridad con facilidad de implementación en Server Components y middleware.

## 2. Dónde colocar la lógica de autenticación

Next.js ofrece tres puntos estratégicos:

- **Middleware (`middleware.ts`)**  
  Se ejecuta en el Edge Runtime antes de cada petición que coincida con el `matcher`. Ideal para verificar cookies/tokens y redirigir si el usuario no está autenticado. No debe usarse para lógica pesada ni acceso a bases de datos (limitaciones del Edge).

- **Server Components y Route Handlers**  
  Al estar en el servidor (Node.js), pueden leer cookies, verificar tokens y acceder a la base de datos. La autenticación se integra directamente en los layouts o páginas, protegiendo rutas a nivel de componente.

- **Client Components**  
  Útiles para manejar el estado de sesión en la UI (nombre de usuario, foto), pero no para proteger rutas (se puede hacer redirección del lado del cliente, pero es insegura para contenido sensible).

## 3. Flujo típico con JWT y cookies

1. **Login**: El servidor valida credenciales (email/contraseña, OAuth) y emite un JWT firmado. El token se envía al cliente en una cookie `httpOnly` (más segura) o en el cuerpo de la respuesta.
2. **Almacenamiento**: La cookie `httpOnly` protege contra XSS; no es accesible desde JavaScript. En el cliente se puede tener un estado adicional para mostrar datos básicos del usuario (obtenidos desde una API `/me`).
3. **Verificación en cada petición**:
   - **Middleware**: Lee la cookie, valida el JWT (usando la librería `jose` o `jsonwebtoken`). Si es inválido, redirige a `/login`.
   - **Server Components / Route Handlers**: Extraen el token desde `cookies()` de `next/headers`, lo verifican y obtienen los datos del usuario para inyectarlos en el árbol de React.

## 4. Implementación manual (ejemplo con `jose`)

Instala `jose` (ligero y compatible con Edge):

```bash
npm install jose
```

### a) Crear y verificar tokens

```ts
// lib/auth.ts
import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'

const secretKey = new TextEncoder().encode(process.env.JWT_SECRET)
const alg = 'HS256'

export async function createToken(userId: string) {
  return new SignJWT({ userId })
    .setProtectedHeader({ alg })
    .setIssuedAt()
    .setExpirationTime('2h')
    .sign(secretKey)
}

export async function verifyToken(token: string) {
  const { payload } = await jwtVerify(token, secretKey)
  return payload as { userId: string }
}

export async function getSession() {
  const token = cookies().get('token')?.value
  if (!token) return null
  try {
    return await verifyToken(token)
  } catch {
    return null
  }
}
```

### b) Ruta de login (Route Handler)

```ts
// app/api/login/route.ts
import { NextResponse } from 'next/server'
import { createToken } from '@/lib/auth'

export async function POST(request: Request) {
  const { email, password } = await request.json()
  // validar credenciales...
  const token = await createToken(userId)
  const response = NextResponse.json({ success: true })
  response.cookies.set('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 2, // 2 horas
    path: '/',
  })
  return response
}
```

### c) Middleware de protección

```ts
// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

const secretKey = new TextEncoder().encode(process.env.JWT_SECRET)

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  try {
    await jwtVerify(token, secretKey)
    return NextResponse.next()
  } catch {
    return NextResponse.redirect(new URL('/login', request.url))
  }
}

export const config = {
  matcher: ['/dashboard/:path*', '/api/protected/:path*'],
}
```

### d) Uso en Server Components

```tsx
import { getSession } from '@/lib/auth'
import { notFound } from 'next/navigation'

export default async function DashboardPage() {
  const session = await getSession()
  if (!session) notFound()
  return <div>Bienvenido {session.userId}</div>
}
```

## 5. Patrón con sesiones en base de datos

Similar al anterior, pero en lugar de JWT se genera un **session ID** aleatorio que se almacena en BD (junto con datos del usuario y caducidad). La cookie contiene ese ID. En cada petición, se busca la sesión en la base de datos.

Ventajas: permite invalidar sesiones de forma inmediata. Desventajas: requiere una consulta adicional.

Con este patrón, el middleware puede verificar la sesión contra una base de datos Edge‑compatible (ej. PlanetScale, Turso) o usar una capa de caché como Redis.

## 6. Uso de `next/headers` en Server Components

Puedes leer la cookie directamente sin funciones dinámicas si usas `cookies()` de `next/headers`. Ten en cuenta que esto dinámicamente convierte la página en SSR. Para rutas que necesitan protección, es aceptable.

## 7. Autenticación con proveedores sociales (OAuth)

Se puede implementar manualmente usando librerías como `oauth4webapi` o el propio Next.js con Route Handlers que gestionan el flujo de autorización. Sin embargo, la mayoría de proyectos usan **NextAuth.js** para simplificar (ver sección dedicada).

## 8. Buenas prácticas

- Siempre usa cookies `httpOnly`, `secure`, `sameSite` para el token o session ID.
- Protege las rutas sensibles tanto en middleware como en el servidor (defensa en profundidad).
- Para APIs, además del token, implementa CSRF protection (Next.js incluye protección en Server Actions, pero para Route Handlers debes agregar un header CSRF o usar SameSite estricto).
- No expongas datos sensibles en el JWT (puede ser decodificado en el cliente si se almacena en localStorage). Prefiere solo el ID y guarda el resto en BD.
- Rota las claves de firma periódicamente.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Middleware en Next.js](../12-api-route-handlers/03-middleware.md) | [🏠 Inicio](../index.md) | [NextAuth.js (Auth.js) en profundidad ▶](02-nextauth.md) |
