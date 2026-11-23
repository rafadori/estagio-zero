import type { Comment } from "./types";

// Fonte de comentários iniciais pro prisma/seed.ts — NÃO é lido pelo app.
// Vazio de propósito desde a troca de tema: num assunto como mulheres na
// indústria automotiva, não faz sentido inventar comentário de leitor. Os
// comentários reais entram pelo formulário (com moderação).
const commentsBySlug: Record<string, Comment[]> = {};

export function getCommentsBySlug(slug: string): Comment[] {
  return commentsBySlug[slug] ?? [];
}
