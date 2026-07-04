# Eslint prettier

Mantener la calidad del código TypeScript requiere un linter y un formateador. ESLint con el plugin `@typescript-eslint` proporciona análisis profundo, incluyendo reglas que requieren información de tipos. Prettier se encarga del formato consistente.

## ESLint para TypeScript

**Instalación base**:
```bash
npm install --save-dev eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin
```

**Configuración mínima** (`.eslintrc.json`):
```json
{
  "root": true,
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "project": ["./tsconfig.json"]
  },
  "plugins": ["@typescript-eslint"],
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking"
  ],
  "rules": {
    "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
    "@typescript-eslint/explicit-function-return-type": "warn"
  }
}
```

- `parser: "@typescript-eslint/parser"` le dice a ESLint cómo parsear TypeScript.
- `parserOptions.project` es necesario para las reglas que usan información de tipos. Apunta a uno o varios `tsconfig.json`. **Atención**: Esto puede ralentizar el linting; se puede omitir si no se usan reglas con tipo.
- `plugin:@typescript-eslint/recommended` activa un conjunto seguro de reglas.
- `recommended-requiring-type-checking` añade reglas más estrictas que necesitan el proyecto.

## Reglas potentes con información de tipos

- `@typescript-eslint/no-floating-promises`: exige manejar promesas (await, .catch, etc.).
- `@typescript-eslint/no-misused-promises`: evita pasar promesas donde se espera un void.
- `@typescript-eslint/strict-boolean-expressions`: prohíbe usar valores no booleanos en condiciones (ej. `if (array)` sin comprobar length).
- `@typescript-eslint/prefer-nullish-coalescing`: sugiere `??` en lugar de `||` para valores nulos.
- `@typescript-eslint/no-unnecessary-condition`: detecta condiciones siempre verdaderas/falsas basadas en tipos.

Estas reglas elevan la seguridad, pero pueden ser ruidosas; actívalas gradualmente.

## Rendimiento

Las reglas con tipo pueden ser lentas. Consejos:
- Usa `parserOptions.project` solo en configuraciones de CI o en un `.eslintrc.typed.json` que se aplica solo a ciertos archivos.
- Ejecuta ESLint con `--cache` para no reprocesar archivos sin cambios.
- En monorepos, usa `project` apuntando a los `tsconfig.json` de cada paquete, no al raíz.

## Integración con Prettier

Prettier formatea el código, pero algunas de sus reglas pueden chocar con las de ESLint. La solución es:
1. Instalar Prettier y el plugin de ESLint para desactivar reglas conflictivas:
   ```bash
   npm install --save-dev prettier eslint-config-prettier
   ```
2. Añadir `"prettier"` al final de `extends` en ESLint:
   ```json
   "extends": [
     "some-other-config",
     "plugin:@typescript-eslint/recommended",
     "prettier"
   ]
   ```
   `eslint-config-prettier` desactiva todas las reglas de ESLint que podrían interferir con Prettier.
3. Configurar Prettier con `.prettierrc`:
   ```json
   {
     "semi": true,
     "singleQuote": true,
     "tabWidth": 2,
     "trailingComma": "all"
   }
   ```
4. Ejecutar ambos por separado o mediante `eslint-plugin-prettier` (que ejecuta Prettier como regla de ESLint). Personalmente se recomienda ejecutarlos por separado (formateo con Prettier, linting con ESLint) para mejor rendimiento y separación de responsabilidades.

## Editor y flujo de trabajo

- VS Code: extensiones ESLint y Prettier. Configura `editor.formatOnSave: true` y `editor.defaultFormatter: esbenp.prettier-vscode` para TypeScript.
- Husky + lint-staged: ejecutar ESLint y Prettier solo en los archivos staged.
  ```json
  "lint-staged": {
    "*.{ts,tsx}": ["eslint --fix", "prettier --write"]
  }
  ```

## Migrar desde TSLint

TSLint está deprecado. El camino es migrar a `@typescript-eslint`. Existen herramientas como `tslint-to-eslint-config` que ayudan a convertir la configuración.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Babel esbuild swc](03-babel-esbuild-swc.md) | [🏠 Inicio](../index.md) | [Testing ▶](05-testing.md) |
