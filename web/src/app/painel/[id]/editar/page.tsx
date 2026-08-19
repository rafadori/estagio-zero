import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { getCategoriesForForm, getPostForEdit } from "@/lib/admin-data";
import { updatePost } from "@/lib/actions/posts";
import { PostForm } from "@/components/painel/PostForm";
import type { Role } from "@/generated/prisma/client";

export const metadata: Metadata = { title: "Editar matéria — Painel" };

export default async function EditarMateriaPage(
  props: PageProps<"/painel/[id]/editar">
) {
  const { id } = await props.params;
  const session = await auth();
  if (!session?.user) return null;

  const [post, categories] = await Promise.all([
    getPostForEdit(id, { id: session.user.id, role: session.user.role as Role }),
    getCategoriesForForm(),
  ]);

  if (!post) notFound();

  return (
    <PostForm
      action={updatePost}
      categories={categories}
      role={session.user.role}
      initial={post}
    />
  );
}
