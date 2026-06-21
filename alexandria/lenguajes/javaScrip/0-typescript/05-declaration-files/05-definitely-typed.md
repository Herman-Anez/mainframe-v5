# Definitely typed

DefinitelyTyped (DT) es el repositorio masivo de declaraciones de tipo mantenido por la comunidad bajo el ámbito `@types`. Es la fuente predeterminada para tipar librerías JavaScript que no incluyen tipos propios.

## Estructura del repositorio

- Repo: https://github.com/DefinitelyTyped/DefinitelyTyped
- Cada paquete está en una carpeta con su nombre (ej. `types/react`).
- Dentro: `index.d.ts`, `package.json`, `tsconfig.json`, y opcionalmente tests.
- Las versiones de los paquetes `@types/` siguen el versionado de la librería original, pero con un cuarto dígito para parches de tipos (ej. `@types/react@18.2.45`).

## Cómo usar los tipos

Instalación:
```bash
npm install --save-dev @types/react
```

TypeScript los recoge automáticamente porque por defecto `typeRoots` incluye `node_modules/@types`. Si la librería ya incluye sus propios tipos (campo `"types"`), `@types` no es necesario (y puede interferir).

## Búsqueda de tipos

Puedes buscar si una librería tiene tipos en:
- El propio paquete (busca el logo de TS en npm o el campo `"types"` en `package.json`).
- https://www.typescriptlang.org/dt/search
- https://microsoft.github.io/TypeSearch/

Si no existe, puedes declararlos localmente o contribuir.

## Contribuir a DefinitelyTyped

Pasos generales:
1. Lee la guía oficial: https://github.com/DefinitelyTyped/DefinitelyTyped#readme
2. Forkea el repo.
3. Crea una carpeta con el nombre del paquete (si es scoped: `types/__name` con doble barra baja).
4. Escribe `index.d.ts` con las declaraciones.
5. Añade `package.json` mínimo con `"types": "index.d.ts"`.
6. Añade un `tsconfig.json` con `"compilerOptions": { "strict": true, ... }` y `"files": ["index.d.ts"]`.
7. Escribe tests en una carpeta `test.ts` usando `import` y comprobando que no hay errores. Opcionalmente se usa `tsd` o `dtslint` para validaciones más estrictas.
8. Envía PR. El CI ejecutará linters y pruebas.

## Herramientas de prueba de tipos

- **`dtslint`**: usado por DT para verificar reglas de estilo, existencia de tipos, y probar con comentarios `// $ExpectType` y `// $ExpectError`.
- **`tsd`**: similar, pero más moderno, con `expectType<T>` y `expectError`.
- **`@typescript-eslint`** con reglas para archivos de declaración.

Actualmente DT está migrando de `dtslint` a `tsd`.

## Versiones y mantenimiento

- Los paquetes `@types` suelen lanzar una versión principal por cada versión principal de la librería.
- Se pueden publicar actualizaciones menores para corregir tipos.
- Si un paquete `@types` no está actualizado, puedes enviar un PR con las correcciones.
- En ocasiones, la librería original adopta tipos propios y el paquete `@types` es marcado como deprecated.

## ¿Qué hacer cuando los tipos están incorrectos?

1. Revisa si hay un issue o PR en DefinitelyTyped.
2. Si no, crea un PR con la corrección.
3. Mientras tanto, puedes aumentar los tipos localmente con `declare module` en tu proyecto.

## Consejos al escribir tipos para DT

- Sigue el estilo del módulo original: si usa `module.exports`, usa `export =`; si usa ES modules, `export default` y `export`.
- Incluye JSDoc donde sea útil.
- No incluyas dependencias innecesarias.
- Si la librería es grande, divide en submódulos si tiene puntos de entrada separados.
- Usa `namespace` para funciones con propiedades.
- Prueba los tipos con ejemplos reales de uso.

## Definitivamente y el futuro

Con más librerías adoptando TypeScript nativamente, DT sigue siendo vital para el ecosistema de paquetes legacy. TypeScript mismo depende de la comunidad para mantener la calidad de los tipos. Contribuir es una excelente forma de devolver al ecosistema.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Augmentation](04-augmentation.md) | [🏠 Inicio](../index.md) | [Publicando tipos ▶](06-publicando-tipos.md) |
