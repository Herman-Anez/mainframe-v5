# Import type

La distinción entre importaciones que solo traen tipos y las que traen valores es crucial para la emisión correcta del código, el rendimiento del compilador y la resolución de dependencias circulares. TypeScript ofrece un soporte completo para importaciones de solo tipo, que han evolucionado hasta la versión 5.0.

## Fundamentos: ¿por qué `import type`?

Cuando importas una clase, interfaz o tipo de otro módulo, TypeScript necesita conocer la forma de ese tipo para el chequeo. Pero en tiempo de ejecución, si nunca usas la clase como valor (no la instancias ni accedes a propiedades estáticas), la importación es innecesaria y puede causar dependencias circulares no deseadas. Al marcar la importación como de solo tipo, TypeScript la elimina completamente del JavaScript emitido, asegurando que no haya `require` o `import` en runtime.

```ts
import type { Animal } from './animal';
import type Perro from './perro';

let mascota: Perro;
```

En el JS resultante, no habrá rastro de `./animal` ni `./perro`.

## `import type` vs `import` con elisión automática

Sin `import type`, TypeScript a menudo elimina importaciones que solo se usan como tipos, si puede determinarlo estáticamente. Pero esta elisión automática tiene limitaciones:
- No funciona si el módulo exporta una mezcla de valores y tipos y usas al menos un valor; entonces toda la declaración de import se emite.
- Puede ser confusa para herramientas externas (Babel, esbuild) que no tienen información de tipos.
- Con `verbatimModuleSyntax`, la elisión automática se deshabilita, forzándote a ser explícito.

`import type` es la forma explícita y robusta.

## Variantes de `import type`

1. **Declaración completa como tipo**:
   ```ts
   import type { A, B } from './mod';
   import type D from './mod'; // D es el tipo del default export
   import type * as Tipos from './mod';
   ```
   Solo los tipos son accesibles; no puedes usar los valores importados (ni siquiera si son clases que también actúan como valor).

2. **Modificador `type` en importaciones individuales** (desde TS 4.5):
   ```ts
   import { type A, B } from './mod';
   ```
   `A` se marca como tipo; `B` se trata como valor. Permite mezclar en una sola línea.

3. **`import()` como tipo**:
   ```ts
   type Modulo = import('./mod');
   type Clase = import('./mod').MiClase;
   ```
   Esto no genera ninguna importación en runtime, pero obtiene el tipo del módulo. Muy útil para tipos recursivos o referencias condicionales.

## `export type`

Similar para exportaciones:

```ts
export type { A, B };
export { type A, B }; // mezcla
export type * from './mod'; // reexporta solo tipos (TS 5.0+)
export type * as NS from './mod'; // reexporta tipos como namespace (TS 5.0+)
```

## `verbatimModuleSyntax` y el futuro

Con esta opción (TS 5.0+), TypeScript exige que todas las importaciones/exportaciones de solo tipo sean explícitas. Si un import contiene solo referencias a tipos y no usas `type`, será un error. Esto alinea TypeScript con la propuesta de "type-only imports" del estándar ECMAScript y garantiza que el código sea seguro para transpiladores que no chequean tipos.

```json
{
  "compilerOptions": {
    "verbatimModuleSyntax": true,
    "module": "NodeNext"
  }
}
```

En este modo, `import { Animal } from './animal'` donde `Animal` es una interfaz, es error. Debe ser `import type { Animal }`.

## Importaciones de clase como tipo y valor

Una clase es a la vez un valor (el constructor) y un tipo (la forma de la instancia). Si solo necesitas la forma, usa `import type`:

```ts
import type { Persona } from './persona';
let p: Persona;
```

Pero si también necesitas instanciar, necesitas la importación de valor normal.

## Aumentación de módulos con `import type`

Cuando haces module augmentation (aumentación de módulos), puedes usar `import type` para referenciar tipos del módulo que estás extendiendo sin introducir una dependencia real:

```ts
declare module 'express' {
  import type { Request as Req } from 'express';
  interface Request {
    user?: User;
  }
}
```

## Desacoplamiento y resolución de dependencias circulares

Los `import type` no generan dependencia en runtime, por lo que pueden romper ciclos de módulos que solo existen por referencias de tipo. Ejemplo: A define un tipo que usa un tipo de B, y B define un tipo que usa un tipo de A. Si ambos usan `import type`, no hay problema en runtime.

## Resumen de buenas prácticas

- Usa `import type` por defecto cuando solo necesitas la forma de algo.
- Activa `verbatimModuleSyntax` si tu entorno lo soporta (empaquetadores modernos y NodeNext).
- Para librerías, emite tipos con `export type` para reexportar solo tipos sin arrastrar el módulo entero.
- En archivos `.d.ts` de librerías, usa `import()` como tipo en anotaciones complejas para no forzar una dependencia de módulo real.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Namespaces](03-namespaces.md) | [🏠 Inicio](../index.md) | [Dynamic imports ▶](05-dynamic-imports.md) |
