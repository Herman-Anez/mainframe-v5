# Buenas prácticas en formularios React

Independientemente del enfoque elegido, existen patrones y principios que mejoran la calidad, mantenibilidad y experiencia del usuario.

## 1. Centralizar el estado del formulario
Para formularios con múltiples campos, mantén un solo objeto de estado en lugar de múltiples `useState`. Esto facilita la validación y el envío.

```jsx
const [form, setForm] = useState({ username: '', password: '' });

const handleChange = (e) => {
  const { name, value, type, checked } = e.target;
  setForm(prev => ({
    ...prev,
    [name]: type === 'checkbox' ? checked : value,
  }));
};
```
Usa el atributo `name` en los inputs para identificarlos. El manejador es genérico y reutilizable.

## 2. Extraer la lógica en custom hooks
Un hook como `useForm` encapsula estado, manejo de cambios, validación y envío. Puedes construirlo tú o usar librerías.

```jsx
function useForm(initialValues, validate) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (callback) => (e) => {
    e.preventDefault();
    const validationErrors = validate(values);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      callback(values);
    }
  };

  return { values, errors, handleChange, handleSubmit };
}
```

## 3. Validación robusta
- **Validación sincrónica**: reglas simples que se ejecutan en cada cambio o al perder el foco (`onBlur`).
- **Validación asincrónica**: comprobar disponibilidad de nombre de usuario contra un servidor (debounced).
- Muestra los errores cerca del campo correspondiente. No deshabilites el botón de envío si el usuario no ha interactuado aún.
- Utiliza `aria-describedby` para conectar el mensaje de error con el input, mejorando la accesibilidad.

```jsx
<input aria-describedby="error-username" />
{errors.username && <span id="error-username" role="alert">{errors.username}</span>}
```

## 4. Envío y estados de carga
El envío suele ser asíncrono. Gestiona los estados `isSubmitting`, `submitError`, y `submitSuccess`. Deshabilita el botón mientras se envía para evitar doble envío.

```jsx
const [status, setStatus] = useState('idle'); // 'idle' | 'submitting' | 'success' | 'error'

const handleSubmit = async (e) => {
  e.preventDefault();
  setStatus('submitting');
  try {
    await api.enviar(form);
    setStatus('success');
  } catch {
    setStatus('error');
  }
};
```

## 5. Accesibilidad (a11y)
- Asocia etiquetas con `htmlFor` / `id` (o anidando el input dentro del `label`).
- Proporciona mensajes de error con `role="alert"` o `aria-live="polite"` para que los lectores de pantalla los anuncien.
- Asegura que los campos obligatorios se indiquen con `required` y/o `aria-required`.
- Maneja la navegación por teclado y errores de validación en tiempo real de forma no intrusiva.

## 6. Patrones avanzados: Formik, React Hook Form, React 19 Actions
Aunque puedes construir tu propia solución, las librerías ofrecen rendimiento optimizado y APIs probadas:

- **React Hook Form**: usa refs internamente para evitar re-renders masivos, manteniendo una interfaz controlada hacia el exterior. Ideal para formularios grandes.
  ```jsx
  const { register, handleSubmit, formState: { errors } } = useForm();
  <input {...register('username', { required: true, minLength: 3 })} />
  {errors.username && <span>Requerido</span>}
  ```

- **Formik**: maneja estado, validación y envío; más declarativo pero con más re-renders.
- **TanStack Form**: más reciente, con soporte de validación asíncrona y tipado estricto.

En **React 19**, las **Server Actions** y `useActionState`/`useFormStatus` permiten manejar el envío de formularios directamente con funciones del servidor, reduciendo la necesidad de estado local para envíos. Aunque es una novedad, merece atención:
```jsx
import { useFormStatus } from 'react-dom';
function SubmitButton() {
  const { pending } = useFormStatus();
  return <button disabled={pending}>{pending ? 'Enviando...' : 'Enviar'}</button>;
}
```

## 7. Manejo de listas dinámicas de campos
Para formularios que permiten añadir/quitar campos repetibles (ej. varios correos), guarda un arreglo en el estado y mapea los campos con key estable (mejor usar un id único generado para cada fila, no el índice).

```jsx
const [emails, setEmails] = useState([{ id: Date.now(), value: '' }]);
const addEmail = () => setEmails(prev => [...prev, { id: Date.now(), value: '' }]);
const removeEmail = (id) => setEmails(prev => prev.filter(e => e.id !== id));
const changeEmail = (id, value) => setEmails(prev => prev.map(e => e.id === id ? {...e, value} : e));
```

## 8. Manejo de foco y reseteo
- Tras un envío exitoso, puedes mover el foco al primer campo con error o al inicio del formulario.
- Para resetear un formulario controlado, simplemente reinicia el estado a los valores iniciales. Para no controlados, llama `formRef.current.reset()`.

## 9. Compatibilidad con tipos (TypeScript)
Define interfaces para los valores del formulario y los errores. Con librerías como Zod, puedes inferir los tipos desde el esquema de validación.

```tsx
import { z } from 'zod';
const schema = z.object({ username: z.string().min(3) });
type FormData = z.infer<typeof schema>;
// ...
const validate = (data: FormData) => schema.safeParse(data);
```

## 10. Resumen: controlado vs no controlado
| Característica                 | Controlado                          | No controlado                    |
|-------------------------------|-------------------------------------|----------------------------------|
| Fuente de verdad              | Estado de React                     | DOM                              |
| Re-renders al escribir        | Sí (cada pulsación)                 | No                               |
| Validación instantánea        | Fácil y natural                     | Requiere más trabajo manual      |
| Integración con otras librerías | Puede requerir adaptación           | Más directo con refs             |
| Código boilerplate            | Ligeramente mayor                   | Menos (sin estado)               |
| Recomendación general         | Mayoría de casos                    | Campos de archivo, formularios simples, integraciones DOM |

**Regla de oro**: si necesitas reaccionar a cada cambio del usuario (validación en tiempo real, formateo, habilitar/deshabilitar campos), usa controlados. Si solo te importa el valor final al enviar y el rendimiento es crítico, los no controlados (o librerías optimizadas) pueden ser mejores.

---

Con este conocimiento puedes diseñar formularios robustos, accesibles y mantenibles, adaptando el enfoque según las necesidades de cada situación. La clave está en mantener la coherencia y pensar siempre en el usuario y en el flujo de datos.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Componentes no controlados](02-componentes-no-controlados.md) | [🏠 Inicio](../index.md) | [`createContext` y Provider ▶](../08-contexto/01-createcontext-y-provider.md) |
