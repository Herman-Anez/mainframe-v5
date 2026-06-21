
# Glosario de Domain-Driven Design

## A

**Agregado (Aggregate)**  
Clúster de objetos del dominio (entidades y value objects) que se tratan como una unidad para los cambios de datos. Tiene una **raíz de agregado** que es la única puerta de entrada y garantiza las invariantes del grupo. Los objetos externos solo pueden referenciar a la raíz.

**Anticorruption Layer (ACL) – Capa Anticorrupción**  
Capa de traducción defensiva que un contexto *downstream* construye para protegerse del modelo de un contexto *upstream*, evitando que conceptos ajenos contaminen su propio dominio. Implementa adaptadores y traductores.

**Arquitectura Hexagonal (Ports & Adapters)**  
Estilo arquitectónico que aísla el dominio en el centro y lo comunica con el exterior mediante *puertos* (interfaces definidas por el dominio) y *adaptadores* (implementaciones concretas de infraestructura). Garantiza que el dominio no dependa de detalles externos.

---

## B

**Big Ball of Mud (BBoM) – Gran Bola de Barro**  
Sistema con un modelo caótico, sin estructura clara y con alto acoplamiento. En DDD se reconoce como un contexto y se aísla mediante ACLs para evitar que su complejidad se propague. La estrategia es estrangularlo progresivamente extrayendo funcionalidades a nuevos contextos.

**Bounded Context – Contexto Delimitado**  
Límite explícito dentro del cual un modelo de dominio es consistente y tiene un significado único. Cada Bounded Context posee su propio **Lenguaje Ubicuo** y puede implementarse de forma autónoma.

---

## C

**Capa de Aplicación (Application Layer)**  
Capa fina que orquesta los casos de uso, gestiona transacciones y coordina la interacción entre la presentación y el dominio. No contiene reglas de negocio.

**Capa de Dominio (Domain Layer)**  
Corazón del sistema. Contiene entidades, value objects, servicios de dominio, fábricas y especificaciones. Expresa el lenguaje ubicuo y las invariantes del negocio sin dependencias externas.

**Capa de Infraestructura (Infrastructure Layer)**  
Implementa los detalles técnicos: persistencia, mensajería, clientes HTTP, etc. Aquí residen los adaptadores que satisfacen los puertos definidos en el dominio o aplicación.

**Capa de Presentación (Interface Layer)**  
Punto de entrada al sistema (API REST, UI, suscriptores de mensajes). Traduce las peticiones externas y las pasa a la capa de aplicación.

**CQRS (Command Query Responsibility Segregation)**  
Patrón que separa los modelos para comandos (escritura, que usa agregados y reglas de dominio) de los modelos para consultas (lectura, optimizados y a menudo denormalizados). Puede combinarse con Event Sourcing.

**Conformista (Conformist)**  
Relación de Context Mapping en la que el contexto *downstream* se adapta al modelo del *upstream* sin esperar que este se ajuste a sus necesidades, generalmente porque el proveedor es inamovible o la funcionalidad no es crítica.

**Context Mapping (Mapeo de Contextos)**  
Mapa que documenta las relaciones entre Bounded Contexts (patrones como Partnership, Customer-Supplier, ACL, etc.) y ayuda a visualizar dependencias organizacionales y técnicas.

**Core Domain – Dominio Núcleo**  
Parte del negocio que aporta la ventaja competitiva. Es complejo, específico y merece la mayor inversión de modelado y desarrollo.

**Customer-Supplier (Cliente-Proveedor)**  
Relación asimétrica en la que un contexto *upstream* (proveedor) se compromete a satisfacer las necesidades de los contextos *downstream* (clientes), manteniendo su autonomía.

---

## D

**Domain Event – Evento de Dominio**  
Hecho significativo que ha ocurrido en el dominio. Se nombra en pasado (*PedidoConfirmado*) y permite desacoplar lógica dentro de un contexto y entre contextos.

**Domain Service – Servicio de Dominio**  
Objeto stateless que encapsula lógica de negocio que no pertenece de forma natural a una entidad o value object, a menudo involucrando múltiples agregados.

**Domain-Driven Design (DDD) – Diseño Dirigido por el Dominio**  
Enfoque de desarrollo de software que sitúa el foco en el dominio del negocio y su complejidad, utilizando un lenguaje compartido (lenguaje ubicuo) y patrones estratégicos y tácticos para modelarlo fielmente.

---

## E

**Entidad (Entity)**  
Objeto del dominio con una identidad continua que lo distingue de otros incluso si sus atributos cambian. Su igualdad se basa en su identificador. Puede ser la raíz de un agregado o una entidad interna.

**Especificación (Specification)**  
Objeto que encapsula una regla de negocio o un criterio de selección, permitiendo combinarlas (AND, OR, NOT) y reutilizarlas para validación, consulta o construcción.

**Event Sourcing – Abastecimiento de Eventos**  
Patrón de persistencia que almacena el estado de un agregado como una secuencia de eventos de dominio, en lugar de guardar solo el estado actual. La fuente de verdad es el log de eventos.

**Event Storming**  
Taller colaborativo para explorar dominios complejos usando post-its de colores que representan eventos, comandos, agregados y políticas. Facilita el descubrimiento de Bounded Contexts y el modelo táctico inicial.

---

## F

**Fábrica (Factory)**  
Mecanismo de creación que encapsula la lógica para instanciar objetos complejos del dominio (especialmente agregados), garantizando que el objeto creado sea válido desde el principio.

---

## G

**Generic Subdomain – Subdominio Genérico**  
Problemas comunes ya resueltos (contabilidad, autenticación, notificaciones). No aportan diferenciación competitiva; se recomienda comprar productos existentes o implementarlos con poco esfuerzo.

---

## L

**Lenguaje Ubicuo (Ubiquitous Language)**  
Lenguaje común y riguroso construido conjuntamente por expertos del dominio y el equipo de desarrollo. Se usa en conversaciones, documentación y código, y es específico de cada Bounded Context.

---

## M

**Módulo (Module)**  
Agrupación lógica de elementos del modelo (entidades, VO, servicios) con alta cohesión y bajo acoplamiento. Refleja conceptos del dominio y suele corresponder a un paquete o namespace en el código.

**Model-Driven Design – Diseño Dirigido por el Modelo**  
Principio que establece que el modelo de dominio debe estar íntimamente conectado con la implementación, evolucionando ambos de forma iterativa.

---

## O

**Open Host Service (OHS) – Servicio de Anfitrión Abierto**  
Patrón donde un contexto proveedor expone una API bien definida y estable como único canal de acceso para todos los clientes, ocultando su implementación interna. Suele acompañarse de un Published Language.

---

## P

**Partnership (Sociedad)**  
Relación de Context Mapping donde dos equipos colaboran estrechamente de forma simétrica, coordinando entregas y evolucionando sus interfaces conjuntamente.

**Published Language – Lenguaje Publicado**  
Modelo de datos canónico y estable (esquema JSON, Avro, etc.) utilizado para el intercambio entre Bounded Contexts. Permite desacoplar la comunicación sin compartir el modelo interno.

---

## R

**Raíz de Agregado (Aggregate Root)**  
Entidad que sirve como única puerta de entrada al agregado. Garantiza las invariantes del grupo y es la única que puede ser referenciada desde fuera del agregado.

**Repositorio (Repository)**  
Abstracción que simula una colección de agregados en memoria. Solo existen repositorios para raíces de agregado. Su interfaz se define en el dominio y la implementación en infraestructura.

---

## S

**Separate Ways – Caminos Separados**  
Decisión consciente de que dos Bounded Contexts no se integrarán, a menudo porque el costo de integración supera el beneficio. Cada uno sigue su evolución independiente.

**Shared Kernel – Núcleo Compartido**  
Pequeña porción del modelo y/o código que dos o más contextos deciden compartir explícitamente. Requiere coordinación estricta para cambios.

**Subdominio (Subdomain)**  
Partición lógica del dominio global. Se clasifica en Core, Supporting o Generic según su importancia estratégica.

**Supporting Subdomain – Subdominio de Soporte**  
Apoya al core domain pero no es diferenciador. Contiene lógica específica de la empresa y puede desarrollarse a medida o externalizarse.

**Supple Design – Diseño Flexible**  
Conjunto de patrones (Intention-Revealing Interfaces, Side-Effect-Free Functions, etc.) que hacen que el modelo de dominio sea expresivo, fácil de extender y adaptarse a nuevos requerimientos.

---

## V

**Value Object – Objeto de Valor**  
Objeto del dominio sin identidad conceptual. Es inmutable y su igualdad se basa en el valor de todos sus atributos. Describe características de las entidades (dirección, dinero, email).

---

Este glosario constituye el vocabulario común del repositorio y puede ampliarse a medida que se profundice en nuevos conceptos o patrones complementarios.

---
