# Windowing (Virtualización)

Cuando renderizas listas enormes (miles de elementos), crear todos los nodos del DOM de golpe degrada el rendimiento y consume memoria excesiva. La **virtualización** (o *windowing*) consiste en renderizar solo los elementos visibles en el viewport (más un margen), reciclando nodos a medida que el usuario se desplaza.

## Concepto general
Una lista virtual mantiene un contenedor con una altura total simulada (scrollHeight) igual al número total de elementos × altura de cada elemento. Solo se montan en el DOM los elementos cuyo índice entra dentro del rango visible, calculado a partir de la posición de scroll. Los elementos fuera de vista no existen en el DOM.

## Beneficios
- DOM mínimo: de miles de nodos a unas docenas.
- Menor tiempo de renderizado y reconciliación.
- Menor uso de memoria y mejor respuesta al scroll.

## Implementación manual vs. librerías
Implementar virtualización desde cero es complejo: hay que manejar el scroll, redimensiones, alturas variables, accesibilidad. La comunidad ha creado librerías robustas:

**`react-window`** (sucesora de `react-virtualized`, más ligera):
```jsx
import { FixedSizeList as List } from 'react-window';

function MiLista({ items }) {
  return (
    <List
      height={400}
      itemCount={items.length}
      itemSize={35}
      width="100%"
    >
      {({ index, style }) => (
        <div style={style}>Item {items[index]}</div>
      )}
    </List>
  );
}
```

**`react-virtual`** (de TanStack, más moderna, con soporte TypeScript nativo y alturas dinámicas):
```jsx
import { useVirtualizer } from '@tanstack/react-virtual';

function MiLista({ items }) {
  const parentRef = useRef();
  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 35,
  });

  return (
    <div ref={parentRef} style={{ height: 400, overflow: 'auto' }}>
      <div style={{ height: virtualizer.getTotalSize() }}>
        {virtualizer.getVirtualItems().map(virtualItem => (
          <div key={virtualItem.key} style={{ position: 'absolute', top: 0, transform: `translateY(${virtualItem.start}px)` }}>
            {items[virtualItem.index]}
          </div>
        ))}
      </div>
    </div>
  );
}
```

## Características avanzadas
- **Alturas dinámicas**: la librería mide el tamaño real de cada elemento tras renderizarlo y ajusta el layout. Esto requiere una segunda pasada, pero mejora la precisión.
- **Infinite scrolling**: combinado con virtualización, se cargan más datos a medida que el scroll se acerca al final.
- **Grid virtualizado**: para tablas y mosaicos.
- **Accesibilidad**: las librerías modernas conservan la semántica (roles ARIA, índices de tabulación) integrando con el DOM real.

## Cuándo usar virtualización
- Listas con cientos o miles de elementos, especialmente si cada elemento tiene un renderizado costoso (imágenes, tarjetas complejas).
- Tablas de datos grandes.
- Chats o feeds infinitos.

## Cuándo NO usar virtualización
- Listas pequeñas (< 50-100 elementos): el overhead de virtualización puede ser mayor que el beneficio.
- Si cada elemento necesita estar en el DOM para SEO (sin SSR adicional), la virtualización puede complicar el indexado. En ese caso se usa SSR + hidratación parcial.

## Integración con React Concurrent Mode
La virtualización ayuda a mantener el DOM pequeño, pero en React 18 con renderizado concurrente, incluso listas grandes pueden renderizarse sin bloquear la UI si se dividen en trozos con `useTransition`. La virtualización sigue siendo la mejor práctica para el DOM final, pero el render concurrente suaviza la experiencia durante la generación del árbol virtual.

## Optimizaciones adicionales
- Usar `React.memo` en cada elemento de la lista virtual.
- Pasar funciones callback estables con `useCallback`.
- Evitar claves basadas en índices dentro de la lista virtual (la librería suele manejar keys por ti).
- Perfilar siempre: una lista virtual mal configurada puede ser más lenta que una lista sin virtualizar.

---

Este bloque de rendimiento te proporciona un flujo de trabajo completo: medir con Profiler, evitar renderizados innecesarios con `memo` y hooks de memoización, diferir la carga de código con `lazy` + `Suspense`, y domar listas gigantes con virtualización. Aplicar estas técnicas con criterio es la marca de un desarrollo React profesional.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Profiler](04-profiler.md) | [🏠 Inicio](../index.md) | [Renderizado concurrente (Concurrent Rendering) ▶](../12-react-18-y-concurrent-mode/01-renderizado-concurrente-concurrent-rendering.md) |
