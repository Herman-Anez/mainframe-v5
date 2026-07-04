# Strategy python

```python
from abc import ABC, abstractmethod

# ---------- Strategy ----------
class PaymentStrategy(ABC):
    @abstractmethod
    def pay(self, amount: float) -> None:
        pass

# ---------- ConcreteStrategies ----------
class CreditCardPayment(PaymentStrategy):
    def __init__(self, card_number: str, expiry_date: str, cvv: str):
        self._card_number = card_number
        self._expiry_date = expiry_date
        self._cvv = cvv

    def pay(self, amount: float) -> None:
        masked = f"****-****-****-{self._card_number[-4:]}"
        print(f"Pagando {amount}€ con tarjeta de crédito {masked}")

class PayPalPayment(PaymentStrategy):
    def __init__(self, email: str):
        self._email = email

    def pay(self, amount: float) -> None:
        print(f"Pagando {amount}€ con PayPal usando la cuenta {self._email}")

class BankTransferPayment(PaymentStrategy):
    def __init__(self, iban: str):
        self._iban = iban

    def pay(self, amount: float) -> None:
        print(f"Pagando {amount}€ por transferencia bancaria al IBAN {self._iban}")

# ---------- Context ----------
class ShoppingCart:
    def __init__(self):
        self._payment_strategy: PaymentStrategy | None = None

    def set_payment_strategy(self, strategy: PaymentStrategy) -> None:
        self._payment_strategy = strategy

    def checkout(self, amount: float) -> None:
        if not self._payment_strategy:
            raise ValueError("Seleccione un método de pago")
        self._payment_strategy.pay(amount)

# ---------- Cliente ----------
if __name__ == "__main__":
    cart = ShoppingCart()

    cart.set_payment_strategy(CreditCardPayment("1234567890123456", "12/25", "123"))
    cart.checkout(120.50)

    cart.set_payment_strategy(PayPalPayment("cliente@example.com"))
    cart.checkout(45.00)

    cart.set_payment_strategy(BankTransferPayment("ES12345678901234567890"))
    cart.checkout(99.99)
```

**Variante pitónica con funciones:**
En Python, dado que las funciones son objetos, podemos pasar una función como estrategia directamente si no se necesita estado adicional.

```python
def credit_card_payment(amount):
    print(f"Pagando {amount}€ con tarjeta")

def paypal_payment(amount):
    print(f"Pagando {amount}€ con PayPal")

cart = ShoppingCart()
cart.set_payment_strategy(credit_card_payment)  # requiere adaptación de interfaz
```

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Strategy java](02-strategy-java.md) | [🏠 Inicio](../../../index.md) | [Template method ▶](../../10-template-method/01-template-method.md) |
