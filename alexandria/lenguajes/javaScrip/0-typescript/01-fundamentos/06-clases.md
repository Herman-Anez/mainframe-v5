# Clases

TypeScript añade a las clases de ES6 características de tipado estático y acceso controlado.

## Campos y modificadores de acceso

- **public**: accesible desde cualquier lugar (por defecto).
- **protected**: accesible dentro de la clase y subclases.
- **private**: accesible solo dentro de la clase.

Estos modificadores son solo en tiempo de compilación. En runtime, todo es accesible (a menos que uses `#`).

```ts
class Animal {
  public nombre: string;
  private edad: number;
  protected especie: string;

  constructor(nombre: string, edad: number, especie: string) {
    this.nombre = nombre;
    this.edad = edad;
    this.especie = especie;
  }
}
```

## Parámetros de constructor con modificadores

Atajo para declarar e inicializar campos:

```ts
class Vehiculo {
  constructor(public marca: string, private velocidad: number) {}
}
// Equivale a declarar las propiedades y asignarlas en el constructor.
```

## `readonly`

Propiedades que solo pueden asignarse durante la inicialización (en la declaración o en el constructor).

```ts
class Circulo {
  readonly PI = 3.1416;
  readonly radio: number;
  constructor(r: number) {
    this.radio = r;
  }
}
```

## Herencia e interfaces

- `extends` para herencia de clase.
- `implements` para implementar interfaces (o tipos con forma de objeto).

```ts
interface Volador {
  volar(): void;
}
class Pajaro extends Animal implements Volador {
  volar() { /*...*/ }
}
```

## Miembros estáticos

Propiedades y métodos de la clase, no de la instancia.

```ts
class Util {
  static version = "1.0";
  static hacerAlgo() {}
}
```

## Clases abstractas

No se pueden instanciar directamente. Pueden contener métodos abstractos que las subclases deben implementar.

```ts
abstract class Figura {
  abstract area(): number;
  descripcion(): string {
    return `Área: ${this.area()}`;
  }
}
class Cuadrado extends Figura {
  constructor(private lado: number) { super(); }
  area() { return this.lado ** 2; }
}
```

## Getters y setters

Permiten lógica en acceso a propiedades.

```ts
class Persona {
  private _nombre: string;
  get nombre(): string { return this._nombre; }
  set nombre(valor: string) {
    if (!valor) throw new Error("Nombre no válido");
    this._nombre = valor;
  }
}
```

## Campos privados nativos (`#`)

Desde ECMAScript 2022, TypeScript soporta `#` para privacidad en runtime, que es verdaderamente privada.

```ts
class Banco {
  #saldo = 0;
  depositar(monto: number) { this.#saldo += monto; }
}
```

Es compatible con el modificador `private`, pero con diferencias: `private` es solo en tiempo de compilación y permite acceso desde otras instancias de la misma clase; `#` es privado a nivel de instancia incluso en runtime.

## `this` polimórfico

Puedes usar `this` como tipo de retorno en métodos para permitir encadenamiento fluido en subclases.

```ts
class ConstructorHTML {
  agregarClase(className: string): this {
    // ...
    return this;
  }
}
class ConstructorExtendido extends ConstructorHTML {
  otroMetodo(): this { return this; }
}
new ConstructorExtendido().agregarClase("activo").otroMetodo(); // ok
```

## Clases como tipos

Una clase define tanto un valor (el constructor) como un tipo (la forma de sus instancias). Se puede usar el nombre de la clase directamente como tipo.

```ts
let gato: Animal = new Animal("Michi", 3, "felino");
```

Además, `typeof MiClase` captura el tipo del constructor (función constructora).

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Funciones](05-funciones.md) | [🏠 Inicio](../index.md) | [Genéricos – Introducción ▶](07-genericos-introduccion.md) |
