# `ejemplos/07-decorators/` (TS 5.0+)

## `class-decorator.ts`

```ts
function sellada(target: Function, context: ClassDecoratorContext) {
  console.log(`Decorando clase ${context.name}`);
}

@sellada
class Vehiculo {
  constructor(public tipo: string) {}
}
```

## `method-decorator.ts`

```ts
function logMethod(target: Function, context: ClassMethodDecoratorContext) {
  const original = target;
  return function (this: any, ...args: any[]) {
    console.log(`Llamando ${String(context.name)}`);
    return original.call(this, ...args);
  };
}

class Calculadora {
  @logMethod
  sumar(a: number, b: number): number {
    return a + b;
  }
}
```

## `field-decorator.ts`

```ts
function mayuscula(initial: string, context: ClassFieldDecoratorContext) {
  return initial.toUpperCase();
}

class Persona {
  @mayuscula
  nombre = "ana"; // se inicializa "ANA"
}
```

## `auto-accessor.ts`

```ts
function observar<T>(accessor: { get: () => T; set: (val: T) => void }, context: ClassAccessorDecoratorContext) {
  return {
    get() { return accessor.get.call(this); },
    set(val: T) {
      console.log(`Cambiando a ${val}`);
      accessor.set.call(this, val);
    }
  };
}

class Contador {
  @observar
  accessor valor = 0;
}
```

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ `ejemplos/06-clases/`](06-ejemplos06-clases.md) | [🏠 Inicio](../index.md) | [`ejemplos/08-modulos/` ▶](08-ejemplos08-modulos.md) |
