import ReactMarkdown from "react-markdown";///dependencia para markdown
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import styles from "./markdown.module.css";
import contenido from "../../../../../../alexandria/lenguajes/js-react/markdown/react-markdown/index.md?raw";
import CodeBlock from "../basic/codeblok/CodeBlock";



const Articulo = () => {
  return (
    <div className={styles.page}>
      <div className={styles.markdown}>
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeHighlight]}
          components={{ pre: CodeBlock }}
        >
          {contenido}
        </ReactMarkdown>
      </div>
    </div>
  );
};

export default Articulo;
