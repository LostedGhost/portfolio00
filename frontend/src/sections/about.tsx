import { useRef } from 'react'
import { gsap, useGSAP, prefersReducedMotion } from '@/lib/motion'
import { about, site } from '@/config/portfolio'
import { Icon } from '@/components/icon'
import { ScrollTextReveal } from '@/components/scroll-text-reveal'

/** Illustration affichée tant qu'aucune photo n'est renseignée dans la config. */
function PortraitPlaceholder() {
  return (
    <svg viewBox="0 0 200 250" className="block size-full" role="img" aria-label={`Emplacement de la photo de ${site.firstName}`}>
      <circle cx="160" cy="46" r="28" fill="#34d399" opacity=".5" />
      <circle cx="100" cy="98" r="42" fill="#fff" opacity=".85" />
      <path d="M20 250c4-60 38-95 80-95s76 35 80 95z" fill="#fff" opacity=".85" />
    </svg>
  )
}

function Laptop() {
  return (
    <svg viewBox="0 0 360 260" className="block h-auto w-full" aria-hidden="true">
      <defs><linearGradient id="lg-em" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#6ee7b7" /><stop offset="1" stopColor="#10b981" /></linearGradient></defs>
      <circle cx="292" cy="62" r="46" fill="url(#lg-em)" opacity=".55" />
      <rect x="60" y="40" width="240" height="150" rx="14" fill="#064e3b" />
      <rect x="72" y="52" width="216" height="126" rx="8" fill="#022c22" />
      <g strokeLinecap="round" strokeWidth="6" fill="none">
        <path data-code d="M90 78h50" stroke="#34d399" /><path data-code d="M104 96h90" stroke="#a7f3d0" />
        <path data-code d="M104 114h64" stroke="#6ee7b7" /><path data-code d="M90 132h40" stroke="#34d399" />
        <path data-code d="M104 150h100" stroke="#a7f3d0" />
      </g>
      <path d="M30 200h300l-18 24H48z" fill="#059669" />
      <rect x="22" y="146" width="54" height="54" rx="16" fill="url(#lg-em)" transform="rotate(-12 49 173)" />
      <path d="M300 150c20-24 44-18 52 4-22 8-40 6-52-4z" fill="#34d399" />
    </svg>
  )
}

/** Chapitre 2 : présentation, faits marquants, portrait et compétences. */
export function About() {
  const root = useRef<HTMLElement>(null)

  useGSAP(() => {
    if (prefersReducedMotion()) return
    gsap.from('[data-title] > span', { yPercent: 100, duration: 1.1, ease: 'expo.out', stagger: 0.06, scrollTrigger: { trigger: '[data-title]', start: 'top 85%' } })
    gsap.from('[data-fact]', { x: -40, opacity: 0, duration: 0.9, ease: 'expo.out', stagger: 0.1, scrollTrigger: { trigger: '[data-facts]', start: 'top 85%' } })
    gsap.from('[data-portrait]', { y: 80, rotate: 3, opacity: 0, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: '[data-portrait]', start: 'top 90%' } })
    gsap.fromTo('[data-mini]', { yPercent: 30 }, { yPercent: -20, ease: 'none', scrollTrigger: { trigger: '[data-portrait]', start: 'top bottom', end: 'bottom top', scrub: true } })
    gsap.from('[data-code]', { scaleX: 0, transformOrigin: 'left center', duration: 1, ease: 'power2.out', stagger: 0.12, scrollTrigger: { trigger: '[data-mini]', start: 'top 85%' } })
    gsap.from('[data-skill]', { y: 50, opacity: 0, scale: 0.94, duration: 0.9, ease: 'expo.out', stagger: 0.07, scrollTrigger: { trigger: '[data-skills]', start: 'top 88%' } })
  }, { scope: root })

  return (
    <section ref={root} id="apropos" data-chapter="À propos" aria-labelledby="about-title" className="px-[clamp(1.2rem,4vw,4rem)] py-[clamp(5rem,11vw,8rem)]">
      <div className="grid items-center gap-[clamp(1.5rem,5vw,5rem)] md:grid-cols-[1.1fr_0.9fr]">
        <div>
          <h2 id="about-title" data-title className="mb-6 overflow-hidden pb-2 text-[clamp(2.4rem,6.5vw,5.5rem)] font-bold">
            {about.title.split(' ').map((w, i) => <span key={i} className="mr-[0.25em] inline-block">{w}</span>)}
          </h2>
          <ScrollTextReveal text={about.intro} className="max-w-[38em] text-[clamp(1.15rem,2vw,1.5rem)] leading-normal" />
          <div data-facts className="mt-8 grid gap-4">
            {about.facts.map((f) => (
              <div key={f.title} data-fact className="glass flex items-start gap-4 rounded-[1.4rem] px-5 py-4">
                <Icon name={f.icon} className="mt-0.5 size-7 text-em" />
                <div>
                  <h3 className="mb-1 text-xl font-semibold">{f.title}</h3>
                  <p className="text-base leading-snug">{f.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div data-portrait className="glass relative aspect-[4/5] w-full max-w-[26rem] justify-self-center rounded-[2.2rem] p-2.5">
          <div className="size-full overflow-hidden rounded-[1.7rem] bg-gradient-to-br from-[#d1fae5] to-[#6ee7b7]">
            {site.photo
              ? <img src={site.photo} alt={`${site.firstName} ${site.lastName}`} className="size-full object-cover" />
              : <PortraitPlaceholder />}
          </div>
          <div data-mini className="glass absolute bottom-2.5 left-2.5 w-[44%] rounded-3xl p-2 md:-bottom-6 md:-left-6 md:w-[52%]">
            <Laptop />
          </div>
        </div>
      </div>

      <div data-skills className="mt-[clamp(2.5rem,5vw,4rem)] grid grid-cols-2 gap-4 lg:grid-cols-3">
        {about.skills.map((s) => (
          <div key={s.title} data-skill className="glass rounded-[1.4rem] p-5 transition-transform duration-300 hover:-translate-y-1">
            <Icon name={s.icon} className="mb-2.5 size-8 text-em" />
            <h3 className="mb-1 text-lg font-semibold">{s.title}</h3>
            <p className="text-[0.98rem] leading-snug">{s.text}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
