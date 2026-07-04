# Jest y React Testing Library

## Jest: el motor de pruebas
Jest es un framework de pruebas completo (test runner, aserciones, mocks, cobertura) adoptado por la comunidad React. Se configura automáticamente con Create React App y Vite (con `@vitejs/plugin-react` + `vitest` como alternativa, aunque el ecosistema de Jest sigue siendo el estándar en documentación y ejemplos). Vitest es una alternativa moderna, compatible con la API de Jest y más rápida en entornos Vite, pero aquí nos centraremos en los conceptos comunes a ambos.

**Configuración básica:**
- `jest.config.js` define el entorno (`jsdom`), los transformadores (Babel o SWC), y el mapeo de módulos.
- Ficheros `*.test.{js,tsx}` o `*.spec.{js,tsx}`.

## React Testing Library (RTL)
Es una biblioteca de utilidades para probar componentes React centrada en el **comportamiento del usuario**, no en los detalles de implementación. Su lema: _"Cuanto más se parezcan tus pruebas a la forma en que se usa el software, más confianza pueden darte."_

**Principios:**
- Renderiza componentes en un DOM virtual (jsdom).
- Consulta elementos por rol, etiqueta, texto (similar a como un usuario o lector de pantalla los encontraría).
- Interactúa con ellos mediante eventos simulados (`fireEvent` o `userEvent`).
- Verifica el resultado en el DOM.

**API esencial:**
- `render(ui)` – monta el componente y devuelve utilidades (`...queries`, `rerender`, `unmount`, `container`).
- `screen` – objeto global para consultas.
- `cleanup()` – desmonta después de cada test (automático en Jest con `afterEach`).
- Queries: `getByRole`, `getByLabelText`, `getByPlaceholderText`, `getByText`, `getByDisplayValue`, `getByTestId`, etc. Variantes: `getAllBy`, `queryBy`, `findBy`.
- `fireEvent` – despacho de eventos síncrono.
- `userEvent` (de `@testing-library/user-event`) – simula interacciones reales (click, type, keyboard) de manera más fiel, con eventos asíncronos y secuenciales.

**Patrón de una prueba:**
1. Renderizar (`render(<Component />)`).
2. Actuar (`userEvent.click(button)`).
3. Afirmar (`expect(screen.getByText('Éxito')).toBeInTheDocument()`).

**Ejemplo:**
```jsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginForm from './LoginForm';

test('muestra error si el email está vacío', async () => {
  render(<LoginForm />);
  await userEvent.click(screen.getByRole('button', { name: /iniciar sesión/i }));
  expect(screen.getByText(/el email es requerido/i)).toBeInTheDocument();
});
```

## Elección de consultas (prioridad)
La documentación oficial recomienda un orden de preferencia:
1. **`getByRole`**: la más deseable, refleja accesibilidad y estructura semántica.
2. **`getByLabelText`**: excelente para formularios.
3. **`getByPlaceholderText`**: aceptable si no hay label.
4. **`getByText`**: para contenido textual visible.
5. **`getByDisplayValue`**: para inputs con valor.
6. **`getByAltText`**: para imágenes.
7. **`getByTitle`**: no recomendado (inaccesible).
8. **`getByTestId`**: último recurso; usar `data-testid` cuando nada más funcione.

## `userEvent` vs `fireEvent`
`fireEvent` despacha un evento concreto (`click`, `change`). `userEvent` simula la secuencia completa de eventos que un usuario real desencadena. Por ejemplo, `userEvent.type(input, 'Hola')` dispara `focus`, `keyDown`, `keyPress`, `input`, `keyUp` por cada tecla, y aplica los cambios al input de manera asíncrona. **Siempre prefiere `userEvent`**; `fireEvent` se reserva para casos donde necesitas control absoluto.

## Mocks con Jest
Para aislar componentes, se mockean módulos, funciones o APIs:
- `jest.mock('./ruta')` – mockea un módulo completo.
- `jest.fn()` – crea una función espía.
- `jest.spyOn()` – observa métodos de objetos.
- Mock de peticiones: se puede mockear `fetch` o usar MSW (Mock Service Worker) para interceptar a nivel de red, permitiendo probar el flujo completo.

**MSW (recomendado):** se configura un servidor en las pruebas y se definen handlers. El componente realiza fetch reales que son interceptados, lo que prueba la integración completa sin depender de un backend.

## Async testing
Cuando el componente contiene operaciones asíncronas (fetch, useEffect con promesas), usa `findBy*` queries que retornan una promesa y esperan hasta que el elemento aparezca. Alternativamente, `waitFor` para afirmaciones asíncronas.

```jsx
test('carga y muestra posts', async () => {
  render(<Posts />);
  expect(screen.getByText(/cargando/i)).toBeInTheDocument();
  const post = await screen.findByText(/título del post/i);
  expect(post).toBeInTheDocument();
});
```

## Renderizado de componentes con Providers
Envuelve el componente en los Providers necesarios (Context, Router, Redux) creando un wrapper reutilizable:

```jsx
function renderWithProviders(ui, { preloadedState, store } = {}) {
  const testStore = store || configureStore({ reducer: rootReducer, preloadedState });
  return render(
    <Provider store={testStore}>
      <MemoryRouter>
        {ui}
      </MemoryRouter>
    </Provider>
  );
}
```

## Cobertura de código
Jest genera informes de cobertura con `--coverage`. No debe ser el único criterio, sino una herramienta para detectar código no probado que pueda ser riesgoso.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Tailwind CSS en React](../15-estilos/03-tailwind-css-en-react.md) | [🏠 Inicio](../index.md) | [Testing de Hooks ▶](02-testing-de-hooks.md) |
