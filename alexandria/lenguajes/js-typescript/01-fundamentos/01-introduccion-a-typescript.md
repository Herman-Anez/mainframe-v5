# Introducción a TypeScript

TypeScript es un **lenguaje de programación fuertemente tipado** que se construye sobre JavaScript añadiendo una capa de tipos estáticos opcionales. Todo código JavaScript válido es también código TypeScript, lo que permite una adopción incremental. Su compilador (`tsc`) **transpila** TypeScript a JavaScript limpio, eliminando toda la información de tipos en tiempo de compilación (type erasure). El resultado es código que puede ejecutarse en cualquier motor de JS.

## ¿Por qué TypeScript?

- **Detección temprana de errores**: el análisis estático atrapa fallos de tipo, null/undefined, accesos incorrectos a propiedades, etc., antes de ejecutar.
- **Herramientas de desarrollo**: autocompletado, navegación, refactorización segura y documentación implícita en el editor.
- **Escalado**: facilita el mantenimiento de grandes bases de código y el trabajo en equipos.
- **Adopción del ecosistema**: soporte nativo o mediante `@types` para prácticamente toda librería popular.

## ¿Qué no es TypeScript?

No es un lenguaje nuevo compilado a bytecode; es un superset de JS. No añade overhead en runtime: todo el sistema de tipos es eliminado. No reemplaza la necesidad de tests, pero sí reduce clases enteras de errores.

## El proceso de compilación

1. El compilador parsea los archivos `.ts` (y `.tsx` para JSX).
2. Resuelve módulos y referencias.
3. Realiza el **chequeo de tipos** (type checking).
4. Emite JavaScript según el `target` y `module` configurados, aplicando transformaciones (ej. `async/await` a promesas).
5. Puede generar archivos de declaración (`.d.ts`), sourcemaps y más.

El chequeo de tipos puede ejecutarse de forma aislada (`tsc --noEmit`) para integrarse con otros transpiladores (Babel, swc, esbuild), que solo transforman la sintaxis sin verificar tipos.

## Filosofía de diseño

- **Opcional y gradual**: puedes añadir tipos donde necesites y mantener código sin tipar (con `any` o `strict: false`).
- **Inferencia inteligente**: el compilador deduce tipos automáticamente, reduciendo la verbosidad.
- **Sistema de tipos estructural**: la compatibilidad se basa en la forma de los tipos (duck typing), no en su identidad nominal (excepto con técnicas de marcas).

## Versiones y evolución

TypeScript sigue un ciclo de lanzamiento trimestral. Cada versión introduce mejoras en el sistema de tipos, nuevas características de JavaScript (alineadas con TC39) y optimizaciones. Es importante conocer la versión con la que se trabaja porque algunas funcionalidades avanzadas requieren versiones recientes (ej. `satisfies` en TS 4.9, decoradores estándar en TS 5.0).

## Configuración inicial

Todo proyecto TypeScript se define mediante un archivo `tsconfig.json`. Un ejemplo mínimo:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "strict": true,
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src"]
}
```

La bandera `strict: true` activa todas las comprobaciones estrictas, que son la base para un desarrollo seguro.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| ➖ | [🏠 Inicio](../index.md) | [Tipos básicos ▶](02-tipos-basicos.md) |
