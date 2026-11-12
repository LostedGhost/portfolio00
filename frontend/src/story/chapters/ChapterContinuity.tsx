import { useRef, useState, type FormEvent } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { isLocal } from '../../api/client';
import { useContactInfo, useSendMessage } from '../../api/hooks';
import { useDrawOnScroll } from '../useDrawOnScroll';
import { Chapter } from '../Chapter';
import { SocialLinks } from './parts/SocialLinks';

gsap.registerPlugin(ScrollTrigger);

/**
 * Chapitre 06 — La continuité : anneau HUD tracé autour du formulaire au
 * scroll, liseré menthe qui suit le focus de champ en champ. Le manifeste
 * correspondant vit dans App (Manifest 06).
 */
export function ChapterContinuity() {
  const sendMessage = useSendMessage();
  const { data: info } = useContactInfo();
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '', website: '' });
  const [sent, setSent] = useState(false);
  const root = useRef<HTMLElement>(null);
  const panel = useRef<HTMLDivElement>(null);

  // Anneau HUD tracé autour du panneau contact (reduced-motion = tracé complet).
  useDrawOnScroll(root, { start: 'top 80%', end: 'top 30%' });

  // Anneau HUD tracé autour du panneau contact.
  useDrawOnScroll(root, { start: 'top 80%', end: 'top 30%' });

  // Liseré menthe : suit le focus de champ en champ (FLIP manuel du cadre).
  useGSAP(
    () => {
      const form = root.current!.querySelector('form');
      if (!form) return;
      const fields = form.querySelectorAll<HTMLElement>('input:not([tabindex="-1"]), textarea');
      const ring = document.createElement('span');
      ring.setAttribute('aria-hidden', 'true');
      ring.style.cssText =
        'position:absolute;pointer-events:none;border:1px solid var(--color-accent);border-radius:2px;opacity:0;transition:opacity .2s;z-index:1';
      form.appendChild(ring);

      const moveTo = (el: HTMLElement | null) => {
        if (!el) {
          gsap.to(ring, { opacity: 0, duration: 0.25 });
          return;
        }
        const parentRect = form.getBoundingClientRect();
        const r = el.getBoundingClientRect();
        gsap.to(ring, {
          left: r.left - parentRect.left - 3,
          top: r.top - parentRect.top - 3,
          width: r.width + 4,
          height: r.height + 4,
          opacity: 1,
          duration: 0.3,
          ease: 'power3.out',
        });
      };
      fields.forEach((f) => {
        f.addEventListener('focus', () => moveTo(f));
        f.addEventListener('blur', () => moveTo(null));
      });
      return () => {
        fields.forEach((f) => {
          f.removeEventListener('focus', () => moveTo(f));
          f.removeEventListener('blur', () => moveTo(null));
        });
      };
    },
    { scope: root },
  );

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (isLocal) {
      const to = info?.email || 'contact@example.com';
      const subject = encodeURIComponent(form.subject ? `[Site] ${form.subject}` : '[Site] Nouveau message');
      const body = encodeURIComponent(`Nom : ${form.name}\nEmail : ${form.email}\n\n${form.message}`);
      window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;
      // Le récit boucle : le manifeste 06 « se défait » + le dé fait un tour.
      window.dispatchEvent(new CustomEvent('story:send'));
      setSent(true);
      return;
    }
    sendMessage.mutate(form, {
      onSuccess: () => {
        setForm({ name: '', email: '', subject: '', message: '', website: '' });
        window.dispatchEvent(new CustomEvent('story:send'));
      },
    });
  }

  const field =
    'w-full bg-white/[0.03] border border-(--color-border) px-4 py-3 outline-none focus:border-(--color-accent) transition-colors text-(--color-text) relative';

  return (
    <Chapter ref={root} index="06" id="contact" title="La continuité">
      <div ref={panel} className="grid md:grid-cols-2 gap-12 items-start max-w-4xl">
        <div className="space-y-6">
          {info?.address && (
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-(--color-text-dim) mb-1">Là où je suis</p>
              <p className="text-lg">{info.address}</p>
            </div>
          )}
          {info?.phone && (
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-(--color-text-dim) mb-1">Par téléphone</p>
              <p className="text-lg">{info.phone}</p>
            </div>
          )}
          {info?.email && (
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-(--color-text-dim) mb-1">Par écrit</p>
              <a href={`mailto:${info.email}`} className="text-lg text-(--color-accent) hover:underline">
                {info.email}
              </a>
            </div>
          )}
          <SocialLinks className="pt-2" />
        </div>

        {/* Panneau contact : l'anneau HUD se trace autour (SVG overlay). */}
        <div className="relative p-1">
          <svg aria-hidden className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none" viewBox="0 0 100 100">
            <rect
              x="1"
              y="1"
              width="98"
              height="98"
              fill="none"
              stroke="var(--color-accent)"
              strokeWidth="0.4"
              rx="6"
              opacity="0.45"
              vectorEffect="non-scaling-stroke"
              data-draw
              pathLength={100}
              style={{ strokeDasharray: 100 }}
            />
          </svg>
          <form onSubmit={handleSubmit} className="relative space-y-3">
            <input
              type="text"
              name="website"
              value={form.website}
              onChange={(e) => setForm({ ...form, website: e.target.value })}
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              className="absolute -left-[9999px] w-px h-px opacity-0"
            />
            <div className="grid sm:grid-cols-2 gap-3">
              <input
                required
                placeholder="Comment vous appelez-vous ?"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className={field}
              />
              <input
                required
                type="email"
                placeholder="Votre email — promis, pas de spam"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className={field}
              />
            </div>
            <input
              placeholder="Sujet (le dé résume bien, mais bon)"
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
              className={field}
            />
            <textarea
              required
              placeholder="Racontez. Une question simple suffit."
              rows={5}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className={`${field} resize-none`}
            />
            <button
              type="submit"
              disabled={!isLocal && sendMessage.isPending}
              className="w-full px-6 py-3 font-medium text-black bg-(--color-accent) hover:brightness-110 active:scale-[0.99] transition disabled:opacity-50"
            >
              {!isLocal && sendMessage.isPending ? 'Envoi…' : isLocal ? 'Lancer le mail' : 'Envoyer le message'}
            </button>
            {isLocal && sent && (
              <p className="text-(--color-accent) text-sm text-center font-mono">Votre client mail est ouvert — la suite est à vous.</p>
            )}
            {!isLocal && sendMessage.isSuccess && (
              <p className="text-(--color-accent) text-sm text-center font-mono">Message envoyé. Réponse sous 48 h, promis.</p>
            )}
            {!isLocal && sendMessage.isError && (
              <p className="text-red-400 text-sm text-center font-mono">Le serveur a toussé. Réessayez, il se reprend.</p>
            )}
          </form>
        </div>
      </div>
    </Chapter>
  );
}
