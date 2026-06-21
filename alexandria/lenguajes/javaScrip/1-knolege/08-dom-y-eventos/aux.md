## 01-seleccion-del-dom.md

### El Modelo de Objetos del Documento (DOM)

El DOM es una representación en memoria, en forma de árbol, del documento HTML. Cada elemento, atributo, texto y comentario es un **nodo**. JavaScript puede acceder y manipular estos nodos mediante la API del DOM proporcionada por el navegador. El punto de entrada principal es el objeto `document`.

### Selección de elementos

Existen métodos tradicionales y modernos para obtener referencias a nodos del DOM.

#### `document.getElementById(id)`

Devuelve un único elemento cuyo atributo `id` coincide exactamente con la cadena proporcionada. Si no existe, retorna `null`.

```javascript
const principal = document.getElementById('principal');
```

- El `id` debe ser único en el documento. Si hay duplicados, el comportamiento es impredecible (suele devolver el primero encontrado).
- Es muy rápido porque los navegadores mantienen un mapa interno de IDs.

#### `document.getElementsByClassName(nombres)`

Devuelve una **HTMLCollection** viva de elementos que tienen todas las clases especificadas (separadas por espacios). Se puede buscar en todo el documento o en un elemento concreto.

```javascript
const especiales = document.getElementsByClassName('destacado');
const sub = document.getElementById('contenedor').getElementsByClassName('item');
```

- **HTMLCollection viva**: si el DOM cambia, la colección se actualiza automáticamente.
- No es un array; carece de métodos como `forEach` (aunque en navegadores modernos se puede usar `for...of`). Se puede convertir a array con `Array.from()`.

#### `document.getElementsByTagName(tag)`

Devuelve una HTMLCollection viva de elementos con el nombre de etiqueta dado (ej. `'div'`, `'p'`). `*` selecciona todos los elementos.

```javascript
const todosDivs = document.getElementsByTagName('div');
```

#### `document.getElementsByName(nombre)`

Devuelve una **NodeList viva** (en la mayoría de navegadores) de elementos cuyo atributo `name` coincide. Útil para formularios (`<input name="email">`).

```javascript
const generos = document.getElementsByName('genero');
```

#### `document.querySelector(selectorCSS)`

Retorna el **primer** elemento que coincida con el selector CSS proporcionado. Si no hay coincidencia, devuelve `null`.

```javascript
const primerParrafo = document.querySelector('p');
const activo = document.querySelector('.menu .activo');
```

Admite cualquier selector CSS válido, incluyendo pseudoclases (`:hover`, `:first-child`) y selectores de atributo. Es el método más versátil.

#### `document.querySelectorAll(selectorCSS)`

Retorna una **NodeList estática** con todos los elementos que coinciden con el selector CSS.

```javascript
const todosLosItems = document.querySelectorAll('.item');
```

- La NodeList no es viva: no se actualiza si el DOM cambia.
- Puede iterarse con `forEach`, `for...of`, y convertirse a array con `Array.from()`.
- `querySelectorAll` puede llamarse sobre cualquier elemento, limitando la búsqueda a sus descendientes.

```javascript
const contenedor = document.getElementById('lista');
const items = contenedor.querySelectorAll('li');
```

### Colecciones vivas vs estáticas

| Método                           | Tipo de colección | Viva | Iterable moderno |
|----------------------------------|-------------------|------|------------------|
| `getElementsByClassName`         | HTMLCollection    | Sí   | Sí (`for...of`)  |
| `getElementsByTagName`           | HTMLCollection    | Sí   | Sí               |
| `getElementsByName`              | NodeList (viva)   | Sí   | Sí               |
| `querySelectorAll`               | NodeList estática | No   | Sí               |
| `querySelector`                  | Element o null    | N/A  | N/A              |
| `getElementById`                 | Element o null    | N/A  | N/A              |

Las colecciones vivas pueden ser problemáticas si se itera sobre ellas mientras se modifica el DOM: pueden causar bucles infinitos o saltarse elementos. Para evitarlo, se puede hacer una copia estática con `Array.from()` o `querySelectorAll`.

### Búsqueda dentro de un elemento

Todos los métodos excepto `getElementById` pueden invocarse sobre un elemento para restringir la búsqueda a sus descendientes.

```javascript
const seccion = document.getElementById('seccion1');
const items = seccion.getElementsByClassName('item');
```

`getElementById` solo existe en `document`, no en elementos. La razón es que los IDs deben ser únicos en todo el documento.

### Recorriendo el árbol del DOM

A veces no se usan selectores, sino que se navega directamente por las relaciones del árbol.

- **Padre/Hijo**: `parentNode`, `parentElement`, `children`, `firstChild`, `lastChild`, `firstElementChild`, `lastElementChild`.
- **Hermanos**: `nextSibling`, `previousSibling`, `nextElementSibling`, `previousElementSibling`.
- **Todos los nodos**: `childNodes` (incluye texto y comentarios).
- **Solo elementos**: `children` (HTMLCollection viva).

```javascript
const lista = document.querySelector('ul');
const primerHijo = lista.firstElementChild;
const siguiente = primerHijo.nextElementSibling;
```

### Métodos de comprobación

- `matches(selector)`: verifica si el elemento cumple con un selector CSS. Retorna `true`/`false`.
- `closest(selector)`: busca el ancestro más cercano (o el propio elemento) que coincida con el selector. Muy útil para delegación de eventos.
- `contains(node)`: comprueba si un nodo es descendiente de otro.

```javascript
if (elemento.matches('.activo')) { /* ... */ }
const padre = elemento.closest('.contenedor');
```

### Consejos de rendimiento

- Preferir `getElementById` y `querySelector`/`querySelectorAll` para búsquedas puntuales.
- Evitar consultas muy amplias (`document.querySelectorAll('*')`) o selectores complejos en bucles.
- Cachear referencias a elementos del DOM que se usen repetidamente.
- Las colecciones vivas pueden impactar el rendimiento si se abusa de ellas.

---

## 02-manipulacion-del-dom.md

### Manipular contenido

#### `textContent`

Obtiene o establece el contenido de texto de un nodo y todos sus descendientes. Descarta cualquier etiqueta HTML. Es más rápido que `innerHTML` porque no fuerza el parseo de HTML.

```javascript
const parrafo = document.querySelector('p');
console.log(parrafo.textContent);
parrafo.textContent = 'Nuevo texto <b>no se renderizará como HTML</b>';
```

#### `innerHTML`

Obtiene o establece el contenido HTML de un elemento como cadena. Al asignar, parsea el HTML y construye nuevos nodos. Es potente pero puede ser peligroso si se inserta contenido no sanitizado (XSS).

```javascript
const div = document.getElementById('contenido');
div.innerHTML = '<h2>Título</h2><p>Párrafo</p>';
```

- Leer `innerHTML` devuelve una representación serializada que puede no ser idéntica al DOM original (los navegadores pueden ajustar mayúsculas, comillas, etc.).
- Reasignar `innerHTML` destruye todos los nodos hijos previos y sus manejadores de eventos.

#### `insertAdjacentHTML(posicion, texto)`

Inserta HTML relativo al elemento sin destruir el contenido existente. Posiciones: `'beforebegin'`, `'afterbegin'`, `'beforeend'`, `'afterend'`.

```javascript
elemento.insertAdjacentHTML('beforeend', '<p>Nuevo párrafo</p>');
```

Es más eficiente que `innerHTML += ...` porque no serializa ni reconstruye todo el contenido previo.

### Creación y eliminación de elementos

#### Crear elementos

```javascript
const nuevoDiv = document.createElement('div');
nuevoDiv.textContent = 'Soy un div';
nuevoDiv.classList.add('caja');
```

#### Insertar elementos

- `parent.appendChild(nuevo)`: añade al final.
- `parent.insertBefore(nuevo, referencia)`: inserta antes de un hijo existente.
- `parent.replaceChild(nuevo, viejo)`: reemplaza.
- `element.remove()`: elimina el propio elemento (ES5 no lo tiene; en entornos antiguos se usa `parent.removeChild(element)`).
- `parent.append(nodo, ...)` y `parent.prepend(nodo, ...)`: métodos modernos (aceptan múltiples nodos y texto, no funcionan en IE).

```javascript
const lista = document.querySelector('ul');
const li = document.createElement('li');
li.textContent = 'Item nuevo';
lista.append(li); // añade al final
```

#### Clonar nodos

`element.cloneNode(deep?)`: si `deep` es `true`, clona todos los descendientes; si es `false`, solo el elemento.

```javascript
const copia = elemento.cloneNode(true);
```

No copia los event listeners añadidos con `addEventListener`. Los atributos `onclick` sí se copian.

### Manipular atributos y propiedades

- `element.getAttribute('data-id')` / `setAttribute('data-id', '123')` / `removeAttribute()`.
- Para atributos estándar es más eficiente usar las propiedades del DOM: `element.id`, `element.href`, `element.checked`, `element.value`.
- `dataset`: acceso a atributos `data-*` como `element.dataset.id`.
- `classList`: manejo de clases CSS (ver sección de estilos).

### Uso de `DocumentFragment`

Es un nodo contenedor ligero que no forma parte del DOM activo. Muy útil para ensamblar múltiples nodos sin disparar reflows/repaints por cada inserción.

```javascript
const fragment = document.createDocumentFragment();
for (let i = 0; i < 1000; i++) {
  const li = document.createElement('li');
  li.textContent = `Item ${i}`;
  fragment.appendChild(li);
}
lista.appendChild(fragment); // una sola inserción en el DOM
```

### Rendimiento y reflows

Cada modificación del DOM puede forzar un reflow (cálculo de layout) y repaint. Para minimizarlo:
- Realizar operaciones de lectura/escritura del DOM de forma agrupada.
- Usar `DocumentFragment` o construir el HTML como cadena y luego insertarlo con `insertAdjacentHTML`.
- Desvincular el elemento del árbol (`display:none` o `visibility:hidden`) antes de hacer múltiples cambios y luego volver a añadirlo.

### Seguridad: Prevención de XSS

Nunca insertar directamente datos provenientes del usuario o de fuentes no confiables con `innerHTML`. En su lugar, usar `textContent` o sanitizar el HTML con bibliotecas como DOMPurify.

---

## 03-eventos-y-delegacion.md

### Modelo de eventos

El DOM tiene un sistema de eventos basado en la **observación** de sucesos (click, teclado, carga, etc.) en elementos. Para manejar eventos, se registran funciones **listeners** o **handlers** en elementos específicos.

#### Registro de manejadores

Método moderno: `addEventListener`.

```javascript
const boton = document.getElementById('btn');
boton.addEventListener('click', function(event) {
  console.log('Click!', event);
});
```

- Se pueden registrar múltiples manejadores para el mismo evento.
- El tercer argumento opcional puede ser un objeto de opciones (`{ capture, once, passive }`) o un booleano (`useCapture`).

#### Eliminar manejadores: `removeEventListener`

Debe pasarse la misma función (referencia) que se registró.

```javascript
function handler(e) { /* ... */ }
boton.addEventListener('click', handler);
boton.removeEventListener('click', handler);
```

#### Objeto `Event`

El callback recibe un objeto `event` con propiedades útiles:
- `type`: tipo de evento (`'click'`, `'keydown'`, etc.).
- `target`: el elemento que originó el evento (el que fue clicado).
- `currentTarget`: el elemento que tiene el manejador actual (útil en delegación).
- `preventDefault()`: cancela la acción por defecto (ej. seguir un enlace).
- `stopPropagation()`: detiene la propagación del evento a ancestros.
- `stopImmediatePropagation()`: detiene la propagación y evita que otros manejadores en el mismo elemento se ejecuten.

#### Fases del evento: Captura y Burbujeo

Cuando se dispara un evento en un elemento, pasa por tres fases:
1. **Fase de captura**: el evento desciende desde el `document` hasta el `target`.
2. **Fase objetivo**: el evento llega al `target`.
3. **Fase de burbujeo**: el evento asciende desde el `target` hasta el `document`.

Por defecto, los manejadores se registran en la fase de burbujeo. Para capturarlos en la fase de captura, se usa `addEventListener(..., true)` o `{ capture: true }`.

### Delegación de eventos

Técnica que aprovecha el burbujeo para manejar eventos en un ancestro común, en lugar de adjuntar manejadores a cada elemento hijo. Es esencial para listas dinámicas.

```javascript
const lista = document.getElementById('lista');
lista.addEventListener('click', function(event) {
  const li = event.target.closest('li');
  if (!li) return; // no se hizo clic en un <li>
  console.log('Clic en', li.textContent);
});
```

Ventajas:
- Menos manejadores en memoria.
- Funciona automáticamente para elementos añadidos después de registrar el manejador.
- Código más sencillo de mantener.

El `closest` permite asegurarse de que el clic ocurrió en un `li` o en un descendiente del `li`.

#### `event.target` vs `event.currentTarget`

En delegación:
- `event.target`: el elemento más anidado que recibió el evento (ej. un `<span>` dentro del `<li>`).
- `event.currentTarget`: el elemento donde se registró el manejador (la `lista`).

#### Eventos que no burbujean

Algunos eventos, como `focus`, `blur`, `mouseenter`, `mouseleave`, no burbujean. Para delegarlos hay que usar sus versiones que sí burbujean: `focusin`, `focusout` (pero no todos los navegadores antiguos las soportan; hoy en día son estándar). `mouseenter`/`mouseleave` no burbujean; `mouseover`/`mouseout` sí.

### Opciones modernas de `addEventListener`

- **`once: true`**: el manejador se ejecuta una sola vez y se autoelimina.
- **`passive: true`**: indica que el manejador nunca llamará a `preventDefault()`. Mejora el rendimiento en eventos como `scroll` y `touchstart`.
- **`capture: true`**: registra en fase de captura.
- **`signal`**: un `AbortSignal` para eliminar el manejador fácilmente.

```javascript
const controller = new AbortController();
document.addEventListener('click', handler, { signal: controller.signal });
// Luego:
controller.abort(); // elimina el manejador
```

### Prevención de la acción por defecto y propagación

- `event.preventDefault()`: cancela el comportamiento nativo asociado al evento (ej. navegación de un enlace, envío de formulario).
- `event.stopPropagation()`: evita que el evento continúe propagándose a ancestros. Se debe usar con moderación, ya que puede romper delegación o otros manejadores.
- `event.stopImmediatePropagation()`: además de detener la propagación, evita que otros manejadores del mismo elemento se ejecuten.

### Manejo de teclado y formularios

- `keydown`, `keypress`, `keyup`: en `event.key` se obtiene la tecla presionada.
- `input`: se dispara cada vez que cambia el valor de un `<input>`, `<select>`, `<textarea>`. Alternativa a `keydown` para campos de texto.
- `change`: se dispara al cambiar el valor y perder el foco (para inputs) o al seleccionar una opción (select).

---

## 04-formularios-y-validacion.md

### Acceso a formularios y elementos

El DOM ofrece colecciones para acceder a formularios:

```javascript
const primerForm = document.forms[0]; // o document.forms['nombreForm']
const campo = form.elements['email']; // o form.email
```

Cada formulario tiene una propiedad `elements` que es una colección de todos los campos (inputs, selects, textareas, buttons, etc.).

### Eventos del formulario

- **`submit`**: se dispara al enviar el formulario (ya sea por botón `submit` o por `Enter` en un campo). Es donde se valida. Se puede cancelar con `preventDefault()` para manejar el envío con JavaScript (AJAX).
- **`reset`**: se dispara al presionar un botón de tipo `reset`.
- **`input`**: en cada cambio de valor de un campo.
- **`change`**: al cambiar y perder el foco.
- **`focus` / `blur`** y sus versiones burbujeantes `focusin`/`focusout`.

### Propiedades importantes de los campos

- `value`: contenido actual (string).
- `checked`: para radio/checkbox (booleano).
- `selectedOptions`: para `<select multiple>`.
- `disabled`: deshabilita el campo.
- `readOnly`: solo lectura.
- `name`: nombre del campo usado en el envío.

### Validación del lado del cliente

#### Validación con la API de Constraint Validation

Cada campo de formulario implementa la interfaz `ValidityState`, expuesta mediante la propiedad `validity`. Además, métodos como `checkValidity()` y `reportValidity()` permiten validar.

Atributos HTML que activan validación nativa:
- `required`: campo obligatorio.
- `minlength`, `maxlength`: longitud mínima/máxima para texto.
- `min`, `max`: valores numéricos.
- `pattern`: expresión regular.
- `type`: email, url, number, date, etc. ya incluyen validación de formato.

```html
<input type="email" name="correo" required>
<input type="number" min="18" max="99">
<input type="text" pattern="[A-Z]{3}-\d{4}">
```

#### Estados de validez (`validity`)

La propiedad `validity` es un objeto con booleanos:
- `valueMissing`: está vacío pero es `required`.
- `typeMismatch`: no cumple el formato del tipo (ej. email).
- `patternMismatch`: no coincide con el `pattern`.
- `tooShort` / `tooLong`: `minlength` / `maxlength`.
- `rangeUnderflow` / `rangeOverflow`: `min` / `max`.
- `badInput`: el navegador no puede interpretar el valor (ej. número mal formado).
- `stepMismatch`: no cumple con el paso (`step`).
- `valid`: `true` si no hay ningún error.

#### Personalizar mensajes de error

Se puede usar `setCustomValidity('mensaje')` para forzar un error personalizado. Si se pasa cadena vacía, se limpia.

```javascript
campo.addEventListener('input', function() {
  if (campo.value === 'admin') {
    campo.setCustomValidity('El nombre "admin" está reservado');
  } else {
    campo.setCustomValidity('');
  }
});
```

#### Validación en el evento `submit`

```javascript
formulario.addEventListener('submit', function(event) {
  if (!formulario.checkValidity()) {
    event.preventDefault();
    // Opcional: mostrar burbujas de error con reportValidity()
    formulario.reportValidity();
  }
  // Si es válido, proceder con envío por fetch o similar
});
```

### Envío con JavaScript (AJAX)

Para enviar datos sin recargar la página:

```javascript
formulario.addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = new FormData(formulario);
  try {
    const response = await fetch('/api/registro', {
      method: 'POST',
      body: formData // FormData establece el Content-Type adecuado
    });
    const resultado = await response.json();
    // manejar resultado
  } catch (error) {
    console.error('Error', error);
  }
});
```

`FormData` también puede construirse desde cero: `new FormData(); formData.append('clave', 'valor');`

### Buenas prácticas

- Siempre validar del lado del cliente y del lado del servidor.
- No confiar solo en la validación HTML5; implementar también lógica en JavaScript para mayor control visual y compatibilidad.
- Usar `reportValidity()` en lugar de `checkValidity()` para mostrar al usuario el primer error.
- Al usar `FormData`, recordar que los campos `disabled` no se incluyen.
- Deshabilitar el botón de envío durante el envío para evitar duplicados.

---

## 05-estilos-y-clases-css.md

### Modificar el atributo `style`

Cada elemento tiene una propiedad `style` que es un objeto `CSSStyleDeclaration`. Permite leer y modificar estilos en línea.

```javascript
const div = document.querySelector('.caja');
div.style.backgroundColor = 'blue';
div.style.fontSize = '16px';
div.style.marginTop = '10px';
```

- Las propiedades CSS con guiones se escriben en camelCase (`background-color` → `backgroundColor`).
- Asignar un valor modifica el estilo en línea del elemento, que tiene la mayor especificidad (salvo `!important`).
- Para eliminar un estilo en línea, se puede asignar `''` o usar `removeProperty('propiedad')`.
- La propiedad `style.cssText` permite establecer todo el estilo en línea en una cadena, sobreescribiendo los estilos existentes.
- Leer `div.style.color` solo devuelve el estilo en línea; no los estilos aplicados mediante CSS externo. Para eso se usa `getComputedStyle`.

#### `getComputedStyle(elemento)`

Devuelve el valor computado de todas las propiedades CSS, considerando estilos heredados, hojas de estilo, etc. Es un objeto de solo lectura.

```javascript
const estilo = getComputedStyle(div);
console.log(estilo.fontSize); // '16px' (puede ser la que el navegador calculó)
```

### Clases CSS: `classList`

La propiedad `classList` proporciona una interfaz más potente que `className` (que es un string).

- `classList.add('clase1', 'clase2')`: añade clases.
- `classList.remove('clase')`: elimina.
- `classList.toggle('clase', force?)`: alterna la clase; si `force` es `true`, la añade; si `false`, la elimina.
- `classList.contains('clase')`: comprueba existencia.
- `classList.replace('antigua', 'nueva')`: reemplaza una clase.

```javascript
elemento.classList.add('activo');
elemento.classList.toggle('visible', someCondition);
```

### Manipular hojas de estilos

Aunque es poco común, se pueden manipular las hojas de estilo directamente vía `document.styleSheets`.

```javascript
const sheet = document.styleSheets[0];
sheet.insertRule('body { background: red; }', sheet.cssRules.length);
sheet.deleteRule(index);
```

Sin embargo, para la mayoría de los casos, es más sencillo alternar clases o modificar variables CSS.

### Variables CSS (Custom Properties)

Se pueden definir en CSS (`--mi-color: red;`) y manipular desde JavaScript.

```javascript
// Obtener valor
const color = getComputedStyle(elemento).getPropertyValue('--mi-color');

// Modificar en el elemento (afecta sus descendientes)
elemento.style.setProperty('--mi-color', 'blue');
```

Ideal para temas dinámicos (cambio de paleta).

### Animaciones y transiciones

- Se pueden activar transiciones añadiendo/quitando clases.
- Para ser notificado cuando una transición CSS termina, se usa el evento `transitionend`.
- Para animaciones CSS, `animationend`, `animationstart`, `animationiteration`.

```javascript
element.addEventListener('transitionend', () => {
  console.log('Transición terminada');
});
```

### Rendimiento

- Preferir cambios de clase a modificar múltiples estilos en línea; los cambios de clase pueden ser optimizados por el motor.
- Agrupar lecturas y escrituras de estilos para evitar reflows forzados.
- Al cambiar el diseño (posición, dimensiones) se dispara reflow (costoso). Cambiar `transform` y `opacity` solo causan repaint y pueden ser acelerados por GPU.

---

## 06-web-storage.md

El almacenamiento web permite guardar pares clave-valor en el navegador del usuario. Existen dos mecanismos principales: `localStorage` y `sessionStorage`. Ambos forman parte de la API de Web Storage y almacenan solo cadenas. Para objetos complejos, se usa `JSON.stringify` / `JSON.parse`.

### `localStorage`

- Persiste incluso después de cerrar el navegador y reiniciar el sistema.
- El límite suele ser de 5-10 MB por origen (depende del navegador).
- Es accesible desde todas las pestañas y ventanas del mismo origen.
- Es síncrono: bloquea el hilo principal si se guardan grandes cantidades.

#### Métodos

```javascript
localStorage.setItem('clave', 'valor');
const valor = localStorage.getItem('clave');
localStorage.removeItem('clave');
localStorage.clear(); // elimina todo
const numItems = localStorage.length;
const claveIndice = localStorage.key(0); // obtiene la clave en la posición
```

#### Iteración

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

#### Evento `storage`

Cuando `localStorage` se modifica desde **otra página** del mismo origen, se dispara el evento `storage` en las demás pestañas/ventanas. No se dispara en la página que realizó el cambio.

```javascript
window.addEventListener('storage', function(e) {
  console.log(e.key, e.oldValue, e.newValue, e.url);
});
```

### `sessionStorage`

- Los datos duran mientras la pestaña/ventana esté abierta. Si se cierra la pestaña, se pierden.
- Cada pestaña tiene su propio `sessionStorage`, aislado de otras del mismo origen.
- La API es idéntica a `localStorage` (`setItem`, `getItem`, etc.).
- El límite es similar (5-10 MB).
- No lanza el evento `storage` porque los cambios son locales a la pestaña.

### Almacenamiento de objetos

Como solo admite cadenas, hay que serializar:

```javascript
const config = { tema: 'oscuro', idioma: 'es' };
localStorage.setItem('config', JSON.stringify(config));

// Leer
const configGuardada = JSON.parse(localStorage.getItem('config'));
```

Siempre verificar que el valor no sea `null` antes de parsear.

### Cookies

Aunque no son parte de "Web Storage", conviene mencionarlas.

- Se pueden leer/crear mediante `document.cookie`.
- Tienen caducidad, se pueden configurar como `HttpOnly`, `Secure`, `SameSite`.
- Se envían al servidor con cada petición HTTP, por lo que no son eficientes para almacenamiento local grande.

```javascript
document.cookie = 'usuario=Juan; max-age=3600; path=/; secure; samesite=lax';
```

Para manipular cookies de forma más robusta, se recomienda usar bibliotecas o la API `CookieStore` (moderna, aún con soporte limitado).

### IndexedDB

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

### Comparación de opciones de almacenamiento

| Característica       | localStorage      | sessionStorage   | Cookies          | IndexedDB          |
|----------------------|-------------------|------------------|------------------|---------------------|
| Capacidad            | ~5-10 MB          | ~5-10 MB         | ~4 KB            | Cientos de MB o más |
| Persistencia         | Indefinida        | Hasta cerrar pestaña | Configurable    | Indefinida          |
| Accesible desde      | Cualquier pestaña | Solo la pestaña  | Cualquier pestaña (mismo dominio) | Cualquier pestaña |
| Envío al servidor    | No                | No               | En cada petición | No                  |
| API                  | Síncrona          | Síncrona         | Síncrona         | Asíncrona (eventos/promesas) |
| Tipos de datos       | Solo cadenas      | Solo cadenas     | Solo cadenas     | Objetos, archivos, etc. |

### Buenas prácticas

- No almacenar información sensible en Web Storage, ya que es vulnerable a XSS.
- Capturar excepciones al escribir en `localStorage/sessionStorage`; en modo incógnito o cuando se supera la cuota, puede lanzar `QuotaExceededError`.
- Utilizar `JSON.stringify/parse` para objetos, recordando que no preserva funciones ni tipos complejos.
- Para datos de configuración o tokens de sesión, considerar cookies seguras (`HttpOnly`, `Secure`, `SameSite`) o `sessionStorage` según corresponda.
- Para grandes volúmenes o búsquedas complejas, `IndexedDB` es la opción adecuada.

---

Estos seis archivos cubren a fondo la interacción con el DOM y el almacenamiento en el navegador, desde la selección precisa de elementos hasta la validación de formularios y la persistencia de datos, formando una base sólida para el desarrollo frontend.

---

