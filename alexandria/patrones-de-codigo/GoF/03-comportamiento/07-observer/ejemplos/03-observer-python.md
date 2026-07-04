# Observer python

Mismo ejemplo usando clases base abstractas.

```python
from abc import ABC, abstractmethod

# ---------- Subject ----------
class Subject(ABC):
    @abstractmethod
    def attach(self, observer: 'Observer') -> None:
        pass

    @abstractmethod
    def detach(self, observer: 'Observer') -> None:
        pass

    @abstractmethod
    def notify_observers(self) -> None:
        pass

# ---------- Observer ----------
class Observer(ABC):
    @abstractmethod
    def update(self) -> None:
        pass

# ---------- ConcreteSubject ----------
class WeatherData(Subject):
    def __init__(self):
        self._observers = []
        self._temperature = 0.0
        self._humidity = 0.0
        self._pressure = 0.0

    def attach(self, observer: Observer) -> None:
        self._observers.append(observer)

    def detach(self, observer: Observer) -> None:
        self._observers.remove(observer)

    def notify_observers(self) -> None:
        for observer in self._observers:
            observer.update()

    def set_measurements(self, temperature: float, humidity: float, pressure: float) -> None:
        self._temperature = temperature
        self._humidity = humidity
        self._pressure = pressure
        self._measurements_changed()

    def _measurements_changed(self) -> None:
        self.notify_observers()

    @property
    def temperature(self) -> float:
        return self._temperature

    @property
    def humidity(self) -> float:
        return self._humidity

    @property
    def pressure(self) -> float:
        return self._pressure

# ---------- ConcreteObservers ----------
class CurrentConditionsDisplay(Observer):
    def __init__(self, weather_data: WeatherData):
        self._weather_data = weather_data
        weather_data.attach(self)

    def update(self) -> None:
        temp = self._weather_data.temperature
        humidity = self._weather_data.humidity
        print(f"Condiciones actuales: {temp}°C, {humidity}% humedad")

class ForecastDisplay(Observer):
    def __init__(self, weather_data: WeatherData):
        self._weather_data = weather_data
        weather_data.attach(self)

    def update(self) -> None:
        pressure = self._weather_data.pressure
        if pressure > 1020:
            print("Pronóstico: Soleado")
        else:
            print("Pronóstico: Lluvioso")

# ---------- Cliente ----------
if __name__ == "__main__":
    weather = WeatherData()
    current_display = CurrentConditionsDisplay(weather)
    forecast_display = ForecastDisplay(weather)

    weather.set_measurements(25.0, 65.0, 1013.1)
    print("---")
    weather.set_measurements(22.5, 70.0, 1025.0)
```

**Salida:**
```
Condiciones actuales: 25.0°C, 65.0% humedad
Pronóstico: Lluvioso
---
Condiciones actuales: 22.5°C, 70.0% humedad
Pronóstico: Soleado
```

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Observer java](02-observer-java.md) | [🏠 Inicio](../../../index.md) | [State ▶](../../08-state/01-state.md) |
