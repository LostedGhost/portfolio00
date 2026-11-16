import { useRef } from 'react'
import { gsap, useGSAP, onAnchorClick, prefersReducedMotion } from '@/lib/motion'
import { site } from '@/config/portfolio'
import { RollLink } from '@/components/roll-link'

const links = [
  { href: '#apropos', label: 'À propos' },
  { href: '#projets', label: 'Projets' },
  { href: '#methode', label: 'Méthode' },
  { href: '#contact', label: 'Contact' },
]

/** Pilule de navigation en verre : apparaît une fois le hero franchi. */
export function Nav() {
  const ref = useRef<HTMLElement>(null)

  useGSAP(() => {
    const el = ref.current
    // Élément passé directement : dans un useGSAP « scopé », un sélecteur texte serait cherché DANS la nav.
    const about = document.getElementById('apropos')
    if (!el || !about) return
    if (prefersReducedMotion()) { gsap.set(el, { autoAlpha: 1 }); return }
    gsap.set(el, { autoAlpha: 0, yPercent: -140 })
    gsap.to(el, {
      autoAlpha: 1, yPercent: 0, duration: 0.6, ease: 'expo.out',
      // refreshPriority négatif : calculé après l'épinglage du hero (créé plus bas dans l'arbre)
      scrollTrigger: { trigger: about, start: 'top 85%', toggleActions: 'play none none reverse', refreshPriority: -1 },
    })
  }, { scope: ref })

  return (
    <nav
      ref={ref}
      aria-label="Navigation principale"
      className="glass invisible fixed left-1/2 top-[calc(env(safe-area-inset-top,0px)+0.8rem)] z-50 flex max-w-[calc(100vw-1.5rem)] -translate-x-1/2 items-center gap-1 rounded-full px-2 py-1.5 font-display text-[0.95rem] font-medium text-head"
    >
      <a href="#haut" onClick={onAnchorClick} aria-label="Retour en haut" className="grid size-10 shrink-0 place-items-center rounded-full bg-gradient-to-br from-em2 to-em font-bold text-white">
        {site.initials}
      </a>
      <ul className="flex items-center">
        {links.map((l, i) => (
          <li key={l.href} className={i === 2 ? 'hidden sm:block' : undefined}>
            <RollLink href={l.href} label={l.label} className="rounded-full px-2.5 py-2 hover:bg-glass-b sm:px-4" />
          </li>
        ))}
      </ul>
    </nav>
  )
}
