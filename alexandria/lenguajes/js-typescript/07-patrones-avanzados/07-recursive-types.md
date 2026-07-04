# Recursive types

Los tipos recursivos permiten describir estructuras anidadas de profundidad arbitraria: árboles, JSON, listas enlazadas, etc. TypeScript soporta recursión en **interfaces** desde siempre y en **type aliases** desde la versión 3.7.

## Tipos recursivos básicos

### Lista enlazada

```ts
type Lista<T> = {
  valor: T;
  siguiente: Lista<T> | null;
};
```

### Árbol binario

```ts
type Arbol<T> = {
  valor: T;
  izquierda?: Arbol<T>;
  derecha?: Arbol<T>;
};
```

Estos tipos se pueden anidar infinitamente y TypeScript los maneja sin problemas mientras no se alcance el límite de profundidad (normalmente 50 niveles).

## Interfaces recursivas

Las interfaces siempre han sido recursivas; la sintaxis es la misma.

```ts
interface Nodo {
  id: string;
  hijos?: Nodo[];
}
```

## Tipos recursivos con tipos mapeados

La potencia real está en crear transformaciones profundas con tipos mapeados recursivos.

### `DeepReadonly`

```ts
type DeepReadonly<T> = T extends object
  ? { readonly [K in keyof T]: DeepReadonly<T[K]> }
  : T;
```

Así, `DeepReadonly<{ a: { b: number } }>` da `{ readonly a: { readonly b: number } }`.

### `DeepPartial`

```ts
type DeepPartial<T> = T extends object
  ? { [K in keyof T]?: DeepPartial<T[K]> }
  : T;
```

## Recursión con tipos condicionales e `infer`

Se pueden parsear tipos de cadenas recursivamente:

```ts
type Split<S extends string, Sep extends string> =
  S extends `${infer Parte}${Sep}${infer Resto}`
    ? [Parte, ...Split<Resto, Sep>]
    : [S];
type Partes = Split<"a,b,c", ",">; // ["a", "b", "c"]
```

Aquí la recursión descompone la cadena trozo a trozo.

## Restricciones y límites

- El compilador impone un límite de **profundidad de recursión** (50 por defecto, modificable hasta cierto punto). Si se supera, se produce el error `"Type instantiation is excessively deep and possibly infinite"`.
- Las recursiones estructurales (sin reducción) que no avanzan causan errores.
- Los tipos recursivos deben ser **productivos**: cada paso debe descomponer el tipo en algo más simple. Por ejemplo, en `Split` siempre quitamos un separador; en `DeepReadonly` descendemos a los miembros de un objeto.
- Para grandes volúmenes de datos, la recursión de tipos puede ralentizar la compilación; usa con moderación.

## Trucos para evitar límites

- Usa **tipos envolventes** para cortar la recursión cuando ya no sea necesaria.
- En algunos casos, se puede usar un tipo mapeado normal combinado con un tipo condicional que solo profundice un nivel y luego se repita manualmente si la profundidad es conocida.
- Para colecciones inmensas, es preferible usar enfoques genéricos no recursivos (ej. `ReadonlyArray<T>`).

## Aplicaciones reales

- **Validación de tipos de respuesta de API**: `DeepPartial` para updates, `DeepRequired` para formularios.
- **Tipado de operadores de inmutabilidad** (Immer, Redux Toolkit).
- **Parsers y serializadores**: conversión de tipos entre capas.
- **Manipulación de paths de objetos**: dado un objeto, extraer todas las rutas separadas por puntos con recursión de template literal types.

## Conclusión

Los tipos recursivos completan el arsenal de TypeScript para modelar el mundo real. Junto con las uniones discriminadas y los tipos condicionales, permiten expresar reglas de negocio complejas directamente en el sistema de tipos, eliminando categorías enteras de errores en tiempo de ejecución.

---

#

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Conditional overloads](06-conditional-overloads.md) | [🏠 Inicio](../index.md) | [TS 5.0 – La consolidación de ECMAScript Decorators y el sistema de tipos moderno ▶](../08-novedades/01-ts-50-la-consolidacion-de-ecmascript-decorators-y-el-sistema-de-tipos-moderno.md) |
