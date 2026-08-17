export type Author = {
  name: string;
  role: string;
  bio: string;
};

// Dados fictícios — trocar por uma tabela de usuários (com papel) quando o
// banco entrar. Chave é o nome como aparece em Post.author.
export const authors: Record<string, Author> = {
  "Bia Ferraz": {
    name: "Bia Ferraz",
    role: "Editora",
    bio: "Mexe em carro desde os 14 anos porque o pai não deixava a oficina barata perto do Fusca da família. Curte clássico, roda pista amadora nos fins de semana.",
  },
  "Rafael Dorí": {
    name: "Rafael Dorí",
    role: "Fundador",
    bio: "Troca o próprio óleo, já fez retífica de motor no fundo de quintal e acha que revisão de concessionária é onde o dinheiro vai pra morrer.",
  },
};

export function getAuthor(name: string): Author {
  return (
    authors[name] ?? { name, role: "Colaborador(a)", bio: "" }
  );
}
