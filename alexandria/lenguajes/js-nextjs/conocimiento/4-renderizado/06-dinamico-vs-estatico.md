# Renderizado Dinámico vs Estático

## Concepto

En Next.js, cada página y layout puede ser **estático** (generado en tiempo de construcción o revalidado en segundo plano) o **dinámico** (generado en cada petición). La decisión afecta el rendimiento, la frescura de los datos y los recursos del servidor.

## ¿Cómo determina Next.js si una página es dinámica o estática?

Next.js realiza un análisis estático del código para identificar el uso de funciones o patrones que requieren información de la petición. Si no encuentra ninguno, la página es **estática por defecto** (incluso si incluye `fetch` con `force-cache`).

### Funciones que convierten una ruta en dinámica:

- `cookies()` y `headers()` de `next/headers`
- `searchParams` (la prop de página, ahora una promesa)
- `noStore()` de `next/cache`
- Uso de `connection()` (Dynamic IO experimental)
- `draftMode()`
- `fetch` con `cache: 'no-store'`
- Exportación de `dynamic = 'force-dynamic'`

Si la página no utiliza ninguna de ellas, se considera estática y se puede generar en el build (SSG) o cachear con ISR.

## Control explícito con la exportación `dynamic`

Se puede forzar el comportamiento:

```tsx
export const dynamic = 'auto'           // predeterminado: Next.js decide
export const dynamic = 'force-dynamic'  // siempre SSR
export const dynamic = 'force-static'   // siempre estático (error si se usan funciones dinámicas)
```

## Características del renderizado estático

- HTML generado en el build o bajo demanda (con ISR) y servido desde caché.
- **Rendimiento muy alto** (CDN, baja latencia).
- **Escalabilidad**: no consume servidor por petición.
- **Ideal para contenido público** que no cambia por usuario.
- Puede combinarse con ISR para actualizaciones periódicas o bajo demanda.

## Características del renderizado dinámico

- HTML generado en cada solicitud en el servidor.
- **Datos frescos y personalizados**: cookies, headers, parámetros de consulta.
- **Mayor latencia** y consumo de CPU en el servidor.
- **Menos cacheable** (salvo que se configuren cabeceras de CDN).
- **Ideal para dashboards, páginas de cuenta, carritos de compra**, etc.

## Cuándo usar cada uno

| Criterio                  | Estático (SSG/ISR)        | Dinámico (SSR)               |
|---------------------------|---------------------------|------------------------------|
| Frecuencia de cambio      | Baja (horas, días)        | Alta (segundos, por petición)|
| Personalización           | Igual para todos          | Por usuario (cookies, sesión)|
| Rendimiento               | Máximo                    | Bueno, pero depende del servidor |
| SEO                       | Excelente                 | Excelente (contenido presente)|
| Escalabilidad             | Muy alta                  | Requiere más recursos        |

## Estrategia híbrida

En una misma aplicación se pueden mezclar páginas estáticas y dinámicas. Además, dentro de una página dinámica se pueden envolver partes estáticas con `<Suspense>` y `fetch` cacheado para optimizar lo máximo posible.

## Transición entre estático y dinámico

Es común empezar con una página estática y, cuando se necesita personalización, pasar a dinámica. Gracias al análisis automático, basta con usar `cookies()` o `noStore()` y la página se convierte en SSR sin más configuración.

## Consideraciones sobre la caché de datos

- En páginas estáticas, `fetch` con `force-cache` (por defecto) cachea los datos permanentemente (a menos que se revalide).
- En páginas dinámicas, `fetch` puede seguir cacheando si se especifica `force-cache` (la página se renderiza en cada petición pero los datos del fetch se obtienen de caché). Esto puede ser útil para reducir latencia en SSR.
- `noStore()` desactiva toda la caché de datos para esa página.

## Buenas prácticas

- Comienza siempre con la opción estática. Introduce dinamismo solo cuando sea estrictamente necesario.
- Aísla las partes dinámicas en componentes con `Suspense` para no penalizar toda la página.
- Usa `revalidate` y On‑Demand ISR para mantener el contenido actualizado sin perder las ventajas del estático.
- Monitoriza el rendimiento: si una página es dinámica pero no cambia por petición, quizás puedas convertirla a estática con ISR.

Con esta profundización, se tiene una visión completa de las estrategias de renderizado disponibles en Next.js, desde la generación estática pura hasta el streaming más avanzado, permitiendo elegir la combinación óptima para cada parte de la aplicación.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Streaming con Suspense](05-streaming-suspense.md) | [🏠 Inicio](../index.md) | [React Server Components en Next.js ▶](../5-server-client-components/01-conceptos-server-components.md) |
