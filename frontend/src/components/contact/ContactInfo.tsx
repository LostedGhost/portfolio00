import { useContactInfo } from '../../api/hooks';
import { SocialLinks } from '../shared/SocialLinks';

export function ContactInfo() {
  const { data: info } = useContactInfo();

  if (!info) return null;

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-(--color-text-dim)">Adresse</p>
        <p className="text-lg">{info.address}</p>
      </div>
      <div>
        <p className="text-sm text-(--color-text-dim)">Telephone</p>
        <p className="text-lg">{info.phone}</p>
      </div>
      <div>
        <p className="text-sm text-(--color-text-dim)">Email</p>
        <a href={`mailto:${info.email}`} className="text-lg text-(--color-accent) hover:underline">
          {info.email}
        </a>
      </div>
      <SocialLinks className="pt-2" />
    </div>
  );
}
