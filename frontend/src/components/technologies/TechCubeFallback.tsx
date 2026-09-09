import type { Technology } from '../../lib/types';

interface TechCubeFallbackProps {
  technologies: Technology[];
}

export function TechCubeFallback({ technologies }: TechCubeFallbackProps) {
  return (
    <div className="flex flex-wrap gap-3">
      {technologies.map((tech) => (
        <div
          key={tech.id}
          className="flex items-center gap-2 border border-(--color-border) rounded-full pl-2 pr-4 py-1.5"
        >
          <img src={tech.logo} alt={tech.name} className="h-6 w-6 rounded-full object-cover" />
          <span className="font-mono text-xs text-(--color-text-dim)">{tech.name}</span>
        </div>
      ))}
    </div>
  );
}
