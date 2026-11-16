import { useRef } from 'react'
import { gsap, useGSAP, prefersReducedMotion } from '@/lib/motion'
import { cn } from '@/lib/utils'

type Props = {
  text: string
  className?: string
  /** Indices des mots mis en valeur (surlignage émeraude). */
  emphasis?: number[]
}

/** Paragraphe qui sort du flou mot à mot, au rythme du défilement (scrub). */
export function ScrollTextReveal({ text, className, emphasis = [] }: Props) {
  const ref = useRef<HTMLParagraphElement>(null)
  const words = text.split(/\s+/)

  useGSAP(() => {
    const el = ref.current
    if (!el || prefersReducedMotion()) return
    const units = el.querySelectorAll<HTMLElement>('[data-unit]')
    gsap.fromTo(units,
      { opacity: 0.15, filter: 'blur(8px)', y: 6 },
      { opacity: 1, filter: 'blur(0px)', y: 0, ease: 'none', stagger: 0.5,
        scrollTrigger: { trigger: el, start: 'top 82%', end: 'bottom 50%', scrub: true } })
  }, { scope: ref, dependencies: [text] })

  return (
    <p ref={ref} className={className}>
      <span className="sr-only">{text}</span>
      {words.map((w, i) => (
        <span key={i} aria-hidden="true">
          <span data-unit className={cn('inline-block will-change-[filter,opacity]', emphasis.includes(i) && 'em-mark')}>{w}</span>
          {i < words.length - 1 && ' '}
        </span>
      ))}
    </p>
  )
}
