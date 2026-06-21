# Tsc API

El compilador de TypeScript expone una API pública (paquete `typescript`) que permite análisis, transformación y emisión de código de manera programática. Es la base sobre la que se construyen herramientas como linters, formateadores, generadores de documentación y plugins de editores.

## Instalación y objeto principal

```bash
npm install typescript
```

El módulo exporta la función principal `ts` que contiene todas las utilidades. Los conceptos clave son:

- **`ts.System`**: abstracción del sistema de archivos.
- **`ts.CompilerHost`**: interfaz entre el compilador y el entorno. Se puede implementar para leer archivos virtuales.
- **`ts.createProgram`**: crea un programa que contiene todos los archivos fuente y sus dependencias.
- **`ts.Program`**: representa el proyecto compilado, con acceso al AST, diagnóstico y emisión.
- **`ts.LanguageService`**: nivel más alto, usado para autocompletado, refactors, etc.

## Ejemplo mínimo: chequeo de tipos de un archivo

```ts
import * as ts from "typescript";

const fileNames = ["src/index.ts"];
const options: ts.CompilerOptions = {
  target: ts.ScriptTarget.ES2022,
  module: ts.ModuleKind.ESNext,
  strict: true,
  noEmit: true
};

const program = ts.createProgram(fileNames, options);
const diagnostics = ts.getPreEmitDiagnostics(program);

diagnostics.forEach(diagnostic => {
  const message = ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n");
  if (diagnostic.file) {
    const { line, character } = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start!);
    console.log(`${diagnostic.file.fileName} (${line + 1},${character + 1}): ${message}`);
  } else {
    console.log(message);
  }
});

if (diagnostics.length === 0) {
  console.log("Sin errores.");
}
```

## Transformaciones personalizadas (Custom Transformers)

Se pueden modificar el AST antes o después de la emisión. Los transformers se pasan a `program.emit()`.

```ts
const transformer: ts.TransformerFactory<ts.SourceFile> = context => {
  return sourceFile => {
    function visit(node: ts.Node): ts.Node {
      if (ts.isCallExpression(node) && node.expression.getText() === "debug") {
        return ts.createCall(ts.createIdentifier("console.log"), undefined, node.arguments);
      }
      return ts.visitEachChild(node, visit, context);
    }
    return ts.visitNode(sourceFile, visit);
  };
};

program.emit(undefined, undefined, undefined, undefined, {
  before: [transformer]
});
```

Esta capacidad permite desde eliminar logs en producción hasta añadir metadatos. Herramientas como `ts-patch` y `ttypescript` permiten usar transformers declarados en `tsconfig.json`.

## Build API y Project References

Desde TypeScript 3.0 existe `ts.createSolutionBuilder` para orquestar la construcción de múltiples proyectos con referencias. Emula el comportamiento de `tsc --build`.

```ts
const host = ts.createSolutionBuilderHost(ts.sys, undefined, ts.createBuilderProgram);
const builder = ts.createSolutionBuilder(host, ["tsconfig.app.json"], {});
const exitStatus = builder.build();
```

Esto respeta la caché incremental y emite solo lo necesario.

## Language Service

El `LanguageService` proporciona operaciones de alto nivel sin necesidad de compilar todo el programa (útil para editores). Ofrece completions, quickInfo, diagnostics por archivo, etc.

```ts
const service = ts.createLanguageService(host);
const completions = service.getCompletionsAtPosition("file.ts", 10, {});
```

## Casos de uso habituales

- **Linters y reglas personalizadas** (ESLint internamente no usa la API de TS para análisis sintáctico, sino `@typescript-eslint/parser` que se basa en el AST de TS).
- **Generadores de código** (tipo `graphql-codegen`, `prisma`).
- **Herramientas de documentación** (TypeDoc usa la API).
- **Migraciones y codemods** (usando `ts-morph` que envuelve la API de TS).
- **Pruebas de tipos** (se puede usar `ts.createProgram` para verificar que ciertos fragmentos dan errores esperados).

## Limitaciones y alternativas

La API es estable pero muy verbosa y con documentación a veces escasa. Librerías como `ts-morph` y `tsutils` facilitan el trabajo con el AST. Para analizar archivos individuales sin contexto de proyecto, `ts.createSourceFile` es útil.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Tsc cli](01-tsc-cli.md) | [🏠 Inicio](../index.md) | [Babel esbuild swc ▶](03-babel-esbuild-swc.md) |
