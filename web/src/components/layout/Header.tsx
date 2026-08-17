import Link from "next/link";
import { Search } from "lucide-react";
import { categories } from "@/lib/posts";
import { ThemeToggle } from "./ThemeToggle";
import { MobileNav } from "./MobileNav";
import styles from "./Header.module.css";

export function Header() {
  return (
    <header className={styles.header}>
      <div className={`container ${styles.bar}`}>
        <Link href="/" className={styles.wordmark}>
          Estágio<span>Zero</span>
        </Link>

        <nav className={styles.nav} aria-label="Categorias">
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/categoria/${category.slug}`}
              className={styles.navLink}
            >
              {category.name}
            </Link>
          ))}
        </nav>

        <div className={styles.actions}>
          <Link
            href="/busca"
            className="ez-btn ez-btn--secondary ez-btn--sm"
            aria-label="Buscar"
          >
            <Search size={16} />
          </Link>
          <ThemeToggle />
          <MobileNav categories={categories} />
        </div>
      </div>
    </header>
  );
}
