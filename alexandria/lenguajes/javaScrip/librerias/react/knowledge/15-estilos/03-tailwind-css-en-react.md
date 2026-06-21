# Tailwind CSS en React

Tailwind es un framework **utility-first** que proporciona miles de clases atómicas predefinidas (`flex`, `pt-4`, `text-red-500`) para construir diseños rápidamente componiendo clases. No es una librería de React, pero se integra profundamente con él.

## Uso en React
En JSX, se concatenan las clases directamente en el atributo `className`. Para manejar condicionales y fusionar clases sin conflictos, se utilizan utilidades como `clsx`, `classnames` o `tailwind-merge`.

```jsx
import clsx from 'clsx';

function Button({ variant, disabled }) {
  return (
    <button
      className={clsx(
        'px-4 py-2 rounded',
        variant === 'primary' && 'bg-blue-500 text-white',
        variant === 'secondary' && 'bg-gray-200 text-black',
        disabled && 'opacity-50 cursor-not-allowed'
      )}
      disabled={disabled}
    >
      Click
    </button>
  );
}
```

`tailwind-merge` es una utilidad que combina clases de Tailwind correctamente, resolviendo conflictos (por ejemplo, `px-4 px-6` → `px-6`). Un patrón común es crear una función `cn` que combine `clsx` y `twMerge` para usar en todo el proyecto.

```jsx
import { twMerge } from 'tailwind-merge';
import { clsx } from 'clsx';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
```

## Extrayendo componentes y reutilización
Tailwind fomenta la extracción de patrones repetitivos en **componentes React** en lugar de crear abstracciones CSS personalizadas. Por ejemplo, un `Button` con clases definidas internamente se convierte en la unidad de reutilización.

Cuando los estilos se repiten demasiado incluso entre componentes, se puede usar `@apply` en un archivo CSS (con PostCSS) para crear clases compuestas, pero el equipo de Tailwind recomienda usar el sistema de componentes del framework (React, Vue) antes que `@apply`, ya que puede generar acoplamiento y pérdida de legibilidad.

## Configuración y personalización
El archivo `tailwind.config.js` permite extender o sobrescribir la paleta de colores, espaciados, tipografías, puntos de ruptura, etc. La configuración se comparte en toda la aplicación, garantizando consistencia.

```js
module.exports = {
  theme: {
    extend: {
      colors: {
        brand: { 500: '#3b82f6', 600: '#2563eb' },
      },
    },
  },
};
```

## Purgado (PurgeCSS)
Tailwind utiliza PurgeCSS para eliminar las clases no utilizadas en producción. Analiza los archivos JSX y solo incluye en el CSS final las clases que aparecen. La configuración de `content` en `tailwind.config.js` especifica las rutas a escanear:

```js
content: ['./src/**/*.{js,jsx,ts,tsx}'],
```

Esto reduce el bundle de CSS a unos pocos KB.

## Ventajas en React
- **Desarrollo rápido**: no se alterna entre archivos; los estilos viven en el JSX y son inmediatamente visibles.
- **Sistema de diseño coherente**: las clases atómicas limitan las opciones a una escala predefinida, forzando consistencia.
- **Sin nombres de clase arbitrarios**: no hay que inventar nombres semánticos para cada contenedor.
- **Excelente rendimiento en producción**: CSS estático global (sin runtime JS) combinado con purgado efectivo.
- **Integración con componentes de cabeza**: Headless UI, Radix UI, y shadcn/ui proporcionan componentes accesibles y estilizables con Tailwind.

## Desventajas
- **HTML sobrecargado**: las cadenas de clases pueden ser muy largas y ruidosas visualmente.
- **Curva de aprendizaje**: requiere memorizar muchas clases, aunque herramientas como Tailwind CSS IntelliSense para VSCode ayudan enormemente.
- **Abstracciones complejas**: patrones avanzados (animaciones, pseudo-clases complejas) pueden requerir `@apply` o CSS personalizado, perdiendo parte de la ventaja utility-first.
- **Dependencia de la compilación**: necesitas que el build tool procese Tailwind (PostCSS). En configuraciones no estándar puede ser un obstáculo.

## Buenas prácticas
- Define tus propios tokens de diseño en el config en lugar de usar valores arbitrarios (`bg-[#ff0000]`) a menos que sean casos puntuales.
- Crea un archivo `cn` y utilízalo siempre para combinar clases condicionales.
- Extrae secciones reutilizables como componentes de React, no como clases CSS.
- Para variantes de componentes, usa props que mapeen a combinaciones de clases, no `@apply` masivo.
- Aprovecha las utilidades de anidamiento (`group`, `peer`) y los modificadores como `hover:`, `dark:`, `md:`.

## Comparación resumida

| Característica          | CSS Modules               | Styled Components         | Tailwind CSS              |
|-------------------------|---------------------------|---------------------------|---------------------------|
| **Aislamiento**         | Sí (por build)            | Sí (runtime)              | No, clases globales, pero consistencia por convención |
| **Runtime**             | No                        | Sí                        | No                        |
| **Estilos dinámicos**   | Verboso (condicionales)   | Potente (props)           | Verboso (condicionales)   |
| **Theming**             | Variables CSS             | ThemeProvider integrado   | CSS variables + config    |
| **Rendimiento**         | Excelente (CSS estático)  | Puede degradar en exceso  | Excelente (CSS estático)  |
| **Curva de aprendizaje**| Baja (CSS estándar)       | Media                     | Media-alta (clases)       |
| **Bundle**              | Solo CSS usado            | JS + CSS inyectado        | Solo CSS usado (purgado)  |
| **Integración React**   | Nativa                    | Muy alta                  | Alta (con utilidades)     |

En última instancia, la elección depende de la filosofía del equipo y los requisitos del proyecto. La tendencia actual se inclina hacia soluciones zero-runtime con excelente DX (Tailwind, Vanilla Extract, CSS Modules + PostCSS) para la mayoría de aplicaciones, reservando CSS-in-JS con runtime para casos donde los estilos son extremadamente dinámicos y el rendimiento no es crítico.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Styled Components](02-styled-components.md) | [🏠 Inicio](../index.md) | [Jest y React Testing Library ▶](../16-pruebas/01-jest-y-react-testing-library.md) |
