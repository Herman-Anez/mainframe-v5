# Metodos de object

## `Object.keys(obj)`

Retorna un array con las **claves propias enumerables** (como cadenas) del objeto.

```javascript
const obj = { a: 1, b: 2 };
Object.keys(obj); // ["a", "b"]
```

No incluye propiedades de la cadena de prototipos ni símbolos.

## `Object.values(obj)`

Devuelve un array con los valores de las propiedades propias enumerables.

```javascript
Object.values({ a: 1, b: 2 }); // [1, 2]
```

## `Object.entries(obj)`

Devuelve un array de pares `[clave, valor]` propios enumerables.

```javascript
Object.entries({ a: 1, b: 2 }); // [["a",1], ["b",2]]
```

Muy útil para iterar con `for...of` o para construir `Map`.

## `Object.assign(target, ...sources)`

Copia todas las propiedades **propias enumerables** de los objetos fuente al objeto destino. Devuelve el destino.

```javascript
const destino = { a: 1 };
Object.assign(destino, { b: 2 }, { c: 3 });
// destino: { a:1, b:2, c:3 }
```

- Es una **copia superficial**: los objetos anidados se comparten por referencia.
- Los getters de las fuentes se ejecutan y se asigna el valor resultante, no el getter.
- No copia símbolos no enumerables ni propiedades de la cadena.

Se usa para clonar superficialmente: `const copia = Object.assign({}, original);`

## `Object.freeze(obj)`

Congela el objeto: impide añadir, eliminar o modificar propiedades. Las propiedades existentes se vuelven `writable: false` y `configurable: false`.

```javascript
const obj = Object.freeze({ x: 10 });
obj.x = 20; // no tiene efecto (en modo estricto TypeError)
```

Devuelve el mismo objeto (no una copia). La congelación es superficial; los objetos anidados permanecen mutables. Para congelación profunda, se requiere una función recursiva.

Se puede comprobar con `Object.isFrozen(obj)`.

## `Object.seal(obj)`

Sella el objeto: no se pueden añadir ni eliminar propiedades, pero las existentes pueden modificarse si son `writable`. Internamente pone `configurable: false` a todas las propiedades.

```javascript
const obj = { y: 2 };
Object.seal(obj);
delete obj.y; // false, no se borra
obj.y = 10;   // funciona si writable: true
```

`Object.isSealed(obj)` comprueba el estado.

## `Object.is(value1, value2)`

Compara dos valores con el algoritmo `SameValue`. Es similar a `===`, pero trata `NaN` y los ceros con signo de manera diferente:

```javascript
Object.is(NaN, NaN);      // true (=== da false)
Object.is(+0, -0);        // false (=== da true)
Object.is(0, -0);         // false
```

## `Object.hasOwn(obj, prop)`

Introducido en ES2022. Retorna `true` si el objeto tiene la propiedad como propia, sin importar si es enumerable o no. Evita problemas de `obj.hasOwnProperty` cuando el objeto puede tener una propiedad llamada `hasOwnProperty` o un prototipo nulo.

```javascript
const obj = { foo: 1 };
Object.hasOwn(obj, 'foo'); // true
Object.hasOwn(obj, 'toString'); // false
```

## `Object.fromEntries(iterable)`

Construye un objeto a partir de un iterable de pares clave-valor (como el que devuelve `Object.entries`).

```javascript
const entries = [['nombre', 'Luis'], ['edad', 25]];
Object.fromEntries(entries); // { nombre: 'Luis', edad: 25 }
```

Perfecto para transformar objetos o para convertir `Map` a objeto.

## `Object.getOwnPropertyDescriptors(obj)`

Devuelve un objeto con todos los descriptores de propiedades propias. Esencial para copiar getters/setters y atributos exactos.

```javascript
const fuente = { get x() { return 1; } };
const copia = Object.defineProperties({}, Object.getOwnPropertyDescriptors(fuente));
```

## `Object.preventExtensions(obj)`, `Object.isExtensible(obj)`

- `preventExtensions` impide que se agreguen nuevas propiedades al objeto (las existentes se pueden modificar o eliminar).
- `isExtensible` verifica si es posible añadir propiedades.

## `Object.getOwnPropertyNames(obj)`

Todas las claves propias (cadenas), enumerables o no.

## `Object.getOwnPropertySymbols(obj)`

Todos los símbolos propios, enumerables o no.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Campos privados y estaticos](08-campos-privados-y-estaticos.md) | [🏠 Inicio](../index.md) | [Destructuring ▶](10-destructuring.md) |
