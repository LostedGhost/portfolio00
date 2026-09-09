import type { Certification } from '../../lib/types';

export function CertificationItem({ name, issuer, date_obtained, credential_url }: Certification) {
  const content = (
    <>
      <div>
        <h4 className="font-medium">{name}</h4>
        <p className="text-sm text-(--color-text-dim)">{issuer}</p>
      </div>
      <p className="font-mono text-xs text-(--color-text-dim) shrink-0">
        {new Date(date_obtained).getFullYear()}
      </p>
    </>
  );

  const className = 'flex items-baseline justify-between gap-4 py-3 border-b border-(--color-border)';

  if (credential_url) {
    return (
      <a href={credential_url} target="_blank" rel="noreferrer" className={`${className} hover:border-(--color-accent) transition-colors group`}>
        {content}
      </a>
    );
  }

  return <div className={className}>{content}</div>;
}
