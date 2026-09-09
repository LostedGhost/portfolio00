import { useExperiences } from '../../api/hooks';
import { SectionWrapper } from '../layout/SectionWrapper';
import { ExperienceItem } from './ExperienceItem';

export function ExperienceTimeline() {
  const { data: experiences = [] } = useExperiences();

  return (
    <SectionWrapper id="experience" index={2} title="Experience" subtitle="Parcours professionnel et academique">
      <div className="max-w-2xl mx-auto">
        {experiences.map((exp) => (
          <ExperienceItem key={exp.id} {...exp} />
        ))}
      </div>
    </SectionWrapper>
  );
}
