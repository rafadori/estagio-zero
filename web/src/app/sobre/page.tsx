import type { Metadata } from "next";
import { getTeam } from "@/lib/data";
import { roleLabel } from "@/lib/format";
import styles from "./about.module.css";

export const metadata: Metadata = {
  title: "Sobre — Estágio Zero",
  description: "Quem faz o Estágio Zero e por que ele existe.",
};

export const revalidate = 300;

function initials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export default async function AboutPage() {
  const team = await getTeam();

  return (
    <div className={styles.wrap}>
      <h1 className={styles.title}>Sobre</h1>

      <p>
        O Estágio Zero é um videocast e blog sobre mulheres na indústria
        automotiva. A pergunta que guia o projeto é direta: é preciso provar
        mais para ser respeitada?
      </p>

      <p>
        A presença feminina no setor está crescendo — passou de 21% em 2017
        para 24% em 2025, segundo a Automotive Business —, mas ainda some no
        caminho até a liderança. A gente quer entender por quê, ouvindo quem
        vive isso: da oficina à engenharia, do estágio à gestão.
      </p>

      <p>
        Aqui os números sempre vêm com fonte, e as histórias vêm de quem
        contou. Comentário é aberto pra qualquer pessoa, sem precisar criar
        conta — todo comentário passa por moderação antes de aparecer.
      </p>

      <div className={styles.team}>
        {team.map((member) => (
          <div key={member.name} className={styles.person}>
            <div className={styles.avatar}>{initials(member.name)}</div>
            <div>
              <div className={styles.name}>{member.name}</div>
              <div className={styles.role}>{roleLabel(member.role)}</div>
              {member.bio && <p className={styles.bio}>{member.bio}</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
