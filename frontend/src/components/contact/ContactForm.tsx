import { useState, type FormEvent } from 'react';
import { useSendMessage } from '../../api/hooks';

export function ContactForm() {
  const sendMessage = useSendMessage();
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '', website: '' });

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    sendMessage.mutate(form, {
      onSuccess: () => setForm({ name: '', email: '', subject: '', message: '', website: '' }),
    });
  }

  return (
    <form onSubmit={handleSubmit} className="border border-(--color-border) p-6 md:p-8 space-y-4">
      {/* Honeypot: hidden from real visitors, bots tend to fill every field */}
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

      <div className="grid sm:grid-cols-2 gap-4">
        <input
          required
          placeholder="Votre nom"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="bg-white/5 border border-(--color-border) px-4 py-3 outline-none focus:border-(--color-accent) transition-colors"
        />
        <input
          required
          type="email"
          placeholder="Votre email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="bg-white/5 border border-(--color-border) px-4 py-3 outline-none focus:border-(--color-accent) transition-colors"
        />
      </div>
      <input
        placeholder="Sujet"
        value={form.subject}
        onChange={(e) => setForm({ ...form, subject: e.target.value })}
        className="w-full bg-white/5 border border-(--color-border) px-4 py-3 outline-none focus:border-(--color-accent) transition-colors"
      />
      <textarea
        required
        placeholder="Votre message"
        rows={5}
        value={form.message}
        onChange={(e) => setForm({ ...form, message: e.target.value })}
        className="w-full bg-white/5 border border-(--color-border) rounded-lg px-4 py-3 outline-none focus:border-(--color-accent) transition-colors resize-none"
      />

      <button
        type="submit"
        disabled={sendMessage.isPending}
        className="w-full px-6 py-3 font-medium text-black bg-(--color-accent) hover:brightness-110 transition-[filter] disabled:opacity-50"
      >
        {sendMessage.isPending ? 'Envoi...' : 'Envoyer le message'}
      </button>

      {sendMessage.isSuccess && <p className="text-green-400 text-sm text-center">Message envoye avec succes !</p>}
      {sendMessage.isError && (
        <p className="text-red-400 text-sm text-center">Une erreur est survenue, reessayez plus tard.</p>
      )}
    </form>
  );
}
