# notas.md — package.json mal configurado

## Error

Proyecto tiene `todo-module.ts` (TypeScript) pero `package.json` no traía nada
pa compilar/tipar TS:

- Sin `typescript` en `devDependencies` → no había compilador.
- Sin `tsconfig.json` → nada define cómo compilar el `.ts`.
- Al usar `import { randomUUID } from 'crypto'`, TS necesita tipos de Node
  (`@types/node`), que tampoco estaban.
- `devEngines.packageManager` fuerza `pnpm`. Correr `npx tsc` falla porque
  `npx` usa npm internamente, y npm rechaza el paquete por política de
  `devEngines` (error `EBADDEVENGINES`). Hay que usar `pnpm exec tsc`.
- `main: "index.js"` apunta a archivo que no existe (solo hay `.ts`, no
  compilado). No se tocó — mencionado acá pa que sepas.

## Solución aplicada

1. `pnpm add -D typescript` → agrega compilador.
2. `pnpm add -D @types/node` → tipos de Node (`crypto`, etc).
3. Creado `tsconfig.json`:
   ```json
   {
     "compilerOptions": {
       "target": "ES2022",
       "module": "NodeNext",
       "moduleResolution": "NodeNext",
       "outDir": "dist",
       "rootDir": ".",
       "strict": true,
       "esModuleInterop": true,
       "skipLibCheck": true,
       "types": ["node"],
       "forceConsistentCasingInFileNames": true
     },
     "include": ["**/*.ts"]
   }
   ```
   `"types": ["node"]` es clave — sin eso TS no carga los tipos ambient de
   `@types/node` aunque esté instalado.

## Verificación

```
pnpm exec tsc --noEmit
```

Corre limpio, sin errores.

## Pendiente (no tocado, decisión tuya)

- `main: "index.js"` no existe. Si vas a compilar, cambiar a
  `"main": "dist/todo-module.js"` y correr `pnpm exec tsc` (sin `--noEmit`).
  Si vas a correr TS directo sin compilar, considerar `tsx` en vez de `tsc`.
