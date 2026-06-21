# Web storage

El almacenamiento web permite guardar pares clave-valor en el navegador del usuario. Existen dos mecanismos principales: `localStorage` y `sessionStorage`. Ambos forman parte de la API de Web Storage y almacenan solo cadenas. Para objetos complejos, se usa `JSON.stringify` / `JSON.parse`.

## `localStorage`

- Persiste incluso después de cerrar el navegador y reiniciar el sistema.
- El límite suele ser de 5-10 MB por origen (depende del navegador).
- Es accesible desde todas las pestañas y ventanas del mismo origen.
- Es síncrono: bloquea el hilo principal si se guardan grandes cantidades.

### Métodos

```javascript
localStorage.setItem('clave', 'valor');
const valor = localStorage.getItem('clave');
localStorage.removeItem('clave');
localStorage.clear(); // elimina todo
const numItems = localStorage.length;
const claveIndice = localStorage.key(0); // obtiene la clave en la posición
```

### Iteración

```javascript
for (let i = 0; i < localStorage.length; i++) {
  const clave = localStorage.key(i);
  const valor = localStorage.getItem(clave);
  console.log(clave, valor);
}

// Alternativa: Object.entries
Object.entries(localStorage).forEach(([clave, valor]) => {
  // ...
});
```

### Evento `storage`

Cuando `localStorage` se modifica desde **otra página** del mismo origen, se dispara el evento `storage` en las demás pestañas/ventanas. No se dispara en la página que realizó el cambio.

```javascript
window.addEventListener('storage', function(e) {
  console.log(e.key, e.oldValue, e.newValue, e.url);
});
```

## `sessionStorage`

- Los datos duran mientras la pestaña/ventana esté abierta. Si se cierra la pestaña, se pierden.
- Cada pestaña tiene su propio `sessionStorage`, aislado de otras del mismo origen.
- La API es idéntica a `localStorage` (`setItem`, `getItem`, etc.).
- El límite es similar (5-10 MB).
- No lanza el evento `storage` porque los cambios son locales a la pestaña.

## Almacenamiento de objetos

Como solo admite cadenas, hay que serializar:

```javascript
const config = { tema: 'oscuro', idioma: 'es' };
localStorage.setItem('config', JSON.stringify(config));

// Leer
const configGuardada = JSON.parse(localStorage.getItem('config'));
```

Siempre verificar que el valor no sea `null` antes de parsear.

## Cookies

Aunque no son parte de "Web Storage", conviene mencionarlas.

- Se pueden leer/crear mediante `document.cookie`.
- Tienen caducidad, se pueden configurar como `HttpOnly`, `Secure`, `SameSite`.
- Se envían al servidor con cada petición HTTP, por lo que no son eficientes para almacenamiento local grande.

```javascript
document.cookie = 'usuario=Juan; max-age=3600; path=/; secure; samesite=lax';
```

Para manipular cookies de forma más robusta, se recomienda usar bibliotecas o la API `CookieStore` (moderna, aún con soporte limitado).

## IndexedDB

Para almacenamiento más complejo y de mayor volumen, se utiliza **IndexedDB**. Es una base de datos NoSQL, transaccional, que usa índices y permite almacenar objetos JavaScript estructurados, incluso archivos. Es asíncrona (basada en eventos) y puede manejar grandes cantidades de datos.

Ejemplo básico con promesas (usando la API nativa con eventos o la librería `idb` que la envuelve en promesas):

```javascript
// Abrir base de datos
const request = indexedDB.open('MiBase', 1);
request.onupgradeneeded = (e) => {
  const db = e.target.result;
  const store = db.createObjectStore('usuarios', { keyPath: 'id' });
  store.createIndex('nombre', 'nombre', { unique: false });
};

request.onsuccess = (e) => {
  const db = e.target.result;
  const tx = db.transaction('usuarios', 'readwrite');
  const store = tx.objectStore('usuarios');
  store.add({ id: 1, nombre: 'Ana' });
};
```

Con async/await, se recomienda la envoltura `idb` (npm install idb). Para producción, `localforage` es una biblioteca que unifica `localStorage`, `IndexedDB` y `WebSQL` con una API simple.

## Comparación de opciones de almacenamiento

| Característica       | localStorage      | sessionStorage   | Cookies          | IndexedDB          |
|----------------------|-------------------|------------------|------------------|---------------------|
| Capacidad            | ~5-10 MB          | ~5-10 MB         | ~4 KB            | Cientos de MB o más |
| Persistencia         | Indefinida        | Hasta cerrar pestaña | Configurable    | Indefinida          |
| Accesible desde      | Cualquier pestaña | Solo la pestaña  | Cualquier pestaña (mismo dominio) | Cualquier pestaña |
| Envío al servidor    | No                | No               | En cada petición | No                  |
| API                  | Síncrona          | Síncrona         | Síncrona         | Asíncrona (eventos/promesas) |
| Tipos de datos       | Solo cadenas      | Solo cadenas     | Solo cadenas     | Objetos, archivos, etc. |

## Buenas prácticas

- No almacenar información sensible en Web Storage, ya que es vulnerable a XSS.
- Capturar excepciones al escribir en `localStorage/sessionStorage`; en modo incógnito o cuando se supera la cuota, puede lanzar `QuotaExceededError`.
- Utilizar `JSON.stringify/parse` para objetos, recordando que no preserva funciones ni tipos complejos.
- Para datos de configuración o tokens de sesión, considerar cookies seguras (`HttpOnly`, `Secure`, `SameSite`) o `sessionStorage` según corresponda.
- Para grandes volúmenes o búsquedas complejas, `IndexedDB` es la opción adecuada.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Estilos y clases css](09-estilos-y-clases-css.md) | [🏠 Inicio](../index.md) | [Seleccion del dom ▶](../08-dom-y-eventos/01-seleccion-del-dom.md) |
