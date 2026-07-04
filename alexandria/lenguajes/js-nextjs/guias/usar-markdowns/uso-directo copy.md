# Opción 1: Import directo (requiere tocar Webpack)

Debes decirle a Webpack que trate los archivos .md como texto bruto usando asset/source.
1. Configura next.config.js

```js

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.module.rules.push({
      test: /\.md$/,
      type: 'asset/source', // devuelve el contenido como string
    });
    return config;
  },
};
```
module.exports = nextConfig;

2. Ahora puedes importar el Markdown directamente en cualquier parte
```tsx

// pages/articulo.tsx
import ReactMarkdown from 'react-markdown';
import contenido from '../content/articulo.md'; // ✅ string crudo

const Articulo = () => {
  return <ReactMarkdown>{contenido}</ReactMarkdown>;
};
export default Articulo;
```

Pero cuidado: este contenido se incluye en el bundle de JavaScript del cliente, lo que aumenta el tamaño y expone el texto en el navegador. Solo es viable para unos pocos archivos pequeños y estáticos.