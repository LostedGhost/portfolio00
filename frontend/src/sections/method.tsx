import { useRef } from 'react'
import { gsap, useGSAP, prefersReducedMotion } from '@/lib/motion'
import { method } from '@/config/portfolio'

/** Chapitre 4 : la méthode spec-first, une ligne lumineuse qui se remplit au défilement. */
export function Method() {
  const root = useRef<HTMLElement>(null)

  useGSAP(() => {
    if (prefersReducedMotion()) return
    gsap.fromTo('[data-line]', { scaleY: 0 }, { scaleY: 1, ease: 'none', scrollTrigger: { trigger: '[data-steps]', start: 'top 70%', end: 'bottom 60%', scrub: true } })
    gsap.utils.toArray<HTMLElement>('[data-step]').forEach((s) => {
      gsap.from(s, { y: 60, opacity: 0, scale: 0.95, duration: 0.9, ease: 'expo.out', scrollTrigger: { trigger: s, start: 'top 85%' } })
    })
    gsap.from('[data-mtitle]', { y: 60, opacity: 0, duration: 1.1, ease: 'expo.out', scrollTrigger: { trigger: '[data-mtitle]', start: 'top 85%' } })
  }, { scope: root })

  return (
    <section ref={root} id="methode" data-chapter="Méthode" aria-labelledby="method-title" className="bg-gradient-to-b from-[#022c22] to-[#064e3b] px-[clamp(1.2rem,4vw,4rem)] py-[clamp(5rem,11vw,8rem)] text-[#d1fae5]">
      <h2 id="method-title" data-mtitle className="mx-auto max-w-[14ch] text-center text-[clamp(2.3rem,6.5vw,5.5rem)] font-bold text-[#ecfdf5]">{method.title}</h2>
      <p className="mx-auto mt-6 max-w-[44ch] text-center opacity-85">{method.lead}</p>

      <ol data-steps className="relative mx-auto mt-[clamp(3.5rem,7vw,5rem)] grid max-w-xl gap-10">
        <span aria-hidden="true" className="absolute inset-y-0 left-1/2 -ml-px w-[3px] bg-[#d1fae5]/20" />
        <span data-line aria-hidden="true" className="absolute inset-y-0 left-1/2 -ml-px w-[3px] origin-top bg-em2 shadow-[0_0_14px_var(--color-em2)]" />
        {method.steps.map((s, i) => (
          <li key={s.title} data-step className="relative rounded-[1.6rem] border border-[#d1fae5]/20 bg-[#064e3b]/60 px-6 pb-7 pt-10 text-center backdrop-blur-md">
            <span aria-hidden="true" className="absolute left-1/2 top-0 grid size-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-em2 font-display font-bold text-deep">{i + 1}</span>
            <h3 className="text-[clamp(1.3rem,3vw,2rem)] font-semibold text-[#ecfdf5]"><span className="sr-only">Étape {i + 1} : </span>{s.title}</h3>
            <p className="mx-auto mt-2 max-w-[48ch] opacity-80">{s.text}</p>
          </li>
        ))}
      </ol>
    </section>
  )
}
