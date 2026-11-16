import { useRef } from 'react'
import { gsap, useGSAP, prefersReducedMotion } from '@/lib/motion'
import { site } from '@/config/portfolio'
import { SplitLetters } from '@/components/split-letters'

/** Prologue : compteur 000 → 100, barre émeraude, nom qui monte, rideau qui se lève. */
export function Preloader({ onDone }: { onDone: () => void }) {
  const root = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    if (prefersReducedMotion() || !root.current) { onDone(); return }
    const counter = { v: 0 }
    const num = root.current.querySelector<HTMLElement>('[data-count]')!
    const tl = gsap.timeline({ onComplete: onDone })
    tl.from('[data-letter]', { yPercent: 110, duration: 0.9, ease: 'expo.out', stagger: 0.035 })
      .to(counter, { v: 100, duration: 1.5, ease: 'power2.inOut', onUpdate: () => { num.textContent = String(Math.round(counter.v)).padStart(3, '0') } }, 0)
      .fromTo('[data-bar]', { scaleX: 0 }, { scaleX: 1, duration: 1.5, ease: 'power2.inOut' }, 0)
      .to('[data-letter]', { yPercent: -110, duration: 0.6, ease: 'expo.in', stagger: 0.02 }, '+=0.1')
      .to(root.current, { yPercent: -100, duration: 0.9, ease: 'expo.inOut' }, '-=0.2')
  }, { scope: root })

  return (
    <div ref={root} className="aurora fixed inset-0 z-[100] flex flex-col items-center justify-center" aria-hidden="true">
      <p className="whitespace-nowrap font-display text-[clamp(2.4rem,9vw,8rem)] font-extrabold uppercase leading-none tracking-tight">
        <SplitLetters text={`${site.firstName} ${site.lastName}`} letterClass="grad-text" />
      </p>
      <div className="absolute inset-x-6 bottom-10 flex items-end justify-between gap-6 md:inset-x-16">
        <span className="font-display text-xs uppercase tracking-[0.25em] text-muted">Portfolio · {site.country}</span>
        <span data-count className="font-display text-5xl font-light tabular-nums text-head md:text-7xl">000</span>
      </div>
      <div data-bar className="absolute bottom-0 left-0 h-1.5 w-full origin-left bg-gradient-to-r from-em2 to-em" />
    </div>
  )
}
