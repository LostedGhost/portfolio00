import { animate, useInView, useMotionValue, useTransform } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import type { Statistic } from '../../lib/types';

export function StatCounter({ label, value, suffix }: Statistic) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const motionValue = useMotionValue(0);
  const rounded = useTransform(motionValue, (v) => Math.round(v));
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(motionValue, value, { duration: 1.4, ease: 'easeOut' });
    const unsubscribe = rounded.on('change', setDisplay);
    return () => {
      controls.stop();
      unsubscribe();
    };
  }, [inView, value, motionValue, rounded]);

  return (
    <div ref={ref} className="border-t border-(--color-accent) pt-4">
      <p className="font-mono text-3xl md:text-4xl font-medium text-white">
        {display}
        {suffix}
      </p>
      <p className="mt-1 text-xs uppercase tracking-wide text-(--color-text-dim)">{label}</p>
    </div>
  );
}
