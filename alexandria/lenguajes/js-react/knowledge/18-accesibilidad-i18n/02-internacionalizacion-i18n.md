# Internacionalización (i18n)

La internacionalización prepara una aplicación para ser adaptada a múltiples idiomas y regiones. En React, la solución más extendida es el ecosistema de **FormatJS (react-intl)** y **react-i18next**. Ambas se basan en el estándar ICU MessageFormat y la API `Intl` del navegador.

## Conceptos básicos
- **Locale**: identificador de idioma y región (ej. `es-ES`, `en-US`).
- **Mensajes traducidos**: pares clave-valor donde la clave es un ID y el valor es la traducción, a menudo con sintaxis ICU.
- **Formateo de números, fechas y monedas**: depende del locale (separadores de miles, posición del símbolo de moneda, formato de fecha).
- **Pluralización y selección de género**: reglas gramaticales variables según el número o el contexto.
- **Dirección del texto (RTL)**: idiomas como árabe, hebreo requieren inversión del layout.

## Estrategia general en React
1. **Envolver la app con un Provider de i18n** que suministre el locale actual y los mensajes.
2. **Usar hooks o componentes** para traducir textos y formatear datos.
3. **Detectar y cambiar el locale**: mediante el navegador (`navigator.language`), selector en la UI, o URL.

## Solución 1: react-intl (FormatJS)

**Instalación:** `react-intl`

**Configuración:**
```jsx
import { IntlProvider } from 'react-intl';
import SpanishMessages from './lang/es.json';
import EnglishMessages from './lang/en.json';

const messages = { es: SpanishMessages, en: EnglishMessages };

function App({ locale }) {
  return (
    <IntlProvider locale={locale} messages={messages[locale]}>
      <Main />
    </IntlProvider>
  );
}
```

**Uso de mensajes con `FormattedMessage`:**
```jsx
import { FormattedMessage } from 'react-intl';

function Saludar() {
  return <FormattedMessage id="saludo" defaultMessage="Hola, {nombre}" values={{ nombre: 'Ana' }} />;
}
```
El archivo `es.json`:
```json
{ "saludo": "Hola, {nombre}" }
```

**Hook `useIntl` para uso imperativo:**
```jsx
const intl = useIntl();
alert(intl.formatMessage({ id: 'saludo' }, { nombre: 'Ana' }));
```

**Formateo de números y fechas:**
```jsx
<FormattedNumber value={123456.78} style="currency" currency="EUR" />
<FormattedDate value={Date.now()} year="numeric" month="long" day="numeric" />
<FormattedRelativeTime value={-3} unit="day" /> {/* "hace 3 días" */}
```
Se apoyan en la API `Intl.NumberFormat` y `Intl.DateTimeFormat`.

**ICU MessageFormat avanzado:**
Soporta plurales (`plural`), selección (`select`), y etiquetas de formato.
```
{count, plural, one {# artículo} other {# artículos}}
```
```jsx
<FormattedMessage id="items" values={{ count: 5 }} />
// "5 artículos"
```

**Ventajas:**
- Estándar de la industria (ICU).
- Amplia cobertura de formateo.
- Integración con TypeScript y extracción de mensajes (babel-plugin-formatjs).

## Solución 2: react-i18next

i18next es una librería de internacionalización general con adaptador para React: `react-i18next`.

**Configuración:**
```jsx
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend'; // carga asíncrona de traducciones
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'es',
    interpolation: { escapeValue: false }, // React ya escapa
    backend: { loadPath: '/locales/{{lng}}/{{ns}}.json' },
  });

export default i18n;
```
Luego en `App` importas `./i18n` y envuelves en `Suspense` si usas carga asíncrona.

**Uso con el hook `useTranslation`:**
```jsx
import { useTranslation } from 'react-i18next';

function Componente() {
  const { t } = useTranslation();
  return <p>{t('saludo', { nombre: 'Ana' })}</p>;
}
```

**Componente `Trans` para HTML en traducciones:**
```jsx
<Trans i18nKey="mensajeConLink">
  Haz clic <a href="/">aquí</a> para continuar.
</Trans>
```

**Pluralización y contexto:**
- `t('key', { count: 5 })` busca automáticamente `key_one`, `key_other`, etc.
- También soporta `context` para género.

**Ventajas:**
- Muy flexible, múltiples backends, detección de idioma.
- Gran comunidad y ecosistema de plugins.
- Permite la separación en namespaces.

## Manejo de direccionalidad RTL
Para idiomas de derecha a izquierda, se debe:
- Ajustar el atributo `dir` del `<html>` a `"rtl"`.
- Usar CSS lógico: `margin-inline-start` en lugar de `margin-left`, flexbox y grid ya se adaptan.
- Las librerías de UI (Material UI, Chakra UI) suelen tener soporte de RTL mediante una prop de dirección.

Con i18next o react-intl, al cambiar el locale se puede actualizar el atributo `dir`.
```jsx
useEffect(() => {
  document.documentElement.dir = i18n.dir(); // i18next tiene dir() para idiomas específicos
}, [locale]);
```

## Detección y cambio de locale
- **Detección**: `navigator.language`, encabezado `Accept-Language`, cookie, o URL (`/es/...`).
- **Cambio**: Un selector de idioma actualiza el estado global (Context o i18n) y las traducciones se reaccionan automáticamente.

## Buenas prácticas
- **Externaliza todas las cadenas**: no dejes texto hardcodeado en los componentes. Usa identificadores semánticos.
- **No concatenes palabras**: las traducciones pueden reordenarse. Usa `{variable}` dentro del mensaje.
- **Proporciona contexto**: en archivos de traducción, añade comentarios para los traductores.
- **Prueba con diferentes locales**: usa herramientas como `react-intl` o `i18next` en modo test para verificar que no se rompe nada.
- **Formateo consistente**: siempre usa las funciones de la librería para fechas y números; nunca `new Date().toLocaleString()` directamente porque no se integra con el estado del locale.
- **Carga asíncrona de traducciones**: solo carga los mensajes del idioma activo; no empaquetes todos los idiomas.

## Internacionalización en Server Components (RSC)
En el modelo de servidor, la i18n se puede resolver en el servidor antes de enviar el HTML. Frameworks como Next.js App Router permiten leer el locale de la URL y pasar los mensajes al cliente sin overhead adicional. El cliente puede usar `IntlProvider` o `I18nextProvider` con los datos ya resueltos.

## Resumen de herramientas

| Librería      | Enfoque                         | Pluralización | Carga asíncrona | TypeScript |
|---------------|---------------------------------|---------------|-----------------|------------|
| react-intl    | Estándar ICU, componentes y hook | Sí, ICU       | Necesita configuración | Excelente  |
| react-i18next | Ecosistema completo i18next     | Sí, sufijos y context | Nativo con backend | Bueno      |

Ambas son opciones maduras. La elección depende de si ya tienes experiencia con i18next (muy popular fuera de React) o prefieres la sintaxis ICU y el ecosistema FormatJS, más integrado con los formateadores del navegador.

---

Combinar una accesibilidad sólida con una internacionalización completa no solo cumple estándares, sino que amplía el alcance de tus aplicaciones a cualquier usuario, sin importar sus capacidades o su lengua materna. React proporciona las bases; la implementación cuidadosa de estos patrones marca la diferencia.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ ARIA y gestión del foco](01-aria-y-gestion-del-foco.md) | [🏠 Inicio](../index.md) | [Tipado de props y eventos ▶](../19-typescript/01-tipado-de-props-y-eventos.md) |
