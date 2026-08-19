"use client";

import Link from "next/link";
import { LogOut } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { roleLabel } from "@/lib/format";
import styles from "./AuthStatus.module.css";

// Client-side de propósito — ver AuthSessionProvider.tsx pro porquê (evita
// forçar renderização dinâmica no site inteiro). Some enquanto carrega e
// aparece assim que a sessão resolve, sem quebrar a hidratação: tanto o
// servidor quanto o primeiro render do cliente não sabem a sessão ainda.
export function AuthStatus() {
  const { data: session, status } = useSession();

  if (status === "loading") return null;

  if (!session?.user) {
    return (
      <Link href="/login" className="ez-btn ez-btn--secondary ez-btn--sm">
        Entrar
      </Link>
    );
  }

  return (
    <div className={styles.wrap}>
      <span className={styles.name}>
        {session.user.name}{" "}
        <span className={styles.role}>· {roleLabel(session.user.role)}</span>
      </span>
      <button
        type="button"
        onClick={() => signOut({ redirectTo: "/" })}
        className="ez-btn ez-btn--secondary ez-btn--sm"
        aria-label="Sair"
      >
        <LogOut size={16} />
      </button>
    </div>
  );
}
