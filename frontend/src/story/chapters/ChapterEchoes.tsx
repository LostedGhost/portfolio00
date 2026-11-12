import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { useTestimonials } from '../../api/hooks';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { Chapter } from '../Chapter';

gsap.registerPlugin(ScrollTrigger);

/**
 * Interlude — Les échos : cartes-volets qui se déplient depuis la droite.
 * NOTE ROBUSTESSE : l'early-return (aucun témoignage) se fait AVANT le
 * hook useGSAP — sinon le composant rend null et useGSAP tourne sur un
 * scope null (crash 'n.current is null').
 */
export function ChapterEchoes() {
  const { data: testimonials = [] } = useTestimonials();
  const reduced = useReducedMotion();
  const root = useRef<HTMLElement>(null);
  const hasContent = testimonials.length > 0;

  useGSAP(
    () => {
      if (reduced || !root.current) return;
      root.current.querySelectorAll<HTMLElement>('[data-echo]').forEach((el, i) => {
        gsap.fromTo(
          el,
          { rotationY: -15, opacity: 0, transformPerspective: 900, transformOrigin: 'right center' },
          {
            rotationY: 0,
            opacity: 1,
            duration: 0.65,
            ease: 'power3.out',
            delay: i * 0.09,
            scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' },
          },
        );
      });
    },
    { scope: root, dependencies: [reduced, hasContent] },
  );

  if (!hasContent) return null;

  return (
    <Chapter ref={root} index="05+" id="echoes" title="Les échos">
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {testimonials.map((t) => (
          <figure
            key={t.id}
            data-echo
            className="border border-(--color-border) bg-white/[0.02] p-6 flex flex-col will-change-transform"
          >
            <blockquote className="text-(--color-text-dim) leading-relaxed flex-1">« {t.content} »</blockquote>
            <figcaption className="flex items-center gap-3 mt-6 pt-4 border-t border-(--color-border)">
              {t.photo && (
                <img src={t.photo} alt="" loading="lazy" decoding="async" className="h-9 w-9 rounded-full object-cover" />
              )}
              <div>
                <p className="text-sm font-medium">{t.author_name}</p>
                {t.author_role && <p className="font-mono text-[10px] text-(--color-text-dim)">{t.author_role}</p>}
              </div>
            </figcaption>
          </figure>
        ))}
      </div>
    </Chapter>
  );
}
