# Compound Components (Componentes Compuestos)

Es un patrón que permite que un grupo de componentes compartan un estado implícito y se comuniquen entre sí sin necesidad de pasar props manualmente en cada nivel. Se inspira en elementos HTML como `<select>` y `<option>`: el `<select>` gestiona el estado de selección y los `<option>` se adaptan a él.

## ¿Cómo funciona?
Se basa en el **Contexto de React**. Un componente padre (el "compuesto") actúa como proveedor de un contexto que contiene el estado y los métodos compartidos. Los componentes hijos consumen ese contexto y reaccionan a los cambios.

**Implementación de un `Tabs` compuesto:**
```jsx
import { createContext, useContext, useState } from 'react';

const TabsContext = createContext();

function Tabs({ children, defaultActive = 0 }) {
  const [activeIndex, setActiveIndex] = useState(defaultActive);
  const value = { activeIndex, setActiveIndex };
  return (
    <TabsContext.Provider value={value}>
      <div className="tabs">{children}</div>
    </TabsContext.Provider>
  );
}

function TabList({ children }) {
  return <div className="tab-list" role="tablist">{children}</div>;
}

function Tab({ index, children }) {
  const { activeIndex, setActiveIndex } = useContext(TabsContext);
  const isActive = activeIndex === index;
  return (
    <button
      role="tab"
      aria-selected={isActive}
      className={`tab ${isActive ? 'active' : ''}`}
      onClick={() => setActiveIndex(index)}
    >
      {children}
    </button>
  );
}

function TabPanel({ index, children }) {
  const { activeIndex } = useContext(TabsContext);
  if (activeIndex !== index) return null;
  return (
    <div role="tabpanel" className="tab-panel">
      {children}
    </div>
  );
}

// Agrupar componentes como propiedades estáticas del padre (opcional pero expresivo):
Tabs.TabList = TabList;
Tabs.Tab = Tab;
Tabs.Panel = TabPanel;
```

**Uso:**
```jsx
<Tabs defaultActive={0}>
  <Tabs.TabList>
    <Tabs.Tab index={0}>Pestaña 1</Tabs.Tab>
    <Tabs.Tab index={1}>Pestaña 2</Tabs.Tab>
  </Tabs.TabList>
  <Tabs.Panel index={0}>Contenido 1</Tabs.Panel>
  <Tabs.Panel index={1}>Contenido 2</Tabs.Panel>
</Tabs>
```

## Claves del patrón
- **El proveedor encapsula el estado y la lógica**: `Tabs` usa `useState` y expone `activeIndex` y `setActiveIndex` vía contexto.
- **Los consumidores son "tontos"**: solo leen el contexto y actúan en consecuencia. No necesitan configurar callbacks.
- **Flexibilidad total de composición**: el usuario puede estructurar el JSX como quiera, incluso añadiendo estilos o elementos intermedios. La relación entre `TabList`, `Tab` y `Panel` no está rígidamente codificada.
- **API semántica y declarativa**: al agrupar los componentes como propiedades estáticas (`Tabs.Tab`), se crea un espacio de nombres que revela la intención y mejora la legibilidad.

## Ventajas
- **Evita el "prop drilling"**: no hay que pasar `activeIndex` y `onClick` manualmente.
- **Muy personalizable**: el consumidor decide el orden y la inclusión de cada pieza.
- **Separación de preocupaciones**: cada subcomponente maneja su propia representación.
- **Se usa en las grandes librerías**: Reach UI, Chakra UI, Radix UI, etc., basan muchos de sus componentes en este patrón.

## Precauciones
- **El contexto puede ser demasiado amplio**: si pones demasiada información en el contexto, cualquier cambio provocará re-renderizados en todos los consumidores. Mantén el contexto mínimo y especializado.
- **Documentación necesaria**: el API implícita requiere que el usuario sepa que los hijos deben estar dentro del padre proveedor.
- **No abuses**: para casos simples, unas pocas props pueden ser más claras que un sistema compuesto.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Cypress (Pruebas End-to-End)](../16-pruebas/03-cypress-pruebas-end-to-end.md) | [🏠 Inicio](../index.md) | [State Reducer Pattern ▶](02-state-reducer-pattern.md) |
