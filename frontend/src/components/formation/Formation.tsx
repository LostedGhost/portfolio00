import { useCertifications, useEducation } from '../../api/hooks';
import { SectionWrapper } from '../layout/SectionWrapper';
import { CertificationItem } from './CertificationItem';
import { EducationItem } from './EducationItem';

export function Formation() {
  const { data: education = [] } = useEducation();
  const { data: certifications = [] } = useCertifications();

  if (education.length === 0 && certifications.length === 0) return null;

  return (
    <SectionWrapper id="formation" index={3} title="Formation" subtitle="Diplomes et certifications">
      <div className="grid md:grid-cols-2 gap-12">
        {education.length > 0 && (
          <div>
            <p className="eyebrow mb-4">Education</p>
            {education.map((e) => (
              <EducationItem key={e.id} {...e} />
            ))}
          </div>
        )}
        {certifications.length > 0 && (
          <div>
            <p className="eyebrow mb-4">Certifications</p>
            {certifications.map((c) => (
              <CertificationItem key={c.id} {...c} />
            ))}
          </div>
        )}
      </div>
    </SectionWrapper>
  );
}
