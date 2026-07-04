# Commonjs

## Origen y contexto

CommonJS (CJS) es el sistema de módulos adoptado por Node.js desde sus inicios. Antes de ESM, permitió estructurar aplicaciones JavaScript del lado del servidor. Se basa en los objetos `require`, `module` y `exports` que están disponibles en cada archivo gracias a una **función envolvente** (module wrapper).

## `require(id)`

La función `require` carga y ejecuta un módulo y devuelve su `module.exports`. Es **síncrona**: detiene la ejecución hasta que el módulo está completamente cargado y evaluado.

```javascript
const fs = require('fs');
const miModulo = require('./miModulo');
```

### Algoritmo de resolución

`require` sigue una serie de pasos para encontrar el archivo:
1. Si el `id` comienza con `'./'`, `'../'` o `'/'`, se trata como una ruta de archivo relativa o absoluta.
2. Se comprueba si existe un archivo con ese nombre exacto, o con extensiones `.js`, `.json`, `.node` (en orden).
3. Si es un nombre de paquete (sin ruta), se busca en la carpeta `node_modules` del directorio actual, ascendiendo recursivamente hasta la raíz.
4. Una vez encontrado, se comprueba su `package.json` para ver el campo `"main"` (archivo de entrada). Si no existe, se busca un `index.js`.
5. Los módulos nativos de Node.js y los módulos cacheados tienen prioridad.

### Caché de módulos

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

## `module.exports` vs `exports`

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

## El módulo wrapper

Node.js envuelve el código de cada módulo en una función como esta:

```javascript
(function(exports, require, module, __filename, __dirname) {
  // El código del módulo va aquí
});
```

Esto proporciona ámbito privado y define las variables aparentemente globales `require`, `module`, `exports`, `__filename` (ruta absoluta del archivo) y `__dirname` (ruta del directorio). Estas no son variables globales reales, sino parámetros de la función envolvente, por lo que cada módulo tiene sus propios valores.

## `__filename` y `__dirname`

- `__filename`: ruta absoluta del archivo actual.
- `__dirname`: ruta absoluta del directorio que contiene el archivo.

Muy utilizados para referenciar archivos relativos al módulo sin depender del directorio de trabajo (`process.cwd()`). En ESM, estos no están disponibles, pero se pueden recrear usando `import.meta.url` y `fileURLToPath`.

## `require.cache` y `require.resolve`

- `require.cache`: objeto donde se almacenan los módulos cacheados. Es posible manipularlo para invalidar la caché (por ejemplo, en entornos de prueba o recarga en caliente).
- `require.resolve(request)`: devuelve la ruta absoluta resuelta del módulo, sin cargarlo. Útil para verificar existencia o inspeccionar rutas.

## Dependencias circulares en CommonJS

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

## Diferencias clave entre CJS y ESM

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

## Interoperabilidad en Node.js

### ESM importando CJS

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

### CJS usando ESM

`require()` no puede cargar directamente módulos ES. Para consumir un ESM desde CJS se debe usar la función `import()` dinámica (que es asíncrona):

```javascript
// en CJS
(async () => {
  const { default: modulo } = await import('./modulo.mjs');
})();
```

Además, Node.js permite crear una función `require` capaz de cargar ESM mediante `module.createRequire` (aunque con limitaciones). En la práctica, si se necesita interoperabilidad, se suele migrar gradualmente a ESM o se mantiene CJS para las partes que no estén listas.

## Resumen

CommonJS fue el pilar de Node.js durante años y aún se usa extensamente en paquetes npm y aplicaciones existentes. Los módulos ES representan el estándar moderno, con soporte nativo en navegadores y Node.js, y ofrecen beneficios de estática, tree shaking y asincronía. La comprensión de ambos sistemas es fundamental para trabajar con el ecosistema actual, y la migración progresiva desde CJS a ESM es una realidad habitual.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Export import avanzado](02-export-import-avanzado.md) | [🏠 Inicio](../index.md) | [History API ▶](../10-apis-web/01-history-api.md) |
