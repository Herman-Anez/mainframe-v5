# Json

## `JSON.stringify(valor, replacer?, espacio?)`

Convierte un valor JavaScript a una cadena JSON.

- **Tipos soportados**: objetos, arrays, strings, números, booleanos y `null`. Se omiten las funciones, los `undefined` y los símbolos. Los `Date` se convierten a string ISO. Los `NaN` y `Infinity` se convierten en `null`.
- **Objetos con referencias circulares** lanzan `TypeError`.
- **Replacer**: puede ser una función `(clave, valor)` que permite transformar o filtrar propiedades. También puede ser un array de claves (strings) a incluir.
- **Espacio**: número (indentación con espacios) o string (usado como indentación).

```javascript
const data = { nombre: "Ana", edad: 30, password: "secreto" };
const json = JSON.stringify(data, (key, value) => {
  if (key === "password") return undefined; // excluye
  return value;
}, 2);
```

### Método `toJSON` en objetos

Si un objeto tiene un método `toJSON`, `stringify` llama a ese método y serializa el valor retornado en lugar del objeto completo. Útil para personalizar la representación.

```javascript
const evento = {
  titulo: "Conferencia",
  fecha: new Date(),
  toJSON() {
    return { titulo: this.titulo, fecha: this.fecha.toISOString() };
  }
};
JSON.stringify(evento); // {"titulo":"Conferencia","fecha":"2025-01-01T00:00:00.000Z"}
```

## `JSON.parse(texto, reviver?)`

Convierte una cadena JSON a un valor JavaScript.

- Si el JSON es inválido, lanza `SyntaxError`.
- **Reviver**: función `(clave, valor)` que transforma cada valor después de parsear. Se ejecuta recursivamente de lo más interno a lo más externo.

```javascript
const cadena = '{"titulo":"Conferencia","fecha":"2025-01-01T00:00:00.000Z"}';
const obj = JSON.parse(cadena, (key, value) => {
  if (key === "fecha") return new Date(value);
  return value;
});
console.log(obj.fecha instanceof Date); // true
```

## Limitaciones y precauciones

- **Pérdida de información**: no conserva tipos como `undefined`, `function`, `symbol`, `Infinity`, `NaN`.
- **Fechas**: se convierten en cadenas, se necesita reviver para reconstruirlas.
- **Propiedades no enumerables**: no se serializan.
- **Clonación profunda**: se puede simular con `JSON.parse(JSON.stringify(obj))`, pero con las limitaciones mencionadas (no sirve con Map, Set, funciones, etc.).
- **Objetos con prototipo personalizado**: se convierten en objetos planos, perdiendo la herencia.

## Buenas prácticas

- Validar siempre las cadenas JSON de fuentes externas con `JSON.parse` envuelto en `try/catch`.
- Usar `replacer` para excluir datos sensibles.
- Para estructuras complejas, considerar serializadores alternativos o librerías.
- No usar `JSON.stringify` para comparación profunda de objetos debido a la falta de orden garantizado en las claves. `Object.entries` y ordenamiento pueden ayudar.

---

Con estos temas se completa el dominio del manejo de objetos y clases en JavaScript, desde los fundamentos de constructores hasta la serialización moderna. Cada archivo de esta sección proporciona las herramientas para escribir código robusto, eficiente y mantenible.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Destructuring](10-destructuring.md) | [🏠 Inicio](../index.md) | [Arrays basicos ▶](../05-arrays-y-colecciones/01-arrays-basicos.md) |
