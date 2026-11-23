import Link from "next/link";
import type { Post } from "@/lib/types";
import { formatDate } from "@/lib/format";
import { Button } from "@/components/core/Button";
import styles from "./FeaturedBanner.module.css";

type FeaturedBannerProps = {
  post: Post;
};

/** Manchete da home: a matéria marcada como destaque no painel, em faixa
 * escura de largura total. Substitui o antigo hero de card grande. */
export function FeaturedBanner({ post }: FeaturedBannerProps) {
  const href = `/materia/${post.slug}`;

  return (
    <section className={styles.banner}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.text}>
          <p className={styles.kicker}>
            <span>{post.category.name}</span>
            {post.badge && <span>{post.badge}</span>}
          </p>
          <h1 className={styles.title}>
            <Link href={href}>{post.title}</Link>
          </h1>
          <p className={styles.excerpt}>{post.excerpt}</p>
          <p className={styles.meta}>
            {post.author} · {formatDate(post.date)}
          </p>
          <div>
            <Button href={href} variant="primary">
              Ler matéria
            </Button>
          </div>
        </div>

        <Link href={href} className={styles.media} aria-label={post.title}>
          {post.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={post.imageUrl} alt="" />
          ) : (
            "FOTO"
          )}
        </Link>
      </div>
    </section>
  );
}
