"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/slugify";
import { canManagePost } from "@/lib/admin-data";
import type { Role } from "@/generated/prisma/client";

export type PostFormState = { error?: string } | undefined;

type ParsedPost = {
  title: string;
  excerpt: string;
  body: string;
  categoryId: string;
  badge: string | null;
  featured: boolean;
  tagNames: string[];
};

function parseForm(formData: FormData, role: Role): ParsedPost | { error: string } {
  const title = String(formData.get("title") ?? "").trim();
  const excerpt = String(formData.get("excerpt") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();
  const categoryId = String(formData.get("categoryId") ?? "").trim();
  const badgeRaw = String(formData.get("badge") ?? "").trim();
  const tagsRaw = String(formData.get("tags") ?? "").trim();

  if (!title) return { error: "Título é obrigatório." };
  if (!excerpt) return { error: "Resumo é obrigatório." };
  if (!body) return { error: "Corpo da matéria é obrigatório." };
  if (!categoryId) return { error: "Escolhe uma categoria." };

  const tagNames = tagsRaw
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  // Destaque só é uma decisão editorial (Admin/Autor) — Colaborador(a) não
  // publica direto, então marcar destaque não faz sentido pro papel dele.
  const featured = role !== "CONTRIBUTOR" && formData.get("featured") === "on";

  return {
    title,
    excerpt,
    body,
    categoryId,
    badge: badgeRaw || null,
    featured,
    tagNames,
  };
}

async function syncTags(postId: string, tagNames: string[]) {
  await prisma.postTag.deleteMany({ where: { postId } });
  for (const name of tagNames) {
    const slug = slugify(name);
    if (!slug) continue;
    const tag = await prisma.tag.upsert({
      where: { slug },
      update: { name },
      create: { slug, name },
    });
    await prisma.postTag.create({ data: { postId, tagId: tag.id } });
  }
}

async function uniqueSlug(title: string): Promise<string> {
  const base = slugify(title) || "materia";
  let candidate = base;
  let i = 2;
  while (await prisma.post.findUnique({ where: { slug: candidate } })) {
    candidate = `${base}-${i}`;
    i++;
  }
  return candidate;
}

function revalidatePublicPaths(categorySlug?: string, postSlug?: string) {
  revalidatePath("/");
  revalidatePath("/painel");
  if (categorySlug) revalidatePath(`/categoria/${categorySlug}`);
  if (postSlug) revalidatePath(`/materia/${postSlug}`);
}

export async function createPost(
  _prevState: PostFormState,
  formData: FormData
): Promise<PostFormState> {
  const session = await auth();
  if (!session?.user) return { error: "Você precisa estar logado." };

  const parsed = parseForm(formData, session.user.role as Role);
  if ("error" in parsed) return parsed;

  const intent = formData.get("intent");
  const isContributor = session.user.role === "CONTRIBUTOR";
  const status = intent === "draft" ? "DRAFT" : isContributor ? "PENDING_REVIEW" : "PUBLISHED";

  const slug = await uniqueSlug(parsed.title);

  const category = await prisma.category.findUnique({ where: { id: parsed.categoryId } });
  if (!category) return { error: "Categoria inválida." };

  const post = await prisma.post.create({
    data: {
      slug,
      title: parsed.title,
      excerpt: parsed.excerpt,
      body: parsed.body,
      badge: parsed.badge,
      featured: parsed.featured,
      status,
      publishedAt: status === "PUBLISHED" ? new Date() : null,
      authorId: session.user.id,
      categoryId: parsed.categoryId,
    },
  });
  await syncTags(post.id, parsed.tagNames);

  revalidatePublicPaths(category.slug, slug);
  redirect("/painel");
}

export async function updatePost(
  _prevState: PostFormState,
  formData: FormData
): Promise<PostFormState> {
  const session = await auth();
  if (!session?.user) return { error: "Você precisa estar logado." };

  const id = String(formData.get("id") ?? "");
  const existing = await prisma.post.findUnique({ where: { id } });
  if (!existing) return { error: "Matéria não encontrada." };
  if (!canManagePost(existing, { id: session.user.id, role: session.user.role as Role })) {
    return { error: "Você não tem permissão pra editar essa matéria." };
  }

  const parsed = parseForm(formData, session.user.role as Role);
  if ("error" in parsed) return parsed;

  const intent = formData.get("intent");
  const isContributor = session.user.role === "CONTRIBUTOR";
  const wasPublished = existing.status === "PUBLISHED";
  const status =
    intent === "draft" ? "DRAFT" : isContributor ? "PENDING_REVIEW" : "PUBLISHED";

  const category = await prisma.category.findUnique({ where: { id: parsed.categoryId } });
  if (!category) return { error: "Categoria inválida." };

  await prisma.post.update({
    where: { id },
    data: {
      title: parsed.title,
      excerpt: parsed.excerpt,
      body: parsed.body,
      badge: parsed.badge,
      featured: parsed.featured,
      status,
      // Só carimba a data na primeira publicação — editar depois não muda
      // "publicado em".
      publishedAt: status === "PUBLISHED" ? (existing.publishedAt ?? new Date()) : existing.publishedAt,
      categoryId: parsed.categoryId,
    },
  });
  await syncTags(id, parsed.tagNames);

  revalidatePublicPaths(category.slug, existing.slug);
  if (wasPublished && existing.categoryId !== parsed.categoryId) {
    const oldCategory = await prisma.category.findUnique({ where: { id: existing.categoryId } });
    if (oldCategory) revalidatePath(`/categoria/${oldCategory.slug}`);
  }
  redirect("/painel");
}

// Ações rápidas (sem formulário) usadas na listagem do painel: aprovar,
// mandar de volta pra rascunho, tirar do ar, excluir.

async function requireManage(id: string) {
  const session = await auth();
  if (!session?.user) throw new Error("Não autenticado.");
  const post = await prisma.post.findUnique({ where: { id } });
  if (!post) throw new Error("Matéria não encontrada.");
  if (!canManagePost(post, { id: session.user.id, role: session.user.role as Role })) {
    throw new Error("Sem permissão.");
  }
  return { session, post };
}

export async function approvePost(id: string) {
  const { session, post } = await requireManage(id);
  // Só Admin/Autor(a) aprovam — Colaborador(a) não pode aprovar o próprio
  // post nem o de ninguém.
  if (session.user.role === "CONTRIBUTOR") throw new Error("Sem permissão.");

  const category = await prisma.category.findUnique({ where: { id: post.categoryId } });
  await prisma.post.update({
    where: { id },
    data: { status: "PUBLISHED", publishedAt: post.publishedAt ?? new Date() },
  });
  revalidatePublicPaths(category?.slug, post.slug);
  revalidatePath("/painel");
}

export async function rejectPost(id: string) {
  const { session } = await requireManage(id);
  if (session.user.role === "CONTRIBUTOR") throw new Error("Sem permissão.");

  await prisma.post.update({ where: { id }, data: { status: "DRAFT" } });
  revalidatePath("/painel");
}

export async function unpublishPost(id: string) {
  const { post } = await requireManage(id);
  const category = await prisma.category.findUnique({ where: { id: post.categoryId } });

  await prisma.post.update({ where: { id }, data: { status: "DRAFT" } });
  revalidatePublicPaths(category?.slug, post.slug);
  revalidatePath("/painel");
}

export async function deletePost(id: string) {
  const { post } = await requireManage(id);
  const category = await prisma.category.findUnique({ where: { id: post.categoryId } });

  await prisma.post.delete({ where: { id } });
  revalidatePublicPaths(category?.slug, post.slug);
  revalidatePath("/painel");
}
