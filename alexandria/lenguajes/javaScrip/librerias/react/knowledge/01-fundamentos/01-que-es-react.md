# ¿Qué es React?

React es una **biblioteca de JavaScript de código abierto**, creada por Facebook (Meta), para construir interfaces de usuario (UI) de forma declarativa y basada en componentes. Su foco no es ser un framework completo (no impone enrutamiento, gestión de estado global o sistema de módulos), sino resolver el problema central de la capa de vista: **mantener la interfaz sincronizada con el estado de la aplicación de la manera más eficiente posible**.

## 1. El problema que resuelve
En aplicaciones complejas, manipular el DOM directamente con JavaScript o jQuery se vuelve frágil, repetitivo y propenso a errores. Cada cambio de estado requiere pasos imperativos: buscar elementos, modificar atributos, añadir/quitar nodos, gestionar eventos. React abstrae esto: el desarrollador describe **cómo debería verse la UI para un estado dado** y la biblioteca se encarga de todo el trabajo sucio de actualizar el DOM.

## 2. Filosofía nuclear
- **Composición de componentes**: la UI se divide en piezas pequeñas, encapsuladas y reutilizables llamadas componentes. Un componente puede ser una función o una clase (hoy en día se prefieren las funciones con hooks). Cada componente maneja su propia lógica, estado y presentación.
- **Programación declarativa**: no dices "haz esto, luego esto otro", sino "aquí está el resultado que quiero en función de estos datos". Esto hace el código más predecible y fácil de depurar.
- **Flujo de datos unidireccional**: los datos (estado y props) fluyen de padres a hijos. Los hijos nunca modifican directamente las props de sus padres; en su lugar, pueden invocar callbacks que el padre ha pasado como prop. Esto hace el flujo de información rastreable y evita ciclos de actualización infinitos.

## 3. ¿Qué no es React?
- No es un lenguaje, es JavaScript (o TypeScript) con esteroides.
- No es un framework MVC completo: se centra en la V (vista). Necesita complementos (React Router, Redux/Zustand, React Query) para una SPA completa.
- No incluye un sistema de módulos, ni un CLI oficial (aunque `create-react-app` fue histórico y hoy se recomiendan frameworks como Next.js, Vite + React, o Remix).

## 4. Virtual DOM: el motor de renderizado
React crea una representación ligera del DOM en memoria llamada **Virtual DOM**. Es un árbol de objetos JavaScript planos que describen elementos (tipo, propiedades, hijos). Cuando el estado cambia:
1. Se genera un nuevo árbol virtual.
2. El **algoritmo de reconciliación** (diffing) compara el nuevo árbol con el anterior.
3. Se calcula la mínima cantidad de cambios necesarios en el DOM real.
4. Esos cambios se aplican en una sola fase de commit.

Esto optimiza el rendimiento porque tocar el DOM real es costoso, y React agrupa las operaciones y minimiza las mutaciones.

## 5. Ecosistema y versiones
- **React 17**: "sin nuevas características" para el usuario, pero reescribió la delegación de eventos (ahora se anclan al nodo raíz de React en lugar de `document`) y facilitó la actualización gradual.
- **React 18**: introdujo el *Concurrent Rendering* (renderizado concurrente), Suspense para datos, transiciones, y `createRoot` como nueva API de montaje.
- Hoy se habla de React Server Components (RSC), que permite ejecutar componentes solo en el servidor, reduciendo el bundle del cliente y mejorando el rendimiento.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| ➖ | [🏠 Inicio](../index.md) | [Pensando en React ▶](02-pensando-en-react.md) |
