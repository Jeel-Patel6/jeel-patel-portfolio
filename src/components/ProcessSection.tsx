import { motion } from 'framer-motion';
import { processSteps } from '../data/portfolio';
import { EASE, SectionHeading } from './fx';

/**
 * "How I Actually Solve Problems and Create Solutions" — a working-method section
 * instead of a timeline. Numbered editorial rows keep the focus on the method,
 * not on individual projects. Purely typographic, no decorative graphics.
 */
export default function ProcessSection() {
  return (
    <>
      <SectionHeading
        kicker="Process"
        title="How I Actually Solve Problems and Create Solutions"
        aside={
          <p className="max-w-sm text-[15px] leading-relaxed text-mute">
            The way I work — the same loop behind every project on this page.
          </p>
        }
      />

      <ol className="gutter border-t border-line">
        {processSteps.map((s, i) => (
          <motion.li
            key={s.step}
            className="group grid grid-cols-1 gap-4 border-b border-line py-5 sm:py-7 sm:grid-cols-[minmax(0,7rem)_minmax(0,1fr)_minmax(0,2fr)] sm:items-start sm:gap-10"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-8% 0px' }}
            transition={{ duration: 0.7, delay: 0, ease: EASE }}
          >
            <span
              aria-hidden
              className="step-num font-display leading-[0.8] transition duration-500 group-hover:[-webkit-text-stroke-color:rgba(27,27,255,0.7)]"
              style={{ fontSize: 'clamp(3.5rem, 7.5vw, 6rem)' }}
            >
              {s.step}
            </span>

            <h3 className="break-words font-display text-4xl leading-none tracking-wide text-ink sm:pt-2 lg:text-5xl">{s.title}</h3>

            <p className="text-base leading-relaxed text-slate sm:pt-2 sm:text-[17px]">{s.body}</p>

            <span className="sr-only">{`Step ${i + 1} of ${processSteps.length}`}</span>
          </motion.li>
        ))}
      </ol>
    </>
  );
}
