import Link from "next/link";
import { Search } from "lucide-react";
import { getCategories } from "@/lib/data";
import { ThemeToggle } from "./ThemeToggle";
import { MobileNav } from "./MobileNav";
import { AuthStatus } from "./AuthStatus";
import styles from "./Header.module.css";

export async function Header() {
  const categories = await getCategories();

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
          <AuthStatus />
          <MobileNav categories={categories} />
        </div>
      </div>
    </header>
  );
}
