import { useRef } from 'react'
import { gsap, useGSAP, useReducedMotion } from '@/lib/motion'
import { site } from '@/config/portfolio'
import { Brand } from '@/components/brand'
import { Icon, type IconName } from '@/components/icon'
import { SplitLetters } from '@/components/split-letters'
import { cn } from '@/lib/utils'

const chips: { icon: IconName; pos: string }[] = [
  { icon: 'code', pos: 'left-[8%] top-[30%]' },
  { icon: 'db', pos: 'left-[20%] bottom-[20%]' },
  { icon: 'spark', pos: 'left-[42%] top-[24%]' },
  { icon: 'palette', pos: 'right-[9%] top-[28%]' },
  { icon: 'api', pos: 'right-[21%] bottom-[19%]' },
  { icon: 'chart', pos: 'right-[40%] bottom-[12%]' },
]
const SPARKS = 44
const rnd = (a: number, b: number) => a + Math.random() * (b - a)

/**
 * Chapitre 1 : le nom en très grand, puis au défilement il explose
 * (lettres projetées, éclair, onde, étincelles) avant de libérer la page.
 */
export function Hero({ ready }: { ready: boolean }) {
  const root = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()

  // Entrée, une fois le préchargeur terminé
  useGSAP(() => {
    if (!ready || reduced) return
    gsap.from('[data-letter]', { yPercent: 120, duration: 1.1, ease: 'expo.out', stagger: 0.035 })
    gsap.from('[data-fade]', { opacity: 0, y: 16, duration: 1, ease: 'expo.out', delay: 0.35, stagger: 0.07 })
  }, { scope: root, dependencies: [ready, reduced] })

  // Explosion au défilement (section épinglée, scrub)
  useGSAP(() => {
    const el = root.current
    if (!el || reduced) return
    const W = innerWidth, H = innerHeight
    const letters = gsap.utils.toArray<HTMLElement>('[data-letter]', el)
    const mid = (letters.length - 1) / 2
    const tl = gsap.timeline({
      scrollTrigger: { trigger: el, start: 'top top', end: '+=140%', pin: true, scrub: 1, anticipatePin: 1 },
    })
    tl.to('[data-ui]', { opacity: 0, y: -30, duration: 0.25 }, 0)
      .to('[data-flash]', { opacity: 0.85, duration: 0.12, ease: 'power2.out' }, 0.12)
      .to('[data-flash]', { opacity: 0, duration: 0.5 }, 0.24)
      .fromTo('[data-ring]', { scale: 0.2, opacity: 0.95 }, { scale: 5, opacity: 0, duration: 0.9, ease: 'power2.out' }, 0.12)
      .to('[data-blob]', { scale: 1.6, duration: 1, ease: 'none' }, 0)
    letters.forEach((l, i) => {
      const dir = (i - mid) / mid
      tl.to(l, {
        x: dir * W * 0.6 + rnd(-120, 120), y: rnd(-0.5, 0.5) * H, rotation: rnd(-260, 260), scale: rnd(1.6, 3.8),
        filter: `blur(${Math.round(rnd(6, 16))}px)`, opacity: 0, duration: 0.9, ease: 'power2.in',
      }, 0.14 + rnd(0, 0.08))
    })
    gsap.utils.toArray<HTMLElement>('[data-chip]', el).forEach((c) => {
      tl.to(c, { x: rnd(-0.6, 0.6) * W, y: rnd(-0.6, 0.6) * H, rotation: rnd(-200, 200), scale: rnd(0.3, 1.8), opacity: 0, duration: 0.9, ease: 'power2.in' }, 0.1)
    })
    gsap.utils.toArray<HTMLElement>('[data-spark]', el).forEach((s) => {
      const a = rnd(0, Math.PI * 2), d = rnd(0.2, 0.65) * Math.max(W, H)
      tl.fromTo(s, { x: 0, y: 0, scale: 0, opacity: 1 },
        { x: Math.cos(a) * d, y: Math.sin(a) * d * 0.7, scale: rnd(0.6, 2.4), opacity: 0, duration: rnd(0.5, 0.9), ease: 'power3.out' }, 0.12 + rnd(0, 0.15))
    })
  }, { scope: root, dependencies: [reduced] })

  const name = `${site.firstName} ${site.lastName}`.toUpperCase()

  return (
    <header ref={root} id="haut" data-chapter="Accueil" className="aurora relative grid h-svh place-items-center overflow-hidden">
      <div data-blob aria-hidden="true" className="pointer-events-none absolute -left-[8vw] -top-[10vw] size-[42vw] rounded-full bg-em2 opacity-70 blur-[60px]" />
      <div data-blob aria-hidden="true" className="pointer-events-none absolute -bottom-[10vw] -right-[6vw] size-[36vw] rounded-full bg-white opacity-50 blur-[60px] dark:opacity-10" />

      <div data-ui data-fade className="absolute left-1/2 top-[calc(env(safe-area-inset-top,0px)+1.2rem)] z-10 -translate-x-1/2">
        <Brand />
      </div>
      <p data-ui data-fade className="glass absolute left-1/2 top-[calc(env(safe-area-inset-top,0px)+6.6rem)] z-10 w-max max-w-[90vw] -translate-x-1/2 rounded-full px-5 py-2.5 text-center text-base text-head">
        {site.role}
      </p>

      {chips.map((c) => (
        <div key={c.icon} data-chip data-fade aria-hidden="true" className={cn('glass absolute z-[5] grid size-[3.2rem] place-items-center rounded-2xl text-em md:size-[4.2rem] md:rounded-[1.3rem]', c.pos)}>
          <Icon name={c.icon} className="size-6 md:size-[1.9rem]" />
        </div>
      ))}

      <div data-flash aria-hidden="true" className="pointer-events-none absolute inset-0 z-[5] bg-[radial-gradient(circle_at_50%_50%,#fff,transparent_55%)] opacity-0" />
      <div data-ring aria-hidden="true" className="absolute left-1/2 top-1/2 z-[5] -m-[15vmin] size-[30vmin] rounded-full border-[3px] border-em opacity-0 shadow-[0_0_50px_var(--color-em2),inset_0_0_50px_var(--color-em2)]" />
      <div aria-hidden="true" className="absolute left-1/2 top-1/2 z-20 size-0">
        {!reduced && Array.from({ length: SPARKS }, (_, i) => (
          <span key={i} data-spark className="absolute -left-1.5 -top-1.5 size-3 rounded-full bg-[radial-gradient(circle,#fff,var(--color-em2))] opacity-0 shadow-[0_0_18px_5px_rgb(16_185_129/0.7)]" />
        ))}
      </div>

      <h1 className="relative z-10 w-full whitespace-nowrap text-center font-display text-[10vw] font-extrabold leading-none tracking-[-0.015em]" aria-label={`${site.firstName} ${site.lastName}`}>
        <span aria-hidden="true">
          <SplitLetters text={name} mask={false} letterClass="grad-text" />
        </span>
      </h1>

      <p data-ui data-fade aria-hidden="true" className="glass absolute bottom-[calc(env(safe-area-inset-bottom,0px)+1.6rem)] left-1/2 z-10 -translate-x-1/2 rounded-full px-5 py-2 text-[0.95rem] text-head">
        Faites défiler
      </p>
    </header>
  )
}
