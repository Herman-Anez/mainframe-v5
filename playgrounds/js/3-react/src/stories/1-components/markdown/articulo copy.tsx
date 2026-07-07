import fs from "node:fs";
import path from "node:path";
import ReactMarkdown from "react-markdown";///dependencia para markdown
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import styles from "./markdown.module.css";
import "highlight.js/styles/github-dark.css";
const filePath = path.join(
  process.cwd(),
  "../../../alexandria/lenguajes/js-react/guias/usar-markdowns/libs/react-markdown/index.md"
);

export const dynamic = "force-dynamic";

const Articulo = () => {
  const contenido = fs.readFileSync(filePath, "utf-8");
  return (
    <div className={styles.markdown}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
        {contenido}
      </ReactMarkdown>
    </div>
  );
};

export default Articulo;
