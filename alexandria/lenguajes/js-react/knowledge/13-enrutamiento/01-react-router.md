# React Router

React Router es la biblioteca de enrutamiento declarativo más utilizada en el ecosistema React. A partir de la versión 6, su API se simplificó drásticamente basándose en hooks y componentes con una mentalidad de "enrutamiento por configuración" pero manteniendo la composición.

## Componentes principales (v6+)

### BrowserRouter (o HashRouter, MemoryRouter)
Es el envoltorio raíz que proporciona el contexto de enrutamiento a toda la aplicación. Usa la API History del navegador para sincronizar la URL con la interfaz.

```jsx
import { BrowserRouter } from 'react-router-dom';
createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
```
- **BrowserRouter**: URLs limpias (`/perfil`). Requiere configuración del servidor para que redirija todas las rutas al `index.html`.
- **HashRouter**: URLs con `#` (`/#/perfil`). No necesita configuración de servidor, útil para alojamiento estático.
- **MemoryRouter**: mantiene el historial en memoria, para pruebas o entornos sin navegador.

### Routes y Route
`Routes` reemplaza al antiguo `Switch` de v5. Dentro de `Routes`, se colocan los `Route` que definen la correspondencia entre rutas y componentes.

```jsx
import { Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Inicio />} />
      <Route path="/acerca" element={<Acerca />} />
      <Route path="/productos/:id" element={<Producto />} />
      <Route path="*" element={<NoEncontrada />} />
    </Routes>
  );
}
```

- La coincidencia de rutas es ahora **exacta por defecto** (ya no se usa `exact`).
- El orden sigue importando: la primera ruta que coincide gana.
- `path="*"` captura cualquier URL no coincidente (404).
- `element` recibe el JSX del componente que se renderizará.

### Link y NavLink
Para la navegación sin recargar la página se usa `Link`. `NavLink` añade la capacidad de aplicar clases o estilos cuando la ruta está activa.

```jsx
<Link to="/acerca">Ir a Acerca</Link>
<NavLink to="/productos" className={({ isActive }) => isActive ? 'active' : ''}>
  Productos
</NavLink>
```

## Hooks de enrutamiento
La API se basa en hooks, eliminando la necesidad de componentes de orden superior como `withRouter`.

- **`useNavigate()`**: devuelve una función para navegar imperativamente.
  ```jsx
  const navigate = useNavigate();
  navigate('/perfil', { replace: true, state: { desde: 'login' } });
  ```
- **`useParams()`**: devuelve un objeto con los parámetros dinámicos de la URL.
  ```jsx
  // Ruta: /productos/:id
  const { id } = useParams();
  ```
- **`useLocation()`**: devuelve el objeto location actual (pathname, search, hash, state).
  ```jsx
  const location = useLocation();
  // location.state contiene datos pasados por Link o navigate
  ```
- **`useSearchParams()`**: similar a `useState` pero para los query strings.
  ```jsx
  const [searchParams, setSearchParams] = useSearchParams();
  const categoria = searchParams.get('categoria');
  setSearchParams({ categoria: 'electronica' });
  ```
- **`useMatch(pattern)`**: comprueba si la ubicación actual coincide con un patrón. Útil fuera de `<Routes>`.
- **`useRoutes(routes)`**: alternativa funcional para definir rutas como objetos JavaScript en lugar de JSX.

## Rutas anidadas y Outlet
React Router v6 permite anidar rutas para componer interfaces con sub-vistas. Se define un `Route` padre que tiene hijos, y en el componente del padre se incluye `<Outlet />`, que es un marcador donde se renderizará el componente hijo correspondiente.

```jsx
<Routes>
  <Route path="/dashboard" element={<Dashboard />}>
    <Route index element={<Resumen />} />
    <Route path="estadisticas" element={<Estadisticas />} />
    <Route path="configuracion" element={<Configuracion />} />
  </Route>
</Routes>

function Dashboard() {
  return (
    <div>
      <Sidebar />
      <main>
        <Outlet /> {/* Aquí se mostrará Resumen, Estadisticas o Configuracion */}
      </main>
    </div>
  );
}
```

- **Index routes** (`index`): se muestran cuando la ruta del padre coincide exactamente (en el ejemplo, `/dashboard` muestra `Resumen`).
- Las rutas anidadas pueden heredar layouts y seguir anidando.

## Rutas relativas y enlaces
Dentro de rutas anidadas, los paths de los `Route` hijos son **relativos** al padre. Los `Link` y `useNavigate` también pueden usar rutas relativas.

```jsx
<Link to="estadisticas">Estadísticas</Link> // relativo a /dashboard
<Link to="..">Volver</Link> // sube un nivel
```

## Enrutamiento con objetos (useRoutes)
En lugar de JSX, puedes definir la configuración en un array de objetos y pasarlo a `useRoutes`:

```jsx
const routes = [
  { path: '/', element: <Inicio /> },
  {
    path: '/dashboard',
    element: <Dashboard />,
    children: [
      { index: true, element: <Resumen /> },
      { path: 'estadisticas', element: <Estadisticas /> },
    ],
  },
  { path: '*', element: <NoEncontrada /> },
];

function App() {
  return useRoutes(routes);
}
```

Esto es útil para generación dinámica o integración con TypeScript.

## Navegación programática y estado
`navigate(to, options)` acepta un segundo argumento con:
- `replace`: si `true`, reemplaza la entrada actual en el historial.
- `state`: cualquier dato serializable que se puede recuperar con `useLocation().state`.
- `relative`: `"route"` o `"path"` para controlar la forma de resolución relativa.

## Scroll Restoration
React Router no restaura la posición de scroll por defecto. Se puede implementar con un efecto que reaccione a cambios de ruta y use `window.scrollTo(0, 0)`, o con librerías complementarias.

## React Router 6.4+ (Data Router)
A partir de 6.4, se introdujeron los **data routers** (`createBrowserRouter`, `createHashRouter`) y la capacidad de definir **loaders** y **actions** en las rutas, inspirados en Remix. Esto permite cargar datos antes de renderizar y manejar envíos de formularios sin necesidad de efectos manuales.

```jsx
const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    errorElement: <ErrorPage />,
    loader: rootLoader,
    children: [
      { index: true, element: <Inicio /> },
      {
        path: 'producto/:id',
        element: <Producto />,
        loader: productoLoader,
        action: productoAction,
      },
    ],
  },
]);

// En main.jsx
<RouterProvider router={router} />
```

Los hooks asociados son `useLoaderData()`, `useActionData()`, `useFetcher()`, etc. Representan una forma más completa de gestionar datos y navegación que puede simplificar la aplicación al eliminar estados de carga/error genéricos.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ React Server Components (RSC)](../12-react-18-y-concurrent-mode/05-react-server-components-rsc.md) | [🏠 Inicio](../index.md) | [Rutas protegidas y layouts ▶](02-rutas-protegidas-y-layouts.md) |
