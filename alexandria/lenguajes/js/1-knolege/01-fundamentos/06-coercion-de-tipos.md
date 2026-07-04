# Coercion de tipos

La coerción es la conversión automática entre tipos. Ocurre principalmente en operadores y en contextos que esperan un tipo concreto (booleano, número, cadena). La especificación define operaciones abstractas.

## Operaciones abstractas
- **ToPrimitive(input [, preferredType])**: Si `input` es objeto, llama a `@@toPrimitive` (si existe), luego `valueOf()`, luego `toString()`, según el preferredType ("number" o "string").
- **ToBoolean**: Todos los valores son `true` excepto los **falsy**: `false`, `0`, `-0`, `0n`, `""`, `null`, `undefined`, `NaN`.
- **ToNumber**: `undefined` → `NaN`, `null` → `0`, `true` → `1`, `false` → `0`, string con formato numérico → número, si no → `NaN`.
- **ToString**: primitivos se convierten a su representación textual; objetos llaman a `toString()`.

## Igualdad abstracta (`==`) vs estricta (`===`)
El algoritmo de `==` aplica coerción para igualar tipos:
1. Si mismo tipo, compara con `===`.
2. `null == undefined` es `true` (y viceversa).
3. Si uno es número y el otro string, convierte string a número.
4. Si uno es booleano, conviértelo a número (true→1) y repite.
5. Si uno es objeto, conviértelo a primitivo (sin preferencia) y repite.

Ejemplos:
- `0 == false` → true (false → 0, 0 == 0).
- `"" == false` → true (false → 0, "" → 0).
- `"42" == 42` → true.
- `[1] == 1` → true (el array se convierte a "1", luego a 1).
- `[1,2] == "1,2"` → true.

**Recomendación**: usar siempre `===` para evitar sorpresas.

## Coerción explícita
- A booleano: `Boolean(val)`, doble negación `!!val`.
- A número: `Number(val)`, operador unario `+val`, `parseInt`/`parseFloat`.
- A string: `String(val)`, `val.toString()`, template literals.
- A primitivo en general: `+` con string vacío (`val + ""`) para string, aunque es mejor usar métodos explícitos.

## Coerción en contextos comunes
- **Condicionales** (`if`, `while`, `?`): se aplica `ToBoolean`.
- **Operador `+`**: si algún operando es string, coerción a string; sino, a número.
- **Operadores de comparación** (>, <, <=, >=): si ambos son strings, comparación lexicográfica; si no, ambos se convierten a número.
- **Llamadas a métodos** como `Array.prototype.push` no convierten, pero los índices se fuerzan a string.

## Buenas prácticas
Entender la coerción ayuda a escribir código más conciso y a evitar bugs. Patrones habituales:
- `if (lista.length)` en lugar de `if (lista.length > 0)`.
- `valor = valor || porDefecto` (cuidado con falsy values, mejor `??`).
- `numero = +input` para convertir rápidamente.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Operadores](05-operadores.md) | [🏠 Inicio](../index.md) | [Strict mode ▶](07-strict-mode.md) |
