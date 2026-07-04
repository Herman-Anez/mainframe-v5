# Numeros y bigint

## Number
Todos los números en JS se almacenan en formato de doble precisión IEEE 754 de 64 bits (1 bit signo, 11 exponente, 52 fracción). Esto implica:
- Rango de enteros seguros: `-(2^53 - 1)` a `2^53 - 1` (`Number.MIN_SAFE_INTEGER`, `Number.MAX_SAFE_INTEGER`).
- Números con decimales pueden tener representación inexacta: `0.1 + 0.2 !== 0.3`.

### Valores especiales
- `NaN`: Not‑a‑Number, resultado de operación aritmética inválida. `NaN === NaN` es `false`. Se comprueba con `Number.isNaN()` o `isNaN()` (este último convierte a número primero). `typeof NaN === "number"`.
- `Infinity` y `-Infinity`: división por cero, desbordamiento.
- `-0`: existe `-0`, `Object.is(-0, +0)` → `false`, pero `-0 === +0` → `true`.
- `Number.MAX_VALUE`, `Number.MIN_VALUE` (el menor positivo distinto de cero).

### Métodos de Number
- `Number.isFinite()`, `Number.isInteger()`, `Number.isSafeInteger()`.
- `Number.parseInt()`, `Number.parseFloat()` (globales trasladados).
- `toFixed()`, `toPrecision()`, `toExponential()`.
- `toString(radix)` para convertir a base 2‑36.

## BigInt
Introducido en ES2020 para representar enteros de precisión arbitraria. Se crea añadiendo `n` al final de un literal o con `BigInt(valor)`.
```javascript
const grande = 123456789012345678901234567890n;
const otro = BigInt("9007199254740991");
```
- No se puede mezclar con `Number` en operaciones aritméticas sin conversión explícita.
- `typeof 1n === "bigint"`.
- No tiene soporte para `Math` (no puede representar decimales).
- La división trunca hacia cero: `5n / 2n === 2n`.

### Coerción con Number
- `Number(1n)` es posible si el valor está dentro del rango seguro, de lo contrario puede perder precisión.
- Comparación abstracta `==` permite mezclar `0n == 0` (true), pero `0n === 0` es false.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Tipos de datos](02-tipos-de-datos.md) | [🏠 Inicio](../index.md) | [Strings y symbols ▶](04-strings-y-symbols.md) |
