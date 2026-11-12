import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { useReducedMotion } from '../../../hooks/useReducedMotion';
import type { Skill } from '../../../lib/types';

interface SkillBarProps extends Skill {
  delay?: number;
}

/** Compétence : ligne fine qui se remplit de néon menthe quand elle entre. */
export function SkillBar({ name, value, delay = 0 }: SkillBarProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const reduced = useReducedMotion();

  return (
    <div ref={ref}>
      <div className="flex justify-between text-sm mb-2">
        <span>{name}</span>
        <span className="font-mono text-(--color-text-dim)">{value}%</span>
      </div>
      <div className="h-px bg-(--color-border) overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={inView ? { width: `${value}%` } : { width: 0 }}
          transition={reduced ? { duration: 0 } : { duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
          className="h-full bg-(--color-accent)"
        />
      </div>
    </div>
  );
}
