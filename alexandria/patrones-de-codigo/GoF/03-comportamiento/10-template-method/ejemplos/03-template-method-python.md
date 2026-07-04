# Template method python

En Python, podemos implementar Template Method con clases abstractas (ABC). El método plantilla no puede ser `final`, pero por convención no se sobrescribe.

```python
from abc import ABC, abstractmethod

# ---------- AbstractClass ----------
class DataMiner(ABC):
    def mine(self, file_path: str) -> None:
        """Método plantilla (no debe ser sobrescrito por convención)."""
        self._open_file(file_path)
        raw_data = self._read_data()
        analysis = self._analyze_data(raw_data)
        self._generate_report(analysis)
        self._close_file(file_path)

    def _open_file(self, path: str) -> None:
        print(f"Abriendo archivo: {path}")

    def _close_file(self, path: str) -> None:
        print(f"Cerrando archivo: {path}")

    def _generate_report(self, analysis: str) -> None:
        """Hook: puede ser sobrescrito."""
        print(f"Generando informe: {analysis}")

    @abstractmethod
    def _read_data(self) -> str:
        pass

    @abstractmethod
    def _analyze_data(self, raw_data: str) -> str:
        pass

# ---------- ConcreteClasses ----------
class CsvMiner(DataMiner):
    def _read_data(self) -> str:
        print("Leyendo datos CSV...")
        return "nombre,edad\nAlice,30\nBob,25"

    def _analyze_data(self, raw_data: str) -> str:
        print("Analizando datos CSV...")
        line_count = len(raw_data.strip().split("\n")) - 1
        return f"Análisis CSV: {line_count} registros encontrados"

class JsonMiner(DataMiner):
    def _read_data(self) -> str:
        print("Leyendo datos JSON...")
        return '{ "users": [{"name":"Alice","age":30}, {"name":"Bob","age":25}] }'

    def _analyze_data(self, raw_data: str) -> str:
        print("Analizando datos JSON...")
        user_count = raw_data.count('"name"')
        return f"Análisis JSON: {user_count} usuarios encontrados"

    def _generate_report(self, analysis: str) -> None:
        print(f'{{ "report": "{analysis}" }}')

# ---------- Cliente ----------
if __name__ == "__main__":
    csv_miner = CsvMiner()
    csv_miner.mine("datos.csv")

    print("---")

    json_miner = JsonMiner()
    json_miner.mine("datos.json")
```

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Template method java](02-template-method-java.md) | [🏠 Inicio](../../../index.md) | [Visitor ▶](../../11-visitor/01-visitor.md) |
