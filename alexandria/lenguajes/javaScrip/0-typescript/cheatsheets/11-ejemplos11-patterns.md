# `ejemplos/11-patterns/`

## `discriminated-union.ts`

```ts
type RespuestaApi =
  | { estado: "exito"; datos: unknown }
  | { estado: "error"; mensaje: string }
  | { estado: "cargando" };

function manejar(res: RespuestaApi) {
  switch (res.estado) {
    case "exito":
      console.log(res.datos);
      break;
    case "error":
      console.error(res.mensaje);
      break;
    case "cargando":
      console.log("Cargando...");
      break;
  }
}
```

## `branded-types.ts`

```ts
type UserId = string & { __brand: "UserId" };
type ProductId = string & { __brand: "ProductId" };

function getUser(id: UserId) {}
const userId = "u123" as UserId;
getUser(userId);
// getUser("u123"); // error si no hay aserción
```

## `fluent-api.ts`

```ts
class Query {
  private tabla: string = "";
  private condiciones: string[] = [];

  from(tabla: string): this {
    this.tabla = tabla;
    return this;
  }

  where(cond: string): this {
    this.condiciones.push(cond);
    return this;
  }

  toString() {
    return `SELECT * FROM ${this.tabla} WHERE ${this.condiciones.join(" AND ")}`;
  }
}

const q = new Query().from("users").where("id=1").toString();
```

## `option-result.ts`

```ts
// Option (Maybe)
type Option<T> = { tipo: "some"; valor: T } | { tipo: "none" };
const some = <T>(v: T): Option<T> => ({ tipo: "some", valor: v });
const none: Option<never> = { tipo: "none" };

function map<T, U>(opt: Option<T>, fn: (x: T) => U): Option<U> {
  return opt.tipo === "some" ? some(fn(opt.valor)) : none;
}

// Result
type Result<E, T> = { tipo: "ok"; valor: T } | { tipo: "err"; error: E };
// uso similar
```

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ `ejemplos/10-declaration-files/`](10-ejemplos10-declaration-files.md) | [🏠 Inicio](../index.md) | [`ejemplos/12-tsconfig/` ▶](12-ejemplos12-tsconfig.md) |
