import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { projects, type Project } from '../data/portfolio';
import { useScrollLock } from '../hooks/smoothScroll';
import { useMedia } from '../hooks/useMedia';
import { EASE, Magnetic } from './fx';
import { ProjectArt } from './Poster';

// Opacity/translate only — animating a blur filter over long paragraphs is pure
// paint cost and is almost invisible at this speed.
const block = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

/**
 * Modal billboard media: the real screenshot when one is configured (matching
 * the card image so the card→modal morph stays seamless), otherwise the
 * art-directed placeholder. Decorative here — the same screenshot is rendered
 * with full alt text in the Screenshots section below.
 */
function BillboardShot({ src }: { src: string }) {
  return <img src={src} alt="" loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover object-top" />;
}

export default function ProjectModal({ project, onClose, onSwitch }: { project: Project; onClose: () => void; onSwitch: (p: Project) => void }) {
  useScrollLock(true);
  const scroller = useRef<HTMLDivElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);
  // The shared card→modal morph is a nice desktop touch, but on phones it costs
  // a forced layout of the full-height panel right as the modal is closing.
  const morph = useMedia('(min-width: 768px) and (hover: hover) and (pointer: fine)');

  useEffect(() => {
    const prevFocus = document.activeElement as HTMLElement | null;
    closeBtn.current?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      if (e.key !== 'Tab') return;
      const root = scroller.current;
      if (!root) return;
      const focusable = Array.from(
        root.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])',
        ),
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      prevFocus?.focus?.({ preventScroll: true });
    };
  }, [onClose]);

  useEffect(() => {
    scroller.current?.scrollTo({ top: 0 });
  }, [project.id]);

  const more = projects.filter((p) => p.id !== project.id);
  return (
    <motion.div className="fixed inset-0 z-[140]" role="dialog" aria-modal="true" aria-labelledby={`title-${project.id}-modal`}>
      {/* Blur lives on a static layer; the dimming tint fades on its own so the
          backdrop filter is not recomputed on every frame of the transition. */}
      <div className="absolute inset-0 sm:backdrop-blur-md" onClick={onClose}>
        <motion.div
          className="absolute inset-0 bg-black/75"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />
      </div>
      <div ref={scroller} data-lenis-prevent className="absolute inset-0 overflow-y-auto overscroll-contain" onClick={onClose}>
        <motion.div
          className="relative mx-auto min-h-full max-w-5xl bg-white shadow-2xl sm:my-10 sm:min-h-0 sm:rounded-2xl"
          onClick={(e) => e.stopPropagation()}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.22 } }}
        >
          {/* billboard */}
          <div className="relative h-[52vh] min-h-[340px] overflow-hidden sm:rounded-t-2xl">
            {morph ? (
              <motion.div layoutId={`art-${project.id}`} className="absolute inset-0" transition={{ duration: 0.7, ease: EASE }}>
                {project.preview ? <BillboardShot src={project.preview} /> : <ProjectArt project={project} />}
              </motion.div>
            ) : (
              <div className="absolute inset-0">
                {project.preview ? <BillboardShot src={project.preview} /> : <ProjectArt project={project} />}
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-white via-white/40 to-transparent" />
            <button
              ref={closeBtn}
              type="button"
              onClick={onClose}
              data-cursor="close"
              aria-label="Close project"
              className="absolute right-4 top-[max(1rem,env(safe-area-inset-top))] z-10 flex h-11 w-11 items-center justify-center rounded-full bg-ink-solid text-lg text-white backdrop-blur transition hover:bg-blue"
            >
              ✕
            </button>
            <div className="absolute inset-x-0 bottom-0 px-5 pb-6 sm:px-10">
              <motion.p className="mb-2 flex items-center gap-2.5 text-[11px] font-bold tracking-[0.34em] text-slate" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1, duration: 0.4 }}>
                <span aria-hidden className="h-1.5 w-6 bg-green" /> {project.type.toUpperCase()}
              </motion.p>
              <motion.h2
                id={`title-${project.id}-modal`}
                className="break-words font-display text-[clamp(2.4rem,8vw,6rem)] leading-[0.86] tracking-wide text-ink"
                transition={{ duration: 0.7, ease: EASE }}
              >
                {project.title}
              </motion.h2>
            </div>
          </div>

          <motion.div className="px-5 pb-12 sm:px-10" initial="hidden" animate="show" transition={{ staggerChildren: 0.06, delayChildren: 0.12 }}>
            <motion.div variants={block} className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-slate">
              <span className="font-semibold text-blue">{project.year}</span>
              <span aria-hidden className="h-1 w-1 rounded-full bg-line" />
              <span>{project.type}</span>
            </motion.div>

            <motion.p variants={block} className="mt-4 max-w-3xl text-lg leading-relaxed text-ink sm:text-xl">
              {project.logline}
            </motion.p>

            {(project.github || project.demo) && (
              <motion.div variants={block} className="mt-6 flex flex-wrap gap-3">
                {project.github && (
                  <Magnetic>
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noreferrer"
                      data-cursor="link"
                      className="flex min-h-12 items-center gap-2 rounded-md bg-blue px-6 text-[15px] font-bold text-white transition hover:bg-ink-solid"
                    >
                      GitHub ↗
                    </a>
                  </Magnetic>
                )}
                {project.demo && (
                  <Magnetic>
                    <a
                      href={project.demo}
                      target="_blank"
                      rel="noreferrer"
                      data-cursor="link"
                      className="flex min-h-12 items-center gap-2 rounded-md border border-line px-6 text-[15px] font-semibold text-ink transition hover:border-blue hover:text-blue"
                    >
                      Live Demo ↗
                    </a>
                  </Magnetic>
                )}
              </motion.div>
            )}

            {/* technical screenshots — full, uncropped views of the evidence shots */}
            {(project.preview || (project.gallery && project.gallery.length > 0)) && (
              <motion.section variants={block} className="mt-10" aria-label="Project screenshots">
                <h3 className="mb-4 text-[11px] font-bold uppercase tracking-[0.3em] text-blue">Screenshots</h3>
                <div className={`grid items-start gap-4 ${project.gallery && project.gallery.length > 0 ? 'sm:grid-cols-2' : ''}`}>
                  {project.preview && (
                    <figure className="overflow-hidden rounded-xl bg-surface ring-1 ring-line">
                      <img
                        src={project.preview}
                        alt={project.previewAlt ?? `${project.title} screenshot`}
                        loading="lazy"
                        decoding="async"
                        className="h-auto w-full"
                      />
                      {project.previewCaption && (
                        <figcaption className="border-t border-line px-4 py-2.5 text-xs leading-snug text-mute">
                          {project.previewCaption}
                        </figcaption>
                      )}
                    </figure>
                  )}
                  {project.gallery?.map((shot) => (
                    <figure key={shot.src} className="overflow-hidden rounded-xl bg-surface ring-1 ring-line">
                      <img src={shot.src} alt={shot.alt} loading="lazy" decoding="async" className="h-auto w-full" />
                      {shot.caption && (
                        <figcaption className="border-t border-line px-4 py-2.5 text-xs leading-snug text-mute">{shot.caption}</figcaption>
                      )}
                    </figure>
                  ))}
                </div>
              </motion.section>
            )}

            {/* impact */}
            {project.metrics && project.metrics.length > 0 && (
              <motion.section variants={block} className="mt-10">
                <h3 className="mb-4 text-[11px] font-bold uppercase tracking-[0.3em] text-blue">Key Metrics</h3>
                <div className="grid grid-cols-2 gap-px overflow-hidden rounded-xl bg-line ring-1 ring-line sm:grid-cols-3 lg:grid-cols-5">
                  {project.metrics.map((m, i) => (
                    <motion.div
                      key={m.label}
                      className="bg-white p-4 sm:p-5"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.12 + i * 0.05, duration: 0.45, ease: EASE }}
                    >
                      <p className="font-display text-4xl leading-none text-ink sm:text-5xl" style={{ color: i === 0 ? '#1b1bff' : undefined }}>
                        {m.value}
                      </p>
                      <p className="mt-2 text-xs leading-snug text-mute">{m.label}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.section>
            )}

            <div className="mt-10 grid gap-10 lg:grid-cols-[3fr_2fr]">
              <motion.section variants={block}>
                <h3 className="mb-4 text-[11px] font-bold uppercase tracking-[0.3em] text-blue">Project Overview</h3>
                <ul className="space-y-4">
                  {project.build.map((b) => (
                    <li key={b} className="flex gap-3 text-[15px] leading-relaxed text-slate">
                      <span aria-hidden className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue" />
                      {b}
                    </li>
                  ))}
                </ul>
              </motion.section>
              <div className="space-y-10">
                <motion.section variants={block}>
                  <h3 className="mb-4 text-[11px] font-bold uppercase tracking-[0.3em] text-blue">Tech Stack</h3>
                  <div className="flex flex-wrap gap-2">
                    {project.stack.map((t) => (
                      <span key={t} className="rounded-full bg-surface px-3 py-1.5 text-sm font-medium text-ink ring-1 ring-line">
                        {t}
                      </span>
                    ))}
                  </div>
                </motion.section>
                <motion.section variants={block}>
                  <h3 className="mb-4 text-[11px] font-bold uppercase tracking-[0.3em] text-blue">Key Features</h3>
                  <ul className="space-y-2.5">
                    {project.features.map((f) => (
                      <li key={f} className="flex items-start gap-3 text-sm text-slate">
                        <span aria-hidden className="text-blue">✓</span>
                        {f}
                      </li>
                    ))}
                  </ul>
                </motion.section>
              </div>
            </div>

            {/* more like this */}
            <motion.section variants={block} className="mt-10 border-t border-line pt-8">
              <h3 className="mb-4 font-sans text-lg font-semibold text-ink">More Projects</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                {more.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    data-cursor="view"
                    onClick={() => onSwitch(p)}
                    className="group relative aspect-video overflow-hidden rounded-xl text-left ring-1 ring-line transition hover:ring-blue/40"
                  >
                    <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-110">
                      <ProjectArt project={p} />
                    </div>
                    <div className="absolute inset-x-0 bottom-0 p-4">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-mute">{p.type}</p>
                      <p className="font-display text-3xl leading-none tracking-wide text-ink">{p.title}</p>
                    </div>
                  </button>
                ))}
              </div>
            </motion.section>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}
