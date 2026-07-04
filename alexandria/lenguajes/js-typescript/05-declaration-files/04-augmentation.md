# Augmentation

La aumentación (aumento) de tipos permite extender interfaces existentes con nuevas propiedades, añadir métodos a clases de terceros o modificar tipos globales sin necesidad de modificar los archivos de origen. Se basa en las reglas de fusión de declaraciones de TypeScript.

## Fusión de declaraciones (declaration merging)

TypeScript fusiona automáticamente:
- Interfaces con el mismo nombre en el mismo ámbito.
- Namespaces con el mismo nombre.
- Interfaz con clase (para añadir propiedades estáticas).
- Función con namespace (patrón función+namespace).
Esto no se aplica a `type` alias (no se fusionan).

La aumentación se logra reabriendo una interfaz o namespace declarado en otro lugar.

## Aumentación de módulos (module augmentation)

Sirve para añadir nuevas propiedades a interfaces que pertenecen a un módulo de terceros (por ejemplo, añadir una propiedad `user` a `express.Request`).

```ts
// express-augment.d.ts
import "express";
declare module "express" {
  interface Request {
    user?: { id: number; role: string };
  }
}
```

Para que funcione:
- El archivo debe ser un módulo (tener al menos `import "express";` o `export {}`).
- Debe incluirse en el proyecto (via `include`).
- La sintaxis es `declare module "nombre-del-modulo" { ... }` sin necesidad de redefinir exportaciones; solo las partes que queremos aumentar.

Internamente, TypeScript fusiona nuestra interfaz `Request` con la original del módulo `express`. El resultado es que `req.user` está disponible en todas las rutas.

## Aumentación de módulos con exportaciones específicas

También se pueden aumentar otros elementos del módulo, como agregar una función:

```ts
declare module "lodash" {
  interface LoDashStatic {
    customMethod(): string;
  }
}
```

## Aumentación global

Para extender objetos globales (Window, Document, etc.):

```ts
declare global {
  interface Window {
    __CUSTOM_DATA__: any;
  }
}
```

Esto se puede hacer desde un módulo si se envuelve en `declare global` y el archivo tiene al menos un `import`/`export` (para ser tratado como módulo). Si es un archivo script (sin imports), las declaraciones están en el global y no se necesita el bloque `declare global`.

## Aumentación de `lib.d.ts`

Se pueden añadir métodos a tipos nativos como `Array` o `String`:

```ts
interface Array<T> {
  remove(item: T): boolean;
}
```

Este tipo de aumentación puede afectar a todo el proyecto y debe usarse con cuidado porque puede causar conflictos si diferentes partes añaden lo mismo.

## Aumentación de tipos de paquetes con `@types`

Si un paquete `@types/libreria` es insuficiente, se puede aumentar de la misma forma. El archivo aumentador debe convivir en el proyecto y se fusionará con las declaraciones de `@types`.

## Orden de carga y visibilidad

Los archivos de declaración se cargan según los patrones de `include` y `files`. Para que una aumentación sea efectiva, el archivo que la contiene debe estar incluido. A menudo se colocan en `src/types/augmentations.d.ts` o similar. No es necesario importarlos explícitamente; su presencia en el proyecto es suficiente.

## Aumentación vs `declare module` completo

- **Aumentación**: solo modificas ciertas partes; el resto de las declaraciones del módulo se mantienen como están.
- **Declaración completa**: reemplazas toda la definición del módulo. Esto puede ser necesario si los tipos originales son completamente erróneos o si estás escribiendo tipos desde cero para una librería que no los tiene. Pero con `@types`, reemplazarlos completamente puede causar que se pierdan otras declaraciones.

## Aumentación en librerías (plugins)

Las librerías que funcionan como plugins (por ejemplo, Express middleware) suelen proveer sus propios archivos de aumentación para que sus tipos se integren. Por ejemplo, `passport` añade `user` a `Request`. Cuando instalas `@types/passport`, el archivo de aumentación ya está incluido.

## Casos prácticos avanzados

- **Agregar propiedades a una clase**: las clases son abiertas en su miembro estático (se fusionan con una interfaz del mismo nombre). Para añadir un método estático:
  ```ts
  declare module "vue" {
    interface VueConstructor {
      myGlobalMethod(): void;
    }
  }
  ```
- **Extender una unión discriminada**: no se puede aumentar una unión directamente, pero se puede aumentar el tipo de una propiedad que sea una unión si está en una interfaz que forma parte de la unión.

## Peligros de la aumentación

- **Colisiones**: si dos módulos aumentan la misma interfaz con la misma propiedad pero tipos diferentes, TypeScript dará error.
- **Dependencia de orden**: la aumentación debe estar presente en todos los contextos de compilación; si un proyecto no incluye el archivo aumentador, los tipos serán inconsistentes.
- **Mantenimiento**: cuando se actualiza la librería base, la aumentación puede quedar obsoleta.

## Buenas prácticas

- Agrupa las aumentaciones en un archivo o carpeta específica.
- Nombra el archivo de forma que indique qué módulo aumenta (ej. `express.augment.d.ts`).
- Documenta la razón de la aumentación.
- Considera si es posible enviar un PR a DefinitelyTyped o a la librería original para que incluya los tipos, en lugar de mantener una aumentación local.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Module declarations](03-module-declarations.md) | [🏠 Inicio](../index.md) | [Definitely typed ▶](05-definitely-typed.md) |
