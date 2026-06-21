# Separación de configuraciones por perfil

La raíz de composición debe ser capaz de ensamblar diferentes configuraciones según el entorno.

- **Desarrollo**: Se usan fakes o implementaciones en memoria (por ejemplo, `RepositorioPedidosEnMemoria`), o adaptadores reales apuntando a servicios locales.
- **Pruebas unitarias/de integración**: La configuración de tests inyecta dobles de prueba (mocks, stubs) sin levantar infraestructura pesada.
- **Producción**: Adaptadores reales con parámetros productivos.

## En Spring Boot (perfiles)
```java
@Profile("dev")
@Bean
public RepositorioPedidos repoEnMemoria() { ... }

@Profile("prod")
@Bean
public RepositorioPedidos repoPostgres(DataSource ds) { ... }
```

## En aplicaciones puras sin framework
Se usa una factoría o un `if` en el punto de entrada:
```java
RepositorioPedidos repo = (entorno.equals("test"))
    ? new RepositorioPedidosEnMemoria()
    : new RepositorioPedidosPostgres(crearDataSource(config));
```

El núcleo nunca ve esta lógica.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Configuración de adaptadores y parámetros de entorno](03-configuracion-de-adaptadores-y-parametros-de-entorno.md) | [🏠 Inicio](../../index.md) | [Cableado de adaptadores primarios ▶](05-cableado-de-adaptadores-primarios.md) |
