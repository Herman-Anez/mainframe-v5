# Sociotechnical aspects

DDD no es solo un conjunto de patrones de diseño; es profundamente **sociotécnico**. La estructura del software, los modelos de dominio y la organización de los equipos están inextricablemente ligados. Ignorar la dimensión humana y organizacional conduce al fracaso del diseño estratégico, por muy bien modelado que esté el código.

## La Ley de Conway y su corolario inverso
- **Ley de Conway (1968):** *“Las organizaciones que diseñan sistemas están limitadas a producir diseños que son copia de sus estructuras de comunicación.”*  
  Si la empresa tiene equipos separados de frontend, backend y base de datos, el sistema tenderá a una arquitectura en capas separadas con interfaces frágiles. Si tiene equipos funcionales (pedidos, catálogo, envíos), surgirán servicios alineados con esas capacidades.
- **Corolario inverso (estrategia):** si queremos una arquitectura de microservicios con Bounded Contexts bien definidos, debemos **organizar los equipos alrededor de esos contextos**. Esta maniobra se conoce como **Inverse Conway Maneuver** y es un paso deliberado en la adopción de DDD estratégico.

## Equipos alineados con Bounded Contexts
El principio fundamental es que un Bounded Context debe ser propiedad de **un único equipo** (o un equipo de equipos si el contexto es extenso). Esto proporciona autonomía técnica y de dominio, minimiza las dependencias organizacionales y permite al equipo desarrollar un profundo conocimiento del subdominio.

**Team Topologies (Matthew Skelton y Manuel Pais)** ofrece un marco complementario para DDD, definiendo cuatro topologías de equipo:

1. **Stream-Aligned Team (Equipo alineado al flujo de valor):** es el equipo “dueño” de un Bounded Context (o parte de un Core Domain). Su trabajo se alinea con una capacidad de negocio de extremo a extremo. Es el tipo mayoritario en una organización DDD. Ejemplo: equipo de “Gestión de Pedidos”, equipo de “Gestión de Catálogo”.

2. **Enabling Team (Equipo habilitador):** ayuda a los stream-aligned a adquirir competencias, acelerar la adopción de nuevas tecnologías o prácticas (por ejemplo, un equipo que ayuda a otros a implementar Event Sourcing). No poseen un Bounded Context de negocio, sino que actúan como consultores internos temporales.

3. **Complicated-Subsystem Team (Equipo de subsistema complejo):** se forma alrededor de un componente que requiere habilidades especializadas (por ejemplo, un motor de optimización matemática, un sistema de recomendaciones basado en ML). Este equipo puede ser propietario de un Bounded Context de tipo Supporting o incluso una parte del Core Domain si es altamente especializado, pero su interfaz con los demás contextos se rige por contratos claros.

4. **Platform Team (Equipo de plataforma):** construye y mantiene una plataforma interna que ofrece servicios comunes (infraestructura, CI/CD, mensajería, etc.) como un producto, con API autoservicio. En DDD, la plataforma se considera un Generic Subdomain y su relación con los equipos de producto suele ser de tipo **Open Host Service** con **Published Language**. El equipo de plataforma trata a los stream-aligned como sus clientes (Customer-Supplier).

## Aplicación del Context Mapping a la organización
Los patrones de Context Mapping tienen un reflejo directo en las relaciones entre equipos:

- **Partnership:** equipos que colaboran codo con codo; estructura organizativa plana, sin un “dueño” único de la integración.
- **Customer-Supplier:** el equipo proveedor (upstream) actúa como servicio interno; los clientes (downstream) participan en la priorización. En muchas organizaciones, la relación entre un equipo de producto y un equipo de plataforma es Customer-Supplier con OHS.
- **Conformist:** el equipo cliente decide no presionar al proveedor, a menudo porque el proveedor es externo o porque la funcionalidad no es crítica. Organizativamente, significa aceptar la dependencia sin fricción.
- **Anticorruption Layer:** puede ser construida y mantenida por el equipo cliente como defensa, sin requerir colaboración del proveedor. Implica inversión local.
- **Separate Ways:** dos equipos que no se coordinan ni integran; son autónomos al máximo. Puede ser adecuado para startups donde la velocidad de cada unidad es prioritaria.

**Consecuencia:** el Context Map es también un **mapa de relaciones de equipo**. El diseño organizacional y el diseño de software se planifican en paralelo.

## Carga cognitiva y tamaño del contexto
Un equipo solo puede manejar una cantidad limitada de complejidad (carga cognitiva). DDD aboga por Bounded Contexts de un tamaño que sea “manejable” por un equipo de 5-9 personas. Si un contexto crece demasiado, el equipo sufre sobrecarga cognitiva y el modelo se degrada. Se debe entonces considerar dividir el contexto o añadir un equipo adicional, pero la propiedad debe ser clara (un subsistema complicado, por ejemplo).

## Alineación con el Core Domain
El principio de destilación del core domain tiene un fuerte componente sociotécnico:
- Los **mejores desarrolladores y expertos del dominio** deben concentrarse en el Core Domain. No tiene sentido que el talento más escaso esté trabajando en un subdominio genérico.
- Los subdominios genéricos se pueden externalizar (SaaS) o asignar a equipos con menos inversión en conocimiento de negocio profundo, o incluso rotar entre equipos.
- La visibilidad del Domain Vision Statement ayuda a que toda la organización entienda dónde se ubica el core y por qué ciertos equipos reciben más recursos.

## Evolución organizativa y DDD
Las empresas que adoptan DDD a gran escala suelen pasar por un proceso de **rediseño organizativo** basado en Bounded Contexts:
1. **Descubrimiento con Event Storming inter-áreas:** se identifican los contextos y se dibuja el mapa de dependencias.
2. **Agrupación de equipos:** se reasignan personas a equipos multidisciplinares propietarios de contextos. Se eliminan estructuras de “componentes compartidos” que creaban cuellos de botella.
3. **Plataformas internas:** se crea un equipo de plataforma para servicios comunes (CI/CD, logging, autenticación) que ofrece un OHS, liberando a los equipos de producto.
4. **Iteración:** la estructura se refina conforme el modelo del negocio cambia.

## Comunicación continua y Comunidades de Práctica
Para mantener la integridad de los patrones DDD a escala, se crean comunidades que cruzan equipos:
- **Guildas de DDD / modelado:** foros internos donde se comparten patrones, se discute el lenguaje ubicuo de cada contexto y se asegura que el Context Map se mantenga actualizado.
- **Capacitación en Event Storming:** facilitadores internos que ayudan a otros equipos a explorar sus dominios.
- **Revisiones de diseño:** equipos de otros contextos revisan las APIs y los contratos de eventos para detectar acoplamientos no deseados.

Estos aspectos sociotécnicos garantizan que el conocimiento del dominio se difunda y que las decisiones arquitectónicas no se impongan sin entender el impacto humano.

---

Estos dos archivos completan el directorio `diseno-estrategico`, dotando al repositorio de una visión integral que abarca desde la dinámica de taller hasta la configuración de la organización. La sinergia entre Event Storming y los aspectos sociotécnicos es lo que convierte a DDD en una disciplina de transformación empresarial, más allá del mero diseño de software.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Event storming](01-event-storming.md) | [🏠 Inicio](../index.md) | [Partnership ▶](patrones-context-mapping/01-partnership.md) |
