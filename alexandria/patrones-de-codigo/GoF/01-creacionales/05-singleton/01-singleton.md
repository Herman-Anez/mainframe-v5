# Singleton

## 1. Nombre y clasificación
- **Nombre**: Singleton (Instancia única)
- **Clasificación GoF**: Creacional, de objeto

## 2. Propósito
Garantizar que una clase tenga **exactamente una instancia** y proporcionar un punto de acceso global a ella. El propio patrón controla que no se creen múltiples instancias y ofrece el mecanismo para obtener la única instancia existente.

## 3. Motivación
En muchos sistemas, ciertos objetos deben ser únicos por su propia naturaleza:
- Un gestor de configuración que carga y mantiene los parámetros de la aplicación.
- Un *spooler* de impresión que coordina todas las solicitudes de impresión.
- Un *pool* de conexiones a base de datos que debe ser compartido.
- Un registro de log (logger) que centraliza la escritura de trazas.

Si la unicidad no se impone a nivel de clase, el código cliente podría crear múltiples instancias accidentalmente, provocando inconsistencias, conflictos de recursos o estados corruptos.  
El patrón Singleton encapsula la responsabilidad de controlar la instanciación dentro de la propia clase, haciendo que el constructor sea privado y exponiendo un método estático que devuelve la única instancia (creándola si aún no existe).

## 4. Aplicabilidad
Usa Singleton cuando:
- Debe existir exactamente una instancia de una clase, y debe ser accesible para los clientes desde un punto de acceso conocido.
- La única instancia debería ser extensible mediante herencia, y los clientes deberían poder usar la instancia extendida sin modificar su código (Singleton con registro).
- Necesitas un control estricto sobre cómo y cuándo los clientes acceden a la instancia (por ejemplo, inicialización *lazy* con seguridad en hilos).

## 5. Estructura
```
┌───────────────────────────────┐
│          Singleton            │
├───────────────────────────────┤
│ - instance : Singleton (static)│
│ - Singleton()  (privado)      │
│ + getInstance() : Singleton   │ (static)
│ + operation()                 │
└───────────────────────────────┘
```

- El constructor es privado para impedir la instanciación externa.
- El atributo `instance` mantiene la única instancia de la clase, normalmente inicializado bajo demanda.
- El método estático `getInstance()` controla el acceso y la creación; devuelve la instancia única.

> [!TIP]
> Código de diagrama disponible en [PlantUML](diagramas/04-singletonpuml.md).

## 6. Participantes
- **Singleton**: Define el método estático `getInstance()` que permite a los clientes acceder a la única instancia. Es responsable de crear y gestionar su propia instancia única. Puede contener la lógica de negocio que debe ser accedida globalmente.

## 7. Colaboraciones
Los clientes acceden a la instancia Singleton exclusivamente a través de `Singleton.getInstance()`. Ningún cliente puede crear una instancia directamente porque el constructor es inaccesible (privado). El método `getInstance()` asegura que todos los clientes compartan la misma y única instancia.

## 8. Consecuencias
**Ventajas:**
- **Acceso controlado a la instancia única**: La clase Singleton tiene el control total sobre cómo y cuándo los clientes acceden a ella.
- **Evita las variables globales**: En lugar de almacenar estado en variables globales (que contaminan el espacio de nombres y no controlan la unicidad), se encapsula en una clase que garantiza una sola instancia.
- **Permite herencia y polimorfismo (Singleton con registro)**: Se puede diseñar una jerarquía de Singletons donde `getInstance()` devuelva diferentes subclases según configuración, manteniendo el acceso unificado.
- **Inicialización perezosa (lazy)**: La instancia puede crearse solo cuando se necesita por primera vez, ahorrando recursos si nunca se llega a usar.
- **Número de instancias controlado**: El patrón puede generalizarse para permitir un número fijo de instancias (Multiton), aunque esa ya no es la intención clásica.

**Desventajas:**
- **Dificulta las pruebas unitarias**: El estado global que persiste entre pruebas puede causar efectos colaterales no deseados. Los frameworks de testing deben poder reiniciar el Singleton entre tests, lo cual es complicado.
- **Viola el Principio de Responsabilidad Única (SRP)**: La clase se encarga tanto de su lógica de negocio como de controlar su propia creación y ciclo de vida.
- **Acoplamiento oculto**: Cualquier clase que llame a `Singleton.getInstance()` queda fuertemente acoplada a la implementación concreta del Singleton, lo que dificulta reemplazarlo por otra implementación (por ejemplo, en un mock). Este acoplamiento se vuelve invisible porque no aparece en los parámetros del constructor.
- **Problemas de concurrencia**: En entornos multihilo, la inicialización perezosa debe implementarse cuidadosamente para evitar condiciones de carrera que creen múltiples instancias. Las soluciones correctas (sincronización, double-checked locking) añaden complejidad y posibles cuellos de botella.
- **Dificultad para gestionar el ciclo de vida**: ¿Cuándo se destruye la instancia? En lenguajes con recolección de basura, si no hay referencias, puede ser recolectada, perdiendo el Singleton. En otros entornos, gestionar la destrucción ordenada es problemático.

## 9. Implementación
**a) Inicialización temprana (eager)**
La instancia se crea en el momento de la carga de la clase (inicializador estático). Es simple y segura en entornos multihilo, pero pierde la posibilidad de inicialización perezosa.
```java
private static final Singleton INSTANCE = new Singleton();
public static Singleton getInstance() { return INSTANCE; }
```

**b) Inicialización perezosa (lazy) sin sincronización**
Solo es apto para entornos monohilo. En entornos multihilo pueden crearse múltiples instancias.
```java
private static Singleton instance;
public static Singleton getInstance() {
    if (instance == null) instance = new Singleton();
    return instance;
}
```

**c) Sincronización simple**
`getInstance()` se declara `synchronized`. Es correcto, pero cada llamada paga el coste de la sincronización, incluso después de creada la instancia.
```java
public static synchronized Singleton getInstance() { ... }
```

**d) Double-Checked Locking (DCL)**
Reduce la sincronización a solo la primera creación, verificando dos veces el `null` (una sin bloqueo y otra dentro del bloque sincronizado). En Java, la variable `instance` debe ser `volatile` para garantizar la visibilidad correcta entre hilos (el *happens-before* de la inicialización).
```java
private static volatile Singleton instance;
public static Singleton getInstance() {
    if (instance == null) {
        synchronized (Singleton.class) {
            if (instance == null) {
                instance = new Singleton();
            }
        }
    }
    return instance;
}
```

**e) Clase interna estática (Bill Pugh)**
Aprovecha la inicialización perezosa de las clases internas de Java (solo se cargan al ser referenciadas). Es segura para hilos y no requiere sincronización explícita.
```java
private static class Holder {
    private static final Singleton INSTANCE = new Singleton();
}
public static Singleton getInstance() {
    return Holder.INSTANCE;
}
```

**f) Singleton como Enum (Java)**
Desde Java 5, la forma más segura y concisa. Garantiza unicidad, seguridad en hilos y protección contra serialización y reflexión.
```java
public enum Singleton {
    INSTANCE;
    public void operation() { ... }
}
```

**g) Manejo de serialización**
Si un Singleton clásico implementa `Serializable`, la deserialización crea una nueva instancia. Para evitarlo, se debe implementar el método `readResolve()` que devuelva la instancia única.

**h) Singleton vs Inyección de Dependencias**
Hoy en día, muchos entornos prefieren gestionar la unicidad a través del contenedor de inversión de control (IoC), donde un bean se configura con ámbito *singleton*. Esto delega la responsabilidad de la unicidad al framework, facilitando las pruebas y el desacoplamiento. El patrón GoF se usa menos en aplicaciones nuevas con DI, pero sigue siendo fundamental en contextos restringidos y para entender cómo funcionan los contenedores por debajo.

## 10. Código de ejemplo
(Ver ejemplos de implementación en [Java](ejemplos/02-singleton-java.md) y [Python](ejemplos/03-singleton-python.md).)

## 11. Usos conocidos
- **Java Runtime**: `Runtime.getRuntime()` es un Singleton que da acceso al entorno de ejecución de la JVM.
- **Java Desktop**: `Toolkit.getDefaultToolkit()` y `Desktop.getDesktop()`.
- **Logging**: `java.util.logging.Logger` (aunque normalmente se usa a través de fábricas, internamente hay un gestor único). Muchos frameworks de logging (Log4j, SLF4J) mantienen un repositorio central de loggers.
- **Gestores de configuración**: Un objeto que lee un archivo de propiedades una vez y lo mantiene en memoria.
- **Spring Framework**: Por defecto, los beans se crean con ámbito *singleton* (una instancia por contenedor).

## 12. Patrones relacionados
- **Abstract Factory, Builder, Facade, State**: A menudo estos patrones se implementan como Singletons porque suelen tener estado de configuración y no necesitan múltiples instancias.
- **Prototype**: Un Singleton puede usarse como gestor de prototipos.
- **Monostate**: Variante donde se comparte el estado entre todas las instancias (atributos de clase), pero no se restringe el número de instancias. Da la misma apariencia de unicidad sin el control estricto del Singleton clásico.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Prototype python](../04-prototype/ejemplos/03-prototype-python.md) | [🏠 Inicio](../../index.md) | [singleton.puml ▶](diagramas/04-singletonpuml.md) |
