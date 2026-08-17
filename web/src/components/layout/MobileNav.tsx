"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import type { Category } from "@/lib/types";
import styles from "./MobileNav.module.css";

type MobileNavProps = {
  categories: Category[];
};

/** Hamburger trigger + slide-down panel, shown only below the breakpoint
 * where Header's inline nav is hidden (see Header.module.css). */
export function MobileNav({ categories }: MobileNavProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className={styles.wrap}>
      <button
        type="button"
        className="ez-btn ez-btn--secondary ez-btn--sm"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Fechar menu" : "Abrir menu"}
        aria-expanded={open}
      >
        {open ? <X size={16} /> : <Menu size={16} />}
      </button>

      {open && (
        <nav className={styles.panel} aria-label="Categorias (mobile)">
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/categoria/${category.slug}`}
              className={styles.link}
              onClick={() => setOpen(false)}
            >
              {category.name}
            </Link>
          ))}
        </nav>
      )}
    </div>
  );
}
