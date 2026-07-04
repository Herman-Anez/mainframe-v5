# Bucles

## Bucle `for` clásico
Estructura: `for (inicialización; condición; actualización) { cuerpo }`
- **inicialización**: se ejecuta una vez al inicio. Generalmente declara una variable (`let i = 0`).
- **condición**: evaluada antes de cada iteración. Si es falsy, el bucle termina.
- **actualización**: ejecutada al final de cada iteración.
- Los tres componentes son opcionales: `for (;;)` es un bucle infinito.

```javascript
for (let i = 0; i < array.length; i++) {
  // usar array[i]
}
```
**Hoisting y ámbito**: con `var` la variable `i` queda en el ámbito de la función (o global), lo que puede causar problemas con cierres (closures). Se recomienda `let` para que `i` tenga ámbito de bloque y se cree una nueva variable por iteración.

## Bucle `while`
Evalúa la condición **antes** de cada iteración:
```javascript
while (cond) {
  // cuerpo
}
```
Si la condición es inicialmente falsy, el cuerpo nunca se ejecuta.

## Bucle `do...while`
Ejecuta el cuerpo **al menos una vez** y luego comprueba la condición para repetir.
```javascript
do {
  // cuerpo
} while (cond);
```
Útil cuando se necesita que el código se ejecute antes de verificar la condición (por ejemplo, leer entrada del usuario).

## Control de flujo en bucles: `break` y `continue`
- **`break`**: sale inmediatamente del bucle más interno que lo contiene.
- **`continue`**: salta a la siguiente iteración del bucle, evaluando la condición de nuevo.
- Ambos pueden combinarse con **etiquetas (labels)** para actuar sobre bucles externos.

### Etiquetas y saltos estructurados
Una etiqueta es un identificador seguido de `:` delante de una sentencia (generalmente un bucle).
```javascript
exterior:
for (let i = 0; i < 3; i++) {
  for (let j = 0; j < 3; j++) {
    if (i === 1 && j === 1) break exterior;  // sale del bucle externo
  }
}
```
`continue` también puede usar etiqueta para saltar a la siguiente iteración del bucle etiquetado. Las etiquetas no son ámbitos; solo sirven para `break`/`continue`.

> [!CAUTION]
> **Cuidado**: el uso excesivo de etiquetas puede complicar el flujo; a veces es mejor refactorizar en funciones.

## Bucles infinitos y prevención
- `while(true)`, `for(;;)`, `do{}while(true)`.
- Asegúrese de tener una condición de salida con `break` o una variable modificada dentro del bucle.
- En navegadores, los bucles infinitos bloquean el hilo principal y congelan la interfaz.

## Ámbito en bucles: diferencias entre `var` y `let`
```javascript
for (var i = 0; i < 3; i++) { setTimeout(() => console.log(i), 0); }
// Imprime 3, 3, 3 porque var tiene ámbito de función y los callbacks comparten la misma i.

for (let i = 0; i < 3; i++) { setTimeout(() => console.log(i), 0); }
// Imprime 0, 1, 2 porque let crea una nueva i en cada iteración.
```
Este comportamiento se debe a que `let` crea un nuevo ámbito léxico por iteración, capturando el valor actual.

### Consideraciones de rendimiento
- En bucles grandes, evitar acceder repetidamente a propiedades como `array.length` si no cambia; cachearla.
- Usar `for...of` para arrays cuando solo se necesita el valor, y no el índice.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Condicionales](01-condicionales.md) | [🏠 Inicio](../index.md) | [Excepciones trycatch ▶](03-excepciones-trycatch.md) |
