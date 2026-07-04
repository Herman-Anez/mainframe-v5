# abstract-factory.puml

A continuación el código en PlantUML para el diagrama de clases de Abstract Factory (puedes guardarlo como archivo `.puml` y renderizarlo con herramientas compatibles).

```plantuml
@startuml
title Abstract Factory - Estructura Genérica

' Productos abstractos
abstract class AbstractProductA
abstract class AbstractProductB

' Productos concretos
class ProductA1 extends AbstractProductA
class ProductA2 extends AbstractProductA
class ProductB1 extends AbstractProductB
class ProductB2 extends AbstractProductB

' Fábrica abstracta
abstract class AbstractFactory {
    + createProductA() : AbstractProductA
    + createProductB() : AbstractProductB
}

' Fábricas concretas
class ConcreteFactory1 extends AbstractFactory {
    + createProductA() : AbstractProductA
    + createProductB() : AbstractProductB
}
class ConcreteFactory2 extends AbstractFactory {
    + createProductA() : AbstractProductA
    + createProductB() : AbstractProductB
}

' Relaciones de creación (dependencias)
ConcreteFactory1 ..> ProductA1 : <<crea>>
ConcreteFactory1 ..> ProductB1 : <<crea>>
ConcreteFactory2 ..> ProductA2 : <<crea>>
ConcreteFactory2 ..> ProductB2 : <<crea>>

' El cliente usa solo abstracciones
class Client {
    - factory : AbstractFactory
    - productA : AbstractProductA
    - productB : AbstractProductB
    + Client(factory: AbstractFactory)
}
Client --> AbstractFactory
Client --> AbstractProductA
Client --> AbstractProductB

@enduml
```

Si quieres el diagrama más específico del ejemplo GUI (con `GUIFactory`, `WinFactory`, etc.), aquí está:

```plantuml
@startuml
title Abstract Factory - Ejemplo GUI

interface Button {
    + render() : void
}
interface Window {
    + render() : void
}

class WinButton implements Button
class MacButton implements Button
class WinWindow implements Window
class MacWindow implements Window

interface GUIFactory {
    + createButton() : Button
    + createWindow() : Window
}

class WinFactory implements GUIFactory
class MacFactory implements GUIFactory

WinFactory ..> WinButton : <<crea>>
WinFactory ..> WinWindow : <<crea>>
MacFactory ..> MacButton : <<crea>>
MacFactory ..> MacWindow : <<crea>>

class Application {
    - button : Button
    - window : Window
    + Application(factory: GUIFactory)
    + render() : void
}
Application --> GUIFactory
Application --> Button
Application --> Window

@enduml
```

Este diagrama refleja directamente la implementación Java y Python mostrada.

---

Si deseas que continúe con los siguientes archivos del patrón Builder o cualquier otro, házmelo saber.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Abstract factory](../01-abstract-factory.md) | [🏠 Inicio](../../../index.md) | [Abstract factory java ▶](../ejemplos/02-abstract-factory-java.md) |
