# `ejemplos/09-enums/`

## `string-enum.ts`

```ts
enum Colores {
  Rojo = "ROJO",
  Verde = "VERDE",
  Azul = "AZUL"
}
const color: Colores = Colores.Rojo;
```

## `numeric-enum.ts`

```ts
enum Direccion {
  Arriba,    // 0
  Abajo,     // 1
  Izquierda, // 2
  Derecha    // 3
}
console.log(Direccion[0]); // "Arriba" (reverse mapping)
```

## `const-enum.ts`

```ts
const enum Tamaño {
  Pequeño = 1,
  Mediano,
  Grande
}
let t = Tamaño.Mediano; // compila a let t = 2
```

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ `ejemplos/08-modulos/`](08-ejemplos08-modulos.md) | [🏠 Inicio](../index.md) | [`ejemplos/10-declaration-files/` ▶](10-ejemplos10-declaration-files.md) |
