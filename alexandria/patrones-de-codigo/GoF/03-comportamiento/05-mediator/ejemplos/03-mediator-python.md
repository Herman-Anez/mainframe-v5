# Mediator python

```python
from abc import ABC, abstractmethod

# ---------- Mediator ----------
class ChatMediator(ABC):
    @abstractmethod
    def send_message(self, message: str, sender: 'User') -> None:
        pass

    @abstractmethod
    def add_user(self, user: 'User') -> None:
        pass

# ---------- ConcreteMediator ----------
class ChatRoom(ChatMediator):
    def __init__(self):
        self.users: list[User] = []

    def add_user(self, user: 'User') -> None:
        self.users.append(user)
        user.mediator = self

    def send_message(self, message: str, sender: 'User') -> None:
        for user in self.users:
            if user != sender:
                user.receive(message)

# ---------- Colleague (abstracto) ----------
class User(ABC):
    def __init__(self, name: str):
        self.name = name
        self.mediator: ChatMediator | None = None

    @abstractmethod
    def send(self, message: str) -> None:
        pass

    @abstractmethod
    def receive(self, message: str) -> None:
        pass

# ---------- ConcreteColleague ----------
class ChatUser(User):
    def send(self, message: str) -> None:
        print(f"{self.name} envía: {message}")
        if self.mediator:
            self.mediator.send_message(message, self)

    def receive(self, message: str) -> None:
        print(f"{self.name} recibe: {message}")

# ---------- Cliente ----------
if __name__ == "__main__":
    chat_room = ChatRoom()

    alice = ChatUser("Alice")
    bob = ChatUser("Bob")
    charlie = ChatUser("Charlie")

    chat_room.add_user(alice)
    chat_room.add_user(bob)
    chat_room.add_user(charlie)

    alice.send("Hola a todos!")
    print("---")
    bob.send("Hola Alice!")
```

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Mediator java](02-mediator-java.md) | [🏠 Inicio](../../../index.md) | [Memento ▶](../../06-memento/01-memento.md) |
