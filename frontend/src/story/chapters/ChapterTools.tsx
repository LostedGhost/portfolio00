import { useTechnologies } from '../../api/hooks';
import { useDeviceTier } from '../../hooks/useDeviceTier';
import { Chapter } from '../Chapter';
import { TechScene, TechSceneFallback } from './parts/TechScene';

/** Chapitre 04 — Les instruments : peu d'outils, tous maîtrisés. */
export function ChapterTools() {
  const { data: technologies = [] } = useTechnologies();
  const tier = useDeviceTier();

  return (
    <Chapter index="04" id="technologies" title="Les instruments">
      <p className="text-(--color-text-dim) max-w-md mb-14 font-mono text-sm">
        Survolez un instrument pour le nommer.
      </p>
      <div className="h-[420px] md:h-[540px]">
        {tier === 'full' ? <TechScene technologies={technologies} /> : <TechSceneFallback technologies={technologies} />}
      </div>
    </Chapter>
  );
}
