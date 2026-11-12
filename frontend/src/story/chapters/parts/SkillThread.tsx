import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import type { Skill } from '../../../lib/types';

gsap.registerPlugin(ScrollTrigger);

/**
 * Colonne de compétences ch.02 : un FIL lumineux descend la colonne (scaleY
 * scrubé au scroll) et allume chaque barre à son passage (cascade 80 ms).
 * Remplissage en scaleX uniquement (transform only).
 */
export function SkillThread({ skills }: { skills: Skill[] }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const values = root.current!.querySelectorAll<HTMLElement>('[data-value]');

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: 'top 80%',
          end: 'bottom 55%',
          scrub: 0.6, // léger lissage du scrub
        },
      });
      // Le fil descend en premier.
      tl.fromTo('[data-thread]', { scaleY: 0 }, { scaleY: 1, ease: 'none', duration: 1 });
      // Les barres s'allument en cascade derrière le fil (jusqu'à leur cible).
      root.current!.querySelectorAll<HTMLElement>('[data-fill]').forEach((f, i) => {
        const target = parseFloat(f.dataset.target || '1');
        tl.fromTo(f, { scaleX: 0 }, { scaleX: target, duration: 0.32, ease: 'power2.out' }, 0.12 * i + 0.05);
      });
      values.forEach((v, i) => {
        tl.fromTo(v, { opacity: 0, x: -6 }, { opacity: 1, x: 0, duration: 0.25 }, 0.12 * i + 0.3);
      });
    },
    { scope: root },
  );

  return (
    <div ref={root} className="mt-16 max-w-2xl relative">
      {/* Le fil lumineux (scaleY, origin top) */}
      <span
        aria-hidden
        data-thread
        className="absolute -left-4 top-0 bottom-0 w-px bg-(--color-accent) origin-top will-change-transform opacity-70"
      />
      <div className="space-y-7 pl-6">
        {skills.map((skill) => (
          <div key={skill.id}>
            <div className="flex justify-between text-sm mb-2">
              <span>{skill.name}</span>
              <span data-value className="font-mono text-(--color-text-dim)">
                {skill.value}%
              </span>
            </div>
            <div className="h-px bg-(--color-border) overflow-hidden">
              {/* Remplissage animé par GSAP (fromTo scaleX 0→cible) */}
              <div
                data-fill
                data-target={skill.value / 100}
                className="h-full bg-(--color-accent) origin-left will-change-transform"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
