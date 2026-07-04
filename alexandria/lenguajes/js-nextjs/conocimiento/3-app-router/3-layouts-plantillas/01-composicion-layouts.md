# Composición de Layouts

## Concepto

En el App Router, los layouts se componen automáticamente según la jerarquía de carpetas. Cada segmento de ruta puede tener un `layout.tsx` que envuelve a las páginas y layouts hijos. El resultado es un árbol de componentes que se mantiene persistente a lo largo de la navegación dentro de la misma rama.

## Anidamiento automático

```
app/
  layout.js           → ① Root Layout
  dashboard/
    layout.js         → ② Dashboard Layout
    settings/
      layout.js       → ③ Settings Layout
      page.js         → ④ Settings Page
```

Para la ruta `/dashboard/settings`, el árbol es:
```
<RootLayout>
  <DashboardLayout>
    <SettingsLayout>
      <SettingsPage />
    </SettingsLayout>
  </DashboardLayout>
</RootLayout>
```

- El layout raíz envuelve todo.
- Los layouts anidados se convierten en hijos uno dentro del otro.
- Las páginas son siempre la hoja más interna del segmento.

## Props `children` y `params`

- **`children`**: El contenido que proviene del segmento hijo. En el layout `dashboard/layout.js`, `children` será el resultado de renderizar `settings/layout.js` (que a su vez envuelve a `page.js`).
- **`params`**: Los parámetros dinámicos correspondientes al segmento donde reside el layout. En `app/dashboard/[team]/layout.tsx`, `params` contendrá `{ team: string }`. No recibe parámetros de segmentos superiores o inferiores.

```tsx
// app/dashboard/[team]/layout.tsx
export default async function TeamLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ team: string }>
}) {
  const { team } = await params
  return (
    <section>
      <h2>Equipo: {team}</h2>
      {children}
    </section>
  )
}
```

## Renderizado y persistencia

Cuando se navega entre páginas que comparten el mismo layout intermedio, **ese layout no se vuelve a renderizar ni pierde su estado**. Por ejemplo, al ir de `/dashboard/team-a/settings` a `/dashboard/team-a/analytics`, el `TeamLayout` se mantiene montado, solo cambia el contenido interno.

Si el cambio de ruta implica que un layout quede fuera de la nueva jerarquía (por ejemplo, navegar desde `/dashboard/settings` a `/about`), ese layout se desmonta y, al volver, se monta de nuevo con estado fresco.

## Obtención de datos en layouts

Los layouts son Server Components por defecto, por lo que pueden obtener datos directamente con `fetch` o consultas a bases de datos.

```tsx
export default async function DashboardLayout({ children }) {
  const user = await getCurrentUser()
  return (
    <div>
      <nav>{user.name}</nav>
      <main>{children}</main>
    </div>
  )
}
```

- Los datos se cachean según las reglas de caché de Next.js.
- Si el layout se revalida (ISR), la regeneración ocurre en segundo plano mientras se sigue sirviendo la versión anterior.
- Los layouts pueden exportar configuraciones como `revalidate` o `dynamic` para controlar su comportamiento.

## Flujo de configuración y herencia

Configuraciones como `revalidate`, `dynamic`, `fetchCache`, `runtime` pueden ser exportadas desde cualquier layout o página. La configuración más cercana a la hoja (página) tiene prioridad. Si una página no exporta `revalidate`, hereda la del layout padre más cercano.

## Propagación de errores

Si un layout lanza un error, este se propaga hacia arriba. Los `error.js` de segmentos hijos **no** capturan errores del layout del propio segmento. El error solo es capturado por un `error.js` de un layout padre o, en última instancia, por `global-error.js`.

## Comunicación entre layouts

No hay un mecanismo directo para pasar datos de un layout a otro. Si un layout necesita información de un segmento superior (por ejemplo, el equipo actual), puede:

- Leer `params` desde su propia ubicación (si el parámetro está en su segmento).
- Usar `cookies()` o `headers()` (dinámico) para leer información de la petición.
- Emplear un proveedor de contexto (Client Component) si la información es de cliente.
- Re‑fetch los datos en cada layout donde se necesiten, aprovechando la deduplicación automática de `fetch`.

## Recomendaciones

- Mantén los layouts ligeros; evita lógica pesada que ralentice la carga de toda una sección.
- Centraliza configuraciones (`revalidate`, etc.) en el layout más alto posible, y sobreescríbelas solo donde sea necesario.
- Si un layout es muy complejo, considera dividirlo en componentes más pequeños.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Configuración de Segmento](../03-configuracion-segmento.md) | [🏠 Inicio](../../index.md) | [Layouts vs. Templates ▶](02-layout-vs-template.md) |
