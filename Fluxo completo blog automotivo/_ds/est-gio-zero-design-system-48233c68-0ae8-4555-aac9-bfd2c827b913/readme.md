# Estágio Zero — Design System

Identidade visual para **Estágio Zero**, blog automotivo estilo revista (grid de matérias, destaque em manchete, fotografia grande de carros). Este projeto foi criado do zero — não há codebase, Figma ou material de marca preexistente anexado. Todas as decisões de marca abaixo vieram de um formulário de perguntas respondido pelo usuário; não há logo, fotografia ou biblioteca de componentes de origem para copiar.

## Sumário / onde encontrar cada coisa
- `styles.css` — entrypoint global (importa tudo em `tokens/`)
- `tokens/` — cores, tipografia, espaçamento, efeitos (raio/sombra/motion), base e classes de componente
- `components/core/` — **Button**, **Tag**, **Badge**
- `components/content/` — **PostCard**
- `guidelines/` — specimen cards das fundações visuais (aparecem na aba Design System)
- `ui_kits/blog/index.html` — recriação interativa da homepage do blog (grid + destaque + alternador claro/escuro)
- `assets/` — vazio: nenhum logo ou imagem de marca foi fornecido (ver ICONOGRAFIA)
- `thumbnail.html` — capa do design system
- `SKILL.md` — versão portátil para uso como Skill do Claude Code

## Componentes
| Componente | Local | Descrição |
|---|---|---|
| `Button` | `components/core/Button.jsx` | CTA — variantes primary/secondary/ghost, tamanhos sm/md |
| `Tag` | `components/core/Tag.jsx` | Pílula de categoria inline (default/accent) |
| `Badge` | `components/core/Badge.jsx` | Marcador sólido de canto sobre foto (NOVO/VÍDEO/AO VIVO) |
| `PostCard` | `components/content/PostCard.jsx` | Unidade de conteúdo do grid do blog |

**Adições intencionais:** o briefing pedia só botão, card de post e tag. Adicionei `Badge` porque o `PostCard` precisa de um marcador de status sobre a foto (ex: "Vídeo"), visualmente distinto da `Tag` inline — está documentado no `.d.ts` do componente.

## Fundamentos de Conteúdo
- **Idioma:** português brasileiro, sempre.
- **Tom:** jovem e irreverente. Frases curtas, diretas, sem jargão de manual técnico. Perguntas retóricas são bem-vindas ("ficou bom?", "vale o preço?"). Gírias automotivas ok ("motorzinho", "careca" pra pneu).
- **Pessoa:** primeira do plural pra equipe ("rodamos 300km"), segunda pra falar com o leitor ("saber se vale a pena pra você").
- **Títulos:** afirmativos ou provocação em forma de pergunta, nunca clickbait vazio — sempre com um fato concreto (preço, potência, distância) na chamada.
- **Emoji:** não usar em manchetes ou UI. Tom irreverente vem da escrita, não de emoji.
- **Exemplo de manchete:** "Novo Polo Track: o Volks mais barato ficou bom?"
- **Exemplo de legenda:** "Rodamos 300km com o motorzinho 1.0 pra saber se vale o preço."
- **Rodapé / assinatura da marca:** tom auto-irônico, não corporativo — ex: "Feito por quem também troca o próprio óleo."

## Fundamentos Visuais
- **Cor de destaque:** azul elétrico `#0066FF` (`--blue-600`) — escolhido para fugir do vermelho, cor padrão do setor automotivo. Usado com moderação: CTAs, links, categoria ativa, marcador de corner badge. Nunca como cor de fundo grande.
- **Neutros:** escala "ink" (quase-preto a quase-branco) para texto e superfícies — nada de cinza puro, levemente azulado para casar com o acento.
- **Tema:** claro por padrão, com alternador para escuro (`[data-theme="dark"]` sobrescreve os tokens semânticos — os componentes não mudam, só os valores).
- **Tipografia de título:** Oswald, condensada e bold, sempre caixa alta — remete a painel de carro / velocímetro.
- **Tipografia de corpo:** Inter, regular, altura de linha generosa (1.6) para leitura de matéria longa.
- **Espaçamento:** escala de 4px (`--space-1` a `--space-9`), grid de 3 colunas no desktop.
- **Cantos:** quase retos (`--radius-sm: 2px` em botões e badges, `--radius-md: 6px` em cards) — visual técnico, não "fofo". Sem pill em cards, só nas tags.
- **Sombra:** rara e sutil — só aparece no hover de card (`--shadow-md`), nunca em repouso. Sem sombra interna.
- **Bordas:** hairline de 1px em quase tudo (cards, header) em vez de sombra — visual de tabela/ficha técnica.
- **Movimento:** rápido e seco (120–200ms, `--ease-snap` cubic-bezier sem overshoot) — sem bounce, sem elástico. Botão encolhe levemente ao clicar (`scale(.97)`).
- **Hover:** cor de texto/borda muda para o acento; card sobe 4px e ganha sombra. Sem opacidade reduzida (fica "morto"); preferimos cor.
- **Fundos:** planos, sem gradiente, sem textura, sem padrão repetido. Fotografia é o elemento visual — o layout deve dar espaço pra ela, não competir.
- **Fotografia:** nenhuma imagem real foi fornecida. Os cards usam um placeholder cinza sólido com o texto "FOTO" — substituir por fotografia de carro em alta resolução, tom levemente frio/técnico (não quente/lifestyle), sem filtro pesado.
- **Transparência/blur:** não usado — a marca é sólida e direta, sem glassmorphism.
- **Layout fixo:** header fica fixo no topo (`position: sticky`) durante o scroll.

## Iconografia
Nenhuma fonte de ícones foi fornecida (sem codebase, sem Figma). **Substituição sinalizada:** usamos [Lucide](https://lucide.dev) via CDN — estilo stroke fino que combina com o tom técnico da marca. Ver `guidelines/icons.html`. Não há emoji na UI. Não há fonte de ícone proprietária nem sprite SVG customizado — se a marca crescer, considerar migrar para um sprite próprio.

## Fontes
Oswald e Inter carregadas via Google Fonts CDN (`tokens/typography.css`) — ambas já são as fontes pedidas no briefing, nenhuma substituição necessária. Se preferir hospedar os arquivos localmente (self-host), me envie os `.woff2` e eu troco o `@font-face`.

## Fontes de origem
Nenhuma — briefing textual apenas, sem Figma, codebase ou anexos de marca. Se houver um Figma ou repositório do site real, anexe e eu sincronizo este sistema com os valores exatos.

## Ressalvas
- Sem logo: todo lugar que pediria uma marca gráfica usa o nome em Oswald (ver `guidelines/brand-wordmark.html`).
- Sem fotografia real: placeholders cinza no lugar de imagens de carro.
- Ícones são de uma biblioteca de terceiros (Lucide), não uma fonte própria da marca.
- UI kit cobre só a homepage (grid + destaque). Página de matéria individual, busca e newsletter ainda não foram desenhadas.
