import type { Metadata } from "next";
import { authors } from "@/lib/authors";
import styles from "./about.module.css";

export const metadata: Metadata = {
  title: "Sobre — Estágio Zero",
  description: "Quem faz o Estágio Zero e por que ele existe.",
};

function initials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export default function AboutPage() {
  return (
    <div className={styles.wrap}>
      <h1 className={styles.title}>Sobre</h1>

      <p>
        O Estágio Zero nasceu porque a gente cansou de ler review de carro
        escrito por quem nunca deitou embaixo de um. Aqui a régua é simples:
        se a gente não rodou, não trocou peça ou não fez a conta, a matéria
        não sai.
      </p>

      <p>
        Sem assinatura pra ler o texto inteiro, sem review pago disfarçado de
        opinião. Falamos de carro popular, carro velho, carro que quebra —
        não só o lançamento bonito de imprensa.
      </p>

      <p>
        Comentário é aberto pra qualquer pessoa, sem precisar criar conta.
        A única exigência é não ser spam — todo comentário passa por
        moderação antes de aparecer.
      </p>

      <div className={styles.team}>
        {Object.values(authors).map((author) => (
          <div key={author.name} className={styles.person}>
            <div className={styles.avatar}>{initials(author.name)}</div>
            <div>
              <div className={styles.name}>{author.name}</div>
              <div className={styles.role}>{author.role}</div>
              <p className={styles.bio}>{author.bio}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
