# Exemplo-form: Errores y Soluciones

## 1. Tipo incorrecto en `updateNameAction`

**Problema:**
```ts
updateNameAction: () => void
```
`useActionState` espera una función que reciba el estado anterior y `FormData`, y retorne el nuevo estado. `() => void` no coincide → error de TypeScript.

**Solución:**
```ts
type FormState = { userId: string; name: string; message: string };
type UpdateNameAction = (state: FormState, formData: FormData) => Promise<FormState>;
```

---

## 2. Faltaba archivo `.stories.tsx`

**Problema:** Storybook no tenía historia para renderizar el componente.

**Solución:** Crear `form.stories.tsx` con:
- `Meta<typeof Form>` para tipar el meta
- Mocks async que simulan éxito y error:

```ts
const mockSuccess = async (_state: FormState, _fd: FormData): Promise<FormState> => {
  await new Promise(r => setTimeout(r, 1000));
  return { userId: '1', name: 'Herman', message: 'success' };
};
```

- Story `Default` → acción exitosa
- Story `WithError` → acción con mensaje de error

---

## Patrón para Server Actions en Storybook

`useActionState` es un hook de React 19 diseñado para Next.js Server Actions.
En Storybook no hay servidor, así que la acción se mockea con una función async que imita la firma correcta.

```ts
// firma real de un server action
async function updateName(state: FormState, formData: FormData): Promise<FormState>

// mock en storybook — misma firma, sin servidor
const mock = async (_state: FormState, _fd: FormData): Promise<FormState> => ({
  userId: '1', name: formData.get('name') as string, message: 'success'
});
```
