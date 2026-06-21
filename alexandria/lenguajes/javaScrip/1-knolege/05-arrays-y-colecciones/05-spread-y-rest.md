# Spread y rest

## Dos caras del mismo operador `...`

El operador `...` tiene dos funciones opuestas según el contexto:

- **Spread (propagación):** expande los elementos de un iterable (o las propiedades de un objeto) en lugares donde se esperan múltiples elementos (argumentos de función, literales de array, literales de objeto).
- **Rest (agrupación):** recolecta los elementos restantes de una estructura (desestructuración de arrays/objetos, parámetros de función) en una nueva variable.

## Operador Spread

### En arrays

Expande un iterable en los lugares donde se esperan elementos de un array:

```javascript
const numeros = [1, 2, 3];
console.log(...numeros); // 1 2 3 (equivale a console.log(1,2,3))
```

**Clonación superficial de arrays:**
```javascript
const original = [1, 2, 3];
const copia = [...original];
copia[0] = 99; // original sigue [1,2,3]
```

**Combinación (concatenación) de arrays:**
```javascript
const a = [1, 2], b = [3, 4];
const fusion = [...a, ...b]; // [1,2,3,4]
```

**Insertar elementos en cualquier posición:**
```javascript
const inicio = [1, 2];
const completo = [0, ...inicio, 3, 4]; // [0,1,2,3,4]
```

**Spread sobre strings (iterables):**
```javascript
const caracteres = [..."Hola"]; // ["H", "o", "l", "a"]
```

### En objetos (ES2018)

Las propiedades enumerables propias de un objeto fuente se copian en un nuevo objeto literal. Se comporta como `Object.assign({}, obj)`, pero con una sintaxis más limpia.

```javascript
const base = { a: 1, b: 2 };
const copia = { ...base };          // { a:1, b:2 }
const fusion = { ...base, c: 3 };   // { a:1, b:2, c:3 }
```

**Sobrescritura:** las propiedades posteriores pisan a las anteriores.
```javascript
const obj = { ...base, b: 99 }; // { a:1, b:99 }
```

**Combinación con otras propiedades:**
```javascript
const config = { timeout: 2000, cache: true };
const final = { ...config, url: "/api" };
```

**Precaución:** la copia es superficial. Los objetos anidados se comparten por referencia. Para clonación profunda se necesitan técnicas adicionales (structuredClone, recursividad, JSON.parse/stringify con precaución).

### Spread en llamadas a función

Permite pasar un array como argumentos individuales:

```javascript
const valores = [10, 20, 30];
Math.max(...valores); // 30
```

También se puede combinar con argumentos posicionales:
```javascript
function suma(a, b, c) { return a + b + c; }
suma(...[1, 2], 3); // 6
```

## Operador Rest (parámetros rest y desestructuración)

### Parámetros rest en funciones

Agrupa un número variable de argumentos en un verdadero array:

```javascript
function log(mensaje, ...tags) {
  console.log(mensaje, tags);
}
log("Error", "red", "critical"); // "Error" ["red", "critical"]
```

- Solo puede haber un parámetro rest y debe ser el último.
- Siempre es un array (nunca el objeto `arguments`).
- No está ligado a `arguments` (en modo estricto y en flechas).

### Rest en desestructuración de arrays

Recoge los elementos restantes después de extraer algunos:

```javascript
const [primero, segundo, ...resto] = [1, 2, 3, 4, 5];
console.log(primero); // 1
console.log(resto);   // [3, 4, 5]
```

El rest debe ser el último elemento. Si no hay más elementos, `resto` será un array vacío.

### Rest en desestructuración de objetos (ES2018)

Agrupa las propiedades no extraídas en un nuevo objeto:

```javascript
const { a, b, ...resto } = { a: 1, b: 2, c: 3, d: 4 };
console.log(a);     // 1
console.log(resto); // { c: 3, d: 4 }
```

Al igual que en arrays, debe ser la última captura y recoge solo las propiedades enumerables propias.

## Casos de uso y patrones

- **Inmutabilidad**: al crear nuevas copias en lugar de mutar.
- **Reducción de mutaciones**: `this.setState({ ...state, nuevo: valor })` en React.
- **Conversión de iterables**: `[...nodeList]` para obtener un verdadero array.
- **Eliminación selectiva de propiedades**: `const { password, ...safe } = user;`.
- **Defaults combinados con rest**: `function f(a, ...rest) { }`.

## Limitaciones

- Spread en objetos requiere ES2018+ (ampliamente soportado actualmente).
- No es posible copiar getters/setters; solo se copia el valor de la propiedad (el descriptor se pierde). Para clonar con descriptores exactos, usar `Object.getOwnPropertyDescriptors`.
- El spread no funciona sobre objetos no iterables (objetos planos no son iterables) excepto en literales de objeto, donde spread está permitido para propiedades propias.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Metodos de busqueda](04-metodos-de-busqueda.md) | [🏠 Inicio](../index.md) | [Set y map ▶](06-set-y-map.md) |
