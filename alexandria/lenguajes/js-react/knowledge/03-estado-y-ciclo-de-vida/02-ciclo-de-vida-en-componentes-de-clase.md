# Ciclo de vida en componentes de clase

Los componentes de clase tienen un conjunto de métodos especiales que React invoca automáticamente durante las fases de montaje, actualización, desmontaje y manejo de errores. Conocerlos en profundidad te permite trabajar con código heredado y comprender qué hay detrás de los hooks.

## Montaje
Ocurre cuando el componente se instancia e inserta en el DOM.
1. **`constructor(props)`**
   - Llamado antes del montaje. Se usa para inicializar `this.state` y bindear métodos. No debes causar efectos secundarios aquí. Debe llamar a `super(props)`.
2. **`static getDerivedStateFromProps(props, state)`**
   - Invocado antes del render, tanto en montaje como en actualizaciones. Debe devolver un objeto para actualizar el estado o `null` para no hacer cambios. Su uso es raro; se emplea cuando el estado necesita sincronizarse con props (ej. animaciones). Es estático para no acceder a `this`. React desaconseja su uso excesivo; normalmente se puede evitar.
3. **`render()`**
   - Método obligatorio. Debe ser puro: no modifica el estado, no interactúa con el DOM, no hace peticiones. Devuelve JSX, `null` o un portal.
4. **`componentDidMount()`**
   - Invocado inmediatamente después del montaje. Es el lugar ideal para efectos secundarios: peticiones de datos, suscripciones, manipulación del DOM. Aquí ya puedes llamar a `setState`, que provocará un nuevo render (pero ocurrirá antes de que el usuario vea la pantalla en la mayoría de los casos).

## Actualización
Ocurre cuando las props o el estado cambian.
1. **`static getDerivedStateFromProps(props, state)`** (de nuevo)
2. **`shouldComponentUpdate(nextProps, nextState)`**
   - Permite optimizar el rendimiento devolviendo `false` para evitar el render. Por defecto retorna `true`. `PureComponent` implementa una comparación superficial de props y estado. No se recomienda hacer comparaciones profundas aquí porque es costoso.
3. **`render()`**
4. **`getSnapshotBeforeUpdate(prevProps, prevState)`**
   - Se ejecuta justo antes de aplicar los cambios al DOM. Retorna un valor ("snapshot") que se pasa a `componentDidUpdate`. Útil para capturar información del scroll o del estado del DOM antes de la mutación.
5. **`componentDidUpdate(prevProps, prevState, snapshot)`**
   - Invocado después de la actualización del DOM. Se usa para operaciones que dependen del DOM actualizado, como llamadas a APIs basadas en nuevas props. Es importante comparar props actuales con anteriores para evitar bucles infinitos (`if (this.props.userID !== prevProps.userID) { ... }`).

## Desmontaje
- **`componentWillUnmount()`**
   - Se llama justo antes de que el componente sea eliminado del DOM. Aquí se limpian suscripciones, timers, listeners, etc. No se debe llamar `setState` porque el componente nunca volverá a renderizarse.

## Manejo de errores
- **`static getDerivedStateFromError(error)`**
   - Captura errores en el render de componentes hijos. Devuelve un objeto de estado para renderizar una interfaz de respaldo.
- **`componentDidCatch(error, info)`**
   - Captura errores y permite efectos secundarios como logging. Se llama en la fase de commit, por lo que permite efectos.

## Diagrama de fases (simplificado)
```
Montaje: constructor → getDerivedStateFromProps → render → componentDidMount
Actualización: getDerivedStateFromProps → shouldComponentUpdate → render → getSnapshotBeforeUpdate → componentDidUpdate
Desmontaje: componentWillUnmount
Error: getDerivedStateFromError / componentDidCatch
```

## Limitaciones que impulsaron los hooks
- La lógica de un mismo caso de uso (suscripción, datos) se dispersa en `componentDidMount`, `componentDidUpdate`, `componentWillUnmount`.
- `this` y el binding engorroso.
- Patrones complejos para compartir lógica entre componentes (HOCs y render props).

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Estado local con `useState`](01-estado-local-con-usestate.md) | [🏠 Inicio](../index.md) | [Ciclo de vida con hooks ▶](03-ciclo-de-vida-con-hooks.md) |
