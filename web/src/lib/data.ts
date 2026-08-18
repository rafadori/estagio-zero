import { prisma } from "@/lib/prisma";
import type { Prisma } from "@/generated/prisma/client";
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
    body: post.body.split("\n\n"),
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

// Busca simples com ILIKE (case-insensitive) sobre título/resumo/tags/
// categoria — o protótipo descartável que o documento de pré-engenharia
// recomenda pra essa escala. Trocar por full-text search (tsvector + GIN)
// se o volume de matérias crescer.
export async function searchPosts(query: string): Promise<Post[]> {
  const q = query.trim();
  if (!q) return [];

  const posts = await prisma.post.findMany({
    where: {
      status: "PUBLISHED",
      OR: [
        { title: { contains: q, mode: "insensitive" } },
        { excerpt: { contains: q, mode: "insensitive" } },
        { category: { name: { contains: q, mode: "insensitive" } } },
        { tags: { some: { tag: { name: { contains: q, mode: "insensitive" } } } } },
      ],
    },
    orderBy: { publishedAt: "desc" },
    include: postInclude,
  });
  return posts.map(mapPost);
}
