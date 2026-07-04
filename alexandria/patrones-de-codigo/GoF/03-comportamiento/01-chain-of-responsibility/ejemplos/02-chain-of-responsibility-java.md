# Chain of responsibility java

## Ejemplo: Sistema de logging con distintos niveles

Implementaremos una cadena de manejadores de log: `ConsoleLogger` (maneja INFO), `FileLogger` (maneja DEBUG) y `ErrorLogger` (maneja ERROR). Cada uno decide si escribe el mensaje según su nivel, y luego lo pasa al siguiente en la cadena.

```java
// ---------- Petición ----------
enum LogLevel {
    INFO, DEBUG, ERROR
}

class LogRequest {
    private LogLevel level;
    private String message;

    public LogRequest(LogLevel level, String message) {
        this.level = level;
        this.message = message;
    }

    public LogLevel getLevel() { return level; }
    public String getMessage() { return message; }
}

// ---------- Handler abstracto ----------
abstract class Logger {
    protected Logger nextLogger;
    protected LogLevel level;

    public Logger(LogLevel level) {
        this.level = level;
    }

    public void setNext(Logger next) {
        this.nextLogger = next;
    }

    public void logMessage(LogRequest request) {
        if (this.level.ordinal() <= request.getLevel().ordinal()) {
            write(request.getMessage());
        }
        if (nextLogger != null) {
            nextLogger.logMessage(request);  // propaga
        }
    }

    protected abstract void write(String message);
}

// ---------- ConcreteHandlers ----------
class ConsoleLogger extends Logger {
    public ConsoleLogger() {
        super(LogLevel.INFO);
    }

    @Override
    protected void write(String message) {
        System.out.println("[CONSOLE] " + message);
    }
}

class FileLogger extends Logger {
    public FileLogger() {
        super(LogLevel.DEBUG);
    }

    @Override
    protected void write(String message) {
        System.out.println("[FILE] " + message);
    }
}

class ErrorLogger extends Logger {
    public ErrorLogger() {
        super(LogLevel.ERROR);
    }

    @Override
    protected void write(String message) {
        System.out.println("[ERROR] " + message);
    }
}

// ---------- Cliente ----------
public class ChainDemo {
    public static void main(String[] args) {
        // Construir la cadena
        Logger consoleLogger = new ConsoleLogger();
        Logger fileLogger = new FileLogger();
        Logger errorLogger = new ErrorLogger();

        consoleLogger.setNext(fileLogger);
        fileLogger.setNext(errorLogger);

        // Enviar peticiones
        consoleLogger.logMessage(new LogRequest(LogLevel.INFO, "Mensaje informativo"));
        consoleLogger.logMessage(new LogRequest(LogLevel.DEBUG, "Mensaje de depuración"));
        consoleLogger.logMessage(new LogRequest(LogLevel.ERROR, "Mensaje de error crítico"));
    }
}
```

**Salida:**
```
[CONSOLE] Mensaje informativo
[CONSOLE] Mensaje de depuración
[FILE] Mensaje de depuración
[CONSOLE] Mensaje de error crítico
[FILE] Mensaje de error crítico
[ERROR] Mensaje de error crítico
```

Cada logger escribe si su nivel es igual o inferior al de la petición, y luego pasa la petición al siguiente. El cliente solo habla con el primer logger.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ chain-of-responsibility.puml](../diagramas/04-chain-of-responsibilitypuml.md) | [🏠 Inicio](../../../index.md) | [Chain of responsibility python ▶](03-chain-of-responsibility-python.md) |
