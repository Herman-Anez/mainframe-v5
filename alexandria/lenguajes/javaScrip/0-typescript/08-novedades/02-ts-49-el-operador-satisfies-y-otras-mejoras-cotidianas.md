# TS 4.9 – El operador `satisfies` y otras mejoras cotidianas

TypeScript 4.9 (noviembre de 2022) introdujo herramientas que refinan la inferencia y el narrowing, mejorando la experiencia diaria.

## Operador `satisfies`

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

## Estrechamiento con `in` para `switch` y propiedades no listadas

TypeScript 4.9 amplió el uso del operador `in` como comprobación de narrowing en contextos más amplios, incluso cuando la propiedad no está en la lista de propiedades conocidas. Ahora es más seguro.

## Comprobación de `NaN` en tipos

Se pueden escribir funciones que retornen `number` pero que al ser comparadas con `NaN` el narrowing no funciona como con otros valores (porque `NaN !== NaN`). TS 4.9 añade soporte para `if (val === Number.NaN)` y `if (Number.isNaN(val))` para estrechar correctamente.

## `auto-accessor` (soporte parcial para la propuesta de decoradores)

TypeScript 4.9 ya introdujo la sintaxis `accessor` para campos, que se compilan en un getter/setter con respaldo privado, anticipando los decoradores de TS 5.0.

```ts
class Ejemplo {
  accessor nombre = "TypeScript";
}
```

Sin decoradores, esta sintaxis por sí sola puede usarse para encapsular el acceso a una propiedad con futura lógica.

## `--checkJs` y `--allowJs` con `satisfies` en JSDoc

Se puede usar `@satisfies` en comentarios JSDoc para comprobar tipos en archivos JavaScript.

## Mejoras en `switch` con tipos de string/number

Mejor análisis de flujo de control en `switch` para detectar casos redundantes o inalcanzables.

## Caída de `target` por debajo de ES5

Se planeó eliminar pero se mantuvo con warning; ahora se desaconseja y puede generar errores en futuras versiones.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ TS 5.0 – La consolidación de ECMAScript Decorators y el sistema de tipos moderno](01-ts-50-la-consolidacion-de-ecmascript-decorators-y-el-sistema-de-tipos-moderno.md) | [🏠 Inicio](../index.md) | [Roadmap – TypeScript presente y futuro (2026) ▶](03-roadmap-typescript-presente-y-futuro-2026.md) |
