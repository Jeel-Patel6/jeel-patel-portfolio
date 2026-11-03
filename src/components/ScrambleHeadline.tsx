import { useCallback, useEffect, useRef, useState } from 'react';
import { useReducedMotionPref } from '../hooks/useMedia';

/**
 * Animated hero headline — one large AI phrase at a time that morphs into the
 * next with a character-by-character scramble (inspired by the classic
 * "text scramble" effect). Endless cycle:
 * AI SYSTEMS → NEURAL NETWORKS → … → AI ENGINEER → AI SYSTEMS …
 *
 * Layout stability tricks: every character renders inside a per-character slot
 * whose invisible sizer always shows the FINAL character of the target phrase,
 * so widths are decided by the target phrase from the first scramble frame —
 * no layout shift during or between transitions. Each word is its own BLOCK
 * line (one word per line) and the block reserves room for the 3-line worst
 * case (`minHeight`), so the container height never jumps between phrases.
 *
 * Timing: ~150 + 26ms/char + ≤90ms jitter per slot → the longest phrase
 * ("LARGE LANGUAGE MODELS") fully settles in ≈770ms; short phrases sooner.
 * Hold ≈2.6s between phrases.
 */

const PHRASES = [
  'AI SYSTEMS',
  'NEURAL NETWORKS',
  'AGENTIC AI',
  'DEEP LEARNING',
  'LARGE LANGUAGE MODELS',
  'RAG SYSTEMS',
  'AI ENGINEER',
];

const POOL = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#/';
const HOLD_MS = 2600;
const HOLD_MS_REDUCED = 4200;
const TICK_MS = 40;
const HEAD_START_MS = 150;
const STAGGER_MS = 26;
const JITTER_MS = 90;

type Slot = { final: string; cur: string; settleAt: number; settled: boolean };

const randChar = (not: string) => {
  let c = not;
  while (c === not) c = POOL[(Math.random() * POOL.length) | 0];
  return c;
};

/** Build the character slots for the next phrase. Spaces settle instantly. */
function makeSlots(phrase: string, start: number, instant: boolean): Slot[] {
  return [...phrase].map((ch, i) =>
    ch === ' ' || instant
      ? { final: ch, cur: ch, settleAt: start, settled: true }
      : {
          final: ch,
          cur: randChar(ch),
          settleAt: start + HEAD_START_MS + i * STAGGER_MS + Math.random() * JITTER_MS,
          settled: false,
        },
  );
}

export default function ScrambleHeadline() {
  const reduced = useReducedMotionPref();
  const wrapRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  // Rendered mirror of slotsRef. Initial state is fully settled so the phrase
  // is visible even if animation scheduling never starts.
  const [slots, setSlots] = useState<Slot[]>(() => makeSlots(PHRASES[0], 0, true));

  const indexRef = useRef(0);
  const slotsRef = useRef(slots);
  const visibleRef = useRef(false);
  const startRef = useRef<() => void>(() => {});
  const stopRef = useRef<() => void>(() => {});

  const goTo = useCallback((next: number, now: number, instant: boolean) => {
    indexRef.current = next;
    const made = makeSlots(PHRASES[next], now, instant);
    slotsRef.current = made;
    setSlots(made);
    setIndex(next);
  }, []);

  // Reduced-motion: no scramble — phrases swap instantly, still gated on visibility.
  useEffect(() => {
    if (!reduced) return;
    let interval = 0;
    const start = () => {
      if (interval) return;
      interval = window.setInterval(() => {
        if (document.hidden) return;
        goTo((indexRef.current + 1) % PHRASES.length, performance.now(), true);
      }, HOLD_MS_REDUCED);
    };
    const stop = () => {
      window.clearInterval(interval);
      interval = 0;
    };
    startRef.current = start;
    stopRef.current = stop;
    if (visibleRef.current && !document.hidden) start();
    return () => {
      stop();
      startRef.current = () => {};
      stopRef.current = () => {};
    };
  }, [reduced, goTo]);

  // Main scramble loop. Runs only while visible and animating: when a phrase has
  // fully settled the rAF loop stops and a timeout waits for the next one, so an
  // idle headline costs nothing.
  useEffect(() => {
    if (reduced) return;
    let raf = 0;
    let holdTimer = 0;
    let lastTick = 0;

    const stopLoop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
      window.clearTimeout(holdTimer);
      holdTimer = 0;
    };

    const tick = (t: number) => {
      raf = 0;
      if (!visibleRef.current || document.hidden) return;
      if (t - lastTick < TICK_MS) {
        raf = requestAnimationFrame(tick);
        return;
      }
      lastTick = t;

      const s = slotsRef.current;
      let changed = false;
      let allSettled = s.length > 0;
      for (const slot of s) {
        if (slot.settled) continue;
        if (t >= slot.settleAt) {
          slot.cur = slot.final;
          slot.settled = true;
        } else {
          slot.cur = randChar(slot.final);
          allSettled = false;
        }
        changed = true;
      }
      if (changed) setSlots([...s]);

      if (allSettled) {
        // Stop the loop during the long hold; a single timer wakes it up.
        holdTimer = window.setTimeout(() => {
          holdTimer = 0;
          goTo((indexRef.current + 1) % PHRASES.length, performance.now(), false);
          if (!raf) raf = requestAnimationFrame(tick);
        }, HOLD_MS);
        return;
      }
      raf = requestAnimationFrame(tick);
    };

    const start = () => {
      if (!visibleRef.current || document.hidden) return;
      if (!raf && !holdTimer) raf = requestAnimationFrame(tick);
    };
    startRef.current = start;
    stopRef.current = stopLoop;
    start();
    return () => {
      stopLoop();
      startRef.current = () => {};
      stopRef.current = () => {};
    };
  }, [reduced, goTo]);

  // Animate only while the headline is actually on screen, and pause with the tab.
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      visibleRef.current = e.isIntersecting;
      if (e.isIntersecting) startRef.current();
      else stopRef.current();
    }, { threshold: 0.05 });
    io.observe(el);
    const onVisibility = () => {
      if (document.hidden) stopRef.current();
      else startRef.current();
    };
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      io.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  let pos = 0;
  const words = PHRASES[index].split(' ');

  return (
    <div ref={wrapRef} className="mt-4 w-full">
      <p
        className="font-display text-chalk text-[clamp(5rem,9.5vw,12rem)]"
        style={{ fontSize: 'clamp(5rem, min(9.5vw, 16.5svh), 12rem)', lineHeight: 0.9, minHeight: '2.7em' }}
        aria-live="off"
      >
        <span className="sr-only">{PHRASES[index]}</span>
        <span aria-hidden="true" className="block">
          {/* Every word renders in its own BLOCK wrapper — one word per line,
              stacking top-down. No inter-word space nodes exist, so nothing can
              be trimmed, collapsed, or eaten by the scramble. Line breaks are
              stable during transitions because each word block never changes
              position; only the characters inside it animate. */}
          {words.map((word, wi) => {
            const chars = slots.slice(pos, pos + word.length);
            pos += word.length + 1;
            return (
              <span key={`${index}:${wi}`} className="block whitespace-nowrap">
                {chars.map((s, ci) => (
                  <span key={ci} className="relative inline-block">
                    <span className={s.settled ? '' : 'invisible'}>{s.final}</span>
                    {!s.settled && s.final !== '' && (
                      <span className="absolute left-0 top-0 text-green">{s.cur}</span>
                    )}
                  </span>
                ))}
              </span>
            );
          })}
        </span>
      </p>
    </div>
  );
}
