"use client";

import type { ReactNode } from "react";
import { useSound } from "./SoundProvider";

// Stacked button: the face lifts up and left on hover, showing two layers in her blues
// underneath. Pressing it flattens everything and plays one soft note.
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
  const { play } = useSound();
  const cls = `gum gum--${variant} gum--${size}${block ? " gum--block" : ""} ${className}`;
  const inner = (
    <>
      <span className="gum__layer gum__layer--back" aria-hidden="true" />
      <span className="gum__layer gum__layer--mid" aria-hidden="true" />
      <span className="gum__face">{children}</span>
    </>
  );
  const onPointerDown = () => play("button");
  if ("href" in rest && rest.href !== undefined) {
    return (
      <a className={cls} onPointerDown={onPointerDown} {...(rest as React.AnchorHTMLAttributes<HTMLAnchorElement>)}>
        {inner}
      </a>
    );
  }
  return (
    <button className={cls} onPointerDown={onPointerDown} {...(rest as React.ButtonHTMLAttributes<HTMLButtonElement>)}>
      {inner}
    </button>
  );
}
