# Template literal types

Los template literal types (TLT) llevan la manipulación de cadenas al sistema de tipos. Combinados con uniones y `infer`, permiten parsear y generar identificadores en tiempo de compilación.

## Sintaxis y distribución

Un TLT se escribe como una plantilla de cadena dentro de un tipo:

```ts
type Saludo = `Hola, ${string}`;
type Eventos = "click" | "focus";
type Controladores = `on${Capitalize<Eventos>}`; // "onClick" | "onFocus"
```

Cuando interpolamos una **unión**, el TLT distribuye automáticamente, produciendo una unión de todas las combinaciones. Si interpolamos múltiples uniones, obtenemos el producto cartesiano:

```ts
type Vertical = "top" | "bottom";
type Horizontal = "left" | "right";
type Posicion = `${Vertical}-${Horizontal}`;
// "top-left" | "top-right" | "bottom-left" | "bottom-right"
```

## Manipulación de mayúsculas/minúsculas

Cuatro tipos intrínsecos (no tienen implementación, son directivas del compilador):

- `Uppercase<S>`
- `Lowercase<S>`
- `Capitalize<S>`
- `Uncapitalize<S>`

Son esenciales para normalizar cadenas en remapeo de claves o en validaciones.

## Pattern matching con `infer`

Dentro de un tipo condicional, podemos usar `infer` en un TLT para descomponer cadenas:

```ts
type ExtraerId<Ruta extends string> =
  Ruta extends `${string}/usuario/${infer Id}/${string}` ? Id : never;

type Id = ExtraerId<"/api/usuario/42/perfil">; // "42"
```

Podemos capturar múltiples partes:

```ts
type Partes<Ruta extends string> =
  Ruta extends `${infer Primero}/${infer Resto}` ? [Primero, ...Partes<Resto>] : [Ruta];
```

Esto recursivamente descompone una ruta en un tuple de segmentos.

## Recursión con TLT

Los TLT recursivos permiten implementar parsers completos: formateo de rutas, validación de cadenas con formato específico (ej. UUID), e incluso motores de SQL tipado. Ejemplo: convertir separadores:

```ts
type KebabToCamel<S extends string> =
  S extends `${infer Parte}-${infer Resto}`
    ? `${Parte}${Capitalize<KebabToCamel<Resto>>}`
    : S;
type Camel = KebabToCamel<"mi-componente-react">; // "miComponenteReact"
```

## Key remapping avanzado con TLT

Combinado con tipos mapeados, podemos generar APIs completas. Por ejemplo, añadir getters y setters:

```ts
type Store<T> = {
  [K in keyof T as `get${Capitalize<K & string>}`]: () => T[K];
} & {
  [K in keyof T as `set${Capitalize<K & string>}`]: (val: T[K]) => void;
};
```

O validar que ciertas propiedades sigan un patrón de prefijo.

## Limitaciones

- Los TLT solo operan con tipos string literales; no pueden evaluar expresiones aritméticas.
- La recursión profunda puede causar errores de "excesivamente profundo" en el compilador. Para iterar sobre uniones grandes, a veces es preferible usar tipos mapeados condicionales en lugar de recursión.
- Las uniones con muchos miembros (decenas) pueden generar un número combinatorio enorme; hay que controlar las explosiones combinatorias.

## Aplicaciones reales

- **Routers tipados**: parsear rutas y extraer parámetros.
- **Sistemas de eventos**: garantizar que los nombres de eventos y sus payloads estén sincronizados.
- **Bibliotecas CSS-in-JS**: generar nombres de clases con prefijos y sufijos basados en estados.
- **Formateo de strings** para mensajes internacionalizados con parámetros obligatorios.
- **Generadores de código** que usan TypeScript como motor de transformación de tipos.

Dominar los template literal types eleva la capacidad de expresar restricciones de cadena directamente en el sistema de tipos, eliminando categorías enteras de errores en tiempo de ejecución.

---

Cada uno de estos temas tiene capas adicionales de complejidad cuando se combinan entre sí. Te animo a experimentar en el playground de TypeScript, porque la verdadera maestría surge al ver cómo el compilador evalúa las expresiones de tipos y al encontrar esos patrones que resuelven problemas del mundo real.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Tipos mapeados](03-tipos-mapeados.md) | [🏠 Inicio](../index.md) | [Infer y extract ▶](05-infer-y-extract.md) |
