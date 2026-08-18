"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import type { Comment } from "@/lib/types";

// Fluxo de comentário anônimo descrito no documento de pré-engenharia:
// nome obrigatório + email opcional, honeypot escondido, checagem de tempo
// de envio, e todo comentário novo entra "pendente" até um editor aprovar.
// (Falta ainda: limite de taxa por IP — não dá pra fazer isso de forma
// confiável sem um cache/KV compartilhado; ok pra escala de projeto escolar.)

const MIN_SUBMIT_TIME_MS = 1500;

export type SubmitCommentResult =
  | { ok: true; comment: Comment | null } // comment null = descartado em silêncio (honeypot/tempo)
  | { ok: false; error: string };

export async function submitComment(
  postSlug: string,
  formData: FormData
): Promise<SubmitCommentResult> {
  const honeypot = String(formData.get("website") ?? "").trim();
  const renderedAt = Number(formData.get("renderedAt") ?? 0);
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();

  // Bot: campo escondido preenchido, ou enviou rápido demais pra ser
  // humano. Finge sucesso sem revelar que foi descartado.
  const tooFast = renderedAt > 0 && Date.now() - renderedAt < MIN_SUBMIT_TIME_MS;
  if (honeypot || tooFast) {
    return { ok: true, comment: null };
  }

  if (!name || name.length > 100) {
    return { ok: false, error: "Nome inválido." };
  }
  if (!body || body.length > 2000) {
    return { ok: false, error: "Comentário vazio ou grande demais." };
  }

  const post = await prisma.post.findUnique({ where: { slug: postSlug } });
  if (!post) {
    return { ok: false, error: "Matéria não encontrada." };
  }

  const created = await prisma.comment.create({
    data: {
      postId: post.id,
      authorName: name,
      authorEmail: email || null,
      body,
      status: "PENDING",
    },
  });

  revalidatePath(`/materia/${postSlug}`);

  return {
    ok: true,
    comment: {
      id: created.id,
      author: created.authorName,
      date: created.createdAt.toISOString(),
      body: created.body,
      pending: true,
    },
  };
}
