# Layouts vs. Templates

## Naturaleza de cada uno

|                     | Layout (`layout.js`)                 | Template (`template.js`)              |
|---------------------|---------------------------------------|----------------------------------------|
| Persistencia        | Conserva estado entre navegaciones.   | Se monta/desmonta en cada navegación.  |
| Instancia           | Una sola instancia por segmento.      | Nueva instancia en cada cambio de ruta.|
| Uso principal       | Estructura permanente (nav, footer).  | Animaciones, reseteo de formularios.   |
| Coexistencia        | Puede convivir con template.          | Ídem; se envuelven mutuamente.         |

## Comportamiento en navegación

Dentro del mismo segmento (por ejemplo, `/blog/post-1` → `/blog/post-2`):

- **Layout**: No se vuelve a renderizar completamente; React reutiliza el mismo componente y su estado (hooks) se mantiene. Los efectos (`useEffect`) no se vuelven a ejecutar a menos que cambien dependencias.
- **Template**: Se desmonta y se vuelve a montar completamente. Todos los estados se reinician y los efectos se disparan nuevamente.

## Jerarquía cuando ambos existen

Si en la misma carpeta hay `layout.js` y `template.js`, la composición es:

```
<Layout>
  <Template>
    <Page />
  </Template>
</Layout>
```

El layout sigue siendo persistente; el template es el que se recrea. Esto permite tener una barra lateral persistente (layout) pero que el contenido principal tenga una animación de entrada (template).

## Casos de uso para template

1. **Animaciones de entrada/salida**  
   Con librerías como `framer-motion`, `gsap` o CSS transitions. El montaje/desmontaje del template dispara las animaciones.
   ```tsx
   // app/(shop)/template.tsx
   'use client'
   import { motion } from 'framer-motion'
   
   export default function ShopTemplate({ children }) {
     return (
       <motion.div
         initial={{ opacity: 0, y: 20 }}
         animate={{ opacity: 1, y: 0 }}
         exit={{ opacity: 0, y: -20 }}
         transition={{ duration: 0.3 }}
       >
         {children}
       </motion.div>
     )
   }
   ```

2. **Reset de scroll**  
   Al cambiar de página dentro del mismo layout, el scroll del layout no se resetea. Un template se desmonta, por lo que el scroll del área de contenido vuelve a cero.

3. **Formularios que deben reiniciarse**  
   Si un formulario mantiene estado mediante `useState`, al cambiar de ruta el layout lo preservaría. Con un template, el formulario se monta desde cero.

4. **Re‑ejecución de lógica de entrada**  
   Por ejemplo, registrar una vista de página (analytics) cada vez que se navega, sin tener que ponerlo en cada página.

## Template con datos del servidor

Un template puede ser un Server Component y obtener datos con `fetch`. Sin embargo, esos datos se volverán a solicitar en cada navegación (a menos que la caché del fetch los mantenga). Esto puede ser bueno para contenido que debe estar fresco.

## Elección entre layout y template

- ¿Necesitas que la estructura (nav, sidebar) no pierda su estado al navegar? → `layout.js`.
- ¿Quieres una animación o un reseteo completo del contenido? → `template.js`.
- A menudo se usan ambos: el layout proporciona el esqueleto persistente y el template maneja las transiciones del contenido cambiante.

## Template con `params`

Al igual que los layouts, los templates reciben `params` del segmento donde se encuentran. Son útiles para obtener datos basados en la ruta actual.

## Precauciones

- No uses template si no necesitas el desmontaje; puede generar peticiones de datos innecesarias y perder eficiencia.
- Recuerda que en desarrollo React Strict Mode monta/desmonta componentes dos veces, lo que puede llevar a confusión con templates (se verán las animaciones dos veces). En producción funciona una sola vez.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Composición de Layouts](01-composicion-layouts.md) | [🏠 Inicio](../../index.md) | [Proveedores de Contexto en Layouts ▶](03-providers-context.md) |
