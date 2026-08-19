export function formatDate(iso: string): string {
  // timeZone fixo é obrigatório aqui: formatDate roda tanto no servidor
  // (Vercel, em UTC) quanto no navegador (Brasil, UTC-3) dentro do
  // CommentSection ("use client"). Sem isso, a mesma data vira dias
  // diferentes em cada lado e quebra a hidratação do React.
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "America/Sao_Paulo",
  });
}

const ROLE_LABELS: Record<string, string> = {
  ADMIN: "Admin",
  AUTHOR: "Autor(a)",
  CONTRIBUTOR: "Colaborador(a)",
};

export function roleLabel(role: string): string {
  return ROLE_LABELS[role] ?? role;
}

const STATUS_LABELS: Record<string, string> = {
  DRAFT: "Rascunho",
  PENDING_REVIEW: "Aguardando revisão",
  PUBLISHED: "Publicado",
};

export function statusLabel(status: string): string {
  return STATUS_LABELS[status] ?? status;
}
