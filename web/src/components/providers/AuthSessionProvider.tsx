"use client";

import { SessionProvider } from "next-auth/react";
import type { ReactNode } from "react";

// Deliberadamente sem passar `session` vinda do servidor: se a gente
// resolvesse a sessão no layout raiz (que envolve toda página), isso
// forçaria renderização dinâmica no site inteiro — perderíamos o cache
// estático/ISR de home, matéria, categoria etc. só pra mostrar "Entrar"
// vs. o nome do usuário no Header. Em troca, o client busca a sessão via
// fetch em /api/auth/session logo após montar (ver AuthStatus.tsx).
export function AuthSessionProvider({ children }: { children: ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}
