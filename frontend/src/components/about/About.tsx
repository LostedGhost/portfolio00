import { motion } from 'framer-motion';
import { useProfile, useSkills, useStatistics } from '../../api/hooks';
import { SectionWrapper } from '../layout/SectionWrapper';
import { SkillBar } from './SkillBar';
import { StatCounter } from './StatCounter';

export function About() {
  const { data: profile } = useProfile();
  const { data: skills = [] } = useSkills();
  const { data: stats = [] } = useStatistics();

  return (
    <SectionWrapper id="about" index={1} title="A propos">
      <div className="grid md:grid-cols-2 gap-12 items-start">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          {profile?.photo && (
            <img
              src={profile.photo}
              alt={profile.full_name}
              className="w-32 h-32 rounded-2xl object-cover border border-(--color-border)"
            />
          )}
          <p className="text-(--color-text-dim) leading-relaxed whitespace-pre-line">{profile?.description}</p>
          {profile?.cv && (
            <a
              href={profile.cv}
              target="_blank"
              rel="noreferrer"
              className="inline-block font-mono text-sm border-b border-(--color-border) pb-0.5 hover:text-white hover:border-(--color-accent) transition-colors"
            >
              Telecharger mon CV
            </a>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="space-y-5"
        >
          {skills.map((skill) => (
            <SkillBar key={skill.id} {...skill} />
          ))}
        </motion.div>
      </div>

      {stats.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16">
          {stats.map((stat) => (
            <StatCounter key={stat.id} {...stat} />
          ))}
        </div>
      )}
    </SectionWrapper>
  );
}
