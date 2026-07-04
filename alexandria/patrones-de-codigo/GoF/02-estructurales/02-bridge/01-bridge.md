# Bridge

## 1. Nombre y clasificación
- **Nombre**: Bridge (Puente)
- **Clasificación GoF**: Estructural, de objeto

## 2. Propósito
**Desacoplar una abstracción de su implementación** para que ambas puedan variar de forma independiente. El patrón Bridge sustituye la herencia por composición, separando dos dimensiones ortogonales de variabilidad: qué hace la abstracción y cómo lo hace la implementación.

## 3. Motivación
Supón una jerarquía de formas geométricas (`Shape`, `Circle`, `Square`) que deben dibujarse en distintas plataformas (Windows, Linux, macOS). Un diseño basado únicamente en herencia crearía una explosión de subclases: `WindowsCircle`, `LinuxCircle`, `MacCircle`, `WindowsSquare`, etc. Cada nueva forma o nueva plataforma obliga a multiplicar las clases, volviendo el sistema rígido y difícil de mantener.

El patrón Bridge aborda este problema separando la abstracción (la forma, qué dibujar) de la implementación (el renderizador, cómo dibujar). `Shape` mantiene una referencia a un objeto `Renderer` (la implementación). Las formas concretas (`Circle`, `Square`) extienden `Shape` y delegan el dibujo a `Renderer`. Las implementaciones concretas (`VectorRenderer`, `RasterRenderer`) implementan la interfaz `Renderer`. Así, las formas y los renderizadores pueden evolucionar independientemente; añadir una nueva forma o una nueva plataforma no afecta a la otra jerarquía.

## 4. Aplicabilidad
Usa Bridge cuando:
- Quieres evitar un vínculo permanente entre una abstracción y su implementación (por ejemplo, cuando la implementación debe elegirse o cambiarse en tiempo de ejecución).
- Tanto la abstracción como la implementación deben ser extensibles mediante herencia; el patrón permite combinarlas sin explosión de clases.
- Los cambios en la implementación no deben impactar al cliente (el cliente solo ve la abstracción).
- Tienes una proliferación de clases debido a dos dimensiones ortogonales de variación (la “explosión de subclases”).
- Quieres ocultar los detalles de implementación completamente del cliente (principio de menor conocimiento).

## 5. Estructura
```
     ┌─────────────────────┐
     │    Abstraction      │
     ├─────────────────────┤
     │ - impl: Implementor │
     │ + operation()       │
     └─────────────────────┘
                △
                │
     ┌─────────────────────┐
     │ RefinedAbstraction  │
     ├─────────────────────┤
     │ + operation()       │ (puede añadir más funcionalidad)
     └─────────────────────┘
                │
                │ delega en
                ▼
     ┌─────────────────────┐
     │    Implementor      │ (interfaz)
     ├─────────────────────┤
     │ + operationImpl()   │
     └─────────────────────┘
                △
                │
     ┌─────────────────────┐
     │ ConcreteImplementor │
     ├─────────────────────┤
     │ + operationImpl()   │
     └─────────────────────┘
```

- **Abstraction** (`Shape`): define la interfaz de la abstracción y mantiene una referencia a un objeto de tipo `Implementor`.
- **RefinedAbstraction** (`Circle`, `Square`): extiende la abstracción y puede añadir operaciones específicas, pero siempre delega a `Implementor` para la parte dependiente de la plataforma.
- **Implementor** (`Renderer`): define la interfaz para las clases de implementación. Normalmente no coincide directamente con la interfaz de `Abstraction`; ofrece operaciones de más bajo nivel.
- **ConcreteImplementor** (`VectorRenderer`, `RasterRenderer`): implementa la interfaz `Implementor` con una plataforma concreta.

> [!TIP]
> Código de diagrama disponible en [PlantUML](diagramas/04-bridgepuml.md).

## 6. Participantes
- **Abstraction**: Mantiene una referencia a `Implementor` y define operaciones de alto nivel basadas en las primitivas de la implementación.
- **RefinedAbstraction**: Extiende la interfaz definida por `Abstraction` con funcionalidad adicional.
- **Implementor**: Define la interfaz para las clases de implementación; sus métodos no tienen por qué corresponderse uno a uno con los de `Abstraction`.
- **ConcreteImplementor**: Implementa `Implementor` y contiene el código concreto dependiente de la plataforma.

## 7. Colaboraciones
- El cliente usa la `Abstraction` y no conoce la implementación subyacente.
- `Abstraction` reenvía las peticiones del cliente al objeto `Implementor` mediante la interfaz común.
- El puente se establece normalmente en tiempo de inicialización: el cliente crea una `ConcreteImplementor` y la inyecta en la `Abstraction` (por constructor o setter). A partir de ahí, la abstracción trabaja con esa implementación sin acoplarse a ella.

## 8. Consecuencias
**Ventajas:**
- **Desacoplamiento total**: La abstracción y la implementación pueden evolucionar independientemente. Cambios en la implementación no requieren recompilar o modificar la abstracción y viceversa.
- **Principio Open/Closed**: Se pueden añadir nuevas abstracciones (RefinedAbstractions) y nuevas implementaciones (ConcreteImplementors) sin modificar el código existente.
- **Principio de inversión de dependencias (DIP)**: La abstracción no depende de los detalles; ambos dependen de la interfaz `Implementor`.
- **Oculta los detalles al cliente**: El cliente solo ve los métodos de `Abstraction`; nunca sabe si se está usando una implementación de Windows o de Linux.
- **Flexibilidad en tiempo de ejecución**: Se puede cambiar la implementación asociada a una abstracción dinámicamente (setter), algo imposible con herencia estática.

**Desventajas:**
- **Complejidad inicial**: Añade una capa extra de indirección que puede ser innecesaria si solo hay una implementación o la variabilidad nunca se materializa.
- **Diseño previo necesario**: A diferencia de Adapter, que se puede aplicar a posteriori, Bridge requiere identificar las dimensiones de variabilidad desde el diseño inicial.
- **Sobrecarga de abstracción**: Si la interfaz del `Implementor` es muy genérica, puede obligar a las abstracciones a realizar demasiado trabajo de adaptación.

## 9. Implementación
**a) Identificación de las dimensiones separables**
El verdadero reto del Bridge es descubrir qué eje debe ser la abstracción y cuál la implementación. Algunos indicios: la abstracción representa una entidad de dominio (Forma, Dispositivo) y la implementación representa una capacidad dependiente del entorno (Dibujo, Protocolo de comunicación).

**b) Elección de la interfaz del Implementor**
La interfaz debe ser lo suficientemente amplia para cubrir todas las operaciones necesarias por las abstracciones, pero sin exponer detalles innecesarios. Suele ser de grano más fino que la interfaz de `Abstraction`.

**c) Vinculación dinámica**
La referencia al `Implementor` se puede pasar en el constructor de la `Abstraction` o mediante un setter. Lo más común es inyectarla al crear la abstracción.

**d) Uso de Factorías**
La creación del `ConcreteImplementor` adecuado suele delegarse en una **Abstract Factory** o en un método factoría. Así, el código que instancia la abstracción no se acopla a la implementación concreta.

**e) Herencia vs Composición**
Bridge es un ejemplo perfecto del principio “composición sobre herencia”: en lugar de heredar para cada combinación, se compone una abstracción con una implementación.

**f) Bridge y Adapter**
- *Bridge* se diseña de antemano para separar dos capas que varían.
- *Adapter* se usa *a posteriori* para unir interfaces que no fueron diseñadas para trabajar juntas.
En la práctica, un Bridge puede usar internamente un Adapter si la interfaz `Implementor` no coincide con una librería existente.

## 10. Código de ejemplo
(Ver ejemplos de implementación en [Java](ejemplos/02-bridge-java.md) y [Python](ejemplos/03-bridge-python.md).)

## 11. Usos conocidos
- **AWT/Swing**: La clase `Component` (abstracción) y `ComponentPeer` (implementación). Cada plataforma proporciona un peer nativo.
- **Java Database Connectivity (JDBC)**: `DriverManager` / `Connection` (abstracción) y los drivers concretos (`com.mysql.jdbc.Driver`) son la implementación.
- **Sistemas de ventanas multiplataforma**: El toolkit Qt separa la API de alto nivel (`QWidget`) de la plataforma nativa a través de un backend.
- **Patrón de diseño de APIs REST**: Controladores (abstracción) y servicios de persistencia (implementación) pueden separarse para variar la base de datos sin tocar la lógica de negocio.

## 12. Patrones relacionados
- **Adapter**: Bridge separa desde el inicio; Adapter corrige una incompatibilidad existente.
- **Abstract Factory**: Se puede usar para crear y configurar el Bridge adecuado (crea la implementación y la inyecta).
- **Strategy**: Tiene una estructura casi idéntica, pero la intención es diferente. Strategy encapsula un algoritmo (la “estrategia”), mientras que Bridge separa una abstracción de su implementación física. En Strategy, el cliente conoce y elige el algoritmo; en Bridge, el cliente normalmente no conoce la implementación concreta.
- **Decorator**: Ambos usan composición, pero Decorator envuelve para añadir comportamiento manteniendo la misma interfaz, mientras que Bridge separa dos interfaces distintas.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Adapter python](../01-adapter/ejemplos/03-adapter-python.md) | [🏠 Inicio](../../index.md) | [bridge.puml ▶](diagramas/04-bridgepuml.md) |
