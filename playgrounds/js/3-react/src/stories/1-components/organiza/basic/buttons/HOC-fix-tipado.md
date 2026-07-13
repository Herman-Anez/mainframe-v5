# Fix de tipado en `withFakeStatus` (HOC)

## Contexto

La historia `submitButton.stories.tsx` envuelve `SubmitButton` con el HOC `withFakeStatus` para simular el estado `pending` de un envío (sin necesidad de un `<form>` real ni `useFormStatus`):

```tsx
const SubmitButtonWithFakeStatus = withFakeStatus(SubmitButton);

const HocTemplate: StoryFn<typeof SubmitButtonWithFakeStatus> = (args) => (
  <SubmitButtonWithFakeStatus {...args} />
);
```

Al compilar, TypeScript lanzaba dos errores sobre esa línea:

```
TS2322: Type 'unknown' is not assignable to type 'IntrinsicAttributes'.
TS2698: Spread types may only be created from object types.
```

## Causa raíz

El HOC devolvía un componente **sin parámetros**:

```tsx
export default function withFakeStatus(
    WrappedComponent: ComponentType<SubmitButtonProps>
) {
    return function WithFakeStatus() {
        const { pending, trigger } = useFakePending(1000);
        return <WrappedComponent pending={pending} onClick={trigger} />;
    }
}
```

`StoryFn<T>` (de Storybook) necesita inferir el tipo de `args` a partir de las props del componente, usando internamente algo equivalente a `ComponentProps<T>`. Cuando la función no declara ningún parámetro, TypeScript no tiene de dónde extraer ese tipo de props, y el resultado de la inferencia cae en `unknown`.

Consecuencia: en la línea `<SubmitButtonWithFakeStatus {...args} />`, `args` es `unknown`, y TypeScript no permite hacer spread (`{...}`) de un valor `unknown` sobre un componente JSX — de ahí los dos errores.

## Primer intento (descartado)

Agregar un parámetro "dummy" solo para darle forma al tipo:

```tsx
return function WithFakeStatus(_props: Record<string, never>) {
```

Esto arreglaba el error de TypeScript, pero introducía una advertencia de ESLint (`no-unused-vars`) porque `_props` nunca se usa dentro de la función. Es un parche que resuelve el síntoma sin mejorar el diseño del HOC.

## Solución aplicada

Se hizo el HOC **genérico** y se le dio un uso real al parámetro de props: reenviarlas al componente envuelto.

```tsx
'use client'

import type { ComponentType } from "react";
import { useFakePending } from "./useFakePending.hook";
import type { SubmitButtonProps } from "./submitButton.component";

export default function withFakeStatus<P extends SubmitButtonProps>(
    WrappedComponent: ComponentType<P>
) {
    return function WithFakeStatus(props: Omit<P, 'pending' | 'onClick'>) {
        const { pending, trigger } = useFakePending(1000);
        return <WrappedComponent {...(props as P)} pending={pending} onClick={trigger} />;
    }
}
```

### Qué significa cada parte

- **`<P extends SubmitButtonProps>`**: el HOC ya no está atado únicamente a `SubmitButton`. Acepta cualquier componente cuyas props incluyan al menos `pending` y `onClick` (las que exige `SubmitButtonProps`). Esto lo hace reutilizable para otros botones similares en el futuro.

- **`Omit<P, 'pending' | 'onClick'>`**: el componente que devuelve el HOC (`WithFakeStatus`) no debe exponer `pending` ni `onClick` como props que el consumidor pueda pasar manualmente, porque esas dos las controla el propio HOC internamente (vía `useFakePending`). El resto de props de `P` (si el componente envuelto tuviera más, ej. `className`, `label`, etc.) sí se pueden pasar.

- **`props: Omit<P, 'pending' | 'onClick'>`**: ahora el parámetro tiene un tipo concreto derivado de las props reales del componente envuelto. Esto es lo que le permite a `StoryFn<typeof SubmitButtonWithFakeStatus>` inferir correctamente el tipo de `args`, resolviendo el error original.

- **`{...(props as P)}`**: se reenvían las props recibidas al componente envuelto. El cast a `P` es necesario porque TypeScript, al usar `Omit`, pierde la relación estructural exacta con `P` (es una limitación conocida de `Omit` con genéricos); en tiempo de ejecución sigue siendo el mismo objeto.

- **`pending={pending} onClick={trigger}`**: se colocan **después** del spread, así que siempre tienen prioridad y sobrescriben cualquier valor que viniera en `props` (aunque, gracias al `Omit`, el tipo ya impide pasarlos desde afuera).

### Por qué es mejor que el primer intento

| | `_props: Record<string, never>` | Versión genérica final |
|---|---|---|
| Resuelve el error de TS | Sí | Sí |
| Genera warning de ESLint | Sí (`no-unused-vars`) | No |
| Reutilizable con otros componentes | No, solo `SubmitButton` | Sí, cualquier `P extends SubmitButtonProps` |
| Reenvía props adicionales del componente envuelto | No | Sí |
| Refleja intención real del HOC | No, es un parche | Sí, tipo describe comportamiento real |

## Verificación

```bash
npx tsc --noEmit -p tsconfig.app.json   # sin errores en submitButton.stories.tsx ni withFakeStatus.hoc.tsx
npx eslint components/buttons/submit/withFakeStatus.hoc.tsx src/stories/Buttons/submitButton.stories.tsx   # sin warnings
```

## Archivos modificados

- `components/buttons/submit/withFakeStatus.hoc.tsx`
