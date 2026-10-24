---
name: seo-check
description: SEO and agent-readability checklist for the ImPsychOut Next.js site. Use before shipping any content or page change, when adding a page, or when asked to "check SEO", "make it SEO'd" or "make it readable for AI agents".
---

# SEO check for ImPsychOut

Run through every item. Fix what fails, then report what you checked.

## Metadata (app/layout.tsx, per-page `metadata`)
- Title under ~60 characters, leads with what the page offers, ends with `| ImPsychOut` (layout template does this).
- Description 140-160 characters, plain language, includes "online therapy" and Laraib's name.
- `alternates.canonical` set; Open Graph and Twitter use `/og.jpg` (1200x630) or a page-specific image.
- `lang="en-GB"` on `<html>`.

## Content
- Exactly one `<h1>` per page; headings go in order (h2 → h3), no skipped levels.
- Every image has meaningful `alt` text (decorative images use `alt=""` and `aria-hidden`).
- No em dashes or en dashes in copy (house style). Grep for `—` and `–`.
- Claims must be true and checkable: no HIPAA, no invented stats, testimonials only with client permission.
- Crisis line present wherever people are invited to get in touch.

## Structured data (lib/schema.ts)
- Person, ProfessionalService/MedicalBusiness, WebSite and FAQPage stay in sync with `lib/content.ts` (they read from it, so edit content there).
- Validate at https://validator.schema.org/ after changes.

## Crawling and agents
- `app/sitemap.ts` lists every public route; new pages must be added.
- `app/robots.ts` allows search engines and AI agents (GPTBot, ClaudeBot, PerplexityBot, Google-Extended and friends) and blocks `/api/`.
- `public/llms.txt` is a plain summary for AI agents; update it when services, credentials or contact routes change.
- Forms use real `<label>`s, `name` and `autocomplete` attributes so browsing agents can fill them.
- Content must render server-side (no text that only appears after JS); check with `curl -s localhost:4321 | grep "<h1"`.

## Performance (Core Web Vitals)
- `next build` passes with no type errors; first-load JS for `/` stays under ~250 kB.
- Hero image uses `priority`; all others lazy-load via `next/image` with `sizes`.
- Fonts come from `next/font` (no layout shift).
- Animations respect `prefers-reduced-motion`.
