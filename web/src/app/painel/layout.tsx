import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/auth";
import { roleLabel } from "@/lib/format";
import styles from "./layout.module.css";

// Painel do autor — protegido de verdade aqui (auth() no servidor), ao
// contrário do Header público que só mostra o estado da sessão pro visual
// (ver AuthStatus.tsx). Área logada não precisa ficar estática, então não
// tem problema essa subárvore virar dinâmica.
export default async function PainelLayout({
  children,
}: LayoutProps<"/painel">) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  return (
    <div className="container">
      <div className={styles.bar}>
        <div>
          <h1 className={styles.title}>Painel</h1>
          <p className={styles.subtitle}>
            {session.user.name} · {roleLabel(session.user.role)}
          </p>
        </div>
        <nav className={styles.nav} aria-label="Painel">
          <Link href="/painel" className={styles.navLink}>
            Minhas matérias
          </Link>
          <Link href="/painel/nova" className="ez-btn ez-btn--primary ez-btn--sm">
            Nova matéria
          </Link>
        </nav>
      </div>
      {children}
    </div>
  );
}
