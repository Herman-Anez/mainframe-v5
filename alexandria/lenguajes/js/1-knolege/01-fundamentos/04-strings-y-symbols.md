# Strings y symbols

## Strings
Secuencia de elementos de 16 bits (UTF‑16 code units). La longitud `length` se basa en code units, no en puntos de código Unicode, por lo que caracteres suplementarios (como `𝌆`) ocupan dos code units (surrogate pairs).

### Literales
- Comillas simples `'...'` o dobles `"..."`.
- Template literals con backticks `` `...` ``:
  - Interpolación: `` `Hola ${nombre}` ``
  - Multilínea sin necesidad de `\n`.
  - Etiquetado de plantillas: `tagFunction` puede procesar las partes estáticas y los valores.

### Caracteres de escape
- `\n`, `\t`, `\\`, `\'`, `\"`.
- `\xXX` (dos dígitos hexadecimales), `\uXXXX` (cuatro dígitos), `\u{XXXXXX}` (puntos de código Unicode en plantillas y literales ES6).
- `\0` (carácter nulo, no confundir con `\0` seguido de dígitos que se interpretan como octal en modo no estricto).

### Propiedades y métodos importantes
- `.length`, `.charAt()`, `.charCodeAt()`, `.codePointAt()`.
- `.toUpperCase()`, `.toLowerCase()`, `.trim()`, `.trimStart()`, `.trimEnd()`.
- `.indexOf()`, `.lastIndexOf()`, `.includes()`, `.startsWith()`, `.endsWith()`.
- `.slice()`, `.substring()`, `.substr()` (obsoleto).
- `.split()`, `.replace()`, `.replaceAll()`, `.match()`, `.matchAll()`, `.search()` con expresiones regulares.
- `.concat()`, `.repeat()`, `.padStart()`, `.padEnd()`.

### Internamiento (string interning)
Motores modernos internan cadenas para optimizar comparaciones y almacenamiento. Dos cadenas idénticas pueden ser la misma referencia en memoria.

## Symbols
Tipo primitivo introducido en ES6 para generar identificadores únicos e inmutables, usados principalmente como claves de propiedades de objetos.
```javascript
const s1 = Symbol('desc');
const s2 = Symbol('desc');
s1 === s2; // false
```
- No se convierten automáticamente a string; se debe usar `.toString()` o `String(s)`.
- El parámetro es una descripción opcional para depuración.

### Símbolos globales
`Symbol.for('clave')` busca un símbolo en un registro global; si no existe, lo crea. `Symbol.keyFor(s)` devuelve la clave asociada.
```javascript
const global = Symbol.for('app.id');
Symbol.keyFor(global); // 'app.id'
```

### Símbolos bien conocidos (Well‑known symbols)
Permiten personalizar el comportamiento del lenguaje. Ejemplos:
- `Symbol.iterator` – define el iterador por defecto de un objeto.
- `Symbol.asyncIterator` – iterador asíncrono.
- `Symbol.toStringTag` – modifica el resultado de `Object.prototype.toString()`.
- `Symbol.toPrimitive` – personaliza la conversión a primitivo.
- `Symbol.isConcatSpreadable`, `Symbol.species`, etc.

### Uso como propiedades “privadas”
No son realmente privadas (se pueden obtener con `Object.getOwnPropertySymbols`), pero ofrecen una manera de evitar colisiones de nombres.
```javascript
const _saldo = Symbol('saldo');
class Cuenta {
  constructor() { this[_saldo] = 0; }
}
```

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Numeros y bigint](03-numeros-y-bigint.md) | [🏠 Inicio](../index.md) | [Operadores ▶](05-operadores.md) |
