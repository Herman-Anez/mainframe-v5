# Observer java

## Ejemplo: Estación meteorológica (Weather Station)

Implementaremos un sujeto `WeatherData` que notifica cambios de temperatura, humedad y presión a varios observadores (display). Usaremos el modelo *pull*: los observadores consultan al sujeto.

```java
import java.util.ArrayList;
import java.util.List;

// ---------- Subject ----------
interface Subject {
    void attach(Observer o);
    void detach(Observer o);
    void notifyObservers();
}

// ---------- Observer ----------
interface Observer {
    void update();
}

// ---------- ConcreteSubject ----------
class WeatherData implements Subject {
    private List<Observer> observers = new ArrayList<>();
    private float temperature;
    private float humidity;
    private float pressure;

    @Override
    public void attach(Observer o) {
        observers.add(o);
    }

    @Override
    public void detach(Observer o) {
        observers.remove(o);
    }

    @Override
    public void notifyObservers() {
        for (Observer o : observers) {
            o.update();
        }
    }

    public void setMeasurements(float temperature, float humidity, float pressure) {
        this.temperature = temperature;
        this.humidity = humidity;
        this.pressure = pressure;
        measurementsChanged();
    }

    private void measurementsChanged() {
        notifyObservers();
    }

    // Getters para el modelo pull
    public float getTemperature() { return temperature; }
    public float getHumidity() { return humidity; }
    public float getPressure() { return pressure; }
}

// ---------- ConcreteObservers ----------
class CurrentConditionsDisplay implements Observer {
    private WeatherData weatherData;

    public CurrentConditionsDisplay(WeatherData weatherData) {
        this.weatherData = weatherData;
        weatherData.attach(this);
    }

    @Override
    public void update() {
        float temp = weatherData.getTemperature();
        float humidity = weatherData.getHumidity();
        System.out.println("Condiciones actuales: " + temp + "°C, " + humidity + "% humedad");
    }
}

class ForecastDisplay implements Observer {
    private WeatherData weatherData;

    public ForecastDisplay(WeatherData weatherData) {
        this.weatherData = weatherData;
        weatherData.attach(this);
    }

    @Override
    public void update() {
        float pressure = weatherData.getPressure();
        if (pressure > 1020) {
            System.out.println("Pronóstico: Soleado");
        } else {
            System.out.println("Pronóstico: Lluvioso");
        }
    }
}

// ---------- Cliente ----------
public class ObserverDemo {
    public static void main(String[] args) {
        WeatherData weatherData = new WeatherData();

        CurrentConditionsDisplay currentDisplay = new CurrentConditionsDisplay(weatherData);
        ForecastDisplay forecastDisplay = new ForecastDisplay(weatherData);

        weatherData.setMeasurements(25.0f, 65.0f, 1013.1f);
        System.out.println("---");
        weatherData.setMeasurements(22.5f, 70.0f, 1025.0f);
    }
}
```

**Salida esperada:**
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
| [◀ observer.puml](../diagramas/04-observerpuml.md) | [🏠 Inicio](../../../index.md) | [Observer python ▶](03-observer-python.md) |
