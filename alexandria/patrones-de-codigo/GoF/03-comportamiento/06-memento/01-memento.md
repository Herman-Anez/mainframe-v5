# Memento

## 1. Nombre y clasificación
- **Nombre**: Memento (Recuerdo, también conocido como *Token*)
- **Clasificación GoF**: Comportamiento, de objeto

## 2. Propósito
**Capturar y externalizar el estado interno de un objeto sin violar la encapsulación**, de modo que dicho estado pueda ser restaurado más tarde. El patrón Memento garantiza que el objeto (el *originador*) pueda ser devuelto a un estado anterior sin exponer sus detalles internos a otros objetos.

## 3. Motivación
En muchas aplicaciones es necesario implementar operaciones de deshacer (*undo*) o puntos de control (*checkpoint*). Un editor de texto necesita poder deshacer cambios sucesivos y volver a versiones anteriores del documento. Un videojuego necesita guardar la partida y restaurarla más tarde. La manera más simple de hacerlo sería copiar todo el estado interno del objeto, pero eso suele requerir acceso a sus campos privados, rompiendo el encapsulamiento.

El patrón Memento resuelve este dilema haciendo que el propio objeto que posee el estado (el *originador*) sepa cómo crear una instantánea de sí mismo (un *memento*) y cómo restaurarse a partir de ella. El memento es opaco para el resto del mundo; nadie más que el originador puede leer o modificar su contenido. El *cuidador* solo almacena los mementos y pide al originador que los restaure, sin conocer jamás la estructura interna del estado.

## 4. Aplicabilidad
Usa Memento cuando:
- Es necesario guardar el estado de un objeto para poder restaurarlo posteriormente.
- Obtener el estado mediante una interfaz pública expondría detalles de implementación y rompería la encapsulación.
- El originador debe tener control total sobre qué parte de su estado se guarda y se restaura.

## 5. Estructura
```
┌─────────────────┐       ┌─────────────────┐       ┌──────────────────┐
│   Originator    │       │     Memento     │       │    Caretaker     │
├─────────────────┤       ├─────────────────┤       ├──────────────────┤
│ - state         │       │ - state         │       │ - mementos       │
│ + setMemento(m) │       │ + getState()    │       │ + addMemento(m)  │
│ + createMemento()│      │ + setState()    │       │ + getMemento():M │
└─────────────────┘       └─────────────────┘       └──────────────────┘
        │                          △                          │
        │                          │                          │
        └──────────────────────────┼──────────────────────────┘
                                   │ (el cuidador almacena mementos)
```
- **Originator**: Crea un memento con su estado actual y puede restaurar su estado a partir de uno.
- **Memento**: Almacena el estado interno del originador. Es opaco para el cuidador.
- **Caretaker**: Es responsable de la custodia de los mementos. Nunca examina ni modifica el contenido del memento; solo lo guarda y lo devuelve cuando se solicita.

> [!TIP]
> Código de diagrama disponible en [PlantUML](diagramas/04-mementopuml.md).

## 6. Participantes
- **Memento** (`EditorMemento`): Un objeto que almacena una instantánea del estado interno del `Originator`. La cantidad de estado que guarda queda a discreción del originador. Idealmente, solo el originador que lo creó puede acceder a su contenido.
- **Originator** (`TextEditor`): Crea un memento que contiene su estado actual y usa el memento para restaurar un estado anterior.
- **Caretaker** (`History`): Pide al originador que cree un memento antes de realizar una operación, lo almacena, y más tarde se lo devuelve al originador para restaurar el estado anterior. El cuidador **nunca** opera sobre el memento.

## 7. Colaboraciones
- El cuidador solicita un memento al originador antes de una operación potencialmente reversible.
- El originador crea un memento con una copia de su estado interno relevante y se lo entrega al cuidador.
- El cuidador guarda el memento en una pila o lista.
- Para deshacer, el cuidador devuelve el memento más reciente al originador, quien lo usa para restaurar su estado.

## 8. Consecuencias
**Ventajas:**
- **Encapsulamiento preservado**: El memento es opaco. Solo el originador puede acceder a sus datos. No se rompe la encapsulación del estado interno.
- **Simplifica el originador**: El originador no necesita mantener un historial de estados; esa responsabilidad recae en el cuidador.
- **Permite múltiples niveles de deshacer**: Almacenando una pila de mementos se puede implementar deshacer multinivel.

**Desventajas:**
- **Consumo de memoria**: Si el estado es grande o se generan muchos mementos, el uso de memoria puede ser significativo. Se pueden utilizar mementos incrementales (guardar solo cambios) o eliminar los más antiguos.
- **Complejidad en la definición del estado a guardar**: El originador debe decidir qué parte del estado es relevante para el undo. A veces se requiere una copia profunda, lo cual puede ser costoso.
- **Caretaker puede mantener referencias y evitar la recolección de basura**: Si los mementos no se liberan, pueden ocupar memoria indefinidamente.

## 9. Implementación
**a) Interfaz del Memento**
Hay dos enfoques para garantizar la opacidad:
- **Clase interna privada (Java/C++)**: El memento es una clase interna privada del originador. Sus métodos de acceso son privados, visibles solo para el originador. El cuidador lo ve como una interfaz vacía o un `Object`. Es la forma más estricta.
- **Interfaz pública con métodos restringidos**: El memento tiene métodos `getState()` y `setState()`, pero se documenta que solo el originador debe usarlos. En lenguajes donde no se pueden restringir visibilidades entre paquetes, esto es un riesgo.

**b) Almacenamiento incremental**
Para ahorrar memoria, en lugar de guardar el estado completo cada vez, el memento puede almacenar solo los cambios (deltas) respecto a un estado base. Esto requiere un conocimiento más profundo de la estructura del estado.

**c) Copia superficial vs profunda**
Si el estado contiene referencias a otros objetos, el memento debe decidir si almacena una copia superficial (compartiendo los objetos internos) o una copia profunda. La copia superficial es más rápida pero puede dar lugar a efectos colaterales si los objetos internos son mutables. La copia profunda es segura pero más lenta y con posibles problemas de ciclos.

**d) Memento con Command**
El patrón Command suele usar Memento para implementar el deshacer: antes de ejecutar el comando, se pide un memento al originador. Al deshacer, se restaura ese memento.

**e) Persistencia del memento**
Los mementos pueden serializarse para persistir puntos de control en disco (por ejemplo, guardar partida de un juego). En tal caso, el memento debe implementar serialización, pero el cuidador sigue sin acceder a los campos.

## 10. Código de ejemplo
(Ver ejemplos de implementación en [Java](ejemplos/02-memento-java.md) y [Python](ejemplos/03-memento-python.md).)

## 11. Usos conocidos
- **Editores de texto y gráficos**: Deshacer/rehacer múltiples operaciones. Cada edición genera un memento del estado del documento.
- **Videojuegos**: Guardar y cargar partidas; el estado completo del mundo se guarda en un memento.
- **Transacciones en bases de datos**: Un rollback restaura un estado anterior similar a un memento.
- **Java `java.util.Date`**: Aunque no es un memento puro, `Date` almacena un instante que puede usarse para restaurar un estado temporal. En realidad, el `Memento` se usa más en la serialización.
- **Librerías de serialización**: Al serializar un objeto y luego deserializarlo, el proceso actúa como un memento genérico.

## 12. Patrones relacionados
- **Command**: Command puede usar Memento para mantener el estado necesario para deshacer sus operaciones.
- **Iterator**: Un iterador puede usar Memento para capturar su posición actual y restaurarla más tarde.
- **Prototype**: A veces, en lugar de Memento, se clona el originador y el clon actúa como memento. La diferencia es que Prototype suele requerir que el clon sea del mismo tipo y con interfaz pública, rompiendo la opacidad.
- **State**: Los estados pueden usar Memento para guardar y restaurar el estado del contexto al cambiar de estado.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Mediator python](../05-mediator/ejemplos/03-mediator-python.md) | [🏠 Inicio](../../index.md) | [memento.puml ▶](diagramas/04-mementopuml.md) |
