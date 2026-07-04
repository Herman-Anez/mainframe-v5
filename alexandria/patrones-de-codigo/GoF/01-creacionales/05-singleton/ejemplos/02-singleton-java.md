# Singleton java

Presentamos las implementaciones más importantes, comentando las ventajas e inconvenientes de cada una.

## Ejemplo 1: Inicialización temprana (Eager)

```java
public class Configuration {
    // Instancia creada en la carga de la clase
    private static final Configuration INSTANCE = new Configuration();
    private String language = "es";
    private boolean darkMode = false;

    private Configuration() {
        // Cargar configuración desde archivo o recursos
        System.out.println("Configuración cargada.");
    }

    public static Configuration getInstance() {
        return INSTANCE;
    }

    public String getLanguage() { return language; }
    public void setLanguage(String language) { this.language = language; }
    public boolean isDarkMode() { return darkMode; }
    public void setDarkMode(boolean darkMode) { this.darkMode = darkMode; }
}
```

**Uso:**
```java
public class App {
    public static void main(String[] args) {
        Configuration config = Configuration.getInstance();
        System.out.println("Idioma: " + config.getLanguage());
    }
}
```

## Ejemplo 2: Double-Checked Locking (Thread-safe lazy)

```java
public class DatabaseConnectionPool {
    private static volatile DatabaseConnectionPool instance;

    private DatabaseConnectionPool() {
        // Inicializar conexiones (costoso)
        System.out.println("Pool de conexiones inicializado.");
    }

    public static DatabaseConnectionPool getInstance() {
        if (instance == null) {
            synchronized (DatabaseConnectionPool.class) {
                if (instance == null) {
                    instance = new DatabaseConnectionPool();
                }
            }
        }
        return instance;
    }

    public void executeQuery(String query) {
        System.out.println("Ejecutando: " + query);
    }
}
```

## Ejemplo 3: Clase interna estática (Bill Pugh) - Recomendada en Java clásico

```java
public class Logger {
    private Logger() {
        // Inicializar archivo de log
        System.out.println("Logger inicializado.");
    }

    private static class LoggerHolder {
        private static final Logger INSTANCE = new Logger();
    }

    public static Logger getInstance() {
        return LoggerHolder.INSTANCE;
    }

    public void log(String message) {
        System.out.println("[LOG] " + message);
    }
}
```

## Ejemplo 4: Enum Singleton - La más segura y concisa

```java
public enum AppContext {
    INSTANCE;

    private String appName = "MiApp";
    private int maxUsers = 100;

    AppContext() {
        System.out.println("Inicializando contexto de aplicación.");
    }

    public String getAppName() {
        return appName;
    }

    public void setAppName(String appName) {
        this.appName = appName;
    }

    public int getMaxUsers() {
        return maxUsers;
    }
}
```

**Uso:**
```java
AppContext context = AppContext.INSTANCE;
System.out.println(context.getAppName());
```

La versión Enum proporciona automáticamente:
- Seguridad en serialización.
- Protección contra reflexión (no se puede instanciar un enum con `Constructor.newInstance()`).
- Seguridad en hilos.

## Manejo de serialización en Singleton clásico

Si se necesita serializar un Singleton que no es Enum, debe implementarse `readResolve`:

```java
public class SingletonSerializable implements Serializable {
    private static final SingletonSerializable INSTANCE = new SingletonSerializable();

    private SingletonSerializable() {}

    public static SingletonSerializable getInstance() {
        return INSTANCE;
    }

    // Evitar que la deserialización cree una nueva instancia
    protected Object readResolve() {
        return INSTANCE;
    }
}
```

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ singleton.puml](../diagramas/04-singletonpuml.md) | [🏠 Inicio](../../../index.md) | [Singleton python ▶](03-singleton-python.md) |
