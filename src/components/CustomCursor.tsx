import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useMotionValue, useSpring } from 'framer-motion';
import { useFinePointer, useReducedMotionPref } from '../hooks/useMedia';

const LABELS: Record<string, string> = { view: 'VIEW', play: '▶', link: '↗', drag: '↔', close: '✕' };

/**
 * Minimal cursor: a small dot that grows into a labelled disc over elements with
 * `data-cursor="view|play|link|drag|close"`. Desktop only; disabled for reduced motion.
 */
export default function CustomCursor() {
  const fine = useFinePointer();
  const reduced = useReducedMotionPref();
  const enabled = fine && !reduced;

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 600, damping: 40, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 600, damping: 40, mass: 0.4 });
  const [mode, setMode] = useState<string | null>(null);
  const [hoverLink, setHoverLink] = useState(false);
  const [visible, setVisible] = useState(false);
  const [down, setDown] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    document.documentElement.classList.add('has-custom-cursor');
    let raf = 0;
    let latest: PointerEvent | null = null;
    let lastMode: string | null = null;
    let lastLink = false;
    let lastVisible = false;
    let lastDown = false;
    // One rAF-coalesced read per frame: position goes to motion values (no React
    // render) and the appearance state only updates when it actually changes.
    // Before this, every raw pointermove event triggered up to three setStates.
    const paint = () => {
      raf = 0;
      const e = latest;
      if (!e) return;
      x.set(e.clientX);
      y.set(e.clientY);
      const t = e.target as HTMLElement | null;
      const tagged = t?.closest<HTMLElement>('[data-cursor]');
      const nextMode = tagged?.dataset.cursor ?? null;
      const nextLink = !tagged && !!t?.closest('a,button,[role="button"]');
      if (nextMode !== lastMode) {
        lastMode = nextMode;
        setMode(nextMode);
      }
      if (nextLink !== lastLink) {
        lastLink = nextLink;
        setHoverLink(nextLink);
      }
      if (!lastVisible) {
        lastVisible = true;
        setVisible(true);
      }
    };
    const move = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      latest = e;
      if (!raf) raf = requestAnimationFrame(paint);
    };
    const leave = () => {
      if (!lastVisible) return;
      lastVisible = false;
      setVisible(false);
    };
    const press = () => {
      if (lastDown) return;
      lastDown = true;
      setDown(true);
    };
    const release = () => {
      if (!lastDown) return;
      lastDown = false;
      setDown(false);
    };
    window.addEventListener('pointermove', move, { passive: true });
    document.addEventListener('pointerleave', leave);
    window.addEventListener('pointerdown', press);
    window.addEventListener('pointerup', release);
    return () => {
      document.documentElement.classList.remove('has-custom-cursor');
      window.removeEventListener('pointermove', move);
      document.removeEventListener('pointerleave', leave);
      document.removeEventListener('pointerdown', press);
      document.removeEventListener('pointerup', release);
    };
  }, [enabled, x, y]);

  if (!enabled) return null;
  const label = mode ? LABELS[mode] : null;
  const size = label ? (mode === 'view' ? 72 : 52) : hoverLink ? 34 : 10;

  const dotColor = 'rgba(22,22,22,1)';
  const labelColor = 'rgba(22,22,22,0.92)';
  const linkColor = 'rgba(22,22,22,0.06)';
  const linkBorder = 'rgba(22,22,22,0.45)';

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[200] flex items-center justify-center rounded-full"
      style={{ x: sx, y: sy, translateX: '-50%', translateY: '-50%' }}
      animate={{
        width: size,
        height: size,
        opacity: visible ? 1 : 0,
        scale: down ? 0.85 : 1,
        backgroundColor: label ? labelColor : hoverLink ? linkColor : dotColor,
        borderColor: hoverLink && !label ? linkBorder : 'rgba(255,255,255,0)',
      }}
      transition={{ type: 'spring', stiffness: 420, damping: 30 }}
    >
      <span className="absolute inset-0 rounded-full border" style={{ borderColor: 'inherit' }} />
      <AnimatePresence>
        {label && (
          <motion.span
            key={label}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6 }}
            className="font-sans text-[11px] font-bold tracking-[0.18em] text-white"
          >
            {label}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
