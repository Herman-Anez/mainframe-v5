# Hooks experimentales: `use`

A partir de React 18 (canary) y consolidándose en React 19, se introduce el hook `use`, que representa un cambio de paradigma: permite leer recursos asíncronos (promesas) y contextos **dentro del render** sin necesidad de `useEffect` o `useContext` para casos particulares. Rompe la regla de que los hooks no pueden ser llamados condicionalmente (es decir, `use` **sí** puede ser llamado dentro de condicionales o bucles, aunque en realidad no es técnicamente un hook sino una función especial que React reconoce).

## `use(promise)` para Suspense
`use` puede "desenvolver" una promesa en el render. Si la promesa no está resuelta, **suspende** el componente, permitiendo que React muestre un `fallback` de Suspense mientras la promesa se resuelve. Una vez resuelta, React reanuda el render y el valor está disponible.

```jsx
import { use, Suspense } from 'react';

function Note({ id }) {
  const note = use(fetch(`/api/notes/${id}`).then(res => res.json()));
  return <div>{note.title}</div>;
}

function App() {
  return (
    <Suspense fallback={<p>Cargando...</p>}>
      <Note id={1} />
    </Suspense>
  );
}
```

No necesitas estado, efecto, ni limpieza; el componente simplemente lee el valor. Esto simplifica enormemente el data fetching cuando se combina con frameworks como Next.js App Router o Remix, que proporcionan la infraestructura de caché y streaming.

## `use(context)` para consumir Contexto
`use` también puede leer un contexto, pero a diferencia de `useContext`, **puede ser llamado condicionalmente** y dentro de bucles. Esto permite patrones antes imposibles sin dividir componentes.

```jsx
function ListItem({ item }) {
  if (item.special) {
    const theme = use(ThemeContext);
    return <li style={{ background: theme.specialBg }}>{item.name}</li>;
  }
  return <li>{item.name}</li>;
}
```

Internamente, `use` se integra con el mecanismo de Suspense y el algoritmo de reconciliación. La lectura condicional es posible porque React rastrea el orden de las lecturas mediante una estructura más flexible que la lista enlazada de hooks tradicionales.

## Reglas de `use`
- Puede ser llamado condicionalmente y en bucles.
- Solo puede ser llamado desde componentes o hooks personalizados (aunque técnicamente es una función, se espera que se use dentro del render).
- Si la promesa o el contexto cambian, React re-ejecuta el render.
- No reemplaza `useEffect` para efectos secundarios (suscripciones, mutaciones manuales). `use` es para **leer** recursos, no para ejecutar lógica imperativa.

## Otros hooks experimentales relacionados
- **`useOptimistic`**: para actualizaciones optimistas en formularios (disponible en React 19). Permite actualizar la UI antes de que el servidor confirme el cambio, con rollback automático.
- **`useFormStatus`**: expone el estado de envío de un formulario en el contexto de un `form` action.
- **`useActionState`** (antes `useFormState`): para manejar el estado y la acción de formularios con Server Actions.

Estos hooks representan la dirección futura de React hacia una integración más profunda con el servidor y la simplificación del data fetching asincrónico. Aunque aún pueden ser canary, marcan la evolución del modelo de componentes.

---

Con estos temas, completamos la inmersión en los hooks. Desde el uso quirúrgico de `useLayoutEffect` hasta la creación de nuestras propias abstracciones y el vistazo al futuro con `use`, ahora tienes un dominio completo del sistema que da vida a los componentes funcionales.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Custom Hooks (Hooks personalizados)](11-custom-hooks-hooks-personalizados.md) | [🏠 Inicio](../index.md) | [Virtual DOM ▶](../05-renderizado-y-reconciliacion/01-virtual-dom.md) |
