# Factory method

## 1. Nombre y clasificación
- **Nombre**: Factory Method (Método de Fábrica)
- **Clasificación GoF**: Creacional, de clase (usa herencia para delegar la instanciación)

## 2. Propósito
Definir una interfaz para crear un objeto, pero dejar que las **subclases decidan qué clase instanciar**. Permite que una clase delegue la responsabilidad de la instanciación a sus subclases, evitando el acoplamiento directo con clases concretas.

## 3. Motivación
Considera un framework de logística que gestiona el transporte de mercancías. La clase `Logistics` conoce *cuándo* debe crear un medio de transporte, pero no *qué tipo* concreto de transporte se necesita (camión, barco, avión). Si el código de `Logistics` instanciara directamente `new Truck()`, quedaría rígido y no se podría reutilizar para logística marítima.  
Factory Method resuelve esto definiendo un método abstracto `createTransport()` en `Logistics` que devuelve un objeto `Transport`. Las subclases concretas (`RoadLogistics`, `SeaLogistics`) sobrescriben este método para devolver `Truck` o `Ship` respectivamente. El código base de `Logistics` opera sobre la interfaz `Transport` sin conocer la clase concreta.

## 4. Aplicabilidad
Usa Factory Method cuando:
- Una clase no puede anticipar la clase de objetos que debe crear.
- Una clase quiere que sus subclases especifiquen los objetos que crean (inversión de control).
- Se necesita localizar el conocimiento de qué clase concreta se instancia en un único punto (las subclases), en lugar de dispersarlo por todo el código.
- Las clases concretas de los objetos pueden variar, pero el resto del código debe permanecer estable.

## 5. Estructura
```
┌─────────────────────┐
│     Creator         │
├─────────────────────┤
│ + someOperation()   │
│ + factoryMethod(): Product │ (abstracto o por defecto)
└─────────────────────┘
           △
           │
┌─────────────────────┐
│  ConcreteCreator    │
├─────────────────────┤
│ + factoryMethod(): Product │
└─────────────────────┘
           │ (crea)
           ▼
┌─────────────────────┐
│     Product         │ (interfaz)
├─────────────────────┤
└─────────────────────┘
           △
           │
┌─────────────────────┐
│  ConcreteProduct    │
├─────────────────────┤
└─────────────────────┘
```
- `someOperation()` es el método que utiliza el factory method. Invoca `factoryMethod()` y luego trabaja con el producto devuelto a través de la interfaz `Product`.
- `factoryMethod()` puede ser abstracto o tener una implementación por defecto que devuelva un producto concreto genérico.

> [!TIP]
> Código de diagrama disponible en [PlantUML](diagramas/04-factory-methodpuml.md).

## 6. Participantes
- **Product** (`Transport`): define la interfaz de los objetos que crea el Factory Method.
- **ConcreteProduct** (`Truck`, `Ship`): implementa la interfaz `Product`.
- **Creator** (`Logistics`): declara el Factory Method, el cual devuelve un objeto de tipo `Product`. También puede contener otros métodos que operan sobre `Product`.
- **ConcreteCreator** (`RoadLogistics`, `SeaLogistics`): sobrescribe el Factory Method para devolver una instancia de un `ConcreteProduct` específico.

## 7. Colaboraciones
- El código del `Creator` (por ejemplo, el método `planDelivery()`) llama a `factoryMethod()` para obtener un objeto `Product`. El `Creator` depende únicamente de la interfaz `Product`.
- Las subclases concretas del `Creator` proporcionan la implementación del Factory Method que instancia el producto apropiado.
- El cliente externo puede trabajar directamente con `Creator` o con sus subclases, pero el mecanismo de creación está encapsulado en el Factory Method.

## 8. Consecuencias
**Ventajas:**
- **Desacoplamiento**: El código del `Creator` no está acoplado a las clases concretas de los productos. Solo depende de la interfaz `Product`.
- **Principio Open/Closed**: Se pueden introducir nuevos productos creando nuevas subclases de `Creator`, sin modificar el código existente del creador base ni del resto de los clientes.
- **Responsabilidad única (SRP)**: Separa la lógica de negocio del creador de la responsabilidad de creación del producto concreto. Cada subclase creadora se encarga de instanciar un producto específico.
- **Flexibilidad**: Permite personalizar el proceso de creación en las subclases (por ejemplo, usando un Singleton, caching, etc.).

**Desventajas:**
- **Explosión de subclases**: Para cada nuevo producto concreto, se podría necesitar una nueva subclase de `Creator`, lo que conduce a jerarquías paralelas (Productos ↔ Creadores). Esto puede ser excesivo si los productos no varían de forma independiente.
- **Rigidez cuando el creador necesita múltiples productos**: Si el `Creator` requiere crear varios tipos de objetos diferentes, puede necesitar múltiples Factory Methods, complicando la jerarquía de creadores.
- **En lenguajes modernos**, muchas veces se prefiere usar funciones de creación parametrizadas o inyección de dependencias, evitando la herencia.

## 9. Implementación
**a) Factory Method abstracto vs con implementación por defecto**
- *Abstracto*: Obliga a las subclases a proporcionar una implementación. Se usa cuando no tiene sentido un producto por defecto.
- *Con implementación por defecto*: La clase `Creator` proporciona un producto estándar; las subclases pueden sobrescribirlo si necesitan otro.

**b) Factory Method parametrizado**
El método de fábrica puede recibir un parámetro (por ejemplo, un `String` o un `enum`) que identifique el producto a crear. El `Creator` usa una estructura condicional para instanciar la clase concreta. Esto reduce la necesidad de subclases, pero a costa de romper el principio Open/Closed (si se añaden nuevos productos hay que modificar el método).

**c) Uso de genéricos (Java/C#)**
Se puede tipar el método de fábrica para que devuelva un tipo específico sin perder seguridad. Ejemplo: `protected abstract T createProduct();`

**d) Factory Method y Template Method**
Frecuentemente, `someOperation()` en el `Creator` sigue la estructura de un **Template Method**: define un esqueleto de algoritmo que invoca `factoryMethod()` en un paso determinado. Esta combinación es poderosa y muy común en frameworks.

**e) Reemplazo con funciones (lambdas)**
En lenguajes con soporte funcional, se puede inyectar un `Supplier<Product>` en lugar de forzar la herencia. Esto reduce la necesidad del patrón clásico, pero la intención (crear objetos delegando en otro componente) es la misma.

## 10. Código de ejemplo
(Ver ejemplos de implementación en [Java](ejemplos/02-factory-method-java.md) y [Python](ejemplos/03-factory-method-python.md).)

## 11. Usos conocidos
- **Java Collection Framework**: El método `iterator()` en `Collection` es un Factory Method: cada colección concreta (`ArrayList`, `HashSet`) devuelve un iterador específico.
- **Spring Framework**: Los métodos `getObject()` en `FactoryBean` implementan el patrón.
- **JDBC**: El método `createStatement()` de `Connection` es un Factory Method que devuelve implementaciones específicas según el driver de base de datos.
- **JaxbContext.newInstance()**: Crea objetos `JAXBContext` adecuados al contexto.
- **Frameworks de UI**: `Application` crea documentos, herramientas, etc., mediante Factory Methods que son implementados por las aplicaciones concretas.

## 12. Patrones relacionados
- **Abstract Factory**: A menudo implementado con Factory Methods. La diferencia es que Abstract Factory crea **familias** de productos, mientras que Factory Method crea **un solo** producto.
- **Template Method**: Es muy común que el creador utilice Template Method para invocar el Factory Method. De hecho, Factory Method es una especialización de Template Method donde el paso variable es la creación de un objeto.
- **Prototype**: En lugar de heredar, se puede usar composición con un prototipo. El creador clonaría el prototipo en lugar de delegar en subclases.
- **Builder**: Builder se enfoca en la construcción paso a paso de objetos complejos; Factory Method se enfoca en delegar la creación de un objeto entero a una subclase.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Builder python](../02-builder/ejemplos/03-builder-python.md) | [🏠 Inicio](../../index.md) | [factory-method.puml ▶](diagramas/04-factory-methodpuml.md) |
