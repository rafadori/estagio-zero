import Link from "next/link";
import type { Post } from "@/lib/types";
import { formatDate } from "@/lib/format";
import { Tag } from "@/components/core/Tag";
import { Badge } from "@/components/core/Badge";

type PostCardProps = {
  post: Post;
  featured?: boolean;
};

/** Core content unit of the blog grid: image, category, headline, byline. */
export function PostCard({ post, featured = false }: PostCardProps) {
  const classes = ["ez-postcard", featured && "ez-postcard--featured"]
    .filter(Boolean)
    .join(" ");

  return (
    <article className={classes}>
      <Link href={`/materia/${post.slug}`} aria-label={post.title}>
        <div className="ez-postcard__media">
          {post.badge && <Badge>{post.badge}</Badge>}
          <span>FOTO</span>
        </div>
      </Link>
      <div className="ez-postcard__body">
        <Tag accent href={`/categoria/${post.category.slug}`}>
          {post.category.name}
        </Tag>
        <h3 className="ez-postcard__title">
          <Link href={`/materia/${post.slug}`}>{post.title}</Link>
        </h3>
        <p className="ez-postcard__excerpt">{post.excerpt}</p>
        <div className="ez-postcard__meta">
          <span>{post.author}</span>
          <span>{formatDate(post.date)}</span>
        </div>
      </div>
    </article>
  );
}
