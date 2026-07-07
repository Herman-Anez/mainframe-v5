import { useEffect, useRef, useState, type ComponentPropsWithoutRef } from "react";
import styles from "./CodeBlock.module.css";

const CodeBlock = ({ className, ...props }: ComponentPropsWithoutRef<"pre">) => {
  const preRef = useRef<HTMLPreElement>(null);
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(timeoutRef.current), []);

  const handleCopy = async () => {
    const text = preRef.current?.textContent ?? "";
    await navigator.clipboard.writeText(text);
    setCopied(true);
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setCopied(false), 1500);
  };

  return (
    <code className={styles.codeBlockWrapper}>
      <button
        type="button"
        className={styles.copyButton}
        onClick={handleCopy}
        aria-label="Copiar código"
      >
        {copied ? "Copiado" : "Copiar"}
      </button>
      <pre
        {...props}
        ref={preRef}
        className={[styles.pre, className].filter(Boolean).join(" ")}
      />
    </code>
  );
};

export default CodeBlock;
