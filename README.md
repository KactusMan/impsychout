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
- `lib/cms.ts`, `lib/media.ts`: Safe Haven storage. Text and uploaded photos live in the private Vercel Blob store; photos are served by the site at `/media/<name>`. Any `src` in `lib/copy.ts` shows up in Safe Haven as a photo picker
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

## Mail to @impsychout.com

The domain's MX record points at Resend, which receives the mail. `/api/inbound` passes each email on to `impsychout@gmail.com` with its formatting and attachments; pressing Reply in Gmail answers the original sender. To switch it on:

1. Resend → Webhooks → Add webhook: `https://www.impsychout.com/api/inbound`, event `email.received`
2. Copy the webhook's signing secret into Vercel as `RESEND_WEBHOOK_SECRET`, then redeploy

`INBOUND_FORWARD_TO` (optional) sends it somewhere other than `CONSULTATION_TO_EMAIL` / `impsychout@gmail.com`. Keep receiving switched on in Resend: without the MX record, mail to the domain bounces.
