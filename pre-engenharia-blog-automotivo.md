# Pré-Engenharia: Blog Automotivo — Referências de Design, Requisitos Funcionais e Stack Recomendada

## Resumo
- **Construam uma aplicação full-stack própria em vez de WordPress puro**: para a nota da matéria de Linguagens em Multimeios e pelo valor de aprendizado, a melhor escolha é **Laravel (PHP) com o starter kit Breeze** — já vem com login/registro/perfis prontos, documentação excelente pra iniciante, e um caminho de tutorial bem conhecido pra exatamente esse tipo de projeto (blog com auth + comentários); **Django** é a segunda opção (melhor se vocês preferirem Python e quiserem um admin pronto + o pacote maduro `django-comments-xtd` pra comentários anônimos), e **Next.js + PostgreSQL** é a terceira opção (visual mais moderno, mas auth e comentários exigem mais montagem manual).
- **Adotem o padrão visual dominante de blog automotivo, não o visual exato do Flatout**: um grid estilo revista com cards/destaque, uma cor de destaque forte sobre uma base neutra, um título em sans-serif bold, fotografia grande de ponta a ponta, e uma home dividida por categorias. O Flatout usa **vermelho vibrante sobre tema claro**; pra ficar original, escolham uma cor de destaque *diferente* (ex: azul elétrico, verde-limão/amarelo) e/ou ofereçam um **tema escuro**, que o Flatout não tem.
- **Comentário anônimo é padrão de mercado e seguro desde que se adicione fricção pra bots, não pra humanos**: campo de nome + email opcional, um campo honeypot escondido, checagem de tempo de envio, limite de taxa por IP, e uma fila de moderação (comentários ficam "pendentes" até aprovação). A busca no site deve usar **busca full-text do PostgreSQL/MySQL** — não vale a pena usar Algolia/Elasticsearch nessa escala.

## Principais Descobertas

### 1. Identidade visual — Flatout e o conjunto de comparação
- **Flatout (flatout.com.br)** roda em **WordPress** (WPBakery Page Builder). A cor da marca é um **vermelho vibrante** na logo sobre preto; o site em si usa um **tema claro/branco com texto escuro** e **sem alternância pra modo escuro**. A home é um layout de revista: uma **matéria em destaque** no topo, uma lista **"Últimas do FlatOut"**, depois **blocos por categoria** (Técnica, Histórias, Especiais, Classics & Street, Vídeos), e um feed "Matérias recentes" com miniatura + título + autor/data + resumo. As páginas de matéria mostram um **rótulo de categoria**, H1 em negrito, uma **linha "por [autor]"** com datas de publicação/edição, imagem grande de destaque, **tags** no rodapé, grid de matérias relacionadas, box de bio do autor, e comentários via **Disqus**. O Flatout tem bastante conteúdo pago (aparece um bloqueio de assinante no meio da matéria).
- **Motor1.com** (referência internacional): paleta de marca é um **vermelho tijolo discreto (#A8323C "Well Read")** sobre **fundo quase branco (#F7F9FB)**, com vermelho escuro (#6B010A) como terciária; a logo circular atual foi **redesenhada pela Pininfarina e lançada em 5 de novembro de 2020** (substituindo a logo quadrada antiga). O **redesign de 2024** (anunciado pela Motorsport Network em 30 de outubro de 2024, junto com InsideEVs e RideApart, segundo o Diretor Editorial Global Travis Okulski) usa **caixas de tamanhos diferentes** (eliminaram deliberadamente o carrossel/slider), um formato de "blog reverso" com notícias, matérias em destaque e "coleções", um menu hambúrguer pra navegação por marca/modelo, e — diferente do Flatout — um **alternador confirmado de tema claro/escuro**.
- **Jalopnik** (EUA, historicamente a referência de blog automotivo): seus redesigns foram repetidamente na direção de **imagens grandes, rolagem infinita cronológica reversa, logo centralizada em negrito (laranja sólido numa época), e páginas iniciais mais leves/simples** que destacam matérias grandes. Leitores reagiram mal a redesigns que deram peso demais a widgets sociais e esconderam conteúdo atrás de cliques extras — um alerta sobre usabilidade.
- **Car and Driver** (revista dos EUA): o redesign de 2020 usa **Interstate para texto e títulos (larguras condensada e regular), Gliko Modern e Gliko Modern Condensed pros títulos, e Freight Text pro corpo do texto** (segundo o Fonts In Use, 31/03/2020), com destaque em **vermelho + azul** sobre a logo histórica (o nameplate "AND" todo em caixa alta é de maio de 1983). É um bom exemplo da combinação editorial "título condensado em negrito + corpo serifado".
- **Quatro Rodas** (Brasil, Editora Abril, desde 1960): marca de revista tradicional, focada em **fotografia forte e hierarquia editorial clara** (testes, comparativos, seção "Segredo" de fotos-espiã, Q&A técnico).
- **Porsche Christophorus / revistas digitais automotivas de luxo**: abordagem de hub de conteúdo — **grid na home linkando pra matérias longas, fotografia em alta resolução dominante, bastante espaço em branco, tipografia contida, animação sutil ao rolar a página**.

**Padrões comuns entre blogs automotivos** (seguros pra adotar numa identidade original):
1. **Home em grid estilo revista** com um grande destaque + seções por categoria + um feed cronológico de "últimas".
2. **Uma cor de destaque forte sobre uma base neutra.** Vermelho é extremamente comum (vermelho vibrante do Flatout, vermelho tijolo #A8323C do Motor1, vermelho+azul do Car and Driver) — motivo pelo qual uma marca original deveria considerar um destaque *diferente* pra não parecer derivada.
3. **Títulos em sans-serif bold (geralmente condensada)** combinados com um **corpo de texto bem legível**; tipografia grande e bastante espaço em branco.
4. **Fotografia grande, de ponta a ponta**, como o principal elemento visual — os carros são o protagonista.
5. **Tema escuro é um forte diferencial**: muitos sites automotivos/de performance modernos usam interfaces escuras com destaque vibrante; o Flatout não tem isso, então um tema escuro (ou um alternador como o do Motor1) é uma forma fácil de se diferenciar.
6. **Convenções de página de matéria**: rótulo de categoria, H1 em negrito, autor + data, imagem de destaque, tags, matérias relacionadas, comentários no rodapé.

### 2. Conjunto de funcionalidades e padrões de arquitetura

**Autenticação multi-autor e papéis (roles).** O padrão quase universal em CMS é um pequeno conjunto de papéis seguindo o **princípio do menor privilégio**:
- **Administrador** — controle total (usuários, configurações).
- **Editor** — pode publicar e editar posts *de qualquer autor*.
- **Autor** — pode escrever e publicar *seus próprios* posts.
- **Colaborador** — pode escrever rascunhos mas *não pode publicar* (precisa de aprovação do editor).
- **Assinante/Leitor** — só leitura / só comentar.

Pro projeto de vocês, um modelo com 3 papéis (Admin, Autor, Colaborador→precisa aprovação) já é suficiente. Boa prática: nenhum redator deveria ter acesso de Administrador; idealmente a publicação passa por uma etapa de revisão onde uma segunda pessoa aprova antes de ir ao ar.

**Comentário anônimo (sem conta) — como fazer com segurança.** Comentário anônimo é padrão, mas convida spam, então a implementação segura combina:
- **Campo de nome (obrigatório) + email (opcional)** — o email, se informado, pode ser usado pra notificação de resposta ou um Gravatar, mas não é obrigatório.
- **Campo honeypot**: um campo de formulário escondido dos humanos via CSS/posicionamento fora da tela; bots preenchem, e qualquer envio com ele preenchido é rejeitado silenciosamente. Honeypots são discretos com a privacidade e não incomodam usuários reais (diferente de CAPTCHA).
- **Checagem de tempo de envio**: rejeitar formulários enviados rápido demais pra ser humano (sinal de bot), e opcionalmente uma flag de presença de JS.
- **Limite de taxa por IP**: ex: limitar quantos comentários por IP por minuto.
- **Token CSRF** no formulário pra evitar envio de outros sites.
- **Fila de moderação**: comentários chegam como `pendente` e só aparecem depois que um admin/editor aprova. Esse é o controle mais importante num sistema anônimo. O pacote `django-comments-xtd` mostra a abordagem canônica: pra usuários não autenticados, pode exigir **confirmação por email via link**, depois disso o comentário fica **pendente de aprovação**; também suporta respostas encadeadas, notificação por email pros moderadores, e sinalização de abuso.
- Escalonamento opcional: um sistema de pontuação de spam (soma pontos por honeypot acionado / flag de JS ausente / envio rápido demais) e só bloqueia acima de um limite, além de uma lista negra de domínios.

**Busca no site.** Pra um blog pequeno/médio, o consenso é: **usem a busca full-text nativa do banco de dados, não um serviço de busca dedicado.**
- **Busca full-text do PostgreSQL** (`tsvector`/`tsquery`, um **índice GIN**, `ts_rank` pra relevância, e `pg_trgm` pra tolerância a erros de digitação) é rápida, gratuita, e não precisa de infraestrutura extra. MySQL/MariaDB tem um equivalente com índice `FULLTEXT`. Isso cobre praticamente todas as necessidades de busca de um blog.
- **Algolia / Elasticsearch / Meilisearch** adicionam um segundo sistema pra sincronizar, uma segunda linguagem de consulta, latência externa e (no caso do Algolia) preço por consulta/armazenamento. Só se justificam pra busca instantânea tolerante a erros em larga escala, sinônimos, ou faceting complexo — over-engineering e um ponto de falha a mais pro blog de vocês. O plano gratuito "Build" do Algolia tem um limite rígido de **1 milhão de registros e 10.000 requisições por mês**, e a busca fica **bloqueada até o próximo ciclo de cobrança** se ultrapassar isso.
- Recomendação: comecem com uma busca simples `LIKE`/`ILIKE` só pra um protótipo descartável; entreguem a funcionalidade de verdade com busca full-text e índice.

### 3. Stacks de tecnologia recomendadas (2–3 opções realistas)

**Opção A — Laravel (PHP) + MySQL/PostgreSQL + Blade/Livewire + Tailwind. (Escolha principal pra esse trabalho.)**
- *Por quê*: o starter kit **Breeze** do Laravel monta login, registro, recuperação de senha, verificação de email e página de perfil com um comando só, usando Blade + Tailwind — vocês têm acesso e conseguem entender todo o código. Existe um caminho de tutorial bem documentado pra exatamente esse projeto ("Building a Blog with Laravel, Livewire, and Laravel Breeze" — autenticação de usuário, criar/editar posts, comentários, tags). Papéis podem ser adicionados com uma coluna simples ou um pacote tipo spatie/laravel-permission.
- *Prós*: Amigável pra iniciante, sintaxe elegante, o Artisan CLI monta funcionalidades rápido; documentação/comunidade enorme (Laracasts); auth, validação, CSRF, filas e email já vêm prontos; resultado com boa cara.
- *Contras*: Hospedagem PHP é um pouco menos "nativa de tier gratuito" que JS/Python em algumas plataformas; o Jetstream (o kit mais robusto com 2FA/times) é mais do que vocês precisam — usem **Breeze**, não Jetstream.

**Opção B — Django (Python) + PostgreSQL + templates Django. (Melhor se preferirem Python.)**
- *Por quê*: o Django já vem com uma **interface de administração pronta** (back-office multi-autor instantâneo), um sistema maduro de **auth + grupos/permissões**, e o pacote **`django-comments-xtd`** que entrega comentário anônimo com confirmação por email, moderação, threading e notificações prontos. A busca full-text do PostgreSQL integra nativamente.
- *Prós*: "Pilhas incluídas", documentação oficial excelente, o admin economiza um tempo enorme, Python bem legível; forte pra sites com bastante conteúdo/dados.
- *Contras*: Os templates padrão são simples demais — vocês vão investir mais em estilização pra chegar num visual "com cara"; um pouco mais de trabalho manual de front-end do que a UI já pronta do Laravel Breeze.

**Opção C — Next.js (React/TypeScript) + PostgreSQL (Prisma ORM) + Auth.js/NextAuth. (Mais moderno, mais montagem.)**
- *Por quê*: entrega a UI mais contemporânea, rápida e amigável pra SEO (SSR/SSG, otimização de imagem). Auth.js/NextAuth + adaptador Prisma cuida do login e um campo `role` pro controle de acesso; busca full-text do Postgres cobre a busca.
- *Prós*: Resultado com melhor visual/performance; deploy trivial na Vercel; ótimo pra portfólio; forte no tratamento de imagem pra um blog de carros com muita foto.
- *Contras*: vocês **montam** auth, papéis, comentários e moderação na mão (mais peças móveis, mais decisões); comentários/moderação não têm um pacote canônico único como o do Django; mais difícil pra iniciante do que Breeze/admin do Django.

**Deploy (todas cabem no orçamento de estudante):**
- **Render** — serviço web gratuito + **PostgreSQL gerenciado gratuito** (sem cartão de crédito), deploy direto do Git; ressalvas: serviços web gratuitos **hibernam após 15 minutos sem tráfego e levam cerca de um minuto (≈30–60s) pra voltar**, workspaces ganham **750 horas de instância gratuitas/mês**, e (segundo o changelog do Render, válido desde 20/05/2024) **bancos PostgreSQL gratuitos agora expiram após 30 dias** (antes eram 90), com uma janela adicional de **14 dias pra fazer upgrade antes dos dados serem apagados** e limite de 1 GB de armazenamento / um banco gratuito por conta. Façam backup antes da apresentação.
- **Vercel** — ideal pra opção Next.js (frontend + APIs serverless leves); combinem com Postgres do Neon/Supabase.
- **Railway / Fly.io** — utilizáveis, mas hoje são modelos de trial/uso pago em vez de "sempre grátis".
- **PythonAnywhere** — o mais tranquilo pra quem está começando com Django e não quer mexer com Docker.

**Sobre WordPress**: é o caminho mais rápido pra ter um blog *funcionando* (papéis prontos, milhares de temas, plugins anti-spam com honeypot/Akismet, plugins de comentário estilo Disqus — é literalmente o que o Flatout usa). Mas pra uma matéria de *programação/multimídia*, o valor de aprendizado e de nota de uma construção própria é muito maior, e uma aplicação própria dá controle total sobre a identidade visual original. Recomendação: **construam do zero (Laravel/Django); mantenham o WordPress como plano B** se o tempo apertar.

### 4. Estrutura/checklist do documento de pré-engenharia

Um pacote padrão de requisitos de projeto web (estilo SRS/PRD, adaptado pra um blog) deveria conter:
1. **Propósito e escopo** — o que é o site, pra quem é, o problema que resolve; restrições explícitas (aqui: **não pode citar SENAI em nenhum lugar da marca/conteúdo/identidade visual**; tema automotivo; prazo de estudante).
2. **Stakeholders e personas** — autores de conteúdo (redatores/editores) e leitores (visitantes anônimos + comentaristas); seus objetivos.
3. **Requisitos funcionais** — enumerados e testáveis: auth multi-autor + papéis; CRUD de posts (criar/editar/publicar/rascunho); categorias & tags; comentário anônimo + moderação; busca no site; upload de mídia/imagem.
4. **Requisitos não-funcionais** — responsivo/mobile-first, performance, acessibilidade (contraste WCAG ≥ 4.5:1 pro texto do corpo), suporte a navegadores, segurança (CSRF, limite de taxa, hash de senha), SEO.
5. **Arquitetura de informação / mapa do site** — hierarquia de páginas: Home; páginas de Categoria; página de Post (matéria); resultados de Busca; página de Autor; Login/Registro (só autores); painel/editor do autor; Sobre; view de moderação de comentários.
6. **Wireframes / layouts de página** — um wireframe por template único (home, matéria, categoria, resultados de busca, editor, login) e por breakpoint responsivo; definam níveis de título (H1/H2…) e navegação pra desktop + mobile.
7. **Identidade visual / guia de estilo** — logo, paleta de cores (destaque + neutras, com hex), escala tipográfica (fontes e tamanhos de título vs corpo), estilo de imagem, decisão de claro/escuro, componentes de UI (botões, cards, tags).
8. **Modelo de dados / diagrama ER** — Usuários (com papel), Posts, Categorias, Tags, Comentários (com status: pendente/aprovado), relacionamentos.
9. **User stories e critérios de aceite** — ex: "Como leitor anônimo, posso postar um comentário só com um nome, e ele aparece apenas depois de moderado."
10. **Stack de tecnologia e arquitetura** — framework escolhido, banco de dados, hospedagem, e a justificativa.
11. **Cronograma do projeto / marcos** e **riscos/premissas**.
12. **Plano de manutenção e suporte** (pós-lançamento).

## Detalhes

**Interpretando a pesquisa de design pra uma identidade original.** Como vermelho-sobre-claro é a assinatura mais comum entre blogs automotivos (vermelho vibrante do Flatout, vermelho tijolo #A8323C do Motor1, vermelho+azul do Car and Driver), a forma mais rápida de parecer *original mas dentro do gênero* é manter as convenções estruturais do gênero (destaque + grid de cards, fotografia grande, títulos condensados em negrito) enquanto **mudam duas variáveis**: (a) a cor de destaque — escolham algo fora da família do vermelho, ex: um azul elétrico/de corrida, verde-limão/amarelo, ou laranja usado de forma deliberadamente diferente do Jalopnik; e (b) o **modo do tema** — o Flatout é só claro, então um **tema escuro com um único destaque vibrante** já passa uma leitura moderna/de performance e distinta. Combinem uma **sans-serif condensada em negrito** (título) com um **corpo neutro e legível** — uma combinação editorial comprovada (Interstate condensada + Freight Text do Car and Driver é a referência). Fontes gratuitas equivalentes, sem preocupação de licença: candidatas a título como **Archivo/Archivo Narrow, Oswald, Anton, Barlow Condensed**; candidatas de corpo como **Inter, Source Sans, Roboto, ou uma serifada legível como Lora/Source Serif**. Mantenham bastante espaço em branco e deixem a fotografia de carro em largura total carregar a página.

**Por que Laravel Breeze em vez de Jetstream aqui.** O Breeze é explicitamente o kit de baixa complexidade (login, registro, recuperação de senha, verificação de email, perfil) em Blade/React/Vue/Livewire, recomendado pra iniciantes e apps pequenos/médios onde vocês querem visibilidade total sobre o código de autenticação. O Jetstream adiciona 2FA, gerenciamento de sessão, tokens de API Sanctum e gerenciamento de times — nada disso o blog precisa, ao custo de mais complexidade. Comecem com Breeze e adicionem uma coluna de papel ou spatie/laravel-permission.

**Fluxo de moderação de comentário anônimo (concreto).** O padrão comprovado pelo `django-comments-xtd`: um visitante deslogado envia nome + comentário (email opcional); se exigirem confirmação, ele clica num link enviado por email; o comentário então fica armazenado como **não-público / pendente**; os moderadores recebem uma notificação; um admin aprova no back-office antes de aparecer publicamente. Mesmo sem confirmação por email, a combinação honeypot + checagem de tempo + limite de taxa + fila pendente é o mínimo viável pra um setup seguro. Sinalização/curtir-descurtir geralmente exige um usuário autenticado, mas *postar* não — o que bate com o que vocês pediram.

**Dimensionamento da busca.** Com um índice GIN sobre um `tsvector` de título+resumo+conteúdo e ordenação por `ts_rank`, o Postgres retorna resultados relevantes rápido e de graça; adicionem `pg_trgm` pra tolerância a erro de digitação. Só migrem pra Elasticsearch/Algolia se depois precisarem de sinônimos, relevância por ML, ou geolocalização — nada disso se aplica a um blog de trabalho escolar, e cada um adiciona um trabalho de sincronização e um ponto externo de falha.

## Recomendações

**Etapa 1 — Definir (o entregável da pré-engenharia).** Produzam o documento seguindo o checklist acima. Fechem: a marca original sem SENAI (nome, logo, paleta com hex, duas fontes, decisão claro-vs-escuro), um mapa do site, wireframes pros 6 templates principais, o modelo de dados (Usuários/Posts/Categorias/Tags/Comentários-com-status), e os requisitos funcionais enumerados com critérios de aceite. *Referência pra avançar*: cada uma das quatro funcionalidades exigidas (auth multi-autor, comentários anônimos+moderados, busca, boa UX) tem pelo menos uma user story com critério de aceite, e cada página única tem um wireframe.

**Etapa 2 — Escolher a stack.** Padrão sugerido: **Laravel + Breeze + MySQL/PostgreSQL + Tailwind**, pelo melhor equilíbrio entre scaffolding, documentação e acabamento. Escolham **Django + django-comments-xtd** se o grupo preferir Python ou quiser o admin gratuito e um pacote pronto de comentário anônimo. Escolham **Next.js + Postgres + Auth.js** só se o grupo estiver confortável montando auth/comentários na mão e quiser a peça de portfólio mais moderna. *Limite pra recorrer ao WordPress*: se restarem menos de ~2 semanas de prazo, caiam pro WordPress (papéis nativos, plugins Akismet/honeypot, um plugin de comentário) e usem o tempo no tema original.

**Etapa 3 — Construam nessa ordem.** (1) Auth + papéis → (2) CRUD de posts + categorias/tags + painel do autor → (3) templates públicos de matéria/home/categoria com a identidade visual → (4) comentários anônimos com honeypot + limite de taxa + fila de moderação → (5) busca full-text → (6) polimento de responsividade/acessibilidade/SEO. Entreguem cada etapa de forma vertical (funcionando de ponta a ponta) pra sempre terem algo demonstrável.

**Etapa 4 — Deploy.** Usem **Render** (serviço web gratuito + Postgres gratuito) pra Laravel/Django, ou **Vercel + Neon/Supabase** pra Next.js. Considerem o "sono" do Render após inatividade e a expiração do banco gratuito em 30 dias fazendo backup dos dados antes da apresentação.

## Ressalvas
- **Os hex exatos e os nomes de fonte do Flatout não são publicados.** O Flatout não tem um guia de marca público; a descoberta de "vermelho vibrante sobre tema claro" é baseada no site ao vivo e em assets de logo/merchandising (alta confiança sobre o vermelho e sobre o tema claro, mas sem hex oficial). A fonte exata dos títulos não pôde ser confirmada pelo HTML da página. Tratem isso como referência direcional, não especificação literal — e de qualquer forma vocês não podem copiar mesmo.
- **Os termos de hospedagem gratuita mudam com frequência.** A janela de exclusão do Postgres gratuito do Render (agora 30 dias, segundo o changelog de 20/05/2024), o comportamento de hibernar após 15 minutos (cold start de ≈1 minuto), e a mudança do Railway/Fly.io pra modelos de trial/uso pago são válidos conforme relatos de 2026, mas devem ser reconferidos na hora de construir.
- **Comentário anônimo é inerentemente mais arriscado pra spam e abuso**; a combinação honeypot + limite de taxa + moderação reduz mas não elimina isso. Planejem ter uma pessoa revisando a fila de moderação, e considerem segurar automaticamente comentários que contenham links.
- Algumas referências de design (recepção do redesign do Jalopnik, artigos sobre tendência de "design flat") são fontes de opinião/comunidade; usem como sinal qualitativo, não fato definitivo.
- Esse relatório assume um time solo ou bem pequeno e um único semestre; premissas de escala (tráfego, uptime) são deliberadamente modestas.
