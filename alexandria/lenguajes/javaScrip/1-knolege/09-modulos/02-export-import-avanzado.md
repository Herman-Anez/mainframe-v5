# Export import avanzado

## Reexportaciones (re‑export)

Es posible crear un módulo que actúe como intermediario, reexportando símbolos de otros módulos. Esto es fundamental para el patrón de **barril** (barrel) que centraliza las exportaciones de un directorio.

- Reexportar todo lo nombrado desde otro módulo:
  ```javascript
  export * from './funciones.js';
  ```
  Esto no reexporta la exportación por defecto. Si también se desea reexportar el default, debe hacerse explícitamente.

- Reexportar con renombrado:
  ```javascript
  export { sumar as add } from './matematicas.js';
  ```

- Reexportar el default de otro módulo como named export:
  ```javascript
  export { default as ClasePrincipal } from './Principal.js';
  ```

- Reexportar un named export como default:
  ```javascript
  export { sumar as default } from './operaciones.js';
  ```

- Reexportar el default de otro módulo como default:
  ```javascript
  export { default } from './Modulo.js'; // reexporta el default del otro módulo como default del actual
  // o más corto:
  export { default } from './Modulo.js';
  ```

Las reexportaciones no introducen las variables en el ámbito local del módulo que reexporta (a menos que se haga un `import` y luego un `export`). De esta forma se mantiene la transparencia y se evitan problemas de nombres.

## Agregación (barrel modules)

Un patrón común es agrupar todos los módulos de una carpeta en un único archivo `index.js` que reexporta todo:

```javascript
// components/index.js
export { default as Button } from './Button.js';
export { default as Modal } from './Modal.js';
export * from './helpers.js';
```

Luego, otros módulos importan directamente desde `'./components'`, simplificando las rutas.

## Importación dinámica: `import()`

La función `import(especificador)` devuelve una promesa que se resuelve con el espacio de nombres del módulo solicitado. Permite carga perezosa (lazy loading) y división de código. Puede usarse en cualquier parte del código, no solo en el nivel superior.

```javascript
document.getElementById('btn').addEventListener('click', async () => {
  const { procesar } = await import('./procesar.js');
  procesar();
});
```

- El módulo solicitado se carga de forma asíncrona y solo una vez (caché).
- Se puede usar con `await` o con `.then()`.
- Es compatible con top‑level `import()` en todos los contextos (no requiere `async` para usarse con `then`).
- En navegadores, la ruta se resuelve respecto al módulo que llama a `import()` (o a la URL base si no es un módulo).

## `import.meta`

El objeto `import.meta` expone metadatos sobre el módulo actual. Su contenido es específico del entorno, pero en navegadores y Node.js suele incluir:

- `import.meta.url`: una cadena con la URL absoluta del módulo (por ejemplo, `http://localhost/app.js` o `file:///...`).
- En Node.js, `import.meta` también contiene `import.meta.resolve` (experimental) para resolver especificadores como lo haría `import`.

```javascript
console.log(import.meta.url);
// En navegador: "http://localhost/src/logger.js"
```

`import.meta` es útil para construir rutas de recursos relativos al módulo (por ejemplo, cargar un worker o una imagen).

## Módulos en Workers

Los Web Workers pueden cargarse como módulos añadiendo la opción `{ type: 'module' }`.

```javascript
const worker = new Worker('./worker.js', { type: 'module' });
```

El worker entonces puede usar `import` / `export` normalmente, y se beneficia del ámbito de módulo y del modo estricto automático.

## Declaraciones de importación y hoisting

Aunque las sentencias `import` deben aparecer en el nivel superior, **son izadas (hoisted)**. Esto significa que el motor las procesa antes de ejecutar cualquier código del módulo, independientemente de su posición. Por eso es posible utilizar los valores importados incluso antes de la línea `import` (aunque por estilo se suelen colocar al principio). Este comportamiento es crucial para la resolución de dependencias circulares.

```javascript
console.log(importado); // funciona, porque el import ya fue vinculado
import { importado } from './modulo.js';
```

## Manejo de dependencias circulares

Dos módulos A y B pueden importarse mutuamente. Gracias al hoisting y a las vinculaciones en vivo, esto no produce un error, pero puede generar situaciones donde parte de las exportaciones no estén aún inicializadas.

```javascript
// a.js
import { b } from './b.js';
export const a = 1;
console.log(b); // en este punto, b aún puede estar en TDZ o undefined

// b.js
import { a } from './a.js';
export const b = 2;
console.log(a); // a podría estar aún sin inicializar
```

El motor resuelve las dependencias en orden de carga; si A se ejecuta primero, al leer `b` obtendrá `undefined` porque B todavía no ha completado su evaluación. Las vinculaciones en vivo permiten que posteriormente los valores se actualicen, pero hay que tener cuidado con el acceso durante la fase de inicialización.

## Árbol de dependencias y tree shaking

Los empaquetadores (Webpack, Rollup, Vite, esbuild) analizan estáticamente los `import` y `export` para eliminar código no usado (*tree shaking*). Para que un módulo sea "tree‑shakeable", sus efectos secundarios deben estar claramente indicados. En `package.json`, el campo `sideEffects` declara si el módulo tiene efectos secundarios (o qué archivos los tienen). Un valor `false` indica que la eliminación segura es posible.

```json
{
  "sideEffects": false
}
```

Cuando un módulo reexporta con `export *`, es posible que se incluyan exportaciones no deseadas si el módulo origen no es puro. Los barriles pueden perjudicar el tree shaking si no se configuran adecuadamente.

## Import assertions / Import attributes

Para importar módulos que no son JavaScript (JSON, CSS) se utilizan las aserciones de importación (ahora *import attributes*). La sintaxis añade `with { type: 'json' }` (el estándar actual usa `with` en lugar del anterior `assert`).

```javascript
import datos from './datos.json' with { type: 'json' };
```

En Node.js y navegadores modernos, esto permite importar JSON directamente como módulo, devolviendo el contenido parseado. Para CSS, se utiliza `with { type: 'css' }`, aunque el soporte varía.

Las aserciones son parte estática de la declaración y no se pueden usar con `import()` dinámico de la misma forma (aunque en algunos entornos `import(..., { with: { type: 'json' } })` está soportado). Confirme la compatibilidad según el entorno.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Es6 modules](01-es6-modules.md) | [🏠 Inicio](../index.md) | [Commonjs ▶](03-commonjs.md) |
