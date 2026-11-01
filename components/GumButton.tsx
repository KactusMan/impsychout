import type { ReactNode } from "react";

// Stacked button: the face lifts up and left on hover, showing two layers in her blues
// underneath, with a soft note. Pressing flattens everything with a padded tap.
type Props = {
  children: ReactNode;
  variant?: "ink" | "paper";
  size?: "md" | "lg";
  block?: boolean;
  className?: string;
} & (
  | ({ href: string } & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "className" | "children">)
  | ({ href?: undefined } & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children">)
);

export function GumButton({ children, variant = "ink", size = "md", block, className = "", ...rest }: Props) {
  const cls = `gum gum--${variant} gum--${size}${block ? " gum--block" : ""} ${className}`;
  const inner = (
    <>
      <span className="gum__layer gum__layer--back" aria-hidden="true" />
      <span className="gum__layer gum__layer--mid" aria-hidden="true" />
      <span className="gum__face">{children}</span>
    </>
  );
  const sfx = { "data-sfx-hover": "note", "data-sfx-press": "tap" };
  if ("href" in rest && rest.href !== undefined) {
    return (
      <a className={cls} {...sfx} {...(rest as React.AnchorHTMLAttributes<HTMLAnchorElement>)}>
        {inner}
      </a>
    );
  }
  return (
    <button className={cls} {...sfx} {...(rest as React.ButtonHTMLAttributes<HTMLButtonElement>)}>
      {inner}
    </button>
  );
}
