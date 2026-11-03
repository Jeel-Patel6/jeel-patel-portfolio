import { type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { profile } from '../data/portfolio';
import { useSmoothScroll } from '../hooks/smoothScroll';
import { EASE, Magnetic } from './fx';
import ContactForm from './ContactForm';

/**
 * COLLABORATION — the closing section.
 * The contact form posts to /api/contact; direct links come from
 * src/data/portfolio.ts and are hidden when unset.
 */
export default function Collaboration() {
  const { scrollTo } = useSmoothScroll();

  return (
    <section id="contact" className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-4 py-16 text-center sm:py-20">
      <motion.p
        className="relative mb-6 text-xs font-bold uppercase tracking-[0.5em] text-blue"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        Collaboration
      </motion.p>

      <motion.h2
        className="relative font-display leading-[0.85] tracking-[0.04em] text-ink"
        style={{ fontSize: 'clamp(3.2rem, 11vw, 10rem)' }}
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-10% 0px' }}
        transition={{ duration: 1, ease: EASE }}
      >
        LET&apos;S BUILD SOMETHING
      </motion.h2>

      <motion.div
        className="relative mt-8"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-10% 0px' }}
        transition={{ duration: 0.9, ease: EASE, delay: 0.2 }}
      >
        <p className="font-display text-3xl tracking-[0.14em] text-ink sm:text-4xl">{profile.displayName.toUpperCase()}</p>
        <p className="mt-2 text-[13px] font-semibold tracking-[0.4em] text-mute sm:text-sm">{profile.role.toUpperCase()}</p>
      </motion.div>

      <motion.div
        className="relative mt-10 w-full max-w-3xl"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: EASE, delay: 0.3 }}
      >
        <div className="rounded-2xl bg-white p-6 text-left ring-1 ring-line sm:p-9">
          {/* green accent line — small decorative detail */}
          <span aria-hidden className="mb-6 block h-px w-16 bg-green" />

          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex min-h-9 items-center gap-2 rounded-full border border-line bg-white px-4 text-xs font-semibold tracking-wider text-ink">
              <span className="h-1.5 w-1.5 rounded-full bg-green" aria-hidden /> Available for Project Collaboration
            </span>
          </div>

          <p className="mt-5 text-base leading-relaxed text-slate">
            Open to collaborating on intelligent systems, neural networks, practical machine learning projects, and hackathons. If you&apos;re a recruiter, developer, or someone with an interesting technical problem — let&apos;s talk.
          </p>

          <ContactForm />

          <ActionRow />
        </div>
      </motion.div>

      <div className="relative mt-10 flex flex-wrap justify-center gap-6 text-[13px] font-semibold tracking-[0.24em] text-mute">
        <button
          type="button"
          onClick={() => scrollTo(0, { offset: 0 })}
          className="inline-flex min-h-11 items-center px-2 transition hover:text-blue"
        >
          ↺ BACK TO TOP
        </button>
      </div>

      <footer className="relative mt-8 w-full px-2 text-center sm:absolute sm:inset-x-0 sm:bottom-0 sm:mt-0 sm:px-4 sm:pb-[max(1.5rem,env(safe-area-inset-bottom))]">
        <p className="text-xs leading-relaxed text-mute">
          © {new Date().getFullYear()} {profile.displayName}. AI/ML Student &amp; Developer portfolio.
        </p>
      </footer>
    </section>
  );
}

function ActionRow() {
  const hasLinks = Boolean(profile.email || profile.links.linkedin || profile.links.github);
  if (!hasLinks) return null;

  const links: ReactNode = (
    <div className="mt-8 flex flex-wrap gap-3 border-t border-line pt-8">
      {profile.email && (
        <Magnetic>
          <a
            href={`mailto:${profile.email}`}
            className="flex min-h-11 items-center gap-2 rounded-full bg-blue px-6 text-xs font-bold tracking-[0.14em] text-white transition hover:bg-ink-solid"
          >
            EMAIL ↗
          </a>
        </Magnetic>
      )}
      {profile.links.linkedin && (
        <Magnetic>
          <a
            href={profile.links.linkedin}
            target="_blank"
            rel="noreferrer"
            className="flex min-h-11 items-center gap-2 rounded-full border border-line px-6 text-xs font-bold tracking-[0.14em] text-ink transition hover:border-blue hover:text-blue"
          >
            LINKEDIN ↗
          </a>
        </Magnetic>
      )}
      {profile.links.github && (
        <Magnetic>
          <a
            href={profile.links.github}
            target="_blank"
            rel="noreferrer"
            className="flex min-h-11 items-center gap-2 rounded-full border border-line px-6 text-xs font-bold tracking-[0.14em] text-ink transition hover:border-blue hover:text-blue"
          >
            GITHUB ↗
          </a>
        </Magnetic>
      )}
    </div>
  );
  return links;
}
