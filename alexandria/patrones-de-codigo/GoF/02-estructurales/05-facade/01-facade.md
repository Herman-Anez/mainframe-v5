# Facade

## 1. Nombre y clasificación
- **Nombre**: Facade (Fachada)
- **Clasificación GoF**: Estructural, de objeto

## 2. Propósito
**Proporcionar una interfaz unificada de alto nivel para un conjunto de interfaces en un subsistema.** La fachada define una interfaz simplificada que hace que el subsistema sea más fácil de usar, ocultando su complejidad interna.

## 3. Motivación
Un sistema complejo, como un compilador, tiene múltiples subsistemas: análisis léxico, análisis sintáctico, generación de código intermedio, optimización, generación de código máquina, etc. Un cliente que quiera compilar un archivo no necesita (ni debe) conocer estos pasos ni sus clases internas. Si el cliente tuviera que instanciar y coordinar manualmente el lexer, el parser, el generador, etc., el código sería frágil, difícil de mantener y fuertemente acoplado a la estructura interna del compilador.

El patrón Facade define una clase `Compiler` con un método `compile(source)`. Este método invoca internamente a todos los subsistemas en el orden correcto. El cliente solo ve la fachada; la complejidad del compilador queda oculta tras una interfaz simple. El subsistema sigue siendo accesible para clientes avanzados que necesiten un control más fino, pero la fachada proporciona una puerta de entrada sencilla para la mayoría de los casos.

## 4. Aplicabilidad
Usa Facade cuando:
- Quieres proporcionar una interfaz simple para un subsistema complejo.
- Hay muchas dependencias entre los clientes y las clases internas de un subsistema; quieres reducir el acoplamiento.
- Quieres estructurar un sistema en capas, usando fachadas como punto de entrada a cada capa.
- El subsistema evoluciona y cambia su estructura interna; la fachada protege a los clientes de esos cambios.

## 5. Estructura
```
┌─────────┐         ┌──────────────────────┐
│ Client  │────────>│       Facade         │
└─────────┘         ├──────────────────────┤
                    │ + operation()        │
                    └──────────────────────┘
                              │
                              │ (delega en las clases del subsistema)
                              ▼
        ┌─────────────────────────────────────┐
        │          Subsistema                 │
        │  ┌──────────┐ ┌──────────┐ ┌──────┐│
        │  │ ClassA   │ │ ClassB   │ │ClassC││
        │  ├──────────┤ ├──────────┤ ├──────┤│
        │  │ + opA()  │ │ + opB()  │ │+opC()││
        │  └──────────┘ └──────────┘ └──────┘│
        └─────────────────────────────────────┘
```
El cliente interactúa exclusivamente con la `Facade`, que conoce qué clases del subsistema manejan cada solicitud y delega adecuadamente. Las clases del subsistema no conocen a la fachada y realizan el trabajo real.

> [!TIP]
> Código de diagrama disponible en [PlantUML](diagramas/04-facadepuml.md).

## 6. Participantes
- **Facade** (`Compiler`): Conoce qué clases del subsistema son responsables de una petición y delega las solicitudes del cliente a los objetos apropiados. Ofrece una interfaz unificada de alto nivel.
- **Subsystem classes** (`Lexer`, `Parser`, `CodeGenerator`): Implementan la funcionalidad del subsistema. Realizan el trabajo solicitado por la fachada. No conocen a la fachada; no guardan referencias a ella.
- **Client**: Utiliza la fachada para interactuar con el subsistema. No necesita conocer las clases internas.

## 7. Colaboraciones
- El cliente envía una petición a la fachada.
- La fachada traduce la petición en las llamadas oportunas a los objetos del subsistema.
- Los clientes que necesitan funcionalidades avanzadas pueden saltarse la fachada y acceder directamente a las clases del subsistema (si se permite).

## 8. Consecuencias
**Ventajas:**
- **Aisla a los clientes de la complejidad del subsistema**: Facilita el uso del subsistema, reduciendo la cantidad de objetos con los que el cliente debe tratar.
- **Reduce el acoplamiento**: El cliente no depende de las clases internas del subsistema. Los cambios internos no afectan al cliente (siempre que la fachada mantenga su interfaz).
- **Principio de menor conocimiento (Ley de Demeter)**: El cliente solo habla con la fachada, no con múltiples objetos del subsistema.
- **Permite la estratificación**: En una arquitectura de capas, cada capa puede exponer una fachada hacia la capa superior, ocultando los detalles inferiores.

**Desventajas:**
- **La fachada puede volverse un *God Object***: Si la fachada centraliza demasiada lógica o se convierte en el único punto de acceso, corre el riesgo de acumular demasiadas responsabilidades y ser difícil de mantener.
- **Los clientes avanzados pueden necesitar acceso directo**: Si la fachada es demasiado restrictiva, los clientes que necesiten control fino deben saltársela, creando un bypass que puede generar confusión.

## 9. Implementación
**a) Diseño de la interfaz de la fachada**
La fachada debe ofrecer las operaciones más comunes que los clientes necesitan. Si un cliente requiere una funcionalidad más específica, puede acceder directamente a las clases internas (es importante que el subsistema sea accesible, no encapsulado forzosamente).

**b) Relación con Singleton**
Las fachadas a menudo no mantienen estado propio más allá del necesario para coordinar el subsistema. Si solo se necesita una instancia, se puede implementar como Singleton. No es obligatorio, pero es común en fachadas de servicios.

**c) Fachadas como puntos de entrada a capas**
En una arquitectura de capas (presentación, lógica de negocio, persistencia), cada capa expone una fachada hacia arriba. Por ejemplo, la capa de persistencia puede exponer un `RepositoryService` que internamente usa múltiples DAOs, sistemas de caché, etc.

**d) Fachada vs Mediator**
Ambos centralizan la comunicación, pero con distinto propósito:
- **Facade** simplemente simplifica el acceso a un subsistema; no añade nueva lógica de interacción que no existiera ya.
- **Mediator** coordina la comunicación entre objetos que no deben conocerse entre sí, definiendo nuevas interacciones que no existían en los objetos aislados.

**e) Multiple fachadas**
Un subsistema complejo puede tener varias fachadas, cada una dirigida a un tipo de cliente diferente (por ejemplo, un subsistema de base de datos con una fachada para administradores y otra para aplicaciones de solo lectura).

## 10. Código de ejemplo
(Ver ejemplos de implementación en [Java](ejemplos/02-facade-java.md) y [Python](ejemplos/03-facade-python.md).)

## 11. Usos conocidos
- **Java Compiler API**: `javax.tools.JavaCompiler` es una fachada que oculta los análisis léxico, sintáctico y generación de bytecode.
- **Sistemas de gestión de bases de datos**: Un ORM como Hibernate expone una fachada (`SessionFactory`, `EntityManager`) que oculta la gestión de conexiones, transacciones y consultas SQL.
- **Sistemas de archivos**: `java.io.File` actúa como una fachada sobre el sistema de archivos nativo, ocultando detalles de plataforma.
- **Frameworks web**: Un controlador (MVC) suele ser una fachada que coordina servicios de negocio, validación, persistencia, etc.
- **Librerías de networking**: `URLConnection` en Java es una fachada que simplifica la gestión de conexiones HTTP, FTP, etc.

## 12. Patrones relacionados
- **Abstract Factory**: Puede usarse junto con Facade para proporcionar una interfaz de creación de subsistemas independientes de la plataforma. La fachada puede usar una fábrica abstracta internamente.
- **Mediator**: Ambos centralizan, pero Facade solo simplifica; Mediator añade lógica de interacción nueva.
- **Singleton**: A menudo una fachada es única (Singleton).
- **Adapter**: Adapter convierte una interfaz existente a otra esperada; Facade define una interfaz nueva y simplificada sobre muchas interfaces existentes.
- **Proxy**: Proxy es un sustituto de un objeto con el mismo interfaz; Facade es una interfaz nueva.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Decorator python](../04-decorator/ejemplos/03-decorator-python.md) | [🏠 Inicio](../../index.md) | [facade.puml ▶](diagramas/04-facadepuml.md) |
