# Configuracion rapida

Una guía para configurar TypeScript rápidamente en diferentes tipos de proyectos, con los `compilerOptions` más importantes y plantillas listas para copiar.

## Configuración mínima recomendada (estricta)

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src"]
}
```

Esta base sirve para la mayoría de aplicaciones empaquetadas con Vite, Webpack, etc. Siempre activa `strict`.

## Para Node.js actual (ESM)

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src"]
}
```

Acompañar con `"type": "module"` en el `package.json`. Las importaciones relativas deben llevar extensión `.js` (TypeScript emitirá `.js`). Puedes evitar la extensión usando `module: "ESNext"` y `moduleResolution: "bundler"` si luego empaquetas.

## Para librerías (publicación de tipos)

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist", "**/*.test.ts"]
}
```

Para emitir solo declaraciones (sin JS) usa `"emitDeclarationOnly": true` junto con otro transpilador.

## Para React con JSX

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src"]
}
```

## Monorepo con project references

Raíz `tsconfig.json` (solo referencias, sin fuentes):

```json
{
  "files": [],
  "references": [
    { "path": "./packages/common" },
    { "path": "./packages/server" },
    { "path": "./packages/client" }
  ]
}
```

Cada paquete debe tener `composite: true`:

```json
{
  "compilerOptions": {
    "composite": true,
    "declaration": true,
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true
  },
  "include": ["src"]
}
```

Compilar todo con: `tsc --build`.

## Opciones estrictas detalladas

`"strict": true` activa:
- `strictNullChecks`
- `noImplicitAny`
- `noImplicitThis`
- `strictFunctionTypes`
- `strictPropertyInitialization`
- `strictBindCallApply`
- `alwaysStrict`

Puedes activar alguna por separado si necesitas un modo semiestricto, pero no se recomienda.

## Otras opciones de calidad

- `"noUnusedLocals": true` – error si hay variables locales sin usar.
- `"noUnusedParameters": true` – error si hay parámetros sin usar.
- `"noImplicitReturns": true` – todas las ramas deben devolver un valor.
- `"noFallthroughCasesInSwitch": true` – prohibe la caída entre `case`.
- `"exactOptionalPropertyTypes": true` – no permite `undefined` en propiedades opcionales.
- `"noUncheckedIndexedAccess": true` – añade `| undefined` a accesos con índice.

## Mapeo de rutas (aliases)

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@app/*": ["src/app/*"],
      "@utils/*": ["src/utils/*"]
    }
  }
}
```

Recuerda que los empaquetadores necesitan replicar estos alias. Con Vite puedes usar `vite-tsconfig-paths`.

## Scripts npm recomendados

```json
{
  "scripts": {
    "build": "tsc",
    "watch": "tsc --watch",
    "typecheck": "tsc --noEmit",
    "lint": "eslint 'src/**/*.{ts,tsx}'",
    "test": "vitest"
  }
}
```

## `tsconfig` para chequeo de tipos sin emisión (solo CI)

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "strict": true,
    "noEmit": true,
    "skipLibCheck": true
  },
  "include": ["src"]
}
```

## Depuración rápida de errores

- `--traceResolution` para ver cómo se resuelven los módulos.
- `--showConfig` para ver la configuración final aplicada.
- `--noErrorTruncation` para mensajes de error completos.
- `--explainFiles` para ver qué archivos se incluyen.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Tipos utilitarios](01-tipos-utilitarios.md) | [🏠 Inicio](../index.md) | [Migraciones desde js ▶](03-migraciones-desde-js.md) |
