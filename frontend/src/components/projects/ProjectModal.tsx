import { AnimatePresence, motion } from 'framer-motion';
import type { Project } from '../../lib/types';

interface ProjectModalProps {
  project: Project;
  onClose: () => void;
}

export function ProjectModal({ project, onClose }: ProjectModalProps) {
  const hasLink = project.link && project.link !== '#';

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4 md:p-8"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-(--color-bg) border border-(--color-border) max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        >
          <div className="aspect-video overflow-hidden">
            <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
          </div>

          <div className="p-6 md:p-8">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <p className="font-mono text-xs uppercase tracking-wide text-(--color-accent) mb-1">
                  {project.category}
                </p>
                <h3 className="text-2xl font-bold">{project.title}</h3>
              </div>
              <button
                onClick={onClose}
                aria-label="Fermer"
                className="text-(--color-text-dim) hover:text-white text-2xl leading-none shrink-0"
              >
                &times;
              </button>
            </div>

            {project.role && <p className="text-sm text-(--color-text-dim) mb-4">{project.role}</p>}

            {project.description && (
              <p className="text-(--color-text-dim) leading-relaxed mb-4">{project.description}</p>
            )}

            {project.results && (
              <div className="mb-4">
                <p className="eyebrow mb-1">Resultats</p>
                <p className="text-(--color-text-dim) leading-relaxed">{project.results}</p>
              </div>
            )}

            {project.technologies.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {project.technologies.map((tech) => (
                  <span key={tech.id} className="font-mono text-xs border border-(--color-border) px-2 py-1">
                    {tech.name}
                  </span>
                ))}
              </div>
            )}

            {hasLink && (
              <a
                href={project.link}
                target="_blank"
                rel="noreferrer"
                className="inline-block px-6 py-3 font-medium text-black bg-(--color-accent) hover:brightness-110 transition-[filter]"
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
