import { useTestimonials } from '../../api/hooks';
import { SectionWrapper } from '../layout/SectionWrapper';
import { TestimonialCard } from './TestimonialCard';

export function Testimonials() {
  const { data: testimonials = [] } = useTestimonials();

  if (testimonials.length === 0) return null;

  return (
    <SectionWrapper id="testimonials" index={6} title="Temoignages" subtitle="Ce que mes clients en disent">
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {testimonials.map((t) => (
          <TestimonialCard key={t.id} {...t} />
        ))}
      </div>
    </SectionWrapper>
  );
}
