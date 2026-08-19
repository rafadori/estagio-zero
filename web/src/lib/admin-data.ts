import { prisma } from "@/lib/prisma";
import type { PostStatus, Role } from "@/generated/prisma/client";

// Camada de dados do painel — diferente de src/lib/data.ts (que só expõe o
// que é PUBLISHED pro site público). Aqui a gente lê rascunho, pendente de
// revisão etc., sempre atrás de checagem de sessão nas páginas/actions que
// chamam essas funções.

export type AdminPostListItem = {
  id: string;
  slug: string;
  title: string;
  status: PostStatus;
  categoryName: string;
  authorName: string;
  authorId: string;
  updatedAt: string;
};

export type AdminPostDetail = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  categoryId: string;
  tags: string;
  badge: string;
  featured: boolean;
  status: PostStatus;
  authorId: string;
};

export async function getCategoriesForForm(): Promise<
  { id: string; name: string }[]
> {
  const categories = await prisma.category.findMany({
    orderBy: { createdAt: "asc" },
  });
  return categories.map((c) => ({ id: c.id, name: c.name }));
}

// Colaborador(a) só vê o que é dele; Autor(a)/Admin veem tudo (agem como
// editores do time todo).
export async function getPostsForUser(
  userId: string,
  role: Role
): Promise<AdminPostListItem[]> {
  const posts = await prisma.post.findMany({
    where: role === "CONTRIBUTOR" ? { authorId: userId } : undefined,
    orderBy: { updatedAt: "desc" },
    include: { category: true, author: true },
  });

  return posts.map((post) => ({
    id: post.id,
    slug: post.slug,
    title: post.title,
    status: post.status,
    categoryName: post.category.name,
    authorName: post.author.name,
    authorId: post.authorId,
    updatedAt: post.updatedAt.toISOString(),
  }));
}

export function canManagePost(
  post: { authorId: string },
  user: { id: string; role: Role }
): boolean {
  return user.role !== "CONTRIBUTOR" || post.authorId === user.id;
}

export async function getPostForEdit(
  id: string,
  user: { id: string; role: Role }
): Promise<AdminPostDetail | null> {
  const post = await prisma.post.findUnique({
    where: { id },
    include: { tags: { include: { tag: true } } },
  });
  if (!post) return null;
  if (!canManagePost(post, user)) return null;

  return {
    id: post.id,
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    body: post.body,
    categoryId: post.categoryId,
    tags: post.tags.map((pt) => pt.tag.name).join(", "),
    badge: post.badge ?? "",
    featured: post.featured,
    status: post.status,
    authorId: post.authorId,
  };
}
