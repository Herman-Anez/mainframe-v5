# Seleccion del dom

## El Modelo de Objetos del Documento (DOM)

El DOM es una representación en memoria, en forma de árbol, del documento HTML. Cada elemento, atributo, texto y comentario es un **nodo**. JavaScript puede acceder y manipular estos nodos mediante la API del DOM proporcionada por el navegador. El punto de entrada principal es el objeto `document`.

## Selección de elementos

Existen métodos tradicionales y modernos para obtener referencias a nodos del DOM.

### `document.getElementById(id)`

Devuelve un único elemento cuyo atributo `id` coincide exactamente con la cadena proporcionada. Si no existe, retorna `null`.

```javascript
const principal = document.getElementById('principal');
```

- El `id` debe ser único en el documento. Si hay duplicados, el comportamiento es impredecible (suele devolver el primero encontrado).
- Es muy rápido porque los navegadores mantienen un mapa interno de IDs.

### `document.getElementsByClassName(nombres)`

Devuelve una **HTMLCollection** viva de elementos que tienen todas las clases especificadas (separadas por espacios). Se puede buscar en todo el documento o en un elemento concreto.

```javascript
const especiales = document.getElementsByClassName('destacado');
const sub = document.getElementById('contenedor').getElementsByClassName('item');
```

- **HTMLCollection viva**: si el DOM cambia, la colección se actualiza automáticamente.
- No es un array; carece de métodos como `forEach` (aunque en navegadores modernos se puede usar `for...of`). Se puede convertir a array con `Array.from()`.

### `document.getElementsByTagName(tag)`

Devuelve una HTMLCollection viva de elementos con el nombre de etiqueta dado (ej. `'div'`, `'p'`). `*` selecciona todos los elementos.

```javascript
const todosDivs = document.getElementsByTagName('div');
```

### `document.getElementsByName(nombre)`

Devuelve una **NodeList viva** (en la mayoría de navegadores) de elementos cuyo atributo `name` coincide. Útil para formularios (`<input name="email">`).

```javascript
const generos = document.getElementsByName('genero');
```

### `document.querySelector(selectorCSS)`

Retorna el **primer** elemento que coincida con el selector CSS proporcionado. Si no hay coincidencia, devuelve `null`.

```javascript
const primerParrafo = document.querySelector('p');
const activo = document.querySelector('.menu .activo');
```

Admite cualquier selector CSS válido, incluyendo pseudoclases (`:hover`, `:first-child`) y selectores de atributo. Es el método más versátil.

### `document.querySelectorAll(selectorCSS)`

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

## Colecciones vivas vs estáticas

| Método                           | Tipo de colección | Viva | Iterable moderno |
|----------------------------------|-------------------|------|------------------|
| `getElementsByClassName`         | HTMLCollection    | Sí   | Sí (`for...of`)  |
| `getElementsByTagName`           | HTMLCollection    | Sí   | Sí               |
| `getElementsByName`              | NodeList (viva)   | Sí   | Sí               |
| `querySelectorAll`               | NodeList estática | No   | Sí               |
| `querySelector`                  | Element o null    | N/A  | N/A              |
| `getElementById`                 | Element o null    | N/A  | N/A              |

Las colecciones vivas pueden ser problemáticas si se itera sobre ellas mientras se modifica el DOM: pueden causar bucles infinitos o saltarse elementos. Para evitarlo, se puede hacer una copia estática con `Array.from()` o `querySelectorAll`.

## Búsqueda dentro de un elemento

Todos los métodos excepto `getElementById` pueden invocarse sobre un elemento para restringir la búsqueda a sus descendientes.

```javascript
const seccion = document.getElementById('seccion1');
const items = seccion.getElementsByClassName('item');
```

`getElementById` solo existe en `document`, no en elementos. La razón es que los IDs deben ser únicos en todo el documento.

## Recorriendo el árbol del DOM

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

## Métodos de comprobación

- `matches(selector)`: verifica si el elemento cumple con un selector CSS. Retorna `true`/`false`.
- `closest(selector)`: busca el ancestro más cercano (o el propio elemento) que coincida con el selector. Muy útil para delegación de eventos.
- `contains(node)`: comprueba si un nodo es descendiente de otro.

```javascript
if (elemento.matches('.activo')) { /* ... */ }
const padre = elemento.closest('.contenedor');
```

## Consejos de rendimiento

- Preferir `getElementById` y `querySelector`/`querySelectorAll` para búsquedas puntuales.
- Evitar consultas muy amplias (`document.querySelectorAll('*')`) o selectores complejos en bucles.
- Cachear referencias a elementos del DOM que se usen repetidamente.
- Las colecciones vivas pueden impactar el rendimiento si se abusa de ellas.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Web storage](../07-this-y-contexto/10-web-storage.md) | [🏠 Inicio](../index.md) | [Manipulacion del dom ▶](02-manipulacion-del-dom.md) |
