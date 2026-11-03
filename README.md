# Jeel Patel – Personal Portfolio

A fast, single-page developer portfolio for **Jeel Patel**, Full Stack AI Architect.

The portfolio presents selected projects, technical skills, a problem-solving process, and a direct way to get in touch. It is built as a React application with a serverless contact endpoint.

---

## About the Project

This portfolio is more than a list of technologies: it is a structured walkthrough of how I identify a problem, design an approach, build a solution, and evaluate the result.

The site is content-driven. Information such as the introduction, education, projects, skills, process steps, and contact details is maintained in a central data file so the presentation stays consistent.

The project highlights:

- **Technical skills** across programming languages, AI/ML, generative AI, web development, and databases/tools.
- **Projects** involving machine learning and web application development.
- **Problem-solving approach** through a dedicated five-step process.
- **Professional journey**, background, specialization, and current focus.
- **Contact and resume access** through a contact form and an in-browser resume link.

---

## Features

- Sticky top navigation with scroll-aware active state, a sliding underline indicator, deep-link restoration, and a mobile drawer menu.
- Resume link that opens `resume.pdf` in a new browser tab.
- Smooth scrolling with Lenis on supported pointer devices, while touch devices and reduced-motion users use native behavior.
- Interactive canvas-based hero wordmark (TechText) with a letter-reveal intro and click feedback.
- Animated hero headline with character-by-character text scrambling.
- Desktop custom cursor and magnetic hover effects.
- Horizontally scrollable projects rail with drag, trackpad, touch, and arrow controls.
- Project detail modal with lazy loading, keyboard dismissal, focus management, and scroll locking.
- Responsive layouts for mobile, desktop, and ultrawide screens.
- Reduced-motion support and pointer-based gating for desktop-only effects.
- Contact form that submits to `/api/contact` for server-side validation and email delivery through the Resend API.
- SEO and social metadata, including Open Graph and Twitter cards, semantic HTML, `robots.txt`, and a skip-to-content link.
- Optimized asset pipeline with self-hosted WOFF2 fonts and responsive WebP imagery.

---

## Tech Stack

| Category | Technology |
|---|---|
| Core | React 18, TypeScript 5.8 |
| Build tooling | Vite 6, `@vitejs/plugin-react`, TypeScript project references |
| Styling | Tailwind CSS 4, custom CSS design tokens |
| Animation and interaction | Framer Motion 11, Lenis 1.1 |
| Contact backend | Node.js serverless function, Resend HTTPS API, Vercel |
| Media pipeline | `sharp`, self-hosted Inter and Bebas Neue fonts |
| State and content | Typed TypeScript data in `src/data/portfolio.ts` |

---

## Portfolio Sections

| Section | Description |
|---|---|
| **Home** | Hero section with the interactive wordmark, animated headline, quick facts, and portrait. |
| **About** | Background and current specialization in Computer Science Engineering, AI, and ML. |
| **Process** | “How I Actually Solve Problems and Create Solutions” — a five-step approach from understanding a problem to evaluating and improving the solution. |
| **Projects** | Selected machine learning and web projects, with detail views for build notes, features, metrics, and technology stack. |
| **Skills** | Skills organized into Languages, AI/ML, Generative AI, Web Development, and Database & Tools. |
| **Resume** | Navigation link to `public/resume.pdf`, which opens in a new tab. |
| **Contact** | Collaboration section with the contact form and a direct email option. |

---

## Project Structure

```text
PortfolioA/
├── api/
│   ├── contact.js                 # Contact API: validation, rate limiting,
│   │                              # sanitization, and Resend delivery
│   └── contact.d.ts
├── public/
│   ├── assets/                    # Social image and responsive portrait images
│   ├── fonts/                     # Self-hosted WOFF2 fonts
│   ├── favicon.svg
│   ├── resume.pdf                 # Resume served at /resume.pdf
│   └── robots.txt
├── scripts/
│   └── build-images.mjs           # Image optimization script
├── src/
│   ├── components/
│   │   ├── Navbar.tsx
│   │   ├── Hero.tsx
│   │   ├── TechText.tsx
│   │   ├── ScrambleHeadline.tsx
│   │   ├── About.tsx
│   │   ├── ProcessSection.tsx
│   │   ├── Projects.tsx
│   │   ├── Skills.tsx
│   │   ├── ProjectCard.tsx
│   │   ├── ProjectModal.tsx
│   │   ├── Poster.tsx
│   │   ├── Rail.tsx
│   │   ├── Collaboration.tsx
│   │   ├── ContactForm.tsx
│   │   ├── CustomCursor.tsx
│   │   ├── fx.tsx
│   │   └── Scene.tsx
│   ├── data/
│   │   └── portfolio.ts           # Central source for portfolio content
│   ├── hooks/
│   │   ├── smoothScroll.tsx
│   │   └── useMedia.ts
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
├── index.html
├── vite.config.ts
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── package.json
└── .env.example
```

### Key Directories

- `src/data/` — portfolio content such as profile details, projects, skills, and process steps.
- `src/components/` — page sections and reusable interface components.
- `api/` — serverless contact handler.
- `public/` — static files served from the site root, including fonts, images, and the resume.
- `scripts/` — utility scripts for asset generation.

---

## Installation and Local Setup

### Prerequisites

- Node.js 18 or newer.
- npm (included with Node.js).
- A Resend account and API key if you want the contact form to send real emails.

### Setup

```bash
# Clone the repository
git clone <your-repository-url>
cd jeel-patel-portfolio

# Install dependencies
npm install

# Start the development server
npm run dev
```

The Vite development server is configured to expose the contact endpoint locally. Actual email delivery requires the environment variables described below.

### Available Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Starts the Vite development server with hot module replacement. |
| `npm run build` | Runs the TypeScript build checks and creates the production build in `dist/`. |
| `npm run preview` | Serves the production build locally. |
| `npm run images` | Regenerates optimized portrait assets using `sharp`; requires the source images expected by the script. |

---

## Environment Variables

The contact endpoint uses server-side environment variables. Do not expose these values in client-side code or commit real secrets to Git.

| Variable | Purpose |
|---|---|
| `RESEND_API_KEY` | API key used to authenticate email delivery through Resend. |
| `CONTACT_FROM` | Sender identity for contact-form emails. The sender domain must be verified with Resend. |
| `CONTACT_TO` | Destination inbox for contact-form submissions. If omitted, the endpoint defaults to `jeelpatel611@gmail.com`. |

### Local Configuration

Create a local `.env` file from the example:

```bash
cp .env.example .env
```

Add the required values to `.env`, then restart the development server.

### Vercel Deployment

Add the same environment variables in **Vercel → Project → Settings → Environment Variables**, then redeploy the project.

Keep `.env` out of version control. Only commit `.env.example`, with placeholder values and no secrets.

---

## Contact

- **Email:** [jeelpatel611@gmail.com](mailto:jeelpatel611@gmail.com)
- **Location:** India
- **Open to:** Project collaborations, hackathons, internships, and technical discussions.

Social profile links can be added to the portfolio data in `src/data/portfolio.ts` if they are not already configured.

---

## Possible Future Improvements

The following are potential enhancements, not claims about currently implemented functionality:

- Add GitHub repository and live-demo links for individual projects.
- Replace project preview placeholders with real project screenshots.
- Add GitHub and LinkedIn profile links where appropriate.
- Introduce automated tests and continuous integration checks.
- Consider additional theme variants.

---

*Portfolio content, projects, skills, and process details are maintained in `src/data/portfolio.ts`.*
