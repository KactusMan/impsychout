import type { ReactNode } from "react";

// Gumroad-style button: the face lifts up and left on hover, revealing two
// stacked colour layers underneath. Pressing it pushes everything back flat.
type Props = {
  children: ReactNode;
  variant?: "pink" | "ink" | "paper" | "sky";
  size?: "md" | "lg";
  block?: boolean;
  className?: string;
} & (
  | ({ href: string } & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "className" | "children">)
  | ({ href?: undefined } & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children">)
);

export function GumButton({ children, variant = "pink", size = "md", block, className = "", ...rest }: Props) {
  const cls = `gum gum--${variant} gum--${size}${block ? " gum--block" : ""} ${className}`;
  const inner = (
    <>
      <span className="gum__layer gum__layer--back" aria-hidden="true" />
      <span className="gum__layer gum__layer--mid" aria-hidden="true" />
      <span className="gum__face">{children}</span>
    </>
  );
  if ("href" in rest && rest.href !== undefined) {
    return (
      <a className={cls} data-sfx-hover="kalimba" {...(rest as React.AnchorHTMLAttributes<HTMLAnchorElement>)}>
        {inner}
      </a>
    );
  }
  return (
    <button className={cls} data-sfx-hover="kalimba" {...(rest as React.ButtonHTMLAttributes<HTMLButtonElement>)}>
      {inner}
    </button>
  );
}
