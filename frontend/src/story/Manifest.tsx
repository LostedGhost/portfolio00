import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { useReducedMotion } from '../hooks/useReducedMotion';

gsap.registerPlugin(ScrollTrigger);

interface ManifestProps {
  text: string;
  /** Index du chapitre, affiché en mono à gauche. */
  index: string;
}

/**
 * Phrase-manifeste scroll-driven (way Luke Baffait) — version GSAP scrub :
 * les mots se révèlent par clip-path (rendu « tracé », pas juste opacité),
 * le bloc flotte à contre-courant du scroll (parallaxe douce).
 * La révélation est un scrub linéaire (progress = scroll), aucune timeline
 * temporelle : c'est la page qui écrit.
 */
export function Manifest({ text, index }: ManifestProps) {
  const reduced = useReducedMotion();
  const root = useRef<HTMLElement>(null);
  const p = useRef<HTMLParagraphElement>(null);

  useGSAP(
    () => {
      if (reduced) return;
      const words = p.current!.querySelectorAll<HTMLElement>('[data-word]');
      // Chaque mot : clip-path inset(0 100% 0 0) → inset(0 0% 0 0) = tracé
      // gauche→droite. Stagger 0.06, scrub linéaire sur la traversée.
      gsap.fromTo(
        words,
        { clipPath: 'inset(0 100% 0 0)', y: 12 },
        {
          clipPath: 'inset(0 0% 0 0)',
          y: 0,
          stagger: 0.06,
          ease: 'none',
          scrollTrigger: {
            trigger: root.current,
            start: 'top 85%',
            end: 'top 30%',
            scrub: true,
          },
        },
      );
      // Parallaxe du bloc entier.
      gsap.fromTo(
        p.current!,
        { yPercent: 14 },
        {
          yPercent: -14,
          ease: 'none',
          scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: true },
        },
      );
    },
    { scope: root, dependencies: [reduced, text] },
  );

  return (
    <section ref={root} className="section min-h-[72vh] flex items-center gap-6 md:gap-10">
      <span className="font-mono text-sm text-(--color-text-dim) shrink-0 select-none self-start pt-2">
        ({index})
      </span>
      <p ref={p} className="text-3xl md:text-5xl lg:text-6xl font-semibold leading-tight max-w-4xl">
        {text.split(' ').map((word, i) => (
          <span key={i} data-word className="inline-block mr-[0.28em] will-change-transform">
            {word}
          </span>
        ))}
      </p>
    </section>
  );
}

/**
 * Événement 'story:send' (déclenché à l'envoi du contact, ch.06) :
 * le manifeste 06 « se défait » — les mots remontent en re-floutant,
 * dans l'ordre inverse, puis se reposent (ré-écriture) ; le dé fait
 * une révolution complète côté 3D (écouteur dans StoryScene).
 */
if (typeof window !== 'undefined') {
  window.addEventListener('story:send', () => {
    const last = document.querySelectorAll<HTMLElement>('[data-word]');
    if (!last.length) return;
    gsap.fromTo(
      last,
      { filter: 'blur(0px)', y: 0, opacity: 1 },
      {
        filter: 'blur(6px)',
        y: -26,
        opacity: 0.15,
        stagger: { each: 0.04, from: 'end' },
        duration: 0.9,
        ease: 'power2.in',
      },
    );
  });
}
