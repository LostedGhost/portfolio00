import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { useTestimonials } from '../../api/hooks';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { Chapter } from '../Chapter';

gsap.registerPlugin(ScrollTrigger);

/** Interlude — Les échos : cartes-volets qui se déplient depuis la droite. */
export function ChapterEchoes() {
  const { data: testimonials = [] } = useTestimonials();
  const reduced = useReducedMotion();
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (reduced) return;
      root.current!.querySelectorAll<HTMLElement>('[data-echo]').forEach((el, i) => {
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
    { scope: root, dependencies: [reduced, testimonials.length] },
  );

  if (testimonials.length === 0) return null;

  return (
    <Chapter ref={root} index="05+" id="echoes" title="Les échos">
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {testimonials.map((t) => (
          <figure
            key={t.id}
            data-echo
            className="border border-(--color-border) bg-white/[0.02] p-6 flex flex-col will-change-transform opacity-0"
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
