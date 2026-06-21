# Tipado de props y eventos

## Props: la interfaz del componente
La forma más común de tipar las props es mediante una **interfaz** o un **type**. Ambas funcionan; la elección es en gran medida de estilo.

```tsx
interface ButtonProps {
  label: string;
  disabled?: boolean;            // opcional
  variant: 'primary' | 'secondary'; // unión
  onClick?: () => void;
}

// o
type ButtonProps = {
  label: string;
  disabled?: boolean;
  variant: 'primary' | 'secondary';
  onClick?: () => void;
};

function Button({ label, disabled = false, variant, onClick }: ButtonProps) {
  return (
    <button disabled={disabled} className={`btn-${variant}`} onClick={onClick}>
      {label}
    </button>
  );
}
```

## `React.FC` vs tipado explícito
Históricamente se usó `React.FC<Props>` (o `React.FunctionComponent<Props>`), que añade automáticamente el tipo de `children` como `React.ReactNode` y declara que el componente devuelve `ReactElement | null`. Hoy se desaconseja por varias razones:
- Agrega `children` implícito aunque tu componente no los acepte.
- Dificulta el tipado de componentes genéricos.
- No ofrece beneficios frente a tipar directamente la función.

**Mejor práctica:** tipa explícitamente las props y, si aceptas children, decláralo:

```tsx
interface CardProps {
  title: string;
  children?: React.ReactNode; // solo si es necesario
}

function Card({ title, children }: CardProps) {
  return <div><h2>{title}</h2>{children}</div>;
}
```

## Tipos para `children`
Según lo que necesites, puedes usar:
- `React.ReactNode`: cualquier cosa que React pueda renderizar (JSX, string, número, null, arrays...). Es el más común.
- `React.ReactElement`: un solo elemento React (no strings ni arrays).
- `React.ReactChild` (obsoleto, mejor `ReactNode`).
- `JSX.Element`: similar a `ReactElement`, pero retornado por una función de componente (no se usa como prop generalmente).

Si tu componente requiere un único hijo o una función específica, ajústalo:
```tsx
interface ListProps {
  children: React.ReactNode; // explícito
}
```

## Eventos sintéticos
Los eventos en React tienen tipos específicos según el elemento y el evento. Se importan desde `React` y se aplican al handler o al parámetro del callback.

**Manejadores como props:**
```tsx
interface InputProps {
  value: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>; // manera concisa
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void; // manual
}
```

**Tipos de eventos comunes:**
- `React.MouseEvent<HTMLButtonElement>` – clic en botón.
- `React.ChangeEvent<HTMLInputElement>` – cambio en input, select, textarea.
- `React.FormEvent<HTMLFormElement>` – envío de formulario.
- `React.KeyboardEvent<HTMLInputElement>` – teclado.
- `React.FocusEvent<HTMLElement>` – foco/blur.
- `React.ClipboardEvent`, `React.DragEvent`, `React.TouchEvent`, etc.

Para elementos genéricos (cuando no sabes el tipo exacto), puedes usar `HTMLElement` o `Element`.

**Ejemplo de handler en línea:**
```tsx
<input
  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
/>
```

## Extender props nativas de HTML
A menudo queremos que nuestro componente acepte todas las props de un elemento HTML nativo (como `className`, `id`, `aria-*`). TypeScript proporciona `React.ComponentPropsWithoutRef<'div'>` o `React.ComponentProps<'div'>`.

```tsx
interface PanelProps extends React.ComponentPropsWithoutRef<'div'> {
  title: string;
}

function Panel({ title, className, ...rest }: PanelProps) {
  return <div className={`panel ${className ?? ''}`} {...rest}>{title}</div>;
}
```

- `ComponentPropsWithoutRef` excluye la prop `ref`, que generalmente manejaremos con `forwardRef` aparte.
- `ComponentProps` incluye `ref`, pero su uso en componentes funcionales normales puede confundir; es más adecuado para `forwardRef`.

## Refs y `forwardRef`
Cuando un componente debe recibir un `ref`, se usa `forwardRef` y se tipa el ref según el elemento que se pretende exponer.

```tsx
import { forwardRef } from 'react';

type FancyInputProps = {
  label: string;
  error?: string;
} & React.ComponentPropsWithoutRef<'input'>;

const FancyInput = forwardRef<HTMLInputElement, FancyInputProps>(
  ({ label, error, ...inputProps }, ref) => {
    return (
      <label>
        {label}
        <input ref={ref} {...inputProps} />
        {error && <span className="error">{error}</span>}
      </label>
    );
  }
);

FancyInput.displayName = 'FancyInput';
```

La función `forwardRef` acepta dos parámetros de tipo: `forwardRef<TRef, TProps>` (orden: ref primero, props después).

## Prop `as` y componentes polimórficos
Para componentes que pueden renderizar diferentes elementos HTML según una prop `as`, se necesita un tipado avanzado que asocie el elemento con las props permitidas. Este patrón se sale del alcance básico, pero se puede resolver con genéricos y `React.ElementType`. Librerías como Chakra UI lo implementan profundamente; para un uso simple, se puede tipar con `ComponentPropsWithoutRef` y el tipo del `as`.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Internacionalización (i18n)](../18-accesibilidad-i18n/02-internacionalizacion-i18n.md) | [🏠 Inicio](../index.md) | [Tipos de hooks ▶](02-tipos-de-hooks.md) |
