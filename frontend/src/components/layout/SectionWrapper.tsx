import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface SectionWrapperProps {
  id: string;
  index: number;
  title: string;
  subtitle?: string;
  className?: string;
  children: ReactNode;
}

export function SectionWrapper({ id, index, title, subtitle, className = '', children }: SectionWrapperProps) {
  return (
    <section id={id} className={`section ${className}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="mb-14 flex flex-col md:flex-row md:items-end md:justify-between gap-4 border-b border-(--color-border) pb-6"
      >
        <div>
          <p className="eyebrow mb-2">
            {String(index).padStart(2, '0')} / {title}
          </p>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight">{title}</h2>
        </div>
        {subtitle && (
          <p className="max-w-xs text-sm text-(--color-text-dim) md:text-right">{subtitle}</p>
        )}
      </motion.div>
      {children}
    </section>
  );
}
