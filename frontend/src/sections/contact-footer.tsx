import { useEffect, useRef, useState, type FormEvent } from 'react'
import { gsap, useGSAP, prefersReducedMotion } from '@/lib/motion'
import { contact, site } from '@/config/portfolio'
import { Brand } from '@/components/brand'
import { Icon } from '@/components/icon'
import { RollLink } from '@/components/roll-link'
import { ASK_EVENT } from '@/sections/projects'

const field = 'w-full rounded-2xl border border-glass-b bg-field px-4 py-3.5 text-fg shadow-[inset_0_2px_6px_rgb(6_78_59/0.08)] placeholder:text-muted/70'
const label = 'grid gap-1.5 font-display text-[0.98rem] font-medium text-head'

/**
 * Formulaire sans backend : il compose un e-mail prêt à envoyer dans la messagerie du visiteur.
 * Les cartes projets le préremplissent via l'événement ASK_EVENT.
 */
function ContactForm() {
  const [form, setForm] = useState({ nom: '', email: '', sujet: contact.subjects[0], message: '' })
  const [status, setStatus] = useState('')
  const set = (k: keyof typeof form) => (e: { target: { value: string } }) => setForm((f) => ({ ...f, [k]: e.target.value }))

  useEffect(() => {
    const on = (e: Event) => {
      const what = (e as CustomEvent<string>).detail
      setForm((f) => ({ ...f, sujet: 'Autre', message: `Bonjour, je souhaite en savoir plus sur ${what}.` }))
      setStatus('')
    }
    window.addEventListener(ASK_EVENT, on)
    return () => window.removeEventListener(ASK_EVENT, on)
  }, [])

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())
    if (!form.nom.trim() || !emailOk || !form.message.trim()) {
      setStatus('Remplissez votre nom, une adresse e-mail valide et votre message.')
      return
    }
    const body = `${form.message.trim()}\n\nDe la part de ${form.nom.trim()} (${form.email.trim()})`
    window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(form.sujet)}&body=${encodeURIComponent(body)}`
    setStatus('Votre messagerie s’ouvre avec le message prêt à envoyer.')
  }

  return (
    <form data-form onSubmit={submit} noValidate className="glass grid gap-4 rounded-[2rem] p-[clamp(1.3rem,3vw,2.2rem)]">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className={label}>Nom<input className={field} name="nom" autoComplete="name" required value={form.nom} onChange={set('nom')} /></label>
        <label className={label}>Adresse e-mail<input className={field} name="email" type="email" autoComplete="email" required value={form.email} onChange={set('email')} /></label>
      </div>
      <label className={label}>Sujet
        <select className={field} name="sujet" value={form.sujet} onChange={set('sujet')}>
          {contact.subjects.map((s) => <option key={s}>{s}</option>)}
        </select>
      </label>
      <label className={label}>Message<textarea className={`${field} min-h-36 resize-y`} name="message" required value={form.message} onChange={set('message')} /></label>
      <button type="submit" className="inline-flex items-center justify-center gap-2.5 justify-self-start rounded-full bg-gradient-to-br from-em2 to-[#059669] px-7 py-4 font-display text-lg font-semibold text-white shadow-[inset_0_1px_0_rgb(255_255_255/0.5),0_10px_26px_rgb(5_150_105/0.45)] transition-transform duration-200 hover:-translate-y-0.5">
        <Icon name="send" />Envoyer le message
      </button>
      <p role="status" className="min-h-[1.4em] text-[0.98rem]">{status}</p>
    </form>
  )
}

/** Épilogue : contact, puis la signature géante qui remonte dans le pied de page. */
export function ContactFooter() {
  const root = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    if (prefersReducedMotion()) return
    gsap.from('[data-ctitle] > span', { yPercent: 100, duration: 1.1, ease: 'expo.out', stagger: 0.05, scrollTrigger: { trigger: '[data-ctitle]', start: 'top 85%' } })
    gsap.from('[data-form]', { y: 60, opacity: 0, duration: 1.1, ease: 'expo.out', scrollTrigger: { trigger: '[data-form]', start: 'top 90%' } })
    gsap.fromTo('[data-sign]', { yPercent: 60 }, { yPercent: 0, ease: 'none', scrollTrigger: { trigger: '[data-footer]', start: 'top bottom', end: 'bottom bottom', scrub: true } })
  }, { scope: root })

  return (
    <div ref={root}>
      <section id="contact" data-chapter="Contact" aria-labelledby="contact-title" className="px-[clamp(1.2rem,4vw,4rem)] py-[clamp(5rem,11vw,8rem)]">
        <div className="grid items-start gap-[clamp(1.5rem,5vw,5rem)] md:grid-cols-[1fr_1.1fr]">
          <div>
            <h2 id="contact-title" data-ctitle className="mb-6 overflow-hidden pb-2 text-[clamp(2.4rem,6.5vw,5.5rem)] font-bold">
              {contact.title.split(' ').map((w, i) => <span key={i} className="mr-[0.25em] inline-block">{w}</span>)}
            </h2>
            <p className="max-w-[38em] text-[clamp(1.15rem,2vw,1.5rem)] leading-normal">{contact.text}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href={site.github} target="_blank" rel="noopener noreferrer" className="glass inline-flex items-center gap-2 rounded-full px-5 py-3 font-display font-medium text-head transition-transform hover:-translate-y-0.5">
                <Icon name="gh" />GitHub<span className="sr-only">(nouvel onglet)</span>
              </a>
              <a href={`mailto:${site.email}`} className="glass inline-flex items-center gap-2 rounded-full px-5 py-3 font-display font-medium text-head transition-transform hover:-translate-y-0.5">
                <Icon name="mail" />Écrire directement
              </a>
            </div>
          </div>
          <ContactForm />
        </div>
      </section>

      <footer data-footer className="aurora relative overflow-hidden pb-[calc(env(safe-area-inset-bottom,0px)+1.5rem)] pt-[clamp(4rem,9vw,7rem)] text-center">
        <div aria-hidden="true" className="pointer-events-none absolute -left-[8vw] -top-[10vw] size-[42vw] rounded-full bg-em2 opacity-60 blur-[60px]" />
        <div className="relative z-10">
          <Brand className="mx-auto mb-6" />
          <nav aria-label="Liens du pied de page" className="glass mx-auto mb-12 flex w-max max-w-[92vw] flex-wrap justify-center gap-1 rounded-full p-1.5 font-display font-medium text-head">
            <RollLink href="#haut" label="Accueil" className="rounded-full px-4 py-2 hover:bg-glass-b" />
            <RollLink href="#projets" label="Projets" className="rounded-full px-4 py-2 hover:bg-glass-b" />
            <RollLink href={site.github} target="_blank" rel="noopener noreferrer" label="GitHub" className="rounded-full px-4 py-2 hover:bg-glass-b" />
            <RollLink href="#contact" label="Contact" className="rounded-full px-4 py-2 hover:bg-glass-b" />
          </nav>
          <div className="overflow-hidden">
            <p data-sign aria-hidden="true" className="grad-text mb-6 whitespace-nowrap font-display text-[10vw] font-extrabold uppercase leading-none tracking-[-0.015em]">
              {site.firstName} {site.lastName}
            </p>
          </div>
          <small className="text-[0.95rem] text-head opacity-80">© {site.year} {site.firstName} {site.lastName}, {site.country}</small>
        </div>
      </footer>
    </div>
  )
}
