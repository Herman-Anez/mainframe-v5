# JSX: Transformación, expresiones y escapado

## ¿Qué es JSX?
JSX es una **extensión sintáctica de JavaScript** que permite escribir marcas similares a XML/HTML dentro del código JavaScript. No es un string template, ni un HTML real, sino una sintaxis que los transpiladores (Babel, TypeScript, esbuild) convierten en llamadas a funciones de React.

Por ejemplo, esto:
```jsx
const element = <h1 className="saludo">Hola, {nombre}!</h1>;
```
Se transforma en:
```javascript
const element = React.createElement('h1', { className: 'saludo' }, 'Hola, ', nombre, '!');
```

## Reglas de JSX
1. **Un solo elemento raíz**: un componente debe devolver un único elemento (que puede ser un `Fragment` para devolver múltiples nodos sin añadir contenedor extra).
2. **Etiquetas en minúsculas** = elementos HTML (`<div>`, `<span>`). **Etiquetas en mayúsculas** = componentes personalizados (`<MiComponente />`).
3. **Cierre obligatorio**: todos los elementos deben cerrarse, incluso aquellos que en HTML son de cierre automático como `<img>`, `<br>` → `<img />`, `<br />`.
4. **Atributos en camelCase**: ya que JSX se transpila a JavaScript, los atributos siguen la convención de nombres de propiedad de JavaScript: `className` en lugar de `class`, `htmlFor` en lugar de `for`, `onClick` en lugar de `onclick`, `tabIndex`.
5. **Expresiones JavaScript con `{}`**: cualquier expresión válida de JavaScript puede ir entre llaves, tanto en el contenido como en los valores de los atributos.
   ```jsx
   <div>{mensaje || 'Valor por defecto'}</div>
   <img src={usuario.avatarUrl} alt={usuario.nombre} />
   ```
   No se pueden usar sentencias (`if`, `for`), pero sí ternarios, operadores lógicos, `map()`, etc.
6. **Comentarios**: se escriben como en JS dentro de llaves: `{/* comentario */}`.

## JSX es una abstracción segura (XSS)
React **escapa automáticamente** cualquier valor embebido con `{}` antes de insertarlo en el DOM. Si intentas renderizar contenido potencialmente malicioso:
```jsx
const entradaUsuario = '<img src=x onerror=alert("hack")>';
const elemento = <div>{entradaUsuario}</div>;
```
Lo que verás en pantalla es literalmente el string, no se interpretará como HTML. React convierte caracteres como `<` en `&lt;`. Esto hace que los ataques XSS sean mucho más difíciles por defecto, a menos que uses intencionalmente `dangerouslySetInnerHTML` (una API que requiere un objeto con `__html` y cuyo nombre ya advierte del peligro).

## JSX no es HTML: diferencias clave
- **Estilos en línea**: no aceptan strings, sino un objeto JavaScript cuyas propiedades son camelCase.
  ```jsx
  <div style={{ backgroundColor: 'red', fontSize: 16 }} />
  ```
- **`class` vs `className`**: ya explicado.
- **`for` vs `htmlFor`**: en `<label>`.
- **Atributos booleanos**: en HTML, un atributo booleano como `disabled` se puede poner sin valor; en JSX debes usar `disabled={true}` o simplemente `disabled` (que Babel interpreta como `disabled={true}`). Si no quieres el atributo, no lo incluyas o usa `disabled={false}`.
- **Children**: los hijos de un componente JSX pueden ser strings, números, otros elementos o arrays de elementos (siempre con keys apropiadas en listas). React renderiza `false`, `null`, `undefined` y `true` como nada (útil para renderizado condicional: `{condicion && <Componente />}`).

## JSX bajo el capó: createElement y el nuevo JSX Transform
A partir de React 17, se introdujo un **nuevo transform JSX** que no requiere importar `React` en cada archivo. En lugar de `React.createElement`, se importan funciones desde `react/jsx-runtime` automáticamente. Esto permite un ligero ahorro de bundle y evita tener que escribir `import React from 'react'` en archivos que solo usan JSX (aunque es buena práctica hacerlo si se usan hooks porque ellos sí provienen de React).

El resultado es el mismo: un objeto conocido como **elemento React** con la forma:
```javascript
{
  $$typeof: Symbol.for('react.element'),
  type: 'h1',
  key: null,
  ref: null,
  props: { className: 'saludo', children: ['Hola, ', nombre, '!'] },
  _owner: null
}
```
El campo `$$typeof` ayuda a React a distinguir elementos genuinos de objetos arbitrarios, protegiendo contra ataques donde un usuario podría inyectar un objeto JSON que React confundiría con un componente.

## JSX y TypeScript
En TypeScript, JSX se integra con definiciones de tipos. La extensión del archivo debe ser `.tsx`. Se puede configurar `jsxFactory` en `tsconfig.json` si se usa un runtime diferente, pero con React 17+ lo normal es `"jsx": "react-jsx"`. Los tipos de propiedades se pueden definir directamente en las interfaces de los componentes, y el autocompletado funciona perfectamente.

## Buenas prácticas
- Mantén los componentes pequeños: si un bloque JSX crece mucho, extrae subcomponentes o al menos en variables bien nombradas.
- Usa paréntesis para envolver JSX multilínea y mejorar legibilidad.
- Prefiere fragmentos cortos (`<>...</>`) cuando no necesites un contenedor semántico.
- Evita lógica compleja dentro de JSX; mejor calcúlala antes del `return` y así el JSX se vuelve casi un "template" puro.

---

Este bloque de fundamentos es imprescindible para cimentar un conocimiento sólido. Comprender qué es React, cómo pensar en sus términos, por qué el estilo declarativo y el flujo unidireccional son superiores, y manejar JSX con soltura, te permitirá abordar el resto de la biblioteca sin vicios ni malentendidos conceptuales.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Flujo unidireccional de datos](04-flujo-unidireccional-de-datos.md) | [🏠 Inicio](../index.md) | [Componentes funcionales ▶](../02-componentes/01-componentes-funcionales.md) |
