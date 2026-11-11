
import { motion } from 'framer-motion';
import { profile, projects } from '../data/portfolio';
import { useSmoothScroll } from '../hooks/smoothScroll';
import { EASE, Magnetic } from './fx';
import ScrambleHeadline from './ScrambleHeadline';
import TechText from './TechText';

const container = { hidden: {}, show: { transition: { staggerChildren: 0.09, delayChildren: 0.25 } } };
const item = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: EASE } },
};

export default function Hero() {
  const { scrollTo } = useSmoothScroll();

  const meta = ['Computer Science Engineering', 'AI & ML Specialization', `${projects.length} Projects`];

  return (
    <section id="top" className="relative flex min-h-[100svh] items-center overflow-hidden bg-night text-chalk">
      <motion.div
        className="gutter relative z-[1] flex w-full flex-col items-center justify-center pb-14 pt-28"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {/* ── Oversized interactive wordmark (TechText canvas) ─────────────── */}
        {/* The h1 gives the wordmark its document role; TechText itself renders
            role="img" with the text as its accessible name. Height is explicit
            (measured Bebas em-width ≈ 2.78em for "JEEL PATEL") and only the
            middle 66% of the canvas can hold ink, per the internal fit rule —
            so this ratio is what actually sizes the letters. */}
        <motion.h1
          variants={item}
          className="w-full"
          style={{ height: 'clamp(6rem, min(30vw, 44svh), 30rem)' }}
        >
          <TechText
            text={profile.fullName.toUpperCase()}
            fontFamily="'Bebas Neue', 'Oswald', Impact, sans-serif"
            fontWeight={800}
            fontSize={600}
            color="#FAFAF8"
            accentColor="#00FF9C"
            align="center"
            reveal="letter"
            intro="none"
            guides={false}
            clickKick={true}
            selection={true}
            labels={false}
            draggable={false}
            letterSpacing={0}
          />
        </motion.h1>

        {/* ── Role subtitle — clearly visible, subordinate to the wordmark ── */}
        {/* Pulled up into the canvas's transparent bottom padding so the visual
            gap stays consistent across viewport sizes (≈ 9% of canvas height). */}
        <motion.p
          variants={item}
          className="text-center font-sans text-[clamp(1.25rem,2vw,1.75rem)] font-semibold tracking-[0.06em] text-chalk"
          style={{ marginTop: 'calc(min(30vw, 44svh) * -0.06)' }}
        >
          Full Stack AI Architect
        </motion.p>

        {/* Intro + meta (left) ↔ massive focus-area headline (right, dominant) */}
        <motion.div
          variants={item}
          className="mt-10 grid w-full items-center gap-8 text-left sm:gap-10 lg:mt-14 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] lg:gap-12 xl:gap-16"
        >
          <div className="flex flex-col items-start">
            <motion.div variants={item} className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm font-medium text-fog">
              <span className="rounded border border-coal-line px-1.5 py-px text-[11px] font-bold tracking-wider text-chalk">AI·ML</span>
              {meta.map((m, i) => (
                <span key={m} className="flex items-center gap-3">
                  {i > 0 && <span className="h-1 w-1 rounded-full bg-coal-line" />}
                  {m}
                </span>
              ))}
            </motion.div>

            {/* Static (not part of the staggered entrance): this paragraph is the
                mobile LCP element, so fading it in from opacity 0 delayed paint. */}
            <p className="mt-4 max-w-xl text-base leading-relaxed text-fog sm:text-[17px]">{profile.intro}</p>

            <motion.div variants={item} className="mt-6 flex flex-wrap items-center gap-3">
              <Magnetic>
                <button
                  type="button"
                  onClick={() => scrollTo('#projects')}
                  className="flex min-h-12 items-center gap-3 rounded-md bg-blue px-6 py-3 text-base font-bold text-white transition hover:bg-chalk hover:text-night sm:px-8"
                >
                  <span className="text-lg leading-none">＋</span> My Work
                </button>
              </Magnetic>
            </motion.div>
          </div>

          <div className="flex flex-col items-start lg:border-l lg:border-coal-line lg:pl-10 xl:pl-14">
            <div className="ml-7 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.32em] text-green">
              <span aria-hidden className="h-px w-8 bg-green" />
              Areas of Focus
            </div>
            <ScrambleHeadline />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
