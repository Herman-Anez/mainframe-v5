# Command java

## Ejemplo: Control remoto con deshacer

Modelaremos un control remoto simple que emite comandos para encender y apagar una luz. Incluiremos soporte para deshacer la última operación.

```java
import java.util.Stack;

// ---------- Receiver ----------
class Light {
    private boolean isOn = false;
    private String location;

    public Light(String location) {
        this.location = location;
    }

    public void turnOn() {
        isOn = true;
        System.out.println(location + ": Luz encendida");
    }

    public void turnOff() {
        isOn = false;
        System.out.println(location + ": Luz apagada");
    }

    public boolean isOn() {
        return isOn;
    }
}

// ---------- Command ----------
interface Command {
    void execute();
    void undo();
}

// ---------- ConcreteCommand para encender ----------
class LightOnCommand implements Command {
    private Light light;

    public LightOnCommand(Light light) {
        this.light = light;
    }

    @Override
    public void execute() {
        light.turnOn();
    }

    @Override
    public void undo() {
        light.turnOff();
    }
}

// ---------- ConcreteCommand para apagar ----------
class LightOffCommand implements Command {
    private Light light;

    public LightOffCommand(Light light) {
        this.light = light;
    }

    @Override
    public void execute() {
        light.turnOff();
    }

    @Override
    public void undo() {
        light.turnOn();
    }
}

// ---------- MacroCommand (opcional) ----------
class MacroCommand implements Command {
    private Command[] commands;

    public MacroCommand(Command... commands) {
        this.commands = commands;
    }

    @Override
    public void execute() {
        for (Command cmd : commands) {
            cmd.execute();
        }
    }

    @Override
    public void undo() {
        for (int i = commands.length - 1; i >= 0; i--) {
            commands[i].undo();
        }
    }
}

// ---------- Invoker (control remoto) ----------
class RemoteControl {
    private Command lastCommand;

    public void setCommand(Command command) {
        this.lastCommand = null; // se establece nuevo comando pero aún no ejecutado
    }

    public void pressButton(Command command) {
        command.execute();
        lastCommand = command;
    }

    public void pressUndo() {
        if (lastCommand != null) {
            lastCommand.undo();
            lastCommand = null; // evitar múltiples undos consecutivos sin nueva acción
        } else {
            System.out.println("Nada que deshacer.");
        }
    }
}

// ---------- Cliente ----------
public class CommandDemo {
    public static void main(String[] args) {
        // Receiver
        Light livingRoomLight = new Light("Sala");
        Light kitchenLight = new Light("Cocina");

        // Commands
        Command livingRoomOn = new LightOnCommand(livingRoomLight);
        Command livingRoomOff = new LightOffCommand(livingRoomLight);
        Command kitchenOn = new LightOnCommand(kitchenLight);
        Command kitchenOff = new LightOffCommand(kitchenLight);

        // Macro: encender todas las luces
        Command allOn = new MacroCommand(livingRoomOn, kitchenOn);
        Command allOff = new MacroCommand(livingRoomOff, kitchenOff);

        // Invoker
        RemoteControl remote = new RemoteControl();

        System.out.println("--- Encender luz de sala ---");
        remote.pressButton(livingRoomOn);

        System.out.println("--- Deshacer ---");
        remote.pressUndo();

        System.out.println("--- Macro: encender todas ---");
        remote.pressButton(allOn);

        System.out.println("--- Deshacer macro ---");
        remote.pressUndo();

        System.out.println("--- Apagar solo cocina ---");
        remote.pressButton(kitchenOff);

        System.out.println("--- Deshacer ---");
        remote.pressUndo();
    }
}
```

**Salida esperada:**
```
--- Encender luz de sala ---
Sala: Luz encendida
--- Deshacer ---
Sala: Luz apagada
--- Macro: encender todas ---
Sala: Luz encendida
Cocina: Luz encendida
--- Deshacer macro ---
Cocina: Luz apagada
Sala: Luz apagada
--- Apagar solo cocina ---
Cocina: Luz apagada
--- Deshacer ---
Cocina: Luz encendida
```

## Variante funcional (Java 8+ con lambdas)

```java
import java.util.function.Consumer;

public class FunctionalCommandDemo {
    public static void main(String[] args) {
        Light light = new Light("Dormitorio");
        RemoteControl remote = new RemoteControl();

        // Command sin clases concretas: usamos expresiones lambda
        Command lightOn = new Command() {
            @Override public void execute() { light.turnOn(); }
            @Override public void undo() { light.turnOff(); }
        };

        // Más conciso con interfaz funcional (si Command tuviera un solo método,
        // pero aquí necesitamos dos métodos así que mantenemos clase anónima o
        // usamos una factoría)
        Command lightOff = CommandFactory.createToggleCommand(
            light::turnOff, light::turnOn
        );

        remote.pressButton(lightOn);
        remote.pressUndo();
    }
}

class CommandFactory {
    public static Command createToggleCommand(Runnable execute, Runnable undo) {
        return new Command() {
            @Override public void execute() { execute.run(); }
            @Override public void undo() { undo.run(); }
        };
    }
}
```

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ command.puml](../diagramas/04-commandpuml.md) | [🏠 Inicio](../../../index.md) | [Command python ▶](03-command-python.md) |
