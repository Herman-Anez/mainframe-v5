# Dominio y subdominios

El dominio y los subdominios son el punto de partida de cualquier proyecto DDD. Sin una comprensión clara de este espacio, el diseño estratégico carece de dirección.

## El dominio como espacio del problema
El **dominio** es la esfera de conocimiento y actividad sobre la cual se construye el software. Representa el “qué” del negocio, no el “cómo” técnico. En DDD se diferencia radicalmente de la solución técnica: el dominio existe con independencia de que lo informatices.

**Subdominios: la descomposición natural del dominio**
Un dominio amplio se compone de subdominios. Cada subdominio aborda un área diferenciada del negocio, con sus propias reglas, expertos y vocabulario. DDD los clasifica en tres categorías según su importancia estratégica:

- **Core Domain (dominio núcleo)**  
  Es la parte del negocio que realmente distingue a la organización de sus competidores. No se trata solo de lo que hace, sino de lo que le otorga una ventaja competitiva. Suele ser complejo, específico y cambiante. El core domain es la razón por la que la empresa invierte en desarrollo a medida.  
  *Ejemplo:* En una empresa de logística que promete entregas en el mismo día, su core domain es el algoritmo de optimización de rutas en tiempo real y la asignación dinámica de repartidores. El resto (facturación, gestión de flotas, portales de cliente) son subdominios de soporte o genéricos.

- **Supporting Subdomain (subdominio de soporte)**  
  Apoya al core domain pero no aporta diferenciación competitiva. Es necesario para que el negocio funcione, aunque otra empresa del mismo sector podría implementarlo de forma similar sin ganar ventaja. Suele contener lógica específica de la organización. Se puede desarrollar a medida o externalizar, pero requiere cierto conocimiento del negocio.  
  *Ejemplo:* Para la misma empresa de logística, un sistema interno de gestión de incidencias y reclamaciones de clientes. No es lo que les hace únicos, pero tiene particularidades de sus procesos.

- **Generic Subdomain (subdominio genérico)**  
  Representa problemas universales, ya resueltos por múltiples soluciones del mercado. Aportan funcionalidad, pero el core domain no depende de su unicidad. La recomendación fuerte es **adquirir o adoptar** productos existentes, o bien desarrollarlos con poco esfuerzo, sin dedicarles inversión creativa.  
  *Ejemplo:* Contabilidad, autenticación de usuarios (IAM), envío de correos electrónicos, procesamiento de pagos estándar.

## Cómo identificar y clasificar subdominios
No es un proceso puramente analítico; requiere colaboración con expertos del dominio y una mirada crítica al negocio. Algunas técnicas:

- **Business Capability Mapping:** identificar capacidades de negocio y preguntarse: ¿esto es diferenciador?, ¿es complejo?, ¿puede comprarse?
- **Event Storming:** durante la exploración, los eventos del dominio suelen agruparse en áreas de actividad que insinúan subdominios.
- **Análisis de complejidad y volatilidad:** lo que es muy complejo y cambia a menudo tiende a ser core. Lo estable y común, genérico.

**Peligros comunes**
- **Tratar todo como core:** lleva a sobreinversión, equipos agotados y sistemas sobrediseñados para cosas que el mercado ya hace mejor.
- **Tratar el core como genérico:** es el peor error estratégico. Externalizas lo que te hace único y pierdes la capacidad de evolucionar en tu diferenciación clave.
- **Mapeo 1:1 rígido entre subdominios y Bounded Contexts:** aunque es el ideal, pueden existir desviaciones por razones organizativas o heredadas. Lo crítico es entender *por qué* ocurre.

## Evolución y reevaluación
Los subdominios no son estáticos. Lo que hoy es core puede volverse genérico con el tiempo (por ejemplo, cuando surge un producto SaaS que lo cubre perfectamente). A la inversa, un subdominio de soporte puede transformarse en core si la empresa decide basar su ventaja en él. La destilación del core domain debe ser un ejercicio recurrente.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| ➖ | [🏠 Inicio](../index.md) | [Lenguaje ubicuo ▶](02-lenguaje-ubicuo.md) |
