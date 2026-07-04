# State

## 1. Nombre y clasificación
- **Nombre**: State (Estado)
- **Clasificación GoF**: Comportamiento, de objeto

## 2. Propósito
**Permitir que un objeto altere su comportamiento cuando su estado interno cambia.** Parecerá que el objeto cambia de clase en tiempo de ejecución. El patrón State encapsula cada estado en una clase separada y delega las peticiones al objeto estado actual.

## 3. Motivación
Piensa en una conexión de red que puede estar en varios estados: `Cerrada`, `Establecida`, `Escuchando`. Dependiendo del estado, la misma operación (por ejemplo `abrir()`, `cerrar()`, `enviarDatos()`) debe comportarse de forma diferente. Si toda la lógica se implementa con condicionales (`if (estado == CERRADA) ... else if (estado == ESTABLECIDA) ...`), el código se vuelve rígido, difícil de mantener y extender (añadir un nuevo estado obliga a modificar todas las operaciones condicionales).

El patrón State resuelve esto definiendo una interfaz `State` con métodos para cada operación dependiente del estado. Las clases concretas representan cada estado y proporcionan la implementación específica. El *contexto* (la conexión) mantiene una referencia al estado actual y le delega todas las operaciones. Cuando una operación provoca un cambio de estado, es el estado concreto quien modifica el estado del contexto. El código cliente solo interactúa con el contexto.

## 4. Aplicabilidad
Usa State cuando:
- El comportamiento de un objeto depende de su estado y debe cambiar en tiempo de ejecución según ese estado.
- Las operaciones tienen largas sentencias condicionales que dependen del estado del objeto. El patrón mueve cada rama del condicional a una clase separada.
- El número de estados es manejable y no crece descontroladamente (cada estado es una clase).
- Quieres eliminar la proliferación de `switch`/`if` que inspeccionan el estado.

## 5. Estructura
```
    ┌──────────────────────┐
    │       Context        │
    ├──────────────────────┤
    │ - state : State      │
    │ + request()          │
    │ + setState(State)    │
    └──────────────────────┘
              │
              │ delega en
              ▼
    ┌──────────────────────┐
    │        State         │ (interfaz o clase abstracta)
    ├──────────────────────┤
    │ + handle()           │
    └──────────────────────┘
                △
                │
    ┌───────────┴───────────┐
    │                       │
ConcreteStateA        ConcreteStateB
+ handle()            + handle()
```
El `Context` es la interfaz pública para los clientes. Mantiene una instancia de `ConcreteState` que define su estado actual. Los métodos `request()` del contexto delegan en el objeto estado. Si una operación produce un cambio de estado, el estado concreto llama a `context.setState()` pasando la nueva instancia del estado.

> [!TIP]
> Código de diagrama disponible en [PlantUML](diagramas/04-statepuml.md).

## 6. Participantes
- **Context** (`Connection`): Define la interfaz de interés para los clientes. Mantiene una instancia de `ConcreteState` que define su estado actual.
- **State** (`TCPState`): Interfaz o clase abstracta que encapsula el comportamiento asociado con un estado particular del contexto.
- **ConcreteState** (`TCPClosed`, `TCPEstablished`): Cada subclase implementa el comportamiento asociado con un estado del contexto. Puede cambiar el estado del contexto llamando a `setState()`.

## 7. Colaboraciones
- El contexto delega las peticiones específicas del estado al objeto `ConcreteState` actual.
- El contexto puede pasarse a sí mismo como argumento al objeto `State` para que éste pueda acceder al contexto y modificar su estado si es necesario.
- El contexto es el principal punto de contacto para los clientes. Los clientes no suelen interactuar directamente con los objetos `State`.
- Tanto el contexto como los estados concretos pueden decidir qué estado sigue a otro y bajo qué condiciones (ver Implementación).

## 8. Consecuencias
**Ventajas:**
- **Localiza el comportamiento dependiente del estado**: Cada estado es una clase separada. La lógica de un estado no se mezcla con la de otros.
- **Hace explícitas las transiciones de estado**: Las transiciones se ven en los métodos del estado concreto que invocan `setState()`.
- **Facilita añadir nuevos estados**: Basta con crear una nueva subclase de `State` e implementar los métodos. Los estados existentes no se modifican (principio Open/Closed).
- **Elimina condicionales complejas**: Desaparecen los `switch`/`if` anidados que dependen del estado.

**Desventajas:**
- **Aumenta el número de clases**: Cada estado es una clase. Si hay muchos estados, el sistema crece.
- **Lógica de transición dispersa**: Si las transiciones son definidas por los estados, el conocimiento de cuándo pasar a otro estado queda repartido entre las clases de estado, lo que puede hacer más difícil seguir la máquina de estados completa.
- **Acoplamiento entre contexto y estados**: Los estados concretos necesitan conocer al contexto para cambiar su estado.

## 9. Implementación
**a) ¿Quién define las transiciones?**
- **Los estados concretos**: Cada estado concreto conoce el estado siguiente al que debe cambiar. Ventaja: el contexto no sabe nada de la lógica de transición; solo se configura. Desventaja: los estados deben conocerse entre sí, lo que introduce dependencias entre ellos.
- **El contexto**: El contexto decide el siguiente estado basándose en el estado actual y la operación. Las clases de estado solo implementan el comportamiento; no saben cuál es el siguiente estado. Ventaja: los estados son independientes entre sí. Desventaja: el contexto concentra lógica de transición (que podría volverse compleja).

El enfoque más común es el primero: los estados realizan la transición, a menudo usando una factoría o creando directamente la nueva instancia.

**b) Creación y destrucción de los objetos State**
- **Creación bajo demanda**: Se crea un nuevo estado cada vez que se necesita.
- **Compartición**: Si los estados no tienen estado propio (no guardan atributos), se pueden compartir usando Singleton o Flyweight, evitando crear y destruir objetos constantemente.

**c) Interfaz del estado: granularidad**
La interfaz `State` debe cubrir todas las operaciones cuyo comportamiento dependa del estado. Si algunas operaciones no son válidas en ciertos estados (por ejemplo, `close()` en una conexión ya cerrada), el estado puede lanzar una excepción, no hacer nada, o delegar en un comportamiento por defecto.

**d) State vs Strategy**
Ambos usan composición y tienen una estructura casi idéntica, pero la intención difiere:
- **State**: El contexto cambia su comportamiento según su estado interno. Las transiciones entre estados son automáticas y forman parte de la lógica de los propios estados. Normalmente el cliente no conoce el estado concreto.
- **Strategy**: El cliente elige explícitamente una estrategia y la inyecta en el contexto. Las estrategias no suelen conocerse entre sí ni provocar transiciones.

**e) Tablas de transición**
Como alternativa a objetos State, se puede usar una tabla de transiciones que mapee (estado, evento) -> nuevo estado. Esto centraliza la lógica de transición pero no encapsula el comportamiento de cada estado en una clase.

## 10. Código de ejemplo
(Ver ejemplos de implementación en [Java](ejemplos/02-state-java.md) y [Python](ejemplos/03-state-python.md).)

## 11. Usos conocidos
- **Java Thread**: Los hilos tienen estados (NEW, RUNNABLE, BLOCKED, WAITING, TERMINATED) y el comportamiento de métodos como `start()`, `sleep()`, `join()` depende de ese estado.
- **Conexiones de red**: El ciclo de vida de una conexión TCP (CLOSED, LISTEN, SYN_SENT, ESTABLISHED, FIN_WAIT, etc.).
- **Máquinas expendedoras**: Estados como "sin dinero", "dinero insertado", "producto seleccionado", "entregando producto".
- **Procesamiento de pagos**: Estados de un pedido (pendiente, confirmado, enviado, entregado, cancelado).
- **Java `HttpURLConnection`**: Estados internos para gestionar el ciclo de vida de la conexión HTTP.
- **Motores de workflow**: Cada paso del flujo es un estado; el contexto avanza por ellos.

## 12. Patrones relacionados
- **Strategy**: Estructura similar, pero Strategy no implica transiciones automáticas; es configurado por el cliente. State cambia internamente.
- **Flyweight**: Los estados pueden compartirse como Flyweights si no tienen atributos propios.
- **Singleton**: Los estados a menudo son Singleton para reutilizarlos.
- **Memento**: Puede usarse para guardar el estado completo del contexto antes de una transición.
- **Command**: Las transiciones pueden encapsularse como comandos.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Observer python](../07-observer/ejemplos/03-observer-python.md) | [🏠 Inicio](../../index.md) | [state.puml ▶](diagramas/04-statepuml.md) |
