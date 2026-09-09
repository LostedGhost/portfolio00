import { motion } from 'framer-motion';
import type { Experience } from '../../lib/types';

function formatMonthYear(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' });
}

export function ExperienceItem({ company, type, start_date, end_date, description }: Experience) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5 }}
      className="relative pl-8 pb-10 border-l border-(--color-border) last:pb-0"
    >
      <span className="absolute -left-[7px] top-1 h-3.5 w-3.5 rounded-full bg-(--color-accent)" />
      <p className="text-sm text-(--color-accent) mb-1">
        {formatMonthYear(start_date)} — {end_date ? formatMonthYear(end_date) : 'En cours'}
      </p>
      <h3 className="text-lg font-semibold">{company}</h3>
      <p className="text-sm text-(--color-text-dim) mb-2">{type}</p>
      <p className="text-(--color-text-dim)">{description}</p>
    </motion.div>
  );
}
