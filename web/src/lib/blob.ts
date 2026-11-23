import { put, del } from "@vercel/blob";

const MAX_IMAGE_BYTES = 8 * 1024 * 1024; // 8MB

export type UploadResult = { url: string } | { error: string };

// Sobe a imagem de capa pro Vercel Blob. Chamado de dentro das Server
// Actions de post (createPost/updatePost) — nunca direto do client.
export async function uploadPostImage(file: File, slug: string): Promise<UploadResult> {
  if (file.size === 0) return { error: "" }; // sem arquivo selecionado — chamado nunca deveria ocorrer aqui
  if (file.size > MAX_IMAGE_BYTES) {
    return { error: "Imagem maior que 8MB — comprime ou escolhe outra." };
  }
  if (!file.type.startsWith("image/")) {
    return { error: "Isso não parece ser uma imagem." };
  }

  const ext = file.type.split("/")[1] ?? "jpg";

  try {
    const blob = await put(`posts/${slug}.${ext}`, file, {
      access: "public",
      addRandomSuffix: true,
      contentType: file.type,
    });
    return { url: blob.url };
  } catch {
    return { error: "Falha ao enviar a imagem. Tenta de novo." };
  }
}

// Best-effort: se isso falhar não deve travar o fluxo principal (a matéria
// já foi salva com a imagem nova) — só sobra um blob órfão, sem problema.
export async function deletePostImage(url: string): Promise<void> {
  try {
    await del(url);
  } catch {
    // ignora
  }
}
