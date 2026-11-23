import Link from "next/link";
import styles from "./DataStrip.module.css";

// Números do bloco 3 do videocast. Estáticos de propósito: são citação de
// pesquisa, não conteúdo editável — se a fonte atualizar, atualiza aqui.
const STATS = [
  {
    value: "24%",
    label: "das pessoas no setor automotivo são mulheres",
    context: "Eram 21% em 2017. Dado de 2025.",
  },
  {
    value: "55%",
    label: "das vagas de trainee e estágio são ocupadas por mulheres",
    context: "Mas só 20% da liderança. Dado de 2025.",
  },
  {
    value: "1%",
    label: "dos cargos de decisão são ocupados por mulheres negras",
    context: "Elas são 3% da força de trabalho analisada.",
  },
  {
    value: "16,5%",
    label: "da reparação automotiva é feita por mulheres",
    context: "Eram 5% em 2019 — alta relativa de 230%.",
  },
];

export function DataStrip() {
  return (
    <section className={styles.strip} aria-labelledby="data-strip-title">
      <div className={`container ${styles.inner}`}>
        <div className={styles.head}>
          <h2 id="data-strip-title" className={styles.title}>
            Os números por trás do episódio
          </h2>
          <Link href="/categoria/dados" className="ez-btn ez-btn--ghost ez-btn--sm">
            Ver análises →
          </Link>
        </div>

        <div className={styles.grid}>
          {STATS.map((stat) => (
            <div key={stat.value} className={styles.tile}>
              <span className={styles.value}>{stat.value}</span>
              <span className={styles.label}>{stat.label}</span>
              <span className={styles.context}>{stat.context}</span>
            </div>
          ))}
        </div>

        <p className={styles.sources}>
          Fontes: pesquisa Diversidade no Setor Automotivo, Automotive Business
          (2026); Oficina Brasil, via Folha (julho de 2025).
        </p>
      </div>
    </section>
  );
}
