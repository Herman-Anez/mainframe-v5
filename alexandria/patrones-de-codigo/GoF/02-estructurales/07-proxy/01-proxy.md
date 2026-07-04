# Proxy

## 1. Nombre y clasificación
- **Nombre**: Proxy (Apoderado, también conocido como *Surrogate*)
- **Clasificación GoF**: Estructural, de objeto

## 2. Propósito
**Proporcionar un sustituto o marcador de posición para controlar el acceso a otro objeto.** El proxy actúa como intermediario, implementando la misma interfaz que el objeto real y controlando las peticiones hacia él, ya sea para posponer su creación, controlar los permisos, registrar accesos u optimizar el rendimiento.

## 3. Motivación
Existen numerosos escenarios donde acceder directamente a un objeto no es práctico:
- Un editor de documentos que incrusta imágenes grandes no debería cargarlas todas al abrir el archivo; solo cuando se visualizan (carga diferida).
- Un sistema de banca online debe verificar los permisos del usuario antes de permitirle acceder a los datos de una cuenta.
- Un servicio web que devuelve datos costosos de calcular podría cachear las respuestas y devolver el resultado almacenado si se solicita lo mismo repetidamente.
- Un objeto remoto (en otro servidor) necesita ser representado localmente; el proxy gestiona la comunicación de red.

En todos estos casos, el patrón Proxy introduce un objeto intermediario que implementa la misma interfaz que el objeto real. El cliente no necesita saber si está tratando con el objeto real o con el proxy; la transparencia permite añadir control sin modificar el código cliente ni el objeto real.

## 4. Aplicabilidad
Usa Proxy para controlar el acceso a un objeto en una o varias de las siguientes situaciones:
- **Proxy virtual (lazy loading)**: El objeto real es costoso de crear o cargar, y se quiere retrasar su creación hasta que sea realmente necesario.
- **Proxy de protección**: Se necesita controlar el acceso a un objeto basándose en permisos del cliente.
- **Proxy remoto**: El objeto real está en otro espacio de direcciones (otro proceso, otra máquina); el proxy lo representa localmente y gestiona la comunicación.
- **Proxy de referencia inteligente (smart reference)**: Se desea añadir funcionalidades adicionales al acceder al objeto, como registro de uso, conteo de referencias, o liberación automática de recursos.
- **Proxy de caché**: Almacenar los resultados de operaciones costosas y devolverlos directamente si no han cambiado.

## 5. Estructura
```
        ┌──────────────────────┐
        │       Subject        │ (interfaz común)
        ├──────────────────────┤
        │ + request()          │
        └──────────────────────┘
                    △
                    │
        ┌───────────┴───────────┐
        │                       │
┌──────────────────┐   ┌──────────────────┐
│   RealSubject    │   │      Proxy       │
├──────────────────┤   ├──────────────────┤
│ + request()      │   │ - realSubject    │
└──────────────────┘   │ + request()      │
                       └──────────────────┘
                                │ (accede o crea)
                                ▼
                       ┌──────────────────┐
                       │   RealSubject    │
                       └──────────────────┘
```

- **Subject**: Interfaz común que define la operación `request()`. Tanto `RealSubject` como `Proxy` la implementan.
- **RealSubject**: El objeto real que hace el trabajo pesado o posee los datos. El proxy controla el acceso a él.
- **Proxy**: Mantiene una referencia al `RealSubject` (o sabe cómo obtenerlo). Implementa la misma interfaz `Subject`, así que puede sustituir al `RealSubject` de forma transparente. Controla el acceso antes y/o después de delegar la petición.

> [!TIP]
> Código de diagrama disponible en [PlantUML](diagramas/04-proxypuml.md).

## 6. Participantes
- **Subject** (`Image`, `Account`): Define la interfaz común para `RealSubject` y `Proxy`, permitiendo que cualquiera de los dos pueda ser usado por el cliente.
- **RealSubject** (`RealImage`, `RealAccount`): Define el objeto real que el proxy representa. Contiene la lógica de negocio o los datos reales.
- **Proxy** (`ImageProxy`, `ProtectionProxy`): Mantiene una referencia que le permite acceder al `RealSubject`. Controla el acceso, pudiendo encargarse de la creación, verificación, logging, etc.

## 7. Colaboraciones
- El cliente interactúa con el `Proxy` creyendo que es el `Subject` real (ambos comparten interfaz).
- El `Proxy` recibe la petición, realiza sus tareas de control (comprobar permisos, crear el objeto real si no existe, registrar la llamada) y luego delega en el `RealSubject`.
- Dependiendo del tipo de proxy, el `RealSubject` puede crearse bajo demanda (proxy virtual), o puede estar ya disponible pero protegido (proxy de protección).

## 8. Consecuencias
**Ventajas:**
- **Transparencia**: El cliente no necesita saber si está usando el objeto real o un proxy. Se simplifica el código cliente.
- **Principio de separación de responsabilidades (SRP)**: La lógica de control de acceso, carga diferida o logging se extrae del objeto real y se coloca en el proxy.
- **Principio Open/Closed**: Se puede introducir un proxy sin modificar el `RealSubject` ni el cliente.
- **Optimización de recursos**: Los proxies virtuales evitan la creación de objetos costosos hasta que son imprescindibles. Los proxies de caché evitan cálculos repetidos.

**Desventajas:**
- **Indirección adicional**: Introduce una capa extra que puede afectar ligeramente al rendimiento en cada llamada.
- **Complejidad añadida**: Para sistemas con muchos objetos, crear proxies para cada uno puede aumentar la complejidad del código.
- **Manejo de fallos en proxies remotos**: Un proxy remoto debe manejar problemas de red, latencia y excepciones de forma adecuada para no romper la transparencia.

## 9. Implementación
**a) Tipos de Proxy**
Es fundamental entender qué tipo de proxy se necesita:
- **Proxy virtual**: El `Proxy` mantiene la referencia al `RealSubject` inicialmente nula. En `request()`, si es nula, la crea (inicialización perezosa). Luego delega.
- **Proxy de protección**: Antes de delegar, verifica los permisos del cliente. Si no tiene permisos, lanza una excepción o deniega el acceso.
- **Proxy remoto**: En lugar de una referencia local, el proxy envía la solicitud a través de la red (RMI, REST, gRPC, etc.).
- **Smart reference**: Además de delegar, realiza acciones adicionales como incrementar contadores de uso o loguear la llamada.

**b) Herencia vs Composición**
El proxy puede usar composición (contiene una instancia del `RealSubject`) o, en casos muy concretos, herencia. La composición es más flexible y preferible.

**c) Sincronización**
Si el proxy virtual se usa en un entorno multihilo, la creación del `RealSubject` debe ser thread-safe (double-checked locking, inicialización estática, etc.).

**d) Proxy vs Decorator**
Estructuralmente casi idénticos; la diferencia está en la intención:
- **Proxy** controla el acceso al objeto (cuándo y cómo se accede).
- **Decorator** añade responsabilidades (funcionalidad adicional).
Un proxy típicamente no añade nuevas operaciones visibles al cliente; un decorador sí.

**e) Proxy vs Adapter**
Adapter cambia la interfaz; Proxy mantiene la misma interfaz.

**f) Proxy de copia-en-escritura (copy-on-write)**
Variante de proxy virtual: el objeto real se copia solo cuando el cliente intenta modificarlo. Mientras tanto, varios clientes pueden compartir la misma instancia.

## 10. Código de ejemplo
(Ver ejemplos de implementación en [Java](ejemplos/02-proxy-java.md) y [Python](ejemplos/03-proxy-python.md).)

## 11. Usos conocidos
- **Java Reflection Proxy**: `java.lang.reflect.Proxy` permite crear proxies dinámicos en tiempo de ejecución para interfaces, delegando a un `InvocationHandler`. Muy usado en Spring (AOP), Hibernate (lazy loading), y RMI.
- **Spring AOP**: Los proxies generados automáticamente envuelven beans para añadir transacciones, seguridad, logging sin modificar el código original.
- **Hibernate / JPA**: Las colecciones `@OneToMany` con fetch lazy devuelven un proxy de la colección que solo carga los datos cuando se itera sobre ella.
- **Servicios web y RPC**: Stubs generados a partir de WSDL/gRPC son proxies remotos que invocan métodos en el servidor.
- **Java RMI**: `UnicastRemoteObject` y stubs dinámicos actúan como proxy remoto.
- **`Collections.unmodifiableList()`**: Devuelve un proxy de protección (solo lectura) que envuelve la lista original.

## 12. Patrones relacionados
- **Adapter**: Cambia la interfaz; Proxy mantiene la misma interfaz.
- **Decorator**: Añade funcionalidad; Proxy controla el acceso. Estructuralmente similares, pero la intención es diferente.
- **Facade**: Proporciona una interfaz simplificada a un subsistema; Proxy es un sustituto de un objeto con la misma interfaz.
- **State y Strategy**: Pueden ser implementados como proxies que cambian el comportamiento delegando a diferentes objetos.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Flyweight python](../06-flyweight/ejemplos/03-flyweight-python.md) | [🏠 Inicio](../../index.md) | [proxy.puml ▶](diagramas/04-proxypuml.md) |
