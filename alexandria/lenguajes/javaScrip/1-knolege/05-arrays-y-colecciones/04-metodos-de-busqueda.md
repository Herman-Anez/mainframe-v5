# Metodos de busqueda

## `indexOf(searchElement, fromIndex?)`

Busca la primera aparición de `searchElement` utilizando **comparación estricta** (`===`). Devuelve el índice encontrado o `-1`. Acepta un segundo parámetro para iniciar la búsqueda desde ese índice (por defecto 0). Los índices negativos cuentan desde el final.

```javascript
["a", "b", "a", "c"].indexOf("a");     // 0
["a", "b", "a", "c"].indexOf("a", 2);  // 2
["a", "b", "a", "c"].indexOf("x");     // -1
```

Casos especiales: no puede encontrar `NaN` porque `NaN === NaN` es `false`. Para eso se usa `includes` o `findIndex`.

## `lastIndexOf(searchElement, fromIndex?)`

Similar a `indexOf` pero busca desde el final hacia atrás. El parámetro `fromIndex` indica el índice donde comienza la búsqueda hacia atrás (por defecto `length - 1`). Los negativos se interpretan como desplazamiento desde el final.

```javascript
["a", "b", "a", "c"].lastIndexOf("a");     // 2
["a", "b", "a", "c"].lastIndexOf("a", 1);  // 0
```

## `includes(searchElement, fromIndex?)` (ES7/ES2016)

Determina si el array contiene un valor usando el algoritmo **SameValueZero**, que es como `===` pero trata `NaN` como igual a `NaN`. Retorna `true` o `false`.

```javascript
[1, 2, NaN].includes(NaN); // true
[1, 2, 3].includes(2);     // true
[1, 2, 3].includes(4);     // false
```

Es la forma más legible de comprobar pertenencia. Para objetos, compara referencias, no estructuras.

## `find(callback)` y `findIndex(callback)` (ES6)

Ya mencionados en los métodos funcionales, pero son esencialmente métodos de búsqueda con callback personalizado. Permiten encontrar un elemento o su índice basado en una condición arbitraria.

```javascript
const personas = [{ nombre: "Ana" }, { nombre: "Luis" }];
personas.find(p => p.nombre === "Luis"); // { nombre: "Luis" }
personas.findIndex(p => p.nombre === "Pedro"); // -1
```

## Métodos basados en valor vs referencia

- `indexOf`, `lastIndexOf`, `includes`: comparan valores primitivos por igualdad estricta (o SameValueZero en `includes`).
- Para objetos, se basan en la **referencia**. Dos objetos distintos con las mismas propiedades no se consideran iguales.

```javascript
const a = { id: 1 };
const b = { id: 1 };
[a].includes(a); // true
[a].includes(b); // false
```

Para buscar por contenido, se usa `find` o `findIndex` con una función que compare las propiedades relevantes.

## Búsqueda en arrays ordenados

No existe un método nativo de búsqueda binaria. Si el array está ordenado, se puede implementar manualmente o usar librerías. La búsqueda lineal con `find` sigue siendo la opción estándar.

## Rendimiento

- `indexOf`/`includes` en arrays pequeños es muy rápido. En arrays grandes, si se realizan muchas búsquedas, puede ser más eficiente convertir el array a un `Set` y usar `has` (sublinear en promedio) o a un `Map` indexado por el campo de búsqueda.

## Nota sobre huecos

`indexOf` e `includes` no distinguen entre un elemento con valor `undefined` y un hueco; ambos devolverán `true` o el índice correspondiente si se busca `undefined`. Los métodos funcionales como `find` y `findIndex` ignoran los huecos (no pasan el callback sobre ellos), por lo que `undefined` explícito sí sería encontrado, pero un hueco no se evaluaría.

```javascript
const arr = [0, , 2]; // disperso
arr.includes(undefined); // true (encuentra el hueco como undefined)
arr.find(x => x === undefined); // undefined (porque no itera sobre el hueco)
```

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Metodos funcionales](03-metodos-funcionales.md) | [🏠 Inicio](../index.md) | [Spread y rest ▶](05-spread-y-rest.md) |
