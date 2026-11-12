import { useProfile, useSkills, useStatistics } from '../../api/hooks';
import { Chapter } from '../Chapter';
import { PathIllustration } from '../specimens/Illustration';
import { SkillBar } from './parts/SkillBar';
import { StatRow } from './parts/StatRow';

/** Chapitre 02 — Le chemin : qui je suis, d'où je pars, ce que je mesure. */
export function ChapterAbout() {
  const { data: profile } = useProfile();
  const { data: skills = [] } = useSkills();
  const { data: stats = [] } = useStatistics();

  return (
    <Chapter index="02" id="about" title="Le chemin" artwork={<PathIllustration className="h-64 w-80 opacity-90 hidden lg:block" />}>
      <div className="grid md:grid-cols-[auto_1fr] gap-10 md:gap-16 items-start">
        {profile?.photo && (
          <img
            src={profile.photo}
            alt={profile.full_name}
            loading="lazy"
            decoding="async"
            className="w-28 h-28 md:w-36 md:h-36 rounded-2xl object-cover border border-(--color-border)"
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

      {/* Ce que je mesure : les chiffres avancent en ligne, discret */}
      {stats.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16">
          {stats.map((s) => (
            <StatRow key={s.id} {...s} />
          ))}
        </div>
      )}

      {/* Les compétences montent en douceur, une à une */}
      <div className="mt-16 max-w-2xl space-y-6">
        {skills.map((skill, i) => (
          <SkillBar key={skill.id} {...skill} delay={i * 0.08} />
        ))}
      </div>
    </Chapter>
  );
}
