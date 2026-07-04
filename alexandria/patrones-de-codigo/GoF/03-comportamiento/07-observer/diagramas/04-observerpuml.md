# observer.puml

## Diagrama genérico del patrón Observer

```plantuml
@startuml
title Observer - Estructura Genérica

abstract class Subject {
    - observers : List<Observer>
    + attach(o : Observer)
    + detach(o : Observer)
    + notify()
}

class ConcreteSubject extends Subject {
    - state
    + getState()
    + setState()
}

interface Observer {
    + update()
}

class ConcreteObserverA implements Observer {
    - subject : ConcreteSubject
    + update()
}

class ConcreteObserverB implements Observer {
    - subject : ConcreteSubject
    + update()
}

Subject o-- Observer : notifica
ConcreteObserverA --> ConcreteSubject : consulta (pull)
ConcreteObserverB --> ConcreteSubject
@enduml
```

## Diagrama del ejemplo de la estación meteorológica

```plantuml
@startuml
title Observer - Ejemplo Estación Meteorológica

abstract class Subject {
    + attach(o : Observer)
    + detach(o : Observer)
    + notifyObservers()
}

class WeatherData extends Subject {
    - temperature : float
    - humidity : float
    - pressure : float
    + getTemperature() : float
    + getHumidity() : float
    + getPressure() : float
    + setMeasurements(t, h, p)
}

interface Observer {
    + update()
}

class CurrentConditionsDisplay implements Observer {
    - weatherData : WeatherData
    + update()
}

class ForecastDisplay implements Observer {
    - weatherData : WeatherData
    + update()
}

WeatherData o-- Observer : notifica
CurrentConditionsDisplay --> WeatherData : consulta
ForecastDisplay --> WeatherData : consulta
@enduml
```

¿Continuamos con **State**?

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Observer](../01-observer.md) | [🏠 Inicio](../../../index.md) | [Observer java ▶](../ejemplos/02-observer-java.md) |
