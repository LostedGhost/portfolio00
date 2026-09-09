import { useSocialLinks } from '../../api/hooks';
import { SocialIcon } from './SocialIcon';

export function SocialLinks({ className = '' }: { className?: string }) {
  const { data: links = [] } = useSocialLinks();

  if (links.length === 0) return null;

  return (
    <div className={`flex items-center gap-4 ${className}`}>
      {links.map((link) => (
        <a
          key={link.id}
          href={link.url}
          target="_blank"
          rel="noreferrer"
          aria-label={link.platform}
          className="text-(--color-text-dim) hover:text-(--color-accent) transition-colors"
        >
          <SocialIcon platform={link.platform} />
        </a>
      ))}
    </div>
  );
}
