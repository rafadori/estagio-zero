import type { Metadata } from "next";
import { auth } from "@/auth";
import { getCategoriesForForm } from "@/lib/admin-data";
import { createPost } from "@/lib/actions/posts";
import { PostForm } from "@/components/painel/PostForm";

export const metadata: Metadata = { title: "Nova matéria — Painel" };

export default async function NovaMateriaPage() {
  const session = await auth();
  if (!session?.user) return null;

  const categories = await getCategoriesForForm();

  return (
    <PostForm action={createPost} categories={categories} role={session.user.role} />
  );
}
