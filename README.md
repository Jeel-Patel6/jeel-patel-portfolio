# Jeel Patel – Personal Portfolio

A fast, single-page developer portfolio for **Jeel Patel**, Full Stack AI Architect.
It presents projects, an applied skill set, a working method, and a direct way to start a collaboration — built as a single React application with a lightweight serverless contact endpoint.

---

## About the Project

This portfolio is more than a list of technologies: it is a structured walkthrough of how Jeel identifies a problem, designs an approach, builds, and evaluates the result. The site is deliberately content-driven — every fact displayed (introduction, education, projects, skills, process steps, contact details) comes from one central data file, so the presentation layer stays in sync with the actual story.

The project demonstrates:

- **Technical skills** — a skills taxonomy across languages, AI/ML, generative AI, web development, and databases/tools.
- **Projects** — machine learning and web application work with per-project detail views.
- **Problem-solving approach** — a dedicated "Process" section documenting the five-step method behind the work.
- **Professional journey** — background, specialization, and current focus.
- **Reachability** — a validated contact form backed by a real serverless email pipeline, plus an in-browser resume.

---

## Features

- **Sticky top navigation** with scroll-spy active state, a measured sliding underline indicator, deep-link (`#section`) restoration, and a mobile drawer menu.
- **Resume link** that opens `resume.pdf` in a new browser tab for in-browser viewing, printing, and download.
- **Smooth scrolling** powered by Lenis on precise-pointer devices; touch devices and reduced-motion users get native behavior instead.
- **Canvas wordmark (TechText)** — an oversized, interactive hero title rendered on `<canvas>` with a letter-reveal intro and click feedback.
- **Scramble headline** — hero phrases cycle with a character-by-character scramble animation, engineered to avoid layout shift between phrases.
- **Custom cursor** (desktop, fine-pointer only) that grows into a labelled disc over interactive targets, plus magnetic hover effects.
- **Horizontal projects rail** — native sideways scrolling (drag, shift+wheel, trackpad, touch swipe, arrow controls) without hijacking vertical scroll.
- **Project detail modal** — lazy-loaded, shared-element transition on desktop, keyboard dismiss, focus management, and scroll locking.
- **Responsive design** from 320 px to ultrawide, with distinct desktop/mobile navigation layouts.
- **Motion accessibility** — every animated piece checks `prefers-reduced-motion`, and desktop-only effects are gated by pointer media queries.
- **Contact form with a real backend** — client-side validation posting to `/api/contact`, which validates, sanitizes, rate-limits, and delivers the message through the Resend email API (no SDK dependency).
- **SEO & social metadata** — Open Graph and Twitter cards, theme color, `robots.txt`, semantic HTML, a skip-to-content link, and a `<noscript>` fallback.
- **Performance-minded asset pipeline** — self-hosted subset WOFF2 fonts with preload hints, responsive portrait WebP via `srcset`, and idle-time preloading of the lazy modal chunk.

---

## Tech Stack

| Category | Technology |
|---|---|
| Core | [React 18](https://react.dev/), TypeScript 5.8 |
| Build tooling | Vite 6, `@vitejs/plugin-react`, TypeScript project references (`tsc -b`) |
| Styling | Tailwind CSS 4 (CSS-first design tokens in `src/index.css`), custom light/dark surfaces |
| Animation & interaction | Framer Motion 11 (page transitions, scroll-into-view, modal), Lenis 1.1 (smooth scroll) |
| Contact backend | Node.js serverless function (`api/contact.js`), [Resend](https://resend.com/) HTTPS API, deployed on Vercel |
| Media pipeline | `sharp` (dev-time script for responsive portrait WebP generation), self-hosted Inter + Bebas Neue fonts |
| State & data | Typed single-source dataset in TypeScript (`src/data/portfolio.ts`) |

---

## Portfolio Sections

| Section | Description |
|---|---|
| **Home** | Full-viewport hero with the interactive canvas wordmark, a cycling scramble headline of focus areas, quick facts, and a portrait with responsive `srcset`. |
| **About** | Background and current specialization (Computer Science Engineering, AI & ML), presented as a compact editorial card. |
| **Process** | "How I Actually Solve Problems and Create Solutions" — a five-step numbered method from understanding the problem to evaluating and improving. |
| **Projects** | Horizontal rail of selected work (machine learning and web projects). Each card opens a lazy-loaded modal with build notes, features, metrics, and stack details. |
| **Skills** | Five fixed categories — Languages, AI/ML, Generative AI, Web Development, Database & Tools. |
| **Resume** | Navbar link that opens `public/resume.pdf` in a new tab for viewing, printing, or downloading. |
| **Contact** | "Let's Build" closing section with the collaboration form and a direct email fallback. |

---

## Project Structure

```
PortfolioA/
├── api/
│   ├── contact.js            # POST /api/contact — validation, rate limiting,
│   │                         #   sanitization, Resend delivery (serverless)
│   └── contact.d.ts
├── public/
│   ├── assets/               # OG image + responsive portrait WebP set
│   ├── fonts/                # Self-hosted WOFF2 (Inter var, Bebas Neue)
│   ├── favicon.svg
│   ├── resume.pdf            # Resume served at /resume.pdf
│   └── robots.txt
├── scripts/
│   └── build-images.mjs      # sharp pipeline generating portrait assets
├── src/
│   ├── components/
│   │   ├── Navbar.tsx        # Sticky nav, scroll-spy, indicator, mobile drawer
│   │   ├── Hero.tsx          # Hero section (wordmark, headline, portrait)
│   │   ├── TechText.tsx      # Canvas wordmark renderer
│   │   ├── ScrambleHeadline.tsx # Cycle-random scramble hero phrases
│   │   ├── About.tsx / ProcessSection.tsx / Projects.tsx / Skills.tsx
│   │   ├── ProjectCard.tsx / ProjectModal.tsx / Poster.tsx / Rail.tsx
│   │   ├── Collaboration.tsx # Closing contact section
│   │   ├── ContactForm.tsx   # Validated form posting to /api/contact
│   │   ├── CustomCursor.tsx  # Desktop custom cursor
│   │   ├── fx.tsx            # Shared animation primitives (easing, magnetic)
│   │   └── Scene.tsx         # Plain page-section wrapper
│   ├── data/
│   │   └── portfolio.ts      # Single source of truth for all site content
│   ├── hooks/
│   │   ├── smoothScroll.tsx  # Lenis provider, scrollTo API, scroll lock
│   │   └── useMedia.ts       # Pointer / reduced-motion media-query hooks
│   ├── App.tsx               # Page assembly, deep links, lazy modal
│   ├── index.css             # Tailwind v4 tokens and global styles
│   └── main.tsx              # Entry point
├── index.html                # Meta tags, font preloads, root mount
├── vite.config.ts            # Dev/preview mounting of /api/contact + env wiring
├── tsconfig.json / tsconfig.app.json / tsconfig.node.json
├── package.json
└── .env.example
```

**Key directories**

- `src/data/` — every visible fact on the site lives here; edit this file to update content without touching components.
- `api/` — the serverless contact handler; deployed as-is on Vercel and mirrored by the Vite dev server locally.
- `public/` — static assets served at the site root, including the resume PDF.
- `src/components/` — one component per section or interaction, composed in `App.tsx`.

---

## Installation and Local Setup

### Prerequisites

- **Node.js** 18 or newer (LTS recommended) — required by Vite 6
- **npm** (bundled with Node.js)
- A Resend account + API key *only if you want the contact form to deliver email* (see [Environment Variables](#environment-variables))

### Setup

```bash
# 1. Clone the repository
git clone <your-repository-url> jeel-patel-portfolio
cd jeel-patel-portfolio

# 2. Install dependencies
npm install

# 3. Start the development server (http://localhost:5173)
npm run dev
```

The Vite dev server also mounts `api/contact.js` at `/api/contact`, so the contact form flows through the real serverless handler locally — even with no configuration it responds correctly (a proper failure state, never a fake success).

### Other scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Vite dev server with HMR and the local contact API |
| `npm run build` | Type-check (`tsc -b`) then production build into `dist/` |
| `npm run preview` | Serve the production build locally (includes the contact API) |
| `npm run images` | Regenerate the optimized portrait assets with sharp — requires the source photos (`pic1.jpeg`, `pic.png`) in the project root |

---

## Environment Variables

The contact endpoint needs three **server-side** variables. They are read inside `api/contact.js` from the server process — never sent to the browser, and never prefixed with `VITE_`.

| Variable | Purpose | Notes |
|---|---|---|
| `RESEND_API_KEY` | Authenticates the Resend delivery request | Required for actual email delivery. Without it, a valid submission correctly fails instead of pretending to succeed. |
| `CONTACT_FROM` | `From` header identity, e.g. `Portfolio Contact <hello@your-domain.com>` | The sender domain must be verified in Resend. `onboarding@resend.dev` works for quick tests but only delivers to your own address. |
| `CONTACT_TO` | Recipient inbox for contact-form messages | Optional; defaults to `jeelpatel611@gmail.com`. |

**Local:** copy the example file, fill in the values, and restart the dev/preview server (Vite loads `.env` only at startup):

```bash
cp .env.example .env
```

**Deployment (Vercel):** add the same three variables under *Project → Settings → Environment Variables*, then redeploy. The `api/` directory is auto-detected as a serverless function — no extra configuration is required.

Secrets are never cached in the repository; `.env` is gitignored and only `.env.example` is tracked.

---

## Contact

- **Email:** [jeelpatel611@gmail.com](mailto:jeelpatel611@gmail.com)
- **Location:** India
- **Open to:** project collaborations, hackathons, internships

GitHub and LinkedIn links can be wired up in `src/data/portfolio.ts` (`profile.links`) — the contact section renders them automatically once they are set.

---

## Future Improvements

Planned / possible enhancements (not yet implemented):

- **Repository and live-demo links for each project** — the data model already supports `github` and `demo` fields per project; they are waiting to be filled as projects ship.
- **Real project screenshots** — the preview slot renders an intentional placeholder today; add real captures via the `preview` field.
- **GitHub / LinkedIn links** in the contact section (currently unset in the data file).
- **Automated tests and CI** — headless end-to-end checks for navigation and the contact flow, run on push.
- **Theme variants** — the palette is fixed by design; a dark/light toggle is a possible future addition.

---

*Content note: all copy, projects, skills, and process steps on the site are maintained in `src/data/portfolio.ts`.*
