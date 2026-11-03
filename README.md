# SUSHMITA — THE SERIES

A cinematic, streaming-inspired portfolio for **Sushmita Dasari**: Full-Stack Developer and B.Tech AI & ML student.
Every section is an episode, every project is an Original, and the whole site plays like a series.

> A personal portfolio with a fictional streaming-platform look. It is not affiliated with Netflix or any other streaming service and uses none of their logos.

## Run it locally

Requires **Node.js 18+**.

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually http://localhost:5173).

Production build:

```bash
npm run build
npm run preview
```

The static site is written to `dist/` and can be deployed as-is to Vercel, Netlify, GitHub Pages or any static host.

## Updating the content

**All content lives in one file: [`src/data/portfolio.ts`](src/data/portfolio.ts).** It was generated from the resume, and every component reads from it.

| To change… | Edit |
| --- | --- |
| Name, intro, email, LinkedIn, GitHub | `profile` |
| A project, or a new one | `projects` (add an object; it appears in Originals, the overlay, the resume sheet and the counts) |
| Achievements / certifications | `achievements`, `certifications` |
| Skills and their "where it's used" notes | `skillCategories`, `skillEvidence` |
| Seasons and episodes (My Journey) | `seasons` |
| Top 10 row | `topPicks` |
| ▶ Play Intro highlight reel | `introSlides` |
| Profile order (Recruiter / Developer / Creative) | `viewerProfiles` |
| Opening studio card text | `profile.originalLabel` |

**Resume:** replace `public/assets/Sushmita_Dasari_Resume.pdf`.

**Photo:** replace `pic1.jpeg` (high-res photo) and `pic.png` (background-removed cutout with the same framing), then run:

```bash
npm run images
```

This rebuilds the responsive WebP portraits and the social share image in `public/assets/`.

## What's inside

```
src/
  data/portfolio.ts        ← single source of truth (from the resume)
  App.tsx                  ← stages: opening → profile select → home; overlays
  components/
    OpeningSequence        ← black → studio card → SUSHMITA → THE SERIES → portrait → ▶ PLAY
    ProfileSelector        ← "Who's watching?" (changes section order only)
    Navbar                 ← hide-on-scroll nav, profile switcher, mobile menu
    Hero                   ← billboard: parallax portrait, particles, light streaks, floating chips
    PlayIntro              ← ▶ Play Intro: zoom into portrait → highlight reel (pause, ← →, tap zones)
    ContinueWatching       ← cards with real "watched" progress bars
    About                  ← The Pilot
    Seasons / EpisodeCard  ← My Journey as seasons and episodes
    Originals / ProjectCard← pinned horizontal sequence on desktop, swipe rail on touch
    ProjectModal           ← full-screen project overlay with a shared-element transition
    TopPicks               ← Top 10-style row
    Skills                 ← skill genres; each card shows where the skill appears
    Achievements           ← award-poster cards + certification rail (links to credentials)
    ResumeViewer/ResumeModal ← designed resume sheet, PDF viewer, download
    FinalCTA               ← TO BE CONTINUED… + contact links
    CustomCursor, fx.tsx   ← cursor states, magnetic buttons, 3D tilt, text reveals, particles
  hooks/                   ← Lenis smooth scroll + scroll lock, media queries, watch progress
scripts/build-images.mjs   ← portrait/share-image pipeline (sharp)
```

**Stack:** React 18, TypeScript, Vite 6, Tailwind CSS 4, Framer Motion 11, Lenis.

## Accessibility and performance

- `prefers-reduced-motion` is respected: smooth scroll, the custom cursor, tilt, particles, grain and the pinned horizontal scroll turn off, and the opening jumps straight to its final frame.
- Hover effects only run on devices with a precise pointer. Touch devices get tap interactions and native swipe rails.
- The custom cursor appears only with a mouse or trackpad.
- Overlays close with Esc, and the highlight reel supports Space and the ← → keys.
- Portraits are responsive WebP files (25–90 KB). Overlays are code-split, and particles pause when they're off screen.

## Keyboard shortcuts

- **Opening:** Enter or Esc skips it.
- **Play Intro:** Space pauses, ← and → change slides, Esc closes.
- **Project and resume overlays:** Esc closes.

## Contact form and email delivery

The `#contact` section posts to `/api/contact` (`src/components/ContactForm.tsx`). In development the Vite dev server mounts the same handler (`contactApi()` in `vite.config.ts`); in production **Vercel** auto-detects `api/contact.js` as a Node function and serves it at the same path. There is no separate backend to run.

The handler validates and sanitises every field, drops honeypot submissions, rate-limits to 5 messages per minute per IP, caps the request body at 16 KB, and sends a **plain-text** email through Resend's HTTPS API (no SDK dependency). The visitor's address is used only as `Reply-To`; the `From` identity is always the verified sender from `CONTACT_FROM`. The browser receives only `{ ok: true }` or `{ ok: false, error }` — keys, provider responses and stack traces never leave the server.

### Server-side environment variables

Copy `.env.example` to `.env` for local development, or add the same variables in Vercel → Project → Settings → Environment Variables. They must **not** be prefixed with `VITE_`.

| Variable | Required | Purpose |
| --- | --- | --- |
| `RESEND_API_KEY` | yes | Resend API key (`re_...`). Without it the endpoint returns a 503 and the form shows a "not configured" message. |
| `CONTACT_FROM` | recommended | Verified sender, e.g. `Portfolio Contact <hello@yourdomain.com>`. Defaults to `Portfolio Contact <onboarding@resend.dev>`. |
| `CONTACT_TO` | recommended | Inbox that receives messages. Defaults to `jeelpatel611@gmail.com`. |

### Remaining setup (cannot be done in code)

1. Create a free Resend account and API key.
2. Verify a sending domain under Resend → Domains (add the DNS records it gives you). Until a domain is verified, keep `CONTACT_FROM` on `onboarding@resend.dev` — Resend then delivers **only to the Resend account owner's address**, so make sure that account is `jeelpatel611@gmail.com` or switch to the verified domain before launch.
3. Put the key and sender into `.env` locally and into the Vercel project settings, then redeploy.

Until step 3 is done the form is wired end-to-end but returns the explicit "Email delivery isn't configured yet" error instead of pretending to succeed.
