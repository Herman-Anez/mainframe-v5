# Command

## 1. Nombre y clasificación
- **Nombre**: Command (Comando, también llamado *Action* u *Orden*)
- **Clasificación GoF**: Comportamiento, de objeto

## 2. Propósito
**Encapsular una petición como un objeto**, permitiendo parametrizar clientes con diferentes peticiones, encolar o registrar solicitudes, y soportar operaciones reversibles (deshacer).

## 3. Motivación
Imagina un sistema de menús en una aplicación de edición. Cada opción de menú (Abrir, Guardar, Copiar, Pegar) debe ejecutar una acción. Si la lógica de cada acción se programa directamente en el manejador del evento del menú, el menú queda acoplado a la implementación concreta de cada operación. Además, no se podrían implementar fácilmente funciones como deshacer/rehacer, macros (secuencias de comandos) o colas de tareas.

El patrón Command resuelve esto encapsulando cada acción en un objeto `Command` con una interfaz común `execute()`. El menú (el *invocador*) solo conoce la interfaz `Command`; no sabe qué acción concreta se ejecutará. Un `ConcreteCommand` liga un `Receiver` (el objeto que sabe realizar la operación real) con la acción a ejecutar. El cliente crea el comando y lo asigna al invocador. Así se desacoplan el objeto que pide la operación del que la ejecuta, y se habilita el deshacer (añadiendo `undo()`), el registro histórico y la composición de comandos.

## 4. Aplicabilidad
Usa Command cuando:
- Quieres parametrizar objetos con una operación a realizar (por ejemplo, menús o botones).
- Necesitas especificar, encolar y ejecutar solicitudes en diferentes momentos (ejecución diferida, trabajos en segundo plano).
- Requieres soporte para deshacer/rehacer.
- Quieres registrar cambios en un log para recuperación ante fallos.
- Necesitas estructurar un sistema en torno a operaciones de alto nivel construidas con operaciones primitivas (macros o comandos compuestos).

## 5. Estructura
```
     ┌──────────┐         ┌────────────────┐
     │  Client  │         │    Command     │ (interfaz)
     └──────────┘         ├────────────────┤
           │              │ + execute()    │
           │              │ + undo()       │ (opcional)
           │              └────────────────┘
           │                        △
           │                        │
           │              ┌─────────┴─────────┐
           │              │                   │
           ▼              ▼                   │
   ┌────────────┐  ┌──────────────────┐       │
   │  Receiver  │  │ ConcreteCommand  │       │
   ├────────────┤  ├──────────────────┤       │
   │ + action() │  │ - receiver       │       │
   └────────────┘  │ + execute()      │       │
           △        │ + undo()        │       │
           │        └──────────────────┘       │
           │                                   │
           └───────────────────────────────────┘
                      (ConcreteCommand conoce al Receiver)

   ┌──────────┐
   │ Invoker  │
   ├──────────┤
   │ - command│
   │ + setCommand(Command)
   │ + invoke()
   └──────────┘
```

- **Command**: Interfaz para ejecutar una operación. Normalmente incluye `execute()` y opcionalmente `undo()`.
- **ConcreteCommand**: Implementa `execute()` invocando la(s) operación(es) correspondiente(s) en el `Receiver`. Almacena el estado necesario para deshacer la operación.
- **Invoker**: Solicita al comando que ejecute la petición. No conoce el `Receiver` ni la acción concreta; solo depende de la interfaz `Command`.
- **Receiver**: Sabe cómo realizar las operaciones asociadas con la petición. Cualquier clase puede ser un `Receiver`.
- **Client**: Crea un objeto `ConcreteCommand` y establece su receptor. Asigna el comando al `Invoker`.

> [!TIP]
> Código de diagrama disponible en [PlantUML](diagramas/04-commandpuml.md).

## 6. Participantes
- **Command** (`Order`): Declara una interfaz para ejecutar una operación.
- **ConcreteCommand** (`BuyStock`, `SellStock`): Define un enlace entre un objeto `Receiver` y una acción. Implementa `execute()` llamando a las operaciones del `Receiver`.
- **Invoker** (`Broker`): Le pide al comando que ejecute la solicitud.
- **Receiver** (`Stock`): Sabe cómo realizar las operaciones asociadas con la petición.
- **Client** (`App`): Crea el `ConcreteCommand` y establece su `Receiver`.

## 7. Colaboraciones
- El cliente crea un `ConcreteCommand` y lo configura con el `Receiver` apropiado.
- El cliente pasa el comando al `Invoker`.
- El `Invoker` llama a `command.execute()` cuando quiere realizar la acción.
- El `ConcreteCommand` invoca los métodos del `Receiver` para llevar a cabo la operación real.
- Para deshacer, el `Invoker` (o un gestor de historial) llama a `command.undo()`, que revierte los efectos usando el estado almacenado.

## 8. Consecuencias
**Ventajas:**
- **Desacoplamiento total**: El `Invoker` no sabe qué acción se ejecuta ni quién la ejecuta. Solo depende de la interfaz `Command`.
- **Principio Open/Closed**: Se pueden añadir nuevos comandos sin modificar el código existente.
- **Comandos como objetos de primera clase**: Pueden ser almacenados, transmitidos, encolados, registrados o serializados.
- **Soporte para deshacer/rehacer**: Almacenando el estado anterior (o la operación inversa), se puede deshacer la acción. Una pila de comandos permite deshacer múltiples operaciones.
- **Composición de comandos (MacroCommand)**: Se pueden crear comandos compuestos que ejecutan una secuencia de otros comandos. Útil para transacciones o macros.

**Desventajas:**
- **Proliferación de clases**: Cada acción concreta requiere una clase `ConcreteCommand` separada, lo que puede llevar a un gran número de clases en sistemas con muchas acciones.
- **Sobrecarga de abstracción**: Si la interfaz es simple, usar Command puede añadir complejidad innecesaria comparado con una llamada directa.
- **Dificultad en la gestión del estado para deshacer**: Almacenar el estado necesario para revertir una operación puede ser costoso en memoria y complejo de implementar.

## 9. Implementación
**a) Interfaz Command**
Normalmente con `execute()`. Para deshacer se añade `undo()` o `unexecute()`. Algunos diseños incluyen `redo()` que simplemente vuelve a llamar a `execute()`.

**b) Gestión del historial para deshacer/rehacer**
Se mantiene una pila de comandos ejecutados. `undo()` saca el último comando, llama a su `undo()` y lo mueve a la pila de redo. `redo()` saca de la pila de redo, llama a `execute()` y lo mueve a la pila de undo.

**c) Almacenamiento del estado para undo**
Hay dos enfoques:
- **Estado almacenado en el comando**: El comando guarda una copia del estado anterior del `Receiver` antes de ejecutar `execute()`. `undo()` restaura ese estado. Ventaja: el `Receiver` no necesita saber de undo. Desventaja: consume memoria.
- **Operación inversa**: El comando implementa `undo()` ejecutando la acción contraria (si `execute()` incrementa, `undo()` decrementa). Ventaja: menor consumo de memoria. Desventaja: no todas las operaciones tienen inversa trivial.

**d) Command y Memento**
Para evitar almacenar estado en el comando (lo que puede romper el encapsulamiento del `Receiver`), se puede usar Memento. El `Receiver` crea un Memento de su estado; el comando guarda el Memento y lo usa en `undo()`.

**e) MacroCommand (Composite + Command)**
Un `MacroCommand` implementa `Command` y contiene una lista de comandos. Su `execute()` itera ejecutando todos los comandos; su `undo()` los deshace en orden inverso.

**f) Comandos inteligentes vs tontos**
- *Comando tonto*: Solo llama a `receiver.action()`. Toda la lógica está en el `Receiver`.
- *Comando inteligente*: Implementa la lógica él mismo, sin delegar en un `Receiver` o usando varios. Apropiado para acciones muy simples o cuando se quiere que el comando sea autónomo.

**g) Alternativas funcionales**
En lenguajes con soporte funcional (Java 8+ con lambdas, Python con funciones), los comandos simples pueden reemplazarse con funciones o `Runnable`/`Callable`, reduciendo la necesidad de jerarquías de clases.

## 10. Código de ejemplo
(Ver ejemplos de implementación en [Java](ejemplos/02-command-java.md) y [Python](ejemplos/03-command-python.md).)

## 11. Usos conocidos
- **Sistemas de menús y barras de herramientas**: Cada opción se encapsula en un comando. El mismo comando puede ser invocado desde un menú, un botón o un atajo de teclado.
- **Colas de trabajos (Job Queues)**: Los comandos se encolan y son ejecutados por hilos trabajadores. Ejemplos: `java.util.concurrent.ExecutorService` ejecuta objetos `Runnable` (que actúan como comandos).
- **Transacciones en bases de datos**: Se puede registrar una secuencia de comandos y deshacerlos si algo falla.
- **Sistemas de macros en editores**: Grabar y reproducir secuencias de comandos.
- **Sistemas de deshacer/rehacer en editores de texto, gráficos y hojas de cálculo**.
- **Netflix Conductor, AWS Step Functions**: Orquestación de flujos de trabajo donde cada paso es un comando.

## 12. Patrones relacionados
- **Memento**: Puede usarse para almacenar el estado necesario para deshacer un comando sin exponer los detalles internos del `Receiver`.
- **Composite**: Un `MacroCommand` es un Composite de comandos.
- **Prototype**: Puede usarse para copiar comandos (útil al hacer redo o al clonar secuencias).
- **Chain of Responsibility**: Los comandos pueden ser enviados a través de una cadena para encontrar quién los maneja.
- **Observer**: El invocador puede notificar a los observadores cuando se ejecuta un comando.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Chain Aux](../01-chain-of-responsibility/ejemplos/chain-aux.md) | [🏠 Inicio](../../index.md) | [command.puml ▶](diagramas/04-commandpuml.md) |
