# Chain of responsibility python

```python
from abc import ABC, abstractmethod
from enum import Enum

# ---------- Petición ----------
class LogLevel(Enum):
    INFO = 1
    DEBUG = 2
    ERROR = 3

class LogRequest:
    def __init__(self, level: LogLevel, message: str):
        self.level = level
        self.message = message

# ---------- Handler abstracto ----------
class Logger(ABC):
    def __init__(self, level: LogLevel):
        self.level = level
        self.next_logger: Logger | None = None

    def set_next(self, logger: 'Logger') -> 'Logger':
        self.next_logger = logger
        return logger  # permite encadenar fluent

    def log_message(self, request: LogRequest) -> None:
        if self.level.value <= request.level.value:
            self.write(request.message)
        if self.next_logger:
            self.next_logger.log_message(request)

    @abstractmethod
    def write(self, message: str) -> None:
        pass

# ---------- ConcreteHandlers ----------
class ConsoleLogger(Logger):
    def __init__(self):
        super().__init__(LogLevel.INFO)

    def write(self, message: str):
        print(f"[CONSOLE] {message}")

class FileLogger(Logger):
    def __init__(self):
        super().__init__(LogLevel.DEBUG)

    def write(self, message: str):
        print(f"[FILE] {message}")

class ErrorLogger(Logger):
    def __init__(self):
        super().__init__(LogLevel.ERROR)

    def write(self, message: str):
        print(f"[ERROR] {message}")

# ---------- Cliente ----------
if __name__ == "__main__":
    console = ConsoleLogger()
    file = FileLogger()
    error = ErrorLogger()

    # Construir cadena
    console.set_next(file).set_next(error)

    console.log_message(LogRequest(LogLevel.INFO, "Mensaje informativo"))
    console.log_message(LogRequest(LogLevel.DEBUG, "Mensaje de depuración"))
    console.log_message(LogRequest(LogLevel.ERROR, "Mensaje de error crítico"))
```

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Chain of responsibility java](02-chain-of-responsibility-java.md) | [🏠 Inicio](../../../index.md) | [Chain Aux ▶](chain-aux.md) |
