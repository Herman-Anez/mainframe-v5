# Campos privados y estaticos

## Campos de clase públicos

Definen propiedades propias en cada instancia sin necesidad de asignarlas en el constructor. Se sitúan fuera de cualquier método.

```javascript
class Rectangulo {
  alto = 10;          // campo público
  ancho = 20;
  constructor(alto, ancho) {
    if (alto !== undefined) this.alto = alto;
    if (ancho !== undefined) this.ancho = ancho;
  }
}
```

Se pueden declarar sin inicializar (valor `undefined`). La inicialización ocurre antes del cuerpo del constructor (en orden de declaración), después de `super()`.

## Campos privados (Private Fields)

Los identificadores con `#` al principio crean campos verdaderamente privados, inaccesibles fuera de la clase.

```javascript
class CuentaBancaria {
  #saldo = 0;

  constructor(saldoInicial) {
    this.#saldo = saldoInicial;
  }

  depositar(monto) {
    this.#saldo += monto;
  }

  get saldo() {
    return this.#saldo;
  }
}

const c = new CuentaBancaria(100);
console.log(c.#saldo); // SyntaxError (no se puede acceder)
```

- El nombre incluye la almohadilla: `#saldo`. Se escribe `this.#saldo` dentro de la clase.
- No se pueden crear campos privados dinámicamente; deben declararse.
- Son invisibles para `Object.keys()`, `JSON.stringify()`, `Proxy`, etc.
- No pueden tener inicializadores diferidos que dependan de `this` sin estar en el constructor (se evalúan antes del constructor, salvo que dependan de argumentos).

### Métodos privados

También con `#`. Se pueden declarar como funciones o getters/setters.

```javascript
class Logger {
  #log(mensaje) {
    console.log(`[LOG]: ${mensaje}`);
  }

  info(msg) {
    this.#log(msg);
  }
}
```

### Campos estáticos (públicos y privados)

```javascript
class Config {
  static version = "1.0.0";
  static #instancias = 0; // estático privado

  constructor() {
    Config.#instancias++;
  }
}
```

- Los campos estáticos públicos se definen con `static` y se acceden como `Clase.propiedad`.
- Los estáticos privados solo pueden usarse dentro de la clase.

## Orden de inicialización

1. Campos de instancia públicos y privados se inicializan antes de la ejecución del cuerpo del constructor (inmediatamente después de `super()` en subclases).
2. El constructor ejecuta el resto del código.

## Consideraciones de compatibilidad

Los campos privados (ES2022) están soportados en todos los navegadores modernos y Node.js a partir de la versión 12 con bandera, y plenamente desde 14+.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Clases es6](07-clases-es6.md) | [🏠 Inicio](../index.md) | [Metodos de object ▶](09-metodos-de-object.md) |
