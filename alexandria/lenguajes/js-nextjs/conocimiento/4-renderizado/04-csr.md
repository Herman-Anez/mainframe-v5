# Client‑Side Rendering (CSR)

## Concepto

El Client‑Side Rendering es el modelo tradicional de React antes de Next.js: el servidor envía un HTML vacío (o casi vacío) y el JavaScript del cliente se encarga de renderizar la interfaz y obtener los datos. En Next.js, el CSR se puede emplear de forma complementaria para partes interactivas que no requieren SEO o que dependen completamente del usuario.

## ¿Cómo se implementa en Next.js?

No hay una función específica como `getServerSideProps`. Se utilizan **Client Components** con `useEffect` y `useState` para obtener datos después de la hidratación.

```tsx
'use client'
import { useState, useEffect } from 'react'

export default function ClientPage() {
  const [data, setData] = useState(null)

  useEffect(() => {
    fetch('/api/data')
      .then(res => res.json())
      .then(setData)
  }, [])

  if (!data) return <div>Cargando...</div>
  return <div>{data.content}</div>
}
```

## CSR en App Router vs Pages Router

- En ambos, el componente se convierte en un Client Component (en App Router se añade `'use client'`; en Pages Router todo componente puede tener estado).
- Los datos no están presentes en el HTML inicial, por lo que los motores de búsqueda pueden no ver el contenido a menos que se renderice también en el servidor.

## Herramientas para CSR en Next.js

Next.js recomienda usar librerías como **SWR** (creada por el equipo de Next.js) o **React Query** para gestionar el fetching en cliente de manera eficiente, con caché, revalidación y estados de carga.

```tsx
import useSWR from 'swr'

export default function Profile() {
  const { data, error } = useSWR('/api/user', fetcher)
  if (error) return <div>Error</div>
  if (!data) return <div>Cargando...</div>
  return <div>Hola {data.name}</div>
}
```

## Ventajas del CSR

- **Interactividad inmediata después de la carga**: una vez que el JS se ejecuta, las transiciones son rápidas (SPA).
- **Menor carga en el servidor**: las peticiones de datos son desde el navegador, no desde el servidor Next.js.
- **Adecuado para dashboards muy interactivos**, donde el SEO no es relevante.

## Desventajas del CSR

- **SEO deficiente**: el HTML inicial carece de contenido, afectando a crawlers.
- **Peor rendimiento percibido**: el usuario ve un spinner hasta que se obtienen los datos y se renderiza.
- **Tiempo de interacción más largo** (TTI) porque hay que descargar, parsear y ejecutar JavaScript.

## Cuándo usar CSR

- Secciones privadas (dashboard) tras autenticación.
- Componentes que necesitan datos del navegador (geolocalización, WebSocket).
- Actualizaciones en tiempo real que no necesitan indexación.
- En combinación con SSR: la página se renderiza con datos iniciales en el servidor (para SEO) y luego el cliente actualiza bajo demanda con CSR.

## Combinación con SSR/SSG

Es común usar un enfoque híbrido: el servidor renderiza la shell y los datos iniciales, y el cliente refresca o añade interactividad. En App Router, los Server Components proporcionan los datos estáticos, y los Client Components añaden interactividad.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Incremental Static Regeneration (ISR)](03-isr.md) | [🏠 Inicio](../index.md) | [Streaming con Suspense ▶](05-streaming-suspense.md) |
