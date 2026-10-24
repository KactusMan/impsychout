# impsychout

Website for **ImPsychOut**: online therapy with clinical psychologist Laraib Fatima Ahmed.

Next.js 15 (App Router) + Framer Motion + GSAP ScrollTrigger. Branches: `v1` is the first static draft, `v2` is this rebuild.

```bash
npm install
npm run dev     # http://localhost:4321
npm run build
```

## Where things live

- `lib/content.ts`: all page copy (no em dashes, please)
- `lib/schema.ts`: JSON-LD structured data, built from the content
- `components/`: one file per section; `SoundProvider.tsx` handles the calm UI sounds, `GumButton.tsx` the Gumroad-style buttons
- `app/sitemap.ts`, `app/robots.ts`, `app/manifest.ts`, `public/llms.txt`: SEO and agent readability
- `public/sfx/`: sound effects, credits in `public/sfx/CREDITS.md`
- `.claude/skills/seo-check/`: SEO checklist skill for Claude Code

## Booking form email

The form posts to `/api/consultation`, which emails requests through [Resend](https://resend.com). Set these in Vercel → Project → Settings → Environment Variables:

- `RESEND_API_KEY`
- `CONSULTATION_TO_EMAIL` (where requests go)
- `CONSULTATION_FROM_EMAIL` (optional, needs a verified domain)

Until they're set, the form tells people to message on Instagram instead.
