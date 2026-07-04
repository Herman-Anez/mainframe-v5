## 01-closures-aplicados.md

### Qué es un closure

Un closure es la combinación de una función y el ámbito léxico en el que fue declarada. Permite que una función acceda a variables de un ámbito externo incluso después de que la función externa haya terminado de ejecutarse.

```javascript
function crearContador() {
  let cuenta = 0;
  return function incrementar() {
    cuenta++;
    return cuenta;
  };
}
const contador = crearContador();
console.log(contador()); // 1
console.log(contador()); // 2
```

`cuenta` sobrevive a la ejecución de `crearContador` porque la función anidada mantiene una referencia al entorno léxico donde fue creada.

### Patrones prácticos con closures

#### 1. Módulo revelador (Revealing Module Pattern)

Antes de ES6, los closures permitían encapsular estado y exponer solo métodos públicos. Sigue siendo útil para aislamiento de lógica sin necesidad de clases o módulos.

```javascript
const GestorTareas = (function() {
  const tareas = []; // privado

  function agregar(tarea) { tareas.push(tarea); }
  function listar() { return [...tareas]; }
  function eliminar(indice) { tareas.splice(indice, 1); }

  return {
    agregar,
    listar,
    eliminar
  };
})();

GestorTareas.agregar('Estudiar');
console.log(GestorTareas.listar()); // ['Estudiar']
// No se puede acceder a tareas directamente
```

#### 2. Fábrica de funciones (Factory Functions)

Un closure puede generar funciones con comportamiento configurado dinámicamente.

```javascript
function crearSaludo(saludo) {
  return function(nombre) {
    return `${saludo}, ${nombre}!`;
  };
}
const hola = crearSaludo('Hola');
const hey = crearSaludo('Hey');
console.log(hola('Ana')); // Hola, Ana!
console.log(hey('Luis')); // Hey, Luis!
```

#### 3. Memoización

Almacenar resultados de funciones costosas para evitar recálculos. El closure mantiene la caché privada.

```javascript
function memoizar(fn) {
  const cache = new Map();
  return function(arg) {
    if (!cache.has(arg)) {
      cache.set(arg, fn(arg));
    }
    return cache.get(arg);
  };
}
const factorial = memoizar(function(n) {
  if (n <= 1) return 1;
  return n * factorial(n - 1);
});
console.log(factorial(5)); // calcula y cachea
console.log(factorial(5)); // desde caché
```

#### 4. Aplicación parcial y currying manual

Fijar argumentos de una función sin ejecutarla completamente.

```javascript
function multiplicar(a, b) {
  return a * b;
}
function parcial(fn, ...argsFijos) {
  return function(...argsRest) {
    return fn(...argsFijos, ...argsRest);
  };
}
const duplicar = parcial(multiplicar, 2);
console.log(duplicar(7)); // 14
```

#### 5. Encapsulación de estado en componentes (sin clases)

Patrón similar al hook `useState` de React: el closure preserva el estado entre invocaciones.

```javascript
function crearContador() {
  let valor = 0;
  return [
    () => valor,
    () => { valor++; },
    (nuevo) => { valor = nuevo; }
  ];
}
const [leer, incrementar, fijar] = crearContador();
incrementar();
console.log(leer()); // 1
```

#### 6. Manejadores de eventos con datos persistentes

Asociar un closure a un evento para conservar contexto sin `bind`.

```javascript
function inicializarBoton(texto) {
  const btn = document.createElement('button');
  btn.textContent = texto;
  btn.addEventListener('click', function() {
    console.log(`Clic en ${texto}`);
  });
  document.body.appendChild(btn);
}
inicializarBoton('Aceptar');
```

El callback captura `texto` por closure, sin necesidad de almacenar el valor en el DOM o usar `dataset`.

#### 7. Iteradores con closures

Antes de los generadores, se implementaban iteradores con closures.

```javascript
function crearIterador(arr) {
  let indice = 0;
  return {
    next: function() {
      if (indice < arr.length) return { value: arr[indice++], done: false };
      return { done: true };
    }
  };
}
```

### Gestión de memoria y riesgos

- Los closures impiden que el recolector de basura elimine las variables referenciadas mientras la función viva.
- Una fuga de memoria ocurre si se acumulan closures que capturan grandes estructuras de datos y no se liberan (por ejemplo, al añadir indefinidamente listeners con closures que referencian objetos grandes sin limpiarlos).
- En aplicaciones modernas, los closures son omnipresentes (eventos, promesas, callbacks). La clave es limpiar referencias cuando ya no se necesitan (eliminar listeners, anular variables).

---

## 02-currying-y-composicion.md

### Currying (Currificación)

Currificar una función significa transformarla de manera que, en lugar de recibir todos sus argumentos a la vez, los reciba uno a uno, devolviendo una nueva función por cada argumento faltante.

```javascript
// Función normal
function suma(a, b, c) {
  return a + b + c;
}

// Versión currificada manual
function sumaCurry(a) {
  return function(b) {
    return function(c) {
      return a + b + c;
    };
  };
}
console.log(sumaCurry(1)(2)(3)); // 6
```

#### Función curry genérica

Se puede implementar un `curry` que transforme cualquier función multiargumento.

```javascript
function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) {
      return fn.apply(this, args);
    }
    return (...next) => curried(...args, ...next);
  };
}
const sumaC = curry((a, b, c) => a + b + c);
console.log(sumaC(1)(2)(3)); // 6
console.log(sumaC(1, 2)(3)); // 6
```

La currificación permite crear funciones reutilizables altamente especializadas. Por ejemplo, `map` con un transformador fijo:

```javascript
const map = curry((fn, arr) => arr.map(fn));
const duplicarNumeros = map(x => x * 2);
console.log(duplicarNumeros([1, 2, 3])); // [2,4,6]
```

#### Currying vs aplicación parcial

- **Currying**: descompone la función en funciones unarias (de un argumento) y solo se ejecuta cuando todos los argumentos están presentes.
- **Aplicación parcial**: fija algunos argumentos y devuelve una función que espera los restantes, sin importar cuántos sean.

```javascript
// Aplicación parcial con bind
function saludar(saludo, nombre) {
  return `${saludo} ${nombre}`;
}
const saludarHola = saludar.bind(null, 'Hola');
console.log(saludarHola('Ana')); // Hola Ana
```

#### Beneficios del currying

- **Reutilización**: generar funciones preconfiguradas.
- **Punto libre (point-free)**: definir funciones sin mencionar los datos, solo componiendo otras funciones.
- **Legibilidad** en pipelines funcionales.
- **Evaluación parcial**: diferir la ejecución hasta tener todos los argumentos.

### Composición de funciones

Componer funciones implica combinar dos o más para formar una nueva, donde la salida de una se convierte en la entrada de la siguiente.

```javascript
const compose = (f, g) => x => f(g(x));
const aMayus = str => str.toUpperCase();
const exclamar = str => `${str}!`;
const gritar = compose(exclamar, aMayus);
console.log(gritar('hola')); // "HOLA!"
```

#### `compose` y `pipe`

- **compose(f, g)**: aplica de derecha a izquierda (f(g(x))).
- **pipe**: aplica de izquierda a derecha (g(f(x))), a menudo más legible en programación funcional.

```javascript
const pipe = (...fns) => x => fns.reduce((v, f) => f(v), x);
const gritarPipe = pipe(aMayus, exclamar);
console.log(gritarPipe('hola')); // "HOLA!"
```

#### Composición sobre herencia

En lugar de crear jerarquías de clases, se prefiere combinar pequeñas funciones independientes mediante composición para construir comportamientos complejos.

#### Transductores (introducción breve)

Un transductor es una función que compone transformaciones sin crear colecciones intermedias. Por ejemplo, combinar `map` y `filter` en un solo paso eficiente.

```javascript
function compose(...fns) { /* ... */ }
const filter = pred => reducer => (acc, val) => pred(val) ? reducer(acc, val) : acc;
const map = fn => reducer => (acc, val) => reducer(acc, fn(val));

const transducir = compose(
  filter(x => x % 2 === 0),
  map(x => x * 10)
);

const push = (arr, val) => { arr.push(val); return arr; };
[1,2,3,4].reduce(transducir(push), []); // [20, 40]
```

Aunque es un tema avanzado, muestra el poder de la composición más allá de funciones básicas.

#### Casos de uso reales

- **Redux** (y otros state managers): los middlewares y reducers se componen.
- **Librerías como Lodash/fp, Ramda**: fomentan currying y composición para flujos de datos inmutables.
- **React**: Componentes de orden superior (HOC) y hooks personalizados se basan en composición.
- **Validación de datos**: componer validadores atómicos para reglas complejas.

---

## 03-proxy-y-reflect.md

### Proxy

El objeto `Proxy` permite crear un intermediario (wrapper) alrededor de un objeto objetivo y redefinir operaciones fundamentales mediante **trampas (traps)**.

```javascript
const objetivo = { nombre: 'Ana' };
const handler = {
  get(target, prop, receiver) {
    console.log(`Acceso a propiedad "${prop}"`);
    return Reflect.get(target, prop, receiver);
  },
  set(target, prop, value, receiver) {
    console.log(`Asignando ${prop} = ${value}`);
    return Reflect.set(target, prop, value, receiver);
  }
};
const proxy = new Proxy(objetivo, handler);
proxy.nombre;            // Log: Acceso a propiedad "nombre"
proxy.edad = 30;         // Log: Asignando edad = 30
```

El `receiver` es el propio proxy o el objeto que recibe la operación, útil cuando el proxy está en la cadena de prototipos.

#### Trampas disponibles

El handler puede definir las siguientes trampas, que interceptan operaciones internas:

- `get`, `set`, `deleteProperty`
- `has` (operador `in`)
- `ownKeys` (Object.keys, for...in)
- `apply` (llamada a función)
- `construct` (operador new)
- `defineProperty`, `getOwnPropertyDescriptor`
- `preventExtensions`, `isExtensible`
- `getPrototypeOf`, `setPrototypeOf`

#### Casos de uso prácticos

##### Validación de propiedades

```javascript
function crearObjetoValidado(esquema) {
  return new Proxy({}, {
    set(target, prop, value) {
      if (prop in esquema && typeof value !== esquema[prop]) {
        throw new TypeError(`${prop} debe ser ${esquema[prop]}`);
      }
      target[prop] = value;
      return true;
    }
  });
}
const persona = crearObjetoValidado({ nombre: 'string', edad: 'number' });
persona.nombre = 'Luis'; // OK
persona.edad = '30';     // Error
```

##### Reactividad al estilo Vue

Vue 3 utiliza `Proxy` para detectar cambios y actualizar la UI.

```javascript
function crearReactivo(objetivo, callback) {
  return new Proxy(objetivo, {
    set(target, prop, value, receiver) {
      const old = target[prop];
      const result = Reflect.set(target, prop, value, receiver);
      if (old !== value) callback(prop, value, old);
      return result;
    }
  });
}
```

##### Registro y auditoría (logging)

Registrar todas las interacciones con un objeto para depuración.

##### Acceso seguro a propiedades profundas (sin errores)

```javascript
const safeHandler = {
  get(target, prop) {
    return prop in target ? target[prop] : {};
  }
};
const safeObj = new Proxy({}, safeHandler);
const valor = safeObj.a.b.c; // no lanza error, devuelve {} (o se puede afinar para devolver undefined)
```

##### Objetos virtuales y simulación de APIs

Se puede simular un objeto con miles de propiedades sin almacenarlas todas, generándolas bajo demanda.

##### Revocable Proxy

`Proxy.revocable(objetivo, handler)` devuelve un objeto con `proxy` y `revoke`. Al llamar a `revoke()`, cualquier operación en el proxy lanza `TypeError`. Útil para conceder acceso temporal a un recurso.

```javascript
const { proxy, revoke } = Proxy.revocable({}, {});
proxy.a = 1;
revoke();
proxy.a; // TypeError
```

### Reflect

`Reflect` es un objeto incorporado que proporciona métodos estáticos equivalentes a las trampas de proxy, realizando las operaciones por defecto. Su uso dentro de un proxy facilita delegar al comportamiento original.

```javascript
const handler = {
  set(target, prop, value, receiver) {
    if (prop === 'id') throw new Error('No se puede modificar id');
    return Reflect.set(target, prop, value, receiver);
  }
};
```

#### Métodos de Reflect

- `Reflect.get(target, prop, receiver?)`
- `Reflect.set(target, prop, value, receiver?)`
- `Reflect.has(target, prop)`
- `Reflect.deleteProperty(target, prop)`
- `Reflect.apply(func, thisArg, args)`
- `Reflect.construct(Constructor, args, newTarget?)`
- `Reflect.defineProperty`, `Reflect.getOwnPropertyDescriptor`, etc.

#### Ventajas de Reflect

- Centraliza la funcionalidad que antes estaba dispersa en `Object` y operadores (`in`, `delete`).
- Proporciona valores de retorno consistentes (ej. `Reflect.set` devuelve `true`/`false`, mientras que una asignación directa no).
- `Reflect.apply` y `Reflect.construct` son más legibles y seguros que `Function.prototype.apply` o `new`.

#### Proxy + Reflect en la práctica

Siempre que se escribe un handler, se suele usar `Reflect` para no romper el comportamiento esperado y solo interceptar lo necesario. Por ejemplo, al interceptar `get`, se puede llamar a `Reflect.get` para obtener el valor real y luego modificarlo.

```javascript
const handler = {
  get(target, prop, receiver) {
    const value = Reflect.get(target, prop, receiver);
    return typeof value === 'string' ? value.toUpperCase() : value;
  }
};
```

---

## 04-symbols-iteradores.md

### Repaso de Symbols

`Symbol` es un tipo primitivo que genera valores únicos e inmutables. Cada símbolo es distinto, incluso si se crean con la misma descripción.

```javascript
const s1 = Symbol('id');
const s2 = Symbol('id');
console.log(s1 === s2); // false
```

#### Símbolos globales

`Symbol.for(clave)` busca un símbolo en un registro global y lo crea si no existe. `Symbol.keyFor(simbolo)` recupera la clave asociada.

```javascript
const global = Symbol.for('app.identificador');
console.log(Symbol.keyFor(global)); // 'app.identificador'
```

#### Símbolos bien conocidos (Well-known Symbols)

Definidos en la especificación, permiten personalizar comportamientos del lenguaje. Los más relevantes para iteración:

- `Symbol.iterator`
- `Symbol.asyncIterator`
- `Symbol.toStringTag`
- `Symbol.toPrimitive`
- `Symbol.isConcatSpreadable`
- `Symbol.species`

### Iteradores y el protocolo iterable

#### Protocolo iterable

Un objeto es iterable si tiene un método `[Symbol.iterator]` que retorna un **iterador**. El iterador debe implementar un método `next()` que devuelve un objeto `{ value, done }`.

#### Implementación personalizada de un iterable

```javascript
const rango = {
  inicio: 1,
  fin: 5,
  [Symbol.iterator]() {
    let actual = this.inicio;
    const fin = this.fin;
    return {
      next() {
        if (actual > fin) return { done: true };
        return { value: actual++, done: false };
      }
    };
  }
};

for (const num of rango) {
  console.log(num); // 1,2,3,4,5
}
```

#### Símbolos e iteración en objetos nativos

Array, String, Map, Set y otros tienen sus propios `Symbol.iterator`. Cuando se usa `for...of`, el motor busca ese método.

```javascript
const mapa = new Map([['a', 1]]);
for (const [clave, valor] of mapa) { /* ... */ }
// Equivalente a mapa[Symbol.iterator]()
```

#### `Symbol.iterator` en objetos personalizados

Se puede añadir a cualquier objeto para volverlo compatible con `for...of`, spread (`[...obj]`), y funciones como `Array.from`.

```javascript
class Coleccion {
  constructor() {
    this.items = [];
  }
  agregar(item) {
    this.items.push(item);
  }
  [Symbol.iterator]() {
    let i = 0;
    const items = this.items;
    return {
      next() {
        if (i < items.length) return { value: items[i++], done: false };
        return { done: true };
      }
    };
  }
}
```

#### `Symbol.asyncIterator`

Para iterables que producen valores de forma asíncrona. Se usa con `for await...of`. El método `next()` devuelve una promesa de `{ value, done }`.

```javascript
const asyncIterable = {
  [Symbol.asyncIterator]() {
    let i = 0;
    return {
      async next() {
        if (i < 3) {
          await new Promise(r => setTimeout(r, 100));
          return { value: i++, done: false };
        }
        return { done: true };
      }
    };
  }
};

(async () => {
  for await (const val of asyncIterable) {
    console.log(val);
  }
})();
```

Los generadores asíncronos (`async function*`) devuelven objetos que implementan `Symbol.asyncIterator` automáticamente.

### Iteradores con generadores

Las funciones generadoras (`function*`) facilitan la creación de iterables e iteradores. El valor retornado por el generador implementa tanto `[Symbol.iterator]` como `next`.

```javascript
function* generarFibonacci(limite) {
  let a = 0, b = 1;
  for (let i = 0; i < limite; i++) {
    yield a;
    [a, b] = [b, a + b];
  }
}

for (const n of generarFibonacci(10)) {
  console.log(n);
}
```

Internamente, el generador produce un objeto que tiene `Symbol.iterator` que se retorna a sí mismo, y el protocolo se cumple.

#### Símbolos como identificadores de propiedades

Gracias a su unicidad, los símbolos se usan para definir propiedades "semi-privadas" o para evitar colisiones en metaprogramación.

```javascript
const _saldo = Symbol('saldo');
class Cuenta {
  constructor(saldoInicial) {
    this[_saldo] = saldoInicial;
  }
  getSaldo() {
    return this[_saldo];
  }
}
```

Aunque no son completamente privadas (se pueden listar con `Object.getOwnPropertySymbols`), evitan conflictos con nombres de cadena y no aparecen en `for...in` o `JSON.stringify`.

---

## 05-event-loop-profundo.md

### Arquitectura del Event Loop

JavaScript es **single-threaded**, pero el entorno (navegador o Node.js) proporciona **APIs asíncronas** que se ejecutan fuera del hilo principal. El **Event Loop** coordina la ejecución de código, recogiendo eventos y tareas de colas cuando la pila de llamadas está vacía.

#### Componentes clave

- **Call Stack (pila de llamadas)**: estructura LIFO que ejecuta el código síncrono. Cada función invocada añade un frame.
- **Web APIs / Node APIs**: funciones como `setTimeout`, `fetch`, `fs.readFile` que procesan trabajo en segundo plano.
- **Colas de tareas**:
  - **Macrotareas (Task Queue)**: timers (`setTimeout`, `setInterval`), I/O, eventos de UI, `setImmediate` (Node).
  - **Microtareas (Microtask Queue)**: promesas (`.then`, `catch`, `finally`), `queueMicrotask`, `MutationObserver`.

#### Flujo del Event Loop (Navegador)

1. Ejecuta el script actual (macrotarea inicial) hasta vaciar la pila.
2. **Vacía la cola de microtareas** completamente, incluyendo las que se agreguen durante este proceso.
3. **Renderizado**: si hay cambios pendientes en el DOM y el navegador lo considera oportuno, se realiza un repaint.
4. **Próxima macrotarea**: se toma una tarea de la cola de macrotareas y se ejecuta (vuelve al paso 1).

Este ciclo se repite constantemente.

#### Visualización con un ejemplo

```javascript
console.log('A');

setTimeout(() => console.log('B'), 0);

Promise.resolve()
  .then(() => console.log('C'))
  .then(() => console.log('D'));

console.log('E');
```

**Salida:** A, E, C, D, B.

**Explicación paso a paso:**
- Script se ejecuta (macrotarea): log A, `setTimeout` encola macrotarea B, promesas encolan microtareas C y luego D, log E.
- Pila vacía → microtareas: se ejecutan C y D.
- Microtareas vacías → se toma siguiente macrotarea: B.

#### Bloqueo del Event Loop

Si una tarea (especialmente una microtarea) no termina o encadena microtareas infinitamente, el bucle nunca procesará macrotareas ni renderizará, congelando la UI.

```javascript
function microInfinita() {
  Promise.resolve().then(microInfinita);
}
// Esto bloqueará la página
```

### Diferencias en Node.js

Node.js tiene fases específicas en su event loop (basado en `libuv`):

1. **Timers**: ejecuta callbacks de `setTimeout` y `setInterval`.
2. **Pending callbacks**: para errores de sistema y ciertos callbacks diferidos.
3. **Idle, prepare** (uso interno).
4. **Poll**: recupera nuevos eventos de I/O y ejecuta sus callbacks.
5. **Check**: ejecuta `setImmediate`.
6. **Close callbacks**: callbacks de cierre (ej. `socket.on('close')`).

Entre cada fase, Node procesa las **microtareas** (promesas y `process.nextTick`). `process.nextTick` tiene prioridad incluso sobre las promesas.

```javascript
// En Node.js
Promise.resolve().then(() => console.log('Promesa'));
process.nextTick(() => console.log('nextTick'));
// Salida: nextTick, Promesa
```

### `setTimeout` vs `setImmediate` vs `nextTick`

- `setTimeout(fn, 0)`: la tarea se encola en la fase de timers; su ejecución depende de cuándo se llegue a esa fase.
- `setImmediate(fn)`: se ejecuta en la fase check, después de la poll (I/O).
- `process.nextTick(fn)`: no es una microtarea, sino una cola interna de Node que se ejecuta **inmediatamente después de la operación actual**, antes de cualquier otra microtarea o fase. Puede causar inanición de I/O si se abusa.

### Macrotareas y microtareas en detalle

#### Macrotareas más comunes

- `setTimeout`, `setInterval`
- Eventos de usuario (`click`, `keydown`)
- `requestAnimationFrame` (se considera una tarea de renderizado, con tiempo específico)
- `fetch` (la resolución de la promesa es una microtarea, pero la recepción de la respuesta puede implicar macrotareas internas)

#### Microtareas más comunes

- `.then`, `.catch`, `.finally`
- `queueMicrotask(fn)`
- `MutationObserver`
- `await` (la reanudación tras un `await` se encola como microtarea)

#### Ejemplo complejo

```javascript
setTimeout(() => console.log('1'), 0);

new Promise(resolve => {
  console.log('2');
  resolve();
}).then(() => console.log('3'));

console.log('4');

queueMicrotask(() => console.log('5'));
```

Salida: 2, 4, 3, 5, 1.
- El script es la macrotarea inicial: log 2, encola micro .then (3), log 4.
- Al final del script, la pila vacía → microtareas: 3, luego queueMicrotask 5.
- Luego macrotarea: 1.

### Implicaciones en el desarrollo

- **No bloquear el event loop** con operaciones síncronas pesadas (bucles largos, cálculos intensivos). Usar `Web Workers` o dividir en tareas con `setTimeout`/`requestAnimationFrame`.
- **Priorizar microtareas solo para lo necesario**, ya que se ejecutan antes que el renderizado. Demasiadas microtareas seguidas pueden retrasar la actualización visual.
- **Utilizar `requestAnimationFrame` para animaciones** porque se sincroniza con el ciclo de renderizado.
- **Comprender el orden** para evitar condiciones de carrera sutiles entre promesas y timers.

### Herramientas de depuración

Los navegadores modernos y Node.js ofrecen herramientas de performance que muestran el event loop, tareas y microtareas, lo que ayuda a encontrar bloqueos y optimizar la asincronía.

---
## 06-web-workers.md

### Introducción a los Web Workers

Los **Web Workers** permiten ejecutar scripts en hilos en segundo plano, separados del hilo principal de la interfaz de usuario. Esto evita que las operaciones costosas bloqueen la página y degraden la experiencia de usuario. Un worker se ejecuta en su propio contexto global (`DedicatedWorkerGlobalScope` o `SharedWorkerGlobalScope`), sin acceso al DOM pero con capacidad para realizar cómputos, manejar peticiones de red y comunicarse con el hilo principal mediante mensajes.

### Creación y ciclo de vida

#### Worker dedicado

Se crea con el constructor `Worker` pasando la URL del script.

```javascript
// En el hilo principal
const worker = new Worker('worker.js');

// Enviar un mensaje al worker
worker.postMessage({ tipo: 'calcular', datos: 1000000 });

// Recibir mensajes del worker
worker.onmessage = function(event) {
  console.log('Resultado:', event.data);
};

// Manejo de errores
worker.onerror = function(error) {
  console.error('Error en worker:', error.message);
};

// Terminar el worker
worker.terminate();
```

Dentro del worker (`worker.js`), el contexto global es `self` (similar a `window` pero restringido). Se comunica con `onmessage` y `postMessage`.

```javascript
// worker.js
self.onmessage = function(event) {
  const { tipo, datos } = event.data;
  if (tipo === 'calcular') {
    let suma = 0;
    for (let i = 0; i < datos; i++) {
      suma += Math.sqrt(i);
    }
    self.postMessage({ resultado: suma });
  }
};
```

#### Workers compartidos (SharedWorker)

Permiten que varios contextos (p.ej., múltiples pestañas) se comuniquen con el mismo worker. Se identifican mediante un nombre o la misma URL.

```javascript
// Hilo principal (en cada página)
const sharedWorker = new SharedWorker('shared-worker.js');
sharedWorker.port.start(); // necesario para iniciar la comunicación
sharedWorker.port.postMessage({ type: 'increment' });
sharedWorker.port.onmessage = (e) => console.log(e.data);
```

Dentro del shared worker, se usa el evento `connect` para manejar cada conexión:

```javascript
// shared-worker.js
let contador = 0;
self.onconnect = function(e) {
  const port = e.ports[0];
  port.onmessage = function(event) {
    contador++;
    port.postMessage(contador);
  };
};
```

### Comunicación: mensajes y transferencia de datos

`postMessage` puede enviar casi cualquier tipo de dato serializable (copia estructurada): primitivos, objetos planos, arrays, `Date`, `Map`, `Set`, etc. No se pueden enviar funciones, elementos del DOM ni objetos con referencias circulares complejas.

#### Transferencia de propiedad (Transferable objects)

Para datos binarios grandes (ArrayBuffer, MessagePort) se puede **transferir** la propiedad en lugar de copiarlos, lo que es mucho más eficiente. Una vez transferidos, el remitente pierde el acceso.

```javascript
const buffer = new ArrayBuffer(1024);
worker.postMessage(buffer, [buffer]);
// buffer ahora está desvinculado en el hilo principal (byteLength = 0)
```

Esto es común en procesamiento de imágenes, video y WebGL.

### Contexto y limitaciones del worker

#### APIs disponibles

El `WorkerGlobalScope` proporciona muchas APIs del navegador, pero **no el DOM**. Entre ellas:

- `fetch`, `XMLHttpRequest`
- `setTimeout`, `setInterval`
- `console`
- `navigator` y `location` (solo lectura)
- `importScripts()` para cargar otros scripts de forma síncrona (aunque en workers modernos también se pueden usar módulos ES)
- `WebSocket`, `IndexedDB`

No hay acceso a `window`, `document` o APIs de UI.

#### Workers como módulos

Se pueden cargar workers usando módulos ES:

```javascript
const worker = new Worker('worker.js', { type: 'module' });
```

El worker puede entonces usar `import` y `export` dentro de su script.

#### Subworkers

Un worker puede crear otros workers (subworkers), generando árboles de hilos. Esto es útil para tareas masivamente paralelas, aunque la latencia de comunicación puede aumentar.

### Casos de uso típicos

- **Procesamiento intensivo de CPU**: cifrado, compresión, análisis de datos, operaciones matemáticas complejas (ej. cálculo de números primos, procesamiento de imágenes con Canvas offscreen).
- **Operaciones de red en segundo plano**: mantener conexiones WebSocket, sincronizar datos.
- **Búsqueda y filtrado de grandes conjuntos de datos en el navegador**.
- **OffscreenCanvas**: permite renderizar gráficos en un worker y transferir el resultado al canvas principal, evitando bloquear la UI.

### Workers en Node.js (`worker_threads`)

Node.js tiene su propia implementación de workers con el módulo `worker_threads`. La API es similar pero con diferencias:

```javascript
const { Worker, isMainThread, parentPort } = require('worker_threads');
if (isMainThread) {
  const worker = new Worker(__filename);
  worker.on('message', console.log);
  worker.postMessage('Hola');
} else {
  parentPort.on('message', msg => parentPort.postMessage(msg.toUpperCase()));
}
```

En Node.js, los workers comparten memoria mediante `SharedArrayBuffer` y pueden usar `Atomics` para sincronización.

### Manejo de errores y depuración

- `worker.onerror` captura errores no manejados dentro del worker.
- Los workers pueden ser inspeccionados en las DevTools del navegador (pestaña "Sources" > "Workers").
- Es importante terminar los workers con `terminate()` cuando ya no se necesiten para evitar fugas de memoria.

---

## 07-service-workers.md

### Definición y propósito

Un **Service Worker** es un script que el navegador ejecuta en segundo plano, separado de la página web, y que actúa como un proxy entre la aplicación, la red y la caché. Es la base para crear **Progressive Web Apps (PWA)** con capacidades offline, notificaciones push y sincronización en segundo plano.

El service worker se sitúa entre el navegador y el servidor, interceptando todas las peticiones de red de las páginas que controla.

### Ciclo de vida

1. **Registro**: la página registra un service worker con `navigator.serviceWorker.register('/sw.js')`.
2. **Instalación**: el navegador descarga el script y dispara el evento `install`. Es el momento ideal para precachear recursos.
3. **Activación**: tras la instalación (y cuando no hay páginas usando el worker antiguo), se dispara el evento `activate`. Se suele limpiar cachés antiguas aquí.
4. **Control**: el service worker controla las páginas abiertas bajo su scope. Puede interceptar peticiones con el evento `fetch` y manejar mensajes con `message`.

#### Registro

```javascript
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js')
    .then(reg => console.log('Registrado con scope:', reg.scope))
    .catch(err => console.error('Fallo:', err));
}
```

El scope determina qué URLs serán controladas; por defecto es el directorio del script.

#### Eventos del ciclo de vida

```javascript
// sw.js
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open('v1').then(cache => {
      return cache.addAll(['/', '/styles.css', '/app.js']);
    })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== 'v1').map(key => caches.delete(key))
      );
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});
```

`event.waitUntil` extiende la vida del evento hasta que la promesa se resuelva, evitando que el worker sea terminado prematuramente.

### Estrategias de caché

- **Cache First**: ideal para recursos estáticos. Intenta servir desde caché, si no está, va a red.
- **Network First**: para datos dinámicos; intenta red y si falla, muestra la versión en caché.
- **Stale-While-Revalidate**: sirve desde caché inmediatamente y actualiza la caché en segundo plano con la respuesta de red.
- **Cache Only / Network Only**: para casos específicos.

Ejemplo de Network First:

```javascript
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
```

### Notificaciones Push

El service worker puede recibir mensajes push del servidor incluso con la aplicación cerrada (si el navegador está abierto) y mostrar notificaciones.

```javascript
self.addEventListener('push', event => {
  const data = event.data.json();
  self.registration.showNotification(data.title, {
    body: data.body,
    icon: '/icon.png'
  });
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(clients.openWindow('/'));
});
```

### Sincronización en segundo plano (Background Sync)

Permite aplazar acciones hasta que el usuario tenga conexión. Se usa en conjunto con el evento `sync`.

```javascript
// En la página
navigator.serviceWorker.ready.then(reg => reg.sync.register('enviar-mensajes'));

// En el service worker
self.addEventListener('sync', event => {
  if (event.tag === 'enviar-mensajes') {
    event.waitUntil(enviarMensajesPendientes());
  }
});
```

### Ciclo de actualización

Cuando se modifica el service worker, el navegador lo descarga pero no lo activa inmediatamente si hay páginas controladas abiertas. El nuevo worker queda en estado `waiting` hasta que todas las pestañas controladas se cierren o se pueda forzar la actualización con `self.skipWaiting()` en el evento `install`. Se puede combinar con `clients.claim()` en el `activate` para tomar control de las páginas sin recargar.

### Límites y consideraciones

- Solo funciona en contextos seguros (HTTPS o localhost).
- El scope es restringido (no puede controlar páginas fuera de su ruta).
- El almacenamiento en caché está sujeto a la cuota general del origen.
- No tiene acceso al DOM, pero sí a `fetch`, `Cache`, `IndexedDB`.
- Los service workers se actualizan cada 24 horas como máximo (el navegador comprueba actualizaciones en cada navegación).

---

## 08-memoizacion.md

### Definición

La **memoización** es una técnica de optimización que consiste en almacenar en caché los resultados de funciones costosas para devolver el valor cacheado cuando los mismos argumentos se usan nuevamente, evitando recálculos.

```javascript
function memoize(fn) {
  const cache = new Map();
  return function(arg) {
    if (cache.has(arg)) return cache.get(arg);
    const result = fn(arg);
    cache.set(arg, result);
    return result;
  };
}
const factorial = memoize(function(n) {
  if (n <= 1) return 1;
  return n * factorial(n - 1);
});
```

### Implementaciones comunes

#### Para funciones de un solo argumento

La versión anterior con `Map` funciona bien si el argumento es un primitivo o una referencia estable. Si los argumentos son objetos distintos pero con el mismo valor semántico, se necesita un serializador (ej. `JSON.stringify`) o una comparación profunda, a costa de rendimiento.

#### Para funciones con múltiples argumentos

Se puede usar un mapa anidado o una clave compuesta.

```javascript
function memoizeMulti(fn) {
  const cache = new Map();
  return function(...args) {
    const key = JSON.stringify(args);
    if (cache.has(key)) return cache.get(key);
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
}
```

#### Usando WeakMap para claves objeto

Si los argumentos son objetos, se puede usar un `WeakMap` para que la caché no impida la recolección de basura.

```javascript
function memoizeObj(fn) {
  const cache = new WeakMap();
  return function(obj) {
    if (!cache.has(obj)) cache.set(obj, fn(obj));
    return cache.get(obj);
  };
}
```

### Aplicaciones

- **Cálculos recursivos** (Fibonacci, factorial, caminos en grafos).
- **Resultados de llamadas a APIs** (con cuidado de caducidad).
- **Derivación en selectores** (Redux, Zustand) para evitar re-renderizados.
- **Resultados de operaciones de coste computacional** (procesamiento de imágenes, transformación de datos).

### Limitaciones

- La memoización consume memoria para almacenar la caché. Si la función tiene una entrada infinita o de alta cardinalidad, la caché puede crecer indefinidamente.
- Solo es efectiva para funciones **puras** (mismos argumentos → mismo resultado, sin efectos secundarios).
- La comparación de argumentos complejos puede ser costosa; a veces es mejor no memoizar.
- En algunos contextos (React), hooks como `useMemo` y `useCallback` aplican memoización para referencias.

### Estrategias de caducidad

En lugar de una caché infinita, se pueden implementar:
- Tamaño máximo (LRU – Least Recently Used).
- Tiempo de vida (TTL).
- Caché con referencias débiles para objetos.

---

## 09-inmutabilidad.md

### Concepto

La **inmutabilidad** implica que una vez creado un valor, no puede ser modificado. En lugar de cambiar un objeto o array, se crea una nueva copia con los cambios aplicados. Esto evita efectos secundarios no deseados y facilita el razonamiento sobre el estado, especialmente en aplicaciones reactivas y programación funcional.

### Primitivos vs objetos

- Los primitivos (`number`, `string`, `boolean`, `undefined`, `null`, `symbol`, `bigint`) son inmutables por naturaleza. Operaciones como `str.toUpperCase()` devuelven un nuevo string.
- Los objetos (incluyendo arrays y funciones) son mutables. Se necesita un enfoque disciplinado para la inmutabilidad.

### Técnicas de inmutabilidad en JavaScript

#### 1. No mutar directamente

En lugar de `array.push(4)`, usar `[...array, 4]`.
En lugar de `obj.nuevaProp = x`, usar `{ ...obj, nuevaProp: x }`.

#### 2. Object.freeze y Object.seal

- `Object.freeze(obj)` hace que el objeto sea inmutable a nivel superficial: no se pueden añadir, eliminar ni modificar propiedades. Los intentos fallan silenciosamente (o lanzan error en modo estricto). Sin embargo, las propiedades anidadas que son objetos siguen siendo mutables.

```javascript
const config = Object.freeze({ tema: 'oscuro', opciones: { sonido: true } });
config.tema = 'claro'; // no tiene efecto
config.opciones.sonido = false; // sí se modifica (porque opciones no está congelado)
```

Para una inmutabilidad profunda, se necesita una función recursiva (o usar bibliotecas).

#### 3. Estructuras de datos persistentes

Bibliotecas como **Immutable.js** o **Immer** proporcionan tipos de datos que al "modificar" devuelven una nueva versión compartiendo estructura, optimizando memoria y rendimiento.

- **Immer** usa un enfoque con proxies: permite escribir código mutable dentro de una función `produce` y automáticamente produce el siguiente estado inmutable.

```javascript
import { produce } from 'immer';
const state = { contador: 1, items: [] };
const nextState = produce(state, draft => {
  draft.contador++;
  draft.items.push('nuevo');
});
// state no ha sido modificado; nextState es una copia con los cambios.
```

#### 4. Convenciones y herramientas

- Linters (ESLint) pueden forzar no mutar argumentos o variables (`no-param-reassign`, `immutable-data`).
- TypeScript con tipos `readonly` y `ReadonlyArray` ayuda en tiempo de compilación.

```typescript
const arr: ReadonlyArray<number> = [1, 2, 3];
arr.push(4); // Error
```

### Ventajas de la inmutabilidad

- **Previsibilidad**: el estado no cambia inesperadamente.
- **Detección de cambios**: una comparación por referencia (`===`) basta para saber si algo cambió (útil en React, Redux).
- **Historial/deshacer**: mantener snapshots anteriores es trivial.
- **Concurrencia**: en entornos multi-hilo (workers), los objetos inmutables evitan condiciones de carrera.

### Costos

- Mayor consumo de memoria si se crean muchas copias.
- Sobrecarga de CPU al copiar grandes estructuras (mitigada con estructuras persistentes).
- Curva de aprendizaje y posible verbosidad.

### Inmutabilidad y React

En React, el estado debe ser inmutable para que los componentes se re-rendericen correctamente. Métodos como `setState` o el hook `useState` esperan un nuevo objeto en lugar de mutar el existente.

---

## 10-gestion-de-memoria.md

### Principios del manejo de memoria en JavaScript

JavaScript es un lenguaje con **recolección de basura automática**. El motor asigna memoria cuando se crean objetos y la libera cuando detecta que esos objetos ya no son alcanzables (no hay referencias a ellos desde la raíz de la aplicación).

### Ciclo de vida típico

1. **Asignación**: al declarar variables, crear objetos, funciones, etc.
2. **Uso**: el programa utiliza los valores.
3. **Liberación**: el recolector de basura (GC) identifica memoria no utilizada y la libera.

### Recolección de basura (Garbage Collection)

#### Algoritmo Mark-and-Sweep

Es el algoritmo más común. El GC recorre todas las referencias desde las **raíces** (objeto global, pila de llamadas, variables locales activas) y marca todos los objetos alcanzables. Luego, elimina los objetos no marcados y libera la memoria.

La recolección se ejecuta periódicamente, a menudo cuando se agota la memoria joven o en momentos de inactividad.

#### Generacional

Los motores modernos (V8, SpiderMonkey) dividen la memoria en generaciones:
- **Generación joven (new space)**: objetos recién creados y de corta duración. Se recolecta con frecuencia (scavenge).
- **Generación vieja (old space)**: objetos que han sobrevivido a varias recolecciones. Se recolecta con menos frecuencia.

### Fugas de memoria comunes

#### 1. Variables globales accidentales

Asignar a una variable no declarada crea una propiedad global que nunca se recolecta.

```javascript
function foo() {
  bar = 'valor global'; // fuga si no se desea
}
```

Modo estricto evita esto.

#### 2. Closures que retienen referencias innecesarias

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

#### 3. Referencias en caches no controladas

Si se usa un `Map` o un objeto como caché y no se limpia, las claves y valores permanecen. `WeakMap` soluciona esto para objetos clave.

#### 4. Timers y callbacks olvidados

`setInterval` que nunca se limpia mantiene vivo el callback y sus referencias.

#### 5. DOM detached (nodos fantasma)

Si se elimina un nodo del DOM pero JavaScript aún tiene una referencia a él, el nodo y sus subárboles no se recolectan.

```javascript
let elemento = document.getElementById('temp');
elemento.remove(); // eliminado del DOM, pero la variable elemento aún lo referencia
```

Solución: asignar `null` a la variable cuando ya no se necesite.

### Herramientas y monitoreo

- **Chrome DevTools**: pestaña Memory y Performance permiten tomar snapshots de heap, ver objetos por constructor, encontrar detached DOM y grabar la asignación de memoria.
- **Node.js**: `--inspect` y Chrome DevTools pueden inspeccionar la memoria de procesos Node. También `process.memoryUsage()`.
- **Performance API**: `window.performance.memory` (no estándar, Chrome) proporciona datos básicos.

### Referencias débiles (WeakRef y FinalizationRegistry)

#### WeakRef

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

#### FinalizationRegistry

Permite registrar un callback que se ejecuta cuando un objeto es recolectado (con ciertas garantías limitadas). Es una herramienta para limpiar recursos, pero su uso es complejo y no se recomienda para lógica de negocio.

```javascript
const registry = new FinalizationRegistry((heldValue) => {
  console.log(`Objeto con valor ${heldValue} recolectado`);
});
let obj = {};
registry.register(obj, 'mi valor');
obj = null; // eventualmente se disparará el callback
```

### Buenas prácticas

- Minimizar variables globales.
- Limpiar listeners, timers y suscripciones cuando los componentes se destruyan.
- Usar `WeakMap` y `WeakSet` para asociaciones de datos a objetos que tienen un ciclo de vida definido.
- Evitar retener referencias a grandes datos más tiempo del necesario.
- Perfilar la memoria regularmente en etapas de desarrollo.

---

## 11-decoradores.md

### Propuesta de decoradores en ECMAScript

Los **decoradores** son una propuesta en evolución (actualmente en Stage 3) que añade la capacidad de modificar clases y sus miembros (propiedades, métodos, getters, setters) mediante una sintaxis declarativa con `@`. Inspirados en Python y Java, proporcionan una forma de metaprogramación.

Los decoradores **no son parte del estándar ES aún**, pero son ampliamente usados en TypeScript y entornos como Angular, NestJS, y mediante transpiladores (Babel).

### Sintaxis

Un decorador es una función que recibe información sobre el elemento decorado y puede devolver un nuevo descriptor, modificar el elemento o ejecutar lógica adicional.

```javascript
function sellado(constructor) {
  Object.seal(constructor);
  Object.seal(constructor.prototype);
}

@sellado
class MiClase {
  @soloLectura
  nombre = 'Ana';

  @log
  saludar() {
    console.log('Hola');
  }
}
```

- **Decorador de clase**: recibe el constructor y puede devolver un nuevo constructor o modificarlo.
- **Decorador de miembro de clase** (campo, método, getter, setter): recibe el prototipo (en métodos) o la clase (en estáticos), el nombre y un descriptor, que puede modificar o reemplazar.
- **Decorador de parámetro**: no es parte del decorator estándar actual; se usan en TypeScript experimental.

### Tipos de decoradores (según la propuesta actual)

#### Decorador de clase

```javascript
function conPropiedadEstatica(valor) {
  return function(Constructor) {
    Constructor.version = valor;
  };
}

@conPropiedadEstatica('1.0')
class App {}
console.log(App.version); // '1.0'
```

#### Decorador de método

```javascript
function log(target, propertyKey, descriptor) {
  const original = descriptor.value;
  descriptor.value = function(...args) {
    console.log(`Llamando a ${propertyKey} con`, args);
    const result = original.apply(this, args);
    console.log(`Resultado: ${result}`);
    return result;
  };
  return descriptor;
}

class Calculadora {
  @log
  sumar(a, b) {
    return a + b;
  }
}
```

#### Decorador de campo (field)

En la propuesta actual, los decoradores de campo reciben un contexto con `access` para proveer un getter/setter, y pueden inicializar el campo.

```javascript
function upperCase(target, context) {
  return function(initialValue) {
    return initialValue.toUpperCase();
  };
}

class Usuario {
  @upperCase
  nombre = 'ana';
}
console.log(new Usuario().nombre); // 'ANA'
```

La propuesta ha cambiado varias veces; actualmente se basa en el concepto de **decorator context** que proporciona metadatos y la capacidad de reemplazar el valor.

### Decoradores en TypeScript (experimental)

TypeScript implementa una versión anterior de decoradores (basada en la antigua propuesta de TC39) con la bandera `experimentalDecorators`. Es la más utilizada hoy en día en frameworks.

- **Decorador de clase**: función que recibe el constructor.
- **Decorador de método**: `(target, propertyKey, descriptor)`.
- **Decorador de propiedad**: `(target, propertyKey)`.
- **Decorador de parámetro**: `(target, propertyKey, parameterIndex)`.

```typescript
function log(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  // similar al ejemplo JS
}
```

### Casos de uso reales

- **Registro e inyección de dependencias**: Angular usa decoradores como `@Injectable()`, `@Component()`.
- **Validación**: class-validator con `@IsString()`, `@Min(0)`.
- **Serialización**: class-transformer con `@Expose()`, `@Transform()`.
- **ORM**: TypeORM con `@Entity()`, `@Column()`.
- **AOP (Programación Orientada a Aspectos)**: logging, métricas, autorización.
- **React**: antiguamente se usaban decoradores para conectar componentes a Redux (`@connect`), aunque hoy se prefieren hooks.

### Consideraciones y futuro

- La propuesta ha pasado por múltiples iteraciones y aún no está finalizada.
- Los decoradores actuales en TypeScript pueden tener diferencias con la futura implementación nativa.
- Al ser una característica de metaprogramación, deben usarse con moderación para no oscurecer la lógica.

---

Estos seis archivos proporcionan un conocimiento profundo de conceptos avanzados que extienden las capacidades de JavaScript en entornos web modernos y en la construcción de aplicaciones escalables y mantenibles.

---

