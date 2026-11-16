import { useRef } from 'react'
import { gsap, useGSAP, prefersReducedMotion } from '@/lib/motion'
import { cn } from '@/lib/utils'

type Props = {
  /** Texte ; les passages entre *astérisques* sont mis en valeur. */
  text: string
  className?: string
}

/** Découpe en mots en repérant les passages *mis en valeur* (même sur plusieurs mots). */
function parse(text: string) {
  let on = false
  return text.split(/\s+/).filter(Boolean).map((raw) => {
    let w = raw
    let em = on
    if (w.startsWith('*')) { em = true; on = true; w = w.slice(1) }
    if (w.endsWith('*')) { on = false; w = w.slice(0, -1) }
    return { w, em }
  }).filter((x) => x.w)
}

/** Paragraphe qui sort du flou mot à mot, au rythme du défilement (scrub). */
export function ScrollTextReveal({ text, className }: Props) {
  const ref = useRef<HTMLParagraphElement>(null)
  const words = parse(text)

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
      <span className="sr-only">{text.replaceAll('*', '')}</span>
      {words.map(({ w, em }, i) => (
        <span key={i} aria-hidden="true">
          <span data-unit className={cn('inline-block will-change-[filter,opacity]', em && 'em-mark')}>{w}</span>
          {i < words.length - 1 && ' '}
        </span>
      ))}
    </p>
  )
}
