import { lazy, Suspense, useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { AnimatePresence, MotionConfig } from 'framer-motion';
import { sectionOrder, type Project, type SectionId } from './data/portfolio';
import { SmoothScrollProvider, useSmoothScroll } from './hooks/smoothScroll';
import CustomCursor from './components/CustomCursor';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Scene from './components/Scene';
import About from './components/About';
import ProcessSection from './components/ProcessSection';
import Projects from './components/Projects';
import Skills from './components/Skills';
import Collaboration from './components/Collaboration';

// Overlay is only loaded on demand
const ProjectModal = lazy(() => import('./components/ProjectModal'));

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <SmoothScrollProvider>
        <Portfolio />
      </SmoothScrollProvider>
    </MotionConfig>
  );
}

function Portfolio() {
  const { scrollTo } = useSmoothScroll();
  const [project, setProject] = useState<Project | null>(null);
  const closeProject = useCallback(() => setProject(null), []);

  // Warm the lazy modal chunk once the page is idle, so the first "Details"
  // click does not pay the download/eval cost inside the interaction frame.
  useEffect(() => {
    const load = () => void import('./components/ProjectModal');
    if (typeof window.requestIdleCallback === 'function') {
      const idle = window.requestIdleCallback(load, { timeout: 3000 });
      return () => window.cancelIdleCallback(idle);
    }
    const timer = window.setTimeout(load, 2500);
    return () => window.clearTimeout(timer);
  }, []);

  // Deep links (#about, #projects, …) point at markup that only exists after
  // React mounts, so the browser's own fragment scroll can miss. Restore on
  // first load and on later hash changes (e.g. back/forward navigation).
  useEffect(() => {
    const go = () => {
      let id = '';
      try {
        id = decodeURIComponent(window.location.hash.slice(1));
      } catch {
        return;
      }
      if (!id || id === 'main') return;
      const target = document.getElementById(id);
      if (target) scrollTo(target, { offset: -(Number.parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 72) - 8, immediate: true });
    };
    const timer = window.setTimeout(go, 60);
    window.addEventListener('load', go);
    window.addEventListener('hashchange', go);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('load', go);
      window.removeEventListener('hashchange', go);
    };
  }, [scrollTo]);

  const sections = useMemo<Record<SectionId, ReactNode>>(
    () => ({
      about: <About />,
      process: <ProcessSection />,
      projects: <Projects onOpen={setProject} />,
      skills: <Skills />,
    }),
    [],
  );

  return (
    <div>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[300] focus:rounded-md focus:bg-ink focus:px-4 focus:py-3 focus:text-sm focus:font-semibold focus:text-white"
      >
        Skip to content
      </a>
      <div className="grain" aria-hidden />
      <CustomCursor />

      <Navbar />
      <main id="main">
        <Hero />
        {sectionOrder.map((id) => (
          <Scene key={id} id={id}>
            {sections[id]}
          </Scene>
        ))}
        <Collaboration />
      </main>

      <Suspense fallback={null}>
        <AnimatePresence>
          {project && <ProjectModal key="project" project={project} onClose={closeProject} onSwitch={setProject} />}
        </AnimatePresence>
      </Suspense>
    </div>
  );
}
