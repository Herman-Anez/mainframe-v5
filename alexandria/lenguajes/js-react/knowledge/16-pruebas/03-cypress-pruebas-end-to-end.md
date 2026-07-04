# Cypress (Pruebas End-to-End)

Cypress es un framework de pruebas E2E que se ejecuta directamente en el navegador, interactuando con la aplicación como lo haría un usuario real. A diferencia de Jest/RTL, no utiliza jsdom, sino que se conecta a una instancia real del navegador (Electron, Chrome, Firefox, Edge).

## ¿Por qué Cypress?
- **Fiabilidad**: se ejecuta en el mismo bucle de eventos que la aplicación, puede esperar automáticamente por elementos, peticiones XHR, animaciones.
- **Depuración visual**: time travel con snapshots de cada paso, acceso a las DevTools del navegador.
- **API fluida**: comandos encadenables, aserciones integradas (Chai, Sinon).
- **Stubbing y control de red**: `cy.intercept()` para espiar o simular respuestas de API.

## Configuración
Se instala como dependencia dev. Al ejecutar `npx cypress open`, se crea una estructura `cypress/` con `e2e/`, `fixtures/`, `support/` y `cypress.config.js`.

## Comandos básicos
- **Visitar**: `cy.visit('/ruta')` – navega a la aplicación.
- **Consultar elementos**: `cy.get(selector)`, `cy.contains(texto)`, `cy.find(selector)`.
- **Interacciones**: `.click()`, `.type(texto)`, `.check()`, `.select(valor)`, `.trigger(evento)`.
- **Aserciones**: `.should('be.visible')`, `.should('have.text', texto)`, `.should('have.class', clase)`.
- **Esperar**: automática, pero se puede forzar con `.wait(ms)` o `.wait('@alias')`.
- **Navegación**: `cy.url().should('include', '/ruta')`.

## Ejemplo de prueba
```js
describe('Flujo de login', () => {
  it('debe iniciar sesión correctamente', () => {
    cy.visit('/login');
    cy.get('input[name="email"]').type('test@example.com');
    cy.get('input[name="password"]').type('password123');
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/dashboard');
    cy.contains('Bienvenido').should('be.visible');
  });
});
```

## Interceptores de red (`cy.intercept`)
Permite espiar peticiones y mockear respuestas, evitando depender del backend real.

```js
cy.intercept('POST', '/api/login', {
  statusCode: 200,
  body: { token: 'fake-jwt-token' },
}).as('loginRequest');

cy.visit('/login');
cy.get('input[name="email"]').type('user@test.com');
cy.get('input[name="password"]').type('pass');
cy.get('button').click();

cy.wait('@loginRequest').its('request.body').should('deep.equal', {
  email: 'user@test.com',
  password: 'pass',
});
cy.url().should('include', '/dashboard');
```

## Stubbing vs. pruebas completas
- **Stubbing**: pruebas más aisladas, rápidas y deterministas; útiles para probar la UI sin dependencias del servidor.
- **Sin stubbing**: pruebas E2E puras que validan la integración total; más lentas y frágiles, pero mayor confianza. Se recomienda un balance: stubs para desarrollo y CI rápido, y algunas pruebas contra entorno real.

## Buenas prácticas
- **Usa `data-cy` o `data-testid`** en lugar de clases CSS o IDs de presentación para selectores (`cy.get('[data-cy=submit-btn]')`), para evitar romper pruebas al cambiar estilos.
- **Evita selectores frágiles** como `cy.get('button').first()`.
- **Organiza en suites lógicas** por funcionalidad.
- **Usa `beforeEach`** para limpiar estado (resetear base de datos, localStorage).
- **No duplicas cobertura unitaria**: Cypress es para flujos críticos y de integración; las pruebas unitarias con RTL cubren la lógica aislada.

## Cypress y React
Cypress es agnóstico al framework, pero se integra bien. Con aplicaciones React que usan React Router, se navega normalmente. Para aplicaciones con Server Side Rendering, las visitas funcionan igual. Cypress puede interceptar las llamadas de hidratación si es necesario.

## Desafíos comunes
- **Manejo de autenticación**: se puede acelerar con `cy.session()` para cachear el login entre tests.
- **Componentes asíncronos**: Cypress espera automáticamente, pero a veces hay que usar `.should()` para esperar un estado concreto.
- **Pruebas de API**: Cypress puede probar APIs directamente con `cy.request()`, ideal para configurar datos de prueba.

## Alternativa: Playwright
Playwright es una alternativa más reciente con soporte para múltiples navegadores, contexto móvil y ejecución paralela, pero Cypress sigue siendo el más popular en el ecosistema React por su curva de aprendizaje y DevTools.

---

## Estrategia de pruebas completa
La pirámide de pruebas clásica sugiere:
- Mayoría de pruebas unitarias (hooks, funciones puras, componentes aislados con RTL).
- Pruebas de integración (componentes con contexto, flujos de varias piezas).
- Pocas pruebas E2E (camino feliz crítico, flujos de negocio).

Una combinación de Jest + React Testing Library para el 80% de las pruebas, complementada con Cypress para los recorridos completos, proporciona la cobertura y confianza necesarias para iterar con seguridad.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Testing de Hooks](02-testing-de-hooks.md) | [🏠 Inicio](../index.md) | [Compound Components (Componentes Compuestos) ▶](../17-patrones-avanzados/01-compound-components-componentes-compuestos.md) |
