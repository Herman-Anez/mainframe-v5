## 01-sintaxis-y-variables.md

### Gramática léxica

JavaScript es **case‑sensitive** y utiliza el conjunto de caracteres **Unicode**. Los identificadores pueden contener letras, dígitos, `_` y `$`, pero no pueden comenzar con un dígito. Se permiten letras Unicode (como `ñ` o `π`). Las palabras reservadas no pueden usarse como identificadores, aunque en ES5+ algunas (`class`, `const`, `import`) son palabras reservadas en modo estricto o contextos específicos.

#### Comentarios
- Línea: `// comentario`
- Bloque: `/* comentario */` (no anidable)

#### Punto y coma automático (ASI)
El intérprete inserta `;` en ciertos puntos para corregir programas sintácticamente incorrectos. Reglas principales:
- Cuando el siguiente token es `}` y no forma parte de una plantilla literal.
- Al final de la entrada del programa.
- Después de una sentencia donde el siguiente token comienza en una nueva línea y no puede ser analizado correctamente sin un `;`.

**Ejemplo peligroso:**
```javascript
function foo() {
  return
    { a: 1 };
}
// Se inserta ; después de return, la función devuelve undefined.
```

#### Variables: var, let, const

##### `var`
- Ámbito de función o global.
- **Hoisting**: la declaración (no la inicialización) se eleva al principio del ámbito, con valor inicial `undefined`.
- Permite redeclaración en el mismo ámbito.
- Se asocia al objeto global cuando se declara en el ámbito global (`window.x` en navegadores).

##### `let`
- Ámbito de bloque `{ }`.
- **Hoisting** existe, pero el identificador está en la **Zona Muerta Temporal (TDZ)** hasta la inicialización. Acceder a él lanza `ReferenceError`.
- No se puede redeclarar en el mismo ámbito.

##### `const`
- Igual que `let` pero con una restricción adicional: la referencia debe ser inicializada en la declaración y no puede reasignarse.
- **Inmutabilidad superficial**: para objetos, sus propiedades pueden modificarse (a menos que el objeto esté congelado).

**Ejemplo TDZ:**
```javascript
console.log(x); // ReferenceError
let x = 5;
```

##### Ámbitos
- **Global**: código fuera de cualquier función o bloque. En módulos, el ámbito global es el del módulo, no el objeto `window`.
- **Función**: cada invocación de función crea un nuevo ámbito.
- **Bloque**: `{ }` con `let`, `const`, `class`, `function` (en modo estricto también con `function` dentro de bloques).

**Hoisting de funciones:** Las declaraciones de función (no expresiones) son completamente hoisting, el cuerpo está disponible antes de la línea de declaración.

---

## 02-tipos-de-datos.md

JavaScript distingue entre **tipos primitivos** y **objetos**.

#### Primitivos
Son inmutables, se comparan por valor.
- `undefined` – variable no inicializada.
- `null` – ausencia intencional de valor.
- `boolean` – `true` / `false`.
- `number` – punto flotante de doble precisión IEEE 754.
- `bigint` – enteros de precisión arbitraria.
- `string` – secuencia de caracteres UTF-16.
- `symbol` – valor único e inmutable (ES6).

#### Objetos
Colección de propiedades, comparados por referencia. Subtipos:
- `Object`, `Array`, `Function`, `Date`, `RegExp`, `Map`, `Set`, etc.
- Las funciones son objetos invocables.

#### `typeof`
Devuelve una cadena con el tipo:
- `"undefined"`, `"boolean"`, `"number"`, `"bigint"`, `"string"`, `"symbol"`, `"function"`, `"object"`.
- Casos especiales:
  - `typeof null === "object"` (error histórico en la implementación).
  - `typeof function(){} === "function"` (aunque es objeto).
  - `typeof [] === "object"`.

#### `instanceof`
Verifica si un objeto tiene en su cadena de prototipos la propiedad `prototype` de una función constructora.
```javascript
[] instanceof Array // true
[] instanceof Object // true (la cadena incluye Object.prototype)
```
No funciona bien entre contextos de ejecución distintos (iframes) y no sirve para primitivos.

#### Valores primitivos y objetos envoltorio
Los primitivos no tienen métodos, pero el motor crea temporalmente un objeto envoltorio (`String`, `Number`, `Boolean`) al acceder a un método, permitiendo `"hola".toUpperCase()`. No se debe usar `new String()` explícitamente porque produce un objeto, no un primitivo.

#### `undefined` vs `null`
- `undefined`: valor por defecto de variables no inicializadas, parámetros no pasados, retorno de funciones sin `return`.
- `null`: representa "nada", "vacío", normalmente asignado intencionalmente.
- `typeof null` debería ser `"null"` pero es `"object"`.

---

## 03-numeros-y-bigint.md

### Number
Todos los números en JS se almacenan en formato de doble precisión IEEE 754 de 64 bits (1 bit signo, 11 exponente, 52 fracción). Esto implica:
- Rango de enteros seguros: `-(2^53 - 1)` a `2^53 - 1` (`Number.MIN_SAFE_INTEGER`, `Number.MAX_SAFE_INTEGER`).
- Números con decimales pueden tener representación inexacta: `0.1 + 0.2 !== 0.3`.

#### Valores especiales
- `NaN`: Not‑a‑Number, resultado de operación aritmética inválida. `NaN === NaN` es `false`. Se comprueba con `Number.isNaN()` o `isNaN()` (este último convierte a número primero). `typeof NaN === "number"`.
- `Infinity` y `-Infinity`: división por cero, desbordamiento.
- `-0`: existe `-0`, `Object.is(-0, +0)` → `false`, pero `-0 === +0` → `true`.
- `Number.MAX_VALUE`, `Number.MIN_VALUE` (el menor positivo distinto de cero).

#### Métodos de Number
- `Number.isFinite()`, `Number.isInteger()`, `Number.isSafeInteger()`.
- `Number.parseInt()`, `Number.parseFloat()` (globales trasladados).
- `toFixed()`, `toPrecision()`, `toExponential()`.
- `toString(radix)` para convertir a base 2‑36.

### BigInt
Introducido en ES2020 para representar enteros de precisión arbitraria. Se crea añadiendo `n` al final de un literal o con `BigInt(valor)`.
```javascript
const grande = 123456789012345678901234567890n;
const otro = BigInt("9007199254740991");
```
- No se puede mezclar con `Number` en operaciones aritméticas sin conversión explícita.
- `typeof 1n === "bigint"`.
- No tiene soporte para `Math` (no puede representar decimales).
- La división trunca hacia cero: `5n / 2n === 2n`.

#### Coerción con Number
- `Number(1n)` es posible si el valor está dentro del rango seguro, de lo contrario puede perder precisión.
- Comparación abstracta `==` permite mezclar `0n == 0` (true), pero `0n === 0` es false.

---

## 04-strings-y-symbols.md

### Strings
Secuencia de elementos de 16 bits (UTF‑16 code units). La longitud `length` se basa en code units, no en puntos de código Unicode, por lo que caracteres suplementarios (como `𝌆`) ocupan dos code units (surrogate pairs).

#### Literales
- Comillas simples `'...'` o dobles `"..."`.
- Template literals con backticks `` `...` ``:
  - Interpolación: `` `Hola ${nombre}` ``
  - Multilínea sin necesidad de `\n`.
  - Etiquetado de plantillas: `tagFunction` puede procesar las partes estáticas y los valores.

#### Caracteres de escape
- `\n`, `\t`, `\\`, `\'`, `\"`.
- `\xXX` (dos dígitos hexadecimales), `\uXXXX` (cuatro dígitos), `\u{XXXXXX}` (puntos de código Unicode en plantillas y literales ES6).
- `\0` (carácter nulo, no confundir con `\0` seguido de dígitos que se interpretan como octal en modo no estricto).

#### Propiedades y métodos importantes
- `.length`, `.charAt()`, `.charCodeAt()`, `.codePointAt()`.
- `.toUpperCase()`, `.toLowerCase()`, `.trim()`, `.trimStart()`, `.trimEnd()`.
- `.indexOf()`, `.lastIndexOf()`, `.includes()`, `.startsWith()`, `.endsWith()`.
- `.slice()`, `.substring()`, `.substr()` (obsoleto).
- `.split()`, `.replace()`, `.replaceAll()`, `.match()`, `.matchAll()`, `.search()` con expresiones regulares.
- `.concat()`, `.repeat()`, `.padStart()`, `.padEnd()`.

#### Internamiento (string interning)
Motores modernos internan cadenas para optimizar comparaciones y almacenamiento. Dos cadenas idénticas pueden ser la misma referencia en memoria.

### Symbols
Tipo primitivo introducido en ES6 para generar identificadores únicos e inmutables, usados principalmente como claves de propiedades de objetos.
```javascript
const s1 = Symbol('desc');
const s2 = Symbol('desc');
s1 === s2; // false
```
- No se convierten automáticamente a string; se debe usar `.toString()` o `String(s)`.
- El parámetro es una descripción opcional para depuración.

#### Símbolos globales
`Symbol.for('clave')` busca un símbolo en un registro global; si no existe, lo crea. `Symbol.keyFor(s)` devuelve la clave asociada.
```javascript
const global = Symbol.for('app.id');
Symbol.keyFor(global); // 'app.id'
```

#### Símbolos bien conocidos (Well‑known symbols)
Permiten personalizar el comportamiento del lenguaje. Ejemplos:
- `Symbol.iterator` – define el iterador por defecto de un objeto.
- `Symbol.asyncIterator` – iterador asíncrono.
- `Symbol.toStringTag` – modifica el resultado de `Object.prototype.toString()`.
- `Symbol.toPrimitive` – personaliza la conversión a primitivo.
- `Symbol.isConcatSpreadable`, `Symbol.species`, etc.

#### Uso como propiedades “privadas”
No son realmente privadas (se pueden obtener con `Object.getOwnPropertySymbols`), pero ofrecen una manera de evitar colisiones de nombres.
```javascript
const _saldo = Symbol('saldo');
class Cuenta {
  constructor() { this[_saldo] = 0; }
}
```

---

## 05-operadores.md

### Precedencia y asociatividad
JavaScript define una jerarquía de precedencia de operadores. La tabla completa se puede consultar en MDN. Algunos puntos clave:
- Mayor precedencia: miembro `.`, `[]`, `new` (con argumentos), `()`.
- Precedencia media: aritméticos, comparación, lógicos.
- Menor precedencia: asignación, `yield`, operador coma.

**Asociatividad** determina el orden de evaluación para operadores de igual precedencia:
- Asociatividad por la izquierda (la mayoría): `a - b - c` → `(a - b) - c`.
- Asociatividad por la derecha: `=`, `**`, `?:`, operadores unarios.

### Operadores aritméticos
- `+`, `-`, `*`, `/`, `%`, `**` (exponenciación, ES2016).
- `+` también concatena cadenas; si uno de los operandos es string, convierte el otro a string.
- `**` es asociativo por la derecha: `2 ** 3 ** 2` es `2 ** (3 ** 2)`.

### Operadores de asignación
- `=`, `+=`, `-=`, etc.
- Asignación lógica (ES2021): `||=`, `&&=`, `??=` (evalúan el lado derecho solo si es necesario).
```javascript
x ||= 5; // igual a x || (x = 5)
```

### Operadores de comparación
- `==` (igualdad abstracta) y `!=` aplican coerción.
- `===` (igualdad estricta) y `!==` sin coerción.
- `>` , `<`, `>=`, `<=` con coerción a número (excepto si ambos son strings, comparación lexicográfica).
- `Object.is()` compara valores de manera especial (diferente a `===`): `Object.is(NaN, NaN)` es true, `Object.is(+0, -0)` es false.

### Operadores lógicos
- `&&` (AND), `||` (OR), `!` (NOT). Cortocircuito: si el primer operando determina el resultado, no se evalúa el segundo.
- Retornan uno de los operandos (no necesariamente booleano).
- `??` (nullish coalescing): devuelve el lado derecho solo si el izquierdo es `null` o `undefined`; a diferencia de `||`, no considera falsy values como `0` o `""`.

### Operador condicional (ternario)
`condicion ? expr1 : expr2`. Asociatividad por la derecha.

### Operadores bit a bit
Trabajan con representaciones enteras de 32 bits con signo (complemento a dos): `&`, `|`, `^`, `~`, `<<`, `>>` (con propagación de signo), `>>>` (desplazamiento a la derecha sin signo).

### Operadores especiales
- **`in`**: verifica si una propiedad existe en un objeto (incluyendo prototipos).
- **`instanceof`**: comprueba la cadena de prototipos.
- **`delete`**: elimina una propiedad de un objeto; devuelve `true` si la propiedad no existía o se eliminó (excepto en propiedades no configurables). No funciona con variables declaradas con `var`, `let`, `const` en el ámbito global estricto.
- **`void`**: evalúa la expresión y devuelve `undefined`. Útil en enlaces `javascript:void(0)`.
- **operador coma**: evalúa ambas expresiones y retorna la segunda.
- **`new`** y **`super`** (operadores contextuales).
- **`typeof`** como operador unario.

### Encadenamiento opcional `?.`
Permite acceder a propiedades/call methods en objetos que pueden ser `null`/`undefined` sin lanzar error.
```javascript
obj?.prop       // undefined si obj es null/undefined
obj?.[expr]     // acceso con corchetes
obj.method?.()  // llamada condicional
```
Cortocircuito: si el valor antes de `?.` es `null` o `undefined`, la expresión entera evalúa a `undefined` y no se evalúa el resto.

### Operador de propagación (spread) `...`
En contextos donde se esperan múltiples argumentos o elementos:
- En llamadas a función: `fn(...array)`.
- En literales de array: `[...arr1, ...arr2]`.
- En literales de objeto (ES2018): `{...obj1, ...obj2}` (copia propiedades enumerables propias).

---

## 06-coercion-de-tipos.md

La coerción es la conversión automática entre tipos. Ocurre principalmente en operadores y en contextos que esperan un tipo concreto (booleano, número, cadena). La especificación define operaciones abstractas.

### Operaciones abstractas
- **ToPrimitive(input [, preferredType])**: Si `input` es objeto, llama a `@@toPrimitive` (si existe), luego `valueOf()`, luego `toString()`, según el preferredType ("number" o "string").
- **ToBoolean**: Todos los valores son `true` excepto los **falsy**: `false`, `0`, `-0`, `0n`, `""`, `null`, `undefined`, `NaN`.
- **ToNumber**: `undefined` → `NaN`, `null` → `0`, `true` → `1`, `false` → `0`, string con formato numérico → número, si no → `NaN`.
- **ToString**: primitivos se convierten a su representación textual; objetos llaman a `toString()`.

### Igualdad abstracta (`==`) vs estricta (`===`)
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

### Coerción explícita
- A booleano: `Boolean(val)`, doble negación `!!val`.
- A número: `Number(val)`, operador unario `+val`, `parseInt`/`parseFloat`.
- A string: `String(val)`, `val.toString()`, template literals.
- A primitivo en general: `+` con string vacío (`val + ""`) para string, aunque es mejor usar métodos explícitos.

### Coerción en contextos comunes
- **Condicionales** (`if`, `while`, `?`): se aplica `ToBoolean`.
- **Operador `+`**: si algún operando es string, coerción a string; sino, a número.
- **Operadores de comparación** (>, <, <=, >=): si ambos son strings, comparación lexicográfica; si no, ambos se convierten a número.
- **Llamadas a métodos** como `Array.prototype.push` no convierten, pero los índices se fuerzan a string.

### Buenas prácticas
Entender la coerción ayuda a escribir código más conciso y a evitar bugs. Patrones habituales:
- `if (lista.length)` en lugar de `if (lista.length > 0)`.
- `valor = valor || porDefecto` (cuidado con falsy values, mejor `??`).
- `numero = +input` para convertir rápidamente.

---

## 07-strict-mode.md

El modo estricto se activa con `"use strict";` (o `'use strict';`) al inicio de un script o de una función. No se puede desactivar dentro del mismo ámbito. Los módulos ES (`type="module"`) y las clases están automáticamente en modo estricto.

### Principales restricciones y cambios

#### Variables y propiedades
- No se pueden crear variables globales implícitamente (asignar a una variable no declarada lanza `ReferenceError`).
- No se puede usar `delete` en variables, funciones o argumentos.
- Las propiedades con `writable: false` no se pueden sobrescribir silenciosamente; lanzan `TypeError`.
- No se pueden declarar propiedades en valores primitivos (`false.prop = 5` lanza error).
- `eval` y `arguments` no pueden usarse como nombres de variable o parámetros.

#### `with` está prohibido
`with` se elimina por completo en modo estricto (SyntaxError).

#### Parámetros de función
- No se permiten parámetros duplicados.
- El objeto `arguments` no está vinculado dinámicamente a los parámetros (no se modifica al cambiar los parámetros).
- `arguments.callee` y `arguments.caller` lanzan `TypeError` al acceder.

#### `this` en funciones
En modo no estricto, `this` en una función llamada sin contexto es el objeto global. En modo estricto, es `undefined`. Así se evitan modificaciones accidentales del objeto global.

#### `eval` restringido
- Las variables y funciones declaradas dentro de `eval` no se filtran al ámbito circundante; crean su propio ámbito.
- `eval` no puede sobrescribir el identificador `eval` ni declararlo.

#### Seguridad
- No se puede acceder a `caller` ni `arguments` de funciones.
- `Function.prototype.caller` y `.arguments` lanzan error.

#### Números octales
En modo estricto, la sintaxis octal con `0` seguido de dígitos (`0123`) no está permitida (SyntaxError). Se debe usar `0o` prefijo.

#### Propiedades inmutables y objetos sellados
- Asignar a una propiedad de solo lectura o no extensible lanza `TypeError` (en lugar de fallar silenciosamente).
- Eliminar propiedades no configurables también lanza error.

### Beneficios
- Código más seguro y optimizable.
- Errores silenciosos se convierten en excepciones, facilitando la depuración.
- Prepara el código para futuras versiones del lenguaje eliminando características problemáticas.

---

Cada uno de estos archivos de conocimiento puede ser enriquecido con ejemplos adicionales, diagramas de flujo de coerción, tablas de valores especiales y ejercicios prácticos. La profundidad presentada asegura una base sólida para cualquier desarrollador que quiera dominar JavaScript desde sus fundamentos.

---

