# Manipulacion del dom

## Manipular contenido

### `textContent`

Obtiene o establece el contenido de texto de un nodo y todos sus descendientes. Descarta cualquier etiqueta HTML. Es más rápido que `innerHTML` porque no fuerza el parseo de HTML.

```javascript
const parrafo = document.querySelector('p');
console.log(parrafo.textContent);
parrafo.textContent = 'Nuevo texto <b>no se renderizará como HTML</b>';
```

### `innerHTML`

Obtiene o establece el contenido HTML de un elemento como cadena. Al asignar, parsea el HTML y construye nuevos nodos. Es potente pero puede ser peligroso si se inserta contenido no sanitizado (XSS).

```javascript
const div = document.getElementById('contenido');
div.innerHTML = '<h2>Título</h2><p>Párrafo</p>';
```

- Leer `innerHTML` devuelve una representación serializada que puede no ser idéntica al DOM original (los navegadores pueden ajustar mayúsculas, comillas, etc.).
- Reasignar `innerHTML` destruye todos los nodos hijos previos y sus manejadores de eventos.

### `insertAdjacentHTML(posicion, texto)`

Inserta HTML relativo al elemento sin destruir el contenido existente. Posiciones: `'beforebegin'`, `'afterbegin'`, `'beforeend'`, `'afterend'`.

```javascript
elemento.insertAdjacentHTML('beforeend', '<p>Nuevo párrafo</p>');
```

Es más eficiente que `innerHTML += ...` porque no serializa ni reconstruye todo el contenido previo.

## Creación y eliminación de elementos

### Crear elementos

```javascript
const nuevoDiv = document.createElement('div');
nuevoDiv.textContent = 'Soy un div';
nuevoDiv.classList.add('caja');
```

### Insertar elementos

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

### Clonar nodos

`element.cloneNode(deep?)`: si `deep` es `true`, clona todos los descendientes; si es `false`, solo el elemento.

```javascript
const copia = elemento.cloneNode(true);
```

No copia los event listeners añadidos con `addEventListener`. Los atributos `onclick` sí se copian.

## Manipular atributos y propiedades

- `element.getAttribute('data-id')` / `setAttribute('data-id', '123')` / `removeAttribute()`.
- Para atributos estándar es más eficiente usar las propiedades del DOM: `element.id`, `element.href`, `element.checked`, `element.value`.
- `dataset`: acceso a atributos `data-*` como `element.dataset.id`.
- `classList`: manejo de clases CSS (ver sección de estilos).

## Uso de `DocumentFragment`

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

## Rendimiento y reflows

Cada modificación del DOM puede forzar un reflow (cálculo de layout) y repaint. Para minimizarlo:
- Realizar operaciones de lectura/escritura del DOM de forma agrupada.
- Usar `DocumentFragment` o construir el HTML como cadena y luego insertarlo con `insertAdjacentHTML`.
- Desvincular el elemento del árbol (`display:none` o `visibility:hidden`) antes de hacer múltiples cambios y luego volver a añadirlo.

## Seguridad: Prevención de XSS

Nunca insertar directamente datos provenientes del usuario o de fuentes no confiables con `innerHTML`. En su lugar, usar `textContent` o sanitizar el HTML con bibliotecas como DOMPurify.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Seleccion del dom](05-seleccion-del-dom.md) | [🏠 Inicio](../index.md) | [Eventos y delegacion ▶](07-eventos-y-delegacion.md) |
