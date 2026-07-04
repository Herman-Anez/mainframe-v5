# Parametros por defecto

Los parámetros por defecto permiten inicializar parámetros formales con un valor predeterminado si el argumento correspondiente es `undefined`. Se evalúan en el momento de la llamada, y su ámbito es el mismo que el de la función.

## Sintaxis y evaluación

```javascript
function f(a, b = 10) { return a + b; }
f(5);      // 15
f(5, 2);   // 7
f(5, undefined); // 15 (undefined activa el defecto)
f(5, null); // 5, porque null no dispara el defecto, null se convierte a 0
```

El valor por defecto puede ser cualquier expresión, incluyendo llamadas a funciones, operadores o referencias a otros parámetros:

```javascript
function g(x, y = x * 2) {
  return [x, y];
}
g(3); // [3, 6]
g(3, 4); // [3, 4]
```

La expresión se evalúa **cada vez** que se invoca la función sin ese argumento, por lo que efectos secundarios como llamadas a `Date.now()` se ejecutan en cada llamada:

```javascript
function conMarca(texto, marca = Date.now()) {
  console.log(texto, marca);
}
conMarca('Hola'); // Hola 1680000000000
setTimeout(() => conMarca('Tarde'), 1000); // Tarde 1680000001000 (valor distinto)
```

## Ámbito y Temporal Dead Zone (TDZ)

Los parámetros formales están en un ámbito propio (el **ámbito de parámetros**), separado del cuerpo de la función. Los parámetros se evalúan de izquierda a derecha, por lo que uno por defecto puede referenciar a parámetros ya definidos, pero **no** a parámetros posteriores, pues estos estarían en la TDZ.

```javascript
function err(a = b, b = 1) { } // ReferenceError: b no está definida en el momento de evaluar a
function ok(b = 1, a = b) { } // correcto, b ya está definida
```

La TDZ también aplica a variables `let`/`const` dentro del ámbito de parámetros si se usan antes de la inicialización.

## Interacción con `arguments`

En modo no estricto, el objeto `arguments` está vinculado dinámicamente a los parámetros: modificar un parámetro modifica `arguments[i]` y viceversa. Con parámetros por defecto, este vínculo se **rompe parcialmente** según la especificación. En modo estricto (y en funciones flecha), no hay vínculo en absoluto.

```javascript
function test(a, b = 2) {
  a = 100;
  console.log(arguments[0]); // En no estricto sigue siendo 1 (el valor original) porque el mapeo se rompe al tener parámetros por defecto?
}
test(1); // En realidad, en modo no estricto, si hay parámetros por defecto o rest, el motor deja de vincular. arguments[0] sigue siendo 1.
```

La regla: si la firma de la función contiene **cualquier** parámetro por defecto, rest o desestructuración, el objeto `arguments` ya **no** se mapea dinámicamente con los parámetros, incluso en modo no estricto. Esto evita confusiones.

## Parámetros por defecto con desestructuración

Se puede aplicar directamente en la firma, tanto con objetos como con arrays:

```javascript
function crear({ nombre = "Invitado", edad = 0 } = {}) {
  return { nombre, edad };
}
crear({ nombre: "Ana" }); // { nombre: "Ana", edad: 0 }
crear();                  // { nombre: "Invitado", edad: 0 }
```

Sin el objeto vacío por defecto `= {}`, llamar `crear()` causaría un `TypeError` al intentar desestructurar `undefined`. El patrón `= {}` es una salvaguarda.

Para arrays:

```javascript
function sumar([a = 0, b = 0] = []) {
  return a + b;
}
sumar(); // 0
sumar([3]); // 3
```

## Uso de funciones como valores por defecto

Pueden ser invocaciones o referencias a funciones, útiles para inicializaciones costosas que se evalúan de forma diferida.

```javascript
function getConfig() {
  console.log('Cargando configuración...');
  return { modo: 'estricto' };
}
function iniciar(config = getConfig()) {
  console.log(config);
}
iniciar(); // ejecuta getConfig
iniciar({ modo: 'relajado' }); // no ejecuta getConfig
```

## Aplicaciones prácticas

- **Evitar comprobaciones manuales**: remplazar `b = b || 10` por `b = 10`, aunque con la diferencia de `||` frente a `??` (valores falsy). El parámetro por defecto solo cubre `undefined`, lo que es más seguro.
- **Funciones con opciones obligatorias**: usar un valor por defecto que lance un error si se omite un argumento importante.

```javascript
function requerido(nombre) {
  throw new Error(`Falta el parámetro ${nombre}`);
}
function crearUsuario(id = requerido('id'), nombre = 'Anónimo') {
  // ...
}
```

- **Combinación con rest**: el parámetro rest captura el excedente después de aplicar los valores por defecto.

## Rendimiento

Cada vez que se llama a la función y un argumento es `undefined`, se evalúa la expresión por defecto. Para valores constantes, no hay impacto. Para expresiones complejas (llamadas a APIs, creación de objetos), podría ser relevante. En esos casos, se puede inicializar dentro del cuerpo tras verificar `undefined`, pero se pierde la elegancia de la firma.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Funciones generadoras](07-funciones-generadoras.md) | [🏠 Inicio](../index.md) | [Objetos literales ▶](../04-objetos-y-clases/01-objetos-literales.md) |
