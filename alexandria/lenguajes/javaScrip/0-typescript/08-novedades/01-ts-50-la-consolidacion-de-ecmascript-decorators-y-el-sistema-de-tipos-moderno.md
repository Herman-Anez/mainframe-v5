# TS 5.0 – La consolidación de ECMAScript Decorators y el sistema de tipos moderno

TypeScript 5.0, lanzado en marzo de 2023, fue un hito por su soporte completo para los decoradores estándar de ECMAScript, la mejora de enums, la nueva sintaxis para tipos y módulos, y una reestructuración interna que redujo el tamaño del paquete y mejoró la velocidad. A continuación desglosamos cada novedad.

## Decoradores estándar (TC39 Stage 3)

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

## Parámetros de tipo `const`

Una pequeña pero potente mejora: se puede declarar un parámetro de tipo genérico con `const` para que infiera los literales como si hubiéramos usado `as const`.

```ts
function recoger<const T extends readonly string[]>(valores: T): T {
  return valores;
}

const resultado = recoger(["a", "b"]);
// resultado es de tipo readonly ["a", "b"], no string[]
```

Esto evita tener que escribir `as const` en cada llamada y captura la tupla literal directamente.

## Enums como uniones de sus miembros

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

## `export type *` y `verbatimModuleSyntax`

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

## Resolución de módulos `bundler`

Nueva estrategia `moduleResolution: "bundler"` diseñada para empaquetadores como Webpack, Vite, esbuild, etc. Es similar a `node16` en cuanto a soporte de `exports` y condiciones, pero **no requiere extensiones** en las importaciones relativas (p.ej., puedes importar sin `.js`), y resuelve de forma más laxa los puntos de entrada de paquetes. Es ideal para aplicaciones frontend.

## `allowImportingTsExtensions`

Permite que los archivos TypeScript importen otros archivos con la extensión `.ts`/`.tsx` directamente en el código fuente, algo necesario para algunas configuraciones de Node.js con loaders o cuando se emiten con la misma extensión. Se usa combinado con `noEmit` o `emitDeclarationOnly`, porque no se puede emitir JS con extensión `.ts`. A menudo se combina con `--moduleResolution bundler`.

```ts
import { algo } from './modulo.ts'; // Solo válido con allowImportingTsExtensions
```

## Soporte para `resolvePackageJsonExports` y `resolvePackageJsonImports`

Por defecto activos en `node16`, `nodenext` y `bundler`, TypeScript 5.0 mejora el respeto a los campos `exports` e `imports` de `package.json`, incluyendo condiciones como `types`, `import`, `require`. Esto facilita la publicación y consumo de paquetes duales.

## Mejoras en JSDoc

- `@overload` para declarar sobrecargas en JavaScript.
- `@satisfies` (equivalente a `satisfies` de TS 4.9).
- Mejor soporte para plantillas de tipo en JSDoc.

## Rendimiento y tamaño

- TypeScript 5.0 se reescribió para usar **módulos internos de ECMAScript**, reduciendo el tamaño del paquete en un 30-40% y mejorando los tiempos de instalación.
- El compilador es más rápido en proyectos grandes gracias a optimizaciones en la resolución de tipos y la carga de archivos.

## Otros

- `--suppressImplicitAnyIndexErrors` fue eliminado.
- Mejoras en exhaustividad de comprobaciones de tipos.
- Nuevas opciones en `moduleDetection`.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Recursive types](../07-patrones-avanzados/07-recursive-types.md) | [🏠 Inicio](../index.md) | [TS 4.9 – El operador `satisfies` y otras mejoras cotidianas ▶](02-ts-49-el-operador-satisfies-y-otras-mejoras-cotidianas.md) |
