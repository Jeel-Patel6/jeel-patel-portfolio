import { motion } from 'framer-motion';
import { education, profile } from '../data/portfolio';
import { EASE, SectionHeading } from './fx';

export default function About() {
  const facts = [
    { k: 'Field', v: 'Computer Science Engineering', s: education[0].degree },
    { k: 'Specialization', v: 'Artificial Intelligence & ML', s: 'Neural networks & intelligent systems' },
    { k: 'Focus', v: 'Hands-on Projects', s: 'Open to hackathons & collaborations' },
  ];

  return (
    <>
      <SectionHeading
        kicker="Profile"
        title="About Me"
        aside={
          <p className="max-w-sm text-[17px] leading-relaxed text-mute sm:text-[19px]">The short version before the projects.</p>
        }
      />

      {/* Both columns stretch to the same height; content inside each card is
          distributed (top label, bottom meta / supporting text) so the cards
          read as full blocks instead of content floating at the top. */}
      <div className="gutter grid items-stretch gap-5 xl:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] xl:gap-8">
        <div className="flex flex-col gap-5">
          {/* Current education — the primary card of the section */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: EASE }}
            className="flex flex-1 flex-col justify-between rounded-2xl bg-white p-6 ring-1 ring-line sm:p-8"
          >
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.22em] text-mute">Currently</p>
              <p
                className="mt-3 font-display leading-[0.95] tracking-wide text-ink"
                style={{ fontSize: 'clamp(2rem, 2.6vw, 2.75rem)' }}
              >
                {education[0].school}
              </p>
            </div>
            <div className="mt-6 border-t border-line pt-5">
              <p className="text-lg font-semibold text-slate sm:text-xl">{education[0].place}</p>
              <p className="mt-1.5 text-base text-mute sm:text-[17px]">
                {education[0].period} · Based in {profile.location}
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.08, ease: EASE }}
          >
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.22em] text-mute">Interests</p>
            <div className="flex flex-wrap gap-2">
              {profile.interests.map((i) => (
                <span key={i} className="glass rounded-full px-4 py-2 text-sm font-medium text-ink">
                  {i}
                </span>
              ))}
            </div>
          </motion.div>
        </div>

        <motion.dl
          className="grid gap-px overflow-hidden rounded-2xl bg-line ring-1 ring-line sm:grid-cols-3"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          transition={{ staggerChildren: 0.08 }}
        >
          {facts.map((f) => (
            <motion.div
              key={f.k}
              className="flex h-full min-w-0 flex-col bg-white p-6 sm:p-7 lg:p-6 xl:p-7"
              variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } } }}
            >
              <dt className="min-w-0 break-words text-sm font-bold uppercase tracking-[0.22em] text-mute">{f.k}</dt>
              <dd
                className="mt-3 font-semibold leading-snug text-ink"
                style={{ fontSize: 'clamp(1.25rem, 1.6vw, 1.5rem)' }}
              >
                {f.v}
              </dd>
              {/* mt-auto pins the supporting line to the card bottom — this is
                  what removes the empty area that used to sit beneath the text */}
              <dd
                className="mt-auto pt-6 leading-relaxed text-mute"
                style={{ fontSize: 'clamp(1rem, 1.1vw, 1.125rem)' }}
              >
                {f.s}
              </dd>
            </motion.div>
          ))}
        </motion.dl>
      </div>
    </>
  );
}
