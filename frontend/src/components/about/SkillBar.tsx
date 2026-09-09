import { motion } from 'framer-motion';
import type { Skill } from '../../lib/types';

export function SkillBar({ name, value }: Skill) {
  return (
    <div>
      <div className="flex justify-between text-sm mb-2">
        <span>{name}</span>
        <span className="font-mono text-(--color-text-dim)">{value}%</span>
      </div>
      <div className="h-px bg-(--color-border) overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${value}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="h-full bg-(--color-accent)"
        />
      </div>
    </div>
  );
}
