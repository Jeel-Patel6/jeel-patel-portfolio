import { createContext, useCallback, useContext, useEffect, useRef, type ReactNode } from 'react';
import Lenis from 'lenis';
import { useCoarsePointer, useReducedMotionPref } from './useMedia';

type ScrollApi = {
  scrollTo: (target: string | HTMLElement | number, opts?: { offset?: number; immediate?: boolean }) => void;
  lock: () => void;
  unlock: () => void;
};

const ScrollCtx = createContext<ScrollApi | null>(null);

export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const reduced = useReducedMotionPref();
  const coarse = useCoarsePointer();
  const lenisRef = useRef<Lenis | null>(null);
  const locks = useRef(0);

  // Desktop only: touch devices already have native momentum scrolling, and
  // skipping Lenis there removes a permanently-running rAF loop.
  useEffect(() => {
    if (reduced || coarse) return;
    const lenis = new Lenis({ duration: 1.15, smoothWheel: true, easing: (t) => 1 - Math.pow(1 - t, 4) });
    lenisRef.current = lenis;
    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    const start = () => {
      if (raf) return;
      raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };
    const onVisibility = () => {
      if (document.hidden) stop();
      else start();
    };
    start();
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      stop();
      document.removeEventListener('visibilitychange', onVisibility);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [reduced, coarse]);

  const scrollTo = useCallback<ScrollApi['scrollTo']>((target, opts = {}) => {
    const offset = opts.offset ?? -72;
    // Reduced motion uses an instant jump rather than a long eased scroll.
    const behavior: ScrollBehavior = opts.immediate || reduced ? 'auto' : 'smooth';
    if (typeof target === 'number') {
      if (lenisRef.current) lenisRef.current.scrollTo(target, { offset, immediate: opts.immediate, duration: 1.4 });
      else window.scrollTo({ top: target, behavior });
      return;
    }
    const el = typeof target === 'string' ? document.querySelector<HTMLElement>(target) : target;
    if (el === null) return;
    // Resolve the element to an absolute document offset here, then hand Lenis a
    // number. Lenis' element branch adds its own `animatedScroll`, which can lag
    // behind a native fragment jump (e.g. on `hashchange`) and resolve to a bogus
    // target — an absolute value is always correct.
    const top = el.getBoundingClientRect().top + window.scrollY + offset;
    if (lenisRef.current) {
      lenisRef.current.scrollTo(top, { immediate: opts.immediate, duration: 1.4 });
    } else {
      window.scrollTo({ top, behavior });
    }
  }, [reduced]);

  const lock = useCallback(() => {
    locks.current += 1;
    lenisRef.current?.stop();
    document.documentElement.style.overflow = 'hidden';
  }, []);

  const unlock = useCallback(() => {
    locks.current = Math.max(0, locks.current - 1);
    if (locks.current === 0) {
      lenisRef.current?.start();
      document.documentElement.style.overflow = '';
    }
  }, []);

  return <ScrollCtx.Provider value={{ scrollTo, lock, unlock }}>{children}</ScrollCtx.Provider>;
}

export function useSmoothScroll() {
  const ctx = useContext(ScrollCtx);
  if (!ctx) throw new Error('useSmoothScroll must be used inside SmoothScrollProvider');
  return ctx;
}

/** Locks page scroll while `active` is true (used by overlays). */
export function useScrollLock(active: boolean) {
  const { lock, unlock } = useSmoothScroll();
  useEffect(() => {
    if (!active) return;
    lock();
    return unlock;
  }, [active, lock, unlock]);
}
