import Link from "next/link";
import type { ReactNode } from "react";

type TagProps = {
  children: ReactNode;
  accent?: boolean;
  href?: string;
  className?: string;
};

/** Inline category pill — default or accent. */
export function Tag({ children, accent = false, href, className = "" }: TagProps) {
  const classes = ["ez-tag", accent && "ez-tag--accent", className]
    .filter(Boolean)
    .join(" ");

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return <span className={classes}>{children}</span>;
}
