# Nested routes

## Definición de rutas anidadas

Las rutas anidadas permiten organizar la interfaz y la lógica en jerarquías. En el Pages Router, se logran creando subcarpetas dentro de `pages/`. Cada carpeta representa un segmento de la URL.

## Estructura de ejemplo

```
pages/
├── index.js                → /
├── blog/
│   ├── index.js            → /blog
│   ├── [slug].js           → /blog/:slug
│   └── categories/
│       └── [category].js   → /blog/categories/:category
├── dashboard/
│   ├── index.js            → /dashboard
│   └── settings.js         → /dashboard/settings
```

Esta organización es puramente para el enrutamiento; no proporciona layouts anidados como en el App Router. Cada página es un componente independiente que se renderiza en el área de contenido.

## Implementación de layouts con rutas anidadas

El Pages Router no tiene layouts anidados nativos. Para compartir una estructura común entre varias páginas anidadas, se debe usar un componente Layout y envolver cada página o usar el patrón "per‑page layout" con `_app`.

### Patrón 1: Layout estático en cada página

```javascript
// pages/dashboard/index.js
import DashboardLayout from '../../components/DashboardLayout'

export default function DashboardHome() {
  return <DashboardLayout>Contenido del dashboard</DashboardLayout>
}

// pages/dashboard/settings.js
import DashboardLayout from '../../components/DashboardLayout'

export default function Settings() {
  return <DashboardLayout>Configuración</DashboardLayout>
}
```

Esto repite el layout en cada archivo. No es ideal.

### Patrón 2: Layout compartido mediante `_app` con función `getLayout`

```javascript
// pages/_app.js
export default function MyApp({ Component, pageProps }) {
  const getLayout = Component.getLayout || ((page) => page)
  return getLayout(<Component {...pageProps} />)
}
```

Luego, en todas las páginas de dashboard definimos la misma función:

```javascript
// pages/dashboard/index.js
import DashboardLayout from '../../components/DashboardLayout'

const DashboardHome = () => <div>Home</div>
DashboardHome.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>
export default DashboardHome
```

Si se quiere un layout global que envuelva toda la aplicación, se puede poner en `_app` directamente. Pero las rutas anidadas requieren composición manual.

## Navegación entre rutas anidadas

Se usa `next/link` o `useRouter` con rutas absolutas o relativas. No hay concepto de rutas relativas a la carpeta actual; siempre se especifica la ruta completa.

```jsx
// Dentro de /dashboard/index.js
<Link href="/dashboard/settings">Ir a configuración</Link>
```

## Consideraciones sobre rutas dinámicas en anidación

Las rutas anidadas pueden incluir segmentos dinámicos y estáticos libremente:

```
pages/
└── products/
    └── [category]/
        ├── index.js        → /products/:category
        └── [product].js    → /products/:category/:product
```

Los parámetros se acumulan: en `[product].js`, `params` será `{ category: '...', product: '...' }`.

## Limitaciones

- No hay persistencia del layout: al navegar de `/dashboard/index` a `/dashboard/settings`, el componente `DashboardLayout` se monta y desmonta completamente, perdiendo su estado interno (a menos que se maneje con state lifting en `_app`).
- No hay `loading.js` ni `error.js` específicos de segmento; todo debe manejarse manualmente con estados locales o Suspense (en el lado del cliente).
- El enrutamiento anidado es plano desde la perspectiva de Next.js; la anidación de carpetas solo afecta a la URL, no a la composición de componentes.

## Alternativa: App Router

Para proyectos nuevos, se recomienda migrar al App Router, que sí ofrece layouts anidados, carga y errores por segmento, y una experiencia más cercana a la jerarquía visual.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Rutas estaticas dinamicas](01-rutas-estaticas-dinamicas.md) | [🏠 Inicio](../../index.md) | [Shallow routing ▶](03-shallow-routing.md) |
