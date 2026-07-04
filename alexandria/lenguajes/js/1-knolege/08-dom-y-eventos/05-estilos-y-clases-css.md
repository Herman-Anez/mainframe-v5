# Estilos y clases css

## Modificar el atributo `style`

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

### `getComputedStyle(elemento)`

Devuelve el valor computado de todas las propiedades CSS, considerando estilos heredados, hojas de estilo, etc. Es un objeto de solo lectura.

```javascript
const estilo = getComputedStyle(div);
console.log(estilo.fontSize); // '16px' (puede ser la que el navegador calculó)
```

## Clases CSS: `classList`

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

## Manipular hojas de estilos

Aunque es poco común, se pueden manipular las hojas de estilo directamente vía `document.styleSheets`.

```javascript
const sheet = document.styleSheets[0];
sheet.insertRule('body { background: red; }', sheet.cssRules.length);
sheet.deleteRule(index);
```

Sin embargo, para la mayoría de los casos, es más sencillo alternar clases o modificar variables CSS.

## Variables CSS (Custom Properties)

Se pueden definir en CSS (`--mi-color: red;`) y manipular desde JavaScript.

```javascript
// Obtener valor
const color = getComputedStyle(elemento).getPropertyValue('--mi-color');

// Modificar en el elemento (afecta sus descendientes)
elemento.style.setProperty('--mi-color', 'blue');
```

Ideal para temas dinámicos (cambio de paleta).

## Animaciones y transiciones

- Se pueden activar transiciones añadiendo/quitando clases.
- Para ser notificado cuando una transición CSS termina, se usa el evento `transitionend`.
- Para animaciones CSS, `animationend`, `animationstart`, `animationiteration`.

```javascript
element.addEventListener('transitionend', () => {
  console.log('Transición terminada');
});
```

## Rendimiento

- Preferir cambios de clase a modificar múltiples estilos en línea; los cambios de clase pueden ser optimizados por el motor.
- Agrupar lecturas y escrituras de estilos para evitar reflows forzados.
- Al cambiar el diseño (posición, dimensiones) se dispara reflow (costoso). Cambiar `transform` y `opacity` solo causan repaint y pueden ser acelerados por GPU.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Formularios y validacion](04-formularios-y-validacion.md) | [🏠 Inicio](../index.md) | [Web storage ▶](06-web-storage.md) |
