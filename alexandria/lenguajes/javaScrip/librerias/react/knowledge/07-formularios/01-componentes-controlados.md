# Componentes controlados

Un **componente controlado** es aquel cuyo valor de formulario (input, textarea, select) está completamente gobernado por el estado de React. El estado de React es la "fuente única de la verdad" para el valor del campo.

## Principio fundamental
- El atributo `value` (o `checked` para checkboxes/radios) se establece desde el estado.
- Un manejador `onChange` actualiza el estado con cada interacción del usuario.
- El input se vuelve "tonto": solo muestra lo que el estado le dice.

```jsx
function FormularioControlado() {
  const [nombre, setNombre] = useState('');

  const handleChange = (e) => {
    setNombre(e.target.value);
  };

  return (
    <input
      type="text"
      value={nombre}
      onChange={handleChange}
    />
  );
}
```

## Ventajas
- **Flujo de datos predecible**: el estado dicta el valor, no hay sorpresas. La UI es función del estado.
- **Validación instantánea**: puedes validar, formatear o transformar el valor antes de pasarlo al estado.
- **Sincronización entre campos**: un cambio en un campo puede actualizar automáticamente otros (ej. dos sliders que dependen entre sí).
- **Deshabilitar/habilitar envío**: con solo leer el estado sabes si el formulario es válido.
- **Fácil reseteo**: basta con reiniciar el estado.

## Implementación para distintos tipos de campo

**Textarea** (en React usa `value`, no hijos de texto):
```jsx
<textarea value={texto} onChange={e => setTexto(e.target.value)} />
```

**Select**:
```jsx
<select value={opcion} onChange={e => setOpcion(e.target.value)}>
  <option value="manzana">Manzana</option>
  <option value="naranja">Naranja</option>
</select>
```
El atributo `selected` en `<option>` es ignorado; React usa el `value` del `<select>`.

**Checkbox** (usa `checked`, no `value`):
```jsx
const [acepta, setAcepta] = useState(false);
<input type="checkbox" checked={acepta} onChange={e => setAcepta(e.target.checked)} />
```

**Radio buttons**: cada radio tiene el mismo `name`, pero `checked` se define comparando el estado con el valor del radio.
```jsx
const [genero, setGenero] = useState('femenino');
<input type="radio" name="genero" value="masculino"
  checked={genero === 'masculino'} onChange={e => setGenero(e.target.value)} />
```

**Input de archivo**: es **no controlado** por naturaleza porque su valor es de solo lectura por seguridad. Debe usarse con refs. React lo considera no controlado incluso si intentas pasarle `value`. Ver sección de no controlados.

## Validación y formateo en tiempo real
Al controlar el estado, puedes aplicar transformaciones antes de llamar a `setState`:

```jsx
const [tarjeta, setTarjeta] = useState('');
const handleChange = (e) => {
  const soloNumeros = e.target.value.replace(/\D/g, '').slice(0, 16);
  setTarjeta(soloNumeros);
};
```

Puedes mostrar mensajes de error derivados del estado:
```jsx
const error = nombre.length < 3 ? 'Mínimo 3 caracteres' : null;
```

## Renderizado controlado y rendimiento
Cada pulsación de tecla dispara un re-render. En la mayoría de los casos no es un problema, pero si se vuelve costoso, puedes usar `useDeferredValue` o desacoplar el valor visual del lógico (aunque es raro). Para formularios muy grandes, considera librerías especializadas (React Hook Form) que minimizan renders usando refs internamente, pero mantienen la filosofía controlada hacia el exterior.

## Sincronización de props con estado (derivado de props)
Si la prop inicial puede cambiar (ej. editar un registro), debes sincronizar el estado local. Anteriormente se usaba `getDerivedStateFromProps` en clases; en hooks, el patrón común es levantar el estado al padre o usar `key` en el componente para forzar un remontaje:

```jsx
function Formulario({ datosIniciales }) {
  const [datos, setDatos] = useState(datosIniciales);
  // Si `datosIniciales` puede cambiar externamente, esto no se actualiza automáticamente.
  // Solución: usar una key única basada en el id para forzar montaje nuevo.
  // O usar useEffect para sincronizar (con cuidado de bucles):
  useEffect(() => { setDatos(datosIniciales); }, [datosIniciales]);
  // ...
}
```
Lo ideal es evitar el estado local si la fuente de verdad es el padre.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Manejo de eventos en React](../06-eventos/02-manejo-de-eventos-en-react.md) | [🏠 Inicio](../index.md) | [Componentes no controlados ▶](02-componentes-no-controlados.md) |
