# Symbols iteradores

## Repaso de Symbols

`Symbol` es un tipo primitivo que genera valores únicos e inmutables. Cada símbolo es distinto, incluso si se crean con la misma descripción.

```javascript
const s1 = Symbol('id');
const s2 = Symbol('id');
console.log(s1 === s2); // false
```

### Símbolos globales

`Symbol.for(clave)` busca un símbolo en un registro global y lo crea si no existe. `Symbol.keyFor(simbolo)` recupera la clave asociada.

```javascript
const global = Symbol.for('app.identificador');
console.log(Symbol.keyFor(global)); // 'app.identificador'
```

### Símbolos bien conocidos (Well-known Symbols)

Definidos en la especificación, permiten personalizar comportamientos del lenguaje. Los más relevantes para iteración:

- `Symbol.iterator`
- `Symbol.asyncIterator`
- `Symbol.toStringTag`
- `Symbol.toPrimitive`
- `Symbol.isConcatSpreadable`
- `Symbol.species`

## Iteradores y el protocolo iterable

### Protocolo iterable

Un objeto es iterable si tiene un método `[Symbol.iterator]` que retorna un **iterador**. El iterador debe implementar un método `next()` que devuelve un objeto `{ value, done }`.

### Implementación personalizada de un iterable

```javascript
const rango = {
  inicio: 1,
  fin: 5,
  [Symbol.iterator]() {
    let actual = this.inicio;
    const fin = this.fin;
    return {
      next() {
        if (actual > fin) return { done: true };
        return { value: actual++, done: false };
      }
    };
  }
};

for (const num of rango) {
  console.log(num); // 1,2,3,4,5
}
```

### Símbolos e iteración en objetos nativos

Array, String, Map, Set y otros tienen sus propios `Symbol.iterator`. Cuando se usa `for...of`, el motor busca ese método.

```javascript
const mapa = new Map([['a', 1]]);
for (const [clave, valor] of mapa) { /* ... */ }
// Equivalente a mapa[Symbol.iterator]()
```

### `Symbol.iterator` en objetos personalizados

Se puede añadir a cualquier objeto para volverlo compatible con `for...of`, spread (`[...obj]`), y funciones como `Array.from`.

```javascript
class Coleccion {
  constructor() {
    this.items = [];
  }
  agregar(item) {
    this.items.push(item);
  }
  [Symbol.iterator]() {
    let i = 0;
    const items = this.items;
    return {
      next() {
        if (i < items.length) return { value: items[i++], done: false };
        return { done: true };
      }
    };
  }
}
```

### `Symbol.asyncIterator`

Para iterables que producen valores de forma asíncrona. Se usa con `for await...of`. El método `next()` devuelve una promesa de `{ value, done }`.

```javascript
const asyncIterable = {
  [Symbol.asyncIterator]() {
    let i = 0;
    return {
      async next() {
        if (i < 3) {
          await new Promise(r => setTimeout(r, 100));
          return { value: i++, done: false };
        }
        return { done: true };
      }
    };
  }
};

(async () => {
  for await (const val of asyncIterable) {
    console.log(val);
  }
})();
```

Los generadores asíncronos (`async function*`) devuelven objetos que implementan `Symbol.asyncIterator` automáticamente.

## Iteradores con generadores

Las funciones generadoras (`function*`) facilitan la creación de iterables e iteradores. El valor retornado por el generador implementa tanto `[Symbol.iterator]` como `next`.

```javascript
function* generarFibonacci(limite) {
  let a = 0, b = 1;
  for (let i = 0; i < limite; i++) {
    yield a;
    [a, b] = [b, a + b];
  }
}

for (const n of generarFibonacci(10)) {
  console.log(n);
}
```

Internamente, el generador produce un objeto que tiene `Symbol.iterator` que se retorna a sí mismo, y el protocolo se cumple.

### Símbolos como identificadores de propiedades

Gracias a su unicidad, los símbolos se usan para definir propiedades "semi-privadas" o para evitar colisiones en metaprogramación.

```javascript
const _saldo = Symbol('saldo');
class Cuenta {
  constructor(saldoInicial) {
    this[_saldo] = saldoInicial;
  }
  getSaldo() {
    return this[_saldo];
  }
}
```

Aunque no son completamente privadas (se pueden listar con `Object.getOwnPropertySymbols`), evitan conflictos con nombres de cadena y no aparecen en `for...in` o `JSON.stringify`.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Proxy y reflect](03-proxy-y-reflect.md) | [🏠 Inicio](../index.md) | [Event loop profundo ▶](05-event-loop-profundo.md) |
