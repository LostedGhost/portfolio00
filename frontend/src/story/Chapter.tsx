import { motion } from 'framer-motion';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { forwardRef, type ReactNode } from 'react';

interface ChapterProps {
  /** « 01 »… affiché en mono + ancre. */
  index: string;
  id: string;
  /** Titre narratif du chapitre (ex. « La pratique »). */
  title: string;
  children: ReactNode;
  /** Composition du fond 3D/SVG propre au chapitre (optionnel). */
  artwork?: ReactNode;
}

/**
 * Un chapitre du récit : plein écran, respiration large, numéro MONO comme
 * signature, entrée personnifiée au viewport. Le scroll reste natif.
 */
export const Chapter = forwardRef<HTMLElement, ChapterProps>(function Chapter(
  { index, id, title, children, artwork },
  ref,
) {
  const reduced = useReducedMotion();
  return (
    <section
      ref={ref}
      id={id}
      className="relative min-h-screen flex flex-col justify-center px-6 py-24 md:px-16"
    >
      {artwork && (
        <div className="absolute inset-0 pointer-events-none flex items-center justify-end opacity-70">
          {artwork}
        </div>
      )}
      <motion.div
        initial={reduced ? undefined : { opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-120px' }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 max-w-5xl mx-auto w-full"
      >
        <p className="font-mono text-xs tracking-[0.3em] text-(--color-accent) mb-4">
          CHAPITRE {index} — {title.toUpperCase()}
        </p>
        {children}
      </motion.div>
    </section>
  );
});
