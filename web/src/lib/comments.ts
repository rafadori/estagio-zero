import type { Comment } from "./types";

// Comentários fictícios só pra layout — a fila de moderação (pendente/
// aprovado) e o formulário funcional entram junto com o banco de dados.
const commentsBySlug: Record<string, Comment[]> = {
  "novo-polo-track-vale-o-preco": [
    {
      id: "c1",
      author: "Marcelo T.",
      date: "2026-08-15",
      body: "Troquei o pneu original no mês que comprei, exatamente pelo motivo que vocês falaram. Matéria certeira.",
    },
    {
      id: "c2",
      author: "Juliana Reis",
      date: "2026-08-15",
      body: "Comparado com o HB20 qual sai na frente no consumo de cidade?",
    },
    {
      id: "c3",
      author: "anônimo",
      date: "2026-08-14",
      body: "Achei o preço ainda salgado pro que entrega, mas texto muito honesto.",
    },
  ],
  "troca-de-oleo-em-casa-passo-a-passo": [
    {
      id: "c4",
      author: "Diego A.",
      date: "2026-08-11",
      body: "Fiz seguindo o passo a passo, só demorei mais que os 40 minutos prometidos haha. Valeu o guia!",
    },
  ],
};

export function getCommentsBySlug(slug: string): Comment[] {
  return commentsBySlug[slug] ?? [];
}
