"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

type Theme = "light" | "dark";

/** Persists to localStorage under "ez-theme"; app/layout.tsx applies the
 * stored value before paint via an inline script to avoid a flash. */
export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    const current =
      (document.documentElement.getAttribute("data-theme") as Theme | null) ??
      "light";
    setTheme(current);
  }, []);

  function toggle() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("ez-theme", next);
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className="ez-btn ez-btn--secondary ez-btn--sm"
      aria-label={
        theme === "dark" ? "Ativar tema claro" : "Ativar tema escuro"
      }
    >
      {/* Render nothing until mounted to avoid a server/client icon mismatch */}
      {theme === "dark" ? <Sun size={16} /> : theme === "light" ? <Moon size={16} /> : null}
    </button>
  );
}
