# Dynamic IO (Experimental)

## 1. ¿Qué es Dynamic IO?

**Dynamic IO** es un conjunto de APIs experimentales introducidas en Next.js 15 (bajo la bandera `experimental.dynamicIO`) que permiten **controlar de manera explícita y granular la caché de datos y el comportamiento dinámico**. Responde a la necesidad de manejar datos que cambian frecuentemente sin tener que volver dinámica toda una página. Es una evolución sobre el modelo actual de "auto" (análisis estático) y opciones de `fetch`.

Las funciones clave son:

- **`connection()`**: declara que un componente depende de una conexión a una base de datos o sistema externo que puede cambiar. Permite que Next.js decida si debe re‑renderizar o no.
- **`useCacheStatus()`**: hook (experimental) que informa si los datos se están leyendo de la caché o se están revalidando.
- **`unstable_cache` mejorado**: nuevas posibilidades de control sobre la caché en tiempo de ejecución.

## 2. Activación

En `next.config.js`:

```javascript
module.exports = {
  experimental: {
    dynamicIO: true,
  },
}
```

## 3. Función `connection()`

Se importa de `next/connection` (o `next/cache` en versiones tempranas). Permite **marcar un punto de dependencia externa**. Cuando se ejecuta, Next.js puede decidir regenerar una página estática si la conexión subyacente ha cambiado.

Ejemplo básico:

```tsx
import { connection } from 'next/connection'
import { db } from '@/lib/db'

export async function getCachedProducts() {
  const conn = connection() // marca la dependencia
  return db.product.findMany() // consulta a BD
}
```

`connection()` devuelve un token que vincula la caché a ese punto. Si el sistema subyacente notifica un cambio (por ejemplo, mediante un webhook que invalida la conexión), Next.js puede regenerar solo los componentes que dependen de ella.

Esto reemplaza el uso de `fetch` con tags para bases de datos, ya que muchas aplicaciones no usan `fetch` para obtener datos internos.

## 4. `useCacheStatus()`

Hook de React (experimental) que permite saber si los datos que está consumiendo un componente provienen de la caché o están siendo generados por primera vez. Útil para mostrar indicadores de "contenido fresco" o "cargando desde caché".

```tsx
import { useCacheStatus } from 'next/cache'

export function StatusIndicator() {
  const status = useCacheStatus() // 'hit' | 'miss' | 'stale'
  return <span>{status === 'stale' ? 'Actualizando...' : ''}</span>
}
```

## 5. Mejoras en `unstable_cache`

Con Dynamic IO, `unstable_cache` admite opciones más avanzadas, como dependencias externas y revalidación basada en eventos.

## 6. Flujo de trabajo con Dynamic IO

1. Define tus fuentes de datos con `connection()`.
2. Envuelve operaciones de BD o API con `unstable_cache`.
3. Cuando el backend cambia (por ejemplo, un CMS envía un webhook), invalida la conexión con `revalidateConnection(token)` (API pendiente de estabilización).
4. Next.js regenera en segundo plano solo las partes afectadas, manteniendo el resto estático.

## 7. Beneficios

- Elimina la necesidad de convertir páginas enteras a dinámicas solo porque un pequeño bloque usa `noStore()`.
- Permite **caché de grano fino** sin depender de URLs de `fetch`.
- Facilita la integración con bases de datos tradicionales, ORMs y sistemas de archivos.

## 8. Estado actual

Es muy experimental. La API puede cambiar radicalmente. Solo se recomienda para exploración y feedback. No debe usarse en producción hasta que sea estable.

## 9. Buenas prácticas

- Mantente al tanto de las RFCs y discusiones en el repositorio de Next.js.
- Experimenta en un proyecto aislado.
- No combines con PPR sin entender las implicaciones; ambas características aún están en evolución.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Partial Prerendering (PPR)](02-partial-prerendering.md) | [🏠 Inicio](../index.md) | [Internals de React Server Components ▶](04-internals-rsc.md) |
