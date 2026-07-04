# Gestion de memoria

## Principios del manejo de memoria en JavaScript

JavaScript es un lenguaje con **recolección de basura automática**. El motor asigna memoria cuando se crean objetos y la libera cuando detecta que esos objetos ya no son alcanzables (no hay referencias a ellos desde la raíz de la aplicación).

## Ciclo de vida típico

1. **Asignación**: al declarar variables, crear objetos, funciones, etc.
2. **Uso**: el programa utiliza los valores.
3. **Liberación**: el recolector de basura (GC) identifica memoria no utilizada y la libera.

## Recolección de basura (Garbage Collection)

### Algoritmo Mark-and-Sweep

Es el algoritmo más común. El GC recorre todas las referencias desde las **raíces** (objeto global, pila de llamadas, variables locales activas) y marca todos los objetos alcanzables. Luego, elimina los objetos no marcados y libera la memoria.

La recolección se ejecuta periódicamente, a menudo cuando se agota la memoria joven o en momentos de inactividad.

### Generacional

Los motores modernos (V8, SpiderMonkey) dividen la memoria en generaciones:
- **Generación joven (new space)**: objetos recién creados y de corta duración. Se recolecta con frecuencia (scavenge).
- **Generación vieja (old space)**: objetos que han sobrevivido a varias recolecciones. Se recolecta con menos frecuencia.

## Fugas de memoria comunes

### 1. Variables globales accidentales

Asignar a una variable no declarada crea una propiedad global que nunca se recolecta.

```javascript
function foo() {
  bar = 'valor global'; // fuga si no se desea
}
```

Modo estricto evita esto.

### 2. Closures que retienen referencias innecesarias

Si un closure captura una variable grande y nunca se elimina (por ejemplo, un manejador de eventos que nunca se desregistra), la memoria no se libera.

```javascript
function setup() {
  const datosGrandes = new Array(1000000);
  document.getElementById('btn').addEventListener('click', function() {
    console.log(datosGrandes[0]); // el closure mantiene datosGrandes vivo
  });
}
```

Solución: eliminar el listener cuando ya no sea necesario, o limitar el alcance del closure.

### 3. Referencias en caches no controladas

Si se usa un `Map` o un objeto como caché y no se limpia, las claves y valores permanecen. `WeakMap` soluciona esto para objetos clave.

### 4. Timers y callbacks olvidados

`setInterval` que nunca se limpia mantiene vivo el callback y sus referencias.

### 5. DOM detached (nodos fantasma)

Si se elimina un nodo del DOM pero JavaScript aún tiene una referencia a él, el nodo y sus subárboles no se recolectan.

```javascript
let elemento = document.getElementById('temp');
elemento.remove(); // eliminado del DOM, pero la variable elemento aún lo referencia
```

Solución: asignar `null` a la variable cuando ya no se necesite.

## Herramientas y monitoreo

- **Chrome DevTools**: pestaña Memory y Performance permiten tomar snapshots de heap, ver objetos por constructor, encontrar detached DOM y grabar la asignación de memoria.
- **Node.js**: `--inspect` y Chrome DevTools pueden inspeccionar la memoria de procesos Node. También `process.memoryUsage()`.
- **Performance API**: `window.performance.memory` (no estándar, Chrome) proporciona datos básicos.

## Referencias débiles (WeakRef y FinalizationRegistry)

### WeakRef

Un `WeakRef` mantiene una referencia débil a un objeto, permitiendo que el GC lo recolecte si no hay otras referencias fuertes. Se accede al objeto mediante `deref()`, que puede devolver `undefined` si ya fue recolectado.

```javascript
let obj = { data: 'importante' };
const ref = new WeakRef(obj);
// ...
obj = null; // eliminamos referencia fuerte
const recuperado = ref.deref();
if (recuperado) { /* usar */ }
```

Útil para caches o mapeos que no deben impedir la recolección.

### FinalizationRegistry

Permite registrar un callback que se ejecuta cuando un objeto es recolectado (con ciertas garantías limitadas). Es una herramienta para limpiar recursos, pero su uso es complejo y no se recomienda para lógica de negocio.

```javascript
const registry = new FinalizationRegistry((heldValue) => {
  console.log(`Objeto con valor ${heldValue} recolectado`);
});
let obj = {};
registry.register(obj, 'mi valor');
obj = null; // eventualmente se disparará el callback
```

## Buenas prácticas

- Minimizar variables globales.
- Limpiar listeners, timers y suscripciones cuando los componentes se destruyan.
- Usar `WeakMap` y `WeakSet` para asociaciones de datos a objetos que tienen un ciclo de vida definido.
- Evitar retener referencias a grandes datos más tiempo del necesario.
- Perfilar la memoria regularmente en etapas de desarrollo.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Inmutabilidad](09-inmutabilidad.md) | [🏠 Inicio](../index.md) | [Decoradores ▶](11-decoradores.md) |
