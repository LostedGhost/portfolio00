import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { useExperiences } from '../../api/hooks';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { Chapter } from '../Chapter';
import { BlocksIllustration } from '../specimens/Illustration';
function formatMonthYear(iso: string) {
  return new Date(iso).toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' });
}

/** Chapitre 03 — La pratique : la timeline se dessine pendant qu'on lit. */
export function ChapterPractice() {
  const { data: experiences = [] } = useExperiences();
  const reduced = useReducedMotion();
  const lineRef = useRef<HTMLDivElement>(null);
  const inView = useInView(lineRef, { once: true, margin: '-60px' });

  return (
    <Chapter index="03" id="experience" title="La pratique" artwork={<BlocksIllustration className="h-60 w-64 opacity-80 hidden lg:block" />}>
      <div ref={lineRef} className="relative max-w-2xl">
        {/* La ligne qui se dessine */}
        <motion.div
          aria-hidden
          initial={{ scaleY: 0 }}
          animate={inView || reduced ? { scaleY: 1 } : { scaleY: 0 }}
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
          className="absolute left-[5px] top-1 bottom-1 w-px bg-(--color-accent) origin-top"
        />
        <ol className="space-y-14">
          {experiences.map((xp, i) => (
            <motion.li
              key={xp.id}
              initial={reduced ? undefined : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.55, delay: 0.15 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="relative pl-10"
            >
              <span className="absolute left-0 top-1.5 h-2.5 w-2.5 rounded-full bg-(--color-accent)" />
              <p className="font-mono text-xs text-(--color-accent) mb-2">
                {formatMonthYear(xp.start_date)} — {xp.end_date ? formatMonthYear(xp.end_date) : 'en cours'}
              </p>
              <h3 className="text-xl font-semibold">{xp.company}</h3>
              <p className="text-sm text-(--color-text-dim) mb-2">{xp.type}</p>
              <p className="text-(--color-text-dim) leading-relaxed">{xp.description}</p>
            </motion.li>
          ))}
        </ol>
      </div>
    </Chapter>
  );
}
