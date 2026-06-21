# Buenas prácticas y peligros

## Buenas prácticas
- **Mantener la raíz de composición lo más cercana al punto de entrada**: Evitar dispersar la creación de objetos por toda la aplicación.
- **Usar configuración explícita**: No abusar de escaneo de componentes que descubre implementaciones por anotaciones genéricas (`@Service`, `@Repository`) si eso difumina la trazabilidad del cableado. Preferir configuración explícita (`@Bean`) para los adaptadores, al menos en la raíz.
- **Validar la configuración al inicio**: El sistema debe fallar rápido si no puede conectarse a la base de datos o a Kafka. Esto permite que los errores de configuración se detecten inmediatamente.
- **No filtrar decisiones de negocio en la configuración**: La configuración dice *cómo* conectarse, no *qué* reglas aplicar. Las reglas van en el dominio.

## Peligros
- **Fuga de infraestructura al núcleo**: Si alguna clase del dominio o aplicación importa directamente una clase de configuración o una tecnología concreta, se rompe la arquitectura.
- **Raíz de composición sobrecargada**: En sistemas muy grandes, el archivo de configuración puede volverse un punto de gran acoplamiento. Se mitiga modularizando.
- **Configuración dispersa en múltiples lugares**: Si no hay una única raíz, se pierde el control de qué implementaciones se están usando, y se dificulta la sustitución.
- **Usar el contenedor DI como localizador de servicios** dentro del dominio: el dominio no debe llamar al contenedor para obtener servicios; la inyección debe llegar por constructor.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Pruebas y configuración de prueba](09-pruebas-y-configuracion-de-prueba.md) | [🏠 Inicio](../../index.md) | [Síntesis ▶](11-sintesis.md) |
