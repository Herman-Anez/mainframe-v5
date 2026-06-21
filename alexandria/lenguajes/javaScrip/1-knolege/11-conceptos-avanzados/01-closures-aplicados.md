# Closures aplicados

## Qué es un closure

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

## Patrones prácticos con closures

### 1. Módulo revelador (Revealing Module Pattern)

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

### 2. Fábrica de funciones (Factory Functions)

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

### 3. Memoización

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

### 4. Aplicación parcial y currying manual

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

### 5. Encapsulación de estado en componentes (sin clases)

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

### 6. Manejadores de eventos con datos persistentes

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

### 7. Iteradores con closures

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

## Gestión de memoria y riesgos

- Los closures impiden que el recolector de basura elimine las variables referenciadas mientras la función viva.
- Una fuga de memoria ocurre si se acumulan closures que capturan grandes estructuras de datos y no se liberan (por ejemplo, al añadir indefinidamente listeners con closures que referencian objetos grandes sin limpiarlos).
- En aplicaciones modernas, los closures son omnipresentes (eventos, promesas, callbacks). La clave es limpiar referencias cuando ya no se necesitan (eliminar listeners, anular variables).

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Fullscreen](../10-apis-web/07-fullscreen.md) | [🏠 Inicio](../index.md) | [Currying y composicion ▶](02-currying-y-composicion.md) |
