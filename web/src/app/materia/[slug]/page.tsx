import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getAllPostSlugs,
  getCommentsForPost,
  getPostBySlug,
  getRelatedPosts,
} from "@/lib/data";
import { formatDate, roleLabel } from "@/lib/format";
import { Tag } from "@/components/core/Tag";
import { PostCard } from "@/components/content/PostCard";
import { CommentSection } from "@/components/content/CommentSection";
import styles from "./article.module.css";

export const revalidate = 60;

export async function generateStaticParams() {
  const slugs = await getAllPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata(
  props: PageProps<"/materia/[slug]">
): Promise<Metadata> {
  const { slug } = await props.params;
  const post = await getPostBySlug(slug);
  if (!post) return {};
  return { title: `${post.title} — Estágio Zero`, description: post.excerpt };
}

function initials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export default async function ArticlePage(
  props: PageProps<"/materia/[slug]">
) {
  const { slug } = await props.params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const [related, comments] = await Promise.all([
    getRelatedPosts(post),
    getCommentsForPost(post.slug),
  ]);

  return (
    <article>
      <header className={styles.head}>
        <Tag accent href={`/categoria/${post.category.slug}`}>
          {post.category.name}
        </Tag>
        <h1 className={styles.title}>{post.title}</h1>
        <p className={styles.byline}>
          <span>
            por <strong>{post.author}</strong>
          </span>
          <span>·</span>
          <span>{formatDate(post.date)}</span>
        </p>
      </header>

      <div className={styles.hero}>
        <div className={styles.heroMedia}>
          <span>FOTO</span>
        </div>
      </div>

      <div className={styles.body}>
        {post.body.map((paragraph, i) => (
          <p key={i}>{paragraph}</p>
        ))}

        <div className={styles.tags}>
          {post.tags.map((tag) => (
            <Tag key={tag}>{tag}</Tag>
          ))}
        </div>

        {post.authorBio && (
          <div className={styles.authorBox}>
            <div className={styles.avatar}>{initials(post.author)}</div>
            <div>
              <div className={styles.authorName}>{post.author}</div>
              <div className={styles.authorRole}>
                {post.authorRole ? roleLabel(post.authorRole) : null}
              </div>
              <p className={styles.authorBio}>{post.authorBio}</p>
            </div>
          </div>
        )}
      </div>

      {related.length > 0 && (
        <section className="container section">
          <div className="section__head">
            <h2 className="section__title">Matérias relacionadas</h2>
          </div>
          <div className="grid">
            {related.map((relatedPost) => (
              <PostCard key={relatedPost.slug} post={relatedPost} />
            ))}
          </div>
        </section>
      )}

      <div className={styles.commentsWrap}>
        <CommentSection postSlug={post.slug} initialComments={comments} />
      </div>
    </article>
  );
}
