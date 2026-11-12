import { useState, type FormEvent } from 'react';
import { motion } from 'framer-motion';
import { isLocal } from '../../api/client';
import { useContactInfo, useSendMessage } from '../../api/hooks';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { Chapter } from '../Chapter';
import { SocialLinks } from './parts/SocialLinks';

/** Chapitre 06 — La continuité : contact, sans surcharge. */
export function ChapterContinuity() {
  const sendMessage = useSendMessage();
  const { data: info } = useContactInfo();
  const reduced = useReducedMotion();
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '', website: '' });
  const [sent, setSent] = useState(false);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (isLocal) {
      const to = info?.email || 'contact@example.com';
      const subject = encodeURIComponent(form.subject ? `[Site] ${form.subject}` : '[Site] Nouveau message');
      const body = encodeURIComponent(`Nom : ${form.name}\nEmail : ${form.email}\n\n${form.message}`);
      window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;
      setSent(true);
      return;
    }
    sendMessage.mutate(form, {
      onSuccess: () => setForm({ name: '', email: '', subject: '', message: '', website: '' }),
    });
  }

  const field =
    'w-full bg-white/[0.03] border border-(--color-border) px-4 py-3 outline-none focus:border-(--color-accent) transition-colors text-(--color-text)';

  return (
    <Chapter index="06" id="contact" title="La continuité">
      <div className="grid md:grid-cols-2 gap-12 items-start max-w-4xl">
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

        <motion.form
          onSubmit={handleSubmit}
          initial={reduced ? undefined : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="space-y-3"
        >
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
              placeholder="Votre nom"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className={field}
            />
            <input
              required
              type="email"
              placeholder="Votre email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className={field}
            />
          </div>
          <input
            placeholder="Sujet"
            value={form.subject}
            onChange={(e) => setForm({ ...form, subject: e.target.value })}
            className={field}
          />
          <textarea
            required
            placeholder="Votre message"
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
            {!isLocal && sendMessage.isPending ? 'Envoi…' : isLocal ? 'Ouvrir mon client mail' : 'Envoyer le message'}
          </button>
          {isLocal && sent && (
            <p className="text-(--color-accent) text-sm text-center font-mono">Votre client mail s'est ouvert — il ne reste qu'à envoyer.</p>
          )}
          {!isLocal && sendMessage.isSuccess && (
            <p className="text-(--color-accent) text-sm text-center font-mono">Message envoyé, merci !</p>
          )}
          {!isLocal && sendMessage.isError && (
            <p className="text-red-400 text-sm text-center font-mono">Une erreur est survenue, réessayez plus tard.</p>
          )}
        </motion.form>
      </div>
    </Chapter>
  );
}
