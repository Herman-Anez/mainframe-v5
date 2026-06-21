# Fragmentos clave

A continuación, fragmentos de código que ilustran los elementos más importantes de la arquitectura hexagonal en Spring Boot.

## 2.1. Dominio puro

### Entidad y agregado
`Pedido` es la raíz del agregado. No tiene anotaciones de Spring, JPA ni nada externo. Contiene lógica de negocio y mantiene una lista de eventos de dominio.

```java
package com.tiendapedidos.domain.model;

import com.tiendapedidos.domain.event.PedidoCreado;
import com.tiendapedidos.domain.exception.PedidoNoModificableException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class Pedido {
    private PedidoId id;
    private ClienteId clienteId;
    private List<LineaPedido> lineas;
    private PedidoEstado estado;
    private List<Object> eventos; // En un diseño real usaríamos una lista de EventoDeDominio

    private Pedido(PedidoId id, ClienteId clienteId) {
        this.id = id;
        this.clienteId = clienteId;
        this.lineas = new ArrayList<>();
        this.estado = PedidoEstado.PENDIENTE;
        this.eventos = new ArrayList<>();
    }

    // Factory method estático como conveniencia
    public static Pedido crear(ClienteId clienteId, List<SolicitudLinea> solicitudes) {
        Pedido pedido = new Pedido(new PedidoId(), clienteId);
        for (SolicitudLinea sl : solicitudes) {
            pedido.agregarLinea(sl.productoId(), sl.cantidad(), sl.precioUnitario());
        }
        pedido.eventos.add(new PedidoCreado(pedido.id));
        return pedido;
    }

    public void agregarLinea(ProductoId productoId, int cantidad, Dinero precioUnitario) {
        if (estado != PedidoEstado.PENDIENTE) {
            throw new PedidoNoModificableException("No se pueden agregar líneas en estado " + estado);
        }
        LineaPedido nuevaLinea = new LineaPedido(productoId, cantidad, precioUnitario);
        lineas.add(nuevaLinea);
    }

    public void cancelar() {
        if (estado == PedidoEstado.ENVIADO) {
            throw new PedidoNoModificableException("Un pedido enviado no puede cancelarse");
        }
        this.estado = PedidoEstado.CANCELADO;
        // Registrar evento...
    }

    public List<Object> obtenerEventos() {
        return Collections.unmodifiableList(eventos);
    }

    // Getters...
    public PedidoId getId() { return id; }
    public ClienteId getClienteId() { return clienteId; }
    public PedidoEstado getEstado() { return estado; }
    public List<LineaPedido> getLineas() { return Collections.unmodifiableList(lineas); }
}
```

### Value Object (inmutable)
```java
package com.tiendapedidos.domain.model;

import java.math.BigDecimal;
import java.util.Objects;

public class Dinero {
    private final BigDecimal cantidad;
    private final String moneda;

    public Dinero(BigDecimal cantidad, String moneda) {
        if (cantidad.compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalArgumentException("El dinero no puede ser negativo");
        }
        this.cantidad = cantidad;
        this.moneda = Objects.requireNonNull(moneda);
    }

    public Dinero sumar(Dinero otro) {
        if (!this.moneda.equals(otro.moneda)) {
            throw new IllegalArgumentException("No se pueden sumar distintas monedas");
        }
        return new Dinero(this.cantidad.add(otro.cantidad), this.moneda);
    }
    // getters, equals, hashCode...
}
```

### Puerto secundario (Driven Port)
```java
package com.tiendapedidos.domain.port;

import com.tiendapedidos.domain.model.Pedido;
import com.tiendapedidos.domain.model.PedidoId;
import java.util.Optional;

public interface RepositorioPedidos {
    void guardar(Pedido pedido);
    Optional<Pedido> buscarPorId(PedidoId id);
    // otros métodos...
}
```

```java
package com.tiendapedidos.domain.port;

public interface PublicadorEventos {
    void publicar(Object evento);
}
```

## 2.2. Capa de aplicación

### Puerto primario (Driving Port)
```java
package com.tiendapedidos.application.port;

import com.tiendapedidos.application.command.CrearPedidoCommand;
import com.tiendapedidos.domain.model.PedidoId;

public interface GestionPedidos {
    PedidoId crearPedido(CrearPedidoCommand comando);
    void cancelarPedido(PedidoId pedidoId);
    // otros casos de uso
}
```

### Comando (DTO de entrada)
```java
package com.tiendapedidos.application.command;

import com.tiendapedidos.domain.model.ClienteId;

public class CrearPedidoCommand {
    private final ClienteId clienteId;
    private final List<SolicitudLinea> lineas;

    // constructor, getters...
}
```

### Servicio de aplicación (implementa el puerto primario)
```java
package com.tiendapedidos.application.service;

import com.tiendapedidos.application.command.CrearPedidoCommand;
import com.tiendapedidos.application.port.GestionPedidos;
import com.tiendapedidos.domain.model.Pedido;
import com.tiendapedidos.domain.model.PedidoId;
import com.tiendapedidos.domain.port.PublicadorEventos;
import com.tiendapedidos.domain.port.RepositorioPedidos;
import org.springframework.transaction.annotation.Transactional;

public class PedidoApplicationService implements GestionPedidos {

    private final RepositorioPedidos repositorio;
    private final PublicadorEventos publicador;

    // Inyectamos puertos secundarios (interfaces)
    public PedidoApplicationService(RepositorioPedidos repositorio, PublicadorEventos publicador) {
        this.repositorio = repositorio;
        this.publicador = publicador;
    }

    @Override
    @Transactional
    public PedidoId crearPedido(CrearPedidoCommand comando) {
        // 1. Llamada al dominio: crea el agregado
        Pedido nuevoPedido = Pedido.crear(comando.getClienteId(), comando.getLineas());
        // 2. Persistencia a través del puerto
        repositorio.guardar(nuevoPedido);
        // 3. Publicar eventos generados por el dominio
        nuevoPedido.obtenerEventos().forEach(publicador::publicar);
        return nuevoPedido.getId();
    }

    @Override
    @Transactional
    public void cancelarPedido(PedidoId pedidoId) {
        Pedido pedido = repositorio.buscarPorId(pedidoId)
            .orElseThrow(() -> new PedidoNoEncontradoException(pedidoId));
        pedido.cancelar();
        repositorio.guardar(pedido);
        pedido.obtenerEventos().forEach(publicador::publicar);
    }
}
```
*Observa:* el servicio no contiene lógica de negocio, solo orquesta. La anotación `@Transactional` es de Spring, pero está en la capa de aplicación (podríamos abstraerla si quisiéramos máxima pureza, pero es un trade-off aceptable).

## 2.3. Adaptadores (Infraestructura)

### Adaptador primario: Controlador REST
```java
package com.tiendapedidos.infrastructure.web;

import com.tiendapedidos.application.command.CrearPedidoCommand;
import com.tiendapedidos.application.port.GestionPedidos;
import com.tiendapedidos.domain.model.PedidoId;
import com.tiendapedidos.infrastructure.web.dto.CrearPedidoRequest;
import com.tiendapedidos.infrastructure.web.dto.PedidoResponse;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/pedidos")
public class PedidoController {

    private final GestionPedidos gestionPedidos; // Puerto primario

    public PedidoController(GestionPedidos gestionPedidos) {
        this.gestionPedidos = gestionPedidos;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public PedidoResponse crear(@RequestBody CrearPedidoRequest request) {
        // Traducción de DTO de transporte a comando (usando mapper)
        CrearPedidoCommand comando = PedidoTransportMapper.aComando(request);
        PedidoId id = gestionPedidos.crearPedido(comando);
        return new PedidoResponse(id.getValor());
    }
}
```

Los DTOs de transporte (`CrearPedidoRequest`, `PedidoResponse`) son clases simples con anotaciones Jackson (`@JsonProperty`), sin lógica de negocio.

### Mapper de transporte (infraestructura)
```java
package com.tiendapedidos.infrastructure.web;

import com.tiendapedidos.application.command.CrearPedidoCommand;
import com.tiendapedidos.infrastructure.web.dto.CrearPedidoRequest;

public class PedidoTransportMapper {
    public static CrearPedidoCommand aComando(CrearPedidoRequest request) {
        // Convierte los datos crudos en objetos del dominio (puede crear value objects)
        // ...
    }
}
```

### Adaptador secundario: Repositorio JPA
Implementa el puerto `RepositorioPedidos` usando Spring Data JPA y un modelo de persistencia separado.

**Modelo JPA (infraestructura)**:
```java
package com.tiendapedidos.infrastructure.persistence.jpa;

import javax.persistence.*;
import java.util.List;

@Entity
@Table(name = "pedidos")
public class PedidoJpaEntity {
    @Id
    private String id;
    private String clienteId;
    @Enumerated(EnumType.STRING)
    private String estado;

    @OneToMany(mappedBy = "pedido", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<LineaPedidoJpaEntity> lineas;
    // getters, setters...
}
```

**Adaptador del repositorio**:
```java
package com.tiendapedidos.infrastructure.persistence;

import com.tiendapedidos.domain.model.Pedido;
import com.tiendapedidos.domain.model.PedidoId;
import com.tiendapedidos.domain.port.RepositorioPedidos;
import com.tiendapedidos.infrastructure.persistence.jpa.PedidoJpaEntity;
import com.tiendapedidos.infrastructure.persistence.jpa.PedidoJpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public class RepositorioPedidosJpa implements RepositorioPedidos {

    private final PedidoJpaRepository jpaRepository;
    private final PedidoMapper mapper; // mapper entre JPA y dominio

    public RepositorioPedidosJpa(PedidoJpaRepository jpaRepository, PedidoMapper mapper) {
        this.jpaRepository = jpaRepository;
        this.mapper = mapper;
    }

    @Override
    public void guardar(Pedido pedido) {
        PedidoJpaEntity entity = mapper.aJpaEntity(pedido);
        jpaRepository.save(entity);
    }

    @Override
    public Optional<Pedido> buscarPorId(PedidoId id) {
        return jpaRepository.findById(id.getValor()).map(mapper::aDominio);
    }
}
```

**Mapper (infraestructura)**:
```java
package com.tiendapedidos.infrastructure.persistence;

import com.tiendapedidos.domain.model.*;
import com.tiendapedidos.infrastructure.persistence.jpa.LineaPedidoJpaEntity;
import com.tiendapedidos.infrastructure.persistence.jpa.PedidoJpaEntity;

public class PedidoMapper {
    Pedido aDominio(PedidoJpaEntity entity) {
        // reconstruye el agregado completo, incluyendo lineas
    }
    PedidoJpaEntity aJpaEntity(Pedido pedido) {
        // convierte a entidades JPA
    }
}
```

### Adaptador secundario: Publicador de eventos (Kafka)
```java
package com.tiendapedidos.infrastructure.messaging;

import com.tiendapedidos.domain.port.PublicadorEventos;
import org.springframework.kafka.core.KafkaTemplate;

public class KafkaPublicadorEventos implements PublicadorEventos {

    private final KafkaTemplate<String, Object> kafkaTemplate;

    public KafkaPublicadorEventos(KafkaTemplate<String, Object> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }

    @Override
    public void publicar(Object evento) {
        String topico = determinarTopico(evento);
        kafkaTemplate.send(topico, evento.getClass().getSimpleName(), evento);
    }

    private String determinarTopico(Object evento) {
        // lógica de mapeo: PedidoCreado -> "pedido-creado"
        return evento.getClass().getSimpleName().toLowerCase().replace("evento", "");
    }
}
```

## 2.4. Configuración y cableado (Composition Root)

Aquí se define cómo se inyectan las implementaciones concretas. Se utilizan beans de Spring explícitos (en lugar de depender solo de anotaciones como `@Service`).

```java
package com.tiendapedidos.infrastructure.config;

import com.tiendapedidos.application.port.GestionPedidos;
import com.tiendapedidos.application.service.PedidoApplicationService;
import com.tiendapedidos.domain.port.PublicadorEventos;
import com.tiendapedidos.domain.port.RepositorioPedidos;
import com.tiendapedidos.infrastructure.messaging.KafkaPublicadorEventos;
import com.tiendapedidos.infrastructure.persistence.RepositorioPedidosJpa;
import com.tiendapedidos.infrastructure.persistence.PedidoMapper;
import com.tiendapedidos.infrastructure.persistence.jpa.PedidoJpaRepository;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.core.KafkaTemplate;

@Configuration
public class BeanConfiguration {

    // Repositorio
    @Bean
    public RepositorioPedidos repositorioPedidos(PedidoJpaRepository jpaRepository, PedidoMapper mapper) {
        return new RepositorioPedidosJpa(jpaRepository, mapper);
    }

    // Publicador de eventos (puede cambiarse a RabbitMQ solo modificando este bean)
    @Bean
    public PublicadorEventos publicadorEventos(KafkaTemplate<String, Object> kafkaTemplate) {
        return new KafkaPublicadorEventos(kafkaTemplate);
    }

    // Servicio de aplicación (inyectando puertos)
    @Bean
    public GestionPedidos gestionPedidos(RepositorioPedidos repositorio, PublicadorEventos publicador) {
        return new PedidoApplicationService(repositorio, publicador);
    }

    @Bean
    public PedidoMapper pedidoMapper() {
        return new PedidoMapper();
    }
}
```

El controlador (`PedidoController`) se registra como bean mediante `@RestController` y recibe `GestionPedidos` (la interfaz) por constructor, que Spring resuelve con la implementación de `PedidoApplicationService`.

## 2.5. Pruebas

### Test unitario del dominio
Sin Spring, sin mocks de infraestructura. Prueban las reglas directamente.
```java
package com.tiendapedidos.domain;

import com.tiendapedidos.domain.model.Pedido;
import com.tiendapedidos.domain.model.PedidoEstado;
import com.tiendapedidos.domain.exception.PedidoNoModificableException;
import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.*;

class PedidoTest {

    @Test
    void cancelarPedidoEnviadoLanzaExcepcion() {
        Pedido pedido = PedidoFactory.pedidoEnEstado(PedidoEstado.ENVIADO);
        assertThatThrownBy(pedido::cancelar)
            .isInstanceOf(PedidoNoModificableException.class);
    }
}
```

### Test de servicio de aplicación (caso de uso) con dobles
Se usan mocks para los puertos secundarios. No se necesita base de datos ni Kafka.
```java
package com.tiendapedidos.application;

import com.tiendapedidos.application.command.CrearPedidoCommand;
import com.tiendapedidos.application.service.PedidoApplicationService;
import com.tiendapedidos.domain.model.PedidoId;
import com.tiendapedidos.domain.port.PublicadorEventos;
import com.tiendapedidos.domain.port.RepositorioPedidos;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;

import static org.mockito.Mockito.*;

class PedidoApplicationServiceTest {

    @Test
    void crearPedidoGuardaYPublicaEvento() {
        RepositorioPedidos repoMock = mock(RepositorioPedidos.class);
        PublicadorEventos publicadorMock = mock(PublicadorEventos.class);
        PedidoApplicationService service = new PedidoApplicationService(repoMock, publicadorMock);
        CrearPedidoCommand comando = new CrearPedidoCommand(...);

        PedidoId id = service.crearPedido(comando);

        verify(repoMock).guardar(any());
        verify(publicadorMock).publicar(any());
        assertThat(id).isNotNull();
    }
}
```

### Test de integración del adaptador de persistencia
Prueba el repositorio con una base de datos real (usando Testcontainers o H2 en modo PostgreSQL). Aquí se comprueba que el mapeo funciona y el contrato se cumple.
```java
package com.tiendapedidos.infrastructure;

import com.tiendapedidos.domain.model.Pedido;
import com.tiendapedidos.infrastructure.persistence.RepositorioPedidosJpa;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.context.annotation.Import;

@DataJpaTest
@Import({RepositorioPedidosJpa.class, PedidoMapper.class})
class RepositorioPedidosJpaTest {

    @Autowired
    private RepositorioPedidosJpa repositorio;

    @Test
    void guardarYRecuperarPedido() {
        Pedido pedido = Pedido.crear(new ClienteId("C1"), ...);
        repositorio.guardar(pedido);
        Pedido recuperado = repositorio.buscarPorId(pedido.getId()).orElseThrow();
        assertThat(recuperado.getClienteId()).isEqualTo(pedido.getClienteId());
    }
}
```

### Test del controlador (adaptador primario)
Prueba que las peticiones HTTP se convierten correctamente y que el puerto primario se invoca.
```java
package com.tiendapedidos.infrastructure.web;

import com.tiendapedidos.application.port.GestionPedidos;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(PedidoController.class)
class PedidoControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private GestionPedidos gestionPedidos; // mock del puerto primario

    @Test
    void crearPedidoRetornaCreated() throws Exception {
        when(gestionPedidos.crearPedido(any())).thenReturn(new PedidoId("123"));

        mockMvc.perform(post("/api/v1/pedidos")
                .contentType("application/json")
                .content("{\"clienteId\":\"C1\"}"))
               .andExpect(status().isCreated())
               .andExpect(jsonPath("$.id").value("123"));
    }
}
```

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Estructura de carpetas (Spring Boot + Hexagonal)](01-estructura-de-carpetas-spring-boot-hexagonal.md) | [🏠 Inicio](../../index.md) | [Resumen del ejemplo Spring Boot ▶](03-resumen-del-ejemplo-spring-boot.md) |
