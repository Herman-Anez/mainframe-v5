
## 1. Configurar Webpack para importar `.md` como texto (sin librerías extra)

Next.js usa Webpack 5, que incluye módulos de recursos (*asset modules*). Podemos añadir una regla para tratar los `.md` como texto puro.

### Paso a paso
1. Abre o crea `next.config.js` en la raíz de tu proyecto.
2. Añade la siguiente configuración:

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.module.rules.push({
      test: /\.md$/,
      type: 'asset/source', // esto devuelve el contenido como string
    });
    return config;
  },
};

module.exports = nextConfig;
```

3. Ahora puedes importar cualquier `.md` en tus componentes:

```jsx
import contenidoMD from '../contenido/articulo.md';

export default function Articulo() {
  return (
    <div>
      {/* Si usas un conversor como en los ejemplos anteriores */}
      <pre>{contenidoMD}</pre> 
    </div>
  );
}
```

El contenido de `articulo.md` estará disponible como un string directamente.

> 📌 **Nota:** Este enfoque agrega el archivo al bundle de JavaScript del cliente. Es ideal para unos pocos documentos pequeños, pero no para cientos de archivos grandes (aumentaría el tamaño del bundle). Para sitios con muchos contenidos, es mejor usar la opción 2.

---

## 2. La forma idiomática en Next.js: leer archivos con `getStaticProps`

En lugar de meter el Markdown en el bundle del cliente, Next te permite leerlo en el servidor durante la construcción y pasarlo como prop. Así el contenido se renderiza en el HTML final y no sobrecarga el JavaScript del cliente.

### Ejemplo completo

Supón que tienes tus archivos `.md` en una carpeta `content/` en la raíz del proyecto.

#### Estructura sugerida:
```
mi-app/
├── content/
│   └── articulo.md
├── pages/
│   └── articulo.js
├── next.config.js
└── package.json
```

#### `pages/articulo.js`
```jsx
import fs from 'fs';
import path from 'path';

export default function Articulo({ contenido }) {
  return (
    <article>
      {/* Aquí usas tu componente de Markdown */}
      <pre>{contenido}</pre>
    </article>
  );
}

export async function getStaticProps() {
  const filePath = path.join(process.cwd(), 'content', 'articulo.md');
  const contenido = fs.readFileSync(filePath, 'utf8');

  return {
    props: { contenido },
  };
}
```

- `process.cwd()` te da la raíz del proyecto.
- `fs.readFileSync` lee el archivo en el servidor (en tiempo de construcción o en cada petición si usas `getServerSideProps`).
- El contenido se pasa como string y no se incluye en el bundle del cliente.

### Ventajas
- No necesitas tocar `next.config.js`.
- El Markdown nunca se envía en crudo al navegador, solo el HTML resultante (si lo renderizas en el servidor).
- Escalable: puedes leer miles de archivos sin inflar el cliente.

### Renderizar el Markdown
Puedes aplicar tu conversor personalizado en el servidor (dentro de `getStaticProps`) o en el cliente una vez recibido el string. Por seguridad, es mejor convertir a HTML o JSX en el servidor y enviar solo HTML listo.

Si decides usar una librería como `react-markdown`, puedes importarla y renderizar el string en el componente (ahí sí el componente de Markdown va al cliente, pero el contenido no está incrustado en el JS, solo la cadena de texto que ya se envió como prop).








///////////////////




# react-markdown

## Instalacion
pnpm install react-markdown 

## Ejemplo mínimo

Si buscas el código más corto que funcione, este es todo lo que necesitas:

```jsx
import fs from 'fs';
import path from 'path';
import ReactMarkdown from 'react-markdown';

export default function Articulo({ contenido }) {
  return <ReactMarkdown>{contenido}</ReactMarkdown>;
}

export async function getStaticProps() {
  const contenido = fs.readFileSync(
    path.join(process.cwd(), 'content', 'articulo.md'),
    'utf8'
  );
  return { props: { contenido } };
}
```

```tsx
// pages/articulo.tsx
import fs from 'fs';
import path from 'path';
import ReactMarkdown from 'react-markdown';
import type { GetStaticProps, NextPage } from 'next';

interface ArticuloProps {
  contenido: string;
}

const Articulo: NextPage<ArticuloProps> = ({ contenido }) => {
  return <ReactMarkdown>{contenido}</ReactMarkdown>;
};

export const getStaticProps: GetStaticProps<ArticuloProps> = async () => {
  const filePath = path.join(process.cwd(), 'content', 'articulo.md');
  const contenido = fs.readFileSync(filePath, 'utf8');

  return {
    props: {
      contenido,
    },
  };
};

export default Articulo;
```