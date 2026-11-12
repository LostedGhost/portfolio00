import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { useProfile, useSkills, useStatistics } from '../../api/hooks';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { Chapter } from '../Chapter';
import { PathIllustration } from '../specimens/Illustration';
import { SkillThread } from './parts/SkillThread';
import { StatRow } from './parts/StatRow';

gsap.registerPlugin(ScrollTrigger);

/** Chapitre 02 — Le chemin : qui je suis, d'où je pars, ce que je mesure. */
export function ChapterAbout() {
  const { data: profile } = useProfile();
  const { data: skills = [] } = useSkills();
  const { data: stats = [] } = useStatistics();
  const reduced = useReducedMotion();
  const root = useRef<HTMLElement>(null);

  // Photo : révélation par fenêtre circulaire (cercle → carré arrondi).
  useGSAP(
    () => {
      if (reduced) return;
      const photo = root.current!.querySelector<HTMLElement>('[data-photo]');
      if (photo) {
        gsap.fromTo(
          photo,
          { clipPath: 'circle(18% at 30% 30%)', scale: 1.08 },
          {
            clipPath: 'circle(75% at 50% 50%)',
            scale: 1,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: { trigger: photo, start: 'top 85%', end: 'top 45%', scrub: 0.5 },
          },
        );
      }
    },
    { scope: root, dependencies: [reduced, profile?.photo] },
  );

  return (
    <Chapter
      ref={root}
      index="02"
      id="about"
      title="Le chemin"
      artwork={<PathIllustration className="h-64 w-80 opacity-90 hidden lg:block" />}
    >
      <div className="grid md:grid-cols-[auto_1fr] gap-10 md:gap-16 items-start">
        {profile?.photo && (
          <img
            data-photo
            src={profile.photo}
            alt={profile.full_name}
            loading="lazy"
            decoding="async"
            className="w-28 h-28 md:w-36 md:h-36 rounded-2xl object-cover border border-(--color-border) will-change-[clip-path,transform]"
          />
        )}
        <div className="space-y-6 max-w-2xl">
          <p className="text-(--color-text) leading-relaxed text-lg whitespace-pre-line">{profile?.description}</p>
          {profile?.cv && (
            <a
              href={profile.cv}
              target="_blank"
              rel="noreferrer"
              className="inline-block font-mono text-sm border-b border-(--color-border) pb-0.5 hover:text-(--color-accent) hover:border-(--color-accent) transition-colors"
            >
              Télécharger mon CV
            </a>
          )}
        </div>
      </div>

      {stats.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16">
          {stats.map((s) => (
            <StatRow key={s.id} {...s} />
          ))}
        </div>
      )}

      {/* Le fil lumineux allume les compétences une à une */}
      <SkillThread skills={skills} />
    </Chapter>
  );
}
