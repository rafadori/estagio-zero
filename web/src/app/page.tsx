import { PostCard } from "@/components/content/PostCard";
import { Button } from "@/components/core/Button";
import {
  categories,
  getFeaturedPost,
  getLatestPosts,
  getPostsByCategory,
} from "@/lib/posts";

export default function Home() {
  const featured = getFeaturedPost();
  const latest = getLatestPosts(featured.slug, 3);

  return (
    <>
      <section className="container hero">
        <PostCard post={featured} featured />
        <div className="hero__side">
          {latest.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      </section>

      <section className="container section">
        <div className="section__head">
          <h2 className="section__title">Últimas</h2>
          <Button href="/busca" variant="ghost" size="sm">
            Ver tudo →
          </Button>
        </div>
        <div className="grid">
          {getLatestPosts(featured.slug, 6).map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      </section>

      {categories.map((category) => {
        const categoryPosts = getPostsByCategory(category.slug);
        if (categoryPosts.length === 0) return null;

        return (
          <section key={category.slug} className="container section">
            <div className="section__head">
              <h2 className="section__title">{category.name}</h2>
              <Button
                href={`/categoria/${category.slug}`}
                variant="ghost"
                size="sm"
              >
                Ver tudo →
              </Button>
            </div>
            <div className="grid">
              {categoryPosts.map((post) => (
                <PostCard key={post.slug} post={post} />
              ))}
            </div>
          </section>
        );
      })}
    </>
  );
}
