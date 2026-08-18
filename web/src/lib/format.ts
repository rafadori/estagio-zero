export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
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
