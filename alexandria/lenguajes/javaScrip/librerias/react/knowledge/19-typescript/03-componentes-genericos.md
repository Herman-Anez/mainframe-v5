# Componentes genéricos

Los componentes genéricos permiten que el tipo de las props dependa del argumento de tipo que el usuario proporciona (explícita o implícitamente). Son imprescindibles en componentes de lista, formularios o cualquier patrón donde los datos pasados determinan la forma de otras props.

## Sintaxis con función declarativa y arrow function
En archivos `.tsx`, la sintaxis de arrow function puede generar ambigüedad con JSX. La solución más limpia es usar una función declarativa o añadir una coma después de `<T>`.

**Función declarativa (recomendado):**
```tsx
interface ListProps<T> {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
}

function List<T>({ items, renderItem }: ListProps<T>) {
  return <ul>{items.map(renderItem)}</ul>;
}
```

**Arrow function en `.tsx`:**
```tsx
const List = <T,>({ items, renderItem }: ListProps<T>) => {
  return <ul>{items.map(renderItem)}</ul>;
};
```
La coma después de `<T>` indica a TypeScript que no es JSX. Sin la coma, intentaría interpretar `<T>` como una etiqueta JSX.

## Uso con inferencia automática
Al usar el componente, TypeScript inferirá `T` desde el array `items`:
```tsx
<List items={[{ id: 1, name: 'Ana' }]} renderItem={(user) => <li>{user.name}</li>} />
// T inferido: { id: number; name: string }
```
No necesitas especificar `<User>`.

## Especificar el tipo explícitamente
Cuando la inferencia no es posible (ej. el array está vacío o la relación no es directa), puedes pasarlo:
```tsx
<List<User> items={[]} renderItem={(user) => <li>{user.name}</li>} />
```

## Restricciones en el tipo genérico
Puedes limitar `T` con `extends`. Por ejemplo, un componente que requiere que cada ítem tenga un `id`:
```tsx
interface ListProps<T extends { id: string | number }> {
  items: T[];
  selectedId?: T['id'];
  onSelect: (id: T['id']) => void;
}
```
Esto asegura que puedas acceder a `item.id` dentro del componente sin errores.

## Componentes genéricos con `forwardRef`
La combinación es posible, aunque la sintaxis es más verbosa. Se debe usar una función auxiliar o un casting. La manera moderna es usar una función extra que capture el genérico y luego llame a `forwardRef`:

```tsx
import { forwardRef } from 'react';

interface SelectProps<T> {
  options: T[];
  value: T;
  onChange: (value: T) => void;
  getLabel: (option: T) => string;
}

const Select = forwardRef(
  <T,>(props: SelectProps<T>, ref: React.ForwardedRef<HTMLDivElement>) => {
    // implementación
    return <div ref={ref}>...</div>;
  }
) as <T>(props: SelectProps<T> & { ref?: React.ForwardedRef<HTMLDivElement> }) => JSX.Element;
```

Existen librerías como `@types/react` que admiten una sobrecarga especial, pero la sintaxis exacta puede variar entre versiones de TypeScript. Una alternativa es no usar `forwardRef` y pasar la ref como una prop normal con otro nombre, o encapsular el componente en un envoltorio.

## Ejemplo: `FormField` genérico
Un campo de formulario que puede ser de distinto tipo según un prop `as`:

```tsx
type FieldProps<T extends React.ElementType> = {
  as: T;
  label: string;
} & React.ComponentPropsWithoutRef<T>;

function Field<T extends React.ElementType>({ as, label, ...rest }: FieldProps<T>) {
  const Component = as;
  return (
    <label>
      {label}
      <Component {...rest} />
    </label>
  );
}
```

## Consideraciones
- Los genéricos en React son potentes, pero si la API se vuelve demasiado compleja, puede afectar la legibilidad. Úsalos cuando la relación entre varias props lo justifique.
- TypeScript 4.7+ mejoró el soporte para componentes genéricos en JSX, permitiendo la sintaxis `<T,>` en arrow functions.
- Si tienes problemas con `forwardRef` genérico, a menudo es más simple extraer la lógica a un hook y dejar la presentación en un componente sin ref, o usar una librería de UI que ya maneje esto (Radix UI, por ejemplo).

---

Con estas tres bases de TypeScript en React, podrás construir componentes robustos y reutilizables, donde el compilador trabaja contigo para evitar errores comunes de tipado, eventos y contratos de datos. La inversión en tipado se traduce en una documentación viva y una refactorización mucho más segura.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Tipos de hooks](02-tipos-de-hooks.md) | [🏠 Inicio](../index.md) | ➖ |
