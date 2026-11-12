import { AnimatePresence, motion } from 'framer-motion';
import { useEffect } from 'react';
import { useReducedMotion } from '../../../hooks/useReducedMotion';
import type { Project } from '../../../lib/types';

interface ModalProps {
  project: Project;
  onClose: () => void;
}

/** Fiche projet (chapitre 05) : sobre, sombre, le contenu mène. */
export function ProjectModal({ project, onClose }: ModalProps) {
  const reduced = useReducedMotion();
  const hasLink = project.link && project.link !== '#';

  // Fermeture au clavier          + neutralisation du scroll derrière.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={onClose}
        className="fixed inset-0 z-[100] bg-black/85 flex items-center justify-center p-4 md:p-8"
      >
        <motion.div
          initial={reduced ? undefined : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-label={project.title}
          className="modal-scroll max-w-2xl w-full max-h-[90vh] overflow-y-auto bg-(--color-bg) border border-(--color-border)"
          style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(234,245,238,0.25) transparent' }}
        >
          <div className="aspect-video overflow-hidden">
            <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
          </div>

          <div className="p-6 md:p-8">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-(--color-accent) mb-1">
                  {project.category}
                </p>
                <h3 className="text-2xl font-bold">{project.title}</h3>
              </div>
              <button
                onClick={onClose}
                aria-label="Fermer"
                className="h-9 w-9 rounded-full border border-(--color-border) text-(--color-text-dim) hover:text-(--color-text) hover:border-(--color-text-dim) text-lg leading-none shrink-0 transition-colors"
              >
                ×
              </button>
            </div>

            {project.role && <p className="text-sm text-(--color-text-dim) mb-4">{project.role}</p>}
            {project.description && <p className="text-(--color-text-dim) leading-relaxed mb-4">{project.description}</p>}

            {project.results && (
              <div className="mb-4">
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-(--color-accent) mb-1">Résultats</p>
                <p className="text-(--color-text-dim) leading-relaxed">{project.results}</p>
              </div>
            )}

            {project.technologies.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {project.technologies.map((t) => (
                  <span key={t.id} className="font-mono text-[10px] border border-(--color-border) px-2 py-1 text-(--color-text-dim)">
                    {t.name}
                  </span>
                ))}
              </div>
            )}

            {hasLink && (
              <a
                href={project.link}
                target="_blank"
                rel="noreferrer"
                className="inline-block font-mono text-sm text-(--color-accent) border-b border-(--color-accent)/40 hover:border-(--color-accent) transition-colors pb-0.5"
              >
                Voir le projet ↗
              </a>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
