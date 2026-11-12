import { animate, useInView, useMotionValue, useTransform } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from '../../../hooks/useReducedMotion';
import type { Statistic } from '../../../lib/types';

/** Statistique : compteur une seule fois, sobre, sans halo. */
export function StatRow({ label, value, suffix }: Statistic) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const reduced = useReducedMotion();
  const mv = useMotionValue(0);
  const rounded = useTransform(mv, (v) => Math.round(v));
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (reduced) {
      setDisplay(value);
      return;
    }
    const controls = animate(mv, value, { duration: 1.2, ease: [0.22, 1, 0.36, 1] });
    const unsub = rounded.on('change', setDisplay);
    return () => {
      controls.stop();
      unsub();
    };
  }, [inView, value, mv, rounded, reduced]);

  return (
    <div ref={ref}>
      <p className="font-mono text-3xl md:text-4xl text-(--color-text)">
        {display}
        {suffix && <span className="text-(--color-accent)">{suffix}</span>}
      </p>
      <p className="mt-1 text-xs uppercase tracking-wide text-(--color-text-dim)">{label}</p>
    </div>
  );
}
