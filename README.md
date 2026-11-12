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
- `app/sitemap.ts`, `app/robots.ts`, `app/manifest.ts`: SEO
- `lib/agent.ts`: what AI assistants read, built from the live copy: `/llms.txt`, `/llms-full.txt`, and a Markdown version of every page for requests with `Accept: text/markdown` (see `middleware.ts`)
- `/safehaven`: the private backend. Keep every backend page under it: login, `noindex` headers and robots rules then apply automatically
- `public/sfx/`: sound effects, credits in `public/sfx/CREDITS.md`
- `.claude/skills/seo-check/`: SEO checklist skill for Claude Code

## Booking form email

The form posts to `/api/consultation`, which uses [Resend](https://resend.com) to send two emails (templates in `lib/emails.ts`):

1. the request to Laraib at `impsychout@gmail.com`
2. a warm "your request reached me" follow-up to the person, styled like the site

Set these in Vercel → Project → Settings → Environment Variables, then redeploy:

- `RESEND_API_KEY` (required)
- `CONSULTATION_TO_EMAIL` (optional, defaults to `impsychout@gmail.com`)
- `CONSULTATION_FROM_EMAIL` (optional, defaults to `Laraib at ImPsychOut <hello@impsychout.com>`)

Emails come from `hello@impsychout.com` once the domain is verified in Resend (DNS records live in Vercel, since Vercel runs the domain's DNS). Until then the request to Laraib is re-sent from `onboarding@resend.dev`, which only delivers to the email address that owns the Resend account, and the follow-up to clients is skipped (the request itself still goes through). Replies to the follow-up go to `impsychout@gmail.com`. Without `RESEND_API_KEY` the form tells people to message on Instagram instead.
