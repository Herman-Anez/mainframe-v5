## TS 5.0 – La consolidación de ECMAScript Decorators y el sistema de tipos moderno

TypeScript 5.0, lanzado en marzo de 2023, fue un hito por su soporte completo para los decoradores estándar de ECMAScript, la mejora de enums, la nueva sintaxis para tipos y módulos, y una reestructuración interna que redujo el tamaño del paquete y mejoró la velocidad. A continuación desglosamos cada novedad.

### Decoradores estándar (TC39 Stage 3)

TypeScript 5.0 implementa la propuesta oficial de decoradores, diferente de los decoradores experimentales que existían bajo `--experimentalDecorators`. Los nuevos decoradores **no requieren bandera especial** y siguen la especificación ECMAScript.

```ts
function log(target: Function, context: ClassDecoratorContext) {
  console.log(`Clase ${context.name} decorada`);
}

@log
class MiClase {}
```

- Se aplican a clases, métodos, campos, getters/setters y auto-accessors.
- Reciben el valor decorado y un objeto de contexto con metadatos.
- Los decoradores pueden retornar un nuevo descriptor o un valor inicial para campos.
- Los decoradores de método pueden retornar un reemplazo de método.
- Soporte para `context.addInitializer(function)`, que ejecuta una función al final de la construcción.

**Decoradores de campos**:

```ts
function uppercase(initial: string, context: ClassFieldDecoratorContext) {
  return initial.toUpperCase();
}

class Persona {
  @uppercase
  nombre = "ana";
}
```

**Decoradores de método**:

```ts
function bound(_target: any, context: ClassMethodDecoratorContext) {
  const methodName = context.name;
  context.addInitializer(function (this: any) {
    this[methodName] = this[methodName].bind(this);
  });
}

class Componente {
  @bound
  onClick() {
    console.log(this);
  }
}
```

**Auto-accessors** (otra característica nueva ligada a los decoradores): una sintaxis simplificada para getter/setter que almacena el valor en un campo privado interno. Se declaran con la palabra clave `accessor`:

```ts
class Test {
  accessor x = 10;
}
// Compila a un getter/setter con respaldo privado
```

Los decoradores pueden interceptar auto-accessors para transformar el acceso.

### Parámetros de tipo `const`

Una pequeña pero potente mejora: se puede declarar un parámetro de tipo genérico con `const` para que infiera los literales como si hubiéramos usado `as const`.

```ts
function recoger<const T extends readonly string[]>(valores: T): T {
  return valores;
}

const resultado = recoger(["a", "b"]);
// resultado es de tipo readonly ["a", "b"], no string[]
```

Esto evita tener que escribir `as const` en cada llamada y captura la tupla literal directamente.

### Enums como uniones de sus miembros

A partir de TS 5.0 todas las enums se tratan como uniones de sus miembros, no solo las enums de cadena. Anteriormente las enums numéricas no se consideraban uniones. Ahora:

```ts
enum Color {
  Rojo,
  Verde
}

function pintar(c: Color) {
  if (c === Color.Rojo) {
    // c es Color.Rojo
  }
}
```

Esto hace que las enums sean más seguras y que el narrowing funcione de forma consistente. Los enums con valores calculados también se benefician, aunque no se pueden discriminar igual si el valor no es conocido en compilación.

### `export type *` y `verbatimModuleSyntax`

- `export type * from './mod'` permite reexportar únicamente los tipos de un módulo, sin incluir valores. Ideal para barriles de solo tipos sin emitir código.
- `verbatimModuleSyntax` es una nueva opción que obliga a marcar explícitamente todas las importaciones/exportaciones de tipo con `import type` o `export type`. Cuando se activa, TypeScript ya no aplica la elisión automática de imports que solo se usan como tipos, eliminando ambigüedades y alineándose con el comportamiento de Babel/esbuild. Esto es especialmente útil en módulos ES puros.

```json
{
  "compilerOptions": {
    "verbatimModuleSyntax": true,
    "module": "NodeNext"
  }
}
```

Con esta bandera, cualquier `import { Foo } from './mod'` donde `Foo` es una interfaz dará error si no usas `import type`.

### Resolución de módulos `bundler`

Nueva estrategia `moduleResolution: "bundler"` diseñada para empaquetadores como Webpack, Vite, esbuild, etc. Es similar a `node16` en cuanto a soporte de `exports` y condiciones, pero **no requiere extensiones** en las importaciones relativas (p.ej., puedes importar sin `.js`), y resuelve de forma más laxa los puntos de entrada de paquetes. Es ideal para aplicaciones frontend.

### `allowImportingTsExtensions`

Permite que los archivos TypeScript importen otros archivos con la extensión `.ts`/`.tsx` directamente en el código fuente, algo necesario para algunas configuraciones de Node.js con loaders o cuando se emiten con la misma extensión. Se usa combinado con `noEmit` o `emitDeclarationOnly`, porque no se puede emitir JS con extensión `.ts`. A menudo se combina con `--moduleResolution bundler`.

```ts
import { algo } from './modulo.ts'; // Solo válido con allowImportingTsExtensions
```

### Soporte para `resolvePackageJsonExports` y `resolvePackageJsonImports`

Por defecto activos en `node16`, `nodenext` y `bundler`, TypeScript 5.0 mejora el respeto a los campos `exports` e `imports` de `package.json`, incluyendo condiciones como `types`, `import`, `require`. Esto facilita la publicación y consumo de paquetes duales.

### Mejoras en JSDoc

- `@overload` para declarar sobrecargas en JavaScript.
- `@satisfies` (equivalente a `satisfies` de TS 4.9).
- Mejor soporte para plantillas de tipo en JSDoc.

### Rendimiento y tamaño

- TypeScript 5.0 se reescribió para usar **módulos internos de ECMAScript**, reduciendo el tamaño del paquete en un 30-40% y mejorando los tiempos de instalación.
- El compilador es más rápido en proyectos grandes gracias a optimizaciones en la resolución de tipos y la carga de archivos.

### Otros

- `--suppressImplicitAnyIndexErrors` fue eliminado.
- Mejoras en exhaustividad de comprobaciones de tipos.
- Nuevas opciones en `moduleDetection`.

## TS 4.9 – El operador `satisfies` y otras mejoras cotidianas

TypeScript 4.9 (noviembre de 2022) introdujo herramientas que refinan la inferencia y el narrowing, mejorando la experiencia diaria.

### Operador `satisfies`

`expresion satisfies Tipo` comprueba que la expresión cumple con el tipo, pero **mantiene el tipo inferido más específico**. Es la solución al dilema de perder literales al anotar:

```ts
const config = {
  api: "https://api.ejemplo.com",
  retry: 3
} satisfies { api: string; retry: number };

// config.api sigue siendo "https://api.ejemplo.com" (literal), no string.
```

También permite validar objetos contra un tipo y conservar la información detallada:

```ts
type Routes = Record<string, { path: string; component: string }>;

const routes = {
  home: { path: "/", component: "Home" },
  about: { path: "/about", component: "About" }
} satisfies Routes;

// routes.home.path es "/" literal, no string.
```

Es especialmente útil para objetos de configuración y literales de cadenas que necesitan cumplir un contrato sin volverse opacos.

### Estrechamiento con `in` para `switch` y propiedades no listadas

TypeScript 4.9 amplió el uso del operador `in` como comprobación de narrowing en contextos más amplios, incluso cuando la propiedad no está en la lista de propiedades conocidas. Ahora es más seguro.

### Comprobación de `NaN` en tipos

Se pueden escribir funciones que retornen `number` pero que al ser comparadas con `NaN` el narrowing no funciona como con otros valores (porque `NaN !== NaN`). TS 4.9 añade soporte para `if (val === Number.NaN)` y `if (Number.isNaN(val))` para estrechar correctamente.

### `auto-accessor` (soporte parcial para la propuesta de decoradores)

TypeScript 4.9 ya introdujo la sintaxis `accessor` para campos, que se compilan en un getter/setter con respaldo privado, anticipando los decoradores de TS 5.0.

```ts
class Ejemplo {
  accessor nombre = "TypeScript";
}
```

Sin decoradores, esta sintaxis por sí sola puede usarse para encapsular el acceso a una propiedad con futura lógica.

### `--checkJs` y `--allowJs` con `satisfies` en JSDoc

Se puede usar `@satisfies` en comentarios JSDoc para comprobar tipos en archivos JavaScript.

### Mejoras en `switch` con tipos de string/number

Mejor análisis de flujo de control en `switch` para detectar casos redundantes o inalcanzables.

### Caída de `target` por debajo de ES5

Se planeó eliminar pero se mantuvo con warning; ahora se desaconseja y puede generar errores en futuras versiones.

## Roadmap – TypeScript presente y futuro (2026)

TypeScript sigue un ciclo de releases trimestrales con mejoras guiadas por los comentarios de la comunidad, la evolución de ECMAScript y las necesidades de escalabilidad. El roadmap no es un plan rígido, pero las prioridades son claras.

### Estado en 2026

A mediados de 2026, la versión estable más reciente es TypeScript 5.7 (lanzada en noviembre de 2025) o posiblemente 5.8. Los números de versión pueden haber avanzado, pero el enfoque se mantiene en:

- **Rendimiento del compilador**: optimizaciones continuas en la resolución de tipos, reducción de memoria y compilación incremental.
- **Soporte de módulos ESM/CJS**: convergencia total hacia la semántica de Node.js (`--module node18`, `--module node20`) y la interoperabilidad sin fricciones.
- **Estricta seguridad de tipos**: nuevas banderas para evitar escapatorias comunes.
- **Tipado de patrones asíncronos**: mejor inferencia en `Promise`, `Awaited`, `async/await` y streams.
- **Mejoras en JavaScript + JSDoc**: hacer TypeScript más potente sin necesidad de escribir `.ts`.
- **ECMAScript Stage 3+**: implementar características como `Pattern Matching`, `Records & Tuples`, `Temporal`, etc., cuando TypeScript pueda representarlas fielmente.

### Posibles características futuras

Basado en discusiones en el repositorio y las iteraciones recientes:

- **Tipos de expresiones regulares**: para capturar grupos y validar cadenas con template literal types más potentes.
- **Mejoras en tipos condicionales**: reducción de la complejidad cuando se alcanzan límites de profundidad.
- **`import type` por defecto**: o la eliminación gradual de la elisión automática a favor de `verbatimModuleSyntax` como predeterminado en nuevos proyectos.
- **Validación de tipos en runtime**: integración ligera con bibliotecas como Zod, pero nativa.
- **Soporte de tipos en JSON modules** (`import data from "./data.json" with { type: "json" }`).
- **Sistema de módulos virtuales** o resolución de módulos extensible para adaptarse a runtimes como Bun y Deno.
- **`satisfies` para tipos genéricos** (extender `satisfies` a contextos donde el tipo se pasa como parámetro).
- **Mejor mensajería de errores**: errores más orientados a humanos.

### TypeScript 5.5 (lanzado en 2024) destacó

- **`JSDoc` `@import` tag** para importar tipos en archivos JS sin sintaxis especial.
- **`isolatedDeclarations`**: genera declaraciones más eficientes cuando se usan transpiladores sin información de tipos.
- **Soporte para `using` declarations** (la propuesta de TC39 para gestión de recursos explícita).
- **Refinamiento de `infer` en tipos condicionales sobre cadenas**.

### TypeScript 5.6 y 5.7

- **`--moduleNode16` y `--moduleNode20`** obsoletos a favor de `--module node16` o `node20`.
- **Mejoras en la resolución de `import` de archivos `.ts`** cuando se usa `allowImportingTsExtensions`.
- **`Array.with()`, `Array.toSorted()` y otros métodos inmutables** tipados correctamente.
- **Soporte parcial para `RegExp.escape`** y **`Promise.try`**.
- **Nuevas utilidades de tipo**: `NoInfer<T>`, `Writable<T>` (no oficiales, pero consideradas).
- **Configuración de `target` por defecto más alta**: probablemente `ES2023` o `ES2024`.

### Más allá: ¿TypeScript 6.0?

Cuando el equipo decida que hay suficientes cambios incompatibles, podrían lanzar una versión mayor. Posibles rompimientos:

- Eliminación de `target` antiguos (ES3, ES5).
- `strict` como verdadero por defecto incluso en `--init`.
- `verbatimModuleSyntax` activado por defecto.
- Cambios en la sintaxis de enums para alinearlas con la propuesta de ECMAScript.

### Cómo seguir el roadmap

- El sitio oficial https://www.typescriptlang.org/roadmap/ recoge planes generales.
- Las notas de lanzamiento de cada versión detallan nuevas características.
- El GitHub de TypeScript y los issues con la etiqueta `Suggestion` y `Help Wanted` revelan lo que la comunidad pide.

---

En resumen, TypeScript 5.0 asentó los decoradores y la modernización de módulos, 4.9 trajo `satisfies` para un desarrollo más expresivo, y el roadmap apunta a una integración total con el ecosistema de módulos, mejoras de rendimiento y la adopción de nuevas características de JavaScript, manteniendo siempre la filosofía de un sistema de tipos opcional pero estricto.

---

