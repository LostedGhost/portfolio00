import type { Education } from '../../lib/types';

function formatYear(iso: string | null) {
  return iso ? new Date(iso).getFullYear() : 'Present';
}

export function EducationItem({ institution, degree, start_date, end_date, description }: Education) {
  return (
    <div className="py-4 border-b border-(--color-border)">
      <p className="font-mono text-xs text-(--color-text-dim) mb-1">
        {formatYear(start_date)} — {formatYear(end_date)}
      </p>
      <h4 className="font-medium">{degree}</h4>
      <p className="text-sm text-(--color-text-dim)">{institution}</p>
      {description && <p className="text-sm text-(--color-text-dim) mt-2">{description}</p>}
    </div>
  );
}
