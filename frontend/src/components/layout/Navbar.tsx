import { useEffect, useState } from 'react';
import { useCertifications, useEducation, useProfile } from '../../api/hooks';
import { SocialLinks } from '../shared/SocialLinks';

const BASE_LINKS = [
  { href: '#about', label: 'A propos' },
  { href: '#experience', label: 'Experience' },
  { href: '#formation', label: 'Formation' },
  { href: '#technologies', label: 'Competences' },
  { href: '#projects', label: 'Projets' },
  { href: '#contact', label: 'Contact' },
];

export function Navbar() {
  const { data: profile } = useProfile();
  const { data: education = [] } = useEducation();
  const { data: certifications = [] } = useCertifications();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const hasFormation = education.length > 0 || certifications.length > 0;
  const LINKS = BASE_LINKS.filter((l) => l.href !== '#formation' || hasFormation);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-colors duration-300 ${
        scrolled ? 'glass' : 'bg-transparent border-b border-transparent'
      }`}
    >
      <nav className="max-w-6xl mx-auto flex items-center justify-between px-5 py-3">
        <a href="#hero" className="flex items-center gap-2">
          {profile?.logo && <img src={profile.logo} alt="Logo" className="h-9 w-9 rounded-full object-cover" />}
          <span className="font-display font-semibold text-lg">{profile?.full_name?.split(' ')[0] ?? 'Portfolio'}</span>
        </a>

        <div className="hidden md:flex items-center gap-8">
          <ul className="flex items-center gap-8 text-sm text-(--color-text-dim)">
            {LINKS.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="hover:text-white transition-colors">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <SocialLinks />
        </div>

        <button
          onClick={() => setOpen((v) => !v)}
          className="md:hidden flex flex-col gap-1.5 p-2"
          aria-label="Menu"
        >
          <span className="w-6 h-0.5 bg-white" />
          <span className="w-6 h-0.5 bg-white" />
          <span className="w-6 h-0.5 bg-white" />
        </button>
      </nav>

      {open && (
        <ul className="md:hidden glass px-5 pb-5 flex flex-col gap-4 text-(--color-text-dim)">
          {LINKS.map((l) => (
            <li key={l.href}>
              <a href={l.href} onClick={() => setOpen(false)} className="hover:text-white">
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      )}
    </header>
  );
}
