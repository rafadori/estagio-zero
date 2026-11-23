import { prisma } from "@/lib/prisma";
import { Prisma } from "@/generated/prisma/client";
import type { Category, Comment, Post } from "@/lib/types";

// Camada de dados — espelha a API que existia em src/lib/posts.ts (agora
// fake/arquivada), mas lendo do Postgres via Prisma. Todo mundo que consome
// isso já lida com Promises, então as páginas viram Server Components async.

const postInclude = {
  author: true,
  category: true,
  tags: { include: { tag: true } },
} satisfies Prisma.PostInclude;

type PostWithRelations = Prisma.PostGetPayload<{ include: typeof postInclude }>;

function mapPost(post: PostWithRelations): Post {
  return {
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    category: { slug: post.category.slug, name: post.category.name },
    author: post.author.name,
    authorRole: post.author.role,
    authorBio: post.author.bio ?? undefined,
    date: (post.publishedAt ?? post.createdAt).toISOString(),
    badge: post.badge ?? undefined,
    imageUrl: post.imageUrl ?? undefined,
    featured: post.featured,
    tags: post.tags.map((pt) => pt.tag.name),
    // Tolerante a CRLF e a linha "em branco" com espaços, não só "\n\n".
    body: post.body
      .replace(/\r\n?/g, "\n")
      .split(/\n\s*\n/)
      .map((p) => p.trim())
      .filter(Boolean),
  };
}

function mapComment(comment: Prisma.CommentModel): Comment {
  return {
    id: comment.id,
    author: comment.authorName,
    date: comment.createdAt.toISOString(),
    body: comment.body,
    pending: comment.status === "PENDING",
  };
}

export type TeamMember = { name: string; role: string; bio: string | null };

export async function getTeam(): Promise<TeamMember[]> {
  const users = await prisma.user.findMany({
    where: { role: { in: ["ADMIN", "AUTHOR"] } },
    orderBy: { createdAt: "asc" },
  });
  return users.map((u) => ({ name: u.name, role: u.role, bio: u.bio }));
}

export async function getCategories(): Promise<Category[]> {
  const categories = await prisma.category.findMany({
    orderBy: { createdAt: "asc" },
  });
  return categories.map((c) => ({ slug: c.slug, name: c.name }));
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const category = await prisma.category.findUnique({ where: { slug } });
  return category ? { slug: category.slug, name: category.name } : null;
}

export async function getFeaturedPost(): Promise<Post | null> {
  const post = await prisma.post.findFirst({
    where: { status: "PUBLISHED", featured: true },
    orderBy: { publishedAt: "desc" },
    include: postInclude,
  });
  if (post) return mapPost(post);

  // Sem post marcado como destaque: cai pro mais recente.
  const latest = await prisma.post.findFirst({
    where: { status: "PUBLISHED" },
    orderBy: { publishedAt: "desc" },
    include: postInclude,
  });
  return latest ? mapPost(latest) : null;
}

export async function getLatestPosts(excludeSlug?: string, limit = 6): Promise<Post[]> {
  const posts = await prisma.post.findMany({
    where: { status: "PUBLISHED", slug: excludeSlug ? { not: excludeSlug } : undefined },
    orderBy: { publishedAt: "desc" },
    take: limit,
    include: postInclude,
  });
  return posts.map(mapPost);
}

export async function getPostsByCategory(categorySlug: string, limit?: number): Promise<Post[]> {
  const posts = await prisma.post.findMany({
    where: { status: "PUBLISHED", category: { slug: categorySlug } },
    orderBy: { publishedAt: "desc" },
    take: limit,
    include: postInclude,
  });
  return posts.map(mapPost);
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const post = await prisma.post.findFirst({
    where: { slug, status: "PUBLISHED" },
    include: postInclude,
  });
  return post ? mapPost(post) : null;
}

export async function getRelatedPosts(post: Post, limit = 3): Promise<Post[]> {
  const posts = await prisma.post.findMany({
    where: {
      status: "PUBLISHED",
      slug: { not: post.slug },
      category: { slug: post.category.slug },
    },
    orderBy: { publishedAt: "desc" },
    take: limit,
    include: postInclude,
  });
  return posts.map(mapPost);
}

export async function getAllPostSlugs(): Promise<string[]> {
  const posts = await prisma.post.findMany({
    where: { status: "PUBLISHED" },
    select: { slug: true },
  });
  return posts.map((p) => p.slug);
}

export async function getCommentsForPost(postSlug: string): Promise<Comment[]> {
  const comments = await prisma.comment.findMany({
    where: { post: { slug: postSlug }, status: "APPROVED" },
    orderBy: { createdAt: "desc" },
  });
  return comments.map(mapComment);
}

// Acentos que o translate() do Postgres troca pela letra sem acento — o
// mesmo mapa que normalizeSearchText() aplica na consulta digitada. Assim
// "lideranca" acha "liderança" e "MECANICA" acha "mecânica" (no celular
// quase ninguém digita acento). Sem extensão do Postgres (unaccent) pra
// não depender do que o provedor de banco habilita.
const ACCENTED = "áàâãäéèêëíìîïóòôõöúùûüçñ";
const PLAIN = "aaaaaeeeeiiiiooooouuuucn";

function normalizeSearchText(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function escapeLike(term: string): string {
  return term.replace(/[\\%_]/g, (c) => `\\${c}`);
}

// Busca por palavras: cada palavra digitada precisa aparecer em algum lugar
// (título, resumo, corpo, categoria ou tags), em qualquer ordem, ignorando
// acento e maiúscula. Prefixo vale ("lider" acha "liderança"), o que combina
// com a busca ao vivo enquanto a pessoa digita. Resultados com mais palavras
// no título vêm primeiro.
//
// Escala: varre as matérias publicadas sem índice — ok pra centenas de
// posts. Se crescer muito, o próximo passo do doc de pré-engenharia é
// full-text search (tsvector + GIN, pg_trgm pra erro de digitação).
export async function searchPosts(query: string): Promise<Post[]> {
  const words = normalizeSearchText(query)
    .split(/\s+/)
    .filter((w) => w.length >= 2)
    .slice(0, 8);
  if (words.length === 0) return [];

  const plain = (expr: Prisma.Sql) =>
    Prisma.sql`translate(lower(${expr}), ${ACCENTED}, ${PLAIN})`;

  const doc = plain(
    Prisma.sql`p.title || ' ' || p.excerpt || ' ' || p.body || ' ' || c.name || ' ' ||
      coalesce((SELECT string_agg(t.name, ' ') FROM post_tags pt JOIN tags t ON t.id = pt."tagId" WHERE pt."postId" = p.id), '')`
  );
  const title = plain(Prisma.sql`p.title`);
  const patterns = words.map((w) => `%${escapeLike(w)}%`);

  const matchAll = Prisma.join(
    patterns.map((pat) => Prisma.sql`${doc} LIKE ${pat}`),
    " AND "
  );
  const titleScore = Prisma.join(
    patterns.map((pat) => Prisma.sql`(CASE WHEN ${title} LIKE ${pat} THEN 1 ELSE 0 END)`),
    " + "
  );

  const rows = await prisma.$queryRaw<{ id: string }[]>`
    SELECT p.id
    FROM posts p
    JOIN categories c ON c.id = p."categoryId"
    WHERE p.status = 'PUBLISHED' AND ${matchAll}
    ORDER BY (${titleScore}) DESC, p."publishedAt" DESC
    LIMIT 30
  `;
  if (rows.length === 0) return [];

  const posts = await prisma.post.findMany({
    where: { id: { in: rows.map((r) => r.id) } },
    include: postInclude,
  });
  const byId = new Map(posts.map((p) => [p.id, p]));
  return rows.flatMap((r) => {
    const post = byId.get(r.id);
    return post ? [mapPost(post)] : [];
  });
}
