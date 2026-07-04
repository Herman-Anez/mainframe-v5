# Plantilla sin Persistencia

## Concepto

Similar a `layout.js`, pero **no conserva el estado** entre navegaciones. Cada vez que se navega a una página dentro del segmento, el template se desmonta y se vuelve a montar. Útil para animaciones de entrada/salida, reinicio de formularios o cualquier situación donde se requiera un estado fresco.

## Jerarquía con layout

Si en un mismo segmento existen `layout.js` y `template.js`, la estructura es:
```
<Layout>
  <Template>
    <Page />
  </Template>
</Layout>
```

El layout sigue siendo persistente; el template es el que se recrea.

## Uso

```tsx
// app/(shop)/template.tsx
'use client'
import { motion } from 'framer-motion'

export default function ShopTemplate({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {children}
    </motion.div>
  )
}
```

## Props

Recibe `children` y `params` como un layout.

## Renderizado

- En la primera carga, el template se monta normalmente.
- Al cambiar de ruta dentro del mismo segmento (por ejemplo, de `/shop/products` a `/shop/cart`), React desmonta el viejo template y monta uno nuevo, ejecutando efectos de entrada/salida.
- Si no hay transiciones, se puede prescindir de `template.js` y usar solo `layout.js`.

## Cuándo usarlo

- Animaciones con librerías como Framer Motion que requieren montar/desmontar.
- Recuperar el scroll hasta el inicio al cambiar de página.
- Formularios que deben reiniciarse al navegar.
- Cualquier situación donde sea necesario que `useEffect` se vuelva a ejecutar.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Página 404 por Segmento](06-not-found.md) | [🏠 Inicio](../../index.md) | [API Route Handler ▶](08-route.md) |
