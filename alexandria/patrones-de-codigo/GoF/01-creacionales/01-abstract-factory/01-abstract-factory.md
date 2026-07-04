# Abstract factory

## 1. Nombre y Clasificación
- **Nombre**: Abstract Factory (Fábrica Abstracta)
- **Clasificación GoF**: Creacional, de objeto (usa composición y delegación)

## 2. Propósito
Proporcionar una interfaz para crear **familias de objetos relacionados o dependientes** sin especificar sus clases concretas. El cliente permanece independiente de las implementaciones concretas de los productos.

## 3. Motivación
Imagina un framework de interfaces gráficas que debe funcionar en múltiples sistemas operativos (Windows, Mac, Linux). Cada plataforma proporciona una familia de controles visuales: `Botón`, `Ventana`, `CuadroTexto`, etc. El código de la aplicación no debe depender de las clases específicas de Windows o Mac, pues se volvería frágil e imposible de portar.  
Abstract Factory resuelve este problema definiendo una interfaz de fábrica (`GUIFactory`) con métodos para crear cada control. Luego, para cada plataforma se implementa una fábrica concreta (`WinFactory`, `MacFactory`) que produce la familia de productos correspondientes. El cliente usa solo la interfaz `GUIFactory` y las interfaces de los productos abstractos; el acoplamiento a lo concreto desaparece.

## 4. Aplicabilidad
Usa Abstract Factory cuando:
- Un sistema debe ser independiente de cómo se crean, componen y representan sus productos.
- El sistema debe configurarse con una de entre varias familias de productos.
- Quieres asegurar la **consistencia** entre productos de una misma familia (evitar que se use un botón de Windows con una ventana de Mac).
- Los productos concretos no deben ser expuestos a los clientes; solo sus interfaces.

## 5. Estructura
El siguiente diagrama UML muestra las relaciones entre los participantes:

```
┌───────────────────────┐       ┌───────────────────────────┐
│   AbstractFactory     │       │     AbstractProductA      │
├───────────────────────┤       ├───────────────────────────┤
│ + createProductA()    │       └───────────────────────────┘
│ + createProductB()    │                     △
└───────────────────────┘                     │
              △                              │
              │               ┌──────────────┴──────────────┐
              │               │                             │
┌─────────────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│   ConcreteFactory1      │ │  ProductA1      │ │  ProductA2      │
├─────────────────────────┤ ├─────────────────┤ ├─────────────────┤
│ + createProductA()      │ │                 │ │                 │
│ + createProductB()      │ └─────────────────┘ └─────────────────┘
└─────────────────────────┘
              │
┌─────────────────────────┐
│   ConcreteFactory2      │
├─────────────────────────┤   El mismo patrón aplica para ProductB.
│ + createProductA()      │
│ + createProductB()      │
└─────────────────────────┘
```

> [!NOTE]
> **Nota**: La fábrica abstracta declara un método de creación por cada tipo de producto abstracto.

> [!TIP]
> Código de diagrama disponible en [PlantUML](diagramas/04-abstract-factorypuml.md).

## 6. Participantes
- **AbstractFactory** (`GUIFactory`): Interfaz que declara operaciones de creación para cada producto abstracto.
- **ConcreteFactory** (`WinFactory`, `MacFactory`): Implementa los métodos de creación devolviendo los productos concretos de una familia específica.
- **AbstractProduct** (`Button`, `Window`): Interfaz para un tipo de producto.
- **ConcreteProduct** (`WinButton`, `MacButton`, `WinWindow`, `MacWindow`): Implementación concreta de un producto abstracto, creado por la fábrica concreta correspondiente.
- **Client**: Usa solo las interfaces de la fábrica abstracta y de los productos abstractos. No conoce las clases concretas.

## 7. Colaboraciones
- Normalmente se crea una **única instancia** de `ConcreteFactory` en tiempo de ejecución (por configuración, entorno o lógica de negocio). Esta instancia puede ser un **Singleton** o ser inyectada.
- El cliente invoca `createProductA()` y `createProductB()` sobre la fábrica abstracta y obtiene objetos que cumplen las interfaces de los productos abstractos.
- El cliente utiliza los productos creados exclusivamente a través de sus interfaces, sin necesidad de saber a qué familia pertenecen.

## 8. Consecuencias
**Ventajas:**
- **Aísla las clases concretas**: El código del cliente no depende de las implementaciones concretas.
- **Intercambio de familias de productos**: Cambiar de familia (por ejemplo, de Windows a Mac) se hace cambiando la instancia de la fábrica concreta, usualmente en un único punto.
- **Consistencia entre productos**: Se garantiza que todos los productos creados por una fábrica concreta son compatibles entre sí.
- **Cumple principios SOLID**: 
  - *Open/Closed*: Nuevas familias de productos se añaden creando nuevas fábricas concretas, sin modificar el código cliente.
  - *Dependency Inversion*: El cliente depende de abstracciones, no de detalles.

**Desventajas:**
- **Agregar nuevos productos abstractos es costoso**: Si se necesita un nuevo tipo de producto (`Menu`), hay que modificar la interfaz `AbstractFactory` y todas las fábricas concretas existentes (rompe el OCP en esa dimensión).
- **Mayor número de clases**: Cada familia requiere una fábrica concreta y cada producto requiere varias implementaciones.

## 9. Implementación
**a) Elección de la fábrica concreta**
La instancia de la fábrica concreta se decide normalmente:
- Por parámetro de configuración (archivo, variable de entorno).
- Por el entorno de ejecución (detección automática del sistema operativo).
- Mediante una fábrica de fábricas (*factory of factories*) o una inyección de dependencias.

**b) Patrón Singleton para la fábrica**
Habitualmente una `ConcreteFactory` se implementa como Singleton porque suelen ser objetos sin estado (solo crean otros objetos).

**c) Extensibilidad con parámetros**
Puede diseñarse una fábrica abstracta más dinámica que reciba un identificador de producto y devuelva un objeto genérico, pero esto sacrifica la seguridad de tipos en tiempo de compilación.

**d) Implementación con Factory Method**
Cada método de creación en la fábrica abstracta puede ser visto como un **Factory Method**. De hecho, Abstract Factory suele implementarse mediante varios Factory Methods (uno por producto).

**e) Relación con Prototype**
Si la creación de productos es costosa o las familias cambian dinámicamente, la fábrica concreta puede almacenar prototipos de cada producto y clonarlos al recibir una petición. Así se evita crear nuevas clases fábrica para cada familia.

**f) Cuidado con la jerarquía de productos**
Los productos abstractos deben ser estables. Si los productos varían con frecuencia, considerar variantes como registros dinámicos o usar el patrón Builder para construir objetos complejos dentro de una familia.

## 10. Código de ejemplo
(Ver ejemplos de implementación en [Java](ejemplos/02-abstract-factory-java.md) y [Python](ejemplos/03-abstract-factory-python.md).)

## 11. Usos conocidos
- **Java AWT/Swing**: Aunque Swing es multiplataforma, internamente utiliza *Abstract Factory* para la apariencia visual (*LookAndFeel*) que produce todas las piezas de la interfaz (botones, bordes, etc.) para un estilo concreto (Metal, Motif, Windows).
- **ADO.NET** (C#): `DbProviderFactory` es una fábrica abstracta que crea conexiones, comandos y adaptadores para distintas bases de datos (SQL Server, Oracle, MySQL).
- **Frameworks de inyección de dependencias**: Muchos contenedores utilizan Abstract Factory para construir objetos según un contexto (por ejemplo, instancias en entorno de pruebas vs producción).

## 12. Patrones relacionados
- **Factory Method**: Abstract Factory se implementa a menudo con varios Factory Methods. La diferencia principal es que Abstract Factory crea **familias** de productos, mientras que Factory Method crea un **único** producto y delega la creación a subclases.
- **Prototype**: La fábrica concreta puede clonar prototipos en lugar de instanciar clases concretas.
- **Singleton**: Las fábricas concretas suelen ser únicas.
- **Bridge**: El puente separa una abstracción de su implementación; la implementación a menudo se obtiene usando una Abstract Factory.
- **Facade**: La fachada puede usar una fábrica abstracta internamente para crear los componentes del subsistema.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Taxonomia y clasificacion](../../00-introduccion/05-taxonomia-y-clasificacion.md) | [🏠 Inicio](../../index.md) | [abstract-factory.puml ▶](diagramas/04-abstract-factorypuml.md) |
