"use client";

import { useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";

type Theme = "light" | "dark";

function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"],
  });
  return () => observer.disconnect();
}

function getSnapshot(): Theme {
  return (document.documentElement.getAttribute("data-theme") as Theme) ?? "light";
}

// Server render has no DOM/localStorage to read, so it renders nothing (see
// below) until the client snapshot is available post-hydration.
function getServerSnapshot(): Theme | null {
  return null;
}

/** Persists to localStorage under "ez-theme"; app/layout.tsx applies the
 * stored value before paint via an inline script to avoid a flash.
 * useSyncExternalStore (rather than state + effect) keeps this correct
 * across hydration without a synchronous setState-in-effect. */
export function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  function toggle() {
    const next: Theme = theme === "dark" ? "light" : "dark";
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
