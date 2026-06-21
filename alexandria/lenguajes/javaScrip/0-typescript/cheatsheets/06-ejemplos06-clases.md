# `ejemplos/06-clases/`

## `access-modifiers.ts`

```ts
class Empleado {
  public nombre: string;
  protected sueldo: number;
  private id: string;

  constructor(nombre: string, sueldo: number, id: string) {
    this.nombre = nombre;
    this.sueldo = sueldo;
    this.id = id;
  }

  protected getInfo(): string {
    return `${this.nombre} (${this.id})`;
  }
}

class Gerente extends Empleado {
  constructor(nombre: string) {
    super(nombre, 50000, "G-" + nombre);
  }

  public reporte() {
    // Puede acceder a sueldo y getInfo por ser protected
    console.log(this.getInfo(), this.sueldo);
  }
}
```

## `abstract.ts`

```ts
abstract class Figura {
  abstract area(): number;
  descripcion(): string {
    return `Área: ${this.area()}`;
  }
}

class Cuadrado extends Figura {
  constructor(private lado: number) { super(); }
  area(): number { return this.lado ** 2; }
}
```

## `this-polymorphic.ts`

```ts
class ConstructorHTML {
  private classes: string[] = [];
  agregarClase(clase: string): this {
    this.classes.push(clase);
    return this;
  }
  construir(): string {
    return `<div class="${this.classes.join(" ")}"></div>`;
  }
}

class ConstructorExtendido extends ConstructorHTML {
  setStyle(style: string): this {
    // ...
    return this;
  }
}

new ConstructorExtendido()
  .agregarClase("container")
  .setStyle("color:red")
  .construir();
```

## `mixins.ts`

```ts
type Constructor<T = {}> = new (...args: any[]) => T;

function ConLog<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    log(msg: string) { console.log(msg); }
  };
}

function ConTimestamp<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    timestamp = Date.now();
  };
}

class Base {}
class Mezclada extends ConTimestamp(ConLog(Base)) {}
const mezcla = new Mezclada();
mezcla.log("Hola");
console.log(mezcla.timestamp);
```

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ `ejemplos/05-template-literals/`](05-ejemplos05-template-literals.md) | [🏠 Inicio](../index.md) | [`ejemplos/07-decorators/` (TS 5.0+) ▶](07-ejemplos07-decorators-ts-50.md) |
