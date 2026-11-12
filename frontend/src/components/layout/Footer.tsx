import { useProfile } from '../../api/hooks';
import { SocialLinks } from '../../story/chapters/parts/SocialLinks';

/** Fin du récit : signature sobre, liens recommencer. */
export function Footer() {
  const { data: profile } = useProfile();

  return (
    <footer className="border-t border-(--color-border) py-10 px-6 md:px-16">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 font-mono text-xs text-(--color-text-dim)">
        <p>
          © {new Date().getFullYear()} {profile?.site_name || profile?.full_name} — histoire construite avec soin.
        </p>
        <div className="flex items-center gap-6">
          <SocialLinks />
          <a href="#hero" className="hover:text-(--color-accent) transition-colors">
            ↑ Rejouer
          </a>
        </div>
      </div>
    </footer>
  );
}
