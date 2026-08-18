"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import type { Post } from "@/lib/types";
import { PostCard } from "@/components/content/PostCard";
import styles from "./search.module.css";

const DEBOUNCE_MS = 300;

// Busca real contra /api/search (ILIKE via Prisma — ver src/lib/data.ts),
// com debounce pra não bater no banco a cada tecla digitada.
export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const hasQuery = query.trim().length > 0;

  useEffect(() => {
    const q = query.trim();
    const controller = new AbortController();

    // Tudo que muda estado fica dentro do timeout (mesmo o caso "sem
    // busca"), pra nunca chamar setState de forma síncrona no corpo do
    // efeito — só dispara no próximo tick, quebrando a cadeia de renders.
    const timer = setTimeout(
      async () => {
        if (!q) {
          setResults([]);
          setLoading(false);
          return;
        }

        setLoading(true);
        try {
          const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`, {
            signal: controller.signal,
          });
          const data = await res.json();
          setResults(data.results ?? []);
        } catch (err) {
          if ((err as Error).name !== "AbortError") setResults([]);
        } finally {
          setLoading(false);
        }
      },
      q ? DEBOUNCE_MS : 0
    );

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query]);

  return (
    <section className="container">
      <div className={styles.head}>
        <h1 className={styles.title}>Busca</h1>
        <div className={styles.inputWrap}>
          <Search size={16} className={styles.icon} />
          <input
            type="search"
            className={`ez-input ${styles.input}`}
            placeholder="Busque por modelo, marca ou assunto"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
        </div>
      </div>

      {hasQuery && !loading && (
        <p className={`muted ${styles.status}`}>
          {results.length === 0
            ? `Nada encontrado pra "${query}".`
            : `${results.length} resultado${results.length === 1 ? "" : "s"} pra "${query}"`}
        </p>
      )}

      {hasQuery && results.length > 0 && (
        <div className={`grid ${styles.results}`}>
          {results.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      )}

      {!hasQuery && (
        <p className={styles.empty}>Digite algo pra buscar nas matérias do Estágio Zero.</p>
      )}
    </section>
  );
}
