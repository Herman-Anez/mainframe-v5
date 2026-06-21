# Roadmap – TypeScript presente y futuro (2026)

TypeScript sigue un ciclo de releases trimestrales con mejoras guiadas por los comentarios de la comunidad, la evolución de ECMAScript y las necesidades de escalabilidad. El roadmap no es un plan rígido, pero las prioridades son claras.

## Estado en 2026

A mediados de 2026, la versión estable más reciente es TypeScript 5.7 (lanzada en noviembre de 2025) o posiblemente 5.8. Los números de versión pueden haber avanzado, pero el enfoque se mantiene en:

- **Rendimiento del compilador**: optimizaciones continuas en la resolución de tipos, reducción de memoria y compilación incremental.
- **Soporte de módulos ESM/CJS**: convergencia total hacia la semántica de Node.js (`--module node18`, `--module node20`) y la interoperabilidad sin fricciones.
- **Estricta seguridad de tipos**: nuevas banderas para evitar escapatorias comunes.
- **Tipado de patrones asíncronos**: mejor inferencia en `Promise`, `Awaited`, `async/await` y streams.
- **Mejoras en JavaScript + JSDoc**: hacer TypeScript más potente sin necesidad de escribir `.ts`.
- **ECMAScript Stage 3+**: implementar características como `Pattern Matching`, `Records & Tuples`, `Temporal`, etc., cuando TypeScript pueda representarlas fielmente.

## Posibles características futuras

Basado en discusiones en el repositorio y las iteraciones recientes:

- **Tipos de expresiones regulares**: para capturar grupos y validar cadenas con template literal types más potentes.
- **Mejoras en tipos condicionales**: reducción de la complejidad cuando se alcanzan límites de profundidad.
- **`import type` por defecto**: o la eliminación gradual de la elisión automática a favor de `verbatimModuleSyntax` como predeterminado en nuevos proyectos.
- **Validación de tipos en runtime**: integración ligera con bibliotecas como Zod, pero nativa.
- **Soporte de tipos en JSON modules** (`import data from "./data.json" with { type: "json" }`).
- **Sistema de módulos virtuales** o resolución de módulos extensible para adaptarse a runtimes como Bun y Deno.
- **`satisfies` para tipos genéricos** (extender `satisfies` a contextos donde el tipo se pasa como parámetro).
- **Mejor mensajería de errores**: errores más orientados a humanos.

## TypeScript 5.5 (lanzado en 2024) destacó

- **`JSDoc` `@import` tag** para importar tipos en archivos JS sin sintaxis especial.
- **`isolatedDeclarations`**: genera declaraciones más eficientes cuando se usan transpiladores sin información de tipos.
- **Soporte para `using` declarations** (la propuesta de TC39 para gestión de recursos explícita).
- **Refinamiento de `infer` en tipos condicionales sobre cadenas**.

## TypeScript 5.6 y 5.7

- **`--moduleNode16` y `--moduleNode20`** obsoletos a favor de `--module node16` o `node20`.
- **Mejoras en la resolución de `import` de archivos `.ts`** cuando se usa `allowImportingTsExtensions`.
- **`Array.with()`, `Array.toSorted()` y otros métodos inmutables** tipados correctamente.
- **Soporte parcial para `RegExp.escape`** y **`Promise.try`**.
- **Nuevas utilidades de tipo**: `NoInfer<T>`, `Writable<T>` (no oficiales, pero consideradas).
- **Configuración de `target` por defecto más alta**: probablemente `ES2023` o `ES2024`.

## Más allá: ¿TypeScript 6.0?

Cuando el equipo decida que hay suficientes cambios incompatibles, podrían lanzar una versión mayor. Posibles rompimientos:

- Eliminación de `target` antiguos (ES3, ES5).
- `strict` como verdadero por defecto incluso en `--init`.
- `verbatimModuleSyntax` activado por defecto.
- Cambios en la sintaxis de enums para alinearlas con la propuesta de ECMAScript.

## Cómo seguir el roadmap

- El sitio oficial https://www.typescriptlang.org/roadmap/ recoge planes generales.
- Las notas de lanzamiento de cada versión detallan nuevas características.
- El GitHub de TypeScript y los issues con la etiqueta `Suggestion` y `Help Wanted` revelan lo que la comunidad pide.

---

En resumen, TypeScript 5.0 asentó los decoradores y la modernización de módulos, 4.9 trajo `satisfies` para un desarrollo más expresivo, y el roadmap apunta a una integración total con el ecosistema de módulos, mejoras de rendimiento y la adopción de nuevas características de JavaScript, manteniendo siempre la filosofía de un sistema de tipos opcional pero estricto.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ TS 4.9 – El operador `satisfies` y otras mejoras cotidianas](02-ts-49-el-operador-satisfies-y-otras-mejoras-cotidianas.md) | [🏠 Inicio](../index.md) | [`ejemplos/01-tipos-basicos/` ▶](../cheatsheets/01-ejemplos01-tipos-basicos.md) |
