# Visitor java

## Ejemplo: Árbol de expresiones aritméticas con visitantes para impresión y evaluación

Modelaremos un pequeño AST de expresiones: `Number` (hoja) y `Addition` (compuesto). Implementaremos dos visitantes: `ExpressionPrinter` y `ExpressionEvaluator`.

```java
// ---------- Element ----------
interface Expression {
    <R> R accept(ExpressionVisitor<R> visitor);
}

// ---------- Visitor ----------
interface ExpressionVisitor<R> {
    R visit(Number number);
    R visit(Addition addition);
}

// ---------- ConcreteElements ----------
class Number implements Expression {
    final int value;

    Number(int value) {
        this.value = value;
    }

    @Override
    public <R> R accept(ExpressionVisitor<R> visitor) {
        return visitor.visit(this);
    }
}

class Addition implements Expression {
    final Expression left;
    final Expression right;

    Addition(Expression left, Expression right) {
        this.left = left;
        this.right = right;
    }

    @Override
    public <R> R accept(ExpressionVisitor<R> visitor) {
        return visitor.visit(this);
    }

    public Expression getLeft() { return left; }
    public Expression getRight() { return right; }
}

// ---------- ConcreteVisitor 1: Impresión ----------
class ExpressionPrinter implements ExpressionVisitor<String> {
    @Override
    public String visit(Number number) {
        return Integer.toString(number.value);
    }

    @Override
    public String visit(Addition addition) {
        return "(" + addition.left.accept(this) + " + " + addition.right.accept(this) + ")";
    }
}

// ---------- ConcreteVisitor 2: Evaluación ----------
class ExpressionEvaluator implements ExpressionVisitor<Integer> {
    @Override
    public Integer visit(Number number) {
        return number.value;
    }

    @Override
    public Integer visit(Addition addition) {
        return addition.left.accept(this) + addition.right.accept(this);
    }
}

// ---------- Cliente ----------
public class VisitorDemo {
    public static void main(String[] args) {
        // Construir expresión: (1 + 2) + (3 + 4)
        Expression expr = new Addition(
                new Addition(new Number(1), new Number(2)),
                new Addition(new Number(3), new Number(4))
        );

        ExpressionPrinter printer = new ExpressionPrinter();
        String printed = expr.accept(printer);
        System.out.println("Expresión: " + printed); // ((1 + 2) + (3 + 4))

        ExpressionEvaluator evaluator = new ExpressionEvaluator();
        int result = expr.accept(evaluator);
        System.out.println("Evaluación: " + result); // 10
    }
}
```

**Características importantes**:
- Uso de genéricos (`<R>`) para que los visitantes puedan devolver distintos tipos (`String`, `Integer`).
- El método `accept` en cada elemento llama al `visit` correspondiente del visitante.
- El visitante de impresión y el de evaluación recorren recursivamente los hijos llamando a `accept`.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ visitor.puml](../diagramas/04-visitorpuml.md) | [🏠 Inicio](../../../index.md) | [Visitor python ▶](03-visitor-python.md) |
