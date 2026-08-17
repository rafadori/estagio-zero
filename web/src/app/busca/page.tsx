"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { searchPosts } from "@/lib/posts";
import { PostCard } from "@/components/content/PostCard";
import styles from "./search.module.css";

// Filtro em memória sobre os posts fake — um protótipo descartável, como
// recomenda o documento de pré-engenharia. Na versão com banco, isso vira
// full-text search do Postgres (tsvector/tsquery + índice GIN).
export default function SearchPage() {
  const [query, setQuery] = useState("");
  const results = useMemo(() => searchPosts(query), [query]);
  const hasQuery = query.trim().length > 0;

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

      {hasQuery && (
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
