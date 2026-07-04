# Command python

El ejemplo equivalente en Python, con soporte para deshacer y macro.

```python
from abc import ABC, abstractmethod

# ---------- Receiver ----------
class Light:
    def __init__(self, location: str):
        self.location = location
        self._is_on = False

    def turn_on(self):
        self._is_on = True
        print(f"{self.location}: Luz encendida")

    def turn_off(self):
        self._is_on = False
        print(f"{self.location}: Luz apagada")

# ---------- Command ----------
class Command(ABC):
    @abstractmethod
    def execute(self) -> None:
        pass

    @abstractmethod
    def undo(self) -> None:
        pass

# ---------- ConcreteCommands ----------
class LightOnCommand(Command):
    def __init__(self, light: Light):
        self.light = light

    def execute(self) -> None:
        self.light.turn_on()

    def undo(self) -> None:
        self.light.turn_off()

class LightOffCommand(Command):
    def __init__(self, light: Light):
        self.light = light

    def execute(self) -> None:
        self.light.turn_off()

    def undo(self) -> None:
        self.light.turn_on()

# ---------- MacroCommand ----------
class MacroCommand(Command):
    def __init__(self, *commands: Command):
        self.commands = commands

    def execute(self) -> None:
        for cmd in self.commands:
            cmd.execute()

    def undo(self) -> None:
        for cmd in reversed(self.commands):
            cmd.undo()

# ---------- Invoker ----------
class RemoteControl:
    def __init__(self):
        self._last_command: Command | None = None

    def press_button(self, command: Command) -> None:
        command.execute()
        self._last_command = command

    def press_undo(self) -> None:
        if self._last_command:
            self._last_command.undo()
            self._last_command = None
        else:
            print("Nada que deshacer.")

# ---------- Cliente ----------
if __name__ == "__main__":
    sala = Light("Sala")
    cocina = Light("Cocina")

    sala_on = LightOnCommand(sala)
    sala_off = LightOffCommand(sala)
    cocina_on = LightOnCommand(cocina)
    cocina_off = LightOffCommand(cocina)

    all_on = MacroCommand(sala_on, cocina_on)
    all_off = MacroCommand(sala_off, cocina_off)

    remote = RemoteControl()

    print("--- Encender luz de sala ---")
    remote.press_button(sala_on)

    print("--- Deshacer ---")
    remote.press_undo()

    print("--- Macro: encender todas ---")
    remote.press_button(all_on)

    print("--- Deshacer macro ---")
    remote.press_undo()

    print("--- Apagar solo cocina ---")
    remote.press_button(cocina_off)

    print("--- Deshacer ---")
    remote.press_undo()
```

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Command java](02-command-java.md) | [🏠 Inicio](../../../index.md) | [Interpreter ▶](../../03-interpreter/01-interpreter.md) |
