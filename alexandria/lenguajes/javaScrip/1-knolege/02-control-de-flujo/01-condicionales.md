# Condicionales

## Estructuras condicionales básicas

### `if` / `else if` / `else`
La condición se evalúa mediante la operación abstracta `ToBoolean`, por lo que cualquier valor se clasifica como **truthy** o **falsy**.
```javascript
if (condicion) {
  // ejecuta si condicion es truthy
} else if (otraCondicion) {
  // ejecuta si condicion es falsy y otraCondicion es truthy
} else {
  // si todas las condiciones anteriores son falsy
}
```
No hay límite de encadenamiento `else if`. Se evalúan en orden; la primera condición truthy ejecuta su bloque y se sale de la cadena.

> [!IMPORTANT]
> **Importante**: el bloque crea ámbito para `let`/`const` dentro de él, pero `var` declarado dentro sigue estando en el ámbito de la función contenedora.

### Operador condicional ternario
Es una expresión, no una sentencia. Útil para asignaciones o retornos.
```javascript
const acceso = edad >= 18 ? 'permitido' : 'denegado';
```
Asociatividad por la derecha: `a ? b : c ? d : e` equivale a `a ? b : (c ? d : e)`, lo que permite concatenación similar a `else if`.

Puede volverse poco legible si se anida profundamente; usar con moderación.

### `switch`
La expresión del `switch` se evalúa una sola vez y se compara con el valor de cada `case` mediante **comparación estricta** (`===`). Si coincide, la ejecución comienza en ese `case` y continúa **en cascada** (fall-through) hasta encontrar un `break` o el final del `switch`.
```javascript
switch (valor) {
  case 1:
    // código
    break;
  case 2:
    // código
    // sin break → continúa al siguiente case
  default:
    // se ejecuta si ningún case coincidió (opcional)
}
```
- **`default`**: opcional, puede ir en cualquier posición, aunque lo habitual es al final. Se ejecuta cuando no hay coincidencias.
- **Fall-through intencionado**: varios `case` juntos que comparten código.
  ```javascript
  case 'a':
  case 'b':
    hacerAlgo();
    break;
  ```
- **Comparación estricta**: `switch` usa `===`, por lo que `'1'` no coincide con `1`.
- Los casos pueden ser expresiones, no solo literales. Pero evite efectos secundarios complejos.

#### `switch` con ámbito de bloque
Si se necesita ámbito de bloque por cada `case`, enciérrelo entre llaves:
```javascript
case 'x': {
  const temp = 10;
  // ...
  break;
}
```
Así se evitan errores de redeclaración de variables `let`/`const` entre diferentes `case` sin `break`.

### Condicionales con `&&` y `||`
El cortocircuito permite ejecutar código condicionalmente:
```javascript
isActive && ejecutar();  // ejecuta solo si isActive es truthy
resultado = valor || 'porDefecto';  // asigna valor si truthy, sino el string
```
No reemplazan a `if` cuando hay múltiples líneas, pero son útiles para expresiones simples. Recuerde que `||` considera todos los falsy values (`0`, `""`, `false`); para valores nulos use `??`.

### Cuándo usar cada uno
- `if/else`: legibilidad para lógica compleja o con múltiples sentencias.
- Ternario: asignaciones o retornos de valores basados en una condición simple.
- `switch`: múltiples comparaciones de igualdad estricta sobre la misma variable, sobre todo con valores discretos.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Strict mode](../01-fundamentos/07-strict-mode.md) | [🏠 Inicio](../index.md) | [Bucles ▶](02-bucles.md) |
