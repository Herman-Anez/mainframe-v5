# Destructuring

## Desestructuración de arrays

Asigna elementos de un array a variables discretas en una sola sentencia.

```javascript
const [a, b, c] = [1, 2, 3];
console.log(a, b, c); // 1 2 3
```

- **Ignorar elementos**: `const [primero, , tercero] = arr;`
- **Valores por defecto**: si el elemento es `undefined`, se aplica el valor por defecto.
  ```javascript
  const [x = 0, y = 0] = [5];
  console.log(x, y); // 5, 0
  ```
- **Rest pattern**: `...` recoge el resto de elementos en un array.
  ```javascript
  const [cabeza, ...cola] = [1,2,3,4];
  console.log(cabeza, cola); // 1, [2,3,4]
  ```
  El rest debe ser el último elemento.

## Desestructuración de objetos

Asigna propiedades de un objeto a variables con el mismo nombre, o renombradas.

```javascript
const { nombre, edad } = { nombre: "Ana", edad: 30 };
console.log(nombre, edad); // Ana 30
```

- **Alias**: `const { nombre: n } = obj;` asigna la propiedad `nombre` a la variable `n`.
- **Valores por defecto**: `const { telefono = "N/A" } = obj;`
- **Rest**: `const { a, ...resto } = { a:1, b:2, c:3 };` (resto será `{ b:2, c:3 }`). El rest en objetos (ES2018) recoge las propiedades restantes en un nuevo objeto.
- **Anidamiento**:
  ```javascript
  const { dir: { calle } } = { dir: { calle: "Calle Mayor", numero: 10 } };
  console.log(calle); // "Calle Mayor"
  ```

### Desestructuración en parámetros de función

Muy útil para opciones:

```javascript
function configurar({ color = 'azul', modo = 'estricto' } = {}) {
  // ...
}
configurar({ color: 'rojo' });
```

Si no se proporciona argumento, el valor por defecto `= {}` evita un error al desestructurar `undefined`.

## Swapping y aplicaciones avanzadas

Intercambiar variables sin variable temporal:

```javascript
let a = 1, b = 2;
[a, b] = [b, a];
```

Retornos múltiples (simulados con arrays/objetos):

```javascript
function division(a, b) {
  return [a / b, a % b];
}
const [cociente, resto] = division(10, 3);
```

## Desestructuración con iterables

Cualquier iterable puede ser desestructurado como array:

```javascript
const [primero, segundo] = new Set([10, 20, 30]);
```

## Desestructuración con expresiones y objetos anidados

Permite extraer valores de estructuras profundas de forma concisa, aunque la legibilidad puede verse afectada si se abusa.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Metodos de object](09-metodos-de-object.md) | [🏠 Inicio](../index.md) | [Json ▶](11-json.md) |
