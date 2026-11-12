import { useSocialLinks } from '../../../api/hooks';
import { SocialIcon } from './SocialIcon';

/** Réseaux sociaux : liste sobre, libellés complets. */
export function SocialLinks({ className = '' }: { className?: string }) {
  const { data: links = [] } = useSocialLinks();
  if (links.length === 0) return null;

  return (
    <ul className={`flex items-center gap-5 ${className}`}>
      {links.map((link) => (
        <li key={link.id}>
          <a
            href={link.url}
            target="_blank"
            rel="noreferrer"
            aria-label={link.platform}
            className="flex items-center gap-2 text-(--color-text-dim) hover:text-(--color-accent) transition-colors font-mono text-xs"
          >
            <SocialIcon platform={link.platform} />
            {link.platform}
          </a>
        </li>
      ))}
    </ul>
  );
}
