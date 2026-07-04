# Prototype

## 1. Nombre y clasificación
- **Nombre**: Prototype (Prototipo)
- **Clasificación GoF**: Creacional, de objeto

## 2. Propósito
Especificar los tipos de objetos a crear usando una **instancia prototípica** y crear nuevos objetos copiando este prototipo. En lugar de instanciar clases concretas con `new`, el sistema clona un objeto preexistente que sirve como modelo.

## 3. Motivación
Imagina un editor de presentaciones con una biblioteca de elementos gráficos (formas, iconos, diagramas). El usuario puede insertar nuevos elementos a partir de una paleta de plantillas. Si para cada tipo de figura (círculo rojo grande, rectángulo azul con borde, estrella verde…) tuviéramos que instanciar la clase concreta correspondiente, el código de la paleta se acoplaría a decenas de clases.  
Además, algunos objetos pueden tener un estado inicial complejo (configuración de degradados, fuentes, datos precargados) que es costoso recalcular en cada creación.  
Prototype resuelve esto haciendo que cada "plantilla" de la paleta sea un objeto prototípico completamente configurado. Al solicitar un nuevo elemento, el editor simplemente **clona** el prototipo correspondiente. El código cliente no necesita conocer la clase concreta; solo sabe que el objeto sabe clonarse a sí mismo.

## 4. Aplicabilidad
Usa Prototype cuando:
- Un sistema debe ser independiente de cómo se crean, componen y representan sus productos.
- Las clases a instanciar se especifican en tiempo de ejecución (por ejemplo, cargando prototipos desde una configuración).
- Quieres evitar construir una jerarquía de fábricas paralela a la jerarquía de productos.
- Crear un objeto desde cero es costoso y prefieres **clonar** un objeto existente con un estado similar, modificando solo lo necesario.
- Las instancias de una clase pueden tener pocos estados iniciales, y es más cómodo tener prototipos predefinidos que instanciar con parámetros repetitivos.

## 5. Estructura
```
┌────────────────┐         ┌─────────────────────┐
│    Client      │         │     Prototype       │ (interfaz)
│                │         ├─────────────────────┤
└────────────────┘         │ + clone() : Prototype│
        │                  └─────────────────────┘
        │                              △
        │                              │
        │              ┌───────────────┴───────────────┐
        │              │                               │
        │   ConcretePrototypeA          ConcretePrototypeB
        │   + clone() : Prototype       + clone() : Prototype
        │              │                               │
        └──────────────┼───────────────────────────────┘
                       │  (el cliente clona los prototipos)
```

A menudo existe un **Prototype Manager** que almacena un registro de prototipos (diccionario clave → prototipo). El cliente pide al manager un prototipo por clave y luego lo clona.

```
Client ──> PrototypeManager ──(almacena)──> Prototype
                │
                └── getPrototype(clave) → devuelve clone del prototipo
```

> [!TIP]
> Código de diagrama disponible en [PlantUML](diagramas/04-prototypepuml.md).

## 6. Participantes
- **Prototype** (`Shape`): Interfaz o clase abstracta que declara un método `clone()`.
- **ConcretePrototype** (`Circle`, `Rectangle`): Implementa la operación `clone()` para crear una copia de sí mismo.
- **Client**: Crea nuevos objetos solicitando al prototipo que se clone a sí mismo.
- **PrototypeManager** (opcional pero frecuente): Almacena un catálogo de prototipos, permitiendo al cliente buscarlos y clonarlos por nombre o identificador.

## 7. Colaboraciones
- El cliente (o un Prototype Manager) mantiene referencias a instancias prototípicas.
- Cuando el cliente necesita un nuevo objeto, invoca `clone()` sobre el prototipo adecuado.
- El prototipo concreto devuelve una copia de sí mismo. Dependiendo de la implementación, puede ser una copia superficial (*shallow copy*) o una copia profunda (*deep copy*).
- El cliente puede modificar la copia obtenida (por ejemplo, cambiar su posición o color) sin afectar al prototipo original.

## 8. Consecuencias
**Ventajas:**
- **Ocultación de clases concretas**: El cliente no necesita conocer los nombres ni la estructura de las clases concretas; solo trabaja con prototipos.
- **Configuración dinámica**: Los prototipos pueden añadirse, modificarse o eliminarse en tiempo de ejecución, lo que permite una flexibilidad que las fábricas basadas en herencia no ofrecen.
- **Evita la explosión de jerarquías de fábricas**: A diferencia de Abstract Factory, no se necesita una clase fábrica por cada familia de productos. El prototipo actúa como su propia fábrica.
- **Mejora de rendimiento**: Clonar un objeto es a menudo más rápido que construirlo desde cero, especialmente si el objeto tiene un estado inicial costoso de calcular (conexiones, precarga de datos, inicialización gráfica).

**Desventajas:**
- **Complejidad en la clonación**: Cada subclase debe implementar `clone()`. Implementar una copia profunda correcta puede ser muy complejo, especialmente cuando hay estructuras recursivas, referencias circulares o recursos externos (sockets, archivos abiertos).
- **Problemas de encapsulación**: El método `clone()` puede necesitar acceso a detalles internos del objeto (campos privados) para copiarlos correctamente.
- **Manejo de identidad**: Algunos objetos tienen identidad única que no debe copiarse (ID de base de datos, contadores globales). La clonación debe restablecer estos valores adecuadamente.

## 9. Implementación
**a) Clonación superficial vs profunda**
- *Shallow copy*: Copia el objeto pero comparte las referencias a objetos internos. Si el original modifica un objeto interno, la copia también ve el cambio. Es adecuada cuando los objetos internos son inmutables o compartirlos es deseable.
- *Deep copy*: Copia el objeto y recursivamente todos los objetos a los que hace referencia. Es lo más seguro, pero computacionalmente costoso y propenso a errores en ciclos.
- La decisión depende del caso de uso. El patrón no prescribe una; la documentación debe explicitar qué tipo de copia se realiza.

**b) Inicialización del prototipo**
Los prototipos pueden inicializarse de muchas formas:
- Cargando desde un archivo de configuración (XML, JSON).
- Construyéndolos por código en un punto de arranque.
- Mediante un `PrototypeManager` que los registra al inicio.

**c) Uso de serialización para clonación profunda**
En lenguajes como Java o Python, una forma genérica de implementar `clone()` profundo es serializar el objeto a bytes y deserializarlo. Esto evita escribir lógica de copia a mano, pero tiene un coste de rendimiento y requiere que todas las partes sean serializables.

**d) Manejando recursos externos**
Si el prototipo posee recursos como conexiones de red o archivos abiertos, el método `clone()` no debe duplicarlos tal cual; normalmente se restablecen (se cierran en la copia y se dejan sin inicializar, o se crean nuevos recursos).

**e) Prototype Manager**
Puede implementarse como un Singleton que contiene un mapa (`HashMap<String, Prototype>`). Al solicitar un prototipo por clave, devuelve un clon del prototipo almacenado (o el mismo prototipo si el cliente lo clonará después). Esto centraliza la gestión.

**f) Prototype vs otros patrones creacionales**
- **Abstract Factory** puede usar Prototype internamente para crear productos sin necesidad de una clase fábrica por familia.
- **Factory Method** usa herencia; Prototype usa composición (el prototipo se pasa al creador). Son intercambiables en muchos contextos.

## 10. Código de ejemplo
(Ver ejemplos de implementación en [Java](ejemplos/02-prototype-java.md) y [Python](ejemplos/03-prototype-python.md).)

## 11. Usos conocidos
- **Frameworks de edición gráfica**: La paleta de herramientas en editores como Visio o draw.io clona prototipos de formas para añadirlos al lienzo.
- **Java `Object.clone()` y `Cloneable`**: Aunque obsoleto y problemático, fue la implementación nativa de Prototype en Java. Hoy se prefieren copy constructors o builders.
- **Spring Framework**: Los *scopes* de beans permiten definir un bean como `prototype`, de modo que cada vez que se solicita se crea una nueva instancia (aunque Spring no usa `clone()`, la idea es la misma).
- **Librerías de manipulación de documentos** (Apache POI, iText): Crean nuevas instancias de estilos, fuentes, etc., clonando objetos preconfigurados.
- **Videojuegos**: Creación de enemigos, balas o efectos especiales a partir de prototipos predefinidos (spawners).

## 12. Patrones relacionados
- **Abstract Factory**: Puede almacenar prototipos y clonarlos en lugar de crear productos con `new`. Ofrece más flexibilidad dinámica que la implementación clásica de Abstract Factory.
- **Factory Method**: Ambos delegan la creación, pero Factory Method usa herencia y Prototype usa composición (el prototipo es una instancia que sabe clonarse).
- **Builder**: Construye objetos paso a paso; Prototype los crea de golpe por clonación.
- **Composite y Decorator**: A menudo se usan con Prototype, porque clonar estructuras complejas (árboles, objetos envueltos) puede ser mucho más eficiente que recrearlas.
- **Memento**: Captura el estado interno para restaurarlo después; Prototype puede clonar el estado actual como punto de partida para futuras operaciones.
- **Singleton**: El Prototype Manager suele ser un Singleton.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Factory method python](../03-factory-method/ejemplos/03-factory-method-python.md) | [🏠 Inicio](../../index.md) | [prototype.puml ▶](diagramas/04-prototypepuml.md) |
