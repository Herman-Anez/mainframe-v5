# Callbacks

## El patrón callback

Un **callback** (función de retrollamada) es una función que se pasa como argumento a otra función, para que sea invocada en un momento posterior, generalmente cuando una operación asíncrona ha finalizado o cuando se alcanza una condición.

```javascript
function procesarDatos(datos, callback) {
  // Simulación de operación asíncrona
  setTimeout(() => {
    const resultado = datos.toUpperCase();
    callback(null, resultado);
  }, 1000);
}

procesarDatos("hola", (error, resultado) => {
  if (error) return console.error(error);
  console.log(resultado);
});
```

## Naturaleza síncrona vs asíncrona del callback

- **Callback síncrono**: se ejecuta inmediatamente dentro de la función que lo recibe, como en `array.forEach(callback)`.
- **Callback asíncrono**: se difiere su ejecución (temporizadores, E/S, peticiones de red) y se despacha a través del event loop, generalmente desde una cola de tareas (macrotareas) o microtareas.

El hecho de que un callback sea asíncrono no depende de la función en sí, sino del contexto en el que se invoca (si se envuelve en `setTimeout`, `fetch`, `nextTick`, etc.).

## Convención "error-first" (Node.js)

En las API de Node.js, los callbacks siguen la convención de que el primer argumento es el error (si ocurre, `null` en caso de éxito) y los siguientes son los resultados.

```javascript
fs.readFile('archivo.txt', 'utf8', (err, data) => {
  if (err) {
    console.error('Error:', err);
    return;
  }
  console.log(data);
});
```

Esto facilita el manejo unificado de errores y evita mezclar resultados con posibles errores.

## Callback Hell (pirámide de la muerte)

Al anidar múltiples operaciones asíncronas dependientes, el código se vuelve profundamente indentado, difícil de leer, mantener y depurar.

```javascript
obtenerUsuario(id, (err, usuario) => {
  if (err) return manejarError(err);
  obtenerPosts(usuario.id, (err, posts) => {
    if (err) return manejarError(err);
    obtenerComentarios(posts[0].id, (err, comentarios) => {
      if (err) return manejarError(err);
      // ...
    });
  });
});
```

### Soluciones históricas

- **Nombrar funciones** en lugar de usar anónimas, declarándolas fuera del anidamiento y pasarlas como referencia.
- **Modularización**: separar cada paso en funciones independientes.
- **Librerías de control de flujo** como `async.js` (series, parallel, waterfall).
- **Promesas** y **async/await** (estándar moderno).

## Inversión de control (IoC)

Al entregar un callback a una función de terceros, cedemos el control de *qué*, *cuándo* y *cuántas veces* se ejecuta nuestro código. Esto puede generar problemas:
- Que el callback no se ejecute nunca.
- Que se ejecute varias veces (por error de la API).
- Que se ejecute síncronamente a veces y asíncronamente otras (comportamiento impredecible).

Para mitigarlo, se pueden implementar salvaguardas (ejecutar una vez, manejar timeouts), pero las promesas resuelven este problema invirtiendo la inversión de control: la promesa nos entrega el resultado cuando esté listo, bajo nuestro control.

## Callbacks y el event loop

Los callbacks asíncronos (por ejemplo, los pasados a `setTimeout`, `setInterval`, eventos del DOM, I/O de red) se registran y se encolan en la **cola de tareas (task queue)** correspondiente (macrotasks o microtareas). El event loop los ejecuta cuando la pila de llamadas está vacía y el tipo de tarea es el próximo a procesar.

- `setTimeout` / `setInterval` → macrotareas.
- `.then()` / `catch()` → microtareas.
- Eventos de usuario, `fetch` callbacks (en la API antigua con `XMLHttpRequest`), I/O → macrotareas.

## Limitaciones de los callbacks

- Falta de retorno de valores: no se puede usar `return` para devolver el resultado; solo se puede pasar al callback.
- Composición compleja: para coordinar múltiples tareas asíncronas en paralelo o serie se requiere código adicional.
- Manejo de errores complicado: `try/catch` no funciona con callbacks asíncronos porque el error se lanza en otro contexto.
- Callback hell afecta la legibilidad.

## Cuándo se usan hoy

Aunque las promesas y `async/await` han reemplazado en gran medida los callbacks para flujos asíncronos, los callbacks siguen siendo esenciales en:
- APIs antiguas o de bajo nivel (Node.js `fs` antes de promisificarse).
- Suscripciones a eventos (`addEventListener`).
- Métodos funcionales de arrays (`map`, `filter`, `reduce`).
- Algunos patrones como el callback de finalización de animaciones.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Arrays tipados](../05-arrays-y-colecciones/09-arrays-tipados.md) | [🏠 Inicio](../index.md) | [Promesas ▶](02-promesas.md) |
