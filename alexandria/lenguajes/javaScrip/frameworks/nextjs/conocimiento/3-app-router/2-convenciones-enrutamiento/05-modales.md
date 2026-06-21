# Implementación de Modales con Rutas

## El patrón

El patrón de modales en Next.js App Router se logra combinando:

- **Rutas paralelas**: un slot `@modal` en el layout.
- **Rutas interceptadas**: una carpeta `(.)ruta` que renderiza dentro del slot.

Esto permite que al navegar a una URL, se muestre un modal sobre el contenido actual, y al recargar, se vea la página completa.

## Estructura típica

```
app/
  layout.js                    → contiene el slot @modal
  @modal/
    default.js                 → retorna null (sin modal)
    (.)login/
      page.js                  → modal de login interceptado
  login/
    page.js                    → página de login completa
  page.js                      → página principal
```

## Root layout

```tsx
// app/layout.tsx
export default function RootLayout({ children, modal }: {
  children: React.ReactNode
  modal: React.ReactNode
}) {
  return (
    <html>
      <body>
        {children}
        {modal}
      </body>
    </html>
  )
}
```

`modal` contiene lo que sea que esté en el slot `@modal`. Por defecto, `@modal/default.tsx` renderiza `null`, así que no se ve nada.

## Página de login (completa)

```tsx
// app/login/page.tsx
import LoginForm from './LoginForm'

export default function LoginPage() {
  return <LoginForm />
}
```

Esta es la página que se muestra al visitar `/login` directamente.

## Modal de login interceptado

```tsx
// app/@modal/(.)login/page.tsx
'use client'
import { useRouter } from 'next/navigation'
import LoginForm from '../../login/LoginForm'

export default function LoginModal() {
  const router = useRouter()
  return (
    <div className="modal-backdrop" onClick={() => router.back()}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <LoginForm />
        <button onClick={() => router.back()}>Cerrar</button>
      </div>
    </div>
  )
}
```

Al estar dentro de `@modal`, se renderiza en el slot `modal` del layout. Al hacer clic en "Cerrar" o en el fondo, se ejecuta `router.back()`, que vuelve atrás en el historial y cierra el modal.

## Enlace para abrir el modal

En cualquier página (por ejemplo, `app/page.tsx`):

```tsx
import Link from 'next/link'

export default function Home() {
  return <Link href="/login">Iniciar sesión</Link>
}
```

Al hacer clic, Next.js navega a `/login`, pero como existe `@modal/(.)login/page.js`, se interpone y renderiza el modal. La URL cambia a `/login`. Si se recarga, se obtiene la página completa.

## `default.js` del modal

```tsx
// app/@modal/default.tsx
export default function Default() {
  return null
}
```

## Back/Forward del navegador

- Cerrar el modal con `router.back()` restaura la URL anterior y elimina el contenido del slot, mostrando `default` (null).
- El botón "adelante" del navegador puede reabrir el modal si el historial lo permite.

## Variantes con otros contenidos

El patrón es genérico: fotos, formularios, paneles de configuración. Solo cambia el nombre de la ruta y el contenido.

## Múltiples modales

Se pueden tener varios slots si se necesitan distintos tipos de superposiciones, pero generalmente uno es suficiente.

## Estilizado y accesibilidad

- Añadir `role="dialog"`, `aria-modal="true"` y manejar foco.
- Cerrar con tecla Escape (`useEffect` con listener de `keydown`).
- Usar `useRouter` para cerrar, pero también podría usarse `router.replace` para evitar que la URL del modal quede en el historial si no se desea (aunque entonces se pierde el comportamiento de recarga).

## Manejo de estado del formulario

Como el modal se desmonta al cerrar, el estado se pierde. Si se desea conservar, se puede mover el estado al contexto o a la URL.

## Notas sobre rendimiento

El modal interceptado es un Client Component (por `'use client'`), pero puede ser pequeño. La página completa (`login/page.tsx`) puede ser un Server Component si no necesita interactividad, aunque lo común es que ambos compartan el mismo formulario (Client Component) para evitar duplicar código.

## Consideraciones con autenticación

Si se usa `middleware` para redirigir a `/login` cuando el usuario no está autenticado, la redirección desde el servidor cargará la página completa, no el modal. Para evitar esto, se puede manejar la lógica de autenticación en el cliente o usar `rewrites` condicionales.

---

Estos cinco temas conforman la columna vertebral del enrutamiento avanzado en el App Router, permitiendo interfaces de usuario ricas, modales elegantes y una organización de código impecable.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Rutas Interceptadas](04-interceptadas.md) | [🏠 Inicio](../../index.md) | [API de Metadatos y SEO en el App Router ▶](../02-metadata-seo.md) |
