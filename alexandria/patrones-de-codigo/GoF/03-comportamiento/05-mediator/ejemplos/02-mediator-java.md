# Mediator java

## Ejemplo: Sala de chat (Mediator) y usuarios (Colegas)

Implementaremos un chat simple donde los usuarios envían mensajes a través de una sala mediadora. Los usuarios no se conocen entre sí.

```java
import java.util.ArrayList;
import java.util.List;

// ---------- Mediator ----------
interface ChatMediator {
    void sendMessage(String message, User user);
    void addUser(User user);
}

// ---------- ConcreteMediator ----------
class ChatRoom implements ChatMediator {
    private List<User> users = new ArrayList<>();

    @Override
    public void addUser(User user) {
        users.add(user);
        user.setMediator(this);
    }

    @Override
    public void sendMessage(String message, User sender) {
        for (User user : users) {
            // No enviar el mensaje al remitente
            if (user != sender) {
                user.receive(message);
            }
        }
    }
}

// ---------- Colleague (abstracto) ----------
abstract class User {
    protected ChatMediator mediator;
    protected String name;

    public User(String name) {
        this.name = name;
    }

    public void setMediator(ChatMediator mediator) {
        this.mediator = mediator;
    }

    public abstract void send(String message);
    public abstract void receive(String message);
}

// ---------- ConcreteColleague ----------
class ChatUser extends User {
    public ChatUser(String name) {
        super(name);
    }

    @Override
    public void send(String message) {
        System.out.println(name + " envía: " + message);
        mediator.sendMessage(message, this);
    }

    @Override
    public void receive(String message) {
        System.out.println(name + " recibe: " + message);
    }
}

// ---------- Cliente ----------
public class MediatorDemo {
    public static void main(String[] args) {
        ChatMediator chatRoom = new ChatRoom();

        User alice = new ChatUser("Alice");
        User bob = new ChatUser("Bob");
        User charlie = new ChatUser("Charlie");

        chatRoom.addUser(alice);
        chatRoom.addUser(bob);
        chatRoom.addUser(charlie);

        alice.send("Hola a todos!");
        System.out.println("---");
        bob.send("Hola Alice!");
    }
}
```

**Salida esperada:**
```
Alice envía: Hola a todos!
Bob recibe: Hola a todos!
Charlie recibe: Hola a todos!
---
Bob envía: Hola Alice!
Alice recibe: Hola Alice!
Charlie recibe: Hola Alice!
```

El mediador `ChatRoom` centraliza la distribución de mensajes. Los usuarios no tienen referencias entre sí; solo conocen al mediador.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ mediator.puml](../diagramas/04-mediatorpuml.md) | [🏠 Inicio](../../../index.md) | [Mediator python ▶](03-mediator-python.md) |
