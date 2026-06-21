# Memoizacion

## Definición

La **memoización** es una técnica de optimización que consiste en almacenar en caché los resultados de funciones costosas para devolver el valor cacheado cuando los mismos argumentos se usan nuevamente, evitando recálculos.

```javascript
function memoize(fn) {
  const cache = new Map();
  return function(arg) {
    if (cache.has(arg)) return cache.get(arg);
    const result = fn(arg);
    cache.set(arg, result);
    return result;
  };
}
const factorial = memoize(function(n) {
  if (n <= 1) return 1;
  return n * factorial(n - 1);
});
```

## Implementaciones comunes

### Para funciones de un solo argumento

La versión anterior con `Map` funciona bien si el argumento es un primitivo o una referencia estable. Si los argumentos son objetos distintos pero con el mismo valor semántico, se necesita un serializador (ej. `JSON.stringify`) o una comparación profunda, a costa de rendimiento.

### Para funciones con múltiples argumentos

Se puede usar un mapa anidado o una clave compuesta.

```javascript
function memoizeMulti(fn) {
  const cache = new Map();
  return function(...args) {
    const key = JSON.stringify(args);
    if (cache.has(key)) return cache.get(key);
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
}
```

### Usando WeakMap para claves objeto

Si los argumentos son objetos, se puede usar un `WeakMap` para que la caché no impida la recolección de basura.

```javascript
function memoizeObj(fn) {
  const cache = new WeakMap();
  return function(obj) {
    if (!cache.has(obj)) cache.set(obj, fn(obj));
    return cache.get(obj);
  };
}
```

## Aplicaciones

- **Cálculos recursivos** (Fibonacci, factorial, caminos en grafos).
- **Resultados de llamadas a APIs** (con cuidado de caducidad).
- **Derivación en selectores** (Redux, Zustand) para evitar re-renderizados.
- **Resultados de operaciones de coste computacional** (procesamiento de imágenes, transformación de datos).

## Limitaciones

- La memoización consume memoria para almacenar la caché. Si la función tiene una entrada infinita o de alta cardinalidad, la caché puede crecer indefinidamente.
- Solo es efectiva para funciones **puras** (mismos argumentos → mismo resultado, sin efectos secundarios).
- La comparación de argumentos complejos puede ser costosa; a veces es mejor no memoizar.
- En algunos contextos (React), hooks como `useMemo` y `useCallback` aplican memoización para referencias.

## Estrategias de caducidad

En lugar de una caché infinita, se pueden implementar:
- Tamaño máximo (LRU – Least Recently Used).
- Tiempo de vida (TTL).
- Caché con referencias débiles para objetos.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Service workers](07-service-workers.md) | [🏠 Inicio](../index.md) | [Inmutabilidad ▶](09-inmutabilidad.md) |
