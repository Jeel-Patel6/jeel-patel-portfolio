import { useRef } from 'react';
import { projects, profile, type Project } from '../data/portfolio';
import { SectionHeading } from './fx';
import { RailButtons } from './Rail';
import ProjectCard from './ProjectCard';

/**
 * PROJECTS — a native horizontal scroll rail. The section itself never pins,
 * traps the wheel, or hijacks vertical scrolling: the page keeps scrolling
 * normally while the rail only scrolls sideways (mouse drag, shift+wheel,
 * trackpad, touch swipe, or the arrow controls).
 */
export default function Projects({ onOpen }: { onOpen: (p: Project) => void }) {
  const rail = useRef<HTMLDivElement>(null);

  return (
    <>
      <SectionHeading
        kicker="Projects"
        title="Selected Work"
        aside={
          <p className="max-w-sm text-[15px] leading-relaxed text-mute">
            Machine learning, safety systems, and academic tools — preview a card for details, or use the repo &amp; demo links.
          </p>
        }
      />

      <div className="group/rail relative">
        <div
          ref={rail}
          className="rail gutter flex flex-col gap-5 py-2 sm:snap-x sm:snap-mandatory sm:flex-row sm:gap-5 sm:overflow-x-auto"
          aria-label="Project list"
        >
          {projects.map((p, i) => (
            <ProjectCard key={p.id} project={p} index={i} onOpen={() => onOpen(p)} />
          ))}
          <Outro />
        </div>
        <RailButtons rail={rail} />
      </div>

      <p className="gutter mt-3 hidden text-xs tracking-[0.2em] text-mute sm:block">DRAG, SWIPE, OR USE THE ARROWS — THE PAGE STILL SCROLLS DOWN NORMALLY</p>
    </>
  );
}

function Outro() {
  const hasGithub = Boolean(profile.links.github);
  return hasGithub ? (
    <a
      href={profile.links.github}
      target="_blank"
      rel="noreferrer"
      data-cursor="link"
      className="group flex aspect-[16/10] w-full shrink-0 snap-start flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-line bg-white text-center transition hover:border-blue hover:text-blue sm:w-[52vw] sm:max-w-[420px] lg:w-[400px] xl:w-[440px]"
    >
      <span className="flex h-16 w-16 items-center justify-center rounded-full border border-line text-2xl text-ink transition group-hover:scale-110 group-hover:border-blue group-hover:text-blue">↗</span>
      <span className="font-display text-3xl tracking-wide text-ink">More on GitHub</span>
      <span className="text-[13px] text-mute">View Repositories</span>
    </a>
  ) : (
    <div
      className="flex aspect-[16/10] w-full shrink-0 snap-start flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-line bg-white p-6 text-center sm:w-[52vw] sm:max-w-[420px] lg:w-[400px] xl:w-[440px]"
      aria-hidden
    >
      <span className="flex h-16 w-16 items-center justify-center rounded-full border border-line text-2xl text-blue">✦</span>
      <span className="font-display text-3xl tracking-wide text-ink">Open to Collaborate</span>
      <p className="max-w-[260px] text-[13px] leading-relaxed text-mute">
        Interested in teaming up for projects, research, and hackathons — say hello at the end of the page.
      </p>
    </div>
  );
}
