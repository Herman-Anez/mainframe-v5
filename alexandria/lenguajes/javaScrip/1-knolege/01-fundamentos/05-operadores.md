# Operadores

## Precedencia y asociatividad
JavaScript define una jerarquía de precedencia de operadores. La tabla completa se puede consultar en MDN. Algunos puntos clave:
- Mayor precedencia: miembro `.`, `[]`, `new` (con argumentos), `()`.
- Precedencia media: aritméticos, comparación, lógicos.
- Menor precedencia: asignación, `yield`, operador coma.

**Asociatividad** determina el orden de evaluación para operadores de igual precedencia:
- Asociatividad por la izquierda (la mayoría): `a - b - c` → `(a - b) - c`.
- Asociatividad por la derecha: `=`, `**`, `?:`, operadores unarios.

## Operadores aritméticos
- `+`, `-`, `*`, `/`, `%`, `**` (exponenciación, ES2016).
- `+` también concatena cadenas; si uno de los operandos es string, convierte el otro a string.
- `**` es asociativo por la derecha: `2 ** 3 ** 2` es `2 ** (3 ** 2)`.

## Operadores de asignación
- `=`, `+=`, `-=`, etc.
- Asignación lógica (ES2021): `||=`, `&&=`, `??=` (evalúan el lado derecho solo si es necesario).
```javascript
x ||= 5; // igual a x || (x = 5)
```

## Operadores de comparación
- `==` (igualdad abstracta) y `!=` aplican coerción.
- `===` (igualdad estricta) y `!==` sin coerción.
- `>` , `<`, `>=`, `<=` con coerción a número (excepto si ambos son strings, comparación lexicográfica).
- `Object.is()` compara valores de manera especial (diferente a `===`): `Object.is(NaN, NaN)` es true, `Object.is(+0, -0)` es false.

## Operadores lógicos
- `&&` (AND), `||` (OR), `!` (NOT). Cortocircuito: si el primer operando determina el resultado, no se evalúa el segundo.
- Retornan uno de los operandos (no necesariamente booleano).
- `??` (nullish coalescing): devuelve el lado derecho solo si el izquierdo es `null` o `undefined`; a diferencia de `||`, no considera falsy values como `0` o `""`.

## Operador condicional (ternario)
`condicion ? expr1 : expr2`. Asociatividad por la derecha.

## Operadores bit a bit
Trabajan con representaciones enteras de 32 bits con signo (complemento a dos): `&`, `|`, `^`, `~`, `<<`, `>>` (con propagación de signo), `>>>` (desplazamiento a la derecha sin signo).

## Operadores especiales
- **`in`**: verifica si una propiedad existe en un objeto (incluyendo prototipos).
- **`instanceof`**: comprueba la cadena de prototipos.
- **`delete`**: elimina una propiedad de un objeto; devuelve `true` si la propiedad no existía o se eliminó (excepto en propiedades no configurables). No funciona con variables declaradas con `var`, `let`, `const` en el ámbito global estricto.
- **`void`**: evalúa la expresión y devuelve `undefined`. Útil en enlaces `javascript:void(0)`.
- **operador coma**: evalúa ambas expresiones y retorna la segunda.
- **`new`** y **`super`** (operadores contextuales).
- **`typeof`** como operador unario.

## Encadenamiento opcional `?.`
Permite acceder a propiedades/call methods en objetos que pueden ser `null`/`undefined` sin lanzar error.
```javascript
obj?.prop       // undefined si obj es null/undefined
obj?.[expr]     // acceso con corchetes
obj.method?.()  // llamada condicional
```
Cortocircuito: si el valor antes de `?.` es `null` o `undefined`, la expresión entera evalúa a `undefined` y no se evalúa el resto.

## Operador de propagación (spread) `...`
En contextos donde se esperan múltiples argumentos o elementos:
- En llamadas a función: `fn(...array)`.
- En literales de array: `[...arr1, ...arr2]`.
- En literales de objeto (ES2018): `{...obj1, ...obj2}` (copia propiedades enumerables propias).

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Strings y symbols](04-strings-y-symbols.md) | [🏠 Inicio](../index.md) | [Coercion de tipos ▶](06-coercion-de-tipos.md) |
