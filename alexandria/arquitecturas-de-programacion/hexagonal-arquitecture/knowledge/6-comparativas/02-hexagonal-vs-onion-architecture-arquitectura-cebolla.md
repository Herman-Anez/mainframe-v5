# Hexagonal vs. Onion Architecture (Arquitectura Cebolla)

## Onion Architecture (Jeffrey Palermo, 2008)
La arquitectura cebolla organiza el sistema en círculos concéntricos:

1. **Centro**: Modelo de dominio (entidades, value objects)
2. **Servicios de dominio** (interfaces y lógica que no cabe en entidades)
3. **Servicios de aplicación** (orquestación, casos de uso)
4. **Infraestructura** (persistencia, comunicación, UI)

Regla fundamental: **las dependencias solo pueden apuntar hacia el centro**. Las capas externas conocen a las internas, nunca al revés.

## Similitudes profundas
- Ambas basan su estructura en la inversión de dependencias.
- Ambas aíslan el dominio de la infraestructura.
- Ambas permiten pruebas aisladas del núcleo.
- En ambas, la UI y la base de datos son "detalles" que se enchufan al final.
- En la práctica, una aplicación bien diseñada con Onion y una con Hexagonal son casi indistinguibles.

## Diferencias de enfoque y terminología

| Aspecto | Onion Architecture | Hexagonal |
|--------|-------------------|-----------|
| Representación | Capas concéntricas (modelo de cebolla) | Hexágono con múltiples lados (cada lado es un puerto) |
| Puertos y adaptadores | No los nombra explícitamente como "puertos". Las interfaces de servicios de dominio y aplicación hacen el papel de contratos. | Define explícitamente "puertos" (primarios/secundarios) y "adaptadores" como elementos arquitectónicos de primer orden. |
| Énfasis | Más centrada en la separación de capas del dominio (Domain, Domain Services, Application) | Más centrada en la simetría de la comunicación (cada lado del hexágono representa un protocolo distinto) |
| Número de lados | No hay concepto de "lados". Todo depende del centro. | Cada cara del hexágono simboliza un puerto. Aunque es una metáfora, enfatiza la multiplicidad de conectores. |
| Origen | Surge de la necesidad de evitar el acoplamiento a infraestructura y de la aplicación del DIP | Surge de la necesidad de permitir que la aplicación sea igualmente manejada por personas, tests o scripts. |
| Nivel de detalle sobre los adaptadores | No profundiza en driving/driven; simplemente se conecta a través de interfaces. | Distingue claramente puertos primarios (driving) y secundarios (driven). |

## Conclusión
La cebolla y la hexagonal son **esencialmente el mismo principio** visto desde dos metáforas. La hexagonal es más explícita respecto a la simetría de entradas y salidas y a la nomenclatura de puertos/adaptadores, mientras que la cebolla es más intuitiva con sus capas concéntricas. En la práctica, puedes usar la hexagonal para modelar el sistema y superponer las capas de la cebolla para estructurar el interior. Ninguna contradice a la otra.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Hexagonal vs. Arquitectura en capas tradicional](01-hexagonal-vs-arquitectura-en-capas-tradicional.md) | [🏠 Inicio](../index.md) | [Hexagonal vs. Clean Architecture (Arquitectura Limpia) ▶](03-hexagonal-vs-clean-architecture-arquitectura-limpia.md) |
