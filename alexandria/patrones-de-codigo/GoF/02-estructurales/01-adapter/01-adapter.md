# Adapter

## 1. Nombre y clasificación
- **Nombre**: Adapter (Adaptador, también conocido como *Wrapper*)
- **Clasificación GoF**: Estructural, puede ser de clase o de objeto

## 2. Propósito
Convertir la interfaz de una clase en otra interfaz que el cliente espera. **Adapter permite que clases con interfaces incompatibles trabajen juntas**, algo que de otro modo sería imposible.

## 3. Motivación
Es frecuente que una clase ya existente (de una librería de terceros, un sistema heredado o un componente externo) ofrezca funcionalidad muy útil, pero su interfaz no coincida con la que nuestra aplicación espera. Modificar la clase original no es posible (no tenemos acceso al código fuente, o no queremos acoplar nuestro código a una interfaz ajena). Duplicar la funcionalidad es redundante y propenso a errores.

El ejemplo clásico del GoF es un editor gráfico que trabaja con figuras (`Shape`). Se desea reutilizar una librería que dibuja texto sofisticado (`TextView`), pero su interfaz es completamente distinta. Un adaptador `TextShape` implementa la interfaz `Shape` y traduce cada llamada a las operaciones correspondientes de `TextView`, haciendo que `TextView` parezca una figura más desde el punto de vista del editor.

## 4. Aplicabilidad
Usa Adapter cuando:
- Quieres usar una clase existente cuya interfaz no coincide con la que necesitas.
- Deseas crear una clase reutilizable que coopere con clases no relacionadas o imprevistas (es decir, clases que no necesariamente tienen interfaces compatibles).
- Necesitas usar varias subclases existentes pero no es práctico adaptar cada una mediante herencia; un adapter de objeto puede adaptar la clase base y todas sus subclases.
- En general, necesitas que dos interfaces incompatibles puedan interactuar sin modificar su código fuente.

## 5. Estructura
El patrón tiene dos variantes principales:

**Adapter de clase** (herencia múltiple):
```
┌─────────────┐        ┌─────────────┐
│   Target    │        │   Adaptee   │
├─────────────┤        ├─────────────┤
│ + request() │        │ + specificRequest() │
└─────────────┘        └─────────────┘
       △                       △
       │                       │
       └───────────┬───────────┘
                   │
            ┌──────────────┐
            │   Adapter    │
            ├──────────────┤
            │ + request()  │ ────── llama a specificRequest()
            └──────────────┘
```
El adaptador hereda de `Target` (para cumplir la interfaz) y de `Adaptee` (para tener acceso a su implementación).

**Adapter de objeto** (composición):
```
┌─────────────┐
│   Target    │
├─────────────┤
│ + request() │
└─────────────┘
       △
       │
┌──────────────┐        ┌─────────────┐
│   Adapter    │───────>│   Adaptee   │
├──────────────┤        ├─────────────┤
│ + request()  │        │ + specificRequest() │
└──────────────┘        └─────────────┘
```
El adaptador implementa `Target` y contiene una referencia a `Adaptee` (composición). Delega la llamada a `adaptee.specificRequest()`.

> [!TIP]
> Código de diagrama disponible en [PlantUML](diagramas/04-adapterpuml.md).

## 6. Participantes
- **Target** (`Shape`): Define la interfaz específica del dominio que el cliente usa.
- **Client** (`DrawingEditor`): Colabora con objetos que cumplen la interfaz `Target`.
- **Adaptee** (`TextView`): Clase existente con una interfaz incompatible que necesita ser adaptada.
- **Adapter** (`TextShape`): Implementa la interfaz `Target` y adapta (traduce) las peticiones del cliente a llamadas en el `Adaptee`.

## 7. Colaboraciones
- El cliente invoca operaciones sobre el adaptador a través de la interfaz `Target`.
- El adaptador traduce cada llamada a una o varias llamadas en el `Adaptee` usando su propia interfaz.
- El cliente no tiene conocimiento del `Adaptee`; solo conoce al `Target` y, por tanto, al `Adapter`.

## 8. Consecuencias
**Adapter de clase:**
- *Ventajas*: Puede sobrescribir el comportamiento de `Adaptee` si es necesario. No necesita un objeto `Adaptee` separado (se instancia directamente el adaptador).
- *Desventajas*: Solo puede adaptar una clase concreta, no sus subclases. Requiere herencia múltiple (no disponible en todos los lenguajes, por ejemplo Java no permite heredar de múltiples clases).

**Adapter de objeto:**
- *Ventajas*: Un único adaptador funciona con el `Adaptee` y todas sus subclases (puede añadir funcionalidad a la jerarquía completa). Es más flexible al usar composición.
- *Desventajas*: No puede sobrescribir comportamiento de `Adaptee` sin crear una subclase específica y pasarla al adaptador. Requiere un objeto `Adaptee` preexistente para instanciar el adaptador.

**Consecuencias generales:**
- **Desacoplamiento**: El cliente y el adaptado permanecen completamente independientes.
- **Reutilización**: Se pueden integrar librerías de terceros sin modificar su código.
- **Sobrecarga**: Un adaptador introduce un nivel adicional de indirección, que puede ser insignificante en la mayoría de los casos.
- **Complejidad de traducción**: Si la interfaz del `Adaptee` es muy distinta, la lógica de traducción puede ser compleja.

## 9. Implementación
**a) Elegir entre Adapter de clase y de objeto**
- La mayoría de los lenguajes y situaciones favorecen el **Adapter de objeto** porque es más flexible y no requiere herencia múltiple.
- El **Adapter de clase** se usa cuando se necesita modificar el comportamiento heredado del `Adaptee` y el lenguaje lo permite.

**b) Adaptadores bidireccionales**
Cuando dos sistemas deben trabajar juntos y ambas partes necesitan verse mutuamente como la interfaz esperada, se puede crear un adaptador bidireccional que implemente ambas interfaces y traduzca en ambos sentidos.

**c) Adapter vs Facade**
Facade define una nueva interfaz simplificada para un subsistema completo; Adapter convierte una interfaz existente en otra. Adapter trabaja sobre una interfaz preexistente; Facade a menudo sobre varias clases.

**d) Adapter vs Decorator**
Decorator añade responsabilidades sin cambiar la interfaz (misma interfaz). Adapter cambia la interfaz de un objeto. Son parecidos en implementación (wrapper) pero difieren en intención.

**e) Adaptadores en lenguajes modernos**
- En Java, con lambdas y referencias a métodos, a veces se puede usar `java.util.function.Function` para adaptar una interfaz a otra de manera concisa.
- En Python, los patos tipados (*duck typing*) reducen la necesidad del patrón, pero sigue siendo útil cuando se quiere aislar una librería externa detrás de una interfaz controlada.

## 10. Código de ejemplo
(Ver ejemplos de implementación en [Java](ejemplos/02-adapter-java.md) y [Python](ejemplos/03-adapter-python.md).)

## 11. Usos conocidos
- **Java I/O**: `InputStreamReader` adapta un `InputStream` (bytes) a un `Reader` (caracteres). `OutputStreamWriter` hace lo mismo con `OutputStream` y `Writer`.
- **Java Collections**: `Arrays.asList()` adapta un array a la interfaz `List`.
- **Wrappers en .NET**: `System.Data.Common.DbDataAdapter` adapta datos de distintas bases de datos a `DataSet`.
- **Bases de datos y ORM**: Los adaptadores de base de datos (JDBC drivers) adaptan la interfaz estándar `java.sql.Connection` a las llamadas específicas de cada motor.
- **Integración de sistemas heredados**: Muy común en migraciones donde se envuelve el sistema antiguo tras una nueva interfaz.

## 12. Patrones relacionados
- **Bridge**: Tiene una estructura similar pero con distinta intención. Bridge separa una abstracción de su implementación desde el principio del diseño para que ambas varíen independientemente. Adapter se aplica *a posteriori* para unir interfaces incompatibles.
- **Decorator**: Ambos envuelven un objeto, pero Decorator mantiene la misma interfaz y añade funcionalidad; Adapter cambia la interfaz.
- **Facade**: Define una nueva interfaz para un subsistema complejo; no adapta una interfaz existente, sino que la simplifica.
- **Proxy**: Controla el acceso manteniendo la misma interfaz; no la cambia.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Singleton python](../../01-creacionales/05-singleton/ejemplos/03-singleton-python.md) | [🏠 Inicio](../../index.md) | [adapter.puml ▶](diagramas/04-adapterpuml.md) |
