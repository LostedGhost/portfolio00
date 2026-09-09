import { useTechnologies } from '../../api/hooks';
import { useDeviceTier } from '../../hooks/useDeviceTier';
import { useInView } from '../../hooks/useInView';
import { SectionWrapper } from '../layout/SectionWrapper';
import { TechCube } from './TechCube';
import { TechCubeFallback } from './TechCubeFallback';

export function TechGrid() {
  const { data: technologies = [] } = useTechnologies();
  const tier = useDeviceTier();
  const { ref, inView } = useInView<HTMLDivElement>();

  return (
    <SectionWrapper id="technologies" index={4} title="Technologies" subtitle="Survolez un cube pour reveler la technologie">
      <div ref={ref}>
        {tier === 'full' ? (
          <TechCube technologies={technologies} active={inView} />
        ) : (
          <TechCubeFallback technologies={technologies} />
        )}
      </div>
    </SectionWrapper>
  );
}
