# `ejemplos/03-mapped-types/`

Demuestra tipos mapeados básicos, remapeo de claves, mapeos condicionales y transformaciones profundas.

## `basic-mapped.ts`

```ts
// Readonly manual
type Readonly<T> = { readonly [K in keyof T]: T[K] };
interface Usuario { nombre: string; edad: number; }
type UsuarioReadonly = Readonly<Usuario>;

// Partial y Required
type Parcial<T> = { [K in keyof T]?: T[K] };
type Requerido<T> = { [K in keyof T]-?: T[K] }; // elimina opcionalidad

// Añadir opcionalidad o readonly con + y -
type Mutable<T> = { -readonly [K in keyof T]: T[K] }; // quita readonly
```

## `key-remapping.ts`

```ts
// Remapeo de claves con 'as'
type Getters<T> = {
  [K in keyof T as `get${Capitalize<K & string>}`]: () => T[K];
};
interface Persona { nombre: string; edad: number; }
type PersonaGetters = Getters<Persona>;
// { getNombre: () => string; getEdad: () => number }

// Filtrado de claves: solo propiedades de tipo función
type SoloMetodos<T> = {
  [K in keyof T as T[K] extends (...args: any) => any ? K : never]: T[K];
};
interface Mix {
  saludar: () => void;
  nombre: string;
  edad: number;
}
type MetodosMix = SoloMetodos<Mix>; // { saludar: () => void }
```

## `conditional-mapped.ts`

```ts
// Mapeado condicional en valores
type Nullable<T> = { [K in keyof T]: T[K] | null };
type Parseado<T> = {
  [K in keyof T]: T[K] extends string ? number : T[K];
};

interface ApiData {
  id: string;
  nombre: string;
  activo: boolean;
}
type ApiParsed = Parseado<ApiData>; // id y nombre se convierten a number
```

## `deep-partial.ts`

```ts
// Recursivo profundo
type DeepPartial<T> = T extends object
  ? { [K in keyof T]?: DeepPartial<T[K]> }
  : T;

interface Config {
  server: {
    host: string;
    port: number;
  };
  database: {
    url: string;
  };
}

type PartialConfig = DeepPartial<Config>;
// Todas las propiedades son opcionales en cualquier nivel
const conf: PartialConfig = { server: { host: "localhost" } };
```

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ `ejemplos/02-genericos/`](02-ejemplos02-genericos.md) | [🏠 Inicio](../index.md) | [`ejemplos/04-conditional-types/` ▶](04-ejemplos04-conditional-types.md) |
