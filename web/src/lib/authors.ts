// Dados fictícios — NÃO é mais usado pelo app (que já lê do Postgres via
// src/lib/data.ts). Mantido só como fonte do prisma/seed.ts.

export type Author = {
  name: string;
  role: string;
  bio: string;
};

// Time real do projeto (apresentação da turma). Chave é o nome como
// aparece em Post.author. Bio genérica de propósito — não inventamos
// histórico pessoal de ninguém do grupo.
export const authors: Record<string, Author> = {
  Rafael: {
    name: "Rafael",
    role: "Colaborador(a)",
    bio: "Parte do time que criou o Estágio Zero.",
  },
  Luan: {
    name: "Luan",
    role: "Colaborador(a)",
    bio: "Parte do time que criou o Estágio Zero.",
  },
  Renan: {
    name: "Renan",
    role: "Colaborador(a)",
    bio: "Parte do time que criou o Estágio Zero.",
  },
  Agata: {
    name: "Agata",
    role: "Colaborador(a)",
    bio: "Parte do time que criou o Estágio Zero.",
  },
  Gabriel: {
    name: "Gabriel",
    role: "Colaborador(a)",
    bio: "Parte do time que criou o Estágio Zero.",
  },
  Guilherme: {
    name: "Guilherme",
    role: "Colaborador(a)",
    bio: "Parte do time que criou o Estágio Zero.",
  },
};

export function getAuthor(name: string): Author {
  return (
    authors[name] ?? { name, role: "Colaborador(a)", bio: "" }
  );
}
