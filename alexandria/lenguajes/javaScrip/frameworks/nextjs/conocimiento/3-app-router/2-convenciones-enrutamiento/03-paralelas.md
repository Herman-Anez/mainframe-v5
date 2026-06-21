# Rutas Paralelas

## Definición

Las rutas paralelas permiten renderizar **múltiples páginas en la misma vista**, cada una en su propio "slot", definidos con carpetas cuyo nombre empieza con `@`.

```
app/
  layout.js
  @dashboard/
    page.js
  @notifications/
    page.js
  page.js          → página principal (children)
```

En el layout, las props incluyen el contenido de cada slot con el nombre de la carpeta (sin `@`). Se renderizan donde se desee.

```tsx
// app/layout.js
export default function RootLayout({ children, dashboard, notifications }) {
  return (
    <div>
      <main>{children}</main>
      <aside>{dashboard}</aside>
      <footer>{notifications}</footer>
    </div>
  )
}
```

## Navegación independiente

Cada slot puede navegar de forma independiente si se definen subpáginas dentro de la carpeta del slot. Por ejemplo:

```
app/
  @dashboard/
    page.js
    settings/
      page.js
  page.js
```

Al navegar a `/settings`, el slot `@dashboard` cambia su contenido a `@dashboard/settings/page.js`, mientras que el contenido principal (`children`) pasa a `app/settings/page.js` (que debe existir para la ruta). Si no existe `app/settings/page.js`, la ruta `/settings` sería un 404, incluso si el slot tiene contenido, porque la ruta principal debe ser resuelta por `children`.

## Archivo `default.js`

Si una ruta no tiene contenido específico para un slot, se mostrará el archivo `default.js` de ese slot (si existe). Si no, el slot quedará vacío o causará un error.

```tsx
// app/@dashboard/default.tsx
export default function DefaultDashboard() {
  return <p>Dashboard vacío</p>
}
```

Así, al visitar una ruta donde `@dashboard` no tiene `page.js`, se muestra este fallback. Si se quiere ocultar el slot, `default.tsx` puede retornar `null`.

## Uso común: Dashboards complejos

Una página de análisis puede tener múltiples paneles: gráfico principal, tabla de eventos, resumen. Cada panel vive en su propio slot, permitiendo actualizaciones independientes y composición limpia.

## Combinación con layouts por slot

Cada slot puede tener su propio `layout.js`, `error.js`, `loading.js`, etc., lo que permite granularidad total.

```
app/
  @dashboard/
    layout.js
    loading.js
    page.js
```

El layout del slot envuelve solo ese panel, no afecta al resto.

## Restricciones

- Las rutas paralelas son solo para segmentos dentro del mismo layout. No se pueden pasar datos entre slots directamente; deben usar un estado compartido (contexto) o URL.
- La ruta de la URL principal se determina por la carpeta `children` (es decir, los archivos `page.js` fuera de las carpetas `@`). Los slots no contribuyen a la URL, solo a la interfaz.
- No se puede navegar a un slot de forma aislada mediante `router.push('@dashboard/settings')`; siempre se navega a la ruta canónica (`/settings`), y el slot correspondiente cambia si tiene una página que coincida.

## Buenas prácticas

- Usa nombres de slot descriptivos.
- Siempre proporciona un `default.js` para cada slot que pueda estar vacío.
- Para actualizar un slot sin cambiar la ruta principal, utiliza `router.replace` o `router.push` a la misma ruta principal pero con alguna variación de parámetros que solo afecte al slot (si está diseñado así). En realidad, el cambio de slot requiere una navegación de ruta.
- Evalúa si las rutas paralelas son necesarias o si `<Suspense>` y componentes condicionales resuelven el problema más sencillamente.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Rutas Dinámicas en App Router](02-dinamicas.md) | [🏠 Inicio](../../index.md) | [Rutas Interceptadas ▶](04-interceptadas.md) |
