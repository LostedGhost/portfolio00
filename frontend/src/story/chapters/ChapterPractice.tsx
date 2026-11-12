import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { useExperiences } from '../../api/hooks';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { Chapter } from '../Chapter';
import { BlocksIllustration } from '../specimens/Illustration';

gsap.registerPlugin(ScrollTrigger);

function formatMonthYear(iso: string) {
  return new Date(iso).toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' });
}

/**
 * Chapitre 03 — La pratique : la ligne se trace au scroll (scaleY scrub),
 * chaque point TOMBE depuis la ligne quand elle l'atteint (petit rebond
 * elastic une fois), les cartes glissent derrière.
 */
export function ChapterPractice() {
  const { data: experiences = [] } = useExperiences();
  const reduced = useReducedMotion();
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (reduced || !root.current) return;
      const line = root.current.querySelector('[data-line]');
      const items = root.current.querySelectorAll<HTMLElement>('[data-item]');
      if (!line) return;

      // Ligne : scaleY scrub 0→1 sur la traversée.
      gsap.fromTo(
        line,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: { trigger: root.current, start: 'top 70%', end: 'bottom 40%', scrub: 0.5 },
        },
      );

      items.forEach((item, i) => {
        // Le point tombe et rebondit une fois quand la ligne l'atteint.
        const dot = item.querySelector('[data-dot]');
        if (dot) {
          gsap.fromTo(
            dot,
            { y: -18, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              ease: 'bounce.out',
              duration: 0.55,
              scrollTrigger: { trigger: item, start: 'top 62%', toggleActions: 'play none none none' },
              delay: i * 0.04,
            },
          );
        }
        // La carte glisse depuis la ligne.
        gsap.fromTo(
          item,
          { x: -28, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            ease: 'power3.out',
            duration: 0.6,
            scrollTrigger: { trigger: item, start: 'top 65%', toggleActions: 'play none none none' },
          },
        );
      });
    },
    { scope: root, dependencies: [reduced, experiences.length] },
  );

  return (
    <Chapter
      ref={root}
      index="03"
      id="experience"
      title="La pratique"
      artwork={<BlocksIllustration className="h-60 w-64 opacity-80 hidden lg:block" />}
    >
      <div className="relative max-w-2xl">
        {/* La ligne qui se trace (origin top) */}
        <span
          aria-hidden
          data-line
          className="absolute left-[5px] top-1 bottom-1 w-px bg-(--color-accent) origin-top will-change-transform"
        />
        <ol className="space-y-14">
          {experiences.map((xp) => (
            <li key={xp.id} data-item className="relative pl-10 will-change-transform">
              <span
                data-dot
                aria-hidden
                className="absolute left-0 top-1.5 h-2.5 w-2.5 rounded-full bg-(--color-accent) opacity-0"
              />
              <p className="font-mono text-xs text-(--color-accent) mb-2">
                {formatMonthYear(xp.start_date)} — {xp.end_date ? formatMonthYear(xp.end_date) : 'en cours'}
              </p>
              <h3 className="text-xl font-semibold">{xp.company}</h3>
              <p className="text-sm text-(--color-text-dim) mb-2">{xp.type}</p>
              <p className="text-(--color-text-dim) leading-relaxed">{xp.description}</p>
            </li>
          ))}
        </ol>
      </div>
    </Chapter>
  );
}
