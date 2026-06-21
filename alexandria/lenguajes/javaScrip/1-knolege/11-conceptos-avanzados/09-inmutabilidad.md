# Inmutabilidad

## Concepto

La **inmutabilidad** implica que una vez creado un valor, no puede ser modificado. En lugar de cambiar un objeto o array, se crea una nueva copia con los cambios aplicados. Esto evita efectos secundarios no deseados y facilita el razonamiento sobre el estado, especialmente en aplicaciones reactivas y programación funcional.

## Primitivos vs objetos

- Los primitivos (`number`, `string`, `boolean`, `undefined`, `null`, `symbol`, `bigint`) son inmutables por naturaleza. Operaciones como `str.toUpperCase()` devuelven un nuevo string.
- Los objetos (incluyendo arrays y funciones) son mutables. Se necesita un enfoque disciplinado para la inmutabilidad.

## Técnicas de inmutabilidad en JavaScript

### 1. No mutar directamente

En lugar de `array.push(4)`, usar `[...array, 4]`.
En lugar de `obj.nuevaProp = x`, usar `{ ...obj, nuevaProp: x }`.

### 2. Object.freeze y Object.seal

- `Object.freeze(obj)` hace que el objeto sea inmutable a nivel superficial: no se pueden añadir, eliminar ni modificar propiedades. Los intentos fallan silenciosamente (o lanzan error en modo estricto). Sin embargo, las propiedades anidadas que son objetos siguen siendo mutables.

```javascript
const config = Object.freeze({ tema: 'oscuro', opciones: { sonido: true } });
config.tema = 'claro'; // no tiene efecto
config.opciones.sonido = false; // sí se modifica (porque opciones no está congelado)
```

Para una inmutabilidad profunda, se necesita una función recursiva (o usar bibliotecas).

### 3. Estructuras de datos persistentes

Bibliotecas como **Immutable.js** o **Immer** proporcionan tipos de datos que al "modificar" devuelven una nueva versión compartiendo estructura, optimizando memoria y rendimiento.

- **Immer** usa un enfoque con proxies: permite escribir código mutable dentro de una función `produce` y automáticamente produce el siguiente estado inmutable.

```javascript
import { produce } from 'immer';
const state = { contador: 1, items: [] };
const nextState = produce(state, draft => {
  draft.contador++;
  draft.items.push('nuevo');
});
// state no ha sido modificado; nextState es una copia con los cambios.
```

### 4. Convenciones y herramientas

- Linters (ESLint) pueden forzar no mutar argumentos o variables (`no-param-reassign`, `immutable-data`).
- TypeScript con tipos `readonly` y `ReadonlyArray` ayuda en tiempo de compilación.

```typescript
const arr: ReadonlyArray<number> = [1, 2, 3];
arr.push(4); // Error
```

## Ventajas de la inmutabilidad

- **Previsibilidad**: el estado no cambia inesperadamente.
- **Detección de cambios**: una comparación por referencia (`===`) basta para saber si algo cambió (útil en React, Redux).
- **Historial/deshacer**: mantener snapshots anteriores es trivial.
- **Concurrencia**: en entornos multi-hilo (workers), los objetos inmutables evitan condiciones de carrera.

## Costos

- Mayor consumo de memoria si se crean muchas copias.
- Sobrecarga de CPU al copiar grandes estructuras (mitigada con estructuras persistentes).
- Curva de aprendizaje y posible verbosidad.

## Inmutabilidad y React

En React, el estado debe ser inmutable para que los componentes se re-rendericen correctamente. Métodos como `setState` o el hook `useState` esperan un nuevo objeto en lugar de mutar el existente.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Memoizacion](08-memoizacion.md) | [🏠 Inicio](../index.md) | [Gestion de memoria ▶](10-gestion-de-memoria.md) |
