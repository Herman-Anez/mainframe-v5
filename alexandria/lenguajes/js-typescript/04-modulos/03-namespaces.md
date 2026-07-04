# Namespaces

Los namespaces (espacios de nombres) son la forma antigua de organizar código en TypeScript, conocidos como "módulos internos". Antes de que ES2015 estandarizara los módulos, los namespaces eran la única manera de evitar colisiones globales. Hoy en día su uso está desaconsejado para aplicaciones, pero siguen siendo útiles en archivos de declaración (`.d.ts`) y para ciertos patrones avanzados.

## Concepto y sintaxis básica

```ts
namespace MiApp {
  export class Persona {
    constructor(public nombre: string) {}
  }
  export function saludar(p: Persona): void {
    console.log(`Hola ${p.nombre}`);
  }
  const interna = "secreto"; // no exportada, solo visible dentro
}

const persona = new MiApp.Persona("Ana");
MiApp.saludar(persona);
```

Un namespace puede contener cualquier declaración (variables, funciones, clases, interfaces, otros namespaces). Para que algo sea accesible desde fuera, debe estar marcado con `export`. Sin `export`, es privado al namespace.

## Compilación

Un namespace se compila a un IIFE (Immediately Invoked Function Expression) que crea un objeto global con las propiedades exportadas:

```js
var MiApp;
(function (MiApp) {
    class Persona { ... }
    MiApp.Persona = Persona;
    function saludar(p) { ... }
    MiApp.saludar = saludar;
    var interna = "secreto";
})(MiApp || (MiApp = {}));
```

Esto significa que los namespaces generan código que asume un entorno con variables globales. No son módulos: no usan `import`/`export` a nivel de archivo. Para cargar un namespace desde otro archivo, tradicionalmente se usaba `/// <reference path="..."/>`.

## Anidamiento

Se pueden anidar namespaces:

```ts
namespace App {
  export namespace UI {
    export class Boton { }
  }
}
```

## Fusión de namespaces (declaration merging)

Al igual que las interfaces, los namespaces se fusionan si comparten el mismo nombre en el mismo ámbito. Esto permite extender un namespace en múltiples archivos:

```ts
// archivo1.ts
namespace MiApp {
  export function inicio() {}
}
// archivo2.ts
namespace MiApp {
  export function final() {}
}
```

Ambas funciones coexisten en `MiApp`. Este comportamiento es clave para la estructura de los archivos de declaración globales, como `lib.d.ts`.

## Namespaces en archivos de declaración (`.d.ts`)

Aquí es donde los namespaces aún brillan. Se usan para describir APIs globales o librerías que añaden objetos al ámbito global:

```ts
declare namespace jQuery {
  interface JQuery {
    html(html: string): JQuery;
  }
  function $(selector: string): JQuery;
}
```

Luego en código TypeScript puedes usar `jQuery.$` directamente, previa inclusión del tipo (por ejemplo, instalando `@types/jquery`). Los namespaces también se utilizan para declarar módulos que exponen una API orientada a objetos global.

## Namespaces vs módulos ES

**Namespaces (módulos internos)**:
- Organizan código en el ámbito global.
- No tienen dependencias explícitas; se cargan por orden de scripts o con `/// <reference>`.
- Generan un objeto global (o anidado) en runtime.
- Son útiles para archivos `.d.ts` de librerías que no usan módulos.

**Módulos ES (módulos externos)**:
- Cada archivo es un módulo independiente con su propio ámbito.
- Usan `import`/`export` para relacionarse.
- Mejor encapsulación, análisis estático, carga asíncrona.
- Recomendados para toda aplicación nueva.

La documentación oficial de TypeScript desaconseja los namespaces para organizar código de aplicación. Prefiere módulos ES. Sin embargo, los namespaces tienen cabida en:
- Definición de tipos para librerías legacy globales.
- Aumentación de tipos globales (agregar propiedades a `window` o `global`).
- Archivos de configuración de tipos donde varios plugins pueden aumentar un mismo namespace (ejemplo: `Express.Request`).

## Namespaces y módulos juntos

Puedes tener un namespace dentro de un módulo, lo que crea una estructura anidada interna que no contamina el global. Por ejemplo, para organizar subcomponentes:

```ts
export namespace Geometria {
  export class Punto { }
}
```

Pero en general, se recomienda simplemente exportar las clases/funciones directamente sin envoltorio de namespace, ya que el sistema de módulos ya proporciona el espacio de nombres a través del nombre del módulo.

## `/// <reference>` tags

Son comentarios especiales que indican al compilador dependencias entre archivos cuando no se usan módulos. Los tres tipos principales:

- `/// <reference path="..." />`: incluye otro archivo en la compilación.
- `/// <reference types="..." />`: incluye un paquete de tipos (equivalente a `types` en tsconfig, pero a nivel de archivo).
- `/// <reference lib="..." />`: incluye una biblioteca estándar (ej. `es2015`).

Hoy en día, con `tsconfig.json` y módulos ES, estas referencias casi no se usan, salvo para archivos de declaración que no son módulos.

## Buenas prácticas modernas

- **No crees nuevos namespaces para organizar código**; usa módulos ES.
- Si encuentras una librería con tipos en namespace, envuélvela en un módulo usando `export as namespace` y `export =` para combinarla con un sistema de módulos.
- Para extender tipos globales (por ejemplo, añadir propiedades a `window`), puedes usar `declare global { interface Window { ... } }` sin necesidad de namespaces.
- Los namespaces siguen siendo la forma de representar código global en archivos `.d.ts`. Aprender a leerlos y escribirlos es necesario para contribuir a DefinitelyTyped.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Import export syntax](02-import-export-syntax.md) | [🏠 Inicio](../index.md) | [Import type ▶](04-import-type.md) |
