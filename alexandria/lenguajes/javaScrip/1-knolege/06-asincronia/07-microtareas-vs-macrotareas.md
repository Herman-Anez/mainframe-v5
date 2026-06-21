# Microtareas vs macrotareas

## Definición de macrotarea (Task)

Una macrotarea es una unidad de trabajo que se encola en la **Task Queue**. El event loop ejecuta una macrotarea a la vez. Ejemplos:

- Ejecución del script completo (primer script).
- Callbacks de `setTimeout`, `setInterval`.
- Eventos del DOM (`click`, `keydown`).
- `XMLHttpRequest`, `fetch` (aunque `fetch` usa promesas, el callback de finalización de red genera una macrotarea para resolver la promesa, que a su vez genera microtareas).
- `setImmediate` (Node.js).
- `requestAnimationFrame` (se considera una macrotarea especial de renderizado).

## Definición de microtarea (Microtask)

Las microtareas son tareas de alta prioridad que se ejecutan **inmediatamente después de que la pila de llamadas se vacíe**, pero **antes** de la siguiente macrotarea. Se almacenan en la **Microtask Queue**. Ejemplos:

- `.then()`, `.catch()`, `.finally()` de promesas.
- `queueMicrotask(fn)` (API explícita).
- `MutationObserver` (navegador).
- `process.nextTick` (Node.js, con su propia cola de prioridad aún mayor).

## Flujo de ejecución

1. Se ejecuta el script actual (macrotarea inicial).
2. Cuando la pila queda vacía, se drena **completamente** la cola de microtareas. Si al ejecutar una microtarea se encolan nuevas microtareas, estas también se procesan en esta misma fase (hasta que la cola quede vacía).
3. (Navegador) Se puede realizar un repintado/reflujo si es necesario.
4. Se toma la siguiente macrotarea de la cola y se repite.

## Ejemplo comparativo

```javascript
console.log('Inicio');

setTimeout(() => console.log('Timeout 1'), 0);
setTimeout(() => console.log('Timeout 2'), 0);

Promise.resolve()
  .then(() => console.log('Promesa 1'))
  .then(() => console.log('Promesa 2'));

queueMicrotask(() => console.log('Microtask explícita'));

console.log('Fin');
```

**Salida garantizada:**

```
Inicio
Fin
Promesa 1
Microtask explícita
Promesa 2
Timeout 1
Timeout 2
```

**Análisis:**

- Las microtareas (`Promesa 1`, `Microtask explícita`, `Promesa 2`) se ejecutan antes que cualquier macrotarea.
- Dentro de las microtareas, el orden es: `then` de la primera promesa, `queueMicrotask`, `then` encadenado de la segunda promesa (porque el `then` de `Promesa 1` encola `Promesa 2` como microtarea adicional que se procesa en la misma fase).
- Las macrotareas (`Timeout 1`, `Timeout 2`) se ejecutan en orden de encolamiento después de vaciar todas las microtareas.

## Interacción entre macrotareas y microtareas

Cuando una macrotarea se ejecuta, puede generar nuevas microtareas. Antes de pasar a la siguiente macrotarea, el event loop drena todas esas microtareas.

```javascript
setTimeout(() => {
  console.log('Macrotarea');
  Promise.resolve().then(() => console.log('Micro dentro de macro'));
}, 0);

Promise.resolve().then(() => {
  console.log('Micro inicial');
  setTimeout(() => console.log('Macro dentro de micro'), 0);
});
```

**Salida:**

```
Micro inicial
Macrotarea
Micro dentro de macro
Macro dentro de micro
```

**Explicación:**
1. Script termina → se drena micro: `Micro inicial` (encola `setTimeout` en macrotareas).
2. Se toma siguiente macrotarea: `Macrotarea` (encola promesa en micro).
3. Antes de siguiente macrotarea, se drena micro: `Micro dentro de macro`.
4. Siguiente macrotarea: `Macro dentro de micro`.

## Implicaciones y riesgos

- **Bloqueo del event loop:** Si una microtarea encola otra microtarea recursivamente, nunca se procesarán macrotareas ni se renderizará (en navegador), congelando la UI.
- **Diferencias entre `process.nextTick` y promesas en Node:** `nextTick` tiene prioridad incluso sobre las promesas, lo que puede causar inanición (starvation) de promesas si se abusa.
- **`queueMicrotask`** es la forma estándar de encolar microtareas explícitamente sin depender de promesas.

## Tabla resumen

| Tipo       | Ejemplos                                   | Prioridad relativa |
|------------|--------------------------------------------|---------------------|
| Macrotarea | `setTimeout`, eventos, `setImmediate`      | Menor               |
| Microtarea | `then/catch`, `queueMicrotask`             | Mayor (se drena entre macrotareas) |
| NextTick   | `process.nextTick` (Node)                  | Máxima (antes que promesas) |

## Buenas prácticas

- No usar microtareas para trabajos pesados o recursivos infinitos.
- Preferir macrotareas (`setTimeout`) para ceder el control al event loop y no bloquear la UI.
- Al implementar bibliotecas asíncronas, considerar si se debe ejecutar algo sincrónicamente, como microtarea o como macrotarea para garantizar un orden específico.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Event loop](06-event-loop.md) | [🏠 Inicio](../index.md) | [Abortcontroller ▶](08-abortcontroller.md) |
