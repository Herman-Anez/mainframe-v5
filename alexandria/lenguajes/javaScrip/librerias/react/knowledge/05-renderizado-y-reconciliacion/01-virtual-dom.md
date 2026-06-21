# Virtual DOM

El Virtual DOM (VDOM) es una **representación ligera en memoria del DOM real**. No es un estándar ni una biblioteca separada; es un concepto implementado internamente por React.

## ¿Qué es exactamente?
Cuando escribes JSX, cada etiqueta se convierte en una llamada a `React.createElement` que devuelve un **objeto JavaScript plano** con la siguiente forma:

```javascript
{
  $$typeof: Symbol.for('react.element'),
  type: 'div',
  key: null,
  ref: null,
  props: {
    className: 'container',
    children: [
      {
        $$typeof: Symbol.for('react.element'),
        type: 'h1',
        key: null,
        ref: null,
        props: { children: 'Hola' }
      }
    ]
  }
}
```

Este objeto es un **elemento React**, la unidad mínima del Virtual DOM. Un árbol de estos elementos forma el VDOM.

## Propiedades fundamentales
- **Es inmutable**: una vez creado, no se modifica. Cuando el estado cambia, se crea un árbol completamente nuevo.
- **Ligero**: solo contiene la información necesaria para describir la UI (tipo, props, hijos). No tiene métodos, eventos ni estado interno del DOM.
- **Plataforma-agnóstico**: React puede renderizar a diferentes destinos (DOM, iOS, Android, SVG, Canvas, terminal) porque el VDOM abstrae la plataforma concreta. Los "renderers" (`react-dom`, `react-native`) se encargan de traducir el VDOM a operaciones nativas.

## ¿Por qué no manipular el DOM directamente?
El DOM real es pesado y lento de recorrer/modificar. Cada cambio puede disparar recálculos de estilo, layout y pintado. React minimiza estas interacciones costosas mediante:

1. **Batch de cambios**: agrupa múltiples actualizaciones de estado y las aplica en una sola pasada de commit.
2. **Diffing inteligente**: compara el nuevo VDOM con el anterior para calcular el conjunto mínimo de operaciones DOM necesarias.
3. **Reutilización de nodos**: si un elemento del mismo tipo está en la misma posición, React mantiene la instancia del nodo DOM y solo actualiza sus atributos.

## Virtual DOM vs. Shadow DOM
No confundir con el Shadow DOM (estándar web para encapsular estilos). El VDOM es un patrón de implementación en JavaScript; el Shadow DOM es una API del navegador.

## El VDOM en React moderno
Con la llegada de los compiladores (React Forget/compiler) y React Server Components, el VDOM está siendo parcialmente reemplazado por una representación más optimizada en el servidor. Sin embargo, en el cliente, el VDOM sigue siendo el mecanismo central de reconciliación.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Hooks experimentales: `use`](../04-hooks/12-hooks-experimentales-use.md) | [🏠 Inicio](../index.md) | [Algoritmo de Diffing (Reconciliación) ▶](02-algoritmo-de-diffing-reconciliacion.md) |
