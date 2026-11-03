import { useEffect, useState, type RefObject } from 'react';

/** Desktop arrow controls for a horizontal rail. Hidden on touch, where swiping is native. */
export function RailButtons({ rail }: { rail: RefObject<HTMLDivElement | null> }) {
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(true);

  useEffect(() => {
    const el = rail.current;
    if (!el) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const left = el.scrollLeft > 8;
      const right = el.scrollLeft + el.clientWidth < el.scrollWidth - 8;
      setCanLeft((prev) => (prev === left ? prev : left));
      setCanRight((prev) => (prev === right ? prev : right));
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    el.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    const ro = new ResizeObserver(schedule);
    ro.observe(el);
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      ro.disconnect();
    };
  }, [rail]);

  const page = (dir: 1 | -1) => {
    const el = rail.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: 'smooth' });
  };

  const base =
    'absolute top-8 bottom-8 z-20 hidden w-[var(--gutter)] min-w-11 items-center justify-center bg-gradient-to-r text-3xl text-ink opacity-0 transition duration-300 group-hover/rail:opacity-100 hover:text-blue [@media(hover:hover)]:flex';

  return (
    <>
      {canLeft && (
        <button type="button" aria-label="Scroll left" onClick={() => page(-1)} className={`${base} left-0 from-white to-transparent`}>
          ‹
        </button>
      )}
      {canRight && (
        <button type="button" aria-label="Scroll right" onClick={() => page(1)} className={`${base} right-0 from-transparent to-white`}>
          ›
        </button>
      )}
    </>
  );
}
