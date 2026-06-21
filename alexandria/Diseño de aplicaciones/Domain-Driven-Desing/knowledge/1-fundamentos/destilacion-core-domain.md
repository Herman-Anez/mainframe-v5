# Destilacion core domain

Destilar el Core Domain significa identificarlo, aislarlo e invertir en él de forma prioritaria. Es un proceso continuo que busca maximizar el retorno del esfuerzo de desarrollo.

## ¿Por qué es necesaria la destilación?
En muchos proyectos, el dominio núcleo se diluye entre código genérico, integraciones y funcionalidades de soporte. Con el tiempo, los desarrolladores no distinguen qué partes del sistema requieren excelencia. La destilación pone el foco:
- **Estratégico:** indica dónde innovar y dónde comprar/reutilizar.
- **Técnico:** ayuda a mantener un modelo de dominio limpio y expresivo en lo que realmente importa.
- **Organizativo:** guía la asignación de los mejores desarrolladores al core domain.

## Técnicas de destilación según Eric Evans

**1. Domain Vision Statement (Declaración de Visión del Dominio)**  
Un párrafo corto, en lenguaje natural, que describe el core domain y su valor. Sirve como faro para el equipo. No debe incluir jerga técnica. Se escribe con los expertos y se revisa periódicamente.  
*Ejemplo:* “El core domain es la asignación inteligente de recursos de reparto en tiempo real, minimizando el tiempo de entrega y maximizando la densidad de envíos por ruta.”

**2. Highlighted Core (Núcleo Destacado)**  
Dentro del modelo de un Bounded Context, se marcan (con anotaciones, en la documentación o incluso en el código) los elementos que pertenecen al core domain. Pueden ser entidades, value objects, servicios o módulos concretos. Esta técnica hace visible lo esencial y facilita la toma de decisiones en revisiones de código y diseño.

**3. Generic Subdomains vs Core (Subdominios Genéricos vs Núcleo)**  
Clasificar explícitamente los subdominios como genéricos, de soporte o core ya es un acto de destilación. La decisión de adquirir un producto para un subdominio genérico libera energía cognitiva y recursos para el core.

**4. Cohesive Mechanisms (Mecanismos Cohesivos)**  
Extraer algoritmos complejos pero genéricos en componentes separados, de forma que el core domain quede limpio de complejidad accidental. Por ejemplo, un motor de reglas o un parser de expresiones. Estos mecanismos se diseñan para ser reutilizados, pero no son parte del modelo de dominio per se; se tratan como bibliotecas.

**5. Segregated Core (Núcleo Segregado)**  
Reorganizar el código de modo que el core domain esté en un módulo o paquete independiente, sin dependencias con los subdominios de soporte. De esta forma, el core es claramente identificable y se puede proteger. Esta técnica es la evolución de Highlighted Core hacia una separación física.

**6. Abstract Core (Núcleo Abstracto)**  
Definir interfaces abstractas que capturen la esencia del dominio núcleo, permitiendo diferentes implementaciones. Esto es útil cuando el core se expresa en interacción con otros módulos que pueden variar. Se debe usar con mesura para no caer en una abstracción prematura.

## Proceso de destilación en la práctica
1. **Identificación inicial:** mediante Event Storming y entrevistas con stakeholders, se señalan los candidatos a core domain.
2. **Validación con métricas de negocio:** “si esto falla o lo hacemos de forma mediocre, ¿perdemos clientes o ventaja?”. Lo que genera más impacto en los KPIs estratégicos es core.
3. **Visibilidad continua:** usar un lienzo o pared con el Domain Vision Statement, el Context Map con los core contexts resaltados y la documentación del modelo destacando el core.
4. **Refactorización hacia un Segregated Core:** extraer lógica genérica a módulos separados, aplicar ACLs para proteger el core, y garantizar que el core no tenga dependencias de infraestructura compleja.
5. **Asignación de equipo:** situar al equipo con mayor conocimiento del dominio y mejores habilidades de modelado en el core domain. Rotar a otros equipos hacia los genéricos puede ser una estrategia.

## El core domain evoluciona
Lo que hoy es core puede dejar de serlo si el mercado cambia o si aparece un competidor que lo hace mejor. La destilación debe repetirse en cada hito estratégico (por ejemplo, al pivotar el modelo de negocio). Un equipo DDD maduro considera el core domain como algo vivo, reflejado en el código y en la cultura del equipo.

