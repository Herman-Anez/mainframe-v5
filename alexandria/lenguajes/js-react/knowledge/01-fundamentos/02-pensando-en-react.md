# Pensando en React

Esta es la metodología para construir una interfaz con React, popularizada en la documentación oficial. Se divide en varios pasos mentales que todo desarrollador debe interiorizar.

## Paso 1: Dividir la UI en una jerarquía de componentes
Dibuja cajas alrededor de cada parte funcional de la interfaz. Para ello, sigue el **principio de responsabilidad única**: un componente debe hacer una sola cosa, y si empieza a crecer demasiado, se divide en subcomponentes.

> Técnica: si usas el diseño de un diseñador (Figma, Sketch), sus capas o naming suelen ser un buen punto de partida. Otra estrategia es aplicar el mismo criterio que para funciones: un componente debe tener una sola razón para cambiar.

La jerarquía se suele representar como un árbol:
- Componente raíz (App).
- Componentes principales (Header, Sidebar, MainContent, Footer).
- Subcomponentes (SearchBar, UserMenu, PostList, PostItem...).

## Paso 2: Construir una versión estática en React
Toma los datos de ejemplo (mock data) y construye la UI sin interactividad. En este paso:
- No uses estado (salvo para los propios datos de entrada).
- Los componentes reciben datos vía `props` y los renderizan.
- Puedes empezar de arriba hacia abajo (jerarquía) o de abajo hacia arriba (componentes hoja primero).

En una app grande, es más fácil empezar por los componentes que no dependen de otros, probarlos, y luego integrar hacia arriba.

## Paso 3: Identificar la representación mínima (pero completa) del estado de la UI
Pregúntate para cada dato: ¿esto es un estado? Para que un dato sea estado debe cumplir:
1. ¿Cambia con el tiempo? (si no, puede ser una constante o prop).
2. ¿Es pasado desde un padre vía props? (si sí, probablemente no es estado local).
3. ¿Se puede calcular a partir de otro estado o props? (si sí, no lo guardes como estado; usa variables derivadas, `useMemo`, o simplemente calcúlalo en el render).

Ejemplo: en una lista de tareas, el array de tareas es estado. La cantidad de tareas completadas se deriva, no se almacena en un estado aparte.

## Paso 4: Determinar dónde debe vivir ese estado
Para cada variable de estado identificada:
- Identifica qué componentes la necesitan.
- Encuentra el ancestro común más cercano a todos esos componentes y coloca ahí el estado (o usa contexto si la distancia es grande). Este proceso se conoce como **"levantar el estado"** (*lifting state up*).

## Paso 5: Agregar el flujo de datos inverso
Una vez decidido dónde residen los estados, los componentes hijos no pueden modificar directamente el estado del padre. En cambio, el padre les pasa *callbacks* (funciones) que, al ser ejecutadas, actualizan el estado en el padre. Es el patrón **data down, actions up**.

## Beneficios de pensar en React
- La UI se vuelve una función pura del estado.
- El código es modular y testeable.
- Facilita la comunicación entre desarrolladores y diseñadores.
- Evita sorpresas: los cambios en el estado siempre producen una re-renderización predecible.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ ¿Qué es React?](01-que-es-react.md) | [🏠 Inicio](../index.md) | [Programación declarativa en React ▶](03-programacion-declarativa-en-react.md) |
