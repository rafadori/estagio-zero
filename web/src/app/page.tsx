import { PostCard } from "@/components/content/PostCard";
import { Button } from "@/components/core/Button";
import {
  getCategories,
  getFeaturedPost,
  getLatestPosts,
  getPostsByCategory,
} from "@/lib/data";

// Revalida a home a cada minuto — sem isso, uma matéria nova só apareceria
// no próximo deploy (a página é gerada uma vez e cacheada).
export const revalidate = 60;

export default async function Home() {
  const featured = await getFeaturedPost();
  if (!featured) {
    return (
      <section className="container section">
        <p className="muted">Ainda não publicamos nenhuma matéria.</p>
      </section>
    );
  }

  const [latestHero, latestGrid, categories] = await Promise.all([
    getLatestPosts(featured.slug, 3),
    getLatestPosts(featured.slug, 6),
    getCategories(),
  ]);

  const categorySections = await Promise.all(
    categories.map(async (category) => ({
      category,
      posts: await getPostsByCategory(category.slug, 3),
    }))
  );

  return (
    <>
      <section className="container hero">
        <PostCard post={featured} featured />
        <div className="hero__side">
          {latestHero.map((post) => (
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
          {latestGrid.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      </section>

      {categorySections.map(({ category, posts }) => {
        if (posts.length === 0) return null;

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
              {posts.map((post) => (
                <PostCard key={post.slug} post={post} />
              ))}
            </div>
          </section>
        );
      })}
    </>
  );
}
