# CSS Modules

CSS Modules es una técnica que permite escribir archivos CSS tradicionales pero con **alcance local por defecto**. Se basa en una transformación en tiempo de compilación (webpack, Vite, esbuild) que renombra las clases CSS para hacerlas únicas por módulo, evitando colisiones globales.

## ¿Cómo funciona?
Un archivo con extensión `*.module.css` se importa en el componente como un objeto de JavaScript. Las propiedades de ese objeto son los nombres de clase originales, y sus valores son los nombres de clase transformados (con un hash único).

```css
/* Button.module.css */
.primary {
  background-color: blue;
  color: white;
}
.disabled {
  opacity: 0.5;
}
```

```jsx
import styles from './Button.module.css';

function Button({ disabled, children }) {
  return (
    <button className={`${styles.primary} ${disabled ? styles.disabled : ''}`}>
      {children}
    </button>
  );
}
```

El HTML resultante tendrá clases como `Button_primary_a2d4f`, `Button_disabled_f8c3e`. La colisión es imposible porque cada archivo genera sufijos diferentes.

## Composición (`composes`)
CSS Modules permite que una clase herede estilos de otra dentro del mismo módulo o de módulos externos, sin perder el ámbito local.

```css
.base {
  padding: 8px 16px;
  border-radius: 4px;
}
.primary {
  composes: base;
  background-color: blue;
  color: white;
}
```

Esto se compila de forma que el elemento recibe ambas clases (la local `base` y la local `primary`). También se puede componer desde otro módulo: `composes: base from './shared.module.css';`.

## Variables CSS y preprocesadores
CSS Modules se combina naturalmente con variables CSS (custom properties) para temas dinámicos, y con PostCSS o Sass para anidamiento, mixins, etc. Solo hay que configurar el bundler.

## Tipos con TypeScript
Para tener autocompletado en los imports, se puede generar archivos de declaración con `*.module.css.d.ts` (herramientas como `typed-css-modules` lo hacen automáticamente). Vite lo soporta nativamente incluyendo `css-modules.d.ts`.

## Ventajas
- **Curva de aprendizaje mínima**: es CSS estándar (o con preprocesador) pero con aislamiento.
- **Cero runtime**: la transformación ocurre en build, no hay JavaScript ejecutándose para estilos.
- **Rendimiento**: clases CSS estáticas, el navegador puede optimizar.
- **Separación de preocupaciones**: los estilos están en archivos aparte, pero colocalizados con el componente.
- **Purgado automático**: como son hojas de estilo estáticas, las herramientas de árbol sacuden las clases no usadas.

## Desventajas
- **Estilos dinámicos**: para cambiar estilos en función de props/estado, debes asignar condicionalmente clases (usando `clsx` o `classnames`). Estilos muy dinámicos pueden volverse verbosos.
- **Composición compleja**: si un componente necesita heredar muchos estilos de diferentes módulos, la sintaxis `composes` puede ser insuficiente comparada con el patrón de props o `sx` de otras librerías.
- **Sin soporte directo de tema**: hay que usar variables CSS o pasar clases temáticas manualmente.

## Buenas prácticas
- Nombra las clases de forma semántica (`primary`, `outline`, `disabled`) y no según el aspecto (`blueButton`).
- Usa `composes` para evitar repetir estilos base.
- Para estilos dinámicos, usa `clsx` o funciones que devuelvan la cadena de clases.
- Aprovecha las variables CSS para temas oscuros/claros sin recompilar.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ React Query y SWR (Server State)](../14-estado-global/05-react-query-y-swr-server-state.md) | [🏠 Inicio](../index.md) | [Styled Components ▶](02-styled-components.md) |
