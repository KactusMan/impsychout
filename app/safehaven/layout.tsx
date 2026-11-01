import type { Metadata } from "next";
import "./safehaven.css";

export const metadata: Metadata = {
  title: { default: "Safe Haven", template: "%s | Safe Haven" },
  robots: { index: false, follow: false, nocache: true },
};

export default function SafeHavenLayout({ children }: { children: React.ReactNode }) {
  return <div className="sh">{children}</div>;
}
