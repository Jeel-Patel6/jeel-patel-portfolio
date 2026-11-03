import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { profile, sectionMeta, sectionOrder } from '../data/portfolio';
import { useSmoothScroll } from '../hooks/smoothScroll';
import { useReducedMotionPref } from '../hooks/useMedia';
import { EASE } from './fx';

type NavItem = { id: string; label: string };

const navItems: NavItem[] = [
  { id: 'top', label: 'Home' },
  ...sectionOrder.map((id) => ({ id, label: sectionMeta[id].nav })),
];

const SECTION_IDS = ['top', ...sectionOrder, 'contact'];

/**
 * Resume is a document link, not a section: it opens `public/resume.pdf` in a
 * new tab and never participates in active-section state or the indicator.
 */
const RESUME_URL = '/resume.pdf';

/**
 * Sticky top navigation.
 *
 * Stability rules baked in here:
 * - the bar never hides/shows on scroll, so it cannot flicker or change height;
 * - it always sits on the light surface, so there is no dark-to-light text flip;
 * - active-section detection is driven by IntersectionObserver triggers but
 *   resolved from one geometry read of the section under the nav line, so two
 *   sections can never "fight" over the state;
 * - clicking a link sets the state immediately and suppresses observer updates
 *   until the programmatic scroll lands, so the indicator does not walk through
 *   every section on the way to the target.
 */
export default function Navbar() {
  const { scrollTo } = useSmoothScroll();
  const reduced = useReducedMotionPref();
  const [active, setActive] = useState('top');
  const [menuOpen, setMenuOpen] = useState(false);
  const barRef = useRef<HTMLDivElement>(null);
  const menuBtn = useRef<HTMLButtonElement>(null);
  /** Height of the bar itself - never the drawer, which also lives in <header>. */
  const navHeight = useCallback(() => barRef.current?.getBoundingClientRect().height || 72, []);
  const pending = useRef<{ id: string; dest: number } | null>(null);
  const syncActive = useRef<() => void>(() => {});
  const arrivalRaf = useRef(0);

  const closeMenu = useCallback((restoreFocus = false) => {
    setMenuOpen(false);
    if (restoreFocus) requestAnimationFrame(() => menuBtn.current?.focus({ preventScroll: true }));
  }, []);

  // - active section -
  useEffect(() => {
    const sections = SECTION_IDS.map((id) => document.getElementById(id)).filter(
      (el): el is HTMLElement => Boolean(el),
    );
    if (sections.length === 0) return;

    /**
     * The section under the nav line wins. Sections are stacked in document
     * order and never overlap, so at most one can contain the line - except at
     * a shared boundary, where the later one is the one being entered.
     */
    const resolve = () => {
      if (pending.current) return;
      const line = navHeight() + 12;
      let next = '';
      for (const el of sections) {
        const rect = el.getBoundingClientRect();
        if (rect.top <= line && rect.bottom > line) next = el.id;
      }
      // Bottom of the document: the final section stays active even though its
      // remaining height may be shorter than the nav line.
      if (!next && window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) {
        next = sections[sections.length - 1].id;
      }
      if (next) setActive((prev) => (prev === next ? prev : next));
    };
    syncActive.current = resolve;

    // The observer only tells us *when* to re-resolve - the resolution itself
    // reads live geometry, so batched or missed entries cannot corrupt state.
    // The observation band ends exactly at the nav line, so a section entering
    // it is precisely the moment that section starts sitting under the bar.
    let io: IntersectionObserver | null = null;
    const observe = () => {
      io?.disconnect();
      const line = navHeight() + 12;
      io = new IntersectionObserver(resolve, {
        rootMargin: `0px 0px ${Math.round(line - window.innerHeight)}px 0px`,
        threshold: 0,
      });
      sections.forEach((el) => io?.observe(el));
    };
    observe();

    let resizeRaf = 0;
    const onResize = () => {
      if (resizeRaf) return;
      resizeRaf = requestAnimationFrame(() => {
        resizeRaf = 0;
        observe();
        resolve();
      });
    };
    window.addEventListener('resize', onResize);
    resolve();
    document.fonts?.ready.then(resolve).catch(() => {});

    return () => {
      io?.disconnect();
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(resizeRaf);
      syncActive.current = () => {};
    };
  }, [navHeight]);

  // A user gesture means they took over the scroll: stop suppressing updates.
  useEffect(() => {
    const release = () => {
      if (!pending.current) return;
      pending.current = null;
      cancelAnimationFrame(arrivalRaf.current);
      syncActive.current();
    };
    window.addEventListener('wheel', release, { passive: true });
    window.addEventListener('touchstart', release, { passive: true });
    window.addEventListener('keydown', release);
    return () => {
      window.removeEventListener('wheel', release);
      window.removeEventListener('touchstart', release);
      window.removeEventListener('keydown', release);
    };
  }, []);

  // Release the click lock once the smooth scroll actually lands (or times out).
  const watchArrival = useCallback((dest: number) => {
    cancelAnimationFrame(arrivalRaf.current);
    const started = performance.now();
    const tick = () => {
      if (!pending.current) return;
      if (Math.abs(window.scrollY - dest) <= 3 || performance.now() - started > 2200) {
        pending.current = null;
        syncActive.current();
        return;
      }
      arrivalRaf.current = requestAnimationFrame(tick);
    };
    arrivalRaf.current = requestAnimationFrame(tick);
  }, []);

  useEffect(() => () => cancelAnimationFrame(arrivalRaf.current), []);

  // - menu chrome -
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeMenu(true);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [menuOpen, closeMenu]);

  // Crossing into the desktop layout must never leave a stale open drawer.
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)');
    const onChange = (e: MediaQueryListEvent) => {
      if (e.matches) closeMenu();
    };
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [closeMenu]);

  const go = useCallback(
    (id: string) => {
      closeMenu(menuOpen);
      const el = document.getElementById(id);
      if (!el) return;
      const navH = navHeight();
      const offset = id === 'top' ? 0 : -(navH + 8);
      const dest = id === 'top' ? 0 : Math.max(0, el.getBoundingClientRect().top + window.scrollY + offset);

      pending.current = { id, dest };
      setActive(id);
      scrollTo(`#${id}`, { offset });
      watchArrival(dest);
    },
    [closeMenu, menuOpen, navHeight, scrollTo, watchArrival],
  );

  return (
    <header className="fixed inset-x-0 top-0 z-[60]">
      <div ref={barRef} className="gutter flex h-[var(--nav-h)] items-center justify-between gap-6 border-b border-line bg-chalk/90 backdrop-blur-md supports-[backdrop-filter]:bg-chalk/80">
        {/* Mobile brand / home affordance - the drawer holds the full list. */}
        <button
          type="button"
          onClick={() => go('top')}
          className="inline-flex min-h-11 items-center font-display text-lg tracking-[0.18em] text-ink md:hidden"
          aria-label={`${profile.displayName} - back to top`}
        >
          {profile.displayName.toUpperCase()}
        </button>

        <DesktopNav active={active} reduced={reduced} onNavigate={go} />

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => go('contact')}
            aria-current={active === 'contact' ? 'true' : undefined}
            className={`hidden min-h-11 shrink-0 items-center rounded-full border bg-transparent px-5 text-[12px] font-semibold tracking-[0.16em] transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue md:inline-flex ${
              active === 'contact'
                ? 'border-blue bg-blue/[0.06] text-blue'
                : 'border-blue/40 text-ink hover:border-blue hover:bg-blue/[0.06] hover:text-blue'
            }`}
          >
            LET&apos;S BUILD
          </button>

          <button
            ref={menuBtn}
            type="button"
            className="-mr-2 flex h-11 w-11 flex-col items-center justify-center gap-1.5 rounded-lg md:hidden"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen((v) => !v)}
          >
            <motion.span
              className="block h-0.5 w-5 rounded-full bg-ink"
              animate={{ rotate: menuOpen ? 45 : 0, y: menuOpen ? 4 : 0 }}
              transition={{ duration: 0.2, ease: EASE }}
            />
            <motion.span
              className="block h-0.5 w-5 rounded-full bg-ink"
              animate={{ rotate: menuOpen ? -45 : 0, y: menuOpen ? -4 : 0 }}
              transition={{ duration: 0.2, ease: EASE }}
            />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            id="mobile-menu"
            aria-label="Sections"
            className="gutter max-h-[calc(100svh-var(--nav-h))] overflow-y-auto overscroll-contain border-b border-line bg-chalk pb-5 pt-1 shadow-[0_18px_40px_-32px_rgba(0,0,0,0.45)] md:hidden"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: EASE }}
          >
            {navItems.map((item) => {
              const current = active === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => go(item.id)}
                  aria-current={current ? 'true' : undefined}
                  className={`flex min-h-14 w-full items-center justify-between gap-4 border-b border-line/70 text-left text-[17px] font-medium transition-colors duration-200 last:border-b-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue ${
                    current ? 'text-blue' : 'text-slate'
                  }`}
                >
                  {item.label}
                  <span
                    aria-hidden
                    className={`h-1 w-5 shrink-0 rounded-full transition-colors duration-200 ${
                      current ? 'bg-blue' : 'bg-transparent'
                    }`}
                  />
                </button>
              );
            })}

            {/* Resume row: styled like the section rows, opens the PDF in a new
                tab, and closes the drawer on selection. Never active. */}
            <a
              href={RESUME_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Resume (opens in a new tab)"
              onClick={() => closeMenu()}
              className="flex min-h-14 w-full items-center justify-between gap-4 border-b border-line/70 text-left text-[17px] font-medium text-slate transition-colors duration-200 hover:text-blue focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue"
            >
              Resume
              <span aria-hidden className="h-1 w-5 shrink-0 rounded-full bg-transparent" />
            </a>

            <button
              type="button"
              onClick={() => go('contact')}
              aria-current={active === 'contact' ? 'true' : undefined}
              className={`mt-5 flex min-h-12 w-full items-center justify-center rounded-full border text-[12px] font-semibold tracking-[0.16em] transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue ${
                active === 'contact'
                  ? 'border-blue bg-blue/[0.06] text-blue'
                  : 'border-blue/40 text-ink hover:border-blue hover:bg-blue/[0.06] hover:text-blue'
              }`}
            >
              LET&apos;S BUILD
            </button>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}

/**
 * Desktop links + one shared sliding underline.
 *
 * The underline is positioned from a single measurement of the active label
 * (`getBoundingClientRect` against the nav box) and moved with `transform`, so
 * it travels between items instead of being re-created under each one. It is
 * re-measured only on active change, resize, container resize and font load -
 * never on scroll.
 */
function DesktopNav({
  active,
  reduced,
  onNavigate,
}: {
  active: string;
  reduced: boolean;
  onNavigate: (id: string) => void;
}) {
  const navRef = useRef<HTMLElement>(null);
  const labelRefs = useRef<Record<string, HTMLSpanElement | null>>({});
  const [bar, setBar] = useState({ x: 0, y: 0, width: 0, ready: false });

  const measure = useCallback(() => {
    const nav = navRef.current;
    const label = labelRefs.current[active];
    if (!nav || !label) return;
    const navRect = nav.getBoundingClientRect();
    const labelRect = label.getBoundingClientRect();
    if (labelRect.width === 0) return;
    const next = {
      x: Math.round((labelRect.left - navRect.left) * 10) / 10,
      y: Math.round((labelRect.bottom - navRect.top + 4) * 10) / 10,
      width: Math.round(labelRect.width * 10) / 10,
      ready: true,
    };
    setBar((prev) =>
      Math.abs(prev.x - next.x) < 0.5 && Math.abs(prev.y - next.y) < 0.5 && Math.abs(prev.width - next.width) < 0.5 && prev.ready
        ? prev
        : next,
    );
  }, [active]);

  useEffect(() => {
    measure();
  }, [measure]);

  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    let raf = 0;
    let alive = true;
    const schedule = () => {
      if (raf || !alive) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        measure();
      });
    };
    const ro = new ResizeObserver(schedule);
    ro.observe(nav);
    Object.values(labelRefs.current).forEach((el) => el && ro.observe(el));
    window.addEventListener('resize', schedule);
    document.fonts?.ready.then(schedule).catch(() => {});
    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener('resize', schedule);
    };
  }, [measure]);

  const motionStyle = reduced
    ? { transform: `translate3d(${bar.x}px, ${bar.y}px, 0)`, width: bar.width }
    : {
        transform: `translate3d(${bar.x}px, ${bar.y}px, 0)`,
        width: bar.width,
        transition: 'transform 320ms var(--ease-cine), width 320ms var(--ease-cine), opacity 200ms linear',
      };

  return (
    <nav
      ref={navRef}
      className="relative hidden items-center gap-7 md:flex lg:gap-9"
      aria-label="Sections"
    >
      {navItems.map(({ id, label }) => {
        const current = active === id;
        return (
          <button
            key={id}
            type="button"
            onClick={() => onNavigate(id)}
            aria-current={current ? 'true' : undefined}
            className={`inline-flex min-h-11 min-w-11 items-center justify-center text-[15px] font-medium tracking-[0.01em] transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue ${
              current ? 'text-blue' : 'text-slate hover:text-blue'
            }`}
          >
            <span ref={(el) => { labelRefs.current[id] = el; }}>{label}</span>
          </button>
        );
      })}

      {/* Same link styling as the section buttons, but an anchor so the browser
          opens the PDF in a new tab. No ref, no aria-current, so the sliding
          indicator can never move under it and no section state changes. */}
      <a
        href={RESUME_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Resume (opens in a new tab)"
        className="inline-flex min-h-11 min-w-11 items-center justify-center text-[15px] font-medium tracking-[0.01em] text-slate transition-colors duration-300 hover:text-blue focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue"
      >
        <span>Resume</span>
      </a>

      <span
        aria-hidden
        className="pointer-events-none absolute left-0 top-0 h-[2px] rounded-full bg-blue"
        style={{
          ...motionStyle,
          opacity: bar.ready ? 1 : 0,
        }}
      />
    </nav>
  );
}
