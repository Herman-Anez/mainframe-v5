# Es6 modules

## Origen y propósito

Los módulos ES (ECMAScript Modules, ESM) se introdujeron en ES2015 para dotar a JavaScript de un sistema de módulos estándar a nivel de lenguaje. Antes de su llegada, la comunidad utilizaba patrones como IIFE, AMD, CommonJS y UMD. Los ESM permiten encapsular código, definir dependencias claras y cargar módulos de forma asíncrona en el navegador.

## Sintaxis básica

### Exportaciones

Un módulo puede exportar valores (variables, funciones, clases) usando las palabras clave `export`:

- **Exportación con nombre (named export)**: se puede hacer en línea o en bloque.
  ```javascript
  // inline
  export const PI = 3.1416;
  export function sumar(a, b) { return a + b; }
  
  // en bloque
  const autor = 'Ana';
  const version = '1.0.0';
  export { autor, version };
  ```

- **Exportación por defecto (default export)**: un módulo puede tener como máximo una exportación por defecto.
  ```javascript
  export default class Usuario { ... }
  // o bien
  export default function() { ... } // función anónima
  // o posterior
  const dato = 42;
  export { dato as default };
  ```

Las exportaciones con nombre permiten exportar múltiples valores, mientras que la exportación por defecto es ideal para un valor principal (por ejemplo, una clase o función componente). Ambas pueden convivir en el mismo módulo.

### Importaciones

La sintaxis `import` permite traer los valores exportados desde otros módulos:

- **Importación de exportaciones con nombre**:
  ```javascript
  import { sumar, PI } from './matematicas.js';
  ```

- **Importación con alias**: se puede renombrar para evitar colisiones.
  ```javascript
  import { sumar as add } from './operaciones.js';
  ```

- **Importación del espacio de nombres completo (namespace import)**:
  ```javascript
  import * as mat from './matematicas.js';
  console.log(mat.PI);
  ```

- **Importación de la exportación por defecto**: no necesita llaves y se puede nombrar libremente.
  ```javascript
  import Usuario from './Usuario.js';
  ```

- **Importación combinada** (por defecto + con nombre):
  ```javascript
  import Usuario, { PI, sumar } from './modulo.js';
  ```

- **Importación solo por efectos secundarios**: cuando el módulo solo ejecuta código y no necesitamos sus exportaciones.
  ```javascript
  import './estilos.css';
  import './inicializador.js';
  ```

## Módulos en el navegador

Para utilizar módulos ES en el navegador se emplea la etiqueta `<script type="module">`.

```html
<script type="module" src="app.js"></script>
```

Características de este tipo de scripts:
- Se comportan como si tuvieran `defer` por defecto: se descargan en paralelo y se ejecutan en orden, una vez que el HTML ha sido completamente parseado.
- El código se ejecuta en modo estricto automáticamente.
- Las rutas de los `import` deben ser relativas o absolutas (no se permite "bare imports" como `import 'lodash'` a menos que se use un import map).
- No se permite `eval` ni `new Function` en el ámbito global del módulo (afecta a la seguridad).
- Los módulos tienen su propio ámbito; las variables declaradas en el nivel superior no se convierten en propiedades del objeto `window`.

## Comportamiento estático

Los `import` y `export` son **estáticos**: deben estar en el nivel superior del módulo y no pueden estar dentro de condicionales o funciones. Esta restricción permite que las herramientas puedan analizar las dependencias en tiempo de compilación sin ejecutar el código (habilitando *tree shaking* y agrupación eficiente).

## Evaluación única y caché

Cada módulo se evalúa una sola vez. La primera vez que un módulo es importado, se crea un **registro de módulo** (Module Record) y se ejecuta su cuerpo. Las importaciones subsiguientes devuelven el mismo módulo ya evaluado, compartiendo las mismas instancias de las exportaciones. Esto garantiza que los singletons funcionen correctamente.

```javascript
// contador.js
export let contador = 0;
export function incrementar() { contador++; }
```

Si varios módulos importan `contador`, todos verán y modificarán la misma variable.

## Vinculaciones en vivo (live bindings)

Las exportaciones con nombre de ESM no son copias del valor en el momento de la exportación, sino **referencias en vivo**. Si el módulo exportador modifica internamente una variable exportada, el módulo importador verá el valor actualizado. Sin embargo, desde el módulo importador las variables importadas son de solo lectura: no se pueden reasignar (se lanzaría un `TypeError`).

```javascript
// modulo.js
export let x = 1;
export function incrementar() { x++; }

// main.js
import { x, incrementar } from './modulo.js';
console.log(x); // 1
incrementar();
console.log(x); // 2 (vínculo vivo)
x = 5; // TypeError: Assignment to constant variable.
```

Las exportaciones por defecto, al ser básicamente una exportación con nombre bajo el nombre `default`, también se comportan como vínculos vivos si detrás hay una variable, aunque si se exporta directamente un valor literal, el vínculo pierde sentido.

## Importación dinámica: `import()`

Aunque la sintaxis `import` es estática, existe la función `import()` que devuelve una promesa. Permite cargar módulos bajo demanda (code splitting).

```javascript
const modulo = await import('./dinamico.js');
modulo.funcion();
```

Se trata en detalle en el siguiente archivo.

## Top‑level await (ES2022)

Dentro de un módulo ES se puede usar `await` en el nivel superior, sin necesidad de envolverlo en una función `async`. Esto detiene la ejecución del módulo hasta que la promesa se resuelva, pero también impide que el módulo complete su carga hasta entonces, lo que puede afectar a los módulos que dependan de él. Es una característica potente para inicialización asíncrona.

```javascript
const config = await fetch('/config.json').then(r => r.json());
export const API_URL = config.apiUrl;
```

## Diferencias con scripts clásicos

| Característica               | `<script>` normal          | `<script type="module">` |
|------------------------------|----------------------------|---------------------------|
| Modo estricto                | No por defecto             | Siempre estricto          |
| Ámbito de variables          | Global (window)            | Propio del módulo         |
| Descarga y ejecución         | Bloquea el parseo (si no tiene `async`/`defer`) | Diferida automáticamente (como `defer`) |
| `this` en el nivel superior  | `window`                   | `undefined`               |
| `import` / `export`          | No disponibles             | Disponibles               |
| URL de recursos              | Resueltas respecto al documento | Resueltas respecto al módulo |

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Web storage](../08-dom-y-eventos/06-web-storage.md) | [🏠 Inicio](../index.md) | [Export import avanzado ▶](02-export-import-avanzado.md) |
