# Composición vs. Contexto

Antes de decidir usar Contexto, React recomienda considerar la **composición** como alternativa. Esta comparación te da el criterio para elegir la herramienta adecuada.

## Composición: el patrón por defecto
La composición consiste en pasar componentes o elementos como props (generalmente `children`) para evitar el *prop drilling* sin necesidad de estado global.

**Ejemplo: un layout con slots**
```jsx
function Page({ sidebar, content }) {
  return (
    <div className="page">
      <aside>{sidebar}</aside>
      <main>{content}</main>
    </div>
  );
}

function App() {
  return (
    <Page
      sidebar={<Sidebar />}
      content={<MainContent />}
    />
  );
}
```
`Page` no necesita conocer los detalles de `Sidebar` o `MainContent`, y las props pueden viajar directamente a los componentes que las necesitan sin pasar por `Page`.

**Evitar prop drilling con "componentes como props"**:
Si tienes un árbol profundo donde un componente intermedio solo pasa props hacia abajo, puedes pasar el componente hoja directamente como prop del ancestro.

```jsx
// En lugar de:
<Abuelo>
  <Padre>
    <Hijo tema={tema} />
  </Padre>
</Abuelo>

// Usar:
<Abuelo hijo={<Hijo />} />
```
Así el `Abuelo` pasa el `tema` directamente al clonar el elemento con `React.cloneElement` o usando un render prop, sin que `Padre` sepa del tema.

## Contexto: cuándo y por qué
El Contexto está diseñado para **datos que pueden considerarse "globales"** para un subárbol de componentes, como el tema, la autenticación, las preferencias de idioma o la configuración regional. No está pensado para evitar todo prop drilling; su uso indiscriminado puede llevar a componentes menos reutilizables y a problemas de rendimiento.

**Preguntas para decidir:**
1. **¿Muchos componentes necesitan el mismo dato?** Si solo son 2-3 niveles, la composición puede ser más limpia.
2. **¿Los componentes intermedios no usan el dato y solo lo pasan?** La composición con slots (`children`) soluciona la mayoría de estos casos.
3. **¿El dato cambia con frecuencia?** El Contexto no está optimizado para actualizaciones de alta frecuencia (como valores de un input). Para eso mejor estado local o librerías con selectores (Redux, Zustand).
4. **¿Necesito que sea muy fácil acceder al dato desde cualquier punto?** Contexto brinda conveniencia, pero sacrifica la reutilización: un componente que consume un contexto está acoplado a ese contexto.

## Comparación directa
| Aspecto                  | Composición                         | Contexto                                    |
|--------------------------|--------------------------------------|---------------------------------------------|
| Acoplamiento             | Bajo (el componente es puramente props) | Medio-alto (depende del contexto)            |
| Reutilización            | Máxima (no necesita contexto)       | Reducida (necesita el Provider adecuado)     |
| Rendimiento              | Excelente (solo re-renderiza si props cambian) | Riesgo de re-renders en cascada si no se cuida |
| Simplicidad para datos globales | Puede requerir pasar props manualmente | Muy conveniente                              |
| Flujo de datos explícito | Totalmente explícito                | Implícito (no ves el flujo en las props)    |

## Combinación de composición y contexto
Una estrategia ganadora es usar composición para la estructura de la UI y Contexto para los datos verdaderamente transversales. Por ejemplo, el enrutamiento suele necesitar Contexto; los temas, también. Pero para pasar un `onClick` a un botón dentro de una tarjeta dentro de un panel, a menudo la composición mediante `children` o render props es más adecuada.

**Ejemplo híbrido**: un `Page` que recibe la barra lateral como prop (composición) pero internamente provee un contexto de tema que puede ser consumido por cualquier descendiente.

```jsx
function Page({ sidebar, children }) {
  const tema = useTema(); // de algún contexto superior
  return (
    <TemaContext.Provider value={tema}>
      <div className="page">
        <aside>{sidebar}</aside>
        <main>{children}</main>
      </div>
    </TemaContext.Provider>
  );
}
```

## Antipatrones comunes
- **Contexto como almacén global único (Dios del Estado)**: poner toda la aplicación en un solo contexto con un objeto enorme. Provoca re-renderizados masivos y hace imposible la optimización.
- **Contexto para evitar pasar props a uno o dos niveles**: a veces es más simple y explícito pasar las props. La abstracción tiene un costo.
- **Provider en el mismo componente que consume**: no funciona porque el Provider debe envolver al consumidor.
- **Objetos o arrays literales en `value` sin memoización**: cada render crea un nuevo valor y fuerza actualizaciones.

## Alternativas al Contexto para estado global
- **Redux Toolkit / Zustand / Jotai / Recoil**: ofrecen selección granular de estado, evitando renders innecesarios. Son ideales para estado global complejo con actualizaciones frecuentes.
- **React Query / SWR**: para datos de servidor, su caché está fuera del árbol de React, evitando por completo el problema de re-renders del contexto.

## Resumen de elección
Usa **composición** como primera opción. Recurre a **Contexto** cuando:
- La misma información es necesaria en muchos lugares a distintos niveles.
- Estás dispuesto a manejar los costos de rendimiento (dividiendo contextos, usando `useMemo`).
- El dato cambia con poca frecuencia (tema, usuario logueado, configuración regional).

Y recuerda: no hay una sola respuesta correcta; el equilibrio entre simplicidad, rendimiento y mantenibilidad dictará la mejor solución para cada caso concreto.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ `useContext`](02-usecontext.md) | [🏠 Inicio](../index.md) | [`useRef` y el DOM ▶](../09-refs/01-useref-y-el-dom.md) |
