# NextAuth.js (Auth.js) en profundidad

## ¿Qué es NextAuth.js?

**NextAuth.js** (ahora renombrado a **Auth.js**) es una librería de autenticación completa para Next.js. Soporta múltiples proveedores (Google, GitHub, credenciales, etc.), bases de datos, sesiones con JWT o base de datos, y se integra fácilmente con el App Router y Pages Router.

## Instalación

```bash
npm install next-auth@beta
```

> Se recomienda la versión 5 (beta) para App Router, aunque la v4 sigue siendo estable.

## Conceptos principales

- **Providers**: fuentes de autenticación (OAuth, credenciales, email mágico).
- **Adapters**: conectores para almacenar usuarios, cuentas y sesiones en base de datos.
- **Callbacks**: funciones que permiten personalizar el flujo (jwt, session, signIn).
- **Session**: objeto que representa la sesión del usuario; se puede almacenar en JWT o en BD.
- **Middleware**: Auth.js provee `auth()` y `middleware` de Next.js para proteger rutas fácilmente.

## Configuración básica (Auth.js v5)

Crea un archivo `auth.ts` en `src/` o `app/`:

```ts
// auth.ts
import NextAuth from 'next-auth'
import GitHub from 'next-auth/providers/github'
import Google from 'next-auth/providers/google'

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    GitHub({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    Google({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
  ],
})
```

- `handlers` contiene `GET` y `POST` para el endpoint `/api/auth/*`.
- `signIn`, `signOut` son funciones para usar en Server Components o Client Components.
- `auth` es una función que retorna la sesión (equivalente a `getServerSession`).

## Proveedores detallados

### OAuth (Google, GitHub, etc.)

Configura las credenciales en la consola del proveedor y añádelas como variables de entorno.

```ts
providers: [
  GitHub,
  Google,
]
```

Para añadir scopes personalizados:

```ts
Google({
  authorization: {
    params: {
      scope: 'openid email profile https://www.googleapis.com/auth/calendar',
    },
  },
})
```

### Credenciales (email/contraseña)

```ts
import Credentials from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'

providers: [
  Credentials({
    name: 'credentials',
    credentials: {
      email: { label: 'Email', type: 'email' },
      password: { label: 'Password', type: 'password' },
    },
    async authorize(credentials) {
      const user = await db.user.findUnique({ where: { email: credentials.email } })
      if (!user || !bcrypt.compareSync(credentials.password, user.password)) {
        return null
      }
      return { id: user.id, name: user.name, email: user.email }
    },
  }),
]
```

**Precaución**: Las credenciales no deben usarse con JWT (Auth.js v5 lo permite, pero la sesión se almacena en JWT, por lo que no puedes invalidarla sin reintroducir una base de datos). Se recomienda combinarlas con un adapter y sesiones en BD.

### Email (Magic Link)

Envía un enlace mágico por correo. Requiere configurar un servicio SMTP o una librería de envío.

## Adapters

Permiten persistir la información de usuario y sesiones en una base de datos.

```bash
npm install @auth/prisma-adapter prisma
```

En `auth.ts`:

```ts
import { PrismaAdapter } from '@auth/prisma-adapter'
import prisma from './prisma'

export const { handlers, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [...],
})
```

El adapter maneja el esquema de base de datos: `User`, `Account`, `Session`, `VerificationToken`. Con Prisma, deberás añadir los modelos correspondientes (Auth.js provee un esquema base).

## Callbacks

Permiten personalizar el JWT y el objeto `session`.

### `jwt`

Se ejecuta al crear/actualizar un token JWT.

```ts
callbacks: {
  async jwt({ token, user }) {
    if (user) {
      token.role = user.role
    }
    return token
  },
}
```

### `session`

Personaliza el objeto session que se devuelve al cliente.

```ts
callbacks: {
  async session({ session, token }) {
    if (session.user) {
      session.user.role = token.role
    }
    return session
  },
}
```

> [!IMPORTANT]
> **Importante**: Al usar callbacks, el tipo de `session.user` puede ampliarse con módulos de declaración (`next-auth.d.ts`).

## Middleware de Auth.js

Auth.js proporciona un middleware envolvente que se puede usar en `middleware.ts`:

```ts
export { auth as middleware } from '@/auth'

export const config = {
  matcher: ['/dashboard/:path*', '/api/admin/:path*'],
}
```

Esto protege automáticamente las rutas; si el usuario no está autenticado, redirige a la página de login por defecto.

Si necesitas lógica personalizada, puedes crear un middleware manual usando `auth()`:

```ts
// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { auth } from '@/auth'

export async function middleware(request: NextRequest) {
  const session = await auth()
  if (!session) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  return NextResponse.next()
}
```

## Obteniendo la sesión en Server Components

```tsx
import { auth } from '@/auth'

export default async function Profile() {
  const session = await auth()
  return <pre>{JSON.stringify(session, null, 2)}</pre>
}
```

En **Client Components**, usa `useSession` de `next-auth/react`:

```tsx
'use client'
import { useSession } from 'next-auth/react'

export default function ClientProfile() {
  const { data: session, status } = useSession()
  if (status === 'loading') return <p>Cargando...</p>
  return <p>{session?.user?.name}</p>
}
```

## Protección de API Routes y Route Handlers

En Route Handlers, puedes usar `auth()`:

```ts
import { auth } from '@/auth'

export async function GET() {
  const session = await auth()
  if (!session) {
    return new Response('Unauthorized', { status: 401 })
  }
  // ...
}
```

## Manejo de roles y autorización

Mediante callbacks y middlewares puedes implementar RBAC. Por ejemplo, en el callback `jwt` agregas el rol, y en el middleware verificas:

```ts
const session = await auth()
if (session?.user?.role !== 'admin') {
  return NextResponse.redirect(new URL('/', request.url))
}
```

## Configuración de páginas personalizadas

```ts
export const { handlers, auth } = NextAuth({
  pages: {
    signIn: '/auth/login',
    error: '/auth/error',
  },
})
```

Puedes crear tus propias páginas con formularios y usar `signIn` desde `next-auth/react`.

## Manejo de errores y eventos

Auth.js expone `events` para registrar acciones (signIn, signOut, createUser). También puedes usar `logger` para debugging.

## Despliegue y variables de entorno

Necesitarás generar un `NEXTAUTH_SECRET` (usando `openssl rand -base64 32`). Las URLs de callback deben configurarse en los proveedores OAuth.

En Vercel, la variable `NEXTAUTH_URL` se configura automáticamente; en otros entornos, defínela explícitamente.

## NextAuth vs Auth.js v5

La v5 unifica la API para funcionar en múltiples frameworks (SvelteKit, Nuxt, etc.). La integración con Next.js sigue siendo la misma, pero las importaciones son desde `next-auth`.

## Sesiones con base de datos vs JWT

- **JWT** (por defecto si no hay adapter): La sesión se codifica en un token JWT almacenado en una cookie (normalmente `next-auth.session-token`). Es stateless y no requiere base de datos, pero no se puede invalidar en el servidor sin comprobar una lista de revocación.
- **Base de datos (adapter)**: La sesión se almacena en una tabla `Session` y la cookie contiene el `sessionToken` que se valida contra la BD. Permite revocación inmediata.

Elige la que mejor se adapte a tus necesidades.

## Ejemplo completo con Prisma y credenciales

1. Esquema de Prisma (agrega los modelos recomendados por Auth.js).
2. `auth.ts` con `PrismaAdapter`, `CredentialsProvider` y callbacks.
3. Páginas de login personalizadas que usan `signIn` de `next-auth/react`.
4. Middleware con `auth()` para proteger rutas.

## Buenas prácticas con NextAuth

- No uses el hook `useSession` en Server Components; utiliza `auth()`.
- Mantén `NEXTAUTH_SECRET` seguro y fuera del control de versiones.
- Configura `trustHost: true` si estás detrás de un proxy inverso.
- Personaliza el tipo de `Session` para tener autocompletado.
- Habilita `debug: true` solo en desarrollo.
- Para evitar errores de Edge en middlewares personalizados, importa `auth` dinámicamente si es necesario (aunque `auth()` de v5 está diseñado para Edge).

Con estos dos documentos, la sección de autenticación queda sólida y cubre tanto la teoría general como la implementación con la librería más popular del ecosistema Next.js.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Patrones de autenticación en Next.js](01-patrones.md) | [🏠 Inicio](../index.md) | [Internacionalización en el Pages Router ▶](../14-internacionalizacion/01-internacionalizacion-en-el-pages-router.md) |
