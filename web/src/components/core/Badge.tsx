import type { ReactNode } from "react";

type BadgeProps = {
  children: ReactNode;
  dark?: boolean;
  className?: string;
};

/** Solid corner marker over a photo (e.g. NOVO/VÍDEO/AO VIVO). Parent
 * element needs `position: relative` — used inside .ez-postcard__media. */
export function Badge({ children, dark = false, className = "" }: BadgeProps) {
  const classes = ["ez-badge", dark && "ez-badge--dark", className]
    .filter(Boolean)
    .join(" ");

  return <span className={classes}>{children}</span>;
}
