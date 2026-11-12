import { motion } from 'framer-motion';
import { useState } from 'react';
import { useProjects } from '../../api/hooks';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { Chapter } from '../Chapter';
import { ProjectModal } from './parts/Modal';

/** Chapitre 05 — Les preuves : la grille respire, chaque carte est une histoire. */
export function ChapterProof() {
  const { data: projects = [] } = useProjects();
  const reduced = useReducedMotion();
  const [selected, setSelected] = useState<number | null>(null);
  const project = projects.find((p) => p.id === selected);

  return (
    <Chapter index="05" id="projects" title="Les preuves">
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {projects.map((p, i) => (
          <motion.button
            key={p.id}
            type="button"
            onClick={() => setSelected(p.id)}
            initial={reduced ? undefined : { opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.55, delay: (i % 3) * 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="group text-left border border-(--color-border) bg-white/[0.02] hover:bg-white/[0.05] hover:border-(--color-accent)/40 transition-colors cursor-pointer"
          >
            <div className="overflow-hidden aspect-video">
              <img
                src={p.image}
                alt={p.title}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover saturate-[0.4] group-hover:saturate-100 group-hover:scale-[1.03] transition-all duration-500"
              />
            </div>
            <div className="p-4 flex items-baseline justify-between gap-3 border-t border-(--color-border)">
              <div>
                <h3 className="font-semibold">{p.title}</h3>
                <p className="font-mono text-[10px] text-(--color-text-dim) mt-1 uppercase tracking-wider">{p.category}</p>
              </div>
              <span className="font-mono text-[10px] text-(--color-text-dim) shrink-0">
                {new Date(p.date).toLocaleDateString('fr-FR', { month: '2-digit', year: 'numeric' })}
              </span>
            </div>
          </motion.button>
        ))}
      </div>

      {project && <ProjectModal project={project} onClose={() => setSelected(null)} />}
    </Chapter>
  );
}
