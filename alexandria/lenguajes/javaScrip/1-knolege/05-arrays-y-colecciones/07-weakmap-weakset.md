# Weakmap weakset

## Motivación: referencias débiles

`Map` y `Set` mantienen fuertes referencias a sus claves y valores. Si un objeto se usa como clave en un `Map`, ese objeto no puede ser recolectado por el garbage collector mientras el `Map` exista. Las colecciones débiles resuelven esto manteniendo referencias **débiles**, lo que permite que el GC libere el objeto cuando ya no tenga otras referencias fuertes.

## `WeakMap`

### Características

- Las **claves deben ser objetos** (no primitivos). Si se intenta usar un primitivo como clave, se lanza `TypeError`.
- Los valores pueden ser de cualquier tipo.
- Las claves son mantenidas como referencias débiles: si no hay otra referencia a la clave fuera del WeakMap, el par puede ser eliminado por el GC.
- No es iterable: no tiene métodos `keys()`, `values()`, `entries()`, ni `size`. No se puede recorrer. Esto es intencional: el estado del GC no debe exponerse.
- Métodos: `set(key, value)`, `get(key)`, `has(key)`, `delete(key)`.

### Ejemplo

```javascript
const wm = new WeakMap();
let obj = { id: 1 };
wm.set(obj, "datos secretos");
console.log(wm.get(obj)); // "datos secretos"
obj = null; // el objeto se vuelve inalcanzable y será recolectado junto con su entrada en el WeakMap
```

### Uso principal: datos privados asociados a objetos

Como las entradas desaparecen cuando el objeto clave es recolectado, es ideal para almacenar metadatos ligados al ciclo de vida del objeto.

```javascript
const cacheDeUsuario = new WeakMap();
function procesar(usuario) {
  if (!cacheDeUsuario.has(usuario)) {
    cacheDeUsuario.set(usuario, calcularResultadoCostoso(usuario));
  }
  return cacheDeUsuario.get(usuario);
}
```

Si `usuario` deja de usarse en el resto del programa, la entrada en el WeakMap será eliminada automáticamente, evitando fugas de memoria.

### Emulación de propiedades privadas (antes de `#`)

```javascript
const _privado = new WeakMap();
class MiClase {
  constructor() {
    _privado.set(this, { secreto: 42 });
  }
  getSecreto() {
    return _privado.get(this).secreto;
  }
}
```

Ahora los datos privados están realmente encapsulados y se limpian cuando la instancia se recolecta.

## `WeakSet`

### Características

- Solo almacena **objetos** (no primitivos).
- Referencias débiles a los objetos.
- No iterable, sin `size`.
- Métodos: `add(value)`, `has(value)`, `delete(value)`.

### Ejemplo

```javascript
const ws = new WeakSet();
let elemento = { nombre: "div" };
ws.add(elemento);
console.log(ws.has(elemento)); // true
elemento = null; // el objeto es elegible para recolección
```

### Casos de uso típicos

- **Marcado de objetos**: saber si un objeto ha sido procesado, visitado, o tiene cierto "sello" sin contaminar el objeto.
- **Evitar ciclos de referencias fuertes** en sistemas de eventos o gráficos.

## Comparación colecciones fuertes vs débiles

| Propiedad         | Map / Set            | WeakMap / WeakSet               |
|-------------------|----------------------|----------------------------------|
| Tipo de clave     | Cualquier tipo       | Solo objetos (WeakMap) / objetos (WeakSet) |
| Referencia        | Fuerte               | Débil                            |
| Iterable          | Sí                   | No                               |
| Tamaño (`size`)   | Sí                   | No                               |
| Casos de uso      | Almacenamiento general, caches | Metadatos, datos privados, rastreo de objetos vivos |

## Consideraciones del GC

No hay garantía de cuándo ocurre la recolección. La entrada puede permanecer en la colección débil incluso después de que el objeto se haya vuelto inalcanzable, hasta la siguiente pasada del GC. Por tanto, no se debe escribir código que asuma la eliminación inmediata. La única garantía es que no impedirá la recolección.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Set y map](06-set-y-map.md) | [🏠 Inicio](../index.md) | [Iterables generadores ▶](08-iterables-generadores.md) |
