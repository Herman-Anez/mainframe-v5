# Dynamic imports

Los `import()` dinámicos permiten cargar módulos bajo demanda, lo que posibilita la división de código (code splitting) y la carga perezosa. TypeScript los soporta tanto como expresión de valor como operador de tipo.

## Import dinámico como expresión de valor

```ts
async function cargarUtilidad() {
  const modulo = await import('./utilidades');
  modulo.exportarDatos();
}
```

El tipo de `modulo` es `typeof import('./utilidades')`, es decir, el tipo del módulo que se cargaría estáticamente. Esto incluye todas las exportaciones con nombre y la exportación por defecto (en `modulo.default`). TypeScript también admite desestructuración:

```ts
const { exportarDatos } = await import('./utilidades');
```

## Tipado de la promesa

El resultado de `import('./ruta')` es `Promise<typeof import('./ruta')>`. Si el módulo no existe o hay un error, se rechazará la promesa; TypeScript no añade tipado para errores específicos.

## Import dinámico con `await` en funciones síncronas

Solo se puede usar `await` en funciones `async`. Sin embargo, la expresión `import()` puede usarse también sin `await`, devolviendo una promesa, lo que permite encadenar `.then()`.

## Uso con `import.meta.url` y rutas relativas

En entornos Node.js modernos y navegadores, puedes construir rutas dinámicas usando `import.meta.url` y el constructor `URL`:

```ts
const modulePath = new URL('./modulo.js', import.meta.url);
const mod = await import(modulePath.href);
```

TypeScript infiere el tipo como `any` si la ruta es dinámica (no es un string literal). Para preservar el tipado, puedes usar `as typeof import('./modulo')` o usar una función auxiliar que tome un literal de plantilla tipado.

## Import dinámico con rutas completamente dinámicas

Si la ruta es completamente dinámica (variable), TypeScript no puede conocer el tipo y asigna `any`. Para forzar un tipo concreto, usa una aserción:

```ts
const mod = await import(ruta) as typeof import('./mi-modulo');
```

## Code splitting en aplicaciones frontend

Los empaquetadores como Webpack, Vite y Rollup interpretan los `import()` con rutas estáticas (o patrones limitados) para crear chunks separados. TypeScript no interviene en ese proceso, pero el tipado garantiza que uses correctamente el módulo cargado.

Ejemplo con React (lazy):

```tsx
const LazyComponent = React.lazy(() => import('./HeavyComponent'));
```

## `import()` como tipo (operador de tipo)

En contextos de tipo, `import('./Modulo')` devuelve el tipo del módulo (equivalente a `typeof import('./Modulo')`). Se puede usar en cualquier lugar donde se espere un tipo:

```ts
type ConfigType = import('./config').Config;
type FullModule = import('./lib');
function factory(): Promise<import('./plugin')> { ... }
```

Esto es muy útil cuando no quieres (o no puedes) importar el módulo físicamente en tiempo de compilación por razones de dependencias circulares o condicionales. Al ser una expresión puramente de tipo, no genera código ni dependencia real.

## `import()` dinámico en declaraciones ambientales

Puedes declarar módulos que solo existen dinámicamente con `declare module` y luego usar `import()` para tiparlos:

```ts
declare module '*.png' {
  const src: string;
  export default src;
}
const imagen = await import('./logo.png');
// imagen.default es string
```

## Consideraciones según el target de módulo

- **`module: ESNext` o `NodeNext`**: emite `import()` tal cual, el entorno debe soportarlo.
- **`module: CommonJS`**: emite una promesa con `require` (en versiones recientes) o una sintaxis no soportada nativamente; se recomienda usar `esModuleInterop` y un target que soporte ESM dinámico, o dejarlo para empaquetadores.
- **`module: AMD`**: emite la carga asíncrona de AMD.
- **`module: System`**: usa `System.import`.

En la práctica, para aplicaciones modernas con `module: ESNext`, los `import()` se empaquetan y el código resultante depende del empaquetador.

## `import.meta` con importaciones dinámicas

A menudo se usan juntos, por ejemplo para cargar módulos relativos al archivo actual. TypeScript provee el tipo `ImportMeta` que puedes aumentar con propiedades personalizadas (como `env` en Vite). `import.meta.url` es una cadena disponible en ESM.

## Errores comunes y soluciones

- **"Cannot find module" en import dinámico**: verifica que la ruta sea correcta y que el archivo exista; para rutas dinámicas, TypeScript no puede verificar.
- **Pérdida de tipos con rutas dinámicas**: usa `as typeof import(...)` o `import()` como tipo en lugar de `await import()` si solo necesitas el tipo.
- **Ciclos con import dinámico**: pueden romperse en runtime pero a veces causan comportamientos extraños. TypeScript no los analiza; es un problema de diseño.

## Patrones avanzados

- **Carga condicional según entorno**:
  ```ts
  if (typeof window !== 'undefined') {
    const client = await import('./browser');
  } else {
    const server = await import('./node');
  }
  ```
- **Plugin systems**: cargar plugins dinámicamente y tiparlos con `import()` como tipo para una interfaz común.
- **Internacionalización**: cargar los mensajes del idioma detectado.

## Resumen

Los `import()` dinámicos de TypeScript son una herramienta completa que combina la carga bajo demanda con un tipado estático preciso. Usa `import()` como expresión para dividir código en runtime, y `import()` como tipo para referenciar tipos sin cargar módulos, manteniendo tu proyecto rápido y bien tipado.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Import type](04-import-type.md) | [🏠 Inicio](../index.md) | [Fundamentos dts ▶](../05-declaration-files/01-fundamentos-dts.md) |
