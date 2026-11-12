/**
 * Respiration entre ch.04 et ch.05 : un marquee discret des outils
 * (JetBrains Mono, très bas contraste, mouvement lent continu).
 */
import { useTechnologies } from '../../api/hooks';
import { useReducedMotion } from '../../hooks/useReducedMotion';

export function TechMarquee() {
  const { data: technologies = [] } = useTechnologies();
  const reduced = useReducedMotion();
  if (technologies.length === 0) return null;

  const line = technologies.map((t) => t.name).join('   /   ') + '   /   ';

  return (
    <div aria-hidden className="relative py-10 overflow-hidden select-none">
      <div
        className="whitespace-nowrap font-mono text-xs tracking-[0.4em] text-(--color-text-dim)"
        style={{
          opacity: 0.35,
          animation: reduced ? undefined : 'marquee 28s linear infinite',
        }}
      >
        {line}
        {line}
      </div>
    </div>
  );
}
