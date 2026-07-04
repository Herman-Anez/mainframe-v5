# Strict y otras banderas

TypeScript dispone de una familia de comprobaciones estrictas que, en conjunto, elevan la seguridad del código. `"strict": true` es la forma más simple de activarlas todas. Cada una puede ser desactivada individualmente si `strict` está activo, estableciendo explícitamente la bandera a `false`.

## `strictNullChecks`

Sin ella, `null` y `undefined` se pueden asignar a cualquier tipo. Activarla los convierte en tipos separados. Esto fuerza a manejar explícitamente la nulabilidad.

```ts
let nombre: string;
nombre = null; // Error con strictNullChecks
```

Es, probablemente, la bandera más importante. Obliga a usar uniones (`string | null`) y a estrechar antes de operar.

## `noImplicitAny`

Cuando el compilador no puede inferir un tipo y no hay anotación, infiere `any`. Esta bandera prohíbe ese `any` implícito.

```ts
function f(x) { return x; } // Error: parámetro 'x' tiene tipo implícito 'any'
```

Fuerza a anotar o asegurar que haya inferencia. Mejora la robustez de la base de código.

## `noImplicitThis`

Prohíbe `this` implícito de tipo `any`. Obliga a tipar `this` como primer parámetro falso o a usar funciones flecha.

```ts
function mostrar(this: { nombre: string }) {
  console.log(this.nombre);
}
```

## `strictFunctionTypes`

Corrige la varianza de los parámetros de función en la compatibilidad de tipos. Sin ella, TypeScript es bivariante en parámetros de función (menos seguro). Con `strictFunctionTypes`, la compatibilidad de funciones sigue la varianza correcta (contravariante en parámetros, covariante en retorno). Afecta a la asignación de callbacks.

```ts
type Handler = (x: string) => void;
let h: Handler = (x: string | number) => { }; // OK sin strictFunctionTypes, Error con ella
```

Es una mejora de seguridad importante.

## `strictPropertyInitialization`

Asegura que todas las propiedades de una clase que no son opcionales se inicialicen en el constructor o directamente.

```ts
class Persona {
  nombre: string; // Error si no se asigna en constructor o inicializador
}
```

Solo funciona si `strictNullChecks` está activo. Promueve clases bien definidas.

## `strictBindCallApply`

Habilita el chequeo de tipos para los métodos `bind`, `call` y `apply`. Verifica que los argumentos coincidan con la firma.

```ts
function saludar(nombre: string) { }
saludar.call(null, 42); // Error con strictBindCallApply
```

## `alwaysStrict`

Emite `"use strict"` en cada archivo de salida. Prácticamente siempre se activa en proyectos modernos.

## Combinación de `strict: true`

Activa todas las anteriores y añade otras futuras. Es la configuración recomendada para nuevos proyectos. Se puede desactivar una bandera concreta si causa problemas, pero es mejor adaptar el código.

## Otras banderas de calidad relevantes

- **`noUnusedLocals`**: reporta variables locales declaradas pero no usadas. Muy útil para limpiar código.
- **`noUnusedParameters`**: similar para parámetros de función. Los que empiezan por `_` se ignoran en algunas convenciones, pero aquí no por defecto.
- **`exactOptionalPropertyTypes`** (TS 4.4): distingue entre `prop?: Tipo` y `prop?: Tipo | undefined`. Con esta bandera, una propiedad opcional no puede recibir `undefined` explícitamente; solo omitirse. Útil para APIs REST y formularios.
- **`noUncheckedIndexedAccess`** (TS 4.1, en beta experimental): añade `| undefined` a todos los accesos indexados. Por ejemplo, `array[0]` pasa a ser `T | undefined`. Refleja la realidad del runtime, pero puede ser verboso; se activa bajo demanda.
- **`noPropertyAccessFromIndexSignature`**: obliga a usar notación de corchetes para propiedades que vienen de una firma de índice, evitando errores en nombres.
- **`noImplicitOverride`**: obliga a usar la palabra clave `override` al sobrescribir métodos.
- **`useUnknownInCatchVariables`**: cambia el tipo de la variable del `catch` de `any` a `unknown`, forzando un manejo seguro.

## Configuración recomendada para máxima calidad

```json
{
  "strict": true,
  "noUnusedLocals": true,
  "noUnusedParameters": true,
  "exactOptionalPropertyTypes": true,
  "noImplicitReturns": true,
  "noFallthroughCasesInSwitch": true,
  "forceConsistentCasingInFileNames": true,
  "skipLibCheck": true
}
```

Cada bandera añade una capa de protección. En proyectos existentes, se pueden activar progresivamente para no saturar con errores.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Compileroptions](02-compilerOptions.md) | [🏠 Inicio](../index.md) | [Project references ▶](04-project-references.md) |
