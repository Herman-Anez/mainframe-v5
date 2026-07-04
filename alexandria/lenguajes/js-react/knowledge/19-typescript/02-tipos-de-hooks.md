# Tipos de hooks

## `useState`
TypeScript infiere el tipo del estado a partir del valor inicial. Si el estado puede ser de varios tipos o el valor inicial no proporciona suficiente información, debes especificarlo manualmente.

```tsx
const [count, setCount] = useState(0); // inferido: number

// Con unión de tipos
const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

// Con objeto o array complejo: mejor crear una interfaz
interface User {
  name: string;
  age: number;
}
const [user, setUser] = useState<User | null>(null); // necesario anotar porque null no infiere User

// Lazy initializer: se tipa igual
const [data] = useState<HeavyData>(() => computeExpensive());
```

## `useReducer`
El reducer y el estado se tipan fuertemente. Lo habitual es crear tipos para el estado y las acciones (unión discriminada).

```tsx
type State = { count: number; step: number };
type Action =
  | { type: 'INCREMENT' }
  | { type: 'DECREMENT' }
  | { type: 'SET_STEP'; payload: number };

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'INCREMENT':
      return { ...state, count: state.count + state.step };
    case 'DECREMENT':
      return { ...state, count: state.count - state.step };
    case 'SET_STEP':
      return { ...state, step: action.payload };
    default:
      return state;
  }
};

const [state, dispatch] = useReducer(reducer, { count: 0, step: 1 });
```

TypeScript garantizará que el switch sea exhaustivo si usas una unión discriminada adecuada.

## `useRef`
Tiene tres usos principales y cada uno se tipa de manera distinta.

**1. Referencia al DOM (ref de solo lectura):**
```tsx
const inputRef = useRef<HTMLInputElement>(null); // solo lectura (ref atributo)
```
Inicialízalo con `null`. TypeScript asigna automáticamente `RefObject<HTMLInputElement>` (solo lectura). No puedes asignar un nuevo valor a `.current` excepto a través de React (al pasarlo como `ref`). Si intentas `inputRef.current = ...` da error.

**2. Referencia mutable (sin DOM):**
```tsx
const intervalRef = useRef<number | null>(null);
```
Si lo inicializas con un valor que no es `null` y el tipo no incluye `null`, entonces es mutable. Por ejemplo:
```tsx
const countRef = useRef(0); // MutableRefObject<number>
countRef.current = 5; // permitido
```
La diferencia está en que si el valor inicial coincide con el tipo, se considera mutable; si es `null` y el tipo es `HTMLDivElement | null`, es ref de solo lectura.

**Regla práctica:** para referencias DOM, `useRef<HTMLElement>(null)`. Para almacenar un valor mutable, define el tipo sin `null` y usa el valor inicial correspondiente, o define la unión si puede ser nulo temporalmente.

## `useEffect` y `useLayoutEffect`
No requieren tipado explícito, pero TypeScript verifica el array de dependencias con la regla de ESLint. La función retorna un `void` o una función de limpieza.

## `useMemo` / `useCallback`
El tipo se infiere del valor devuelto por la función. Si se necesita especificar porque la función puede devolver varios tipos, se puede anotar:
```tsx
const value = useMemo<string[]>(() => items.map(i => i.name), [items]);
const handler = useCallback((id: number) => { ... }, [deps]);
```
En la mayoría de casos, la inferencia funciona.

## `useId`
Devuelve `string`, así que simplemente `const id = useId();`.

## `useContext`
El tipo proviene del contexto creado con `createContext`. Especifica el tipo en el genérico al crearlo, y `useContext` lo inferirá automáticamente.

```tsx
interface Theme {
  mode: 'light' | 'dark';
  toggle: () => void;
}
const ThemeContext = createContext<Theme | null>(null);

function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme debe usarse dentro de ThemeProvider');
  return context; // Theme
}
```

## `useImperativeHandle`
Se tipa con `forwardRef`. La interfaz del handle se pasa como primer parámetro de tipo en `forwardRef`.

```tsx
export interface FancyInputHandle {
  focus: () => void;
  clear: () => void;
}

const FancyInput = forwardRef<FancyInputHandle, FancyInputProps>((props, ref) => {
  const inputRef = useRef<HTMLInputElement>(null);
  useImperativeHandle(ref, () => ({
    focus: () => inputRef.current?.focus(),
    clear: () => { if (inputRef.current) inputRef.current.value = ''; },
  }));
  return <input ref={inputRef} {...props} />;
});
```

## Custom hooks
Se tipan como funciones normales: declaras los tipos de los parámetros y del valor retornado. TypeScript lo comprueba en el componente que los usa.

```tsx
function useToggle(initial = false): [boolean, () => void] {
  const [value, setValue] = useState(initial);
  const toggle = useCallback(() => setValue(v => !v), []);
  return [value, toggle];
}
```

A veces es más claro devolver un objeto:
```tsx
function useUser(id: string) {
  // ... fetching
  return { user, loading, error } as const; // as const para tuplas estrechas
}
```

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Tipado de props y eventos](01-tipado-de-props-y-eventos.md) | [🏠 Inicio](../index.md) | [Componentes genéricos ▶](03-componentes-genericos.md) |
