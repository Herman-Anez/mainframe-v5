# Styled Components

Styled Components es una librería de CSS-in-JS que utiliza **literales de plantilla etiquetados** (tagged templates) para definir estilos dentro del componente React. Genera automáticamente nombres de clase únicos e inyecta los estilos en el DOM a través de `<style>`.

## API básica
```jsx
import styled from 'styled-components';

const Button = styled.button`
  background-color: ${props => props.$primary ? 'blue' : 'white'};
  color: ${props => props.$primary ? 'white' : 'black'};
  padding: 8px 16px;
  border-radius: 4px;
  opacity: ${props => props.disabled ? 0.5 : 1};
`;

function App() {
  return <Button $primary disabled>Click me</Button>;
}
```

Los props se interpolan con funciones flecha, y los estilos se recalculan cuando cambian los props relevantes. Styled Components rastrea qué props dinámicos se usan y solo actualiza las reglas CSS necesarias, no todo el bloque.

## Aislamiento y generación de clases
Cada instancia recibe un nombre de clase único, generado con un hash del contenido del estilo. Los estilos globales se definen con `createGlobalStyle`.

## Theming
Styled Components expone un contexto de tema mediante `ThemeProvider`. Cualquier componente envuelto puede acceder a `props.theme`.

```jsx
const theme = { primaryColor: 'blue', secondaryColor: 'gray' };
<ThemeProvider theme={theme}>
  <App />
</ThemeProvider>

const Button = styled.button`
  background-color: ${props => props.theme.primaryColor};
`;
```

## Extensión y polimorfismo
- **Extensión**: `const PrimaryButton = styled(Button)...` para crear variantes reutilizando estilos base.
- **Polimorfismo**: la prop `as` permite cambiar la etiqueta HTML subyacente sin perder los estilos: `<Button as="a" href="/">`.

## Renderizado en servidor (SSR)
Styled Components soporta SSR mediante `ServerStyleSheet`, que recolecta los estilos del árbol y los inyecta en el HTML inicial. En Next.js con App Router, se recomienda el registro de la librería para streaming.

## Rendimiento y advertencias
- **Overhead en runtime**: genera estilos y los inyecta en el DOM en tiempo de ejecución, lo que puede afectar el rendimiento en aplicaciones con muchos componentes dinámicos.
- **CSS estático extraído**: para resolver esto, surgen alternativas como Linaria o `@compiled`, que extraen los estilos a archivos CSS estáticos en build. Sin embargo, Styled Components puro implica trabajo en el cliente.
- **Regeneración de clases**: si los estilos dependen de props que cambian frecuentemente, se generan nuevas clases y se insertan reglas repetidamente, aunque hay mecanismos de cacheo.
- **Bundle size**: ~12KB (gzip) añadidos.

## Cuándo usarlo
- Proyectos que requieren estilos altamente dinámicos basados en props y temas.
- Equipos que prefieren colocar estilos y lógica en el mismo archivo.
- Aplicaciones con un sistema de diseño rico que se beneficia del theming profundo.

## Alternativas modernas
- **Vanilla Extract**: CSS-in-JS con zero-runtime, genera archivos CSS en build.
- **Panda CSS**: similar, con utilidades atómicas y `styled` system, zero-runtime.
- **Linaria**: extrae CSS estático, compatible con `styled` API.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ CSS Modules](01-css-modules.md) | [🏠 Inicio](../index.md) | [Tailwind CSS en React ▶](03-tailwind-css-en-react.md) |
