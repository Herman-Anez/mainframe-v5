# Async await

## Sintaxis y semántica

`async`/`await` es azúcar sintáctico sobre promesas que permite escribir código asíncrono con un estilo síncrono, más legible y fácil de mantener.

- **`async`**: antepuesto a una función (declaración, expresión, flecha, método de clase), hace que la función retorne siempre una promesa. Si la función retorna un valor, la promesa se resuelve con ese valor; si lanza una excepción, la promesa se rechaza con ese error.
- **`await`**: solo puede usarse dentro de funciones `async`. Pausa la ejecución de la función hasta que la promesa a su derecha se asiente. Si la promesa se resuelve, `await` devuelve el valor resuelto. Si se rechaza, `await` lanza una excepción que puede ser capturada con `try/catch`.

```javascript
async function obtenerUsuario(id) {
  const respuesta = await fetch(`/api/usuarios/${id}`);
  if (!respuesta.ok) throw new Error('Error en la petición');
  return respuesta.json();
}

// Uso
obtenerUsuario(1).then(usuario => console.log(usuario));
```

## Manejo de errores

Se usa `try/catch` alrededor de las expresiones `await`:

```javascript
async function main() {
  try {
    const datos = await fetch('/api');
    // ...
  } catch (error) {
    console.error('Falló:', error);
  }
}
```

También se puede capturar el rechazo en el nivel de llamada agregando `.catch` a la función async invocada, ya que devuelve una promesa.

## Ejecución secuencial vs paralela

- **Secuencial**: cada `await` espera a que termine la operación anterior.
  ```javascript
  const a = await obtenerA();
  const b = await obtenerB(); // no empieza hasta que termine a
  ```
- **Paralela**: se inician las promesas sin `await` y luego se espera a todas.
  ```javascript
  const promesaA = obtenerA();
  const promesaB = obtenerB();
  const [a, b] = await Promise.all([promesaA, promesaB]);
  ```
  Esto es fundamental para reducir tiempos de carga.

## Top-level await (módulos ES)

En módulos ES, `await` puede usarse fuera de una función `async`, en el nivel superior del módulo. Esto hace que el módulo espere la resolución de la promesa antes de completar su carga. Disponible en navegadores y Node.js.

```javascript
const config = await fetch('/config.json').then(r => r.json());
export const apiUrl = config.apiUrl;
```

## Iteración asíncrona y `for await...of`

Se puede iterar sobre iterables asíncronos (que implementan `Symbol.asyncIterator`):

```javascript
async function* generarPáginas(url) {
  let pagina = 1;
  while (true) {
    const res = await fetch(`${url}?page=${pagina}`);
    const datos = await res.json();
    if (datos.length === 0) break;
    yield datos;
    pagina++;
  }
}

for await (const pagina of generarPáginas('/api/items')) {
  console.log(pagina);
}
```

## Consideraciones y buenas prácticas

- No marcar como `async` una función que no usa `await`; añade una promesa innecesaria.
- No abusar de `await` secuencial cuando se puede ejecutar en paralelo.
- En un `.forEach` o `map` asíncrono, usar `Promise.all` en lugar de esperar en cada iteración.
- Al combinar `async/await` con métodos de arrays, recordar que `async (item) => ...` devuelve promesas. `arr.map(async ...)` devuelve un array de promesas, por lo que se debe envolver con `Promise.all` si se necesita esperar a todas.
- `await` puede usarse con cualquier "thenable" (objeto con método `then`), no solo promesas nativas.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Promesas](02-promesas.md) | [🏠 Inicio](../index.md) | [Fetch API ▶](04-fetch-api.md) |
