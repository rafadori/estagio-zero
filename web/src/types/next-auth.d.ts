import type { DefaultSession } from "next-auth";

// Estende os tipos padrão do Auth.js com o que a gente guarda no
// token/sessão (id + role) — sem isso, session.user.role não teria tipo.
declare module "next-auth" {
  interface User {
    role?: string;
  }

  interface Session {
    user: {
      id: string;
      role: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: string;
  }
}
