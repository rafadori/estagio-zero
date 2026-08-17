import Link from "next/link";
import styles from "./Footer.module.css";

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <div>
          <div className={styles.wordmark}>Estágio Zero</div>
          <p className={styles.tagline}>
            Feito por quem também troca o próprio óleo.
          </p>
        </div>
        <nav className={styles.links} aria-label="Rodapé">
          <Link href="/sobre">Sobre</Link>
          <Link href="/busca">Busca</Link>
          <Link href="/login">Entrar</Link>
        </nav>
      </div>
    </footer>
  );
}
