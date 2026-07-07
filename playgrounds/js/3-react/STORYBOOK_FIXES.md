# Storybook Fix Log

## 1. Extensión `.stories.ts` con JSX

**Problema:** Archivos de historias con JSX tenían extensión `.ts` en vez de `.tsx` (o `.js` en vez de `.jsx`).
Vite no procesa JSX en archivos `.ts`/`.js` → parse error → "Failed to fetch dynamically imported module".

**Solución:** Renombrar a `.tsx` / `.jsx`.

---

## 2. `prop-types` no instalado

**Problema:** `Button.tsx` y `Stack.tsx` usaban `import PropTypes from "prop-types"` pero el paquete no estaba en `package.json`.
Vite fallaba al resolver el import en tiempo de pre-transform.

**Solución:** Eliminar PropTypes y reemplazar con interfaces TypeScript nativas. Cero dependencia extra, mejor type safety.

---

## 3. Template pattern sin tipo `StoryFn`

**Problema:** El patrón CSF2 de template:
```js
const Template = args => <Component {...args} />
export const Story = Template.bind({})
Story.args = { ... }
```
En TypeScript, `Template.bind({})` devuelve una función genérica sin propiedad `.args` → error `[2339]`.

**Solución:** Tipar `Template` con `StoryFn<Args>`:
```ts
const Template: StoryFn<MyArgs> = (args) => <Component {...args} />;
```

---

## 4. Args extra en `Meta<typeof Component>`

**Problema:** Storybook permite args "virtuales" que no existen en los props del componente (ej. `numberOfChildren` en Stack, que el Template usa para generar hijos dinámicamente).
`Meta<typeof Stack>` rechaza estos args en `argTypes` porque no están en los props de Stack.

**Solución:** Usar una interfaz propia en vez de `typeof Component`:
```ts
interface TemplateArgs { numberOfChildren: number; /* + props del componente */ }
const meta: Meta<TemplateArgs> = { ... };
```
Si el componente y `TemplateArgs` son incompatibles en `component:`, castear:
```ts
component: Stack as React.ComponentType<TemplateArgs>,
```

---

## 5. `children` requerido en Stack

**Problema:** `Stack` original (con PropTypes) declaraba `children: any` como requerido.
Al tipar `TemplateArgs` sin `children`, TypeScript rechazaba `component: Stack`.

**Solución:** Hacer `children` opcional en `StackProps`:
```ts
interface StackProps {
  children?: React.ReactNode;
  // ...
}
```

---

## 6. Nombre de story en camelCase

**Problema:** ESLint de Storybook exige PascalCase en exports de historias.
`export const ejemplo1` → warning `[object Object]`.

**Solución:** `export const Ejemplo1`.
