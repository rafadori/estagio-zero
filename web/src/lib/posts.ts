import type { Category, Post } from "./types";

// Conteúdo inicial do site — NÃO é lido pelo app (que lê do Postgres via
// src/lib/data.ts). Serve só de fonte pro prisma/seed.ts.
//
// Tema do videocast: "Mulher na indústria automotiva: é preciso provar mais
// para ser respeitada?". Todo número citado vem das fontes do briefing:
// - Automotive Business, pesquisa Diversidade no Setor Automotivo (2026)
// - Oficina Brasil, repercutido pela Folha (julho de 2025)
// Nada de fala atribuída à convidada — ela ainda vai gravar.

export const categories: Category[] = [
  { slug: "videocast", name: "Videocast" },
  { slug: "dados", name: "Dados" },
  { slug: "carreira", name: "Carreira" },
  { slug: "oficina", name: "Oficina" },
  { slug: "opiniao", name: "Opinião" },
];

const categoryBySlug = Object.fromEntries(categories.map((c) => [c.slug, c]));

export const posts: Post[] = [
  {
    slug: "videocast-mulher-na-industria-automotiva",
    title: "Mulher na indústria automotiva: é preciso provar mais para ser respeitada?",
    excerpt:
      "O episódio do videocast Estágio Zero conversa com uma mulher da área sobre trajetória, rotina e os números que ainda pesam contra.",
    category: categoryBySlug["videocast"],
    author: "Rafael",
    date: "2026-11-20",
    featured: true,
    badge: "EPISÓDIO",
    tags: ["videocast", "mulheres", "carreira"],
    body: [
      "O tema do nosso videocast mudou, e por um bom motivo: a presença feminina no setor automotivo está crescendo, mas devagar — e quem está lá dentro sabe que entrar é só a primeira parte. No episódio, a gente conversa com uma convidada que vive essa realidade de perto.",
      "A conversa é dividida em três blocos. No primeiro, ela conta como foi parar no setor: paixão por carros, influência da família, oportunidade profissional ou um pouco de tudo. E também se em algum momento pensou em desistir — e quem incentivou ou tentou convencer de que aquela não era uma profissão pra ela.",
      "No segundo bloco, a pergunta é simples: como é um dia normal? A ideia é mostrar a rotina de estudos e projetos sem filtro, pra quem está de fora enxergar que entrar na área é possível. Falamos também da proporção entre homens e mulheres em sala de aula e em eventos automotivos, de situações em que foi preciso provar capacidade técnica mais do que um colega homem, e do papel das redes sociais.",
      "O terceiro bloco parte de dados. Em 2025, as mulheres eram 24% da força de trabalho do setor automotivo, segundo a pesquisa Diversidade no Setor Automotivo, da Automotive Business. Ocupavam 55% das vagas de trainee e estágio, mas só 20% da liderança. Com esses números na mesa, a pergunta é: o que é mais difícil, entrar ou crescer depois de entrar?",
      "O episódio deve ter entre 45 e 55 minutos, e a data de gravação ainda está sendo combinada. Enquanto isso, as matérias aqui do site aprofundam cada um desses pontos — começa pelos dados e segue pelas carreiras.",
    ],
  },
  {
    slug: "presenca-feminina-setor-automotivo-21-para-24",
    title: "De 21% para 24% em oito anos: a presença feminina no setor automotivo ainda anda devagar",
    excerpt:
      "Pesquisa da Automotive Business mostra alta de três pontos percentuais entre 2017 e 2025. É avanço, mas longe da paridade.",
    category: categoryBySlug["dados"],
    author: "Agata",
    date: "2026-11-18",
    badge: "DADOS",
    tags: ["pesquisa", "diversidade", "automotive business"],
    body: [
      "A pesquisa Diversidade no Setor Automotivo, divulgada pela Automotive Business em 2026, mostra que as mulheres passaram de 21% da força de trabalho analisada em 2017 para 24% em 2025.",
      "Três pontos percentuais em oito anos. Dá pra ler esse número de dois jeitos: como prova de que a mudança está acontecendo, ou como sinal de que, nesse ritmo, a paridade ainda está muito longe.",
      "O dado geral também esconde onde essas mulheres estão. Uma média de 24% não significa necessariamente 24% em cada área — e é justamente nos detalhes que as diferenças aparecem.",
      "Por isso a pergunta que levamos pro videocast não é só quantas mulheres existem no setor, mas por que ainda é tão difícil encontrá-las em determinadas áreas técnicas e em cargos de liderança, se a presença está aumentando.",
      "Nas próximas matérias a gente abre esses números: quem entra pelo estágio, quem chega à liderança e quem ainda quase não aparece nas estatísticas.",
    ],
  },
  {
    slug: "estagio-55-lideranca-20-mulheres-setor-automotivo",
    title: "55% no estágio, 20% na liderança: onde as mulheres ficam pelo caminho",
    excerpt:
      "Mulheres já são maioria entre trainees e estagiários do setor automotivo. O funil aperta na hora de subir.",
    category: categoryBySlug["carreira"],
    author: "Luan",
    date: "2026-11-16",
    tags: ["liderança", "estágio", "trainee"],
    body: [
      "Um dos números mais reveladores da pesquisa da Automotive Business sobre 2025: as mulheres ocupavam 55% das vagas de trainee e estágio no setor automotivo, mas apenas 20% das posições de liderança.",
      "Ou seja, na porta de entrada elas já são maioria. O problema aparece no caminho entre o primeiro crachá e a cadeira de decisão.",
      "Isso muda a conversa. Se a questão fosse só atrair mulheres para a área, os programas de estágio indicariam que o trabalho está feito. A pergunta passa a ser outra: o que acontece entre o estágio e a liderança?",
      "Promoção, avaliação de desempenho, quem é indicada para projetos de visibilidade, quem tem alguém mais experiente puxando pra cima — tudo isso pesa no crescimento de carreira, e nada disso aparece na estatística de contratação.",
      "No videocast, perguntamos à convidada justamente isso: o que é mais difícil, entrar em uma empresa automotiva ou crescer profissionalmente depois que já entrou?",
    ],
  },
  {
    slug: "mulheres-negras-3-por-cento-setor-automotivo",
    title: "Mulheres negras são 3% da força de trabalho e 1% dos cargos de decisão no setor automotivo",
    excerpt:
      "Recorte da pesquisa Diversidade no Setor Automotivo mostra que o avanço feminino não chega igual pra todas.",
    category: categoryBySlug["dados"],
    author: "Renan",
    date: "2026-11-14",
    badge: "DADOS",
    tags: ["pesquisa", "diversidade", "mulheres negras"],
    body: [
      "Quando se fala em mulheres no setor automotivo, o número geral — 24% da força de trabalho em 2025 — costuma aparecer primeiro. Mas a mesma pesquisa da Automotive Business traz um recorte que muda a leitura: mulheres negras representam apenas 3% da força de trabalho analisada e 1% das posições de decisão.",
      "Isso mostra que falar de diversidade como um bloco único não basta. O crescimento da presença feminina não necessariamente alcança todas as mulheres da mesma forma.",
      "Pra quem está pensando em entrar na área, esse dado também diz algo sobre referência: é mais difícil se imaginar num lugar onde quase ninguém parecido com você chegou.",
      "Pras empresas, a pergunta prática é se as iniciativas de diversidade olham pra esses recortes ou tratam “mulheres” como um grupo só.",
    ],
  },
  {
    slug: "mulheres-reparacao-automotiva-5-para-16",
    title: "Mulheres na reparação automotiva: de 5% em 2019 para 16,5% em 2025",
    excerpt:
      "Dados da Oficina Brasil, repercutidos pela Folha, mostram crescimento relativo de 230% em seis anos. O que isso diz sobre a oficina como porta de entrada?",
    category: categoryBySlug["oficina"],
    author: "Gabriel",
    date: "2026-11-12",
    badge: "DADOS",
    tags: ["reparação", "oficina", "mecânica"],
    body: [
      "Segundo dados da Oficina Brasil repercutidos pela Folha em julho de 2025, a participação feminina na reparação automotiva passou de 5% em 2019 para 16,5% em 2025 — um crescimento relativo de 230%.",
      "É um ritmo bem mais acelerado do que o do setor automotivo como um todo, que segundo a Automotive Business foi de 21% para 24% de mulheres entre 2017 e 2025. A oficina, por muito tempo vista como o lugar mais fechado pra mulheres, aparece aqui mudando rápido.",
      "Mas crescimento rápido a partir de uma base pequena ainda é uma base pequena: 16,5% significa que, a cada seis profissionais da reparação, aproximadamente uma é mulher.",
      "Isso levanta perguntas que vamos levar pro videocast: uma mulher que quer ser mecânica reparadora hoje encontra as mesmas oportunidades que uma que quer trabalhar numa montadora? Dá pra construir carreira como mecânica, eletricista automotiva, diagnosticista ou especialista em motores?",
      "E talvez a mais importante: o preconceito muda conforme a função? Ele é o mesmo na oficina, na engenharia, na produção, na administração e na gestão?",
    ],
  },
  {
    slug: "contratar-mulheres-talento-ou-meta",
    title: "Talento reconhecido ou meta de diversidade? Quando contratar mulheres vira só marketing",
    excerpt:
      "Contratar mais mulheres é um começo. O que separa uma mudança real de uma campanha bonita é o que acontece depois da contratação.",
    category: categoryBySlug["opiniao"],
    author: "Guilherme",
    date: "2026-11-10",
    tags: ["opinião", "diversidade", "empresas"],
    body: [
      "Uma das perguntas mais diretas do nosso videocast é também uma das mais desconfortáveis: as empresas estão contratando mais mulheres porque reconheceram talentos que antes eram ignorados, ou porque precisam cumprir metas de diversidade?",
      "A resposta honesta provavelmente é: depende da empresa — e muitas vezes as duas coisas acontecem ao mesmo tempo. Meta não é necessariamente ruim; muita mudança só começa quando alguém decide medir.",
      "O problema é quando a meta termina na contratação. Se as mulheres entram pelo estágio — onde já são 55%, segundo a Automotive Business — mas só 20% chegam à liderança, a foto de diversidade no site institucional fica bonita enquanto o funil continua o mesmo.",
      "Alguns sinais ajudam a separar uma coisa da outra: critérios claros de promoção, mulheres em posições de decisão (e não só nas campanhas), espaço pra falar de situações de preconceito sem medo de represália e estrutura pensada pra todas as pessoas, do uniforme ao vestiário.",
      "No episódio, a pergunta fica pra convidada: na opinião dela, o que uma empresa precisa mudar pra que a contratação de mulheres não seja apenas uma iniciativa de marketing?",
    ],
  },
  {
    slug: "rotina-de-quem-estuda-para-entrar-na-area-automotiva",
    title: "Como é a rotina de quem estuda pra entrar na área automotiva",
    excerpt:
      "Aula, laboratório, projeto e muita prática. Um guia pra desmistificar o dia a dia de quem está começando.",
    category: categoryBySlug["carreira"],
    author: "Agata",
    date: "2026-11-08",
    tags: ["estudos", "rotina", "primeiros passos"],
    body: [
      "Uma das perguntas que mais ouvimos de quem pensa em entrar na área é: mas como é o dia a dia, de verdade? Por isso, no videocast, pedimos pra convidada contar como é um dia normal de estudos.",
      "Em cursos técnicos e de graduação ligados ao setor, a rotina costuma misturar teoria — elétrica, mecânica, materiais, eletrônica embarcada — com prática em laboratório e oficina. Entender um motor no papel é uma coisa; desmontar e montar é outra.",
      "Projetos em equipe também ocupam boa parte do tempo. Competições estudantis de engenharia, como as de protótipos off-road e de fórmula, são uma porta comum pra ganhar experiência prática e contato com empresas.",
      "Pra muita mulher, é nesse ambiente que a diferença de proporção aparece pela primeira vez: ser uma das poucas, às vezes a única, na sala ou na equipe. Por isso perguntamos também como é essa proporção no cotidiano e em eventos automotivos — e se ela é sentida.",
      "A mensagem que a gente quer deixar é simples: não existe um perfil certo pra começar. Gostar de entender como as coisas funcionam já é um bom ponto de partida.",
    ],
  },
  {
    slug: "redes-sociais-mulheres-area-automotiva",
    title: "Redes sociais estão mudando quem a gente imagina embaixo do capô",
    excerpt:
      "Mecânicas, engenheiras e pilotas mostrando a rotina online criam algo que faltou pra muita gente: referência.",
    category: categoryBySlug["opiniao"],
    author: "Luan",
    date: "2026-11-06",
    tags: ["redes sociais", "referência", "opinião"],
    body: [
      "Durante muito tempo, a imagem de quem trabalha com carro foi uma só. As redes sociais começaram a bagunçar essa imagem — no bom sentido.",
      "Quando mulheres mostram a rotina numa oficina, numa linha de montagem, num laboratório de engenharia ou num autódromo, elas fazem algo que nenhuma campanha institucional consegue sozinha: mostram, com o dia a dia, que aquele lugar também é delas.",
      "Isso tem efeito prático. Quem está decidindo o que estudar passa a ver referências possíveis, e não só exceções distantes. E quem já está na área encontra uma rede pra trocar experiências, dicas e, às vezes, desabafos.",
      "Tem o outro lado também: exposição traz comentários, e muitos deles questionam a competência técnica de quem aparece — justamente o tema central do nosso episódio.",
      "No videocast, perguntamos à convidada: qual é a importância das redes sociais e o impacto das mulheres na área automotiva?",
    ],
  },
  {
    slug: "incentivo-faz-diferenca-carreira-automotiva",
    title: "Quem incentiva e quem desencoraja: o peso das primeiras vozes na carreira automotiva",
    excerpt:
      "Antes de qualquer prova técnica, muita mulher precisou responder à pergunta “isso é profissão pra você?”.",
    category: categoryBySlug["carreira"],
    author: "Renan",
    date: "2026-11-04",
    tags: ["incentivo", "trajetória", "primeiros passos"],
    body: [
      "Toda trajetória tem aquele momento em que alguém diz alguma coisa que fica. Às vezes é um professor que incentiva, um familiar que leva pra oficina no fim de semana, uma colega mais experiente que mostra o caminho. Às vezes é o contrário: alguém que insiste que aquela não é uma profissão pra você.",
      "No primeiro bloco do nosso videocast, perguntamos à convidada exatamente isso: houve alguém que te incentivou, ou alguém que tentou te convencer de que essa não era uma profissão pra você? E, em algum momento, você pensou em desistir?",
      "Essas perguntas importam porque o desencorajamento costuma vir antes mesmo da primeira vaga. Ele aparece na escolha do curso, na reação das pessoas próximas, nos comentários em sala de aula.",
      "E o incentivo, quando vem, também pesa — às vezes é o que separa quem segue de quem desiste no meio do caminho.",
      "Se você está pensando em entrar na área: procure essas pessoas. Professoras, profissionais, grupos de mulheres do setor, perfis nas redes. Referência e rede encurtam caminho.",
    ],
  },
];
