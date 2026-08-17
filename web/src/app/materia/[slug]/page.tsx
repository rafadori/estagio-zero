import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPostBySlug, getRelatedPosts, posts } from "@/lib/posts";
import { getAuthor } from "@/lib/authors";
import { getCommentsBySlug } from "@/lib/comments";
import { formatDate } from "@/lib/format";
import { Tag } from "@/components/core/Tag";
import { PostCard } from "@/components/content/PostCard";
import { CommentSection } from "@/components/content/CommentSection";
import styles from "./article.module.css";

export function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata(
  props: PageProps<"/materia/[slug]">
): Promise<Metadata> {
  const { slug } = await props.params;
  const post = getPostBySlug(slug);
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
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const author = getAuthor(post.author);
  const related = getRelatedPosts(post);
  const comments = getCommentsBySlug(post.slug);

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

        {author.bio && (
          <div className={styles.authorBox}>
            <div className={styles.avatar}>{initials(author.name)}</div>
            <div>
              <div className={styles.authorName}>{author.name}</div>
              <div className={styles.authorRole}>{author.role}</div>
              <p className={styles.authorBio}>{author.bio}</p>
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
        <CommentSection initialComments={comments} />
      </div>
    </article>
  );
}
