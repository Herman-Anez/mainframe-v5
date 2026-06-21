# Sintaxis y variables

## Gramática léxica

JavaScript es **case‑sensitive** y utiliza el conjunto de caracteres **Unicode**. Los identificadores pueden contener letras, dígitos, `_` y `$`, pero no pueden comenzar con un dígito. Se permiten letras Unicode (como `ñ` o `π`). Las palabras reservadas no pueden usarse como identificadores, aunque en ES5+ algunas (`class`, `const`, `import`) son palabras reservadas en modo estricto o contextos específicos.

### Comentarios
- Línea: `// comentario`
- Bloque: `/* comentario */` (no anidable)

### Punto y coma automático (ASI)
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

### Variables: var, let, const

#### `var`
- Ámbito de función o global.
- **Hoisting**: la declaración (no la inicialización) se eleva al principio del ámbito, con valor inicial `undefined`.
- Permite redeclaración en el mismo ámbito.
- Se asocia al objeto global cuando se declara en el ámbito global (`window.x` en navegadores).

#### `let`
- Ámbito de bloque `{ }`.
- **Hoisting** existe, pero el identificador está en la **Zona Muerta Temporal (TDZ)** hasta la inicialización. Acceder a él lanza `ReferenceError`.
- No se puede redeclarar en el mismo ámbito.

#### `const`
- Igual que `let` pero con una restricción adicional: la referencia debe ser inicializada en la declaración y no puede reasignarse.
- **Inmutabilidad superficial**: para objetos, sus propiedades pueden modificarse (a menos que el objeto esté congelado).

**Ejemplo TDZ:**
```javascript
console.log(x); // ReferenceError
let x = 5;
```

#### Ámbitos
- **Global**: código fuera de cualquier función o bloque. En módulos, el ámbito global es el del módulo, no el objeto `window`.
- **Función**: cada invocación de función crea un nuevo ámbito.
- **Bloque**: `{ }` con `let`, `const`, `class`, `function` (en modo estricto también con `function` dentro de bloques).

**Hoisting de funciones:** Las declaraciones de función (no expresiones) son completamente hoisting, el cuerpo está disponible antes de la línea de declaración.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| ➖ | [🏠 Inicio](../index.md) | [Tipos de datos ▶](02-tipos-de-datos.md) |
