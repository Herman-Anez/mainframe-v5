# Arrow functions

## Sintaxis de las funciones flecha

Las funciones flecha introducen una sintaxis concisa. Las variantes principales son:

1. **Sin parámetros**: `() => expresión`
2. **Un parámetro** (paréntesis opcionales): `x => x * 2`
3. **Varios parámetros**: `(a, b) => a + b`
4. **Cuerpo de bloque**: `(a, b) => { return a + b; }`
5. **Devolución de objeto literal**: debe envolverse en paréntesis para evitar ambigüedad con el cuerpo de bloque:
   ```javascript
   const crear = (nombre, edad) => ({ nombre, edad });
   ```

## Características fundamentales

Las arrow functions **no tienen su propio enlace de `this`, `arguments`, `super` ni `new.target`**. Todos ellos se toman del ámbito léxico que las contiene.

### `this` léxico

En una función tradicional, `this` depende de cómo se invoca (objeto, global, `call`, `new`). En una flecha, `this` conserva el valor que tiene en el contexto en el que fue definida, sin importar cómo se llame después.

```javascript
const objeto = {
  nombre: "Mundo",
  tradicional: function() { console.log(this.nombre); },
  flecha: () => { console.log(this.nombre); }
};
objeto.tradicional(); // "Mundo"
objeto.flecha();      // undefined (this es el global o undefined en módulo)
```

Esto las hace ideales para:
- Callbacks que necesitan acceder al `this` de la función externa (por ejemplo, en métodos de clase).
- Funciones anidadas dentro de métodos que requieren el `this` del objeto.

Pero **no** deben usarse como métodos de objeto cuando se necesita el propio objeto como contexto; tampoco como constructores (no tienen `[[Construct]]` ni propiedad `prototype`), y no pueden ser generadores (no aceptan `yield`).

### Sin objeto `arguments`

Dentro de una flecha, `arguments` referencia al objeto `arguments` de la función no flecha que la contiene. Si se accede en el ámbito global, lanza `ReferenceError`. Para recoger argumentos variables en una flecha se usan **parámetros rest** (`...args`).

```javascript
const flecha = (...args) => console.log(args);
flecha(1,2,3); // [1,2,3]
```

### Imposibilidad de ser constructores

Llamar `new flecha()` produce `TypeError`. No poseen la propiedad `prototype`.

### `super` y `new.target`

También se heredan del ámbito léxico padre. Esto permite usarlas dentro de clases para acceder a `super` de forma más limpia, pero con la misma restricción: deben estar definidas en un contexto donde `super` tenga sentido.

### Cuándo no usar arrow functions

- **Como métodos de un objeto** que requieren `this` del objeto.
- **Como manejadores de eventos del DOM** donde se espera `this === elemento`.
- **Cuando se necesita `arguments`** sin usar rest.
- **Cuando la función debe ser un constructor.**

## Casos de uso típicos

- Transformaciones con `map`, `filter`, `reduce`:
  ```javascript
  const duplicados = numeros.map(n => n * 2);
  ```
- Enclosures que capturan `this` de una clase:
  ```javascript
  class Temporizador {
    iniciar() {
      this.segundos = 0;
      setInterval(() => { this.segundos++; }, 1000);
    }
  }
  ```

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Declaracion vs expresion](01-declaracion-vs-expresion.md) | [🏠 Inicio](../index.md) | [Parametros y rest spread ▶](03-parametros-y-rest-spread.md) |
