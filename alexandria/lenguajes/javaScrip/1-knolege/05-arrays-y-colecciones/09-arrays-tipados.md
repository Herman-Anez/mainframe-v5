# Arrays tipados

## Binary Data y ArrayBuffer

JavaScript tradicional no maneja bien datos binarios crudos. Para trabajar con flujos de bytes (WebGL, archivos, redes) se introdujeron los **ArrayBuffer** y los **Typed Arrays**.

### `ArrayBuffer`

Es un bloque de memoria binario de tamaño fijo (en bytes). No se puede manipular directamente; se accede a través de vistas.

```javascript
const buffer = new ArrayBuffer(16); // 16 bytes, todos a 0
console.log(buffer.byteLength); // 16
```

No se puede cambiar su tamaño. Para transferirlo entre hilos se puede usar `transfer` (en ciertos contextos) o se copia.

## Vistas: Typed Arrays

Son arrays que proporcionan una vista estructurada sobre un ArrayBuffer. Definen un tipo de dato numérico concreto (entero, float, etc.) y un tamaño fijo. Todos heredan de `TypedArray` (prototipo interno).

### Tipos disponibles

- **Enteros con signo:** `Int8Array`, `Int16Array`, `Int32Array`, `BigInt64Array`
- **Enteros sin signo:** `Uint8Array`, `Uint16Array`, `Uint32Array`, `BigUint64Array`
- **Punto flotante:** `Float32Array`, `Float64Array`
- **Entero sin signo clampado a 0-255:** `Uint8ClampedArray` (útil para colores)

Cada uno representa elementos del tamaño respectivo (8 bits a 64 bits).

### Creación

- **Con longitud:** `const arr = new Uint8Array(8);` crea un buffer de 8 bytes y lo asigna.
- **A partir de un array:** `new Uint8Array([1,2,3]);`
- **A partir de otro TypedArray:** copia los valores.
- **Con un ArrayBuffer:** `new Uint8Array(buffer, byteOffset?, length?)` para crear una vista sobre una porción del buffer.

```javascript
const buffer = new ArrayBuffer(8);
const vista32 = new Int32Array(buffer); // 2 elementos (8 bytes / 4 bytes por elemento)
vista32[0] = 42;
console.log(new Uint8Array(buffer)[0]); // puedes ver el byte bajo
```

### Propiedades y métodos

- `buffer`: el ArrayBuffer subyacente.
- `byteLength`: tamaño en bytes.
- `byteOffset`: desplazamiento del inicio del buffer (si la vista no empieza al inicio).
- `length`: número de elementos (no bytes).
- Métodos heredados de `TypedArray`: muchos similares a `Array`, pero sin mutar (no pueden cambiar tamaño; no tienen `push`, `pop`, `splice`, etc.). Sí tienen `map`, `filter`, `slice`, `subarray`, `set`, `reverse`, `sort`, etc.
- `set(array, offset)`: copia valores desde un array o TypedArray en la posición dada.

### `DataView`

Permite leer y escribir múltiples tipos numéricos en diferentes offsets dentro de un mismo ArrayBuffer, con control sobre el **endianness** (orden de bytes).

```javascript
const buffer = new ArrayBuffer(4);
const view = new DataView(buffer);
view.setInt16(0, 256, true); // little-endian
console.log(view.getUint8(0)); // 0
console.log(view.getUint8(1)); // 1
```

Métodos: `getInt8`, `getUint16`, `setFloat32`, etc., con parámetro opcional `littleEndian`.

## Casos de uso

- **WebGL**: pasar vértices y datos de texturas.
- **Canvas**: manipulación de pixeles con `ImageData` (que contiene un `Uint8ClampedArray`).
- **Archivos binarios**: `FileReader.readAsArrayBuffer`.
- **Sockets y WebRTC**: transmisión de datos binarios.
- **WebAssembly**: comunicación con memoria compartida.
- **Compresión/descompresión**: trabajar con flujos de bytes.
- **Criptografía**: `crypto.getRandomValues(typedArray)`.

## Relación con arrays normales

Los Typed Arrays son objetos array-like pero no arrays reales. `Array.isArray` devuelve `false`. Sin embargo, muchos métodos de `Array.prototype` se pueden aplicar mediante `call` o convirtiéndolos a arrays.

## Consideraciones de rendimiento

Son más eficientes para datos numéricos homogéneos porque eliminan la indirección del motor JS y trabajan directamente con memoria contigua. No hay boxing de cada elemento. Son cruciales para aplicaciones de alto rendimiento y bajo nivel.

---

Estos archivos cierran el estudio profundo de las colecciones en JavaScript, desde las estructuras más comunes hasta los mecanismos avanzados de manejo de memoria y datos binarios.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Iterables generadores](08-iterables-generadores.md) | [🏠 Inicio](../index.md) | [Callbacks ▶](../06-asincronia/01-callbacks.md) |
