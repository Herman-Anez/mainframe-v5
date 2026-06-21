# Guía de Documentación de Hexagonal Architecture Knowledge

Bienvenido al índice centralizado de esta sección de documentación. Puedes navegar a través de los temas de manera secuencial y lógica utilizando los enlaces al pie de página de cada sección.

## 📂 Índice de Contenidos

### 1. Fundamentos

- [Origen y motivación](1-fundamentos/01-origen-y-motivacion.md)
- [Principios](1-fundamentos/02-principios.md)
- [Metáfora del hexágono](1-fundamentos/03-metafora-del-hexagono.md)
- [Puertos](1-fundamentos/04-puertos.md)
- [Adaptadores](1-fundamentos/05-adaptadores.md)
- [Flujo de dependencias](1-fundamentos/06-flujo-de-dependencias.md)

### 2. Elementos Del Nucleo

#### 1. Dominio

- [Entidades](2-elementos-del-nucleo/1-dominio/01-entidades.md)
- [Value Objects (Objetos de valor)](2-elementos-del-nucleo/1-dominio/02-value-objects-objetos-de-valor.md)
- [Agregados](2-elementos-del-nucleo/1-dominio/03-agregados.md)
- [Servicios de dominio](2-elementos-del-nucleo/1-dominio/04-servicios-de-dominio.md)
- [Eventos de dominio](2-elementos-del-nucleo/1-dominio/05-eventos-de-dominio.md)
- [Lenguaje ubicuo](2-elementos-del-nucleo/1-dominio/06-lenguaje-ubicuo.md)

- [Puertos secundarios](2-elementos-del-nucleo/01-puertos-secundarios.md)

#### Aplicacion

- [Casos de uso](2-elementos-del-nucleo/aplicacion/01-casos-de-uso.md)
- [Servicios de aplicación](2-elementos-del-nucleo/aplicacion/02-servicios-de-aplicacion.md)
- [Comandos y consultas](2-elementos-del-nucleo/aplicacion/03-comandos-y-consultas.md)
- [Puertos primarios](2-elementos-del-nucleo/aplicacion/04-puertos-primarios.md)
- [Síntesis de la capa de aplicación](2-elementos-del-nucleo/aplicacion/05-sintesis-de-la-capa-de-aplicacion.md)

### 3. Infraestructura

#### 1. Persistencia

- [Repositorios SQL](3-infraestructura/1-persistencia/01-repositorios-sql.md)
- [Repositorios NoSQL](3-infraestructura/1-persistencia/02-repositorios-nosql.md)
- [Mapeo objeto-relacional](3-infraestructura/1-persistencia/03-mapeo-objeto-relacional.md)

#### 2. Comunicacion

- [REST API](3-infraestructura/2-comunicacion/01-rest-api.md)
- [GraphQL](3-infraestructura/2-comunicacion/02-graphql.md)
- [gRPC](3-infraestructura/2-comunicacion/03-grpc.md)
- [Mensajería](3-infraestructura/2-comunicacion/04-mensajeria.md)
- [Clientes HTTP](3-infraestructura/2-comunicacion/05-clientes-http.md)
- [Síntesis de la capa de comunicación en la hexagonal](3-infraestructura/2-comunicacion/06-sintesis-de-la-capa-de-comunicacion-en-la-hexagonal.md)

#### 3. Ui Y Presentacion

- [`controladores web](3-infraestructura/3-ui-y-presentacion/01-`controladores-web.md)
- [`interfaces de linea de comandos](3-infraestructura/3-ui-y-presentacion/02-`interfaces-de-linea-de-comandos.md)

#### 4. Configuracion Y Cableado

- [Propósito y ubicación](3-infraestructura/4-configuracion-y-cableado/01-proposito-y-ubicacion.md)
- [Composition Root (Raíz de Composición)](3-infraestructura/4-configuracion-y-cableado/02-composition-root-raiz-de-composicion.md)
- [Configuración de adaptadores y parámetros de entorno](3-infraestructura/4-configuracion-y-cableado/03-configuracion-de-adaptadores-y-parametros-de-entorno.md)
- [Separación de configuraciones por perfil](3-infraestructura/4-configuracion-y-cableado/04-separacion-de-configuraciones-por-perfil.md)
- [Cableado de adaptadores primarios](3-infraestructura/4-configuracion-y-cableado/05-cableado-de-adaptadores-primarios.md)
- [Cableado de adaptadores secundarios](3-infraestructura/4-configuracion-y-cableado/06-cableado-de-adaptadores-secundarios.md)
- [Estrategias para múltiples implementaciones de un mismo puerto](3-infraestructura/4-configuracion-y-cableado/07-estrategias-para-multiples-implementaciones-de-un-mismo-puerto.md)
- [Cableado en aplicaciones modulares (módulos de infraestructura)](3-infraestructura/4-configuracion-y-cableado/08-cableado-en-aplicaciones-modulares-modulos-de-infraestructura.md)
- [Pruebas y configuración de prueba](3-infraestructura/4-configuracion-y-cableado/09-pruebas-y-configuracion-de-prueba.md)
- [Buenas prácticas y peligros](3-infraestructura/4-configuracion-y-cableado/10-buenas-practicas-y-peligros.md)
- [Síntesis](3-infraestructura/4-configuracion-y-cableado/11-sintesis.md)

### 4. Testabilidad

- [Tests unitarios del dominio](4-testabilidad/01-tests-unitarios-del-dominio.md)
- [Tests de integración de adaptadores](4-testabilidad/02-tests-de-integracion-de-adaptadores.md)
- [Dobles de prueba](4-testabilidad/03-dobles-de-prueba.md)
- [Tests de casos de uso](4-testabilidad/04-tests-de-casos-de-uso.md)
- [Síntesis de testabilidad en arquitectura hexagonal](4-testabilidad/05-sintesis-de-testabilidad-en-arquitectura-hexagonal.md)

### 5. Patrones Y Buenas Practicas

- [Patrón repositorio](5-patrones-y-buenas-practicas/01-patron-repositorio.md)
- [Fábricas](5-patrones-y-buenas-practicas/02-fabricas.md)
- [Políticas y especificaciones](5-patrones-y-buenas-practicas/03-politicas-y-especificaciones.md)
- [Publicador de eventos de dominio](5-patrones-y-buenas-practicas/04-publicador-de-eventos-de-dominio.md)
- [Manejo de transacciones](5-patrones-y-buenas-practicas/05-manejo-de-transacciones.md)

### 6. Comparativas

- [Hexagonal vs. Arquitectura en capas tradicional](6-comparativas/01-hexagonal-vs-arquitectura-en-capas-tradicional.md)
- [Hexagonal vs. Onion Architecture (Arquitectura Cebolla)](6-comparativas/02-hexagonal-vs-onion-architecture-arquitectura-cebolla.md)
- [Hexagonal vs. Clean Architecture (Arquitectura Limpia)](6-comparativas/03-hexagonal-vs-clean-architecture-arquitectura-limpia.md)
- [Hexagonal y microservicios](6-comparativas/04-hexagonal-y-microservicios.md)
- [Síntesis transversal](6-comparativas/05-sintesis-transversal.md)

### 7. Ejemplos De Implementacion

#### 1. Ejemplo Spring Boot

- [Estructura de carpetas (Spring Boot + Hexagonal)](7-ejemplos-de-implementacion/1-ejemplo-spring-boot/01-estructura-de-carpetas-spring-boot-hexagonal.md)
- [Fragmentos clave](7-ejemplos-de-implementacion/1-ejemplo-spring-boot/02-fragmentos-clave.md)
- [Resumen del ejemplo Spring Boot](7-ejemplos-de-implementacion/1-ejemplo-spring-boot/03-resumen-del-ejemplo-spring-boot.md)

- [Estructura de carpetas (Node.js + TypeScript + Hexagonal)](7-ejemplos-de-implementacion/01-estructura-de-carpetas-nodejs-typescript-hexagonal.md)
- [Fragmentos clave](7-ejemplos-de-implementacion/02-fragmentos-clave.md)
- [Resumen del ejemplo Node.js/TypeScript](7-ejemplos-de-implementacion/03-resumen-del-ejemplo-nodejstypescript.md)

#### 2. Ejemplo Dotnet

- [Estructura de carpetas (.NET + Hexagonal)](7-ejemplos-de-implementacion/2-ejemplo-dotnet/01-estructura-de-carpetas-net-hexagonal.md)
- [Fragmentos clave](7-ejemplos-de-implementacion/2-ejemplo-dotnet/02-fragmentos-clave.md)
- [Resumen del ejemplo .NET](7-ejemplos-de-implementacion/2-ejemplo-dotnet/03-resumen-del-ejemplo-net.md)

