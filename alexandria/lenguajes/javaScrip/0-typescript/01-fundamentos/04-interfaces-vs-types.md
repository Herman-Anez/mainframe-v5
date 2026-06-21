# Interfaces vs Types

Ambos definen la forma de un objeto, pero tienen capacidades y filosofías diferentes.

## Interfaces

```ts
interface Usuario {
  nombre: string;
  edad: number;
  saludar(): void;
}
```

- **Extensión**: mediante `extends`, pueden heredar de otras interfaces.
- **Merging**: múltiples declaraciones con el mismo nombre en el mismo ámbito se fusionan automáticamente.
- **Performance**: ligeramente más rápidas en el compilador para objetos, porque fueron diseñadas para ello.

```ts
interface Animal {
  nombre: string;
}
interface Perro extends Animal {
  ladrar(): void;
}
// Declaración merging: útil para extender tipos globales
interface Window {
  miFuncion: () => void;
}
```

## Type aliases

```ts
type Usuario = {
  nombre: string;
  edad: number;
  saludar(): void;
};
```

- No pueden fusionarse; si se redeclaran, causa error.
- Pueden representar **cualquier** tipo: primitivas, uniones, intersecciones, tuplas.
- Permiten tipos condicionales y mapeados de forma natural.

```ts
type ID = string | number;
type Punto = [number, number];
type Respuesta<T> = { datos: T; error?: string };
```

## Cuándo usar cada uno

- Prefiere **interfaces** para describir la forma de objetos que puedan ser extendidos por terceros o que forman parte de APIs públicas. El merging es una ventaja para aumentación.
- Prefiere **type** para uniones, intersecciones complejas, tipos mapeados, tipos condicionales o cuando necesitas nombrar un tipo compuesto no exclusivamente de objeto.

En la práctica, la mayoría del código puede ser escrito con ambos, y muchos proyectos eligen `type` por consistencia, salvo cuando necesitan merging.

## Diferencias profundas

- **Recursividad**: los tipos permiten referencias recursivas más naturalmente (ej. `type Arbol<T> = { valor: T; hijos: Arbol<T>[] }`). Las interfaces también pueden, pero a veces necesitan un `interface` auxiliar.
- **Mapped types**: solo se pueden crear con `type`. Una interfaz no puede generarse dinámicamente a partir de un `keyof`.
- **Uniones de interfaces** no se pueden declarar directamente, pero puedes usar `type Union = InterfaceA | InterfaceB`.
- **Errores**: cuando usas interfaces, los mensajes de error suelen mostrar el nombre de la interfaz; con tipos, a veces se expande la forma completa, lo que puede ser más o menos legible.

## Index signatures y ambas

Tanto interfaces como types soportan firmas de índice:

```ts
interface Diccionario {
  [clave: string]: number;
}
type DiccionarioType = { [clave: string]: number };
```

Para combinarlas con propiedades conocidas, se requiere que el tipo de la propiedad coincida con el de la firma.

## Implementación en clases

Una clase puede `implement` tanto una interfaz como un tipo con forma de objeto (si está compuesto por propiedades/métodos). Las uniones no pueden implementarse directamente.

```ts
interface Imprimible { print(): void }
class Documento implements Imprimible {
  print() { }
}
```

## Recomendaciones finales

- Si estás construyendo una librería, usa interfaces para puntos de extensión.
- Si necesitas definir un tipo que es una unión, o un tipo mapeado, no tienes más opción que `type`.
- Para objetos sin previsión de extensión, ambos funcionan. Consistencia > preferencia.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Tipos literales y uniones](03-tipos-literales-y-uniones.md) | [🏠 Inicio](../index.md) | [Funciones ▶](05-funciones.md) |
