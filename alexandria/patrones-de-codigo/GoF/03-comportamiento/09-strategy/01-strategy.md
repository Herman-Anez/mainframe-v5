# Strategy

## 1. Nombre y clasificación
- **Nombre**: Strategy (Estrategia)
- **Clasificación GoF**: Comportamiento, de objeto

## 2. Propósito
**Definir una familia de algoritmos, encapsular cada uno de ellos y hacerlos intercambiables.** El patrón Strategy permite que el algoritmo varíe independientemente de los clientes que lo utilizan. El cliente elige la estrategia adecuada y la inyecta en el contexto, que delega en ella la ejecución del algoritmo.

## 3. Motivación
Considera un sistema de procesamiento de pagos en una tienda en línea. Un carrito de la compra debe permitir pagar con distintos métodos: tarjeta de crédito, PayPal, transferencia bancaria, etc. Cada método tiene un algoritmo de pago diferente (validación de datos, llamada a API externa, cálculo de comisiones). Si se implementara toda la lógica dentro del carrito con condicionales (`if (tipo == "credito") ... else if (tipo == "paypal") ...`), el código sería frágil, difícil de extender y violaría el principio Open/Closed.

El patrón Strategy resuelve esto definiendo una interfaz común `PaymentStrategy` con un método `pay(amount)`. Cada método de pago concreto implementa esta interfaz con su propio algoritmo. El carrito (`ShoppingCart`, el contexto) mantiene una referencia a una `PaymentStrategy` y delega la acción de pago. El cliente (o la configuración) selecciona la estrategia deseada y la asigna al carrito. Añadir un nuevo método de pago solo requiere crear una nueva clase que implemente `PaymentStrategy`, sin modificar el carrito ni las estrategias existentes.

## 4. Aplicabilidad
Usa Strategy cuando:
- Necesitas múltiples variantes de un algoritmo y quieres que el cliente pueda elegir entre ellas en tiempo de ejecución.
- Una clase define muchos comportamientos que aparecen como múltiples sentencias condicionales. Strategy mueve cada rama a una clase separada.
- Quieres aislar la lógica del algoritmo de los datos del contexto, permitiendo que ambos varíen independientemente.
- Los algoritmos son costosos y complejos; encapsularlos mejora la legibilidad y el mantenimiento.

## 5. Estructura
```
┌──────────────────────┐         ┌──────────────────────┐
│       Context        │         │       Strategy       │ (interfaz)
├──────────────────────┤         ├──────────────────────┤
│ - strategy : Strategy│         │ + algorithmInterface()│
│ + setStrategy(s)     │         └──────────────────────┘
│ + executeStrategy()  │                     △
└──────────────────────┘                     │
           │                  ┌──────────────┴──────────────┐
           │                  │                             │
           ▼          ConcreteStrategyA           ConcreteStrategyB
    (el contexto usa)  + algorithmInterface()     + algorithmInterface()
```
El contexto no conoce la estrategia concreta; solo depende de la interfaz. El cliente configura el contexto con la estrategia deseada. Cuando se necesita el algoritmo, el contexto delega en la estrategia.

> [!TIP]
> Código de diagrama disponible en [PlantUML](diagramas/04-strategypuml.md).

## 6. Participantes
- **Strategy** (`PaymentStrategy`): Declara una interfaz común para todos los algoritmos soportados. El contexto usa esta interfaz para invocar el algoritmo definido por una `ConcreteStrategy`.
- **ConcreteStrategy** (`CreditCardPayment`, `PayPalPayment`): Implementa la interfaz `Strategy` con un algoritmo específico.
- **Context** (`ShoppingCart`): Se configura con un objeto `ConcreteStrategy`. Mantiene una referencia a `Strategy`. Puede definir una interfaz que permita a la estrategia acceder a sus datos (si es necesario, aunque lo ideal es pasar los datos como parámetro en el método de la estrategia).

## 7. Colaboraciones
- El cliente crea un objeto `ConcreteStrategy` y lo pasa al contexto (por constructor o setter).
- Cuando el contexto necesita ejecutar el algoritmo, llama a `strategy.algorithmInterface()`.
- La estrategia concreta ejecuta el algoritmo usando los parámetros recibidos y, opcionalmente, devuelve un resultado.
- El contexto no conoce la estrategia concreta; solo la interfaz.

## 8. Consecuencias
**Ventajas:**
- **Fácil de extender**: Nuevas estrategias pueden añadirse sin modificar el contexto ni las estrategias existentes (OCP).
- **Elimina condicionales complejas**: Desaparecen los `if`/`switch` para elegir el comportamiento.
- **Principio de responsabilidad única (SRP)**: Separa la responsabilidad del algoritmo de la del contexto.
- **Reutilización de estrategias**: Las estrategias se pueden reutilizar en diferentes contextos.
- **Permite cambiar el algoritmo en tiempo de ejecución**: Simplemente asignando una nueva estrategia.

**Desventajas:**
- **El cliente debe conocer las estrategias**: Para elegir la estrategia correcta, el cliente debe entender en qué se diferencian. Esto puede implicar exponer al cliente a detalles de implementación.
- **Aumenta el número de objetos**: Cada estrategia es una clase nueva. Si hay muchos algoritmos, el número de clases crece.
- **Comunicación entre contexto y estrategia**: Si la estrategia necesita datos del contexto, se deben pasar como parámetros (lo cual es ideal) o dar acceso al contexto, lo que puede aumentar el acoplamiento.
- **Sobrecarga si solo hay pocas variantes**: Si solo hay dos o tres variantes que rara vez cambian, el patrón puede ser innecesario.

## 9. Implementación
**a) Paso de datos del contexto a la estrategia**
- **Parámetros en el método**: La interfaz `Strategy` declara un método con los parámetros necesarios (p.ej., `pay(amount)`). El contexto pasa los datos cuando invoca. Ventaja: mínimo acoplamiento; la estrategia no conoce al contexto.
- **El contexto se pasa a sí mismo**: La estrategia recibe una referencia al contexto y obtiene los datos que necesita mediante getters. Desventaja: acopla la estrategia al contexto (aunque sea a su interfaz pública).

**b) Estrategias sin estado (stateless)**
Si las estrategias no mantienen estado interno, pueden compartirse como objetos únicos (Singleton o Flyweight) para ahorrar memoria.

**c) Estrategias con estado**
Si una estrategia necesita mantener estado entre invocaciones, cada contexto debe tener su propia instancia.

**d) Configuración de la estrategia**
Normalmente mediante constructor o setter en el contexto. También se puede inyectar mediante inyección de dependencias.

**e) Strategy vs State**
- **State**: Las transiciones entre estados ocurren internamente y los estados pueden provocar cambios de estado en el contexto. El cliente normalmente no conoce el estado concreto.
- **Strategy**: El cliente elige explícitamente la estrategia y la inyecta. Las estrategias no provocan transiciones a otras estrategias (normalmente).
- Aunque estructuralmente son casi idénticos, la intención es diferente.

**f) Alternativas funcionales**
En lenguajes con lambdas y funciones de orden superior, una estrategia puede ser simplemente una función o un `Consumer`/`Function`. Esto elimina la necesidad de crear múltiples clases cuando el algoritmo es simple.

## 10. Código de ejemplo
(Ver ejemplos de implementación en [Java](ejemplos/02-strategy-java.md) y [Python](ejemplos/03-strategy-python.md).)

## 11. Usos conocidos
- **Java `Comparator`**: Define una familia de algoritmos de comparación. Se pasa a `Collections.sort()` o `Arrays.sort()` como estrategia.
- **Spring Framework**: `PlatformTransactionManager` es una estrategia para gestionar transacciones; las implementaciones concretas son `DataSourceTransactionManager`, `JtaTransactionManager`, etc.
- **Autenticación en aplicaciones**: Diferentes estrategias de autenticación (OAuth, JWT, BasicAuth) que se seleccionan según configuración.
- **Compresión de archivos**: Diferentes algoritmos (ZIP, GZIP, BZIP2) encapsulados como estrategias.
- **Sistemas de envío de notificaciones**: Estrategias para enviar por email, SMS, push, etc.

## 12. Patrones relacionados
- **State**: Estructura similar, pero los estados cambian internamente; las estrategias son intercambiadas externamente por el cliente.
- **Flyweight**: Las estrategias pueden ser flyweights si no tienen estado.
- **Abstract Factory**: Puede usarse para crear familias de estrategias relacionadas.
- **Template Method**: Template Method usa herencia para variar parte del algoritmo; Strategy usa composición. A menudo Strategy es más flexible.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ State python](../08-state/ejemplos/03-state-python.md) | [🏠 Inicio](../../index.md) | [strategy.puml ▶](diagramas/04-strategypuml.md) |
