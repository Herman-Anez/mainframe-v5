# next

# once-ui

## instalacion

pnpm install @once-ui-system/core

## Modulos

Componentes que dan funcionalidades

### Schema

Add Schema.org structured data to your pages for SEO and rich search results.

```tsx
<Schema
    as="webPage"
    title="My Page Title"
    description="A comprehensive description of the page content"
    baseURL="https://example.com"
    path="/docs/getting-started"
    author={{
        name: "John Doe",
    }}
/>
```

#### Advanced setup

tags: ceo-tag,

For larger sites, store your schema data in a central configuration file to maintain consistency across pages:

##### 1. Crea archivo de configuracion

```tsx
//app/resources/seo.js
// default metadata
const meta = {
    title: "Once UI: Build the future",
    description:
        "An open-source design system for indie creators to ship like teams of 10+ alone.",
};

// default schema data
const schema = {
    title: "Once UI",
    description: meta.description,
    baseURL: "https://once-ui.com",
    path: "/",
    image: "/images/cover.jpg",
    author: {
        name: "Once UI Team",
        url: "https://once-ui.com",
    },
};

export { schema };
```

##### 2. Referenciala

```tsx
import { Schema } from "@/once-ui/modules";
import { schema } from "@/app/resources/seo";

export default function HomePage() {
    return (
        <>
            <Schema
                as="organization"
                title={schema.title}
                description={schema.description}
                baseURL={schema.baseURL}
                path={schema.path}
                image={schema.image}
                author={schema.author}
            />
            {/* Rest of your page component */}
        </>
    );
}
```

## Structura

Componentes que dan capacidad de manejar el layout

tenemos dos wrappers para esto

```tsx
 <Column></Column>
<Row></Row>
```
### atributos 

#### Colores y estilos 

##### background

`background?: Colors | "surface" | "overlay" | "page" | "transparent";`

Le pone un color de fondo

##### solid

`solid?: Colors;`

Pone un color de fondo sólido (común para botones).

##### border

`border?: Colors | "surface" | "transparent" | boolean;`

Añade un borde de un color (por ejemplo, verde para "éxito").

##### radius

`radius?: RadiusSize | `${RadiusSize}-${RadiusNest}`;`

Hace que las esquinas sean redondeadas. xs es poco redondeado, xl es muy redondeado.


#### Tamaño y Espacio 


##### gap

`solid?: Colors;`

Pone un color de fondo sólido (común para botones).


##### padding

`solid?: Colors;`

Pone un color de fondo sólido (común para botones).


##### width o height

`width?: number | SpacingToken | CSSUnit;;`

Puedes darle un tamaño fijo usando porcentajes (%), o unidades como vh (altura de la pantalla).


#### Cos