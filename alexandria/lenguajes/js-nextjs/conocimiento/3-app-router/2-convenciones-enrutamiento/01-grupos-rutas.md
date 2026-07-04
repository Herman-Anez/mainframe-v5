# Grupos de Rutas

## Concepto

Los **grupos de rutas** permiten organizar segmentos del sistema de archivos **sin afectar la estructura de la URL**. Se definen encerrando el nombre de la carpeta entre paréntesis: `(nombre)`.

```
app/
  (marketing)/
    about/
      page.js       → URL: /about
    contact/
      page.js       → URL: /contact
  (shop)/
    products/
      page.js       → URL: /products
```

La carpeta `(marketing)` y `(shop)` no aparecen en la URL. Su único propósito es agrupar lógicamente rutas para compartir layouts, configuraciones o simplemente mantener el código organizado.

## Ventajas

1. **Múltiples Root Layouts**  
   Cada grupo puede tener su propio layout raíz, algo imposible sin grupos.

   ```tsx
   // app/(marketing)/layout.tsx
   export default function MarketingLayout({ children }) {
     return <div className="marketing">{children}</div>
   }
   
   // app/(shop)/layout.tsx
   export default function ShopLayout({ children }) {
     return <div className="shop">{children}</div>
   }
   ```
   La ruta `/about` usará `MarketingLayout`, mientras que `/products` usará `ShopLayout`.

2. **Organización limpia**  
   Facilita la separación de secciones (blog, dashboard, admin) sin que la URL refleje carpetas internas de desarrollo.

3. **Configuraciones por grupo**  
   Se pueden exportar variables como `revalidate` o `dynamic` desde el layout del grupo, afectando a todas sus páginas hijas.

## Comportamiento técnico

- Next.js ignora los segmentos entre paréntesis al mapear archivos a rutas.
- Si un grupo contiene un `page.js` en su raíz, esa página se asigna a la ruta base del grupo, es decir, la ruta resultante es la del padre. Por ejemplo, `app/(marketing)/page.js` → `/`.
- Los grupos no son rutas por sí mismos; no se puede navegar a `/(marketing)`, simplemente no existe.
- Se pueden anidar grupos, aunque no es común: `app/(a)/(b)/page.js` → la URL ignora ambos grupos.

## Grupos con rutas dinámicas y slots

Los grupos funcionan con cualquier otro convenio: pueden contener segmentos dinámicos, rutas paralelas, etc.

```
app/
  (app)/
    dashboard/
      @sidebar/
        default.js
        page.js
      layout.js
      page.js
```
La ruta `/dashboard` usará el layout dentro de `(app)`.

## Consideraciones

- Los nombres de grupo no deben ser únicos solo a nivel de sistema de archivos; no afectan la URL pero sí deben ser válidos como identificadores de carpeta (sin caracteres especiales).
- Si se necesita tener dos páginas `about.js` en diferentes grupos, ambas apuntarán a `/about`, lo que provocaría conflicto. No se pueden tener rutas duplicadas aunque estén en grupos distintos.
- No hay límite de grupos, pero conviene usarlos con moderación para no complicar la estructura.

## Casos de uso

- **Secciones con diseños radicalmente diferentes**: un front de marketing (mucha landing page) vs un panel de administración.
- **Proyectos multifuncionales**: e‑commerce con blog y tienda bajo diferentes identidades visuales.
- **Organización por equipos**: carpeta `(teamA)`, `(teamB)` mientras las rutas permanecen planas.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Streaming y Suspense en el App Router](../01-streaming-suspense.md) | [🏠 Inicio](../../index.md) | [Rutas Dinámicas en App Router ▶](02-dinamicas.md) |
