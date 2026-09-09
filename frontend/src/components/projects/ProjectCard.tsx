import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useState, type MouseEvent } from 'react';
import type { Project } from '../../lib/types';
import { ProjectModal } from './ProjectModal';

interface ProjectCardProps extends Project {
  featured?: boolean;
}

export function ProjectCard(project: ProjectCardProps) {
  const { title, category, date, image, featured } = project;
  const [open, setOpen] = useState(false);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [10, -10]), { stiffness: 200, damping: 20 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-10, 10]), { stiffness: 200, damping: 20 });

  function handleMouseMove(e: MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <>
      <motion.div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={() => setOpen(true)}
        style={{ rotateX, rotateY, transformPerspective: 800 }}
        className={`border border-(--color-border) overflow-hidden group cursor-pointer ${featured ? 'sm:col-span-2' : ''}`}
      >
        <div className={`overflow-hidden ${featured ? 'aspect-[21/9]' : 'aspect-video'}`}>
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
          />
        </div>
        <div className="p-5 flex items-baseline justify-between gap-4 border-t border-(--color-border)">
          <div>
            <h3 className="font-semibold text-lg">{title}</h3>
            <p className="font-mono text-xs text-(--color-text-dim) mt-1 uppercase tracking-wide">{category}</p>
          </div>
          <p className="font-mono text-xs text-(--color-text-dim) shrink-0">
            {new Date(date).toLocaleDateString('fr-FR', { month: '2-digit', year: 'numeric' })}
          </p>
        </div>
      </motion.div>

      {open && <ProjectModal project={project} onClose={() => setOpen(false)} />}
    </>
  );
}
