import { useEffect } from 'react';
import type { Profile, SocialLink } from '../lib/types';

/**
 * Enriches the static Person JSON-LD (in index.html, the crawlable fallback)
 * with live data once it loads: real photo, and — most importantly for
 * getting Google to associate searches for the person's name with this
 * site — `sameAs` links to their other verified profiles (LinkedIn, GitHub,
 * ...). Googlebot renders JS, so this reaches it same as a static value.
 */
export function useStructuredData(profile: Profile | undefined, socialLinks: SocialLink[] | undefined) {
  useEffect(() => {
    if (!profile) return;
    const script = document.getElementById('ld-json-person');
    if (!script) return;

    let data: Record<string, unknown>;
    try {
      data = JSON.parse(script.textContent || '{}');
    } catch {
      return;
    }

    data.name = profile.full_name || data.name;
    data.jobTitle = profile.title || data.jobTitle;
    if (profile.email) data.email = `mailto:${profile.email}`;
    if (profile.photo) data.image = profile.photo;
    if (socialLinks && socialLinks.length > 0) {
      data.sameAs = socialLinks.map((link) => link.url);
    }

    script.textContent = JSON.stringify(data);
  }, [profile, socialLinks]);
}
