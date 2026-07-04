# Mediator

## 1. Nombre y clasificación
- **Nombre**: Mediator (Mediador)
- **Clasificación GoF**: Comportamiento, de objeto

## 2. Propósito
**Definir un objeto que encapsula cómo un conjunto de objetos interactúa.** El mediador promueve el bajo acoplamiento evitando que los objetos se refieran unos a otros explícitamente, y permite variar su interacción de forma independiente.

## 3. Motivación
Imagina un sistema de diálogo en una interfaz gráfica con múltiples controles: una lista desplegable, un campo de texto y un botón. Estos controles son interdependientes: al seleccionar un elemento de la lista, se debe actualizar el campo de texto; al escribir en el campo de texto, el botón se habilita o deshabilita según ciertas condiciones; al pulsar el botón, se realizan validaciones. Si cada control conociera directamente a los demás, el código se llenaría de referencias cruzadas, sería difícil de mantener y reutilizar.

El patrón Mediator soluciona esto introduciendo un objeto mediador que centraliza toda la lógica de interacción. Los controles (colegas) solo conocen al mediador, no a los otros controles. Cuando ocurre un evento (por ejemplo, selección en la lista), el control notifica al mediador, y es el mediador quien decide qué otros controles deben actualizarse. Así se reduce el acoplamiento y se localiza la lógica de interacción en un único lugar.

## 4. Aplicabilidad
Usa Mediator cuando:
- Un conjunto de objetos se comunican de manera bien definida pero compleja. Las interdependencias resultantes son desestructuradas y difíciles de entender.
- La reutilización de un objeto es difícil porque se comunica con muchos otros.
- Un comportamiento distribuido entre varias clases debería ser personalizable sin muchas subclases. El mediador centraliza ese comportamiento.

## 5. Estructura
```
   ┌──────────────────┐         ┌──────────────────────┐
   │     Mediator     │ (interfaz)
   ├──────────────────┤
   │ + notify(sender, event) │
   └──────────────────┘
               △
               │
   ┌──────────────────┐
   │ ConcreteMediator  │
   ├──────────────────┤
   │ - colleague1     │
   │ - colleague2     │
   │ + notify(...)    │
   └──────────────────┘
           │           ▲
           │           │ (conoce y coordina)
           ▼           │
   ┌──────────────────────────┐
   │       Colleague          │ (interfaz)
   ├──────────────────────────┤
   │ - mediator : Mediator    │
   │ + setMediator(Mediator)  │
   │ + send(event)            │ (se comunica con el mediador)
   └──────────────────────────┘
               △
               │
   ┌───────────┴───────────┐
   │                       │
 ConcreteColleague1  ConcreteColleague2
   + receive(event)       + receive(event)
```
Cada colega conoce a su mediador y, en lugar de comunicarse directamente con otros colegas, envía una notificación al mediador. El mediador conoce a todos los colegas y coordina la interacción.

> [!TIP]
> Código de diagrama disponible en [PlantUML](diagramas/04-mediatorpuml.md).

## 6. Participantes
- **Mediator** (`ChatMediator`): Define una interfaz para la comunicación con los colegas.
- **ConcreteMediator** (`ChatRoom`): Implementa el comportamiento cooperativo coordinando los colegas. Conoce y mantiene a los colegas.
- **Colleague** (`User`): Cada colega conoce a su mediador y se comunica con él cuando necesita interaccionar con otros colegas.
- **ConcreteColleague** (`ChatUser`): Un colega específico. Puede enviar mensajes al mediador y recibir notificaciones de éste.

## 7. Colaboraciones
- Los colegas envían y reciben peticiones de un objeto `Mediator`.
- El mediador implementa el comportamiento cooperativo encaminando las peticiones entre los colegas apropiados.
- Los colegas no se conocen directamente; toda la comunicación se canaliza a través del mediador.

## 8. Consecuencias
**Ventajas:**
- **Reduce el acoplamiento**: Los colegas no se conocen entre sí; solo dependen del mediador. Se pueden añadir, eliminar o cambiar colegas sin afectar al resto.
- **Centraliza el control**: La lógica de interacción que antes estaba dispersa en varios objetos ahora reside en un solo lugar, facilitando su comprensión y mantenimiento.
- **Simplifica el mantenimiento de las interacciones**: Como la lógica está centralizada, se modifica en un único punto.

**Desventajas:**
- **El mediador puede volverse un *God Object***: Si concentra demasiada lógica de interacción, se vuelve grande, complejo y difícil de mantener. Debe vigilarse su tamaño y responsabilidades.
- **Complejidad adicional**: Para interacciones simples, introducir un mediador puede añadir una capa innecesaria. Solo se justifica cuando la comunicación es intrincada.

## 9. Implementación
**a) Definición de la interfaz del mediador**
Suele incluir un método `notify(sender, event)`. Los parámetros identifican al colega que originó el evento y el tipo de evento, para que el mediador decida la acción.

**b) Comunicación entre colegas y mediador**
- El colega llama a `mediator.notify(this, event)` cuando algo cambia.
- El mediador llama a `colleague.receive(message)` para pasar información a otro colega.

**c) Registro de colegas**
El mediador necesita conocer a los colegas. Puede recibirlos en su constructor, mediante un método `register(Colleague)`, o los colegas pueden registrarse a sí mismos al establecerse el mediador.

**d) Mediador vs Observer**
Ambos desacoplan emisores y receptores. La diferencia clave: en Observer, el sujeto notifica a todos los observadores suscritos de forma directa; en Mediator, el emisor envía una notificación al mediador, y es el mediador quien decide a quién reenviar. Mediator centraliza la lógica de interacción, Observer la distribuye.

**e) Mediador vs Facade**
Facade simplifica el acceso a un subsistema, pero no añade lógica de interacción nueva. Mediator define una interacción que no existía entre los objetos aislados y añade lógica de coordinación.

**f) Uso de eventos y mensajes**
En lugar de un método `notify` genérico, se puede diseñar una API más específica con métodos como `onUserClicked()`, `onDataChanged()`, etc. Esto mejora la legibilidad pero reduce la genericidad.

## 10. Código de ejemplo
(Ver ejemplos de implementación en [Java](ejemplos/02-mediator-java.md) y [Python](ejemplos/03-mediator-python.md).)

## 11. Usos conocidos
- **Frameworks de GUI**: El mediador se usa a menudo para coordinar los controles de un diálogo. Clases como `DialogMediator` centralizan las interacciones entre botones, listas y campos de texto.
- **Control de tráfico aéreo**: La torre de control (mediador) coordina los aviones (colegas); los aviones no se comunican directamente entre sí para evitar colisiones.
- **Chat room**: Un servidor de chat actúa como mediador entre los usuarios; los usuarios envían mensajes al servidor, y este los distribuye.
- **Spring Integration / Apache Camel**: Utilizan un *message broker* o *bus* que actúa como mediador centralizando el enrutamiento de mensajes entre componentes.
- **Arquitectura de microservicios con Event Bus**: Un bus de eventos central (Kafka, RabbitMQ) media la comunicación; los servicios no se conocen directamente.

## 12. Patrones relacionados
- **Facade**: Similar en que centraliza, pero Facade solo simplifica una interfaz; Mediator añade lógica de interacción.
- **Observer**: Ambos desacoplan emisores y receptores, pero Observer lo hace mediante suscripción directa; Mediator usa un objeto intermedio.
- **Command**: Puede usarse para encapsular las peticiones enviadas al mediador.
- **Chain of Responsibility**: Distribuye la petición entre potenciales manejadores; Mediator centraliza la decisión.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Iterator python](../04-iterator/ejemplos/03-iterator-python.md) | [🏠 Inicio](../../index.md) | [mediator.puml ▶](diagramas/04-mediatorpuml.md) |
