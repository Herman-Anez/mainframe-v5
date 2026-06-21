# Enums

Los enums (enumeraciones) agrupan un conjunto de constantes con nombre.

## Enums numéricos

```ts
enum Direccion {
  Arriba,    // 0
  Abajo,     // 1
  Izquierda, // 2
  Derecha    // 3
}
let dir: Direccion = Direccion.Arriba;
```

Se puede inicializar con un valor específico; los siguientes se autoincrementan.

```ts
enum Estado {
  Activo = 1,
  Inactivo,    // 2
  Pendiente = 5,
  Cancelado    // 6
}
```

**Reverse mapping**: en enums numéricas, también se puede acceder al nombre desde el valor.

```ts
let nombreEstado: string = Estado[2]; // "Inactivo"
```

## Enums de cadena

Cada miembro debe inicializarse con una cadena literal. No tienen reverse mapping.

```ts
enum Colores {
  Rojo = "ROJO",
  Verde = "VERDE",
  Azul = "AZUL"
}
```

Son más legibles en depuración.

## Enums heterogéneas

Mezcla de string y número; no recomendado.

## Const enums

Se definen con `const enum`. El compilador inlinea los valores en lugar de generar un objeto de enum en tiempo de ejecución.

```ts
const enum Tamaño {
  Pequeño = 1,
  Mediano,
  Grande
}
let t = Tamaño.Grande; // compila a let t = 3
```

**Precaución**: si el código es consumido por otros módulos que no usan TypeScript, o si la opción `isolatedModules` está activa, los `const enum` pueden causar errores porque no existe el objeto en runtime. Muchos proyectos los evitan.

## Enums como tipos

Una enum define tanto un valor (objeto) como un tipo. El tipo representa la unión de todos los miembros.

```ts
type Color = Colores; // "ROJO" | "VERDE" | "AZUL"
let c: Color = Colores.Rojo;
```

Desde TS 5.0, todas las enums se tratan como uniones de sus miembros, mejorando la compatibilidad.

## Enums ambientales

Se usan para describir enums que existen en runtime pero que TypeScript no puede ver (por ejemplo, en código JS antiguo). Con `declare enum` no se emite código.

```ts
declare enum EnumExterno {
  A = 1,
  B,
  C = 2
}
```

## Enums vs uniones de literales

Para la mayoría de los casos, las uniones de literales (`type Color = "rojo" | "verde" | "azul"`) son más ligeras, no generan código adicional y no presentan los problemas de los `const enum`. Las enums son útiles si necesitas reverse mapping, iterar sobre los miembros, o si el valor numérico es relevante en el runtime.

## Computed members

En enums numéricas, los miembros pueden tener valores calculados (expresiones constantes). Las de cadena solo pueden ser literales.

```ts
enum Archivo {
  None = 0,
  Read = 1 << 1,
  Write = 1 << 2,
  ReadWrite = Read | Write
}
```

Esto permite bit flags. Para este caso, las enums son muy apropiadas.

---

Con estos ocho bloques fundamentales bien asentados, se dispone de la base para aprovechar todo el sistema de tipos de TypeScript y abordar construcciones más avanzadas. Cada uno de estos temas puede expandirse aún más con ejercicios y exploración de las opciones del compilador, pero la profundidad aquí presentada cubre desde lo sintáctico hasta los porqués, las trampas y las mejores prácticas.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Genéricos – Introducción](07-genericos-introduccion.md) | [🏠 Inicio](../index.md) | [Uniones e intersecciones ▶](../02-tipos-avanzados/01-uniones-e-intersecciones.md) |
