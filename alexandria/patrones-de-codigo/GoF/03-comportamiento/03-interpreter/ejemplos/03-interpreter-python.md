# Interpreter python

Mismo ejemplo en Python.

```python
# ---------- Context ----------
class Context:
    def __init__(self):
        self._variables = {}

    def set_variable(self, name: str, value: bool) -> None:
        self._variables[name] = value

    def lookup(self, name: str) -> bool:
        return self._variables.get(name, False)

# ---------- AbstractExpression ----------
class Expression:
    def interpret(self, context: Context) -> bool:
        raise NotImplementedError

# ---------- TerminalExpressions ----------
class Constant(Expression):
    def __init__(self, value: bool):
        self.value = value

    def interpret(self, context: Context) -> bool:
        return self.value

class Variable(Expression):
    def __init__(self, name: str):
        self.name = name

    def interpret(self, context: Context) -> bool:
        return context.lookup(self.name)

# ---------- NonterminalExpressions ----------
class NotExpression(Expression):
    def __init__(self, expression: Expression):
        self.expression = expression

    def interpret(self, context: Context) -> bool:
        return not self.expression.interpret(context)

class AndExpression(Expression):
    def __init__(self, left: Expression, right: Expression):
        self.left = left
        self.right = right

    def interpret(self, context: Context) -> bool:
        return self.left.interpret(context) and self.right.interpret(context)

class OrExpression(Expression):
    def __init__(self, left: Expression, right: Expression):
        self.left = left
        self.right = right

    def interpret(self, context: Context) -> bool:
        return self.left.interpret(context) or self.right.interpret(context)

# ---------- Cliente ----------
if __name__ == "__main__":
    # (a AND b) OR (NOT c)
    expr = OrExpression(
        AndExpression(Variable("a"), Variable("b")),
        NotExpression(Variable("c"))
    )

    context = Context()
    context.set_variable("a", True)
    context.set_variable("b", False)
    context.set_variable("c", True)

    print(f"Resultado: {expr.interpret(context)}")  # False

    context.set_variable("b", True)
    context.set_variable("c", False)
    print(f"Resultado: {expr.interpret(context)}")  # True
```

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Interpreter java](02-interpreter-java.md) | [🏠 Inicio](../../../index.md) | [Iterator ▶](../../04-iterator/01-iterator.md) |
