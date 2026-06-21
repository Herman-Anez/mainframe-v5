# Rutas protegidas y layouts

Un sistema de enrutamiento real necesita controlar el acceso según autenticación y roles, así como mantener layouts persistentes entre rutas. Aquí se explican los patrones más sólidos.

## Layouts persistentes
Un layout es un componente que envuelve la interfaz común (cabecera, barra lateral, pie) y delega el contenido dinámico a un `<Outlet />`. Las rutas anidadas de React Router lo hacen natural.

```jsx
<Routes>
  <Route element={<LayoutPublico />}>
    <Route path="/" element={<Inicio />} />
    <Route path="/login" element={<Login />} />
  </Route>
  <Route element={<LayoutPrivado />}>
    <Route path="/dashboard" element={<Dashboard />} />
    <Route path="/perfil" element={<Perfil />} />
  </Route>
</Routes>
```

Definimos `LayoutPublico` y `LayoutPrivado` como componentes que devuelven `{<Header />}{<Outlet />}{<Footer />}`. De esta forma, los layouts se mantienen y no se desmontan al navegar entre rutas del mismo grupo.

## Rutas protegidas (Protected Routes)
Para restringir el acceso a ciertas rutas basado en autenticación o roles, creamos un componente `ProtectedRoute` que envuelve las rutas privadas.

**Enfoque 1: Componente envolvente**
```jsx
function ProtectedRoute({ children }) {
  const { usuario } = useAuth();

  if (!usuario) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}
```
Uso:
```jsx
<Route path="/dashboard" element={
  <ProtectedRoute>
    <Dashboard />
  </ProtectedRoute>
} />
```

**Enfoque 2: Layout protector** (más limpio en rutas anidadas)
```jsx
function LayoutPrivado() {
  const { usuario } = useAuth();

  if (!usuario) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div>
      <HeaderPrivado />
      <Outlet />
    </div>
  );
}

// Configuración
<Route element={<LayoutPrivado />}>
  <Route path="/dashboard" element={<Dashboard />} />
  <Route path="/perfil" element={<Perfil />} />
</Route>
```
Todos los hijos heredan la protección automáticamente.

## Redirección tras login (Return URL)
Para devolver al usuario a la página que intentaba visitar antes de autenticarse, se guarda la ubicación en el estado de navegación.

```jsx
// En ProtectedRoute o LayoutPrivado
const location = useLocation();
if (!usuario) {
  return <Navigate to="/login" state={{ from: location }} replace />;
}

// En la página de Login, tras autenticación exitosa:
const navigate = useNavigate();
const location = useLocation();
const from = location.state?.from?.pathname || '/dashboard';
navigate(from, { replace: true });
```

## Protección basada en roles
Se extiende el patrón para verificar permisos:

```jsx
function RequireRol({ rol, children }) {
  const { usuario } = useAuth();
  if (!usuario) return <Navigate to="/login" replace />;
  if (usuario.rol !== rol) return <Navigate to="/no-autorizado" replace />;
  return children;
}
```
O se integra en el layout verificando el rol directamente.

## Rutas anidadas con múltiples niveles de protección
Es posible anidar layouts protectores:

```jsx
<Route element={<LayoutPublico />}>
  <Route path="/" element={<Inicio />} />
</Route>
<Route element={<LayoutPrivado />}>   {/* requiere login */}
  <Route path="/dashboard" element={<Dashboard />} />
  <Route element={<RequireAdmin />}>  {/* requiere rol admin */}
    <Route path="/admin" element={<AdminPanel />} />
  </Route>
</Route>
```

## Manejo de errores en rutas (Error Boundaries)
React Router v6.4+ introduce `errorElement` en la configuración de rutas, que captura errores lanzados por loaders, actions o el propio componente, y renderiza una UI de error sin desmontar el resto de la aplicación.

Para versiones anteriores o para errores de renderizado, se puede envolver la ruta en un Error Boundary de React.

```jsx
<Route
  path="/dashboard"
  element={
    <ErrorBoundary fallback={<ErrorPage />}>
      <Dashboard />
    </ErrorBoundary>
  }
/>
```

## Carga perezosa de rutas (Code splitting)
React Router soporta `React.lazy` directamente:

```jsx
const Dashboard = React.lazy(() => import('./Dashboard'));
<Route path="/dashboard" element={
  <Suspense fallback={<Cargando />}>
    <Dashboard />
  </Suspense>
} />
```

En data routers, se puede usar `lazy` en la definición de la ruta para diferir la carga de loaders y componentes.

## Consideraciones de autenticación con React Context
El estado de autenticación (`useAuth`) debe proporcionarse mediante Contexto, accesible desde los componentes protectores. Se puede almacenar el token en memoria, cookies o localStorage, y sincronizarlo con un estado global.

```jsx
function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  // Efecto para verificar sesión al cargar
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // validar token y setUsuario
    }
  }, []);

  const login = (credenciales) => { ... };
  const logout = () => { ... };

  return (
    <AuthContext.Provider value={{ usuario, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
```

## Resumen de buenas prácticas
- Organiza las rutas en módulos lógicos.
- Utiliza `Outlet` para layouts, no anides manualmente componentes.
- Centraliza la lógica de protección en pocos componentes, no repitas comprobaciones en cada ruta.
- Para formularios con carga, considera usar `actions` (React Router 6.4+) para simplificar el envío.
- Siempre redirige tras login a la ruta original usando `state`.
- Prueba la navegación con `MemoryRouter` y `render` de Testing Library.

---

El enrutamiento en React ha madurado hacia un sistema declarativo, anidable y centrado en hooks. Combinando React Router con los patrones de protección y layouts, puedes construir aplicaciones de cualquier escala con una navegación predecible, segura y mantenible.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ React Router](01-react-router.md) | [🏠 Inicio](../index.md) | [Context + `useReducer` ▶](../14-estado-global/01-context-usereducer.md) |
