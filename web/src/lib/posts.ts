import type { Category, Post } from "./types";

// Dados fictícios — NÃO é mais usado pelo app (que já lê do Postgres via
// src/lib/data.ts). Mantido só como fonte do prisma/seed.ts.

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
      "Rodamos 300km com o motorzinho 1.0 pra saber se vale o preço. O careca do pneu original não ajuda.",
    category: categoryBySlug["test-drive"],
    author: "Agata",
    date: "2026-08-14",
    featured: true,
    tags: ["volkswagen", "polo track", "hatch", "entrada"],
    body: [
      "O Polo Track existe pra uma missão só: ser o Volkswagen mais barato que dá pra comprar novo. E depois de 300km entre cidade e estrada, dá pra dizer que ele cumpre — com ressalvas que valem a leitura antes de fechar negócio.",
      "O motorzinho 1.0 de três cilindros não é rápido em lugar nenhum, mas responde bem no dia a dia da cidade. Onde ele sofre é em ultrapassagem de estrada com o carro cheio — ali o quinto degrau da caixa manual vira quase decorativo.",
      "O ponto que mais incomodou não foi o motor, foi o pneu de série: um composto duro, barato, que faz o carro escorregar antes da hora numa curva molhada. É o primeiro item que recomendamos trocar, mesmo com o carro 0km.",
      "Por dentro, o acabamento é honesto pro preço — nada de luxo, mas nada que pareça ter sido cortado corner-cutting demais. Central multimídia com Android Auto e CarPlay sem fio já de série é o que salva a experiência.",
      "Vale o preço? Pra quem quer um carro pra usar e não se apaixonar, sim. Pra quem compara com a concorrência direta, o Polo Track ganha em acabamento e perde em espaço de porta-malas.",
    ],
  },
  {
    slug: "onix-2027-o-que-mudou",
    title: "Onix 2027 chega com painel novo e motor 1.0 turbo de série",
    excerpt:
      "Chevrolet mexeu no que era pra mexer: acabamento, central multimídia e um motor que finalmente não sofre em ladeira.",
    category: categoryBySlug["lancamentos"],
    author: "Guilherme",
    date: "2026-08-12",
    badge: "NOVO",
    tags: ["chevrolet", "onix", "lançamento", "turbo"],
    body: [
      "A Chevrolet atualizou o Onix pra 2027 sem reinventar a roda — e isso é elogio. O carro mais vendido do país ganhou painel digital, motor 1.0 turbo de série em toda a linha e uma revisão de suspensão que se sente já nos primeiros quilômetros.",
      "O antigo motor aspirado 1.0 sem turbo sumiu da tabela — o turbo agora é padrão até na versão de entrada, o que resolve a maior queixa histórica do modelo: falta de fôlego em ladeira com o carro carregado.",
      "Por fora, mudança é discreta: nova grade, novos faróis de LED. Por dentro é que a coisa mudou de verdade, com um painel todo digital que era exclusividade das versões topo de linha até o ano passado.",
      "Preço subiu, como era de se esperar. Mas o pacote de série ficou consideravelmente mais completo — o que deixa a decisão de compra mais simples do que era antes.",
    ],
  },
  {
    slug: "troca-de-oleo-em-casa-passo-a-passo",
    title: "Trocar o próprio óleo: guia sem enrolação pra economizar até R$300/ano",
    excerpt:
      "Ferramenta, óleo certo e 40 minutos de sábado. Mostramos onde a maioria erra na hora de apertar o dreno.",
    category: categoryBySlug["manutencao"],
    author: "Rafael",
    date: "2026-08-10",
    tags: ["manutenção", "óleo", "faça você mesmo"],
    body: [
      "Trocar o próprio óleo não é sobre economizar R$50 numa troca — é sobre economizar R$300 por ano fazendo isso 3 a 4 vezes, e saber exatamente que óleo entrou no seu motor.",
      "Ferramenta mínima: chave de boca do tamanho do bujão de dreno (confira no manual, varia por modelo), um funil, uma bacia de pelo menos 6 litros e luvas. Nada de especial, a maioria já tem em casa.",
      "O erro mais comum é apertar o bujão de dreno com força demais depois de trocar o anel de vedação — isso rosqueia o cárter e vira um problema caro. Aperte com a mão firme e mais um quarto de volta com a chave, nunca no talo.",
      "Deixe o motor rodar por 2-3 minutos antes de drenar — óleo frio e parado no cárter demora mais pra sair e sai menos sujo. E nunca descarte o óleo usado na natureza: qualquer posto de troca aceita o óleo usado de graça.",
    ],
  },
  {
    slug: "fusca-1300-restaurado-vale-a-pena",
    title: "Restaurar um Fusca 1300 hoje custa mais que um 0km — e ainda assim vale",
    excerpt:
      "Acompanhamos a restauração completa de um 1974 e fizemos as contas: peça por peça, mão de obra por mão de obra.",
    category: categoryBySlug["classicos"],
    author: "Luan",
    date: "2026-08-07",
    badge: "VÍDEO",
    tags: ["volkswagen", "fusca", "restauração", "clássico"],
    body: [
      "Acompanhamos do início ao fim a restauração de um Fusca 1300 de 1974 — motor, funilaria, estofamento, tudo. A conta final surpreendeu até quem já esperava um valor alto: mais que um hatch 0km de entrada.",
      "O maior custo não foi o motor, foi a funilaria: assoalho, para-lamas e a base do para-brisa estavam tomados de ferrugem, o clássico ponto fraco do modelo. Sem isso resolvido, nada mais no carro faz sentido.",
      "Mecanicamente o 1300 é simples — refeito com peças remanufaturadas nacionais, sem depender de importado. É a funilaria e o estofamento sob medida que carregam o orçamento.",
      "Vale a pena? Financeiramente, só se o carro tiver valor sentimental ou histórico pra você. Como investimento puro, um Fusca bem preservado de fábrica ainda compensa mais que um restaurado do zero.",
    ],
  },
  {
    slug: "carro-eletrico-compensa-no-brasil",
    title: "Carro elétrico compensa no Brasil ou é conversa de vendedor?",
    excerpt:
      "Pegamos os números de manutenção, IPVA e recarga de três modelos populares. A conta fecha, mas não do jeito que você imagina.",
    category: categoryBySlug["opiniao"],
    author: "Renan",
    date: "2026-08-05",
    tags: ["elétrico", "opinião", "custo de propriedade"],
    body: [
      "Pegamos três elétricos populares no Brasil e comparamos custo de manutenção, IPVA (isento na maioria dos estados) e recarga contra o equivalente a combustão. A conta fecha — mas o prazo de retorno é mais longo do que o discurso de venda sugere.",
      "Recarga em casa, à noite, é onde a economia realmente aparece: menos de um terço do custo por km rodado comparado à gasolina. Recarga rápida em estrada, por outro lado, quase empata com o combustão em alguns estados.",
      "Manutenção é onde o elétrico ganha disparado: sem óleo, sem embreagem, sem velas. Só pneu, fluido de freio e, eventualmente, uma bateria — cujo custo de troca fora da garantia ainda é a maior incógnita da conta.",
      "Nossa conclusão: compensa pra quem roda muito em cidade grande e tem onde carregar em casa. Pra quem faz muita estrada longa, o combustão ainda ganha em praticidade — pelo menos até a rede de recarga rápida crescer mais.",
    ],
  },
  {
    slug: "pneu-careca-o-que-a-lei-diz",
    title: "Pneu careca: o que a lei diz e quanto a multa pode custar",
    excerpt:
      "TWI, profundidade mínima e o que os agentes de trânsito realmente olham na hora da blitz.",
    category: categoryBySlug["manutencao"],
    author: "Gabriel",
    date: "2026-08-03",
    tags: ["pneu", "manutenção", "legislação"],
    body: [
      "O Código de Trânsito Brasileiro não define um número exato de milímetros — o parâmetro legal é o TWI (Tread Wear Indicator), aquele indicador de desgaste moldado no próprio pneu. Quando a banda de rodagem chega nele, o pneu está no limite.",
      "Na prática, a maioria dos agentes usa a referência de 1,6mm de profundidade de sulco, o mesmo padrão usado em boa parte do mundo. Abaixo disso, o carro é enquadrado por item de segurança irregular.",
      "A multa é gravíssima, soma pontos na carteira e pode reter o veículo até a troca do pneu — não é só o valor da multa que dói, é o carro ficar parado esperando guincho ou pneu novo na hora.",
      "Teste caseiro rápido: uma moeda de R$1 encaixada no sulco, com a borda prateada visível, já indica que está na hora de trocar — antes mesmo de chegar no limite legal.",
    ],
  },
  {
    slug: "hb20-vs-polo-comparativo",
    title: "HB20 ou Polo: comparamos os dois mais vendidos custo por custo",
    excerpt:
      "Consumo na estrada, revisão programada e valor de revenda depois de 3 anos. Um dos dois perde feio numa dessas contas.",
    category: categoryBySlug["test-drive"],
    author: "Agata",
    date: "2026-08-01",
    tags: ["hyundai", "hb20", "volkswagen", "polo", "comparativo"],
    body: [
      "HB20 e Polo disputam a mesma faixa de preço e o mesmo cliente há anos. Colocamos os dois lado a lado em três critérios que pesam mais no bolso do que no test-drive: consumo, revisão programada e revenda.",
      "No consumo de estrada os dois empatam tecnicamente, com vantagem mínima pro HB20 na versão aspirada. Na cidade, o turbo do Polo leva vantagem por precisar de menos giro do motor no trânsito parado.",
      "Na tabela de revisão programada, o HB20 sai mais barato nos três primeiros anos — a Hyundai historicamente pratica pacotes de manutenção mais competitivos que a Volkswagen nesse segmento.",
      "É na revenda que a coisa vira: o Polo historicamente deprecia menos, mantendo valor de mercado mais alto depois de 3 anos. Pra quem troca de carro com frequência, isso pesa mais que a economia na revisão.",
    ],
  },
  {
    slug: "opala-6-cilindros-historia",
    title: "O Opala 6 cilindros que a Chevrolet não queria que desse certo",
    excerpt:
      "A história de como um projeto secundário virou o carro mais cobiçado dos anos 70 no Brasil.",
    category: categoryBySlug["classicos"],
    author: "Renan",
    date: "2026-07-28",
    tags: ["chevrolet", "opala", "história", "clássico"],
    body: [
      "O motor 6 cilindros do Opala nasceu quase por acidente: era pra ser uma opção secundária num catálogo dominado pelo 4 cilindros. Acabou virando o motivo pelo qual o carro é lembrado até hoje.",
      "A base era o motor Chevrolet 250 americano, adaptado à realidade brasileira — inclusive pra rodar com álcool durante o Proálcool, o que ajudou a estender a vida comercial do carro por mais de duas décadas.",
      "O que fez o 6 cilindros virar objeto de desejo não foi só a potência — foi a sonoridade e a suavidade em relação ao 4 cilindros, numa época em que a maioria dos carros nacionais vibrava mais que hoje.",
      "Hoje um Opala 6 cilindros bem preservado é disputado por colecionadores, e peças originais do motor 250 já valem mais, isoladas, do que muita gente pagaria pelo carro inteiro nos anos 90.",
    ],
  },
];

export function getFeaturedPost(): Post {
  return posts.find((p) => p.featured) ?? posts[0];
}

export function getLatestPosts(excludeSlug?: string, limit = 6): Post[] {
  return posts.filter((p) => p.slug !== excludeSlug).slice(0, limit);
}

export function getPostsByCategory(categorySlug: string, limit?: number): Post[] {
  const matches = posts.filter((p) => p.category.slug === categorySlug);
  return limit ? matches.slice(0, limit) : matches;
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}

export function getPostBySlug(slug: string): Post | undefined {
  return posts.find((p) => p.slug === slug);
}

export function getRelatedPosts(post: Post, limit = 3): Post[] {
  return posts
    .filter((p) => p.slug !== post.slug && p.category.slug === post.category.slug)
    .slice(0, limit);
}

export function searchPosts(query: string): Post[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return posts.filter(
    (p) =>
      p.title.toLowerCase().includes(q) ||
      p.excerpt.toLowerCase().includes(q) ||
      p.tags.some((t) => t.toLowerCase().includes(q)) ||
      p.category.name.toLowerCase().includes(q)
  );
}
