# Estado local con `useState`

`useState` es el hook fundamental para agregar estado local a componentes funcionales. Sustituye a `this.state` y `this.setState` de las clases, proporcionando una API más simple y basada en tuplas.

## Firma y funcionamiento
```jsx
import { useState } from 'react';

const [valor, setValor] = useState(initialState);
```

- `initialState`: el valor con el que se inicializa el estado en el primer renderizado. Puede ser cualquier tipo (primitivo, objeto, array) o incluso una **función inicializadora** que se ejecuta solo una vez (útil si el cálculo es costoso: `useState(() => computeExpensiveValue())`).
- `valor`: la variable de estado actual.
- `setValor`: función que actualiza el estado y **provoca un nuevo renderizado**.

## Dos formas de actualizar
1. **Pasando un nuevo valor**: `setValor(nuevoValor)`. React encola la actualización. Para el próximo render, `valor` será `nuevoValor`.
   ```jsx
   setCount(5); // estado previo se descarta
   ```
2. **Pasando una función actualizadora**: recibe el estado previo y retorna el nuevo.
   ```jsx
   setCount(prevCount => prevCount + 1);
   ```
   Esta forma es crucial cuando el nuevo estado depende del anterior, porque garantiza que trabajas con el valor más reciente (especialmente al encolar múltiples actualizaciones en el mismo evento, como en un bucle).

## Inmutabilidad y el algoritmo de reconciliación
React usa `Object.is` para comparar el valor antiguo con el nuevo. Si son iguales (misma referencia en objetos/arrays), **no se re-renderiza** el componente. Por eso debes crear nuevos objetos/arrays en lugar de mutarlos:
```jsx
// ❌ Mutación (no detectará cambio)
const [user, setUser] = useState({ name: 'Ana', age: 30 });
user.age = 31;
setUser(user); // no re-renderiza

// ✅ Nuevo objeto
setUser({ ...user, age: 31 });
// o con función:
setUser(prev => ({ ...prev, age: prev.age + 1 }));
```

## Estados por separado vs. estado compuesto
Puedes usar múltiples `useState` para variables independientes:
```jsx
const [name, setName] = useState('');
const [age, setAge] = useState(0);
```
O un solo objeto cuando los valores tienden a cambiar juntos o representan una entidad. La elección depende de la cohesión de los datos y la frecuencia de actualización.

## Batcheo automático (React 18+)
En React 18 con `createRoot`, todas las actualizaciones de estado dentro de manejadores de eventos y funciones asíncronas se agrupan automáticamente para disparar un solo re-render. Antes, solo se agrupaban dentro de eventos sintéticos; ahora también en `setTimeout`, promesas, etc. Esto mejora el rendimiento sin que el desarrollador haga nada.

## Reglas importantes
- Los hooks, incluido `useState`, deben llamarse en el mismo orden en cada renderizado (ver reglas de hooks más adelante).
- No coloques `useState` dentro de condicionales, bucles ni funciones anidadas.
- El setter es estable (su referencia no cambia entre renders), puedes pasarlo como prop sin causar renders extra en hijos.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Higher-Order Components (HOCs)](../02-componentes/06-higher-order-components-hocs.md) | [🏠 Inicio](../index.md) | [Ciclo de vida en componentes de clase ▶](02-ciclo-de-vida-en-componentes-de-clase.md) |
