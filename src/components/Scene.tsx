import type { ReactNode } from 'react';

/**
 * A plain page section. No scroll-linked transforms — sections stay in normal
 * document flow so vertical scrolling is never interrupted or animated.
 */
export default function Scene({ id, children, className = '' }: { id: string; children: ReactNode; className?: string }) {
  return (
    <section id={id} className={`relative py-10 sm:py-14 ${className}`}>
      {children}
    </section>
  );
}
