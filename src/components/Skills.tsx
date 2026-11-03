import { motion } from 'framer-motion';
import { skillCategories, type SkillCategory } from '../data/portfolio';
import { EASE, SectionHeading } from './fx';

/**
 * Five fixed skill categories, each a compact titled block — informational only.
 * Hovering a skill is purely visual (subtle background/ink tint); no tooltips,
 * project names, or linked-project counts.
 */
export default function Skills() {
  return (
    <>
      <SectionHeading
        kicker="Skills"
        title="Skills, Applied"
        aside={
          <p className="max-w-sm text-[15px] leading-relaxed text-mute">
            Languages, AI/ML, generative AI, web development, and databases &amp; tools I work with.
          </p>
        }
      />

      <div className="gutter grid grid-cols-1 gap-4 min-[360px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {skillCategories.map((cat, i) => (
          <CategoryBlock key={cat.id} category={cat} index={i} />
        ))}
      </div>
    </>
  );
}

function CategoryBlock({ category, index }: { category: SkillCategory; index: number }) {
  return (
    <motion.div
      className="flex min-w-0 flex-col rounded-2xl bg-white p-4 ring-1 ring-line transition duration-500 hover:ring-blue/40 min-[360px]:p-5"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-8% 0px' }}
      transition={{ duration: 0.7, delay: Math.min(index, 4) * 0.07, ease: EASE }}
    >
      <header className="min-w-0">
        <span aria-hidden className="h-px w-6 bg-green" />
        <h3 className="mt-2 break-words font-display text-2xl leading-[1.05] tracking-wide text-ink min-[360px]:text-[1.75rem] sm:text-3xl sm:leading-none">
          {category.title}
        </h3>
      </header>

      {/* Rows flex-1 so every card's list fills the full card height — uneven
          categories (2 vs 4 skills) distribute the space as even row spacing
          instead of dead space at the bottom of short cards. */}
      <ul className="mt-3 flex min-w-0 flex-1 flex-col border-t border-line pt-1">
        {category.skills.map((s) => (
          <li key={s.name} className="group flex min-w-0 flex-1 items-center gap-3 rounded-lg px-1 py-2 transition-colors duration-300 hover:bg-surface">
            <span
              aria-hidden
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md font-display text-base tracking-wide text-slate ring-1 ring-line transition duration-300 group-hover:text-blue group-hover:ring-blue/50"
            >
              {s.mono}
            </span>
            <span className="min-w-0 break-words text-[15px] leading-snug text-slate transition-colors duration-300 group-hover:text-ink">
              {s.name}
            </span>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}
