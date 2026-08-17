import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { categories, getCategoryBySlug, getPostsByCategory } from "@/lib/posts";
import { PostCard } from "@/components/content/PostCard";

export function generateStaticParams() {
  return categories.map((category) => ({ slug: category.slug }));
}

export async function generateMetadata(
  props: PageProps<"/categoria/[slug]">
): Promise<Metadata> {
  const { slug } = await props.params;
  const category = getCategoryBySlug(slug);
  if (!category) return {};
  return {
    title: `${category.name} — Estágio Zero`,
    description: `Todas as matérias de ${category.name} no Estágio Zero.`,
  };
}

export default async function CategoryPage(
  props: PageProps<"/categoria/[slug]">
) {
  const { slug } = await props.params;
  const category = getCategoryBySlug(slug);
  if (!category) notFound();

  const categoryPosts = getPostsByCategory(category.slug);

  return (
    <section className="container section">
      <div className="section__head">
        <h1 className="section__title">{category.name}</h1>
        <span className="muted">
          {categoryPosts.length}{" "}
          {categoryPosts.length === 1 ? "matéria" : "matérias"}
        </span>
      </div>

      {categoryPosts.length > 0 ? (
        <div className="grid">
          {categoryPosts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      ) : (
        <p className="muted">
          Ainda não publicamos nada em {category.name}. Volta aqui em breve.
        </p>
      )}
    </section>
  );
}
