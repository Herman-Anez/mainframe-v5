# template-method.puml

## Diagrama genérico del patrón Template Method

```plantuml
@startuml
title Template Method - Estructura Genérica

abstract class AbstractClass {
    + templateMethod()
    # {abstract} primitiveOperation1()
    # {abstract} primitiveOperation2()
    # hook() (opcional)
}

class ConcreteClass extends AbstractClass {
    # primitiveOperation1()
    # primitiveOperation2()
}

note right of AbstractClass::templateMethod
  Esqueleto del algoritmo:
  primitiveOperation1();
  primitiveOperation2();
  hook();
end note
@enduml
```

## Diagrama del ejemplo de minería de datos

```plantuml
@startuml
title Template Method - Ejemplo Minería de Datos

abstract class DataMiner {
    + mine(filePath : String)
    # openFile(path : String)
    # closeFile(path : String)
    # generateReport(analysis : String)
    # {abstract} readData() : String
    # {abstract} analyzeData(rawData : String) : String
}

class CsvMiner extends DataMiner {
    # readData() : String
    # analyzeData(rawData : String) : String
}

class JsonMiner extends DataMiner {
    # readData() : String
    # analyzeData(rawData : String) : String
    # generateReport(analysis : String)
}

note right of DataMiner::mine
  Esqueleto del algoritmo:
  openFile();
  readData();
  analyzeData();
  generateReport();
  closeFile();
end note
@enduml
```

Queda solo un patrón: ¿vamos con **Visitor**, el último de los 23?

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Template method](../01-template-method.md) | [🏠 Inicio](../../../index.md) | [Template method java ▶](../ejemplos/02-template-method-java.md) |
