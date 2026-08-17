import type { Category, Post } from "./types";

// Dados fictícios para o desenvolvimento visual. Serão substituídos por
// dados vindos do banco (Postgres/Prisma) na etapa seguinte do projeto.

export const categories: Category[] = [
  { slug: "test-drive", name: "Test Drive" },
  { slug: "lancamentos", name: "Lançamentos" },
  { slug: "manutencao", name: "Manutenção" },
  { slug: "classicos", name: "Clássicos" },
  { slug: "opiniao", name: "Opinião" },
];

const categoryBySlug = Object.fromEntries(categories.map((c) => [c.slug, c]));

export const posts: Post[] = [
  {
    slug: "novo-polo-track-vale-o-preco",
    title: "Novo Polo Track: o Volks mais barato ficou bom?",
    excerpt:
      "Rodamos 300km com o motorzinho 1.0 pra saber se vale o preço. Spoiler: o careca do pneu original não ajuda.",
    category: categoryBySlug["test-drive"],
    author: "Bia Ferraz",
    date: "2026-08-14",
    featured: true,
  },
  {
    slug: "onix-2027-o-que-mudou",
    title: "Onix 2027 chega com painel novo e motor 1.0 turbo de série",
    excerpt:
      "Chevrolet mexeu no que era pra mexer: acabamento, central multimídia e um motor que finalmente não sofre em ladeira.",
    category: categoryBySlug["lancamentos"],
    author: "Rafael Dorí",
    date: "2026-08-12",
    badge: "NOVO",
  },
  {
    slug: "troca-de-oleo-em-casa-passo-a-passo",
    title: "Trocar o próprio óleo: guia sem enrolação pra economizar até R$300/ano",
    excerpt:
      "Ferramenta, óleo certo e 40 minutos de sábado. Mostramos onde a maioria erra na hora de apertar o dreno.",
    category: categoryBySlug["manutencao"],
    author: "Rafael Dorí",
    date: "2026-08-10",
  },
  {
    slug: "fusca-1300-restaurado-vale-a-pena",
    title: "Restaurar um Fusca 1300 hoje custa mais que um 0km — e ainda assim vale",
    excerpt:
      "Acompanhamos a restauração completa de um 1974 e fizemos as contas: peça por peça, mão de obra por mão de obra.",
    category: categoryBySlug["classicos"],
    author: "Bia Ferraz",
    date: "2026-08-07",
    badge: "VÍDEO",
  },
  {
    slug: "carro-eletrico-compensa-no-brasil",
    title: "Carro elétrico compensa no Brasil ou é conversa de vendedor?",
    excerpt:
      "Pegamos os números de manutenção, IPVA e recarga de três modelos populares. A conta fecha, mas não do jeito que você imagina.",
    category: categoryBySlug["opiniao"],
    author: "Rafael Dorí",
    date: "2026-08-05",
  },
  {
    slug: "pneu-careca-o-que-a-lei-diz",
    title: "Pneu careca: o que a lei diz e quanto a multa pode custar",
    excerpt:
      "TWI, profundidade mínima e o que os agentes de trânsito realmente olham na hora da blitz.",
    category: categoryBySlug["manutencao"],
    author: "Bia Ferraz",
    date: "2026-08-03",
  },
  {
    slug: "hb20-vs-polo-comparativo",
    title: "HB20 ou Polo: comparamos os dois mais vendidos custo por custo",
    excerpt:
      "Consumo na estrada, revisão programada e valor de revenda depois de 3 anos. Um dos dois perde feio numa dessas contas.",
    category: categoryBySlug["test-drive"],
    author: "Rafael Dorí",
    date: "2026-08-01",
  },
  {
    slug: "opala-6-cilindros-historia",
    title: "O Opala 6 cilindros que a Chevrolet não queria que desse certo",
    excerpt:
      "A história de como um projeto secundário virou o carro mais cobiçado dos anos 70 no Brasil.",
    category: categoryBySlug["classicos"],
    author: "Bia Ferraz",
    date: "2026-07-28",
  },
];

export function getFeaturedPost(): Post {
  return posts.find((p) => p.featured) ?? posts[0];
}

export function getLatestPosts(excludeSlug?: string, limit = 6): Post[] {
  return posts.filter((p) => p.slug !== excludeSlug).slice(0, limit);
}

export function getPostsByCategory(categorySlug: string, limit = 3): Post[] {
  return posts.filter((p) => p.category.slug === categorySlug).slice(0, limit);
}
