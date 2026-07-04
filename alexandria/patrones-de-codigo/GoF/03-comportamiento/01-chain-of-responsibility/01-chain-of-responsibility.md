# Chain of responsibility

## 1. Nombre y clasificación
- **Nombre**: Chain of Responsibility (Cadena de Responsabilidad)
- **Clasificación GoF**: Comportamiento, de objeto

## 2. Propósito
**Evitar el acoplamiento entre el emisor de una petición y sus receptores, dando a más de un objeto la oportunidad de manejarla.** Se encadenan los objetos receptores y se pasa la petición a lo largo de la cadena hasta que algún objeto la maneja.

## 3. Motivación
Considera un sistema de procesamiento de solicitudes de ayuda en una aplicación gráfica. Cada elemento de la interfaz (botón, panel, ventana) puede proporcionar ayuda contextual. Cuando el usuario presiona F1 sobre un botón, éste debería mostrar la ayuda asociada. Si el botón no tiene ayuda, la petición debería pasar al panel que lo contiene; si éste tampoco, a la ventana principal, y así sucesivamente hasta llegar a la aplicación.

Sin el patrón, el código que invoca la ayuda necesitaría conocer la estructura jerárquica y decidir explícitamente a quién preguntar. Esto acopla al emisor con la topología del sistema y hace difícil añadir nuevos elementos o cambiar el orden de resolución.  
Chain of Responsibility resuelve esto definiendo una interfaz común `HelpHandler` con un método `handleHelp()`. Cada elemento concreto mantiene una referencia a su sucesor (su contenedor). El cliente solo envía la petición al primer elemento de la cadena; la petición se propaga automáticamente hasta que alguien la maneja o se alcanza el final.

## 4. Aplicabilidad
Usa Chain of Responsibility cuando:
- Más de un objeto puede manejar una petición, y el manejador correcto no se conoce de antemano.
- Quieres enviar una petición a un objeto entre varios sin especificar explícitamente el receptor.
- El conjunto de objetos que pueden manejar una petición debe ser determinado dinámicamente.
- Quieres desacoplar el emisor de la petición de los receptores.

## 5. Estructura
```
┌──────────────────────┐
│      Handler         │ (abstracto o interfaz)
├──────────────────────┤
│ - successor : Handler│
│ + handleRequest()    │
└──────────────────────┘
            △
            │
┌───────────┴───────────┐
│                       │
│ ConcreteHandler1      │ ConcreteHandler2
├──────────────────────┤ ├──────────────────────┤
│ + handleRequest()    │ │ + handleRequest()    │
└──────────────────────┘ └──────────────────────┘
            │
            │ (sucesor)
            ▼
        siguiente Handler
```
El `Handler` base define la interfaz para manejar las peticiones y una referencia al sucesor. Las subclases concretas implementan `handleRequest()`: si pueden manejar la petición, lo hacen; si no, la pasan al sucesor.

> [!TIP]
> Código de diagrama disponible en [PlantUML](diagramas/04-chain-of-responsibilitypuml.md).

## 6. Participantes
- **Handler** (`HelpHandler`): Define una interfaz para manejar las peticiones. Puede implementar el enlace al sucesor.
- **ConcreteHandler** (`ButtonHelp`, `PanelHelp`): Maneja las peticiones de las que es responsable. Si no puede manejar una petición, la reenvía a su sucesor.
- **Client**: Inicia la petición a un objeto `ConcreteHandler` de la cadena. No conoce qué objeto la manejará finalmente.

## 7. Colaboraciones
- El cliente envía la petición al primer manejador de la cadena.
- Cada manejador, al recibir una petición, decide si la procesa o la pasa al siguiente.
- El cliente no tiene por qué saber quién manejará la petición; la cadena se encarga de la propagación.
- La petición puede ser un objeto (Command) o una simple llamada a método.

## 8. Consecuencias
**Ventajas:**
- **Desacoplamiento**: El emisor no conoce al receptor final. Se pueden añadir, eliminar o reordenar manejadores dinámicamente sin modificar el cliente.
- **Flexibilidad en la asignación de responsabilidades**: La cadena puede configurarse en tiempo de ejecución. Cada manejador puede decidir si maneja la petición o la pasa.
- **Principio de responsabilidad única (SRP)**: Cada manejador tiene una única responsabilidad bien definida; la cadena distribuye la lógica de decisión.

**Desventajas:**
- **No hay garantía de manejo**: La petición puede llegar al final de la cadena sin que ningún manejador la procese. Hay que prever un comportamiento por defecto o lanzar una excepción.
- **Depuración complicada**: Al ser una cadena, puede ser difícil rastrear qué manejador procesó la petición o por qué no se manejó.
- **Posible sobrecarga**: Si la cadena es larga y las peticiones suelen ser manejadas al final, se acumulan muchas llamadas sin procesamiento.

## 9. Implementación
**a) Cadena simple vs. cadena con propagación condicional**
- *Cadena simple*: Cada manejador procesa la petición y luego siempre la pasa al siguiente. Todos los manejadores ven la petición (como un filtro).
- *Cadena con parada*: El manejador que procesa la petición no la reenvía. Es el caso más típico (solo uno maneja).

**b) Definición de la referencia al sucesor**
Normalmente se almacena una referencia `next` en la clase base `Handler`. Se puede establecer mediante constructor, setter o una interfaz fluida.

**c) Manejador por defecto**
Para evitar que la petición caiga al vacío, se puede incluir un manejador por defecto al final de la cadena (por ejemplo, un manejador que muestra un mensaje de error genérico).

**d) Peticiones parametrizadas**
La petición puede ser un objeto (Request) que encapsula toda la información necesaria. Los manejadores pueden modificar la petición al pasarla (enriquecimiento) o mantenerla inmutable.

**e) Combinación con Composite**
La estructura jerárquica (ventana-panel-botón) es un Composite. La cadena de responsabilidad puede seguir la estructura del árbol: cada componente delega en su padre si no puede manejar la petición.

**f) Cadenas dinámicas**
La cadena puede modificarse en tiempo de ejecución añadiendo o quitando manejadores. Por ejemplo, en un sistema de logging, se pueden añadir dinámicamente nuevos destinos.

## 10. Código de ejemplo
(Ver ejemplos de implementación en [Java](ejemplos/02-chain-of-responsibility-java.md), [Python](ejemplos/03-chain-of-responsibility-python.md) y [Aux](ejemplos/chain-aux.md).)

## 11. Usos conocidos
- **Frameworks de logging (Log4j, java.util.logging)**: Los loggers están encadenados jerárquicamente; un mensaje de log sube por la jerarquía hasta encontrar un logger que lo maneje según el nivel configurado.
- **Manejo de eventos en interfaces gráficas**: El *bubbling* de eventos en el DOM HTML/XML o en AWT/Swing: un evento se propaga desde el componente origen hacia sus contenedores hasta que alguien lo consume.
- **Filtros en servlets (Java EE)**: `javax.servlet.FilterChain` implementa una cadena de responsabilidad; cada filtro puede manejar la petición o pasarla al siguiente filtro antes de llegar al servlet.
- **Soporte al cliente y escalado de incidencias**: Un sistema de tickets que escala automáticamente a un supervisor si el agente no resuelve.
- **Middleware en frameworks web**: Cada middleware (autenticación, logging, compresión) puede manejar la petición y decidir si la pasa al siguiente.

## 12. Patrones relacionados
- **Composite**: A menudo la cadena se organiza siguiendo la estructura de un Composite, donde el padre es el sucesor natural.
- **Command**: Las peticiones pueden encapsularse como comandos y enviarse a través de la cadena.
- **Mediator**: Centraliza la comunicación; Chain of Responsibility la distribuye.
- **Observer**: El sujeto notifica a todos los observadores; en Chain of Responsibility solo un manejador (o ninguno) procesa la petición.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Proxy python](../../02-estructurales/07-proxy/ejemplos/03-proxy-python.md) | [🏠 Inicio](../../index.md) | [chain-of-responsibility.puml ▶](diagramas/04-chain-of-responsibilitypuml.md) |
