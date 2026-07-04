# Mixins

Los mixins permiten combinar múltiples clases en una sola, evitando las limitaciones de la herencia única. TypeScript soporta mixins de forma completa mediante funciones que reciben una clase base y retornan una clase extendida.

## El patrón de mixin (función que retorna clase)

Un mixin es una función que toma una clase constructora y devuelve una nueva clase que extiende de ella, añadiendo miembros:

```ts
type Constructor<T = {}> = new (...args: any[]) => T;

function ConSalto<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    saltar() { console.log("Saltando..."); }
  };
}

function ConCarrera<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    correr() { console.log("Corriendo..."); }
  };
}

class Animal {
  comer() { console.log("Comiendo..."); }
}

class Canguro extends ConSalto(ConCarrera(Animal)) {}

const canguro = new Canguro();
canguro.comer();  // de Animal
canguro.saltar(); // de ConSalto
canguro.correr(); // de ConCarrera
```

Aquí `ConSalto` y `ConCarrera` son mixins. Se aplican en orden: primero `ConCarrera` sobre `Animal`, luego `ConSalto` sobre el resultado.

## Tipado de las propiedades de instancia

Para que el mixin acceda a propiedades de la clase base, se debe restringir `TBase` con una interfaz que describa lo que necesita:

```ts
interface TieneNombre {
  nombre: string;
}
function ConPresentacion<TBase extends Constructor<TieneNombre>>(Base: TBase) {
  return class extends Base {
    presentar() {
      console.log(`Hola, soy ${this.nombre}`);
    }
  };
}
```

La restricción `Constructor<TieneNombre>` asegura que la clase base tenga la propiedad `nombre`.

## Mixins con genéricos que devuelven el tipo correcto

La función mixin puede devolver un tipo anónimo que preserva la forma combinada. El tipo resultante se infiere correctamente:

```ts
const PerroSaltarin = ConSalto(Animal);
type PerroSaltarin = InstanceType<typeof PerroSaltarin>; // Animal & { saltar(): void }
```

El tipo `InstanceType<typeof ClaseGenerada>` nos da la intersección de todos los mixins aplicados.

## Mixins con métodos y propiedades de inicialización

Si el mixin necesita inicializar algo en el constructor, puede invocar al constructor base:

```ts
function ConIdentificador<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    id: string;
    constructor(...args: any[]) {
      super(...args);
      this.id = Math.random().toString(36);
    }
  };
}
```

Es importante pasar todos los argumentos con `...args: any[]` y llamar a `super(...args)` para que la cadena de constructores funcione.

## Mixins con restricción de instancia vs static

Se puede restringir también el lado estático de la clase base, pero normalmente no es necesario.

## Alternativas modernas

- **Composición mediante funciones de fábrica**: en lugar de mixins de clases, se crean funciones que toman un objeto y devuelven uno nuevo con capacidades adicionales. Esto funciona mejor con el modelo funcional y evita los problemas de herencia.
- **Decoradores** (propuesta TC39): pueden añadir funcionalidad, pero actualmente los decoradores de clase no extienden la clase.

## Consideraciones

- Los mixins pueden complicar la jerarquía; usa con moderación.
- TypeScript no emite mixins por sí mismo; la sintaxis de `class extends mixin(Base)` es azúcar sobre funciones.
- La intersección de tipos que simula la herencia múltiple puede generar conflictos de nombres; TypeScript avisa si hay tipos incompatibles, pero la implementación en tiempo de ejecución puede sobrescribir métodos accidentalmente.
- En proyectos grandes, a veces se prefiere la composición explícita.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Branded types](02-branded-types.md) | [🏠 Inicio](../index.md) | [This polimorfico ▶](04-this-polimorfico.md) |
