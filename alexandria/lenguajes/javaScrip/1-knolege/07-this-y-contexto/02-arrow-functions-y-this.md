# Arrow functions y this

## `this` léxico en funciones flecha

Las funciones flecha **no tienen su propio `this`**. En su lugar, capturan el valor de `this` del ámbito léxico que las envuelve en el momento de su definición. Esto resuelve de raíz muchos problemas de pérdida de contexto.

```javascript
const objeto = {
  nombre: 'Flecha',
  metodo: function() {
    const flecha = () => {
      console.log(this.nombre);
    };
    flecha();
  }
};
objeto.metodo(); // Flecha (this heredado del método tradicional que apunta a objeto)
```

El `this` de la flecha es el mismo que el de `metodo` en el momento en que `metodo` es invocado. Si `metodo` se llama como método de `objeto`, `this` es `objeto`, por lo que la flecha hereda ese valor. Este comportamiento es fijo y no cambia aunque la función flecha se pase como callback o se invoque de otra forma.

## Enlace estático

A diferencia de las funciones tradicionales, el `this` de una flecha no puede ser sobrescrito con `call`, `apply` o `bind`. Cualquier intento será ignorado (aunque `bind` devuelve una nueva función cuyo `this` sigue estando bloqueado al valor original de la flecha).

```javascript
const flecha = () => console.log(this);
flecha.call({ a: 1 }); // ignora el objeto, imprime el this léxico (global/undefined)
```

Por eso, las funciones flecha **no son adecuadas** para métodos que requieran `this` dinámico (por ejemplo, métodos de objetos literales o de prototipos cuando se espera que `this` sea la instancia). Tampoco pueden ser constructores, porque no poseen la propiedad interna `[[Construct]]`.

## Casos de uso ideales

### Callbacks dentro de métodos

```javascript
class Contador {
  constructor() {
    this.cuenta = 0;
  }
  iniciar() {
    setInterval(() => {
      this.cuenta++; // this es la instancia de Contador
    }, 1000);
  }
}
```

Sin la flecha, `this` dentro de `setInterval` sería el objeto global (o `undefined`), por lo que tradicionalmente se asignaba `this` a una variable (`var self = this;`). Con la flecha, se captura el `this` correcto del método.

### Mapeo y filtrado con funciones de array

```javascript
const grupo = {
  descuento: 0.1,
  precios: [100, 200, 300],
  preciosConDescuento() {
    return this.precios.map(precio => precio * (1 - this.descuento));
  }
};
console.log(grupo.preciosConDescuento()); // [90, 180, 270]
```

La flecha dentro de `map` captura el `this` de `preciosConDescuento`, que es `grupo`. Si se usara una función tradicional, habría que capturar `this` o usar `bind`.

## No usar arrow functions como métodos de objeto

El siguiente código falla porque la flecha toma el `this` del ámbito donde se define el objeto, no del propio objeto:

```javascript
const mal = {
  nombre: 'Mal',
  saludar: () => `Hola ${this.nombre}`
};
console.log(mal.saludar()); // Hola undefined (this es el global o undefined)
```

`this` está capturado del ámbito léxico donde se define el objeto literal (que puede ser global u otro contexto). No apunta al objeto `mal`. Para métodos de objeto, deben usarse funciones tradicionales o la sintaxis concisa de método (que es una función tradicional).

## `this` en funciones flecha anidadas

Si una flecha se define dentro de otra flecha, hereda el mismo `this` que su ancestro más cercano con un `this` propio, o el ámbito léxico global.

```javascript
const obj = {
  metodo: function() {
    const flecha1 = () => {
      const flecha2 = () => console.log(this);
      flecha2();
    };
    flecha1();
  }
};
obj.metodo(); // this = obj
```

No importa cuántas capas de anidamiento: todas las flechas comparten el mismo `this` del contexto donde fueron definidas.

## `this` en propiedades de clase (class fields) con arrow functions

Al definir un campo de clase con una función flecha, esta se convierte en una propiedad de instancia. Su `this` se vincula al objeto que se construye.

```javascript
class Componente {
  estado = 'activo';
  manejarClick = () => {
    console.log(this.estado);
  };
}
const comp = new Componente();
comp.manejarClick(); // activo
```

Esto es útil para pasar el método como callback sin preocuparse por la pérdida de contexto. Sin embargo, cada instancia tendrá su propia copia de la función, consumiendo más memoria que un método compartido en el prototipo.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ This global y metodo](01-this-global-y-metodo.md) | [🏠 Inicio](../index.md) | [Call apply bind ▶](03-call-apply-bind.md) |
