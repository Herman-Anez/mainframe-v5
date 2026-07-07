
import styles from "../../../page.module.css";
import Articulo from "./articulo";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <Articulo />
      </main>
    </div>
  );
}
