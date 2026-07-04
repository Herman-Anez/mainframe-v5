# Strategy java

## Ejemplo: Carrito de compras con métodos de pago

Implementaremos un carrito (`ShoppingCart`) que puede pagar usando diferentes `PaymentStrategy`.

```java
// ---------- Strategy ----------
interface PaymentStrategy {
    void pay(double amount);
}

// ---------- ConcreteStrategies ----------
class CreditCardPayment implements PaymentStrategy {
    private String cardNumber;
    private String expiryDate;
    private String cvv;

    public CreditCardPayment(String cardNumber, String expiryDate, String cvv) {
        this.cardNumber = cardNumber;
        this.expiryDate = expiryDate;
        this.cvv = cvv;
    }

    @Override
    public void pay(double amount) {
        System.out.println("Pagando " + amount + "€ con tarjeta de crédito " + maskCardNumber());
        // Lógica real de pago con tarjeta
    }

    private String maskCardNumber() {
        return "****-****-****-" + cardNumber.substring(cardNumber.length() - 4);
    }
}

class PayPalPayment implements PaymentStrategy {
    private String email;

    public PayPalPayment(String email) {
        this.email = email;
    }

    @Override
    public void pay(double amount) {
        System.out.println("Pagando " + amount + "€ con PayPal usando la cuenta " + email);
    }
}

class BankTransferPayment implements PaymentStrategy {
    private String iban;

    public BankTransferPayment(String iban) {
        this.iban = iban;
    }

    @Override
    public void pay(double amount) {
        System.out.println("Pagando " + amount + "€ por transferencia bancaria al IBAN " + iban);
    }
}

// ---------- Context ----------
class ShoppingCart {
    private PaymentStrategy paymentStrategy;

    public void setPaymentStrategy(PaymentStrategy strategy) {
        this.paymentStrategy = strategy;
    }

    public void checkout(double amount) {
        if (paymentStrategy == null) {
            throw new IllegalStateException("Seleccione un método de pago");
        }
        paymentStrategy.pay(amount);
    }
}

// ---------- Cliente ----------
public class StrategyDemo {
    public static void main(String[] args) {
        ShoppingCart cart = new ShoppingCart();

        // Cliente elige pagar con tarjeta
        cart.setPaymentStrategy(new CreditCardPayment("1234567890123456", "12/25", "123"));
        cart.checkout(120.50);

        // Cambio de estrategia en tiempo de ejecución: pagar con PayPal
        cart.setPaymentStrategy(new PayPalPayment("cliente@example.com"));
        cart.checkout(45.00);

        // Cambiar a transferencia
        cart.setPaymentStrategy(new BankTransferPayment("ES12345678901234567890"));
        cart.checkout(99.99);
    }
}
```

**Salida esperada:**
```
Pagando 120.5€ con tarjeta de crédito ****-****-****-3456
Pagando 45.0€ con PayPal usando la cuenta cliente@example.com
Pagando 99.99€ por transferencia bancaria al IBAN ES12345678901234567890
```

## Variante funcional (Java 8+)

Si la interfaz `PaymentStrategy` tuviera un solo método, podríamos usar lambdas, pero aquí mantenemos clases para mayor claridad y porque el patrón clásico es más ilustrativo.

```java
// Con interfaz funcional:
@FunctionalInterface
interface PaymentFunction {
    void pay(double amount);
}

// Uso:
PaymentFunction creditCard = amount -> System.out.println("Pagando " + amount + " con tarjeta");
cart.setPaymentStrategy(creditCard); // Necesitamos adaptar, no es exactamente igual.
```

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ strategy.puml](../diagramas/04-strategypuml.md) | [🏠 Inicio](../../../index.md) | [Strategy python ▶](03-strategy-python.md) |
