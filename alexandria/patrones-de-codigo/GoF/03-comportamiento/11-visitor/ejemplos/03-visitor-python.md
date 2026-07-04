# Visitor python

Python no tiene sobrecarga de métodos, por lo que usamos nombres compuestos y un dispatcher mediante `getattr` o una implementación con `isinstance`. La versión más limpia es un visitante con un método `visit` que despacha según el tipo.

```python
from abc import ABC, abstractmethod

# ---------- Element ----------
class Expression(ABC):
    @abstractmethod
    def accept(self, visitor: 'ExpressionVisitor'):
        pass

# ---------- Visitor ----------
class ExpressionVisitor(ABC):
    @abstractmethod
    def visit_number(self, element: 'Number'):
        pass

    @abstractmethod
    def visit_addition(self, element: 'Addition'):
        pass

# ---------- ConcreteElements ----------
class Number(Expression):
    def __init__(self, value: int):
        self.value = value

    def accept(self, visitor: ExpressionVisitor):
        return visitor.visit_number(self)

class Addition(Expression):
    def __init__(self, left: Expression, right: Expression):
        self.left = left
        self.right = right

    def accept(self, visitor: ExpressionVisitor):
        return visitor.visit_addition(self)

# ---------- ConcreteVisitor 1: Impresión ----------
class ExpressionPrinter(ExpressionVisitor):
    def visit_number(self, element: Number) -> str:
        return str(element.value)

    def visit_addition(self, element: Addition) -> str:
        return f"({element.left.accept(self)} + {element.right.accept(self)})"

# ---------- ConcreteVisitor 2: Evaluación ----------
class ExpressionEvaluator(ExpressionVisitor):
    def visit_number(self, element: Number) -> int:
        return element.value

    def visit_addition(self, element: Addition) -> int:
        return element.left.accept(self) + element.right.accept(self)

# ---------- Cliente ----------
if __name__ == "__main__":
    expr = Addition(
        Addition(Number(1), Number(2)),
        Addition(Number(3), Number(4))
    )

    printer = ExpressionPrinter()
    print(f"Expresión: {expr.accept(printer)}")  # ((1 + 2) + (3 + 4))

    evaluator = ExpressionEvaluator()
    print(f"Evaluación: {expr.accept(evaluator)}")  # 10
```

**Alternativa con despacho automático** (más cercana al estilo clásico):

```python
class ExpressionVisitor(ABC):
    def visit(self, element: Expression):
        # Buscar método según nombre de clase
        method_name = f"visit_{type(element).__name__}"
        visitor_method = getattr(self, method_name)
        return visitor_method(element)

# Luego se implementan los métodos en los visitantes concretos.
# Pero esto acopla los nombres de las clases a los métodos.
```

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Visitor java](02-visitor-java.md) | [🏠 Inicio](../../../index.md) | [Patrones y microservicios ▶](../../../04-temas-transversales/01-patrones-y-microservicios.md) |
