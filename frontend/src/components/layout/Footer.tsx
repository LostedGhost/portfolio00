import { useProfile } from '../../api/hooks';
import { SocialLinks } from '../shared/SocialLinks';

export function Footer() {
  const { data: profile } = useProfile();

  return (
    <footer className="border-t border-(--color-border) py-8 flex flex-col md:flex-row items-center justify-between gap-4 px-6 max-w-6xl mx-auto text-sm text-(--color-text-dim)">
      <p>
        &copy; {new Date().getFullYear()}{' '}
        <span className="text-white">{profile?.site_name || profile?.full_name}</span>. Tous droits
        reserves.
      </p>
      <SocialLinks />
    </footer>
  );
}
