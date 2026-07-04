# Fragmentos

## ¿Qué es un fragmento?
Un fragmento es un componente que permite **agrupar una lista de hijos sin añadir un nodo extra al DOM**. React ofrece `React.Fragment` y su sintaxis abreviada `<>...</>`.

```jsx
// Sin fragmento: se añade un <div> innecesario al DOM
function Lista() {
  return (
    <div>
      <li>A</li>
      <li>B</li>
    </div>
  );
}

// Con fragmento: el DOM resultante son solo los <li>
function Lista() {
  return (
    <React.Fragment>
      <li>A</li>
      <li>B</li>
    </React.Fragment>
  );
}

// Sintaxis corta
function Lista() {
  return (
    <>
      <li>A</li>
      <li>B</li>
    </>
  );
}
```

El DOM final es el deseado, sin contenedores espurios que puedan romper la semántica HTML o la aplicación de estilos (por ejemplo, una lista `<ul>` debe tener hijos `<li>` directos).

## Tipos de fragmentos
1. **`React.Fragment`**: la versión explícita. Acepta props, siendo la única útil `key` cuando se usa en listas.
2. **`<>...</>`**: sintaxis abreviada. **No acepta atributos ni key**. Si necesitas una key, debes usar la versión completa.

## Uso en listas con key
Cuando renderizas una colección de elementos y cada grupo necesita un contenedor lógico sin nodo real, necesitas asignar una `key` al fragmento.

```jsx
function Glosario({ terminos }) {
  return (
    <dl>
      {terminos.map(termino => (
        <React.Fragment key={termino.id}>
          <dt>{termino.concepto}</dt>
          <dd>{termino.definicion}</dd>
        </React.Fragment>
      ))}
    </dl>
  );
}
```

No puedes usar `<>` aquí porque necesitas pasar `key`. Usa `<React.Fragment key={...}>`.

## Comportamiento en el Virtual DOM
Internamente, `Fragment` es un tipo de componente especial (`Symbol.for('react.fragment')`). React lo trata como un nodo transparente: al reconciliar, simplemente itera sobre sus hijos directamente como si estuvieran en el padre. No genera nodo en el DOM ni influye en el layout.

Esto también significa que las reglas de keys entre hermanos se aplican considerando que los hijos del fragmento son hermanos directos del resto de hijos del padre.

```jsx
<ul>
  <>
    <li key="a">A</li>
    <li key="b">B</li>
  </>
  <li key="c">C</li>
</ul>
// Claves entre A, B y C deben ser únicas.
```

## Fragmentos y estilos CSS
Los fragmentos ayudan a cumplir con selectores CSS que dependen de la estructura (por ejemplo, `ul > li`, Flexbox/Grid que esperan un conjunto de hijos directos). Sin fragmentos, un `<div>` extraño rompería estos diseños.

## Fragmentos y arrays de elementos
Históricamente, React soportaba devolver un array de elementos desde el render (React 16+), pero requería keys. Los fragmentos surgieron como una solución más semántica y legible que pasar un array directamente. Hoy puedes devolver un array sin fragmento (con keys), pero el fragmento sigue siendo la forma más declarativa.

```jsx
// Permitido, pero menos legible:
function Elementos() {
  return [
    <li key="a">A</li>,
    <li key="b">B</li>,
  ];
}

// Mejor con fragmento:
function Elementos() {
  return (
    <>
      <li>A</li>
      <li>B</li>
    </>
  );
}
```

## Fragmentos anidados y rendimiento
Los fragmentos no añaden overhead de renderizado: React los optimiza completamente. Puedes anidarlos arbitrariamente sin costo alguno. La comparación (diffing) se hace a nivel de los hijos, saltando el fragmento.

## Casos de uso comunes
- Devolver múltiples elementos de un componente (antes solo se podía retornar un único elemento raíz).
- Agrupar celdas de una tabla (`<td>`) sin añadir un `<div>` que rompa el modelo.
- Evitar contenedores extra en componentes de layout, manteniendo la semántica HTML.
- En patrones de composición, cuando un componente espera múltiples hijos pero no quieres envolverlos en un nodo.

## Fragmento vs. arrays: diferencias en el renderizado
- **Fragment**: React itera los hijos sin nodo contenedor.
- **Array con keys**: React también itera los elementos, pero explícitamente requiere keys asignadas. Es funcionalmente equivalente a un fragmento con keys.

Elegir entre uno y otro es cuestión de legibilidad y sintaxis.

## Fragmento con asignación de ref
No se puede asignar un `ref` a un fragmento porque no hay una instancia de DOM asociada. Si necesitas referenciar múltiples nodos, usa una ref callback o un array de refs.

```jsx
// ❌ No funciona
<React.Fragment ref={miRef}>...</React.Fragment>

// ✅ Alternativa: usar un div con ref (aunque añade nodo) o refs individuales en los hijos.
```

## Buenas prácticas
- Utiliza `<>` por defecto; usa `React.Fragment` solo si necesitas `key`.
- No abuses de fragmentos para esconder múltiples responsabilidades: si un componente devuelve muchos elementos dispares, quizá deba dividirse.
- Recuerda que un fragmento no puede ser estilizado ni tiene representación visual; si necesitas un contenedor para aplicar clases o eventos, necesitas un elemento real.

---

Ambos mecanismos son esenciales para mantener un DOM limpio y predecible mientras se conservan las garantías del modelo de componentes: los portales extienden la vista más allá del contenedor raíz sin romper React, y los fragmentos eliminan nodos innecesarios que podrían interferir con el layout y la semántica. Su uso juicioso refleja la madurez del desarrollador en la construcción de interfaces complejas.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Portales](01-portales.md) | [🏠 Inicio](../index.md) | [`React.memo` ▶](../11-rendimiento/01-reactmemo.md) |
