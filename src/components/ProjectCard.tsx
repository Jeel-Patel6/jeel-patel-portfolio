import { motion } from 'framer-motion';
import type { Project } from '../data/portfolio';
import { useMedia } from '../hooks/useMedia';
import { EASE, Tilt } from './fx';
import { ProjectArt } from './Poster';

/**
 * Project card.
 * - Image area: fixed 16/10 aspect ratio on every breakpoint. A real screenshot
 *   (`project.preview`) is shown when configured; otherwise an intentional
 *   art-directed "Project Preview" placeholder fills the slot.
 * - The card body is NOT clickable — the preview area opens the details modal,
 *   and the GitHub / Live Demo links are real anchors in the body.
 */
export default function ProjectCard({ project, index, onOpen }: { project: Project; index: number; onOpen: () => void }) {
  // Mirrors ProjectModal: the card→modal morph only runs where it is affordable.
  const morph = useMedia('(min-width: 768px) and (hover: hover) and (pointer: fine)');
  return (
    <motion.article
      className="w-full shrink-0 snap-start sm:w-[52vw] sm:max-w-[420px] lg:w-[400px] xl:w-[440px]"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px -10% 0px 0px' }}
      transition={{ duration: 0.9, delay: Math.min(index, 3) * 0.06, ease: EASE }}
    >
      <Tilt max={3} className="group h-full rounded-2xl" glare={false}>
        <div className="flex h-full flex-col overflow-hidden rounded-2xl bg-white ring-1 ring-line transition duration-500 group-hover:shadow-[0_24px_60px_-30px_rgba(0,0,0,0.3)] group-hover:ring-blue/40">
          {/* ── preview: dedicated 16/10 image area ───────────────────────── */}
          <button
            type="button"
            data-cursor="view"
            onClick={onOpen}
            aria-label={`Open ${project.title} details`}
            className="relative block aspect-[16/10] w-full overflow-hidden active:opacity-90"
          >
            <motion.div layoutId={morph ? `art-${project.id}` : undefined} className="absolute inset-0 overflow-hidden">
              <div className="absolute inset-0 transition-transform duration-[1.2s] ease-[var(--ease-cine)] group-hover:scale-[1.05]">
                {project.preview ? (
                  <img
                    src={project.preview}
                    alt={`${project.title} screenshot`}
                    width={1600}
                    height={1000}
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 h-full w-full object-cover"
                  />

                ) : (
                  <ProjectArt project={project} />
                )}
              </div>
            </motion.div>
            <span className="absolute left-4 top-4 flex items-center gap-2">
              <span aria-hidden className="h-1.5 w-4 bg-green" />
              <span className="text-[10px] font-bold tracking-[0.3em] text-mute">PROJECT</span>
            </span>
            <span className="absolute right-4 top-4 rounded border border-line bg-white px-1.5 py-px text-[11px] font-bold text-ink">{project.year}</span>
          </button>

          {/* ── body ──────────────────────────────────────────────────────── */}
          <div className="flex flex-1 flex-col p-5 sm:p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-blue">{project.type}</p>
            <motion.h3 className="mt-2 font-display text-[clamp(1.9rem,3.4vw,2.7rem)] leading-[0.9] tracking-wide text-ink">
              {project.title}
            </motion.h3>
            <p className="mt-2.5 text-[15px] leading-relaxed text-slate">{project.logline}</p>

            <div className="mt-3.5 flex flex-wrap gap-1.5">
              {project.stack.map((t) => (
                <span key={t} className="rounded-full bg-surface px-2.5 py-1 text-xs font-medium text-slate ring-1 ring-line">
                  {t}
                </span>
              ))}
            </div>

            <div className="mt-auto flex flex-wrap items-center gap-2.5 pt-5">
              <button
                type="button"
                data-cursor="view"
                onClick={onOpen}
                className="flex min-h-11 items-center gap-2 rounded-md bg-blue px-4 text-sm font-bold text-white transition hover:bg-ink-solid active:bg-ink-solid"
              >
                ▶ Details
              </button>
              {project.github ? (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noreferrer"
                  data-cursor="link"
                  className="flex min-h-11 items-center gap-2 rounded-md border border-line px-4 text-sm font-semibold text-ink transition hover:border-blue hover:text-blue active:border-blue active:text-blue"
                >
                  GitHub ↗
                </a>
              ) : (
                <span
                  title="Add the repository URL in src/data/portfolio.ts"
                  className="flex min-h-11 cursor-help items-center gap-2 rounded-md border border-dashed border-line px-4 text-sm text-mute"
                >
                  GitHub · link pending
                </span>
              )}
              {project.demo && (
                <a
                  href={project.demo}
                  target="_blank"
                  rel="noreferrer"
                  data-cursor="link"
                  className="flex min-h-11 items-center gap-2 rounded-md border border-line px-4 text-sm font-semibold text-ink transition hover:border-blue hover:text-blue active:border-blue active:text-blue"
                >
                  Live Demo ↗
                </a>
              )}
            </div>
          </div>
        </div>
      </Tilt>
    </motion.article>
  );
}
