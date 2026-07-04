## 01-es6-modules.md

### Origen y propósito

Los módulos ES (ECMAScript Modules, ESM) se introdujeron en ES2015 para dotar a JavaScript de un sistema de módulos estándar a nivel de lenguaje. Antes de su llegada, la comunidad utilizaba patrones como IIFE, AMD, CommonJS y UMD. Los ESM permiten encapsular código, definir dependencias claras y cargar módulos de forma asíncrona en el navegador.

### Sintaxis básica

#### Exportaciones

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

#### Importaciones

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

### Módulos en el navegador

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

### Comportamiento estático

Los `import` y `export` son **estáticos**: deben estar en el nivel superior del módulo y no pueden estar dentro de condicionales o funciones. Esta restricción permite que las herramientas puedan analizar las dependencias en tiempo de compilación sin ejecutar el código (habilitando *tree shaking* y agrupación eficiente).

### Evaluación única y caché

Cada módulo se evalúa una sola vez. La primera vez que un módulo es importado, se crea un **registro de módulo** (Module Record) y se ejecuta su cuerpo. Las importaciones subsiguientes devuelven el mismo módulo ya evaluado, compartiendo las mismas instancias de las exportaciones. Esto garantiza que los singletons funcionen correctamente.

```javascript
// contador.js
export let contador = 0;
export function incrementar() { contador++; }
```

Si varios módulos importan `contador`, todos verán y modificarán la misma variable.

### Vinculaciones en vivo (live bindings)

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

### Importación dinámica: `import()`

Aunque la sintaxis `import` es estática, existe la función `import()` que devuelve una promesa. Permite cargar módulos bajo demanda (code splitting).

```javascript
const modulo = await import('./dinamico.js');
modulo.funcion();
```

Se trata en detalle en el siguiente archivo.

### Top‑level await (ES2022)

Dentro de un módulo ES se puede usar `await` en el nivel superior, sin necesidad de envolverlo en una función `async`. Esto detiene la ejecución del módulo hasta que la promesa se resuelva, pero también impide que el módulo complete su carga hasta entonces, lo que puede afectar a los módulos que dependan de él. Es una característica potente para inicialización asíncrona.

```javascript
const config = await fetch('/config.json').then(r => r.json());
export const API_URL = config.apiUrl;
```

### Diferencias con scripts clásicos

| Característica               | `<script>` normal          | `<script type="module">` |
|------------------------------|----------------------------|---------------------------|
| Modo estricto                | No por defecto             | Siempre estricto          |
| Ámbito de variables          | Global (window)            | Propio del módulo         |
| Descarga y ejecución         | Bloquea el parseo (si no tiene `async`/`defer`) | Diferida automáticamente (como `defer`) |
| `this` en el nivel superior  | `window`                   | `undefined`               |
| `import` / `export`          | No disponibles             | Disponibles               |
| URL de recursos              | Resueltas respecto al documento | Resueltas respecto al módulo |

---

## 02-export-import-avanzado.md

### Reexportaciones (re‑export)

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

### Agregación (barrel modules)

Un patrón común es agrupar todos los módulos de una carpeta en un único archivo `index.js` que reexporta todo:

```javascript
// components/index.js
export { default as Button } from './Button.js';
export { default as Modal } from './Modal.js';
export * from './helpers.js';
```

Luego, otros módulos importan directamente desde `'./components'`, simplificando las rutas.

### Importación dinámica: `import()`

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

### `import.meta`

El objeto `import.meta` expone metadatos sobre el módulo actual. Su contenido es específico del entorno, pero en navegadores y Node.js suele incluir:

- `import.meta.url`: una cadena con la URL absoluta del módulo (por ejemplo, `http://localhost/app.js` o `file:///...`).
- En Node.js, `import.meta` también contiene `import.meta.resolve` (experimental) para resolver especificadores como lo haría `import`.

```javascript
console.log(import.meta.url);
// En navegador: "http://localhost/src/logger.js"
```

`import.meta` es útil para construir rutas de recursos relativos al módulo (por ejemplo, cargar un worker o una imagen).

### Módulos en Workers

Los Web Workers pueden cargarse como módulos añadiendo la opción `{ type: 'module' }`.

```javascript
const worker = new Worker('./worker.js', { type: 'module' });
```

El worker entonces puede usar `import` / `export` normalmente, y se beneficia del ámbito de módulo y del modo estricto automático.

### Declaraciones de importación y hoisting

Aunque las sentencias `import` deben aparecer en el nivel superior, **son izadas (hoisted)**. Esto significa que el motor las procesa antes de ejecutar cualquier código del módulo, independientemente de su posición. Por eso es posible utilizar los valores importados incluso antes de la línea `import` (aunque por estilo se suelen colocar al principio). Este comportamiento es crucial para la resolución de dependencias circulares.

```javascript
console.log(importado); // funciona, porque el import ya fue vinculado
import { importado } from './modulo.js';
```

### Manejo de dependencias circulares

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

### Árbol de dependencias y tree shaking

Los empaquetadores (Webpack, Rollup, Vite, esbuild) analizan estáticamente los `import` y `export` para eliminar código no usado (*tree shaking*). Para que un módulo sea "tree‑shakeable", sus efectos secundarios deben estar claramente indicados. En `package.json`, el campo `sideEffects` declara si el módulo tiene efectos secundarios (o qué archivos los tienen). Un valor `false` indica que la eliminación segura es posible.

```json
{
  "sideEffects": false
}
```

Cuando un módulo reexporta con `export *`, es posible que se incluyan exportaciones no deseadas si el módulo origen no es puro. Los barriles pueden perjudicar el tree shaking si no se configuran adecuadamente.

### Import assertions / Import attributes

Para importar módulos que no son JavaScript (JSON, CSS) se utilizan las aserciones de importación (ahora *import attributes*). La sintaxis añade `with { type: 'json' }` (el estándar actual usa `with` en lugar del anterior `assert`).

```javascript
import datos from './datos.json' with { type: 'json' };
```

En Node.js y navegadores modernos, esto permite importar JSON directamente como módulo, devolviendo el contenido parseado. Para CSS, se utiliza `with { type: 'css' }`, aunque el soporte varía.

Las aserciones son parte estática de la declaración y no se pueden usar con `import()` dinámico de la misma forma (aunque en algunos entornos `import(..., { with: { type: 'json' } })` está soportado). Confirme la compatibilidad según el entorno.

---

## 03-commonjs.md

### Origen y contexto

CommonJS (CJS) es el sistema de módulos adoptado por Node.js desde sus inicios. Antes de ESM, permitió estructurar aplicaciones JavaScript del lado del servidor. Se basa en los objetos `require`, `module` y `exports` que están disponibles en cada archivo gracias a una **función envolvente** (module wrapper).

### `require(id)`

La función `require` carga y ejecuta un módulo y devuelve su `module.exports`. Es **síncrona**: detiene la ejecución hasta que el módulo está completamente cargado y evaluado.

```javascript
const fs = require('fs');
const miModulo = require('./miModulo');
```

#### Algoritmo de resolución

`require` sigue una serie de pasos para encontrar el archivo:
1. Si el `id` comienza con `'./'`, `'../'` o `'/'`, se trata como una ruta de archivo relativa o absoluta.
2. Se comprueba si existe un archivo con ese nombre exacto, o con extensiones `.js`, `.json`, `.node` (en orden).
3. Si es un nombre de paquete (sin ruta), se busca en la carpeta `node_modules` del directorio actual, ascendiendo recursivamente hasta la raíz.
4. Una vez encontrado, se comprueba su `package.json` para ver el campo `"main"` (archivo de entrada). Si no existe, se busca un `index.js`.
5. Los módulos nativos de Node.js y los módulos cacheados tienen prioridad.

#### Caché de módulos

Los módulos se evalúan una sola vez. La primera vez que se requiere un módulo, se ejecuta y su `module.exports` se guarda en `require.cache`. Las llamadas posteriores devuelven la misma referencia sin volver a ejecutar el código.

```javascript
// a.js
module.exports = { valor: 1 };

// main.js
const a1 = require('./a');
a1.valor = 5;
const a2 = require('./a');
console.log(a2.valor); // 5 (misma referencia)
```

### `module.exports` vs `exports`

Cada archivo es envuelto en una función que recibe `exports, require, module, __filename, __dirname`. Inicialmente, `module.exports` es un objeto vacío y `exports` es una referencia a ese mismo objeto. Por lo tanto, añadir propiedades a `exports` funciona para exportar valores:

```javascript
exports.sumar = (a, b) => a + b;
exports.PI = 3.1416;
```

Pero si se reasigna `exports` directamente, se rompe el enlace con `module.exports`, y las exportaciones se pierden:

```javascript
exports = function() { ... }; // INCORRECTO: module.exports sigue siendo {}
```

Para exportar una función, clase u objeto como el valor principal del módulo, **siempre** se debe asignar a `module.exports`:

```javascript
module.exports = function() { ... };
// o
module.exports = class Persona { ... };
```

La confusión entre ambos es una fuente común de errores.

### El módulo wrapper

Node.js envuelve el código de cada módulo en una función como esta:

```javascript
(function(exports, require, module, __filename, __dirname) {
  // El código del módulo va aquí
});
```

Esto proporciona ámbito privado y define las variables aparentemente globales `require`, `module`, `exports`, `__filename` (ruta absoluta del archivo) y `__dirname` (ruta del directorio). Estas no son variables globales reales, sino parámetros de la función envolvente, por lo que cada módulo tiene sus propios valores.

### `__filename` y `__dirname`

- `__filename`: ruta absoluta del archivo actual.
- `__dirname`: ruta absoluta del directorio que contiene el archivo.

Muy utilizados para referenciar archivos relativos al módulo sin depender del directorio de trabajo (`process.cwd()`). En ESM, estos no están disponibles, pero se pueden recrear usando `import.meta.url` y `fileURLToPath`.

### `require.cache` y `require.resolve`

- `require.cache`: objeto donde se almacenan los módulos cacheados. Es posible manipularlo para invalidar la caché (por ejemplo, en entornos de prueba o recarga en caliente).
- `require.resolve(request)`: devuelve la ruta absoluta resuelta del módulo, sin cargarlo. Útil para verificar existencia o inspeccionar rutas.

### Dependencias circulares en CommonJS

Dado que `require` es síncrono y ejecuta el módulo inmediatamente, las dependencias circulares pueden causar que un módulo reciba una **versión parcial** de las exportaciones del otro.

```javascript
// a.js
console.log('a: antes de require(b)');
const b = require('./b');
module.exports = { nombre: 'A' };
console.log('a: después de require(b)');

// b.js
console.log('b: antes de require(a)');
const a = require('./a');
module.exports = { nombre: 'B' };
console.log(`b: a.nombre = ${a.nombre}`);
```

Si se ejecuta `node a.js`, la salida sería algo como:
```
a: antes de require(b)
b: antes de require(a)
b: a.nombre = undefined
b: después de require(a)
a: después de require(b)
```

Cuando `b.js` requiere `a.js`, este aún no ha terminado su ejecución, por lo que `module.exports` de `a` todavía es `{}` (el valor por defecto). `a.nombre` es `undefined`. Después de que `a.js` termine, su `module.exports` se actualiza con `{ nombre: 'A' }`, pero `b.js` ya retuvo una referencia al objeto anterior si lo almacenó. Sin embargo, si `b` hubiera capturado la referencia al objeto de `module.exports` y este se hubiera mutado (agregando propiedades), sí vería los cambios. Con asignación directa se pierde el vínculo.

### Diferencias clave entre CJS y ESM

| Aspecto                | CommonJS                        | ES Modules                       |
|------------------------|---------------------------------|----------------------------------|
| Sintaxis               | `require()` / `module.exports`  | `import` / `export`              |
| Naturaleza             | Dinámica (se puede condicionar) | Estática (aunque con `import()` dinámico) |
| Tiempo de enlace       | En ejecución (síncrono)         | En compilación (con enlace estático) |
| Carga                  | Síncrona (bloquea el hilo)      | Asíncrona (navegador) / síncrona (Node) pero con fase de análisis |
| Vinculación de export  | Copia de valores (primitivos), referencia compartida (objetos) | Vinculaciones en vivo (siempre referencia) |
| Ámbito global `this`   | `this` == `module.exports` (en nivel superior) | `this` == `undefined`            |
| Soporte nativo (Node)  | Sí, desde siempre               | Sí, desde v12 con flag, estable desde v14 |
| `__filename`/`__dirname`| Disponibles                     | No disponibles directamente (se obtienen con `import.meta.url`) |
| Exportación por defecto| No existe concepto, es simplemente `module.exports` | Sí, con sintaxis `export default` |
| Interoperabilidad      | ESM puede importar CJS (con limitaciones) | CJS no puede importar ESM con `require`; debe usar `import()` dinámico |

### Interoperabilidad en Node.js

#### ESM importando CJS

Cuando un módulo ES importa un módulo CommonJS, Node.js proporciona automáticamente un enlace `default` con el valor de `module.exports`. Las exportaciones con nombre **no** se generan a menos que se use un análisis estático (por ejemplo, con la librería `cjs-module-lexer`). Por tanto, se recomienda:

```javascript
// modulo.cjs
module.exports = { a: 1, b: 2 };

// en ESM
import cjs from './modulo.cjs';  // cjs = { a: 1, b: 2 }
const { a, b } = cjs;
// No se recomienda: import { a, b } from './modulo.cjs'  (puede no funcionar)
```

Node.js intenta inferir exportaciones con nombre para algunos módulos CJS (cuando detecta asignaciones a `exports.nombrado`), pero la compatibilidad no es perfecta. Para código nuevo, es preferible usar solo ESM.

#### CJS usando ESM

`require()` no puede cargar directamente módulos ES. Para consumir un ESM desde CJS se debe usar la función `import()` dinámica (que es asíncrona):

```javascript
// en CJS
(async () => {
  const { default: modulo } = await import('./modulo.mjs');
})();
```

Además, Node.js permite crear una función `require` capaz de cargar ESM mediante `module.createRequire` (aunque con limitaciones). En la práctica, si se necesita interoperabilidad, se suele migrar gradualmente a ESM o se mantiene CJS para las partes que no estén listas.

### Resumen

CommonJS fue el pilar de Node.js durante años y aún se usa extensamente en paquetes npm y aplicaciones existentes. Los módulos ES representan el estándar moderno, con soporte nativo en navegadores y Node.js, y ofrecen beneficios de estática, tree shaking y asincronía. La comprensión de ambos sistemas es fundamental para trabajar con el ecosistema actual, y la migración progresiva desde CJS a ESM es una realidad habitual.

---
