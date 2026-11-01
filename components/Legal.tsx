import Link from "next/link";
import type { ReactNode } from "react";

// Shared shell for the legal pages. Details in [square brackets] are placeholders for Laraib
// to confirm before launch; LEGAL_UPDATED is shown on every page.
export const LEGAL_UPDATED = "1 November 2026";
export const CONTACT = {
  name: "Laraib Fatima Ahmed, trading as ImPsychOut",
  email: "[contact email]",
  address: "[postal address or country of operation]",
};

export function LegalPage({ title, intro, children }: { title: string; intro: string; children: ReactNode }) {
  return (
    <article className="legal section--lined">
      <div className="container container--narrow">
        <nav className="crumbs" aria-label="Breadcrumb">
          <ol>
            <li>
              <Link href="/">Home</Link>
            </li>
            <li aria-current="page">{title}</li>
          </ol>
        </nav>
        <h1 className="display svc__title">{title}</h1>
        <p className="legal__updated">Last updated {LEGAL_UPDATED}</p>
        <p className="svc__answer">{intro}</p>
        <div className="legal__body">{children}</div>
      </div>
    </article>
  );
}
