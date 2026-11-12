import { useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { useProjects } from '../../api/hooks';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { Chapter } from '../Chapter';
import { ProjectModal } from './parts/Modal';

gsap.registerPlugin(ScrollTrigger);

/**
 * Chapitre 05 — Les preuves : les cartes sont TIRÉES DES PROFONDEURS
 * (translateZ -60px + blur → net, stagger), le voile menthe monte du bas
 * au survol ; la fiche s'ouvre en modal sobre.
 */
export function ChapterProof() {
  const { data: projects = [] } = useProjects();
  const reduced = useReducedMotion();
  const [selected, setSelected] = useState<number | null>(null);
  const project = projects.find((p) => p.id === selected);
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (reduced) return;
      root.current!.querySelectorAll<HTMLElement>('[data-card]').forEach((card, i) => {
        gsap.fromTo(
          card,
          { opacity: 0, z: -60, filter: 'blur(8px)', y: 24 },
          {
            opacity: 1,
            z: 0,
            filter: 'blur(0px)',
            duration: 0.7,
            ease: 'power3.out',
            delay: (i % 3) * 0.09,
            scrollTrigger: { trigger: card, start: 'top 88%', toggleActions: 'play none none none' },
          },
        );
      });
    },
    { scope: root, dependencies: [reduced, projects.length] },
  );

  return (
    <Chapter ref={root} index="05" id="projects" title="Les preuves">
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {projects.map((p) => (
          <button
            key={p.id}
            type="button"
            data-card
            onClick={() => setSelected(p.id)}
            className="group text-left border border-(--color-border) bg-white/[0.02] hover:border-(--color-accent)/40 transition-colors cursor-pointer relative overflow-hidden will-change-transform"
          >
            {/* Voile menthe qui monte du bas au hover */}
            <span
              aria-hidden
              className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{ background: 'linear-gradient(to top, rgba(87,255,154,0.14), transparent)' }}
            />
            <div className="overflow-hidden aspect-video relative">
              <img
                src={p.image}
                alt={p.title}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover saturate-[0.35] group-hover:saturate-100 group-hover:scale-[1.03] transition-all duration-500"
              />
            </div>
            <div className="p-4 flex items-baseline justify-between gap-3 border-t border-(--color-border)">
              <div>
                <h3 className="font-semibold group-hover:translate-x-0.5 transition-transform duration-300">{p.title}</h3>
                <p className="font-mono text-[10px] text-(--color-text-dim) mt-1 uppercase tracking-wider">{p.category}</p>
              </div>
              <span className="font-mono text-[10px] text-(--color-text-dim) shrink-0">
                {new Date(p.date).toLocaleDateString('fr-FR', { month: '2-digit', year: 'numeric' })}
              </span>
            </div>
          </button>
        ))}
      </div>

      {project && <ProjectModal project={project} onClose={() => setSelected(null)} />}
    </Chapter>
  );
}
