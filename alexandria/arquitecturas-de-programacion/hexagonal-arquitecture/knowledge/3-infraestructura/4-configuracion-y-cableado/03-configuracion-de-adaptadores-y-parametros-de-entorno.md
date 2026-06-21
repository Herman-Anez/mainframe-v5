# Configuración de adaptadores y parámetros de entorno

Los adaptadores suelen requerir datos de configuración: URLs, cadenas de conexión, credenciales, timeouts, tópicos. Estos valores **nunca deben hardcodearse** y se obtienen de fuentes externas.

## Fuentes típicas
- Variables de entorno (`DB_HOST`, `KAFKA_BROKERS`)
- Archivos `.env`, `.properties`, `.yaml`
- Servicios de configuración centralizada (Spring Cloud Config, Consul, Vault)
- Perfiles de ejecución (`dev`, `test`, `prod`)

La capa de infraestructura lee estos valores, construye objetos de configuración y los pasa a los constructores de los adaptadores.

```java
@ConfigurationProperties(prefix = "db")
public record BaseDeDatosConfig(String url, String usuario, String password) {}

@Bean
public DataSource dataSource(BaseDeDatosConfig config) {
    HikariConfig hikari = new HikariConfig();
    hikari.setJdbcUrl(config.url());
    // ...
    return new HikariDataSource(hikari);
}
```

## Adaptadores paramétricos
Los adaptadores reciben su configuración a través de sus constructores, no leyéndola directamente del entorno. Así se mantienen testables sin necesidad de variables globales.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Composition Root (Raíz de Composición)](02-composition-root-raiz-de-composicion.md) | [🏠 Inicio](../../index.md) | [Separación de configuraciones por perfil ▶](04-separacion-de-configuraciones-por-perfil.md) |
