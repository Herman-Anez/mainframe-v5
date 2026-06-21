# This polimorfico

El tipo polimórfico `this` permite que un método devuelva el tipo de la instancia actual, en lugar del tipo de la clase donde se define. Es esencial para **interfaces fluidas** (method chaining) que funcionan correctamente en subclases.

## Retornar `this`

```ts
class QueryBuilder {
  select(campos: string): this {
    // ...
    return this;
  }
  where(condicion: string): this {
    // ...
    return this;
  }
}
```

Si una subclase hereda de `QueryBuilder`, los métodos `select` y `where` devolverán la instancia de la subclase, no `QueryBuilder`. Esto permite encadenar sin perder el tipo:

```ts
class AdvancedQuery extends QueryBuilder {
  join(tabla: string): this {
    // ...
    return this;
  }
}

new AdvancedQuery()
  .select("a")
  .where("b")
  .join("c"); // `join` está disponible porque `select` devuelve `AdvancedQuery`
```

Si los métodos retornaran `QueryBuilder`, el tipo después de `where` sería `QueryBuilder` y no se podría llamar a `join`.

## Diferencia entre `this` y el nombre de la clase

- `this` es el tipo de la instancia actual, que puede ser más específica.
- `NombreClase` es exactamente esa clase y no tiene en cuenta herencia.
- El compilador resuelve `this` como el tipo de la instancia de la clase que finalmente se instancia.

## Uso en interfaces

Se puede usar `this` como tipo de retorno en interfaces para forzar a las implementaciones a devolver la propia instancia:

```ts
interface Clonable {
  clone(): this;
}
```

Cualquier clase que implemente `Clonable` debe devolver `this`, lo que garantiza que `new MiClase().clone()` sea de tipo `MiClase`.

## Restricciones de `this`

- No se puede usar `this` en contextos estáticos.
- No se puede usar `this` como tipo de un parámetro (eso es otra cosa: el falso primer parámetro para tipar el contexto).
- `this` puede aparecer solo como tipo de retorno o dentro de la clase como tipo de una propiedad que referencia a la instancia (poco común).

## Fluent interfaces con jerarquías profundas

El patrón es extremadamente útil en builders, constructores de objetos, consultas SQL, configuraciones de tests, etc. Permite un encadenamiento natural que el autocompletado sigue perfectamente.

## `this` en funciones con tipado de contexto

No confundir con el uso de `this` como primer parámetro falso para indicar el tipo del contexto de ejecución:

```ts
function onClick(this: HTMLElement, e: Event) { }
```

Ese `this` no afecta al tipo de retorno ni al encadenamiento; es puramente para el chequeo de `this` dentro de la función.

## Buenas prácticas

- Prefiere `this` como tipo de retorno en métodos de clases que retornan la instancia.
- Si necesitas un método que devuelva la clase base en lugar de la instancia actual (raro), usa el nombre de la clase explícitamente.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Mixins](03-mixins.md) | [🏠 Inicio](../index.md) | [Functional patterns ▶](05-functional-patterns.md) |
