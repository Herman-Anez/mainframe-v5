# Pruebas Unitarias y de Integración

## 1. Estrategia general

En Next.js combinamos:

- **Jest** como framework de pruebas (ejecuta aserciones, mocking, coverage).
- **React Testing Library** para probar componentes React de forma similar a como los usa el usuario.
- **Jest + MSW** o **fetch mocking** para interceptar peticiones en pruebas de integración.

Con la llegada de los Server Components, también se pueden probar funciones del servidor de manera aislada (unit testing de lógica de negocio) y componentes de servidor mediante pruebas de integración que rendericen el árbol completo (usando `render` de `@testing-library/react` en un entorno simulado de servidor). Sin embargo, el ecosistema está evolucionando y la estrategia más sólida para componentes de servidor es probar la lógica que contienen (funciones asíncronas) y usar pruebas E2E para la interacción completa.

## 2. Configuración de Jest y React Testing Library

### Instalación

```bash
npm install -D jest @testing-library/react @testing-library/jest-dom jest-environment-jsdom
```

Para TypeScript:

```bash
npm install -D @types/jest ts-jest
```

### Configuración (`jest.config.js` o `jest.config.ts`)

```javascript
const nextJest = require('next/jest')

const createJestConfig = nextJest({ dir: './' })

const customJestConfig = {
  setupFilesAfterSetup: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1', // si usas alias
  },
}

module.exports = createJestConfig(customJestConfig)
```

- `next/jest` configura automáticamente los paths de Next.js, el manejo de CSS modules, imágenes, etc., para que los tests se ejecuten sin errores de importación.
- `setupFilesAfterSetup` carga `@testing-library/jest-dom` para tener matchers como `toBeInTheDocument()`.

### `jest.setup.js`

```javascript
import '@testing-library/jest-dom'
```

## 3. Pruebas unitarias de funciones

Cualquier función de utilidad, lógica de negocio o helper puede probarse con Jest directamente.

```typescript
// lib/math.ts
export function sum(a: number, b: number) {
  return a + b
}

// __tests__/math.test.ts
import { sum } from '@/lib/math'

test('suma dos números', () => {
  expect(sum(2, 3)).toBe(5)
})
```

Para funciones asíncronas que dependen de `fetch`, puedes mockear `fetch` globalmente o usar `jest.spyOn`.

## 4. Pruebas de Client Components

Los Client Components se prueban con React Testing Library simulando un navegador (JSDOM).

### Ejemplo: Componente Contador

```tsx
// components/Counter.tsx
'use client'
import { useState } from 'react'

export default function Counter() {
  const [count, setCount] = useState(0)
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  )
}
```

```tsx
// __tests__/Counter.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import Counter from '@/components/Counter'

test('incrementa el contador', () => {
  render(<Counter />)
  const button = screen.getByText('Increment')
  fireEvent.click(button)
  expect(screen.getByText('Count: 1')).toBeInTheDocument()
})
```

### Mocking de hooks y dependencias

Si el componente usa `useRouter` o `next/navigation`, podemos mockear el módulo:

```tsx
import { useRouter } from 'next/navigation'

jest.mock('next/navigation', () => ({
  useRouter: jest.fn().mockReturnValue({
    push: jest.fn(),
    back: jest.fn(),
  }),
  usePathname: jest.fn().mockReturnValue('/'),
}))
```

Para `next/image`, puedes mockearlo en el setup global:

```javascript
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props) => <img {...props} />,
}))
```

## 5. Pruebas de integración con Server Components

Probar un Server Component aislado que solo retorna JSX estático es simple: se puede importar y renderizar (sin hooks) en un entorno Node, pero para ello necesitas un entorno que pueda ejecutar JSX. Puedes usar `jest` con `transform` de ts‑jest y un entorno `node`. Sin embargo, el renderizado de Server Components con lógica asíncrona se presta más a pruebas de integración donde se evalúa el HTML generado.

La estrategia recomendada es **probar la lógica de obtención de datos** (funciones que hacen fetch, consultas a BD) y confiar en los tests E2E para la composición final. No obstante, puedes simular el renderizado con `ReactDOMServer.renderToString`:

```tsx
import { renderToString } from 'react-dom/server'
import MyServerComponent from '@/app/MyServerComponent'

test('renderiza datos correctamente', async () => {
  // Mockear fetch global
  global.fetch = jest.fn().mockResolvedValue({
    json: () => Promise.resolve({ name: 'Test' }),
  })
  const html = renderToString(<MyServerComponent />)
  expect(html).toContain('Test')
})
```

Esto funciona en un entorno Node (no jsdom). Para usar `renderToString` sin errores, el componente no debe importar módulos de cliente. Es un enfoque limitado pero útil para componentes de servidor puros.

## 6. Pruebas de integración con API Routes y Route Handlers

Puedes probar los endpoints de Next.js directamente invocando la función handler.

### Pages Router API Route

```javascript
// __tests__/api/hello.test.js
import handler from '@/pages/api/hello'

test('devuelve 200 con mensaje', async () => {
  const req = { method: 'GET' }
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  }
  await handler(req, res)
  expect(res.status).toHaveBeenCalledWith(200)
  expect(res.json).toHaveBeenCalledWith({ message: 'Hello World' })
})
```

### App Router Route Handler

```typescript
import { GET } from '@/app/api/items/route'

test('GET /api/items retorna array', async () => {
  const response = await GET(new Request('http://localhost/api/items'))
  expect(response.status).toBe(200)
  const data = await response.json()
  expect(Array.isArray(data.items)).toBe(true)
})
```

Para probar peticiones con cuerpo y cabeceras, construye el `Request` apropiadamente.

## 7. Mocking de fetch con MSW (Mock Service Worker)

Para pruebas de integración más realistas que involucren múltiples peticiones, usa **MSW**. Intercepta las peticiones a nivel de red en el entorno de pruebas.

```bash
npm install -D msw
```

Configura un servidor en `src/mocks/server.ts`:

```typescript
import { setupServer } from 'msw/node'
import { handlers } from './handlers'

export const server = setupServer(...handlers)
```

En `jest.setup.js`:

```javascript
import { server } from '@/mocks/server'
beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
```

Luego puedes probar componentes que hacen fetch sin necesidad de mockear `fetch` manualmente.

## 8. Pruebas de middleware

El middleware de Next.js se puede probar invocando la función exportada con un `NextRequest` simulado.

```typescript
import { middleware } from '@/middleware'
import { NextResponse } from 'next/server'

jest.mock('next/server', () => ({
  NextResponse: {
    next: jest.fn(() => 'next-called'),
    redirect: jest.fn((url) => `redirected to ${url}`),
  },
}))

test('redirige si no hay token', async () => {
  const request = new Request('http://localhost/dashboard')
  const result = await middleware(request)
  expect(result).toContain('redirected')
})
```

## 9. Cobertura y tipo de pruebas

- **Unitarias**: funciones, hooks, utilidades.
- **Integración**: componentes con contexto, flujo de varias funciones, API endpoints con base de datos (puedes usar una BD en memoria o SQLite para tests).
- **Componentes de servidor**: enfócate en probar las funciones de obtención de datos con mocks y, si es necesario, el HTML generado.

## 10. Buenas prácticas

- Mantén los tests cerca del código (co‑ubicación o carpeta `__tests__`).
- Usa `screen` y queries accesibles (`getByRole`, `getByLabelText`) en lugar de selectores CSS.
- Para Client Components, prueba comportamiento de usuario, no implementación.
- Mockea solo lo necesario; prefiere MSW para peticiones.
- Ejecuta tests en CI con `npm test -- --coverage`.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Buenas prácticas](../14-internacionalizacion/04-buenas-practicas.md) | [🏠 Inicio](../index.md) | [Pruebas End‑to‑End (E2E) ▶](02-e2e.md) |
